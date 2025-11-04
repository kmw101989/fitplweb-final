-- ============================================
-- FitPl Database 성능 최적화를 위한 인덱스 제안
-- ============================================
-- 
-- 현재 쿼리 패턴 분석 결과, 다음 인덱스들이 성능 향상에 필요합니다.
-- 
-- 실행 전 주의사항:
-- 1. 프로덕션 환경에서는 백업 후 실행
-- 2. 인덱스 생성은 시간이 걸릴 수 있음 (대용량 테이블의 경우)
-- 3. 인덱스 생성 후 EXPLAIN으로 쿼리 실행 계획 확인 권장
--
-- ============================================

-- 1. guest_reco_climate 테이블
-- 쿼리 패턴: WHERE product_id = ? [AND region_id = ?] ORDER BY base_score DESC, src_priority ASC

-- 기본 인덱스: product_id (WHERE 절)
CREATE INDEX IF NOT EXISTS idx_guest_reco_climate_product_id 
ON guest_reco_climate(product_id);

-- 복합 인덱스: region_id + product_id (WHERE 절)
CREATE INDEX IF NOT EXISTS idx_guest_reco_climate_region_product 
ON guest_reco_climate(region_id, product_id);

-- 복합 인덱스: product_id + base_score + src_priority (WHERE + ORDER BY 최적화)
CREATE INDEX IF NOT EXISTS idx_guest_reco_climate_product_score 
ON guest_reco_climate(product_id, base_score DESC, src_priority ASC);

-- 복합 인덱스: region_id + product_id + base_score + src_priority (전체 쿼리 최적화)
CREATE INDEX IF NOT EXISTS idx_guest_reco_climate_region_product_score 
ON guest_reco_climate(region_id, product_id, base_score DESC, src_priority ASC);

-- 정렬용 인덱스: base_score + src_priority + product_id (ORDER BY 최적화)
CREATE INDEX IF NOT EXISTS idx_guest_reco_climate_score_order 
ON guest_reco_climate(base_score DESC, src_priority ASC, product_id ASC);


-- 2. guest_reco_activity 테이블
-- 쿼리 패턴: WHERE product_id = ? [AND region_id = ?] ORDER BY base_score DESC, src_priority ASC

CREATE INDEX IF NOT EXISTS idx_guest_reco_activity_product_id 
ON guest_reco_activity(product_id);

CREATE INDEX IF NOT EXISTS idx_guest_reco_activity_region_product 
ON guest_reco_activity(region_id, product_id);

CREATE INDEX IF NOT EXISTS idx_guest_reco_activity_product_score 
ON guest_reco_activity(product_id, base_score DESC, src_priority ASC);

CREATE INDEX IF NOT EXISTS idx_guest_reco_activity_region_product_score 
ON guest_reco_activity(region_id, product_id, base_score DESC, src_priority ASC);

CREATE INDEX IF NOT EXISTS idx_guest_reco_activity_score_order 
ON guest_reco_activity(base_score DESC, src_priority ASC, product_id ASC);


-- 3. v_country_climate_top20_products (뷰 기반, 실제 테이블 확인 필요)
-- 쿼리 패턴: WHERE product_id = ? [AND user_id = ?] [AND region_id = ?] ORDER BY reco_rank ASC, product_id ASC
-- 
-- 주의: 뷰는 인덱스를 직접 생성할 수 없으므로, 
-- 뷰의 기반 테이블에 인덱스를 생성해야 합니다.
-- 실제 테이블명 확인 후 인덱스 생성 필요


-- 4. v_country_activity_top20_products (뷰 기반)
-- 쿼리 패턴: WHERE product_id = ? [AND user_id = ?] [AND region_id = ?] ORDER BY reco_rank ASC, product_id ASC


-- 5. v_country_photo_top20_products (뷰 기반)
-- 쿼리 패턴: WHERE product_id = ? [AND user_id = ?] [AND region_id = ?] ORDER BY reco_rank ASC, product_id ASC


-- 6. product_ranking 테이블
-- 쿼리 패턴: 
--   - WHERE product_id = ?
--   - WHERE main_category = ? AND product_id <> ? AND product_id != '5292437' ORDER BY base_score DESC
--   - WHERE [조건들] ORDER BY base_score DESC, monthly_views DESC, etc.

-- 기본 인덱스
CREATE INDEX IF NOT EXISTS idx_product_ranking_product_id 
ON product_ranking(product_id);

-- main_category 인덱스
CREATE INDEX IF NOT EXISTS idx_product_ranking_main_category 
ON product_ranking(main_category);

-- 복합 인덱스: main_category + base_score + product_id (관련 제품 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_product_ranking_category_score 
ON product_ranking(main_category, base_score DESC, product_id ASC);

-- 정렬용 인덱스들
CREATE INDEX IF NOT EXISTS idx_product_ranking_base_score 
ON product_ranking(base_score DESC, product_id ASC);

CREATE INDEX IF NOT EXISTS idx_product_ranking_monthly_views 
ON product_ranking(monthly_views DESC, product_id ASC);

CREATE INDEX IF NOT EXISTS idx_product_ranking_sales 
ON product_ranking(sales DESC, product_id ASC);

CREATE INDEX IF NOT EXISTS idx_product_ranking_discount_rate 
ON product_ranking(discount_rate DESC, product_id ASC);


-- 7. products 테이블
-- 쿼리 패턴: WHERE product_id = ?

-- PRIMARY KEY가 product_id라면 이미 인덱스가 있음
-- 확인 필요: SHOW INDEX FROM products;


-- 8. product_images 테이블
-- 쿼리 패턴: WHERE product_id = ? ORDER BY sort_order ASC

CREATE INDEX IF NOT EXISTS idx_product_images_product_id 
ON product_images(product_id);

-- 복합 인덱스: product_id + sort_order (WHERE + ORDER BY 최적화)
CREATE INDEX IF NOT EXISTS idx_product_images_product_sort 
ON product_images(product_id, sort_order ASC);


-- ============================================
-- 인덱스 생성 확인 쿼리
-- ============================================
-- 
-- 다음 쿼리로 생성된 인덱스를 확인할 수 있습니다:
--
-- SHOW INDEX FROM guest_reco_climate;
-- SHOW INDEX FROM guest_reco_activity;
-- SHOW INDEX FROM product_ranking;
-- SHOW INDEX FROM product_images;
--
-- ============================================
-- 쿼리 실행 계획 확인 (EXPLAIN)
-- ============================================
--
-- 인덱스 생성 후, 다음 쿼리들의 실행 계획을 확인하세요:
--
-- EXPLAIN SELECT * FROM guest_reco_climate 
-- WHERE product_id = '5292437' AND region_id = 1 
-- ORDER BY base_score DESC, src_priority ASC LIMIT 1;
--
-- EXPLAIN SELECT * FROM product_ranking 
-- WHERE main_category = '상의' AND product_id <> '123456' 
-- ORDER BY base_score DESC LIMIT 9;
--
-- ============================================
-- 성능 모니터링
-- ============================================
--
-- 인덱스 생성 전후 성능 비교:
-- 1. 쿼리 실행 시간 측정
-- 2. EXPLAIN 결과 비교 (type 컬럼 확인: ALL -> index 또는 ref로 변경)
-- 3. rows 컬럼 확인 (스캔하는 행 수 감소 확인)
--
-- ============================================

