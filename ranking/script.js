// 상품 데이터
const products = [
  {
    id: 1,
    brand: "나이키",
    name: "에어 포스 1 '07 화이트 / CW2288-111",
    price: 119000,
    originalPrice: 140000,
    discount: 15,
    category: "신발",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=240&fit=crop",
  },
  {
    id: 2,
    brand: "아디다스",
    name: "스탠 스미스 화이트 / FX5502",
    price: 89000,
    originalPrice: null,
    discount: 0,
    category: "신발",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=240&fit=crop",
  },
  {
    id: 3,
    brand: "유니클로",
    name: "에어리즘 UV 컷 롱 슬리브 셔츠 화이트 / 425341",
    price: 19900,
    originalPrice: 24900,
    discount: 20,
    category: "상의",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=240&fit=crop",
  },
  {
    id: 4,
    brand: "자라",
    name: "린넨 블렌드 쇼트 팬츠 베이지 / 123456",
    price: 39900,
    originalPrice: null,
    discount: 0,
    category: "하의",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=240&fit=crop",
  },
  {
    id: 5,
    brand: "H&M",
    name: "린넨 블렌드 쇼트 팬츠 화이트 / 789012",
    price: 24900,
    originalPrice: 35600,
    discount: 30,
    category: "하의",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=240&fit=crop",
  },
  {
    id: 6,
    brand: "무지",
    name: "코튼 린넨 블렌드 쇼트 슬리브 티셔츠 화이트 / 345678",
    price: 12900,
    originalPrice: null,
    discount: 0,
    category: "상의",
    image:
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=200&h=240&fit=crop",
  },
  {
    id: 7,
    brand: "컨버스",
    name: "척 테일러 올스타 클래식 로우 화이트 / 162050C",
    price: 58500,
    originalPrice: 65000,
    discount: 10,
    category: "신발",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=240&fit=crop",
  },
  {
    id: 8,
    brand: "에스티 로더",
    name: "더블 웨어 파운데이션 SPF10 PA++ 30ml / 1W1",
    price: 65000,
    originalPrice: null,
    discount: 0,
    category: "뷰티",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=240&fit=crop",
  },
  {
    id: 9,
    brand: "라네즈",
    name: "워터뱅크 하이드로 크림 50ml / 901234",
    price: 22500,
    originalPrice: 30000,
    discount: 25,
    category: "뷰티",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=240&fit=crop",
  },
  {
    id: 10,
    brand: "아토팜",
    name: "베이비 로션 200ml / 567890",
    price: 18900,
    originalPrice: null,
    discount: 0,
    category: "뷰티",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=240&fit=crop",
  },
];

// 상품 데이터를 60개로 확장
const extendedProducts = [];
for (let i = 0; i < 6; i++) {
  products.forEach((product) => {
    extendedProducts.push({
      ...product,
      id: product.id + i * 10,
      name: `${product.name} (${i + 1})`,
    });
  });
}

