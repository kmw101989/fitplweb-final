// server.js — 로컬 MySQL 브리지 (헬스체크 무인증 → 토큰 인증 → 라우트)
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

// ── 환경 로그
console.log("[bridge] starting server.js");
console.log("[bridge] NODE_ENV=%s", process.env.NODE_ENV || "dev");
console.log(
  "[bridge] DB_HOST=%s DB_PORT=%s DB_USER=%s DB_NAME=%s",
  process.env.DB_HOST,
  process.env.DB_PORT,
  process.env.DB_USER,
  process.env.DB_NAME
);
console.log("[bridge] PORT=%s", process.env.PORT || "4000");

// ── 환경 변수
const {
  DB_HOST = "127.0.0.1",
  DB_PORT = "3306",
  DB_USER,
  DB_PASSWORD,
  DB_NAME = "fitpl", // 너의 .env 키와 맞춤 (DB_NAME 사용)
  BRIDGE_TOKEN,
} = process.env;

if (!DB_USER || !BRIDGE_TOKEN) {
  console.error("Missing env: DB_USER or BRIDGE_TOKEN");
  process.exit(1);
}

// ── 1) app을 먼저 생성 (중요!)
const app = express();

// ── 2) 공통 미들웨어
app.use(cors());
app.use(express.json());

// ── 3) DB 풀
const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: 5,
  waitForConnections: true,
  queueLimit: 0,
});

// ── 4) 무인증 헬스체크 (cloudflared 확인용)
app.get("/health", (_req, res) => {
  res.json({ ok: true, msg: "bridge up" });
});

// ── 5) 토큰 인증 (Bearer / x-bridge-token / ?token= 모두 허용)
app.use((req, res, next) => {
  const bearer = (req.headers.authorization || "").startsWith("Bearer ")
    ? req.headers.authorization.slice("Bearer ".length)
    : "";
  const headerToken = req.headers["x-bridge-token"] || "";
  const queryToken = req.query.token || "";
  const token = bearer || headerToken || queryToken;

  if (!token) return res.status(401).json({ ok: false, error: "No token" });
  if (token !== BRIDGE_TOKEN)
    return res.status(403).json({ ok: false, error: "Bad token" });
  next();
});

// ── 6) 유틸
const toInt = (v, d) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : d;
};

// ── 7) 기본 라우트
app.get("/ping", async (_req, res) => {
  const [r] = await pool.query("SELECT 1 AS ok");
  res.json({ ok: true, db: r[0]?.ok === 1 });
});

app.get("/time", async (_req, res) => {
  const [r] = await pool.query("SELECT NOW() AS now");
  res.json({ ok: true, now: r[0]?.now });
});

app.get("/products_sample", async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT product_id, product_name, price, brand FROM products LIMIT 10"
  );
  res.json({ ok: true, rows });
});

// (예시) 사용자별/게스트 추천, product_ranking 등은 그대로 유지
// ──────────────────────────────────────────────
// ... (네가 보낸 파일의 나머지 라우트들 그대로 아래에 둬도 됩니다)
// ──────────────────────────────────────────────

