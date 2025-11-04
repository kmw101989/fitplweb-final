// 국가별 설정
const countryConfig = {
  일본: {
    regionId: 1, // 도쿄 (기본값)
    regions: [
      { id: 1, name: "도쿄" },
      { id: 2, name: "오사카" },
    ],
    heroTitle: "일본 거리에서 만나는<br />여행과 스타일의 완벽한 조합",
    defaultRegion: "도쿄",
  },
  중국: {
    regionId: 3, // 상하이 (기본값)
    regions: [
      { id: 3, name: "상하이" },
      { id: 4, name: "광저우" },
    ],
    heroTitle: "중국 도시에서 만나는<br />모던한 스타일링",
    defaultRegion: "상하이",
  },
  대만: {
    regionId: 6, // 타이베이
    regions: [
      { id: 6, name: "타이베이" },
      { id: 5, name: "가오슝" },
    ],
    heroTitle: "대만 거리에서 만나는<br />트렌디한 패션",
    defaultRegion: "타이베이",
  },
  태국: {
    regionId: 7, // 방콕
    regions: [
      { id: 7, name: "방콕" },
      { id: 8, name: "치앙마이" },
    ],
    heroTitle: "태국 도시에서 만나는<br />트로피컬 스타일",
    defaultRegion: "방콕",
  },
  베트남: {
    regionId: 10, // 하노이
    regions: [
      { id: 10, name: "하노이" },
      { id: 9, name: "다낭" },
    ],
    heroTitle: "베트남 거리에서 만나는<br />빈티지 패션",
    defaultRegion: "하노이",
  },
  필리핀: {
    regionId: 11, // 마닐라
    regions: [
      { id: 11, name: "마닐라" },
      { id: 12, name: "세부" },
    ],
    heroTitle: "필리핀 도시에서 만나는<br />캐주얼 스타일",
    defaultRegion: "마닐라",
  },
  홍콩: {
    regionId: 13,
    regions: [{ id: 13, name: "홍콩" }],
    heroTitle: "홍콩 거리에서 만나는<br />럭셔리 스타일",
    defaultRegion: "홍콩",
  },
  마카오: {
    regionId: 14,
    regions: [{ id: 14, name: "마카오" }],
    heroTitle: "마카오에서 만나는<br />엘레강트 스타일",
    defaultRegion: "마카오",
  },
  인도네시아: {
    regionId: 16, // 자카르타
    regions: [
      { id: 16, name: "자카르타" },
      { id: 15, name: "발리" },
    ],
    heroTitle: "인도네시아에서 만나는<br />트로피컬 패션",
    defaultRegion: "자카르타",
  },
  미주: {
    regionId: 17, // 괌
    regions: [
      { id: 17, name: "괌" },
      { id: 18, name: "하와이" },
    ],
    heroTitle: "미주 지역에서 만나는<br />리조트 스타일",
    defaultRegion: "괌",
  },
  싱가포르: {
    regionId: 19,
    regions: [{ id: 19, name: "싱가포르" }],
    heroTitle: "싱가포르에서 만나는<br />모던 스타일",
    defaultRegion: "싱가포르",
  },
  호주: {
    regionId: 20, // 시드니
    regions: [{ id: 20, name: "시드니" }],
    heroTitle: "호주에서 만나는<br />아웃도어 스타일",
    defaultRegion: "시드니",
  },
};

const regionHeroImages = {
  도쿄: "https://image.msscdn.net/thumbnails/snap/images/2025/05/10/37476f5bdad34b8aacf4cbb4cc401c35.jpg?w=760",
  오사카: "https://image.msscdn.net/thumbnails/snap/images/2025/04/25/194f4db0054f481a9b5d85402419a957.jpg?w=760",
  상하이: "https://image.msscdn.net/thumbnails/snap/images/2025/08/18/051d85d036554c4da6152e9e77c7d8f5.jpg?w=760",
  광저우: "https://image.msscdn.net/thumbnails/snap/images/2025/06/07/f77526c9c8bc42cbbc3ea8262d462e14.jpg?w=760",
  가오슝: "https://image.msscdn.net/thumbnails/mfile_s01/_street_images/5231/51679a6c1760aimg_full220.jpg?w=760",
  타이베이: "https://image.msscdn.net/thumbnails/snap/images/2025/05/07/ee06d3afed214fe3b099c3565550c221.jpg?w=760",
  방콕: "https://image.msscdn.net/thumbnails/snap/images/2025/07/17/321cf95ee6b145c2aa5ccd77f4a5ae64.jpg?w=760",
  치앙마이: "https://image.msscdn.net/thumbnails/snap/images/2025/04/19/e67a7a252fa441d3a6c82c0a75a384e2.jpg?w=760",
  다낭: "https://image.msscdn.net/thumbnails/display/images/usersnap/2023/07/16/7aabbca5ac1e4e198d8d78bd55bac820.jpg?w=760",
  하노이: "https://image.msscdn.net/thumbnails/display/images/usersnap/2023/07/08/551286a8801a4422a101c8bac43e39cc.jpg?w=760",
  마닐라: "https://image.msscdn.net/thumbnails/display/images/usersnap/2023/02/17/4a7027e2501b4bfc82fed5f20ff91a5c.jpg?w=760",
  세부: "https://image.msscdn.net/thumbnails/snap/images/2025/10/26/a8edaccefd384288a6503351bf2637fc.jpg?w=760",
  홍콩: "https://image.msscdn.net/thumbnails/snap/images/2025/10/12/aa07bb89a1f841e3aecf74ec8844388e.jpg?w=760",
  마카오: "https://image.msscdn.net/thumbnails/snap/images/2025/01/03/31fb0b3f11e8418abfb40c54559eb30a.jpg?w=760",
  발리: "https://image.msscdn.net/thumbnails/snap/images/2025/10/20/5950d9c0edc14900bcb223724488d520.jpg?w=760",
  자카르타: "https://image.msscdn.net/thumbnails/display/images/usersnap/2024/01/28/b9594548815645f88adba2fee698ec5c.jpg?w=760",
  괌: "https://image.msscdn.net/thumbnails/snap/images/2025/10/03/95b714aa3884492b9034cbdbd2a4a4df.jpg?w=760",
  하와이: "https://image.msscdn.net/thumbnails/snap/images/2025/10/15/5fdbeac51a424dff86ad8641585fdba3.jpg?w=760",
  싱가포르: "https://image.msscdn.net/thumbnails/snap/images/2024/12/01/b77e38a63ca94ca8ab505238a782a060.jpg?w=760",
  시드니: "https://image.msscdn.net/thumbnails/snap/images/2025/10/13/f0293f639bd7415c9f57c4010a57eb13.jpg?w=760",
};

// 지역별 10월 평균 기온 (도씨)
const regionOctoberTemperature = {
  도쿄: 19.0,
  오사카: 19.2,
  후쿠오카: 20.1,
  상하이: 18.0,
  광저우: 23.5,
  타이베이: 25.2,
  가오슝: 27.3,
  방콕: 28.1,
  치앙마이: 26.4,
  하노이: 24.3,
  다낭: 26.2,
  마닐라: 28.5,
  세부: 29.1,
  홍콩: 25.4,
  마카오: 25.6,
  자카르타: 28.3,
  발리: 28.7,
  괌: 29.3,
  하와이: 27.2,
  싱가포르: 28.4,
  시드니: 19.5,
};