// 상품 렌더링 함수
function renderProducts() {
  const productsGrid = document.querySelector(".products-grid");
  if (!productsGrid) return;

  productsGrid.innerHTML = extendedProducts
    .map(
      (product) => `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" />
        <button class="like-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 17L8.5 15.5C3.5 10.5 0 7.5 0 5C0 2.5 2.5 0 5 0C6.5 0 8 0.5 9 1.5C10 0.5 11.5 0 13 0C15.5 0 18 2.5 18 5C18 7.5 14.5 10.5 9.5 15.5L10 17Z"
              stroke="#666"
              stroke-width="2"
            />
          </svg>
        </button>
      </div>
      <div class="product-info">
        <div class="brand">${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="price-info">
          ${
            product.discount > 0
              ? `<span class="discount">${product.discount}%</span>`
              : ""
          }
          <span class="price">${product.price.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  // 렌더링 후 상품 카드에 이벤트 리스너 추가
  addProductCardEventListeners();
}

// 상품 카드 이벤트 리스너 추가 함수
function addProductCardEventListeners() {
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    // 호버 효과 제거됨

    // 상품 카드 클릭 시 상세 페이지로 이동
    card.addEventListener("click", (e) => {
      if (e.target.closest(".like-btn")) {
        return;
      }

      const productCard = e.currentTarget;
      const productId = productCard.getAttribute("data-product-id") || "";
      const source = productCard.getAttribute("data-source") || "";
      const regionId = productCard.getAttribute("data-region-id") || "";

      if (!productId) {
        window.location.href = "../Detail/navigation.html";
        return;
      }

      const params = new URLSearchParams();
      params.set("product_id", productId);
      if (source) params.set("source", source);
      if (regionId) params.set("region_id", regionId);

      let url = `../Detail/navigation.html?${params.toString()}`;
      // utm_source 파라미터 유지
      if (typeof window.preserveUTMParams === 'function') {
        url = window.preserveUTMParams(url);
      }
      window.location.href = url;
    });
  });
}

// 랭킹 제품 로드 (API)
async function loadRankingProducts() {
  const base = "/.netlify/functions/db";
  const url = `${base}?op=product_ranking&limit=60&order=monthly_views_desc`;

  try {
    console.log("[랭킹] API 호출:", url);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[랭킹] HTTP 에러 ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("[랭킹] 응답:", {
      ok: data?.ok,
      rows: data?.rows?.length || 0,
      error: data?.error,
    });

    const products = data?.rows || data?.data?.rows || [];

    if (products.length > 0) {
      renderProductsFromAPI(products);
      console.log(`[랭킹] ${products.length}개 제품 렌더링 완료`);
    } else {
      console.warn("제품 데이터가 없어 기본 렌더링 사용");
      renderProducts();
    }
  } catch (error) {
    console.error("랭킹 제품 로드 실패:", error);
    // 실패 시 기본 렌더링 사용
    renderProducts();
  }
}

// API 데이터로 제품 렌더링 (랭킹용 - rank-number 포함)
function renderProductsFromAPI(products) {
  const productsGrid = document.querySelector(".products-grid");
  if (!productsGrid) return;

  productsGrid.innerHTML = products
    .map((product, index) => {
      const rank = index + 1;
      const price = Number(product.price || 0).toLocaleString();
      const name = (product.product_name || "").replace(/\s+/g, " ").trim();
      const brand = product.brand || "";
      const imgUrl =
        product.img_url ||
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=260&h=312&fit=crop";
      const discountRate = product.discount_rate
        ? Math.round(product.discount_rate)
        : null;

      return `
      <div
        class="product-card"
        data-product-id="${product.product_id || ""}"
        data-source="product_ranking"
        data-region-id="${product.region_id || ""}"
      >
        <div class="product-image">
          <div class="rank-number">${rank}</div>
          <img src="${imgUrl}" alt="${name}" loading="lazy" />
          <button class="like-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 17L8.5 15.5C3.5 10.5 0 7.5 0 5C0 2.5 2.5 0 5 0C6.5 0 8 0.5 9 1.5C10 0.5 11.5 0 13 0C15.5 0 18 2.5 18 5C18 7.5 14.5 10.5 9.5 15.5L10 17Z"
                stroke="#666"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>
        <div class="product-info">
          <div class="brand">${brand}</div>
          <div class="product-name">${name}</div>
          <div class="price-info">
            ${
              discountRate > 0
                ? `<span class="discount">${discountRate}%</span>`
                : ""
            }
            <span class="price">${price}원</span>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  // 동적으로 생성된 상품 카드에 클릭 이벤트 추가
  addProductCardEventListeners();
}

// 페이지 로드 시 상품 렌더링
document.addEventListener("DOMContentLoaded", function () {
  // API에서 랭킹 제품 로드
  loadRankingProducts();

  // 정적 HTML 상품 카드들에도 클릭 이벤트 추가
  addStaticProductCardEventListeners();
});

// 정적 HTML 상품 카드 클릭 이벤트 추가 함수
function addStaticProductCardEventListeners() {
  const staticProductCards = document.querySelectorAll(
    ".products-grid .product-card[data-product-id]"
  );

  staticProductCards.forEach((card) => {
    // 호버 효과 제거됨

    // 상품 카드 클릭 시 상세 페이지로 이동
    card.addEventListener("click", (e) => {
      // 좋아요 버튼 클릭은 제외
      if (e.target.closest(".like-btn")) {
        return;
      }

      // 상품 ID를 가져와서 상세 페이지로 이동
      const productId = card.getAttribute("data-product-id");

      // Detail 페이지로 이동 (상품 ID를 쿼리 파라미터로 전달)
      window.location.href = `../Detail/navigation.html?id=${productId}`;
    });
  });
}

// DOM 요소들
const filterBtns = document.querySelectorAll(".filter-btn");
const categoryBtns = document.querySelectorAll(".category-btn");
const likeBtns = document.querySelectorAll(".like-btn");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const navLinks = document.querySelectorAll(".nav-link");
const logoutBtn = document.querySelector(".logout-btn");

// FITPL 버튼 클릭 이벤트
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    // 현재 페이지이므로 새로고침 또는 다른 동작
    window.location.reload();
  });
}

