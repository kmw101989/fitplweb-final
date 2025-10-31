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

/* 게스트: 기후 추천 (지역별, 월별 필터링 지원) */
app.get("/guest_reco_climate", async (req, res) => {
  try {
    const region_id = req.query.region_id ? Number(req.query.region_id) : null;
    const month = req.query.month || null; // YYYY-MM 형식
    const limit = Math.min(Number(req.query.limit || 20), 100);

    let query = `SELECT * FROM guest_reco_climate WHERE 1=1`;
    const params = [];

    // region_id 필터링
    if (region_id) {
      query += ` AND region_id = ?`;
      params.push(region_id);
    }

    // month 필터링
    if (month && month.length >= 7) {
      query += ` AND month = ?`;
      params.push(month.slice(0, 7)); // YYYY-MM 형식 보장
    }

    query += ` ORDER BY base_score DESC, src_priority ASC, product_id ASC LIMIT ?`;
    params.push(limit);

    const [rows] = await pool.query(query, params);
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    console.error("guest_reco_climate error:", err);
    res.status(500).json({ ok: false, error: String(err.message) });
  }
});

/* 게스트: 활동 추천 (지역별 필터링 지원) */
app.get("/guest_reco_activity", async (req, res) => {
  try {
    const region_id = req.query.region_id ? Number(req.query.region_id) : null;
    const activity_tag = req.query.activity_tag || null;
    const limit = Math.min(Number(req.query.limit || 20), 100);

    let query = `SELECT * FROM guest_reco_activity WHERE 1=1`;
    const params = [];

    // region_id 필터링
    if (region_id) {
      query += ` AND region_id = ?`;
      params.push(region_id);
    }

    // activity_tag 필터링 (선택사항)
    if (activity_tag) {
      query += ` AND activity_tag = ?`;
      params.push(activity_tag);
    }

    query += ` ORDER BY base_score DESC, src_priority ASC, product_id ASC LIMIT ?`;
    params.push(limit);

    const [rows] = await pool.query(query, params);
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    console.error("guest_reco_activity error:", err);
    res.status(500).json({ ok: false, error: String(err.message) });
  }
});

/* ──────────────────────────────────────────────
   [USER] 국가×기후 Top20 (뷰)
   v_country_climate_top20_products
   요청: /user_country_climate_top?user_id=2&limit=20
────────────────────────────────────────────── */
app.get("/user_country_climate_top", async (req, res) => {
  try {
    const user_id = Number(req.query.user_id || 0);
    const limit = Math.min(Number(req.query.limit || 20), 100);
    if (!user_id)
      return res.status(400).json({ ok: false, error: "user_id required" });

    const [rows] = await pool.query(
      `SELECT *
         FROM v_country_climate_top20_products
        WHERE user_id = ?
        LIMIT ?`,
      [user_id, limit]
    );
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    console.error("user_country_climate_top error:", err);
    res.status(500).json({ ok: false, error: String(err.message) });
  }
});

/* ──────────────────────────────────────────────
   [USER] 국가×활동 Top20 (뷰)
   v_country_activity_top20_products
   요청: /user_country_activity_top?user_id=2&limit=20
────────────────────────────────────────────── */
app.get("/user_country_activity_top", async (req, res) => {
  try {
    const user_id = Number(req.query.user_id || 0);
    const limit = Math.min(Number(req.query.limit || 20), 100);
    if (!user_id)
      return res.status(400).json({ ok: false, error: "user_id required" });

    const [rows] = await pool.query(
      `SELECT *
         FROM v_country_activity_top20_products
        WHERE user_id = ?
        LIMIT ?`,
      [user_id, limit]
    );
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    console.error("user_country_activity_top error:", err);
    res.status(500).json({ ok: false, error: String(err.message) });
  }
});

