// netlify/functions/db.js  (CommonJS, Bridge 프록시 / 고정 경로 버전)
// BRIDGE_URL: https://<trycloudflare>.trycloudflare.com  (끝에 / 금지)
// BRIDGE_TOKEN: same as bridge .env

function json(status, body, headers = {}) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  try {
    const u = new URL(event.rawUrl);
    const params = u.searchParams;
    const op = params.get("op");
    const method = event.httpMethod || "GET";

    const BRIDGE_URL = process.env.BRIDGE_URL;
    const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN;

    if (!BRIDGE_URL || !BRIDGE_TOKEN) {
      return json(500, {
        ok: false,
        error: "Server misconfigured: BRIDGE_URL / BRIDGE_TOKEN missing",
      });
    }
    if (!op)
      return json(400, { ok: false, error: "Missing required param: op" });

    // 쿼리스트링 그대로 + token 추가(브리지에서 query로 읽을 수도 있음)
    const qs = new URLSearchParams();
    for (const [k, v] of params.entries()) {
      if (v !== undefined && v !== null && v !== "") qs.set(k, v);
    }
    qs.set("token", BRIDGE_TOKEN);

    const baseUrl = `${BRIDGE_URL.replace(/\/+$/, "")}/db`;
    const target = `${baseUrl}?${qs.toString()}`;

    const headers = {
      "x-bridge-token": BRIDGE_TOKEN,
      authorization: `Bearer ${BRIDGE_TOKEN}`,
    };

    if (event.headers?.["content-type"]) {
      headers["Content-Type"] = event.headers["content-type"];
    } else if (event.headers?.["Content-Type"]) {
      headers["Content-Type"] = event.headers["Content-Type"];
    }

    const fetchOptions = {
      method,
      headers,
    };

    if (method !== "GET" && event.body) {
      fetchOptions.body = event.body;
    }

    const res = await fetch(target, fetchOptions);

    const text = await res.text();
    const contentType =
      res.headers.get("content-type") || "application/json; charset=utf-8";
    return {
      statusCode: res.status,
      headers: {
        "content-type": contentType,
        "access-control-allow-origin": "*",
      },
      body: text,
    };
  } catch (err) {
    console.error("[db.js] proxy error:", err);
    return json(500, { ok: false, error: String(err?.message || err) });
  }
};
