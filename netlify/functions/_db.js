// netlify/functions/_db.js
// ──────────────────────────────────────────────────────────────
// 호환용 SHIM:
// 1) 라우트 유지: "/.netlify/functions/_db" → db.js와 동일 동작
// 2) 모듈 호환: import { q } from "./_db.js" 를 임시 지원(경고 출력)
//    → 점진적으로 q() 의존을 제거하고, db.js의 "?op=" 엔드포인트로 바꿔주세요.
// ──────────────────────────────────────────────────────────────

import { handler as dbHandler } from "./db.js";

// (1) 함수 라우트: _db도 db와 동일하게 동작
export const handler = async (event, context) => {
  return dbHandler(event, context);
};

// (2) 임시 q() 호환 래퍼 (Deprecated)
// 예전 코드가 빌드/런타임에서 바로 깨지지 않도록 막아줍니다.
// 실제 데이터 호출은 db.js의 REST 엔드포인트로 바꿔주세요:
//   fetch(`${process.env.BRIDGE_URL || ''}/.netlify/functions/db?op=...`)
export async function q(...args) {
  console.warn(
    "[_db.q] Deprecated! Replace q() with fetch to `/.netlify/functions/db?op=...`",
    { args }
  );
  return {
    ok: false,
    deprecated: true,
    hint: "Use fetch(`${BRIDGE_URL}/.netlify/functions/db?op=...`) or call db.js directly.",
  };
}