// ── 8) /db 통합 디스패처 (원본 유지 가능)
app.get("/db", async (req, res) => {
  try {
    const op = String(req.query.op || "ping");

    if (op === "ping") {
      const [r] = await pool.query("SELECT 1 AS ok");
      return res.json({ ok: true, db: r[0]?.ok === 1 });
    }

    if (op === "guest_reco_climate") {
      const region_id = req.query.region_id
        ? Number(req.query.region_id)
        : null;
      const month = req.query.month || null; // YYYY-MM
      const limit = Math.min(Number(req.query.limit || 20), 100);

      let sql = `SELECT * FROM guest_reco_climate WHERE 1=1`;
      const params = [];
      if (region_id) {
        sql += ` AND region_id = ?`;
        params.push(region_id);
      }
      if (month && month.length >= 7) {
        sql += ` AND month = ?`;
        params.push(month.slice(0, 7));
      }
      sql += ` ORDER BY base_score DESC, src_priority ASC, product_id ASC LIMIT ?`;
      params.push(limit);

      const [rows] = await pool.query(sql, params);
      return res.json({ ok: true, count: rows.length, rows });
    }

    if (op === "guest_reco_activity") {
      const region_id = req.query.region_id
        ? Number(req.query.region_id)
        : null;
      const activity_tag = req.query.activity_tag || null;
      const limit = Math.min(Number(req.query.limit || 20), 100);

      let sql = `SELECT * FROM guest_reco_activity WHERE 1=1`;
      const params = [];
      if (region_id) {
        sql += ` AND region_id = ?`;
        params.push(region_id);
      }
      if (activity_tag) {
        sql += ` AND activity_tag = ?`;
        params.push(activity_tag);
      }
      sql += ` ORDER BY base_score DESC, src_priority ASC, product_id ASC LIMIT ?`;
      params.push(limit);

      const [rows] = await pool.query(sql, params);
      return res.json({ ok: true, count: rows.length, rows });
    }

    if (op === "user_country_climate_top") {
      const user_id = Number(req.query.user_id || 0);
      const limit = Math.min(Number(req.query.limit || 20), 100);
      if (!user_id)
        return res.status(400).json({ ok: false, error: "user_id required" });
      const [rows] = await pool.query(
        `SELECT * FROM v_country_climate_top20_products WHERE user_id = ? LIMIT ?`,
        [user_id, limit]
      );
      return res.json({ ok: true, count: rows.length, rows });
    }

    if (op === "user_country_activity_top") {
      const user_id = Number(req.query.user_id || 0);
      const limit = Math.min(Number(req.query.limit || 20), 100);
      if (!user_id)
        return res.status(400).json({ ok: false, error: "user_id required" });
      const [rows] = await pool.query(
        `SELECT * FROM v_country_activity_top20_products WHERE user_id = ? LIMIT ?`,
        [user_id, limit]
      );
      return res.json({ ok: true, count: rows.length, rows });
    }

    if (op === "user_country_photo_top") {
      const user_id = Number(req.query.user_id || 0);
      const limit = Math.min(Number(req.query.limit || 20), 100);
      if (!user_id)
        return res.status(400).json({ ok: false, error: "user_id required" });
      const [rows] = await pool.query(
        `SELECT * FROM v_country_photo_top20_products WHERE user_id = ? LIMIT ?`,
        [user_id, limit]
      );
      return res.json({ ok: true, count: rows.length, rows });
    }

    if (op === "product_ranking") {
      const limit = Math.min(Number(req.query.limit || 20), 100);
      const offset = Math.max(Number(req.query.offset || 0), 0);
      const order = String(req.query.order || "monthly_views_desc");

      const allowed = {
        rank_asc: "rank_index ASC",
        base_score_desc: "base_score DESC",
        monthly_views_desc: "monthly_views DESC",
        sales_desc: "sales DESC",
        rating_desc: "rating DESC",
        review_count_desc: "review_count DESC",
      };
      const orderBy = allowed[order] || allowed.monthly_views_desc;

      const where = [];
      const params = [];
      if (req.query.main_category) {
        where.push("main_category = ?");
        params.push(String(req.query.main_category));
      }
      if (req.query.gender_en) {
        where.push("gender_en = ?");
        params.push(String(req.query.gender_en));
      }

      const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
      const sql = `
        SELECT * FROM product_ranking
        ${whereSql}
        ORDER BY ${orderBy}, product_id ASC
        LIMIT ? OFFSET ?
      `;
      params.push(limit, offset);

      const [rows] = await pool.query(sql, params);
      return res.json({ ok: true, count: rows.length, rows });
    }

    return res.status(400).json({ ok: false, error: `bad op: ${op}` });
  } catch (err) {
    console.error("[/db] error:", err);
    res.status(500).json({ ok: false, error: String(err.message) });
  }
});

// ── 9) 서버 시작 + 에러 핸들러
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`DB bridge on http://localhost:${PORT}`);
});
server.on("error", (err) => {
  console.error("[bridge] listen error:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[bridge] unhandledRejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[bridge] uncaughtException:", err);
});
