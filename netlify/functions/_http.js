export const ok = (data, extraHeaders = {}) => ({
  statusCode: 200,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "max-age=30, s-maxage=60, stale-while-revalidate=300",
    ...extraHeaders,
  },
  body: JSON.stringify({ ok: true, data }),
});

export const bad = (msg, code = 400) => ({
  statusCode: code,
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ ok: false, error: msg }),
});

export const parseJson = (event) => {
  try {
    if (event.body) return JSON.parse(event.body);
    return {};
  } catch {
    return null;
  }
};

export const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