// 국가 필터 기능
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // 모든 버튼에서 active 클래스 제거
    filterBtns.forEach((b) => b.classList.remove("active"));
    // 클릭된 버튼에 active 클래스 추가
    btn.classList.add("active");

    // 여기서 실제 필터링 로직을 구현할 수 있습니다
    const selectedCountry = btn.textContent;
    console.log("선택된 국가:", selectedCountry);

    // 예시: 상품 필터링
    filterProductsByCountry(selectedCountry);
  });
});

// 카테고리 필터 기능
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // 모든 버튼에서 active 클래스 제거
    categoryBtns.forEach((b) => b.classList.remove("active"));
    // 클릭된 버튼에 active 클래스 추가
    btn.classList.add("active");

    const selectedCategory = btn.textContent;
    console.log("선택된 카테고리:", selectedCategory);

    // 상품 필터링
    filterProductsByCategory(selectedCategory);
  });
});

// 좋아요 버튼 기능
likeBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    btn.classList.toggle("liked");

    // 좋아요 상태에 따른 시각적 변화
    const svg = btn.querySelector("svg path");
    if (btn.classList.contains("liked")) {
      svg.style.fill = "#f31110";
      svg.style.stroke = "#f31110";
    } else {
      svg.style.fill = "none";
      svg.style.stroke = "#666";
    }

    console.log("좋아요 상태 변경");
  });
});

// 검색 섹션 클릭 시 검색 페이지로 이동
(function setupSearchSectionRedirect() {
  console.log("[검색 리디렉션] 초기화 시작...");

  function redirectToSearch() {
    console.log("[검색 리디렉션] 🔵🔵🔵 리디렉션 실행!");
    window.location.href = "../search/index.html";
  }

  function initRedirect() {
    const searchSection = document.querySelector(".search-section");
    if (!searchSection) {
      console.log(
        "[검색 리디렉션] search-section 요소를 찾을 수 없습니다. 재시도 중..."
      );
      setTimeout(initRedirect, 100);
      return;
    }

    console.log("[검색 리디렉션] ✅ search-section 요소 발견!");
    searchSection.style.cursor = "pointer";

    // 검색 입력창과 버튼 찾기
    const searchInput = searchSection.querySelector(".search-input");
    const searchBtnInSection = searchSection.querySelector(".search-btn");

    console.log("[검색 리디렉션] 요소 확인:", {
      searchInput: !!searchInput,
      searchBtnInSection: !!searchBtnInSection,
      searchInputId: searchInput?.id,
      searchBtnClass: searchBtnInSection?.className,
    });

    // 검색 입력창 처리
    if (searchInput) {
      // 기존 이벤트 리스너 제거를 위해 요소 복제
      const newInput = searchInput.cloneNode(true);
      if (searchInput.parentNode) {
        searchInput.parentNode.replaceChild(newInput, searchInput);
      }

      const input = searchSection.querySelector(".search-input");
      if (input) {
        input.style.cursor = "pointer";
        input.readOnly = true; // 입력 불가능하게 설정
        input.setAttribute("tabindex", "0");

        // 여러 이벤트 타입으로 처리
        const handlers = {
          click: function (e) {
            console.log("[검색 리디렉션] 🔵 입력창 클릭!");
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            redirectToSearch();
            return false;
          },
          mousedown: function (e) {
            console.log("[검색 리디렉션] 🔵 입력창 마우스다운!");
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            redirectToSearch();
            return false;
          },
          focus: function (e) {
            console.log("[검색 리디렉션] 🔵 입력창 포커스!");
            e.preventDefault();
            e.stopPropagation();
            redirectToSearch();
            return false;
          },
          keydown: function (e) {
            if (e.key === "Enter" || e.keyCode === 13) {
              console.log("[검색 리디렉션] 🔵 입력창 Enter!");
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              redirectToSearch();
              return false;
            }
          },
        };

        // 모든 이벤트를 capture phase에서 등록
        Object.entries(handlers).forEach(([event, handler]) => {
          input.addEventListener(event, handler, true);
        });
      }
    }

    // 검색 버튼 처리
    if (searchBtnInSection) {
      // 기존 이벤트 리스너 제거를 위해 요소 복제
      const newBtn = searchBtnInSection.cloneNode(true);
      if (searchBtnInSection.parentNode) {
        searchBtnInSection.parentNode.replaceChild(newBtn, searchBtnInSection);
      }

      const btn = searchSection.querySelector(".search-btn");
      if (btn) {
        const handlers = {
          click: function (e) {
            console.log("[검색 리디렉션] 🔵 버튼 클릭!");
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            redirectToSearch();
            return false;
          },
          mousedown: function (e) {
            console.log("[검색 리디렉션] 🔵 버튼 마우스다운!");
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            redirectToSearch();
            return false;
          },
        };

        // 모든 이벤트를 capture phase에서 등록
        Object.entries(handlers).forEach(([event, handler]) => {
          btn.addEventListener(event, handler, true);
        });
      }
    }

    // 검색 섹션 전체 클릭 처리 (최후의 수단)
    const sectionHandler = function (e) {
      const clickedInput = e.target.closest(".search-input");
      const clickedBtn = e.target.closest(".search-btn");

      if (!clickedInput && !clickedBtn) {
        console.log("[검색 리디렉션] 🔵 섹션 클릭!");
        redirectToSearch();
      }
    };

    searchSection.addEventListener("click", sectionHandler, true);

    console.log("[검색 리디렉션] ✅ 설정 완료!");
  }

  // 즉시 실행 또는 DOM 로드 대기
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRedirect);
  } else {
    // DOM이 이미 로드된 경우 약간의 지연을 두고 실행
    setTimeout(initRedirect, 10);
  }
})();

