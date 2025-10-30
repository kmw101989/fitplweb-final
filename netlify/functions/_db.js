// netlify/functions/db.js
const BRIDGE_URL = process.env.BRIDGE_URL;
const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN;

function json(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  try {
    if (!BRIDGE_URL || !BRIDGE_TOKEN) {
      return json(500, { ok: false, error: "Missing BRIDGE_URL/BRIDGE_TOKEN" });
    }

    const u = new URL(event.rawUrl);
    const op = u.searchParams.get("op") || "ping";

    // op → 브리지 path 매핑
    const map = {
      ping: "/ping",
      time: "/time",
      guest_reco_climate: "/guest_reco_climate",
      guest_reco_activity: "/guest_reco_activity",

      // 필요 시 다음 라인들 활성화 (브리지에 라우트 구현되어 있어야 함)
      guest_reco_climate: "/guest_reco_climate",
      guest_reco_activity: "/guest_reco_activity",
      country_climate_top: "/country_climate_top",
      country_activity_top: "/country_activity_top",
      country_photo_top: "/country_photo_top",
    };

    const basePath = map[op];
    if (!basePath) return json(400, { ok: false, error: "bad op" });

    // 쿼리스트링 그대로 브리지로 전달
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
