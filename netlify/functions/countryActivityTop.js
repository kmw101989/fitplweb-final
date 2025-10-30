// netlify/functions-final/countryActivityTop.js
import { q } from "./_db.js";
import { ok, bad, parseJson, num } from "./_http.js";

export const handler = async (event) => {
  const method = event.httpMethod;
  const input = method === "GET" ? event.queryStringParameters || {} : parseJson(event);
  if (input === null) return bad("Invalid JSON", 400);

  const country = (input.country || "").toString().trim();
  const country_code = (input.country_code || "").toString().trim();
  const activity_tag = (input.activity_tag || "").toString().trim().toLowerCase();
  const limit = Math.min(num(input.limit) ?? 20, 100);

  if (!country && !country_code) return bad("country or country_code is required", 400);

  const where = [];
  const params = [];

  if (country) { where.push(`country = ?`); params.push(country); }
  else { where.push(`country_code = ?`); params.push(country_code); }

  if (activity_tag) { where.push(`activity_tag = ?`); params.push(activity_tag); }

  const sql = `
    SELECT *
    FROM v_country_activity_top20_products
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY country, activity_tag, reco_rank ASC
    LIMIT ?
  `;

  try {
    const rows = await q(sql, [...params, limit]);
    return ok(rows);
  } catch (e) {
    return bad(`DB error: ${e.message}`, 500);
  }
};