// 상품 필터링 함수들
function filterProductsByCountry(country) {
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    if (country === "ALL") {
      product.style.display = "block";
    } else {
      // 실제로는 상품 데이터에 국가 정보가 있어야 함
      // 여기서는 예시로 랜덤하게 숨김/보임 처리
      const shouldShow = Math.random() > 0.5;
      product.style.display = shouldShow ? "block" : "none";
    }
  });
}

function filterProductsByCategory(category) {
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    if (category === "전체") {
      product.style.display = "block";
    } else {
      // 실제로는 상품 데이터에 카테고리 정보가 있어야 함
      const shouldShow = Math.random() > 0.3;
      product.style.display = shouldShow ? "block" : "none";
    }
  });
}

function searchProducts(searchTerm) {
  const products = document.querySelectorAll(".product-card");
  const term = searchTerm.toLowerCase();

  products.forEach((product) => {
    const productName = product
      .querySelector(".product-name")
      .textContent.toLowerCase();
    const brand = product.querySelector(".brand").textContent.toLowerCase();

    if (productName.includes(term) || brand.includes(term)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// 네비게이션 링크 클릭 처리
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    // 실제 프로토타입 연결에 따른 페이지 이동
    const linkText = link.textContent.trim();

    switch (linkText) {
      case "MUSINSA":
        console.log("MUSINSA 페이지로 이동");
        // window.location.href = '/musinsa';
        break;
      case "마이":
        console.log("마이 페이지로 이동");
        // window.location.href = '/mypage';
        break;
      case "장바구니":
        console.log("장바구니 페이지로 이동");
        // window.location.href = '/cart';
        break;
      default:
        console.log(`${linkText} 페이지로 이동`);
    }
  });
});

// 스크롤 이벤트 - 헤더 고정
let lastScrollTop = 0;
const header = document.querySelector(".top-nav");

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // 스크롤 다운
    header.style.transform = "translateY(-100%)";
  } else {
    // 스크롤 업
    header.style.transform = "translateY(0)";
  }

  lastScrollTop = scrollTop;
});

