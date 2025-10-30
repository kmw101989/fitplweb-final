export const handler = async (event) => {
  try {
    const url = new URL(event.rawUrl);
    const op = url.searchParams.get("op") || "ping";
    const userId = url.searchParams.get("user_id") || "";
    const bridge = process.env.BRIDGE_URL;
    const token  = process.env.BRIDGE_TOKEN;
    if (!bridge || !token) return json(500, { ok:false, error:"Missing BRIDGE_URL/BRIDGE_TOKEN" });

    const allow = new Set(["ping","time","products_sample","user_top"]);
    if (!allow.has(op)) return json(400, { ok:false, error:"Unsupported op" });

    const target = op === "user_top"
      ? `${bridge}/user_top?user_id=${encodeURIComponent(userId)}`
      : `${bridge}/${op}`;

    const r = await fetch(target, { headers: { Authorization: `Bearer ${token}` }});
    const data = await r.json();
    return json(r.ok ? 200 : 500, data);
  } catch (err) {
    return json(500, { ok:false, error: err.message });
  }
};
function json(statusCode, body){ return { statusCode, headers:{ "Content-Type":"application/json; charset=utf-8" }, body: JSON.stringify(body) }; }
