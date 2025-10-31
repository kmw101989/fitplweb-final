// netlify/functions/_db.js
// CommonJS version (CJS 환경 호환용 SHIM)

const { handler: dbHandler } = require("./db.js");

// (1) 라우트: _db → db와 동일 동작
exports.handler = (event, context) => dbHandler(event, context);

// (2) q() 호환 래퍼 (Deprecated)
exports.q = async function (...args) {
  console.warn(
    "[_db.q] Deprecated. Use `/.netlify/functions/db?op=...` instead.",
    { args }
  );
  return { ok: false, deprecated: true };
};
