// netlify/functions/db.js
// CommonJS version (Node 20 default)

const BRIDGE_URL = process.env.BRIDGE_URL;
const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN;

function json(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  };
}

// ── 로컬 처리기
async function handleLocally(op) {
  if (op === "ping") return json(200, { ok: true, msg: "local ping" });
  if (op === "time")
    return json(200, { ok: true, time: new Date().toISOString() });
  return json(501, { ok: false, error: `op '${op}' not implemented locally` });
}

// ── (선택) 프록시 호출
async function fetchBridge(pathWithQuery, method = "GET", payload = null) {
  if (!BRIDGE_URL || !BRIDGE_TOKEN) throw new Error("BRIDGE_NOT_CONFIGURED");

  // pathWithQuery가 /로 시작하지 않으면 추가
  const normalizedPath = pathWithQuery.startsWith("/")
    ? pathWithQuery
    : `/${pathWithQuery}`;
  const url = `${BRIDGE_URL}${normalizedPath}`;

  const headers = { Authorization: `Bearer ${BRIDGE_TOKEN}` };
  if (payload) headers["Content-Type"] = "application/json";

  console.log(
    `[fetchBridge] 호출: method=${method}, url=${url}, hasPayload=${!!payload}`
  );

  const r = await fetch(url, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
    signal: AbortSignal.timeout(30000),
  });

  if (!r.ok) {
    const errorText = await r.text().catch(() => "");
    console.error(
      `[fetchBridge] 실패: status=${r.status}, url=${url}, error=${errorText}`
    );
    throw new Error(`Bridge server error: ${r.status} - ${errorText}`);
  }

  return r.json();
}

exports.handler = async (event) => {
  try {
    const u = new URL(event.rawUrl);
    const op = u.searchParams.get("op") || "ping";

    // 로컬 처리 (bridge 없을 때)
    if (!BRIDGE_URL || !BRIDGE_TOKEN) {
      return await handleLocally(op);
    }

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

    // op를 실제 bridge 서버 경로로 매핑
    const map = {
      ping: "/ping",
      time: "/time",
      guest_reco_climate: "/guest_reco_climate",
      guest_reco_activity: "/guest_reco_activity",
      user_country_climate_top: "/user_country_climate_top",
      user_country_activity_top: "/user_country_activity_top",
      user_country_photo_top: "/user_country_photo_top",
    };

    const basePath = map[op];
    if (!basePath) {
      return json(400, { ok: false, error: `Unknown op: ${op}` });
    }

    // 쿼리 파라미터 전달
    const qs = new URLSearchParams();
    for (const k of [
      "user_id",
      "region_id",
      "month",
      "activity_tag",
      "limit",
      "offset",
      "order",
      "main_category",
      "gender_en",
      "min_discount",
    ]) {
      const v = u.searchParams.get(k);
      if (v) qs.set(k, v);
    }

    const queryString = qs.toString();
    const url = queryString ? `${basePath}?${queryString}` : basePath;

    try {
      console.log(`[db.js] 호출: op=${op}, url=${url}`);
      const data = await fetchBridge(url);
      console.log(`[db.js] 응답 상세:`, {
        op,
        ok: data?.ok,
        count: data?.count,
        rowsLength: data?.rows?.length || 0,
        hasRows: !!data?.rows,
        error: data?.error,
      });
      return json(200, data);
    } catch (fetchErr) {
      console.error("Fetch error:", {
        url,
        error: fetchErr.message,
        name: fetchErr.name,
      });

      if (fetchErr.message.includes("BRIDGE_NOT_CONFIGURED")) {
        return json(503, {
          ok: false,
          error: "Bridge server not configured",
          details: "Check BRIDGE_URL and BRIDGE_TOKEN environment variables",
        });
      }

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
