// server.js — 로컬 MySQL 브리지(엄격히 화이트리스트/토큰 보호)
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const {
  DB_HOST = "127.0.0.1",
  DB_PORT = "3306",
  DB_USER,
  DB_PASSWORD,
  DB_NAME = "fitpl",
  BRIDGE_TOKEN, // 임의의 긴 토큰을 .env에 넣어주세요
} = process.env;

if (!DB_USER || !BRIDGE_TOKEN) {
  console.error("Missing env: DB_USER or BRIDGE_TOKEN");
  process.exit(1);
}

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

const app = express();
app.use(cors());
app.use(express.json());

// 간단한 토큰 인증
app.use((req, res, next) => {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer "))
    return res.status(401).json({ ok: false, error: "No token" });
  const token = auth.slice("Bearer ".length);
  if (token !== BRIDGE_TOKEN)
    return res.status(403).json({ ok: false, error: "Bad token" });
  next();
});

// 헬스체크
app.get("/ping", async (_req, res) => {
  const [r] = await pool.query("SELECT 1 AS ok");
  res.json({ ok: true, db: r[0]?.ok === 1 });
});

// 서버에서 허용한 “화이트리스트 쿼리”만 제공 (예: 3개)
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

app.get("/user_top", async (req, res) => {
  const userId = Number(req.query.user_id || "0");
  if (!userId)
    return res.status(400).json({ ok: false, error: "user_id required" });
  const [rows] = await pool.query(
    `SELECT product_id, product_name, price, brand
       FROM v_country_top20_activity
      WHERE user_id = ?
      LIMIT 80`,
    [userId]
  );
  res.json({ ok: true, count: rows.length, rows });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`DB bridge on http://localhost:${PORT}`));

/* 게스트: 기후 추천 (파라미터 없음, Top N만) */
app.get("/guest_reco_climate", async (_req, res) => {
  try {
    const limit = 20; // 필요시 숫자만 바꿔 사용
    const [rows] = await pool.query(
      `SELECT *
         FROM guest_reco_climate
        ORDER BY base_score DESC, src_priority ASC, product_id ASC
        LIMIT ?`,
      [limit]
    );
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message) });
  }
});

/* 게스트: 활동 추천 (파라미터 없음, Top N만) */
app.get("/guest_reco_activity", async (_req, res) => {
  try {
    const limit = 20; // 필요시 숫자만 바꿔 사용
    const [rows] = await pool.query(
      `SELECT *
         FROM guest_reco_activity
        ORDER BY base_score DESC, src_priority ASC, product_id ASC
        LIMIT ?`,
      [limit]
    );
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message) });
  }
});
