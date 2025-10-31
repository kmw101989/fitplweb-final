// netlify/functions/db.js  — fetch 기반 + 진단 모드(op=diag)
const { URL } = require("url");

// 공용 JSON 응답 헬퍼
function json(status, body) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}

// 타임아웃 fetch 유틸
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 15000, ...opts } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(resource, { ...opts, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

exports.handler = async (event) => {
  const BRIDGE_URL = process.env.BRIDGE_URL;
  const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN;

  // 0) 환경변수 검증
  if (!BRIDGE_URL) {
    console.error("[db] BRIDGE_URL missing");
    return json(500, { ok:false, error:"BRIDGE_URL not set" });
  }
  if (!BRIDGE_TOKEN) {
    console.error("[db] BRIDGE_TOKEN missing");
    return json(500, { ok:false, error:"BRIDGE_TOKEN not set" });
  }

  const q = event.queryStringParameters || {};
  const op = String(q.op || "ping");

  try {
    // 1) 진단 모드: 핑/헬스체크를 별도로 확인
    if (op === "diag") {
      const info = { ok:true, bridge_url_used: BRIDGE_URL };
      try {
        const u = new URL("/health", BRIDGE_URL);
        const r = await fetchWithTimeout(u, {
          method: "GET",
          headers: { "User-Agent": "fitpl-netlify-func/1.0" },
          timeout: 7000,
        });
        info.health_status = r.status;
        info.health_ok = r.ok;
        info.health_text = await r.text();
      } catch (e) {
        console.error("[diag] /health error:", {
          code: e.code, name: e.name, message: e.message
        });
        info.health_error = { code: e.code, name: e.name, message: e.message };
      }
      return json(200, info);
    }

    // 2) 일반 경로: /db에 그대로 프록시
    const upstream = new URL("/db", BRIDGE_URL);
    for (const [k, v] of Object.entries(q)) upstream.searchParams.set(k, String(v));

    // 헤더에 토큰/UA
    const res = await fetchWithTimeout(upstream, {
      method: "GET",
      headers: {
        "x-bridge-token": BRIDGE_TOKEN,
        "User-Agent": "fitpl-netlify-func/1.0"
      },
      timeout: 15000,
    });

    const text = await res.text();

    // 브리지에서 JSON 보낸다는 가정
    let data;
    try { data = JSON.parse(text); }
    catch { data = { ok:false, raw:text }; }

    return json(res.status || 200, data);
  } catch (e) {
    // 에러 로그를 함수 로그에 자세히 남김 (Netlify Functions > Logs에서 확인)
    console.error("[db] handler error", {
      code: e.code,
      name: e.name,
      message: e.message,
      stack: e.stack
    });
    return json(500, { ok:false, error: e.message || "fetch failed" });
  }
};
