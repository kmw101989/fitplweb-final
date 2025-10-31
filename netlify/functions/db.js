// ESM
const BRIDGE_URL = process.env.BRIDGE_URL;
const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN;

const json = (status, body) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

// ── 추가: 로컬 핸들러 (프록시 없이 바로 응답)
async function handleLocally(op, u) {
  if (op === "ping") return json(200, { ok: true, msg: "local ping" });
  if (op === "time")
    return json(200, { ok: true, time: new Date().toISOString() });
  // TODO: 여기서부터는 직접 MySQL 붙여도 되고(권장), 당장은 501로 응답
  return json(501, { ok: false, error: `op '${op}' not implemented locally` });
}

// ── 기존 프록시 함수 (필요할 때만 사용)
async function fetchBridge(pathWithQuery, method = "GET", payload = null) {
  if (!BRIDGE_URL || !BRIDGE_TOKEN) throw new Error("BRIDGE_NOT_CONFIGURED");
  const url = `${BRIDGE_URL}${pathWithQuery}`;
  const headers = { Authorization: `Bearer ${BRIDGE_TOKEN}` };
  if (payload) headers["Content-Type"] = "application/json";
  const r = await fetch(url, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  if (!r.ok)
    throw new Error(
      `Bridge server error: ${r.status} - ${await r.text().catch(() => "")}`
    );
  return r.json();
}

export const handler = async (event) => {
  try {
    const u = new URL(event.rawUrl);
    const op = u.searchParams.get("op") || "ping";

    // ── 1) BRIDGE_URL 없거나, 프록시 모드 끄고 싶으면: 로컬 처리
    if (!BRIDGE_URL || !BRIDGE_TOKEN) {
      return await handleLocally(op, u);
    }

    // ── 2) 프록시 모드 유지 시: (주의) "경로"가 아니라 쿼리 방식으로 넘기세요
    //     브리지 서버도 동일한 Netlify 함수라면 `?op=` 형태로 라우팅하는 게 안전합니다.
    const passKeys = [
      "limit",
      "offset",
      "order",
      "main_category",
      "gender_en",
      "user_id",
    ];
    const qs = new URLSearchParams();
    qs.set("op", op);
    for (const k of passKeys) {
      const v = u.searchParams.get(k);
      if (v) qs.set(k, v);
    }
    const data = await fetchBridge(`/?${qs.toString()}`);
    return json(200, data);
  } catch (err) {
    if (String(err.message).startsWith("BRIDGE_NOT_CONFIGURED")) {
      // 프록시 설정이 없다면 로컬 처리로 폴백
      const u = new URL(event.rawUrl);
      const op = u.searchParams.get("op") || "ping";
      return await handleLocally(op, u);
    }
    return json(500, {
      ok: false,
      error: String(err?.message || err),
      details: "Internal function error",
    });
  }
};
