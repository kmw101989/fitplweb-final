// netlify/functions-final/guestRecoActivity.js
import { q } from "./_db.js";
import { ok, bad, parseJson, num } from "./_http.js";

export const handler = async (event) => {
  const method = event.httpMethod;
  const input = method === "GET" ? event.queryStringParameters || {} : parseJson(event);
  if (input === null) return bad("Invalid JSON", 400);

  const region_id = num(input.region_id);
  const activity_tag = (input.activity_tag || "").toString().trim().toLowerCase();
  const limit = Math.min(num(input.limit) ?? 20, 100);

  if (!region_id || !activity_tag) return bad("region_id(Number) and activity_tag(String) are required", 400);

  const sql = `
    SELECT *
    FROM guest_reco_activity
    WHERE region_id = ? AND activity_tag = ?
    ORDER BY reco_rank ASC, product_id ASC
    LIMIT ?
  `;
  try {
    const rows = await q(sql, [region_id, activity_tag, limit]);
    return ok(rows);
  } catch (e) {
    return bad(`DB error: ${e.message}`, 500);
  }
};