// 상품 카드 호버 효과 및 클릭 이벤트 (이미 addProductCardEventListeners 함수에서 처리됨)
// const productCards = document.querySelectorAll(".product-card");
// productCards.forEach((card) => {
//   card.addEventListener("mouseenter", () => {
//     card.style.transform = "translateY(-4px)";
//     card.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.15)";
//   });

//   card.addEventListener("mouseleave", () => {
//     card.style.transform = "translateY(0)";
//     card.style.boxShadow = "none";
//   });

//   // 상품 카드 클릭 시 장바구니로 이동
//   card.addEventListener("click", (e) => {
//     // 좋아요 버튼 클릭은 제외
//     if (e.target.closest('.like-btn')) {
//       return;
//     }

//     // 장바구니 페이지로 이동
//     window.location.href = '../cart/index.html';
//   });
// });

// 랭킹 아이템 클릭 처리
const rankingItems = document.querySelectorAll(".ranking-item");
rankingItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    console.log(`랭킹 ${index + 1}번 아이템 클릭`);
    // 상세 페이지로 이동하거나 모달 표시
  });
});

// 무한 스크롤 기능 비활성화 (빈 상품 카드 생성 방지)
// let isLoading = false;
// let currentPage = 1;

// function loadMoreProducts() {
//   if (isLoading) return;
//   isLoading = true;
//   // 로딩 인디케이터 표시
//   const loadingIndicator = document.createElement("div");
//   loadingIndicator.className = "loading-indicator";
//   loadingIndicator.textContent = "더 많은 상품을 불러오는 중...";
//   loadingIndicator.style.textAlign = "center";
//   loadingIndicator.style.padding = "20px";
//   loadingIndicator.style.color = "#666";
//   const productsGrid = document.querySelector(".products-grid");
//   productsGrid.appendChild(loadingIndicator);
//   // 실제로는 API 호출
//   setTimeout(() => {
//     // 새로운 상품들을 추가하는 로직
//     addMoreProducts();
//     // 로딩 인디케이터 제거
//     loadingIndicator.remove();
//     isLoading = false;
//     currentPage++;
//   }, 1500);
// }

// function addMoreProducts() {
//   const productsGrid = document.querySelector(".products-grid");
//   // 예시로 몇 개의 상품 카드를 추가
//   for (let i = 0; i < 4; i++) {
//     const productCard = createProductCard();
//     productsGrid.appendChild(productCard);
//   }
// }

// function createProductCard() {
//   const card = document.createElement("div");
//   card.className = "product-card";
//   card.innerHTML = `
//         <div class="product-image">
//             <img src="https://images.unsplash.com/photo-${
//               Math.floor(Math.random() * 1000) + 1500000000000
//             }-1594633312681-425c7b97ccd1?w=260&h=312&fit=crop" alt="New Product">
//             <button class="like-btn">
//                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                     <path d="M10 17L8.5 15.5C3.5 10.5 0 7.5 0 5C0 2.5 2.5 0 5 0C6.5 0 8 0.5 9 1.5C10 0.5 11.5 0 13 0C15.5 0 18 2.5 18 5C18 7.5 14.5 10.5 9.5 15.5L10 17Z" stroke="#666" stroke-width="2"/>
//                 </svg>
//             </button>
//         </div>
//         <div class="product-info">
//             <div class="brand">새로운 브랜드</div>
//             <div class="product-name">새로운 상품명 - 스타일링 아이템</div>
//             <div class="price-info">
//                 <span class="discount">${
//                   Math.floor(Math.random() * 50) + 10
//                 }%</span>
//                 <span class="price">${(
//                   Math.random() * 1000000 +
//                   100000
//                 ).toLocaleString()}원</span>
//             </div>
//         </div>
//     `;
//   // 새로 추가된 좋아요 버튼에 이벤트 리스너 추가
//   const likeBtn = card.querySelector(".like-btn");
//   likeBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     likeBtn.classList.toggle("liked");
//     const svg = likeBtn.querySelector("svg path");
//     if (likeBtn.classList.contains("liked")) {
//       svg.style.fill = "#f31110";
//       svg.style.stroke = "#f31110";
//     } else {
//       svg.style.fill = "none";
//       svg.style.stroke = "#666";
//     }
//   });
//   return card;
// }

