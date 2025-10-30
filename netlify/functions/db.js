// ESM 버전 (package.json 에 "type": "module" 인 경우 사용)
const BRIDGE_URL = process.env.BRIDGE_URL;
const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN;

const json = (status, body) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  try {
    if (!BRIDGE_URL || !BRIDGE_TOKEN) {
      return json(500, { ok: false, error: "Missing BRIDGE_URL/BRIDGE_TOKEN" });
    }

    const u = new URL(event.rawUrl);
    const op = u.searchParams.get("op") || "ping";

    const map = {
      ping: "/ping",
      time: "/time",
      guest_reco_climate: "/guest_reco_climate",
      guest_reco_activity: "/guest_reco_activity",
      country_climate_top: "/country_climate_top",
      country_activity_top: "/country_activity_top",
      country_photo_top: "/country_photo_top",
    };

    const basePath = map[op];
    if (!basePath) return json(400, { ok: false, error: "bad op" });

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
