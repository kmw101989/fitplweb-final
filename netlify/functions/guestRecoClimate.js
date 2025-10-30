// netlify/functions-final/guestRecoClimate.js
import { q } from "./_db.js";
import { ok, bad, parseJson, num } from "./_http.js";

export const handler = async (event) => {
  const method = event.httpMethod;
  const input = method === "GET" ? event.queryStringParameters || {} : parseJson(event);
  if (input === null) return bad("Invalid JSON", 400);

  const region_id = num(input.region_id);
  const month = (input.month || "").toString().slice(0, 7);
  const limit = Math.min(num(input.limit) ?? 20, 100);

  if (!region_id || !month) return bad("region_id(Number) and month(YYYY-MM) are required", 400);

  const sql = `
    SELECT *
    FROM guest_reco_climate
    WHERE region_id = ? AND month = ?
    ORDER BY reco_rank ASC, product_id ASC
    LIMIT ?
  `;
  try {
    const rows = await q(sql, [region_id, month, limit]);
    return ok(rows);
  } catch (e) {
    return bad(`DB error: ${e.message}`, 500);
  }
};
