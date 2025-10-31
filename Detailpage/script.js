// 국가별 설정
const countryConfig = {
  일본: {
    regionId: 1, // 도쿄 (기본값)
    regions: [
      { id: 1, name: "도쿄" },
      { id: 2, name: "오사카" },
    ],
    heroTitle: "일본 거리에서 만나는<br />여행과 스타일의 완벽한 조합",
    defaultRegion: "후쿠오카",
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
  let selectedRegion = config.defaultRegion;
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

  // 날씨 정보 업데이트
  const weatherTemp = document.getElementById("weather-temp");
  if (weatherTemp) {
    weatherTemp.textContent = `${selectedRegion} 28.2°C | `;
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
        weatherTemp.textContent = `${region.name} 28.2°C | `;
      }

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
  const userId = determineUserId(regionId);

  console.log(`제품 로드: region_id=${regionId}, 사용할 user_id=${userId}`);

  try {
    // 날씨별 추천
    await loadSectionProducts("weather-section", userId, "climate");

    // 활동별 추천
    await loadSectionProducts("activity-section", userId, "activity");

    // 사진용 추천 (photo)
    await loadSectionProducts("photo-section", userId, "photo");
  } catch (error) {
    console.error("제품 로드 실패:", error);
  }
}

// 섹션별 제품 로드
async function loadSectionProducts(sectionId, userId, type) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const productGrid = section.querySelector(".product-grid");
  if (!productGrid) return;

  const base = "/.netlify/functions/db";
  let url = "";

  // userId가 있으면 유저 뷰 사용, 없으면 게스트 추천 사용
  if (userId) {
    if (type === "climate") {
      url = `${base}?op=user_country_climate_top&user_id=${userId}&limit=20`;
    } else if (type === "activity") {
      url = `${base}?op=user_country_activity_top&user_id=${userId}&limit=20`;
    } else if (type === "photo") {
      url = `${base}?op=user_country_photo_top&user_id=${userId}&limit=20`;
    }
  } else {
    // userId가 없으면 게스트 추천 사용 (기후/활동만, 사진은 없음)
    if (type === "climate") {
      url = `${base}?op=guest_reco_climate`;
    } else if (type === "activity") {
      url = `${base}?op=guest_reco_activity`;
    } else if (type === "photo") {
      // 사진용 추천은 게스트용이 없으므로 빈 배열
      console.log("사진용 추천은 유저 전용입니다.");
      return;
    }
  }

  if (!url) return;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const products = data?.rows || data?.data?.rows || [];

    if (products.length > 0) {
      renderProductsToGrid(productGrid, products);
      console.log(
        `${type} 섹션: ${products.length}개 제품 로드 완료 (user_id: ${userId})`
      );
    } else {
      console.warn(`${type} 섹션: 제품이 없습니다 (user_id: ${userId})`);
    }
  } catch (error) {
    console.error(`${type} 제품 로드 실패:`, error);
  }
}

// 제품 그리드에 제품 렌더링
function renderProductsToGrid(grid, products) {
  // 기존 제품 제거 (하드코딩된 것들 제외하고 동적으로 추가된 것만)
  const dynamicProducts = grid.querySelectorAll(
    ".product-card[data-dynamic='true']"
  );
  dynamicProducts.forEach((card) => card.remove());

  products.slice(0, 9).forEach((product) => {
    const card = createProductCardFromAPI(product);
    card.setAttribute("data-dynamic", "true");
    grid.appendChild(card);
  });
}

// API 데이터로 제품 카드 생성
function createProductCardFromAPI(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.productId = product.product_id || "";

  const price = Number(product.price || 0).toLocaleString();
  const name = (product.product_name || "").replace(/\s+/g, " ").trim();
  const brand = product.brand || "";
  const imgUrl =
    product.img_url ||
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=260&h=312&fit=crop";
  const discountRate = product.discount_rate
    ? Math.round(product.discount_rate)
    : null;

  const discountHTML =
    discountRate > 0 ? `<span class="discount">${discountRate}%</span>` : "";

  card.innerHTML = `
    <div class="product-image">
      <img src="${imgUrl}" alt="${name}" loading="lazy" />
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
    if (productId) {
      window.location.href = `../Detail/navigation.html?product_id=${productId}`;
    } else {
      window.location.href = "../Detail/navigation.html";
    }
  });

  return card;
}

// 로컬 스토리지에서 유저 정보 가져오기 (메인 페이지와 동일)
function getUserFromStorage() {
  try {
    const stored = localStorage.getItem("fitpl_user");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("로컬 스토리지 파싱 오류:", e);
    return null;
  }
}

// DOM 요소 선택
const tabButtons = document.querySelectorAll(".tab-btn");
const weatherTags = document.querySelectorAll(".weather-tag");
const activityTags = document.querySelectorAll(".activity-tag");
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

// 액티비티 태그 전환 기능
activityTags.forEach((tag) => {
  tag.addEventListener("click", (e) => {
    const section = e.target.closest("section");
    const sectionActivityTags = section.querySelectorAll(".activity-tag");
    switchTab(e.target, sectionActivityTags);
  });
});

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
