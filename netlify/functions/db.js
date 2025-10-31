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
  const r = await fetch(url, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });
  return r.json();
}

export const handler = async (event) => {
  try {
    if (!BRIDGE_URL || !BRIDGE_TOKEN) {
      return json(500, { ok: false, error: "Missing BRIDGE_URL/BRIDGE_TOKEN" });
    }

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

    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${BRIDGE_TOKEN}` },
    });

    const data = await r.json().catch(() => ({}));
    return json(r.ok ? 200 : 502, data);
  } catch (err) {
    return json(500, { ok: false, error: String(err?.message || err) });
  }
};