// 스크롤 이벤트로 무한 스크롤 구현 (비활성화)
// window.addEventListener("scroll", () => {
//   if (
//     window.innerHeight + window.scrollY >=
//     document.body.offsetHeight - 1000
//   ) {
//     loadMoreProducts();
//   }
// });

// 반응형 메뉴 토글
const menuBtn = document.querySelector(".menu-btn");
const mobileMenu = document.createElement("div");
mobileMenu.className = "mobile-menu";
mobileMenu.style.display = "none";
mobileMenu.innerHTML = `
    <div class="mobile-menu-content">
        <a href="#" class="mobile-nav-link">MUSINSA</a>
        <a href="#" class="mobile-nav-link">BEAUTY</a>
        <a href="#" class="mobile-nav-link">PLAYER</a>
        <a href="#" class="mobile-nav-link">OUTLET</a>
        <a href="#" class="mobile-nav-link">BOUTIQUE</a>
        <a href="#" class="mobile-nav-link">SHOES</a>
        <a href="#" class="mobile-nav-link">KIDS</a>
        <a href="#" class="mobile-nav-link">USED</a>
        <a href="#" class="mobile-nav-link active">FITPL</a>
    </div>
`;

document.body.appendChild(mobileMenu);

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.style.display =
      mobileMenu.style.display === "none" ? "block" : "none";
  });
}

// 랭킹 호버 기능
const rankingRows = document.querySelectorAll(".ranking-row");
const rankingContents = document.querySelectorAll(".ranking-content");

rankingRows.forEach((row) => {
  row.addEventListener("mouseenter", () => {
    const country = row.getAttribute("data-country");

    // 모든 컨텐츠 영역 숨기기
    rankingContents.forEach((content) => {
      content.classList.remove("active");
    });

    // 해당 국가의 컨텐츠 표시
    const targetContent = document.getElementById(`${country}-content`);
    if (targetContent) {
      // 약간의 지연을 두고 컨텐츠 표시
      setTimeout(() => {
        targetContent.classList.add("active");
      }, 100);
    }
  });

  row.addEventListener("mouseleave", () => {
    // 마우스가 벗어나면 모든 컨텐츠 숨기기
    rankingContents.forEach((content) => {
      content.classList.remove("active");
    });
  });
});

// 컨텐츠 아이템들에 추가적인 인터랙션 효과
document.addEventListener("DOMContentLoaded", () => {
  const contentItems = document.querySelectorAll(".content-item");

  contentItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      // 호버된 아이템을 강조
      item.style.zIndex = "10";
    });

    item.addEventListener("mouseleave", () => {
      item.style.zIndex = "1";
    });
  });
});

// 부드러운 스크롤 함수
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - 100; // 헤더 높이만큼 오프셋

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

// 메인 배너 슬라이드 클릭 이벤트
document.addEventListener("DOMContentLoaded", () => {
  const firstBannerSlide = document.querySelector(".banner-slide:first-child");
  const secondBannerSlide = document.querySelector(
    ".banner-slide:nth-child(2)"
  );
  const thirdBannerSlide = document.querySelector(".banner-slide:nth-child(3)");

  if (firstBannerSlide) {
    firstBannerSlide.style.cursor = "pointer";
    firstBannerSlide.addEventListener("click", () => {
      smoothScrollTo("climate-recommendation");
    });
  }

  if (secondBannerSlide) {
    secondBannerSlide.style.cursor = "pointer";
    secondBannerSlide.addEventListener("click", () => {
      smoothScrollTo("activity-recommendation");
    });
  }

  if (thirdBannerSlide) {
    thirdBannerSlide.style.cursor = "pointer";
    thirdBannerSlide.addEventListener("click", () => {
      smoothScrollTo("snap-recommendation");
    });
  }
});

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  console.log("FitPl 웹사이트가 로드되었습니다.");

  // 좋아요 버튼 초기 상태 설정
  likeBtns.forEach((btn) => {
    const svg = btn.querySelector("svg path");
    if (svg) {
      svg.style.fill = "none";
      svg.style.stroke = "#666";
    }
  });
});

// 페이지 로드 완료 후 실행
window.addEventListener("load", () => {
  // 이미지 lazy loading
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("load", () => {
      img.style.opacity = "1";
    });
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease";
  });
});