function applyHeroBackground(regionName) {
  const heroSection = document.querySelector(".hero-section");
  if (!heroSection) return;

  const imageUrl = regionHeroImages[regionName];
  if (imageUrl) {
    heroSection.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.65) 100%), url("${imageUrl}")`;
  } else {
    heroSection.style.backgroundImage = "";
  }
}

// URL 파라미터에서 국가 가져오기
function getCountryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("country") || "일본";
}

// 현재 국가 설정 가져오기
function getCurrentCountryConfig() {
  const country = getCountryFromURL();
  return countryConfig[country] || countryConfig["일본"];
}

// 페이지 내용 동적 업데이트
function updatePageContent() {
  const country = getCountryFromURL();
  const config = getCurrentCountryConfig();

  // URL에서 region_id 확인
  const params = new URLSearchParams(window.location.search);
  let regionId = params.get("region_id");

  // region_id가 없으면 첫 번째 지역(region_id가 가장 작은 것)으로 자동 설정
  if (!regionId && config.regions.length > 0) {
    // region_id로 정렬하여 가장 작은 것 선택
    const sortedRegions = [...config.regions].sort((a, b) => a.id - b.id);
    const firstRegion = sortedRegions[0];
    regionId = firstRegion.id.toString();

    // URL에 region_id 추가 (페이지 새로고침 없이)
    params.set("region_id", regionId);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

  // region_id에 해당하는 지역 찾기
  let selectedRegion =
    config.defaultRegion || (config.regions && config.regions[0]
      ? config.regions[0].name
      : "");
  if (regionId) {
    const region = config.regions.find((r) => r.id === parseInt(regionId));
    if (region) {
      selectedRegion = region.name;
    } else {
      // 찾지 못했으면 첫 번째 지역 사용
      const sortedRegions = [...config.regions].sort((a, b) => a.id - b.id);
      if (sortedRegions.length > 0) {
        selectedRegion = sortedRegions[0].name;
      }
    }
  }

  // 페이지 제목 업데이트
  document.title = `${country} | ${selectedRegion} - MUSINSA`;

  // 헤더 업데이트
  const pageHeader = document.querySelector(".page-header h1");
  if (pageHeader) {
    pageHeader.textContent = `${country} | ${selectedRegion}`;
  }

  // 히어로 섹션 업데이트
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    heroTitle.innerHTML = config.heroTitle;
  }

  applyHeroBackground(selectedRegion);

  // 날씨 정보 업데이트
  const weatherTemp = document.getElementById("weather-temp");
  if (weatherTemp) {
    const temp = regionOctoberTemperature[selectedRegion] || 20.0;
    weatherTemp.textContent = `${selectedRegion} ${temp.toFixed(1)}°C | `;
  }

  // 지역 태그 업데이트
  updateLocationTags(config);
}

// 지역 태그 업데이트
function updateLocationTags(config) {
  const locationTagsContainer = document.querySelector(".location-tags");
  if (!locationTagsContainer) return;

  locationTagsContainer.innerHTML = "";

  // 현재 URL 파라미터 가져오기
  const currentParams = new URLSearchParams(window.location.search);
  const currentCountry = currentParams.get("country") || getCountryFromURL();
  const currentRegionId = currentParams.get("region_id");

  // region_id로 정렬 (작은 것부터)
  const sortedRegions = [...config.regions].sort((a, b) => a.id - b.id);

  sortedRegions.forEach((region, index) => {
    const tag = document.createElement("button");
    tag.className = "location-tag";
    tag.textContent = region.name;
    tag.dataset.location = region.name.toLowerCase();
    tag.dataset.regionId = region.id;

    // 현재 선택된 region_id와 일치하면 active
    if (currentRegionId && parseInt(currentRegionId) === region.id) {
      tag.classList.add("active");
    } else if (!currentRegionId && index === 0) {
      // region_id가 없고 첫 번째 지역이면 active
      tag.classList.add("active");
    }

    tag.addEventListener("click", () => {
      // URL에 region_id 파라미터 추가
      const params = new URLSearchParams(window.location.search);
      params.set("region_id", region.id);

      // URL 업데이트 (페이지 새로고침 없이)
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, "", newUrl);

      // 모든 태그에서 active 제거
      document
        .querySelectorAll(".location-tag")
        .forEach((t) => t.classList.remove("active"));
      tag.classList.add("active");

      // 페이지 헤더 업데이트
      const country = getCountryFromURL();
      const pageHeader = document.querySelector(".page-header h1");
      if (pageHeader) {
        pageHeader.textContent = `${country} | ${region.name}`;
      }

      // 날씨 정보 업데이트
      const weatherTemp = document.getElementById("weather-temp");
      if (weatherTemp) {
        const temp = regionOctoberTemperature[region.name] || 20.0;
        weatherTemp.textContent = `${region.name} ${temp.toFixed(1)}°C | `;
      }

      applyHeroBackground(region.name);

      // 제품 다시 로드
      loadProductsForRegion(region.id);
    });

    locationTagsContainer.appendChild(tag);
  });

  // 더보기 버튼 (필요시)
  if (config.regions.length > 3) {
    const moreBtn = document.createElement("button");
    moreBtn.className = "location-tag";
    moreBtn.textContent = "+더보기";
    locationTagsContainer.appendChild(moreBtn);
  }
}

// 현재 페이지의 region_id 가져오기
function getCurrentRegionId() {
  const params = new URLSearchParams(window.location.search);
  const regionId = params.get("region_id");
  if (regionId) {
    return parseInt(regionId);
  }

  // URL에 없으면 국가 설정에서 기본 region_id 가져오기
  const country = getCountryFromURL();
  const config = getCurrentCountryConfig();
  if (config && config.regions && config.regions.length > 0) {
    // 가장 작은 region_id 반환
    return config.regions[0].id;
  }

  return null;
}

// 유저 ID 결정 함수: 유저의 trip_region_id와 현재 페이지 지역 ID 비교
// 일치하면 유저 ID, 불일치하면 게스트 ID(region_id) 반환
function determineUserId(currentPageRegionId) {
  const user = getUserFromStorage();

  // 유저 정보가 없거나 페이지 지역 ID가 없으면 게스트
  if (!user || !currentPageRegionId) {
    return currentPageRegionId || null; // 게스트는 region_id = user_id
  }

  // 유저의 trip_region_id와 현재 페이지 지역 ID 비교
  if (user.trip_region_id === currentPageRegionId) {
    // 일치: 유저 ID 사용
    return user.user_id;
  } else {
    // 불일치: 해당 지역의 게스트 ID 사용 (region_id = user_id)
    return currentPageRegionId;
  }
}

// 지역별 제품 로드
async function loadProductsForRegion(regionId) {
  // 유저의 trip_region_id와 현재 페이지 region_id 비교하여 적절한 user_id 결정
  // 게스트이거나 불일치 시: region_id를 user_id로 사용 (1~20 범위)
  const userId = determineUserId(regionId);

  console.log(`제품 로드: region_id=${regionId}, 사용할 user_id=${userId}`);

  try {
    // 날씨별 추천 (userId가 null이면 regionId를 user_id로 사용)
    await loadSectionProducts(
      "weather-section",
      userId || regionId,
      "climate",
      regionId
    );

    // 활동별 추천
    await loadSectionProducts(
      "activity-section",
      userId || regionId,
      "activity",
      regionId
    );

    // 사진용 추천 (photo) - 게스트도 region_id를 user_id로 사용
    await loadSectionProducts(
      "photo-section",
      userId || regionId,
      "photo",
      regionId
    );
  } catch (error) {
    console.error("제품 로드 실패:", error);
  }
}

// 섹션별 제품 로드
// userId: 실제 유저 ID 또는 게스트 ID(region_id, 1~20)
// regionId: 현재 페이지의 region_id (게스트 ID 결정용)
async function loadSectionProducts(sectionId, userId, type, regionId = null) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const productGrid = section.querySelector(".product-grid");
  if (!productGrid) return;

  const base = "/.netlify/functions/db";
  let url = "";

  // userId가 있으면 뷰 사용 (유저 ID 또는 게스트 ID=region_id 1~20)
  // 게스트 모드: region_id를 user_id로 사용해서 뷰에서 해당 게스트 데이터 조회
  if (userId) {
    if (type === "climate") {
      url = `${base}?op=user_country_climate_top&user_id=${userId}&limit=20`;
    } else if (type === "activity") {
      url = `${base}?op=user_country_activity_top&user_id=${userId}&limit=20`;
    } else if (type === "photo") {
      url = `${base}?op=user_country_photo_top&user_id=${userId}&limit=20`;
    }
  } else {
    // userId가 null인 경우는 매우 드물지만, regionId를 게스트 ID로 사용
    const fallbackRegionId = regionId || getCurrentRegionId();
    if (fallbackRegionId && fallbackRegionId >= 1 && fallbackRegionId <= 20) {
      // region_id를 user_id로 사용 (1~20 범위 내)
      if (type === "climate") {
        url = `${base}?op=user_country_climate_top&user_id=${fallbackRegionId}&limit=20`;
      } else if (type === "activity") {
        url = `${base}?op=user_country_activity_top&user_id=${fallbackRegionId}&limit=20`;
      } else if (type === "photo") {
        url = `${base}?op=user_country_photo_top&user_id=${fallbackRegionId}&limit=20`;
      }
    } else {
      // region_id가 범위 밖이거나 없으면 게스트 추천 API 사용 (fallback)
      const currentMonth = new Date().toISOString().slice(0, 7);
      if (type === "climate") {
        url = fallbackRegionId
          ? `${base}?op=guest_reco_climate&region_id=${fallbackRegionId}&month=${currentMonth}`
          : `${base}?op=guest_reco_climate`;
      } else if (type === "activity") {
        url = fallbackRegionId
          ? `${base}?op=guest_reco_activity&region_id=${fallbackRegionId}`
          : `${base}?op=guest_reco_activity`;
      } else if (type === "photo") {
        console.log("사진용 추천은 유저 전용입니다.");
        return;
      }
    }
  }

  if (!url) return;

  try {
    console.log(`[${type}] API 호출 시작:`, url);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[${type}] HTTP 에러 ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`[${type}] API 응답:`, {
      ok: data?.ok,
      count: data?.count,
      rowsLength: data?.rows?.length || data?.data?.rows?.length || 0,
      hasRows: !!data?.rows,
      hasDataRows: !!data?.data?.rows,
    });

    const products = data?.rows || data?.data?.rows || [];

    const sourceLabel = url.includes("user_country_climate_top")
      ? "user_country_climate_top"
      : url.includes("user_country_activity_top")
      ? "user_country_activity_top"
      : url.includes("user_country_photo_top")
      ? "user_country_photo_top"
      : url.includes("guest_reco_climate")
      ? "guest_reco_climate"
      : url.includes("guest_reco_activity")
      ? "guest_reco_activity"
      : "";

    const normalizedProducts = products.map((item) => ({
      ...item,
      __source: sourceLabel,
    }));

    if (normalizedProducts.length > 0) {
      // 처음에는 9개만 표시
      renderProductsToGrid(productGrid, normalizedProducts, 9);
      console.log(
        `[${type}] 성공: ${normalizedProducts.length}개 제품 로드 완료 (user_id: ${userId})`
      );
      
      // 활동 섹션인 경우 태그별 제품 존재 여부 확인 후 버튼 업데이트
      if (type === "activity" && sectionId === "activity-section") {
        updateActivityTagsBasedOnProducts(normalizedProducts);
      }
    } else {
      console.warn(`[${type}] 경고: 제품이 없습니다 (user_id: ${userId})`, {
        responseData: data,
        url,
      });
    }
  } catch (error) {
    console.error(`[${type}] 제품 로드 실패:`, {
      error: error.message,
      stack: error.stack,
      url,
      userId,
    });
  }
}

// 제품 그리드에 제품 렌더링
function renderProductsToGrid(
  grid,
  products,
  maxProducts = 9,
  skipButtonSetup = false,
  preserveOriginalData = false  // 원본 데이터 보존 옵션
) {
  // 기존 모든 제품 제거 (하드코딩된 것들 포함)
  grid.innerHTML = "";

  // 제품 데이터를 그리드에 저장 (더보기 버튼에서 사용)
  // preserveOriginalData가 true이면 원본 데이터를 유지 (정렬 시 사용)
  if (!preserveOriginalData) {
    grid.dataset.allProducts = JSON.stringify(products);
  }

  // API에서 받아온 제품들만 표시
  products.slice(0, maxProducts).forEach((product) => {
    const card = createProductCardFromAPI(product);
    grid.appendChild(card);
  });

  // 더보기 버튼 설정 (건너뛰지 않는 경우만)
  if (!skipButtonSetup) {
    setupMoreButton(grid, products.length, maxProducts);
  }
}

// API 데이터로 제품 카드 생성
function createProductCardFromAPI(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.productId = product.product_id || "";
  card.dataset.source = product.__source || "";
  const regionIdValue = product.region_id || product.regionId || "";
  if (regionIdValue) {
    card.dataset.regionId = regionIdValue;
  }

  const price = Number(product.price || 0).toLocaleString();
  const name = (product.product_name || "").replace(/\s+/g, " ").trim();
  const brand = product.brand || "";
  
  // 이미지 URL 유효성 검사 및 정규화
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=260&h=312&fit=crop";
  let imgUrl = FALLBACK_IMAGE;
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const url = product.images[0];
    if (url && typeof url === "string" && url.trim() && url.trim() !== "null" && url.trim() !== "undefined") {
      imgUrl = url.trim();
    }
  } else if (product.img_url) {
    const url = product.img_url;
    if (url && typeof url === "string" && url.trim() && url.trim() !== "null" && url.trim() !== "undefined") {
      imgUrl = url.trim();
    }
  } else if (product.image_url) {
    const url = product.image_url;
    if (url && typeof url === "string" && url.trim() && url.trim() !== "null" && url.trim() !== "undefined") {
      imgUrl = url.trim();
    }
  }
  
  const discountRate = product.discount_rate
    ? Math.round(product.discount_rate)
    : null;

  const discountHTML =
    discountRate > 0 ? `<span class="discount">${discountRate}%</span>` : "";

  card.innerHTML = `
    <div class="product-image">
      <img src="${imgUrl}" alt="${name}" loading="lazy" onerror="this.src='${FALLBACK_IMAGE}'" />
      <button class="like-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M17.5 6.25C17.5 3.75 15.5 2.5 13.75 2.5C12.5 2.5 11.25 3.25 10.5 4.25C9.75 3.25 8.5 2.5 7.25 2.5C5.5 2.5 3.5 3.75 3.5 6.25C3.5 8.75 10.5 15 10.5 15S17.5 8.75 17.5 6.25Z"
            stroke="#000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <div class="product-info">
      <div class="brand">${brand}</div>
      <div class="product-name">${name}</div>
      <div class="price">${price}원</div>
      ${discountHTML ? `<div class="coupon">${discountHTML}</div>` : ""}
    </div>
  `;

  // 좋아요 버튼 이벤트
  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const heartIcon = likeBtn.querySelector("svg path");
    if (heartIcon.style.fill === "red") {
      heartIcon.style.fill = "none";
      heartIcon.style.stroke = "#000";
    } else {
      heartIcon.style.fill = "red";
      heartIcon.style.stroke = "red";
    }
    likeBtn.style.transform = "scale(1.2)";
    setTimeout(() => {
      likeBtn.style.transform = "scale(1)";
    }, 200);
  });

  // 제품 카드 클릭 이벤트
  card.addEventListener("click", (e) => {
    if (e.target.closest(".like-btn")) return;
    const productId = card.dataset.productId;
    const source = card.dataset.source;
    const regionId = card.dataset.regionId;
    if (productId) {
      const params = new URLSearchParams();
      params.set("product_id", productId);
      if (source) params.set("source", source);
      if (regionId) params.set("region_id", regionId);
      window.location.href = `../Detail/navigation.html?${params.toString()}`;
    } else {
      window.location.href = "../Detail/navigation.html";
    }
  });

  return card;
}

// 더보기 버튼 설정 및 이벤트 핸들러
function setupMoreButton(grid, totalProducts, currentCount = 9) {
  const section = grid.closest("section");
  if (!section) return;

  let moreBtn = section.querySelector(".more-btn");
  if (!moreBtn) {
    // 더보기 버튼이 없으면 생성
    moreBtn = document.createElement("button");
    moreBtn.className = "more-btn";
    moreBtn.textContent = "더보기";
    grid.parentNode.insertBefore(moreBtn, grid.nextSibling);
  }

  // 제품이 9개 이하면 더보기 버튼 숨김
  if (totalProducts <= 9) {
    moreBtn.style.display = "none";
    return;
  }

  moreBtn.style.display = "block";

  // 현재 표시된 제품 수에 따라 버튼 상태 설정
  const isExpanded = currentCount >= 18;
  moreBtn.dataset.expanded = isExpanded ? "true" : "false";
  moreBtn.textContent = isExpanded ? "접기" : "더보기";

  // 기존 이벤트 리스너 제거 (중복 방지)
  const newMoreBtn = moreBtn.cloneNode(true);
  newMoreBtn.dataset.expanded = moreBtn.dataset.expanded;
  newMoreBtn.textContent = moreBtn.textContent;
  moreBtn.parentNode.replaceChild(newMoreBtn, moreBtn);

  newMoreBtn.addEventListener("click", () => {
    const isCurrentlyExpanded = newMoreBtn.dataset.expanded === "true";
    const allProductsJson = grid.dataset.allProducts;

    if (!allProductsJson) return;

    try {
      const allProducts = JSON.parse(allProductsJson);

      if (isCurrentlyExpanded) {
        // 접기: 9개로 줄이기
        renderProductsToGrid(grid, allProducts, 9, true);
        newMoreBtn.textContent = "더보기";
        newMoreBtn.dataset.expanded = "false";
      } else {
        // 펼치기: 18개로 늘리기
        renderProductsToGrid(grid, allProducts, 18, true);
        newMoreBtn.textContent = "접기";
        newMoreBtn.dataset.expanded = "true";
      }
    } catch (error) {
      console.error("더보기 버튼 처리 실패:", error);
    }
  });
}

// 로컬 스토리지에서 유저 정보 가져오기 (1시간 만료 체크)
function getUserFromStorage() {
  try {
    const stored = localStorage.getItem("fitpl_user");
    if (!stored) return null;
    
    const userData = JSON.parse(stored);
    
    // 만료 시간 체크
    if (userData.expires_at) {
      const expiresAt = new Date(userData.expires_at);
      const now = new Date();
      
      if (now > expiresAt) {
        // 만료되었으면 삭제하고 null 반환
        console.log("로컬 스토리지 데이터가 만료되었습니다. 삭제합니다.");
        localStorage.removeItem("fitpl_user");
        return null;
      }
    }
    
    return userData;
  } catch (e) {
    console.error("로컬 스토리지 파싱 오류:", e);
    localStorage.removeItem("fitpl_user"); // 오류 시 삭제
    return null;
  }
}

// DOM 요소 선택
const tabButtons = document.querySelectorAll(".tab-btn");
const weatherTags = document.querySelectorAll(".weather-tag");
// 활동 태그는 동적으로 생성되므로 여기서는 초기화하지 않음
const snapTags = document.querySelectorAll(".snap-tag");
const locationTags = document.querySelectorAll(".location-tag");
const likeButtons = document.querySelectorAll(".like-btn");
const moreButtons = document.querySelectorAll(".more-btn");
const logoutBtn = document.querySelector(".logout-btn");

// FITPL 버튼 클릭 이벤트
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    window.location.href = "../fitpl-website/index.html";
  });
}

// 탭 전환 기능
function switchTab(clickedTab, allTabs) {
  allTabs.forEach((tab) => {
    tab.classList.remove("active");
  });
  clickedTab.classList.add("active");
}

// 탭 버튼 이벤트 리스너
tabButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const section = e.target.closest("section");
    const sectionTabs = section.querySelectorAll(".tab-btn");
    switchTab(e.target, sectionTabs);
  });
});

// 날씨 태그 전환 기능
weatherTags.forEach((tag) => {
  tag.addEventListener("click", (e) => {
    const section = e.target.closest("section");
    const sectionWeatherTags = section.querySelectorAll(".weather-tag");
    switchTab(e.target, sectionWeatherTags);
  });
});

// 활동 태그 한글 텍스트를 API activity_tag로 매핑
function mapActivityTagToAPI(한글태그) {
  const mapping = {
    "휴양": [
      "beach", "hot_spring",           // 기본 휴양 태그
      "national_park", "zoo", "aquarium",  // 자연체험 통합
    ],
    "테마파크": [
      "theme_park",                    // 기본 테마파크
      "hiking",                        // 스포츠 통합
    ],
    "레저": [
      "yacht_cruise", "observation_deck",  // 기본 레저
    ],
    "도시관광": [
      "city_tour", "market_night", "cafe_hopping", "outlet_mall",  // 기본 도시관광
      "art_museum", "museum", "cathedral_church", "temple_shrine",  // 문화/예술 통합
    ],
  };
  return mapping[한글태그] || null;
}

// 제품 데이터를 기반으로 활동 태그 버튼 업데이트
// 모든 버튼을 먼저 표시하고, 클릭 시 일치하는 제품이 0개인 경우에만 숨김
function updateActivityTagsBasedOnProducts(products) {
  const activitySection = document.getElementById("activity-section");
  if (!activitySection) return;
  
  const activityTagsContainer = activitySection.querySelector(".activity-tags");
  if (!activityTagsContainer) return;
  
  // 태그 정의 (4개 버튼만 사용)
  const tagDefinitions = {
    "휴양": [
      "beach", "hot_spring",           // 기본 휴양 태그
      "national_park", "zoo", "aquarium",  // 자연체험 통합
    ],
    "테마파크": [
      "theme_park",                    // 기본 테마파크
      "hiking",                        // 스포츠 통합
    ],
    "레저": [
      "yacht_cruise", "observation_deck",  // 기본 레저
    ],
    "도시관광": [
      "city_tour", "market_night", "cafe_hopping", "outlet_mall",  // 기본 도시관광
      "art_museum", "museum", "cathedral_church", "temple_shrine",  // 문화/예술 통합
    ],
  };
  
  // 제품들의 activity_tag 추출 (소문자로 정규화)
  const productTags = new Set();
  products.forEach(p => {
    if (p?.activity_tag) {
      productTags.add(String(p.activity_tag).toLowerCase().trim());
    }
  });
  
  console.log("[활동 태그 업데이트] 제품 태그:", Array.from(productTags));
  console.log("[활동 태그 업데이트] 전체 제품 수:", products.length);
  console.log("[활동 태그 업데이트] activity_tag가 있는 제품 수:", products.filter(p => p?.activity_tag).length);
  
  // 제품 데이터를 dataset에 저장 (태그 클릭 시 사용)
  const productGrid = activitySection.querySelector(".product-grid");
  if (productGrid && products.length > 0) {
    productGrid.dataset.allProducts = JSON.stringify(products);
  }
  
  // 기존 버튼 모두 제거
  activityTagsContainer.innerHTML = "";
  
  // 제품이 있는 태그만 버튼 생성 (처음부터 필터링)
  const allTags = Object.keys(tagDefinitions);
  const availableTags = [];
  
  console.log(`[활동 태그 업데이트] 태그별 제품 존재 여부 확인 중...`);
  
  allTags.forEach((tagText) => {
    const apiTags = tagDefinitions[tagText];
    const normalizedApiTags = apiTags.map(tag => String(tag).toLowerCase().trim());
    const hasMatchingProduct = normalizedApiTags.some(apiTag => productTags.has(apiTag));
    
    if (hasMatchingProduct) {
      availableTags.push(tagText);
      const matchedTags = normalizedApiTags.filter(apiTag => productTags.has(apiTag));
      console.log(`[활동 태그 업데이트] ✅ ${tagText}: 제품 있음 (일치하는 태그: ${matchedTags.join(', ')})`);
    } else {
      console.log(`[활동 태그 업데이트] ❌ ${tagText}: 제품 없음 - 버튼 생성 안 함`);
    }
  });
  
  // 제품이 있는 태그만 버튼으로 생성
  availableTags.forEach((tagText, index) => {
    const button = document.createElement("button");
    button.className = "activity-tag";
    button.textContent = tagText;
    if (index === 0) {
      button.classList.add("active");
    }
    activityTagsContainer.appendChild(button);
  });
  
  console.log(`[활동 태그 업데이트] ✅ 완료: 총 ${availableTags.length}개 태그 버튼 생성됨 (${availableTags.join(', ')})`);
  
  // 새로 생성된 버튼들에 이벤트 리스너 재등록
  setupActivityTagListeners();
}

// 활동 태그 버튼 이벤트 리스너 설정 함수
function setupActivityTagListeners() {
  const activitySection = document.getElementById("activity-section");
  if (!activitySection) return;
  
  const activityTags = activitySection.querySelectorAll(".activity-tag");
  
  activityTags.forEach((tag) => {
    // 기존 리스너 제거를 위해 클론 후 교체
    const newTag = tag.cloneNode(true);
    tag.parentNode.replaceChild(newTag, tag);
  });
  
  // 새로 가져온 태그들에 이벤트 리스너 등록
  const newActivityTags = activitySection.querySelectorAll(".activity-tag");
  
  newActivityTags.forEach((tag) => {
    tag.addEventListener("click", async (e) => {
      const clickedTag = e.target;
      const tagText = clickedTag.textContent.trim();
      
      // active 상태 토글
      const section = clickedTag.closest("section");
      const sectionActivityTags = section.querySelectorAll(".activity-tag");
      switchTab(clickedTag, sectionActivityTags);
      
      // 활동별 추천 섹션에서만 작동
      if (section?.id !== "activity-section") return;
      
      const productGrid = section.querySelector(".product-grid");
      if (!productGrid) return;
      
      // 저장된 제품 데이터 가져오기
      const storedProducts = productGrid.dataset.allProducts;
      if (!storedProducts) {
        console.warn("[활동 태그] 저장된 제품 데이터가 없습니다.");
        return;
      }
      
      try {
        const allProducts = JSON.parse(storedProducts);
        const activityTags = mapActivityTagToAPI(tagText);
        
        if (!activityTags) {
          console.warn(`[활동 태그] ${tagText}에 대한 매핑이 없습니다.`);
          return;
        }
        
        console.log(`[활동 태그] ${tagText} 클릭, activity_tags:`, activityTags);
        
        // activity_tag 배열로 정렬
        const sortedProducts = sortProductsByActivityTag(allProducts, activityTags);
        
        // 일치하는 제품 수 확인
        const normalizedTags = activityTags.map(tag => String(tag).toLowerCase().trim());
        
        // 디버깅: 실제 제품들의 activity_tag 값 확인
        const allProductTags = allProducts.map(p => String(p?.activity_tag || "").toLowerCase().trim()).filter(t => t);
        const uniqueProductTags = [...new Set(allProductTags)];
        console.log(`[활동 태그 디버깅] ${tagText} 클릭 시:`);
        console.log(`  - 검색할 태그들:`, normalizedTags);
        console.log(`  - 제품 데이터의 실제 activity_tag 값들:`, uniqueProductTags);
        console.log(`  - 매칭 여부 확인:`);
        normalizedTags.forEach(searchTag => {
          const matches = uniqueProductTags.filter(pt => pt === searchTag || pt.includes(searchTag) || searchTag.includes(pt));
          console.log(`    - "${searchTag}": ${matches.length > 0 ? `✅ 매칭됨 (${matches.join(', ')})` : '❌ 매칭 안 됨'}`);
        });
        
        const matchingProducts = sortedProducts.filter(p => {
          const productTag = String(p?.activity_tag || "").toLowerCase().trim();
          return normalizedTags.includes(productTag);
        });
        console.log(`  - ${tagText} 태그와 일치하는 제품 수: ${matchingProducts.length}`);
        
        // 매칭되지 않은 경우 부분 매칭도 시도 (디버깅용)
        if (matchingProducts.length === 0) {
          const partialMatches = sortedProducts.filter(p => {
            const productTag = String(p?.activity_tag || "").toLowerCase().trim();
            return normalizedTags.some(searchTag => 
              productTag.includes(searchTag) || searchTag.includes(productTag)
            );
          });
          if (partialMatches.length > 0) {
            console.warn(`[활동 태그] 부분 매칭 발견: ${partialMatches.length}개 제품이 유사한 태그를 가지고 있습니다.`);
            console.warn(`  - 부분 매칭 제품들의 activity_tag:`, [...new Set(partialMatches.map(p => p?.activity_tag))]);
          }
        }
        
        // 일치하는 제품이 0개이면 경고만 표시 (버튼은 이미 생성 시 필터링됨)
        if (matchingProducts.length === 0) {
          console.warn(`[활동 태그] ${tagText} 태그와 일치하는 제품이 없습니다.`);
          // 원래 데이터로 되돌림
          renderProductsToGrid(productGrid, allProducts, 9, false, true);
          // active 클래스 제거하고 다른 버튼을 active로 설정
          clickedTag.classList.remove("active");
          const remainingTags = Array.from(sectionActivityTags);
          if (remainingTags.length > 0 && remainingTags[0] !== clickedTag) {
            remainingTags[0].classList.add("active");
            // 첫 번째 남은 태그로 제품 다시 렌더링
            const firstTagText = remainingTags[0].textContent.trim();
            const firstActivityTags = mapActivityTagToAPI(firstTagText);
            if (firstActivityTags) {
              const firstSortedProducts = sortProductsByActivityTag(allProducts, firstActivityTags);
              renderProductsToGrid(productGrid, firstSortedProducts, 9, false, true);
            }
          }
          return;
        }
        
        // 일치하는 제품이 상위로 정렬된 목록으로 재렌더링
        renderProductsToGrid(productGrid, sortedProducts, 9, false, true);
        
        console.log(`[활동 태그] 제품 정렬 완료: 총 ${sortedProducts.length}개`);
      } catch (error) {
        console.error("[활동 태그] 제품 정렬 실패:", error);
      }
    });
  });
}

// 제품을 activity_tag로 정렬 (일치하는 것을 상위로, 신발은 아래로)
function sortProductsByActivityTag(products, activityTags) {
  if (!activityTags || !Array.isArray(activityTags) || activityTags.length === 0 || !products || products.length === 0) {
    return products;
  }

  // activity_tag 배열을 소문자로 정규화 (전역 변수로 만들어서 디버깅에서 사용 가능하게)
  window.normalizedTags = activityTags.map(tag => String(tag).toLowerCase().trim());
  const normalizedTags = window.normalizedTags;
  
  // 신발 카테고리 확인 함수
  const isShoes = (product) => {
    const mainCategory = String(product?.main_category || "").toLowerCase().trim();
    const subCategory = String(product?.sub_category || "").toLowerCase().trim();
    return mainCategory === "shoes" || subCategory.includes("shoes") || subCategory.includes("신발");
  };
  
  return [...products].sort((a, b) => {
    const aTag = String(a?.activity_tag || "").toLowerCase().trim();
    const bTag = String(b?.activity_tag || "").toLowerCase().trim();
    
    // 배열 내의 태그와 일치하는지 확인
    const aMatch = normalizedTags.includes(aTag);
    const bMatch = normalizedTags.includes(bTag);
    
    // 신발 여부 확인
    const aIsShoes = isShoes(a);
    const bIsShoes = isShoes(b);
    
    // 1순위: activity_tag 일치 여부
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    
    // 2순위: 둘 다 일치하거나 둘 다 불일치한 경우, 신발은 아래로
    if (aIsShoes && !bIsShoes) return 1;  // a가 신발이면 아래로
    if (!aIsShoes && bIsShoes) return -1; // b가 신발이면 아래로
    
    // 둘 다 신발이거나 둘 다 신발이 아니면 원래 순서 유지
    return 0;
  });
}

// 액티비티 태그 전환 기능 (제거됨 - 이제 updateActivityTagsBasedOnProducts에서 동적으로 처리)
// 기존 HTML 버튼이 있으면 초기화
if (document.querySelectorAll(".activity-tag").length > 0) {
  setupActivityTagListeners();
}

// 주석 처리된 기존 코드 (제품 로드 후 동적으로 버튼이 생성되므로 불필요)
/*
activityTags.forEach((tag) => {
  tag.addEventListener("click", async (e) => {
    const clickedTag = e.target;
    const tagText = clickedTag.textContent.trim();
    
    // active 상태 토글
    const section = clickedTag.closest("section");
    const sectionActivityTags = section.querySelectorAll(".activity-tag");
    switchTab(clickedTag, sectionActivityTags);
    
    // 활동별 추천 섹션에서만 작동
    if (section?.id !== "activity-section") return;
    
    const productGrid = section.querySelector(".product-grid");
    if (!productGrid) return;
    
    // 저장된 제품 데이터 가져오기
    const storedProducts = productGrid.dataset.allProducts;
    if (!storedProducts) {
      console.warn("[활동 태그] 저장된 제품 데이터가 없습니다.");
      return;
    }
    
    try {
      const allProducts = JSON.parse(storedProducts);
      const activityTags = mapActivityTagToAPI(tagText);
      
      if (!activityTags) {
        console.warn(`[활동 태그] ${tagText}에 대한 매핑이 없습니다.`);
        return;
      }
      
      console.log(`[활동 태그] ${tagText} 클릭, activity_tags:`, activityTags);
      
      // 디버깅: 실제 제품들의 activity_tag 값 확인
      const activityTagCounts = {};
      const activityTagValues = [];
      allProducts.forEach(p => {
        const tag = String(p?.activity_tag || 'null').toLowerCase();
        activityTagCounts[tag] = (activityTagCounts[tag] || 0) + 1;
        if (p?.activity_tag) {
          activityTagValues.push(String(p.activity_tag).toLowerCase());
        }
      });
      console.log(`[활동 태그 디버깅] ${tagText} 클릭 시:`);
      console.log(`  - 전체 제품 수: ${allProducts.length}`);
      console.log(`  - activity_tag가 있는 제품: ${allProducts.filter(p => p?.activity_tag).length}`);
      console.log(`  - activity_tag 분포:`, activityTagCounts);
      console.log(`  - 검색할 태그들:`, activityTags);
      console.log(`  - 실제 DB의 activity_tag 값 샘플 (최대 10개):`, [...new Set(activityTagValues)].slice(0, 10));
      
      // activity_tag 배열로 정렬
      const sortedProducts = sortProductsByActivityTag(allProducts, activityTags);
      
      // 일치하는 제품 수 확인
      const normalizedTags = window.normalizedTags || activityTags.map(tag => String(tag).toLowerCase().trim());
      const matchingProducts = sortedProducts.filter(p => {
        const productTag = String(p?.activity_tag || "").toLowerCase().trim();
        return normalizedTags.includes(productTag);
      });
      console.log(`  - ${tagText} 태그와 일치하는 제품 수: ${matchingProducts.length}`);
      
      // 제품 목록에 activity_tag가 있는지 확인
      const hasActivityTag = sortedProducts.some(p => p?.activity_tag);
      if (!hasActivityTag) {
        console.warn("[활동 태그] 제품 데이터에 activity_tag 필드가 없어 필터링할 수 없습니다.");
        // activity_tag가 없으면 원래대로 표시
        renderProductsToGrid(productGrid, allProducts, 9, false);
        return;
      }
      
      // 일치하는 제품이 0개이면 경고 표시하고 원래 데이터로 되돌림
      if (matchingProducts.length === 0) {
        console.warn(`[활동 태그] ${tagText} 태그와 일치하는 제품이 없습니다. 원래 데이터로 되돌립니다.`);
        // 원래 데이터로 되돌림
        renderProductsToGrid(productGrid, allProducts, 9, false, true);
        // 버튼 비활성화 (클릭한 버튼에서 active 클래스 제거)
        clickedTag.classList.remove("active");
        // 첫 번째 버튼을 active로 설정 (또는 기본값으로)
        const firstTag = sectionActivityTags[0];
        if (firstTag) {
          firstTag.classList.add("active");
        }
        alert(`${tagText} 태그와 일치하는 제품이 없습니다.`);
        return;
      }
      
      // 일치하는 제품이 상위로 정렬된 목록으로 재렌더링
      // preserveOriginalData=true로 설정하여 원본 데이터를 유지
      renderProductsToGrid(productGrid, sortedProducts, 9, false, true);
      
      console.log(`[활동 태그] 제품 정렬 완료: 총 ${sortedProducts.length}개`);
    } catch (error) {
      console.error("[활동 태그] 제품 정렬 실패:", error);
    }
  });
});
*/

// 스냅 태그 전환 기능
snapTags.forEach((tag) => {
  tag.addEventListener("click", (e) => {
    const section = e.target.closest("section");
    const sectionSnapTags = section.querySelectorAll(".snap-tag");
    switchTab(e.target, sectionSnapTags);
  });
});

// 좋아요 버튼 토글 기능
likeButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const heartIcon = button.querySelector("svg path");

    if (heartIcon.style.fill === "red") {
      heartIcon.style.fill = "none";
      heartIcon.style.stroke = "#000";
    } else {
      heartIcon.style.fill = "red";
      heartIcon.style.stroke = "red";
    }

    button.style.transform = "scale(1.2)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 200);
  });
});

// 각 섹션별 추가 상품 데이터
const additionalProducts = {
  weather: [
    { brand: "나이키", name: "에어 맥스 90", price: "129,000원" },
    { brand: "아디다스", name: "슈퍼스타", price: "99,000원" },
    { brand: "컨버스", name: "척 테일러 70", price: "89,000원" },
    {
      brand: "러닝라이프",
      name: "스포츠 반바지 쇼츠 에센셜",
      price: "28,900원",
    },
    { brand: "러닝라이프", name: "스포츠 러닝 탱크톱", price: "19,900원" },
    { brand: "나이키", name: "드라이 핏 쇼츠", price: "45,000원" },
    { brand: "아디다스", name: "클리마쿨 티셔츠", price: "35,000원" },
    { brand: "컨버스", name: "원스타", price: "79,000원" },
    { brand: "뉴발란스", name: "327 스니커즈", price: "99,000원" },
  ],
  activity: [
    { brand: "뉴발란스", name: "574 클래식", price: "89,000원" },
    { brand: "아디다스", name: "울트라부스트", price: "189,000원" },
    { brand: "나이키", name: "에어 조던 1", price: "139,000원" },
    { brand: "뉴발란스", name: "530 스니커즈", price: "119,000원" },
    { brand: "아디다스", name: "삼바", price: "89,000원" },
    { brand: "나이키", name: "블레이저 미드", price: "99,000원" },
    { brand: "뉴발란스", name: "410 트레일", price: "79,000원" },
    { brand: "아디다스", name: "가젤", price: "109,000원" },
    { brand: "나이키", name: "코르테즈", price: "95,000원" },
  ],
  photo: [
    { brand: "스냅코디", name: "미니멀 스니커즈", price: "139,000원" },
    { brand: "스냅코디", name: "컬러풀 플랫 슈즈", price: "79,000원" },
    { brand: "스냅코디", name: "트렌디 샌들", price: "59,000원" },
    { brand: "스냅코디", name: "유니크 에스파드류", price: "89,000원" },
    { brand: "스냅코디", name: "스타일리시 로퍼", price: "99,000원" },
    { brand: "스냅코디", name: "모던 앵클 부츠", price: "149,000원" },
    { brand: "스냅코디", name: "레트로 스니커즈", price: "119,000원" },
    { brand: "스냅코디", name: "컬러 블록 슈즈", price: "109,000원" },
    { brand: "스냅코디", name: "세련된 옥스퍼드", price: "129,000원" },
  ],
  snap: [
    { brand: "스냅코디", name: "스타일리시 재킷", price: "179,000원" },
    { brand: "스냅코디", name: "유니크 가디건", price: "99,000원" },
    { brand: "스냅코디", name: "모던 트렌치코트", price: "219,000원" },
    { brand: "스냅코디", name: "레트로 패딩", price: "169,000원" },
    { brand: "스냅코디", name: "컬러풀 파카", price: "149,000원" },
    { brand: "스냅코디", name: "세련된 블레이저", price: "189,000원" },
    { brand: "스냅코디", name: "캐주얼 코튼 셔츠", price: "79,000원" },
    { brand: "스냅코디", name: "데님 재킷", price: "139,000원" },
    { brand: "스냅코디", name: "크롭 후디", price: "89,000원" },
  ],
};

// 상품 카드 생성 함수
function createProductCard(product, sectionType) {
  const card = document.createElement("div");
  card.className = "product-card";

  const productInfoHTML =
    sectionType === "snap"
      ? ""
      : `
    <div class="product-info">
      <div class="brand">${product.brand}</div>
      <div class="product-name">${product.name}</div>
      <div class="price">${product.price}</div>
      <div class="coupon">쿠폰</div>
    </div>
  `;

  card.innerHTML = `
    <div class="product-image">
      <button class="like-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M17.5 6.25C17.5 3.75 15.5 2.5 13.75 2.5C12.5 2.5 11.25 3.25 10.5 4.25C9.75 3.25 8.5 2.5 7.25 2.5C5.5 2.5 3.5 3.75 3.5 6.25C3.5 8.75 10.5 15 10.5 15S17.5 8.75 17.5 6.25Z"
            stroke="#000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    ${productInfoHTML}
  `;

  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const heartIcon = likeBtn.querySelector("svg path");
    if (heartIcon.style.fill === "red") {
      heartIcon.style.fill = "none";
      heartIcon.style.stroke = "#000";
    } else {
      heartIcon.style.fill = "red";
      heartIcon.style.stroke = "red";
    }
    likeBtn.style.transform = "scale(1.2)";
    setTimeout(() => {
      likeBtn.style.transform = "scale(1)";
    }, 200);
  });

  if (sectionType !== "snap") {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".like-btn")) return;
      window.location.href = "../Detail/navigation.html";
    });
  }

  return card;
}

// 섹션별 상품 인덱스 추적
const sectionProductIndices = {
  weather: 0,
  activity: 0,
  photo: 0,
  snap: 0,
};

const sectionInitialCounts = {
  weather: 9,
  activity: 6,
  photo: 6,
  snap: 9,
};

const sectionAddedCards = {
  weather: [],
  activity: [],
  photo: [],
  snap: [],
};

function getSectionType(section) {
  if (section.id === "weather-section") return "weather";
  if (section.id === "activity-section") return "activity";
  if (section.id === "photo-section") return "photo";
  if (section.id === "snap-section") return "snap";
  return null;
}

function createCloseButton(section, sectionType) {
  const existingCloseBtn = section.querySelector(".close-btn");
  if (existingCloseBtn) existingCloseBtn.remove();

  const closeBtn = document.createElement("button");
  closeBtn.className = "close-btn";
  closeBtn.textContent = "닫기";

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeBtn.style.transform = "translateY(-2px)";
    closeBtn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
    setTimeout(() => {
      closeBtn.style.transform = "translateY(0)";
      closeBtn.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
    }, 200);

    const addedCards = sectionAddedCards[sectionType];
    addedCards.forEach((card) => card.remove());
    sectionAddedCards[sectionType] = [];
    sectionProductIndices[sectionType] = 0;
    closeBtn.remove();

    const moreBtn = section.querySelector(".more-btn");
    if (moreBtn) moreBtn.style.display = "flex";
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  return closeBtn;
}

moreButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    button.style.transform = "translateY(-2px)";
    button.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
    setTimeout(() => {
      button.style.transform = "translateY(0)";
      button.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
    }, 200);

    const section = button.closest("section");
    if (!section) return;

    const sectionType = getSectionType(section);
    if (!sectionType) return;

    const productGrid = section.querySelector(".product-grid");
    if (!productGrid) return;

    const products = additionalProducts[sectionType];
    const currentIndex = sectionProductIndices[sectionType];
    const productsToAdd = products.slice(currentIndex, currentIndex + 9);

    if (productsToAdd.length === 0) {
      button.style.display = "none";
      return;
    }

    productsToAdd.forEach((product) => {
      const card = createProductCard(product, sectionType);
      productGrid.appendChild(card);
      sectionAddedCards[sectionType].push(card);
    });

    sectionProductIndices[sectionType] += productsToAdd.length;
    button.style.display = "none";

    const closeBtn = createCloseButton(section, sectionType);
    section.appendChild(closeBtn);
  });
});

const productCards = document.querySelectorAll(".product-card");
productCards.forEach((card) => {
  const isSnapCard = card.closest(".snap-section");
  if (!isSnapCard) {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".like-btn")) return;
      window.location.href = "../Detail/navigation.html";
    });
  }
});

const refreshButtons = document.querySelectorAll(".refresh-btn");
refreshButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const icon = button.querySelector("svg");
    icon.style.transform = "rotate(360deg)";
    icon.style.transition = "transform 0.5s ease";
    setTimeout(() => {
      icon.style.transform = "rotate(0deg)";
    }, 500);
    console.log("날씨 정보 새로고침");
  });
});

window.addEventListener("scroll", () => {
  const topNav = document.querySelector(".top-nav");
  if (!topNav) return; // topNav가 없으면 종료
  
  if (window.scrollY > 50) {
    topNav.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  } else {
    topNav.style.boxShadow = "none";
  }
});

let isScrolledToSections = false;

function scrollToSection(sectionId) {
  const allSections = document.querySelectorAll('section[id$="-section"]');
  allSections.forEach((section) => {
    section.style.display = "none";
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = "block";

    if (!isScrolledToSections) {
      const heroSection = document.querySelector(".hero-section");
      const topNav = document.querySelector(".top-nav");
      if (heroSection && topNav) {
        const scrollPosition =
          heroSection.offsetTop +
          heroSection.offsetHeight -
          topNav.offsetHeight -
          20;
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
        isScrolledToSections = true;
      }
    }
  }

  updateAllTabStates(sectionId);
}

function updateAllTabStates(sectionId) {
  const allSectionTabs = document.querySelectorAll(".section-tabs");
  allSectionTabs.forEach((sectionTabs) => {
    const tabButtons = sectionTabs.querySelectorAll(".tab-btn");
    tabButtons.forEach((button) => {
      button.classList.remove("active");
      const onclickAttr = button.getAttribute("onclick");
      if (onclickAttr && onclickAttr.includes(sectionId)) {
        button.classList.add("active");
      }
    });
  });
}

function initializeSectionNavBars() {
  const activitySection = document.getElementById("activity-section");
  if (activitySection) {
    const activityNavTabs = activitySection.querySelector(".section-tabs");
    if (activityNavTabs) {
      const tabButtons = activityNavTabs.querySelectorAll(".tab-btn");
      tabButtons.forEach((button) => {
        button.classList.remove("active");
        if (button.textContent.trim() === "활동별 추천") {
          button.classList.add("active");
        }
      });
    }
  }

  const photoSection = document.getElementById("photo-section");
  if (photoSection) {
    const photoNavTabs = photoSection.querySelector(".section-tabs");
    if (photoNavTabs) {
      const tabButtons = photoNavTabs.querySelectorAll(".tab-btn");
      tabButtons.forEach((button) => {
        button.classList.remove("active");
        if (button.textContent.trim() === "사진용 추천") {
          button.classList.add("active");
        }
      });
    }
  }

  const snapSection = document.getElementById("snap-section");
  if (snapSection) {
    const snapNavTabs = snapSection.querySelector(".section-tabs");
    if (snapNavTabs) {
      const tabButtons = snapNavTabs.querySelectorAll(".tab-btn");
      tabButtons.forEach((button) => {
        button.classList.remove("active");
        if (button.textContent.trim() === "SNAP 코디") {
          button.classList.add("active");
        }
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("페이지 로드 완료");

  // 페이지 내용 동적 업데이트
  updatePageContent();

  // 초기 제품 로드
  const config = getCurrentCountryConfig();

  // URL에서 region_id 확인, 없으면 기본 regionId 사용
  const params = new URLSearchParams(window.location.search);
  const regionId = params.get("region_id");
  const initialRegionId = regionId ? parseInt(regionId) : config.regionId;

  loadProductsForRegion(initialRegionId);

  isScrolledToSections = false;
  initializeSectionNavBars();

  const activeTabs = document.querySelectorAll(".tab-btn.active");
  console.log(`활성 탭: ${activeTabs.length}개`);
});

window.addEventListener("error", (e) => {
  console.error("JavaScript 에러:", e.error);
});

window.addEventListener("load", () => {
  const loadTime = performance.now();
  console.log(`페이지 로드 시간: ${loadTime.toFixed(2)}ms`);
});