/* ──────────────────────────────────────────────
   [USER] 국가×사진(스냅) Top20 (뷰)
   v_country_photo_top20_products
   요청: /user_country_photo_top?user_id=2&limit=20
────────────────────────────────────────────── */
app.get("/user_country_photo_top", async (req, res) => {
  try {
    const user_id = Number(req.query.user_id || 0);
    const limit = Math.min(Number(req.query.limit || 20), 100);
    if (!user_id)
      return res.status(400).json({ ok: false, error: "user_id required" });

    const [rows] = await pool.query(
      `SELECT *
         FROM v_country_photo_top20_products
        WHERE user_id = ?
        LIMIT ?`,
      [user_id, limit]
    );
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    console.error("user_country_photo_top error:", err);
    res.status(500).json({ ok: false, error: String(err.message) });
  }
});
/* ──────────────────────────────────────────────
   [RANKING] product_ranking 테이블 조회
   GET /product_ranking?limit=20&offset=0&order=monthly_views_desc
      &main_category=top&gender_en=public
   order 허용값:
     - rank_asc            (rank/순위 컬럼 있을 때)
     - base_score_desc
     - monthly_views_desc  (기본값)
     - sales_desc
     - rating_desc
     - review_count_desc
────────────────────────────────────────────── */
app.get("/product_ranking", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 20), 100);
    const offset = Math.max(Number(req.query.offset || 0), 0);
    const order = String(req.query.order || "monthly_views_desc");

    const allowed = {
      rank_asc: "rank_index ASC", // 테이블에 있으면 사용
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
      SELECT *
      FROM product_ranking
      ${whereSql}
      ORDER BY ${orderBy}, product_id ASC
      LIMIT ? OFFSET ?
    `;
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message) });
  }
});

/* ──────────────────────────────────────────────
   [SALE] 세일 탭: product_ranking에서 할인 높은 순
   GET /product_sale?limit=20&offset=0&min_discount=10
      &main_category=top&gender_en=public
────────────────────────────────────────────── */
app.get("/product_sale", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 20), 100);
    const offset = Math.max(Number(req.query.offset || 0), 0);
    const minDiscount = Math.max(Number(req.query.min_discount || 0), 0);

    const where = ["discount_rate IS NOT NULL"];
    const params = [];

    if (minDiscount > 0) {
      where.push("discount_rate >= ?");
      params.push(minDiscount);
    }
    if (req.query.main_category) {
      where.push("main_category = ?");
      params.push(String(req.query.main_category));
    }
    if (req.query.gender_en) {
      where.push("gender_en = ?");
      params.push(String(req.query.gender_en));
    }

    const whereSql = `WHERE ${where.join(" AND ")}`;
    const sql = `
      SELECT *
      FROM product_ranking
      ${whereSql}
      ORDER BY discount_rate DESC, monthly_views DESC, product_id ASC
      LIMIT ? OFFSET ?
    `;
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message) });
  }
});

/* ──────────────────────────────────────────────
   [USER REGISTRATION] 사용자 정보 등록
   POST /user_register
   Body: {
     name?: string,
     email?: string,
     trip_region_id: number,
     trip_start_date?: string (YYYY-MM-DD),
     trip_end_date?: string (YYYY-MM-DD),
     indoor_outdoor: 'indoor' | 'outdoor' | 'both',
     activity_tags?: string[] (영문 키 배열)
   }
────────────────────────────────────────────── */
app.post("/user_register", async (req, res) => {
  try {
    const {
      name,
      email,
      trip_region_id,
      trip_start_date,
      trip_end_date,
      indoor_outdoor,
      activity_tags,
    } = req.body;

    // 필수 필드 검증
    if (!trip_region_id || !indoor_outdoor) {
      return res.status(400).json({
        ok: false,
        error: "trip_region_id and indoor_outdoor are required",
      });
    }

    // indoor_outdoor 값 검증
    if (!["indoor", "outdoor", "both"].includes(indoor_outdoor)) {
      return res.status(400).json({
        ok: false,
        error: "indoor_outdoor must be 'indoor', 'outdoor', or 'both'",
      });
    }

    // 날짜 기본값 설정
    const startDate = trip_start_date || "2025-10-20";
    const endDate = trip_end_date || "2025-10-30";

    // activity_tags를 3개 컬럼으로 분리 (최대 3개)
    const activityTagsArray = Array.isArray(activity_tags)
      ? activity_tags.slice(0, 3)
      : [];
    const activityTag1 = activityTagsArray[0] || null;
    const activityTag2 = activityTagsArray[1] || null;
    const activityTag3 = activityTagsArray[2] || null;

    // user_id 자동 생성: 현재 최대값 확인 후 +1 (최소 21)
    // AUTO_INCREMENT가 없으므로 수동으로 생성
    const [maxUser] = await pool.query(
      "SELECT COALESCE(MAX(user_id), 20) AS max_id FROM users"
    );
    const nextUserId = Math.max((maxUser[0]?.max_id || 20) + 1, 21);

    // 현재 시간 (created_at, updated_at용)
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    // INSERT 쿼리 실행
    const [result] = await pool.query(
      `INSERT INTO users (
        user_id,
        name,
        email,
        trip_region_id,
        trip_start_date,
        trip_end_date,
        indoor_outdoor,
        activity_tag_1,
        activity_tag_2,
        activity_tag_3,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextUserId,
        name || null,
        email || null,
        trip_region_id,
        startDate,
        endDate,
        indoor_outdoor,
        activityTag1,
        activityTag2,
        activityTag3,
        now,
        now,
      ]
    );

    res.json({
      ok: true,
      user_id: nextUserId,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("user_register error:", err);
    res.status(500).json({ ok: false, error: String(err.message) });
  }
});
