// ESM 버전 (package.json 에 "type": "module" 인 경우 사용)
const BRIDGE_URL = process.env.BRIDGE_URL;
const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN;

const json = (status, body) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

// 도우미: 브리지 호출
async function fetchBridge(pathWithQuery, method = "GET", payload = null) {
  const url = `${BRIDGE_URL}${pathWithQuery}`;
  const headers = { Authorization: `Bearer ${BRIDGE_TOKEN}` };
  if (payload) headers["Content-Type"] = "application/json";

  try {
    const r = await fetch(url, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
      // 타임아웃 설정 (30초)
      signal: AbortSignal.timeout(30000),
    });

    if (!r.ok) {
      const errorText = await r.text().catch(() => "");
      console.error(`Bridge error: ${r.status} ${r.statusText}`, errorText);
      throw new Error(`Bridge server error: ${r.status} - ${errorText}`);
    }

    return r.json();
  } catch (err) {
    console.error("fetchBridge error:", {
      url,
      method,
      error: err.message,
      name: err.name,
    });

    // 타임아웃 또는 네트워크 에러
    if (err.name === "AbortError" || err.name === "TypeError") {
      throw new Error(
        `Cannot reach bridge server at ${BRIDGE_URL}. Check if server is running and accessible.`
      );
    }

    throw err;
  }
}

export const handler = async (event) => {
  try {
    // 환경 변수 확인 및 로깅 (민감한 정보 제외)
    if (!BRIDGE_URL || !BRIDGE_TOKEN) {
      console.error("Missing environment variables:", {
        hasBridgeUrl: !!BRIDGE_URL,
        hasBridgeToken: !!BRIDGE_TOKEN,
      });
      return json(500, { ok: false, error: "Missing BRIDGE_URL/BRIDGE_TOKEN" });
    }

    // 디버깅을 위한 로그 (프로덕션에서는 제거 가능)
    console.log("Function called:", {
      op: event.queryStringParameters?.op,
      hasBridgeUrl: !!BRIDGE_URL,
      bridgeUrlHost: BRIDGE_URL ? new URL(BRIDGE_URL).hostname : null,
    });

    const u = new URL(event.rawUrl);
    const op = u.searchParams.get("op") || "ping";

    // [랭킹] product_ranking 조회
    if (op === "product_ranking") {
      const qs = new URLSearchParams();
      for (const k of [
        "limit",
        "offset",
        "order",
        "main_category",
        "gender_en",
      ]) {
        const v = u.searchParams.get(k);
        if (v) qs.set(k, v);
      }
      const data = await fetchBridge(`/product_ranking?${qs.toString()}`);
      return json(200, data);
    }

    // [세일] 할인순
    if (op === "product_sale") {
      const qs = new URLSearchParams();
      for (const k of [
        "limit",
        "offset",
        "min_discount",
        "main_category",
        "gender_en",
      ]) {
        const v = u.searchParams.get(k);
        if (v) qs.set(k, v);
      }
      const data = await fetchBridge(`/product_sale?${qs.toString()}`);
      return json(200, data);
    }

    // [사용자 등록] POST 요청 처리
    if (op === "user_register") {
      if (event.httpMethod !== "POST") {
        return json(405, { ok: false, error: "Method not allowed" });
      }
      let payload;
      try {
        payload = JSON.parse(event.body || "{}");
      } catch (e) {
        return json(400, { ok: false, error: "Invalid JSON" });
      }
      const data = await fetchBridge("/user_register", "POST", payload);
      return json(data.ok ? 200 : 500, data);
    }

    // 간단한 map 기반 라우팅
    const map = {
      ping: "/ping",
      time: "/time",
      guest_reco_climate: "/guest_reco_climate",
      guest_reco_activity: "/guest_reco_activity",

      // 유저 뷰 3종 (user_id 필수)
      user_country_climate_top: "/user_country_climate_top",
      user_country_activity_top: "/user_country_activity_top",
      user_country_photo_top: "/user_country_photo_top",
    };

    const basePath = map[op];
    if (!basePath) {
      return json(400, { ok: false, error: "bad op" });
    }

    const qs = u.search || "";
    const url = `${BRIDGE_URL}${basePath}${qs}`;

    try {
      const r = await fetch(url, {
        headers: { Authorization: `Bearer ${BRIDGE_TOKEN}` },
        signal: AbortSignal.timeout(30000), // 30초 타임아웃
      });

      if (!r.ok) {
        const errorText = await r.text().catch(() => "");
        console.error(`Bridge fetch error: ${r.status}`, errorText);
        return json(502, {
          ok: false,
          error: `Bridge server returned ${r.status}: ${errorText}`,
          details: "Check if bridge server is running and accessible",
        });
      }

      const data = await r.json().catch(() => ({}));
      return json(200, data);
    } catch (fetchErr) {
      console.error("Fetch error:", {
        url,
        error: fetchErr.message,
        name: fetchErr.name,
      });

      // 타임아웃 또는 네트워크 에러
      if (fetchErr.name === "AbortError" || fetchErr.name === "TypeError") {
        return json(503, {
          ok: false,
          error: `Cannot reach bridge server: ${fetchErr.message}`,
          details: `Check if ${BRIDGE_URL} is accessible and running`,
        });
      }

      throw fetchErr;
    }
  } catch (err) {
    console.error("Handler error:", {
      error: err.message,
      stack: err.stack,
    });
    return json(500, {
      ok: false,
      error: String(err?.message || err),
      details: "Internal function error",
    });
  }
};
