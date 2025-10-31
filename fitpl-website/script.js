// 검색 모달 관련 변수
const searchModal = document.getElementById("searchModal");
const searchInputModal = document.getElementById("searchInputModal");
const searchButtonModal = document.getElementById("searchButtonModal");
const closeButtonModal = document.getElementById("closeButtonModal");

// 검색 모달 기능
function showSearchModal() {
  if (searchModal) {
    searchModal.classList.add("show");
    document.body.style.overflow = "hidden"; // 스크롤 방지
    // 검색 입력창에 포커스
    setTimeout(() => {
      if (searchInputModal) {
        searchInputModal.focus();
      }
    }, 300);
  }
}

function hideSearchModal() {
  if (searchModal) {
    searchModal.classList.remove("show");
    document.body.style.overflow = "auto"; // 스크롤 복원
  }
}

// 검색 섹션 클릭 시 검색 페이지로 이동
const searchSection = document.querySelector(".search-section");
if (searchSection) {
  searchSection.style.cursor = "pointer";
  searchSection.addEventListener("click", () => {
    window.location.href = "../search/index.html";
  });
}

// 모달 외부 클릭 시 닫기
if (searchModal) {
  searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) {
      hideSearchModal();
    }
  });
}

// ESC 키로 모달 닫기
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    searchModal &&
    searchModal.classList.contains("show")
  ) {
    hideSearchModal();
  }
});

// 검색 모달 내부 검색 기능
if (searchButtonModal) {
  searchButtonModal.addEventListener("click", () => {
    const searchTerm = searchInputModal.value.trim();
    if (searchTerm) {
      console.log("모달에서 검색:", searchTerm);
      // 실제 검색 로직 구현
      searchProducts(searchTerm);
      hideSearchModal();
    }
  });
}

if (searchInputModal) {
  searchInputModal.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = searchInputModal.value.trim();
      if (searchTerm) {
        console.log("모달에서 검색:", searchTerm);
        searchProducts(searchTerm);
        hideSearchModal();
      }
    }
  });
}

// 검색 태그 클릭 이벤트
document.querySelectorAll(".search-tag").forEach((tag) => {
  tag.addEventListener("click", (e) => {
    const searchTerm = e.target.dataset.search;
    if (searchTerm) {
      searchInputModal.value = searchTerm;
      searchProducts(searchTerm);
      hideSearchModal();
    }
  });
});

// 브랜드 태그 클릭 이벤트
document.querySelectorAll(".brand-tag").forEach((tag) => {
  tag.addEventListener("click", (e) => {
    const brandName = e.target.dataset.brand;
    if (brandName) {
      searchInputModal.value = brandName;
      searchProducts(brandName);
      hideSearchModal();
    }
  });
});

// 랭킹 아이템 클릭 이벤트
document.querySelectorAll(".rank-item").forEach((item) => {
  item.addEventListener("click", () => {
    const rankText = item.querySelector(".rank-text").textContent;
    if (rankText) {
      searchInputModal.value = rankText;
      searchProducts(rankText);
      hideSearchModal();
    }
  });
});

// 카테고리 태그 클릭 이벤트
document.querySelectorAll(".category-tag").forEach((tag) => {
  tag.addEventListener("click", (e) => {
    const category = e.target.dataset.category;
    const categoryNames = {
      beauty: "뷰티",
      player: "플레이어",
      outlet: "아울렛",
      boutique: "부티크",
      shoes: "슈즈",
      kids: "키즈",
      used: "유즈드",
      travel: "트래블",
    };

    const categoryName = categoryNames[category];
    if (categoryName) {
      console.log(`${categoryName} 카테고리 선택`);
      // 카테고리별 필터링 로직 구현
      filterProductsByCategory(categoryName);
      hideSearchModal();
    }
  });
});

// 최근 검색어 삭제 기능
const deleteRecentBtnModal = document.getElementById("deleteRecentBtnModal");
if (deleteRecentBtnModal) {
  deleteRecentBtnModal.addEventListener("click", () => {
    const searchTags = document.querySelectorAll(".search-tag");
    searchTags.forEach((tag) => tag.remove());
    console.log("최근 검색어 삭제됨");
  });
}

// 최근 브랜드 삭제 기능
const deleteBrandBtnModal = document.getElementById("deleteBrandBtnModal");
if (deleteBrandBtnModal) {
  deleteBrandBtnModal.addEventListener("click", () => {
    const brandTags = document.querySelectorAll(".brand-tag");
    brandTags.forEach((tag) => tag.remove());
    console.log("최근 브랜드 삭제됨");
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
    // 특정 국가 버튼 클릭 시 해당 NationX-1 페이지로 이동
    const label = btn.textContent.trim();
    const countryRoutes = {
      베트남: "../Nation1-1/index.html",
      중국: "../Nation2-1/index.html",
      홍콩: "../Nation3-1/index.html",
      대만: "../Nation4-1/index.html",
      태국: "../Nation5-1/index.html",
      라오스: "../Nation6-1/index.html",
      싱가포르: "../Nation7-1/index.html",
      미국: "../Nation8-1/index.html",
      호주: "../Nation9-1/index.html",
      뉴질랜드: "../Nation10-1/index.html",
      프랑스: "../Nation11-1/index.html",
    };
    if (countryRoutes[label]) {
      window.location.href = countryRoutes[label];
      return;
    }

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

// 검색 기능
function performSearch() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    console.log("검색어:", searchTerm);
    // 실제 검색 로직 구현
    searchProducts(searchTerm);
  }
}

if (searchBtn) {
  searchBtn.addEventListener("click", performSearch);
}

if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });
}

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

// 상품 카드 클릭 이벤트
const productCards = document.querySelectorAll(".product-card");
productCards.forEach((card) => {
  // 클릭 이벤트 - Detail 페이지로 이동
  card.addEventListener("click", (e) => {
    // 좋아요 버튼 클릭 시에는 페이지 이동하지 않음
    if (e.target.closest(".like-btn")) {
      return;
    }

    // Detail 페이지로 이동
    window.location.href = "../Detail/navigation.html";
  });

  // 클릭 가능한 커서 스타일 추가
  card.style.cursor = "pointer";
});

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
function smoothScrollTo(elementId, extraOffset = 0) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition =
      elementPosition + window.pageYOffset - 100 + extraOffset; // 헤더 높이만큼 오프셋

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

// 메인 배너 슬라이드 클릭 이벤트
document.addEventListener("DOMContentLoaded", () => {
  const climateBanner = document.querySelector('[data-banner="climate"]');
  const activityBanner = document.querySelector('[data-banner="activity"]');
  const popularBanner = document.querySelector('[data-banner="popular"]');

  // 왼쪽 배너: 기후별 추천 섹션으로 스크롤
  if (climateBanner) {
    climateBanner.style.cursor = "pointer";
    climateBanner.addEventListener("click", () => {
      const firstCelebrityPick = document.querySelector(
        ".celebrity-pick:not(#climate-recommendation)"
      );
      if (firstCelebrityPick) {
        firstCelebrityPick.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  // 가운데 배너: 활동별 추천 섹션으로 스크롤
  if (activityBanner) {
    activityBanner.style.cursor = "pointer";
    activityBanner.addEventListener("click", () => {
      smoothScrollTo("climate-recommendation", 150);
    });
  }

  // 오른쪽 배너: 일본 페이지로 리디렉션 (나중에 구현 예정)
  if (popularBanner) {
    popularBanner.style.cursor = "pointer";
    popularBanner.addEventListener("click", () => {
      // TODO: 일본 페이지 구현 시 리디렉션 추가
      // window.location.href = "../Nation1-1/index.html";
    });
  }
});

// products-grid 스크롤 버튼 기능 - 제품 섹션 간 이동
document.addEventListener("DOMContentLoaded", () => {
  // 각 컨테이너별 인덱스 저장
  const containerIndices = new Map();

  // 오른쪽 버튼 클릭 핸들러
  function handleScrollRightClick(event) {
    const button = event.currentTarget;
    const container = button.parentElement;
    const wrapper = container.querySelector(".products-grid-wrapper");

    if (!wrapper) return;

    // 버튼 클릭 애니메이션 효과
    button.classList.add("clicked");
    setTimeout(() => {
      button.classList.remove("clicked");
    }, 500);

    const currentSections = wrapper.querySelectorAll(".product-section");
    const currentIndex = containerIndices.get(container) || 0;
    const maxIndex = currentSections.length - 1;

    // 다음 섹션으로 이동 가능한지 확인
    if (currentIndex < maxIndex) {
      const nextIndex = currentIndex + 1;
      containerIndices.set(container, nextIndex);
      wrapper.style.transform = `translateX(-${nextIndex * 100}%)`;

      // 왼쪽 버튼 표시
      const leftButton = container.querySelector(".scroll-left-btn");
      if (leftButton) leftButton.classList.add("show");

      // 마지막 섹션이면 오른쪽 버튼 숨김
      if (nextIndex >= maxIndex) {
        const rightButton = container.querySelector(".scroll-right-btn");
        if (rightButton) {
          rightButton.style.opacity = "0";
          rightButton.style.pointerEvents = "none";
        }
      }
    }
  }

  // 왼쪽 버튼 클릭 핸들러
  function handleScrollLeftClick(event) {
    const button = event.currentTarget;
    const container = button.parentElement;
    const wrapper = container.querySelector(".products-grid-wrapper");

    if (!wrapper) return;

    // 버튼 클릭 애니메이션 효과
    button.classList.add("clicked");
    setTimeout(() => {
      button.classList.remove("clicked");
    }, 500);

    const currentIndex = containerIndices.get(container) || 0;

    // 이전 섹션으로 이동
    if (currentIndex > 0) {
      const nextIndex = currentIndex - 1;
      containerIndices.set(container, nextIndex);
      wrapper.style.transform = `translateX(-${nextIndex * 100}%)`;

      // 첫 번째 섹션이면 왼쪽 버튼 숨김
      if (nextIndex === 0) {
        const leftButton = container.querySelector(".scroll-left-btn");
        if (leftButton) leftButton.classList.remove("show");
      }

      // 오른쪽 버튼 다시 표시
      const rightButton = container.querySelector(".scroll-right-btn");
      if (rightButton) {
        rightButton.style.opacity = "1";
        rightButton.style.pointerEvents = "auto";
      }
    }
  }

  // 새로운 product-section 생성 함수
  function createNewProductSection() {
    const section = document.createElement("div");
    section.className = "product-section";

    const gridWrapper = document.createElement("div");
    gridWrapper.className = "products-grid";

    const sampleProducts = [
      {
        brand: "가격킹",
        name: "스포츠 라운지 맨투맨 NEW",
        price: "79,000",
        discount: "35",
      },
      {
        brand: "와이드웨어",
        name: "오버핏 후드티 NEW",
        price: "89,000",
        discount: null,
      },
      {
        brand: "스트릿라이프",
        name: "그래픽 반팔티 NEW",
        price: "39,900",
        discount: "20",
      },
      {
        brand: "어반베이스",
        name: "카고 팬츠 NEW",
        price: "99,000",
        discount: "25",
      },
      {
        brand: "스니커랩",
        name: "캔버스 스니커즈 NEW",
        price: "89,000",
        discount: "15",
      },
      {
        brand: "모던스타일",
        name: "린넨 셔츠 NEW",
        price: "59,900",
        discount: "30",
      },
      {
        brand: "베이직웨어",
        name: "코튼 와이드팬츠 NEW",
        price: "49,900",
        discount: null,
      },
      {
        brand: "유니폼",
        name: "데님 재킷 NEW",
        price: "149,000",
        discount: "40",
      },
      {
        brand: "미니멀",
        name: "크롭 테일러팬츠 NEW",
        price: "69,900",
        discount: null,
      },
      {
        brand: "익스프레스",
        name: "스웨트셔츠 NEW",
        price: "89,000",
        discount: "22",
      },
    ];

    for (let i = 0; i < 10; i++) {
      const productData = sampleProducts[i % sampleProducts.length];
      const card = document.createElement("div");
      card.className = "product-card";

      const discountHTML = productData.discount
        ? `<span class="discount">${productData.discount}%</span>`
        : "";

      card.innerHTML = `
        <div class="product-image">
          <img src="https://images.unsplash.com/photo-${
            1500000000000 + i * 10000000
          }-1594633312681-425c7b97ccd1?w=260&h=312&fit=crop" alt="Product ${
        i + 1
      }">
          <button class="like-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 17L8.5 15.5C3.5 10.5 0 7.5 0 5C0 2.5 2.5 0 5 0C6.5 0 8 0.5 9 1.5C10 0.5 11.5 0 13 0C15.5 0 18 2.5 18 5C18 7.5 14.5 10.5 9.5 15.5L10 17Z" stroke="#666" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div class="product-info">
          <div class="brand">${productData.brand}</div>
          <div class="product-name">${productData.name}</div>
          <div class="price-info">
            ${discountHTML}
            <span class="price">${productData.price}원</span>
          </div>
        </div>
      `;

      // product-card 클릭 이벤트
      card.style.cursor = "pointer";
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".like-btn")) {
          window.location.href = "../Detail/navigation.html";
        }
      });

      // like-btn 클릭 이벤트
      const likeBtn = card.querySelector(".like-btn");
      likeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        likeBtn.classList.toggle("liked");
        const svg = likeBtn.querySelector("svg path");
        if (likeBtn.classList.contains("liked")) {
          svg.style.fill = "#f31110";
          svg.style.stroke = "#f31110";
        } else {
          svg.style.fill = "none";
          svg.style.stroke = "#666";
        }
      });

      gridWrapper.appendChild(card);
    }

    section.appendChild(gridWrapper);
    return section;
  }

  // 초기 버튼들에 이벤트 리스너 추가
  const scrollRightButtons = document.querySelectorAll(".scroll-right-btn");
  scrollRightButtons.forEach((button) => {
    button.addEventListener("click", handleScrollRightClick);
  });

  const scrollLeftButtons = document.querySelectorAll(".scroll-left-btn");
  scrollLeftButtons.forEach((button) => {
    button.addEventListener("click", handleScrollLeftClick);
  });

  // 새로운 products-grid 생성 함수
  function createNewProductsGrid(templateGrid) {
    const newGrid = document.createElement("div");
    newGrid.className = "products-grid";

    // 템플릿에서 첫 번째 product-card 구조 가져오기
    const templateCard = templateGrid.querySelector(".product-card");
    if (templateCard) {
      const cardHTML = templateCard.outerHTML;

      // 10개의 product-card 생성 (5개씩 2줄)
      for (let i = 0; i < 10; i++) {
        const cardClone = templateCard.cloneNode(true);

        // 각 카드의 내용을 다르게 설정 (이미지, 브랜드, 이름 등)
        const productImage = cardClone.querySelector(".product-image img");
        const brand = cardClone.querySelector(".brand");
        const productName = cardClone.querySelector(".product-name");
        const price = cardClone.querySelector(".price");
        const discount = cardClone.querySelector(".discount");

        // 샘플 데이터로 내용 변경 (새 섹션용으로 다른 이름들)
        const sampleProducts = [
          {
            brand: "가격킹",
            name: "스포츠 라운지 맨투맨 NEW",
            price: "79,000",
            discount: "35",
          },
          {
            brand: "와이드웨어",
            name: "오버핏 후드티 NEW",
            price: "89,000",
            discount: null,
          },
          {
            brand: "스트릿라이프",
            name: "그래픽 반팔티 NEW",
            price: "39,900",
            discount: "20",
          },
          {
            brand: "어반베이스",
            name: "카고 팬츠 NEW",
            price: "99,000",
            discount: "25",
          },
          {
            brand: "스니커랩",
            name: "캔버스 스니커즈 NEW",
            price: "89,000",
            discount: "15",
          },
          {
            brand: "모던스타일",
            name: "린넨 셔츠 NEW",
            price: "59,900",
            discount: "30",
          },
          {
            brand: "베이직웨어",
            name: "코튼 와이드팬츠 NEW",
            price: "49,900",
            discount: null,
          },
          {
            brand: "유니폼",
            name: "데님 재킷 NEW",
            price: "149,000",
            discount: "40",
          },
          {
            brand: "미니멀",
            name: "크롭 테일러팬츠 NEW",
            price: "69,900",
            discount: null,
          },
          {
            brand: "익스프레스",
            name: "스웨트셔츠 NEW",
            price: "89,000",
            discount: "22",
          },
        ];

        const productData = sampleProducts[i % sampleProducts.length];

        if (productImage) {
          productImage.src = `https://images.unsplash.com/photo-${
            1500000000000 + i * 10000000
          }-1594633312681-425c7b97ccd1?w=260&h=312&fit=crop`;
          productImage.alt = `Product ${i + 1}`;
        }
        if (brand) brand.textContent = productData.brand;
        if (productName) productName.textContent = productData.name;
        if (price) price.textContent = `${productData.price}원`;
        if (discount) {
          if (productData.discount) {
            discount.textContent = `${productData.discount}%`;
            discount.style.display = "inline";
          } else {
            discount.style.display = "none";
          }
        }

        // 카드가 애니메이션되도록 초기 상태 설정 (visible 클래스는 나중에 추가)
        cardClone.style.opacity = "0";
        cardClone.style.transform = "translateY(20px)";

        newGrid.appendChild(cardClone);
      }
    }

    return newGrid;
  }

  // 새로운 section 생성 함수
  function createNewSection(templateSection, newGrid) {
    const newSection = templateSection.cloneNode(true);

    // 기존 products-grid를 새로운 것으로 교체
    const container = newSection.querySelector(".products-grid-container");
    if (container) {
      const oldGrid = container.querySelector(".products-grid");
      const oldButton = container.querySelector(".scroll-right-btn");

      if (oldGrid) oldGrid.remove();
      if (oldButton) oldButton.remove();

      container.appendChild(newGrid);

      // 새로운 버튼 추가
      const newButton = document.createElement("button");
      newButton.className = "scroll-right-btn";
      newButton.setAttribute("aria-label", "오른쪽으로 스크롤");
      newButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      container.appendChild(newButton);
    }

    // 좋아요 버튼 이벤트 리스너 추가
    const likeButtons = newSection.querySelectorAll(".like-btn");
    likeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        btn.classList.toggle("liked");
        const svg = btn.querySelector("svg path");
        if (btn.classList.contains("liked")) {
          svg.style.fill = "#f31110";
          svg.style.stroke = "#f31110";
        } else {
          svg.style.fill = "none";
          svg.style.stroke = "#666";
        }
      });
    });

    // product-card 클릭 이벤트 추가
    const productCards = newSection.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      card.style.cursor = "pointer";
      card.addEventListener("click", (e) => {
        if (e.target.closest(".like-btn")) {
          return;
        }
        window.location.href = "../Detail/navigation.html";
      });
    });

    return newSection;
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

// 진입 팝업 표시/닫기
document.addEventListener("DOMContentLoaded", () => {
  const entryPopup = document.getElementById("entryPopup");
  const entryPopupClose = document.getElementById("entryPopupClose");
  const appContainer = document.querySelector(".container");
  const countryList = document.getElementById("countryList");
  const prefCategoryList = document.getElementById("prefCategoryList");
  const activityList = document.getElementById("activityList");
  const cityList = document.getElementById("cityList");
  const chipsCountry = document.getElementById("countryChips");
  const chipsCity = document.getElementById("cityChips");
  const chipsPref = document.getElementById("prefCatChips");
  const chipsActivity = document.getElementById("activityChips");
  const entryForm = document.getElementById("entryForm");
  const countryError = document.getElementById("countryError");
  const prefCatError = document.getElementById("prefCatError");
  const activityError = document.getElementById("activityError");

  if (!entryPopup) return;

  function showEntryPopup() {
    entryPopup.classList.add("show");
    document.body.style.overflow = "hidden";
    document.body.classList.add("popup-open");
    // 본문 상호작용 비활성화
    if (appContainer) {
      appContainer.classList.add("non-interactive");
      appContainer.setAttribute("aria-hidden", "true");
      try {
        appContainer.setAttribute("inert", "");
      } catch (_) {}
    }
    // 포커스 트랩 시작(닫기 버튼으로 포커스 이동)
    if (entryPopupClose) entryPopupClose.focus();
  }

  function hideEntryPopup() {
    entryPopup.classList.remove("show");
    document.body.style.overflow = "auto";
    document.body.classList.remove("popup-open");
    // 본문 상호작용 복원
    if (appContainer) {
      appContainer.classList.remove("non-interactive");
      appContainer.removeAttribute("aria-hidden");
      appContainer.removeAttribute("inert");
    }
  }

  // 로컬 스토리지에 유저 정보가 없을 때만 팝업 표시
  const hasUser = getUserFromStorage();
  if (!hasUser) {
    showEntryPopup();
  }

  // 닫기 버튼
  if (entryPopupClose) {
    entryPopupClose.addEventListener("click", hideEntryPopup);
  }

  // 오버레이 클릭 시 닫기 (내용 영역 클릭 제외)
  entryPopup.addEventListener("click", (e) => {
    if (e.target === entryPopup) hideEntryPopup();
  });

  // ESC 키로 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && entryPopup.classList.contains("show")) {
      hideEntryPopup();
    }
  });

  // 포커스 트랩: 팝업 내부에서만 탭 이동
  document.addEventListener("keydown", (e) => {
    if (!entryPopup.classList.contains("show")) return;
    if (e.key !== "Tab") return;
    const focusables = entryPopup.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // 국가 라디오 변경 시 에러 지우기
  if (countryList) {
    countryList.addEventListener("change", () => {
      if (countryError) countryError.textContent = "";
      const selected = document.querySelector('input[name="country"]:checked');
      renderChips(chipsCountry, selected ? [selected.value] : [], (value) => {
        const input = countryList.querySelector(`input[value="${value}"]`);
        if (input) input.checked = false;
        renderChips(chipsCountry, [], null);
      });
      collapseField(countryList.closest(".form-field"));
    });
  }

  // 대분류 체크 변경 시 에러 지우기
  if (prefCategoryList) {
    prefCategoryList.addEventListener("change", () => {
      if (prefCatError) prefCatError.textContent = "";
      const checked = prefCategoryList.querySelectorAll(
        'input[name="prefCat"]:checked'
      );
      renderChips(
        chipsPref,
        Array.from(checked).map((c) => c.value),
        (value) => {
          const input = prefCategoryList.querySelector(
            `input[value="${value}"]`
          );
          if (input) input.checked = false;
          const rest = prefCategoryList.querySelectorAll(
            'input[name="prefCat"]:checked'
          );
          renderChips(
            chipsPref,
            Array.from(rest).map((c) => c.value),
            null
          );
        }
      );
      collapseField(prefCategoryList.closest(".form-field"));
    });
  }

  // 도시 라디오 변경 시
  if (cityList) {
    cityList.addEventListener("change", () => {
      const selected = document.querySelector('input[name="city"]:checked');
      renderChips(chipsCity, selected ? [selected.value] : [], (value) => {
        const input = cityList.querySelector(`input[value="${value}"]`);
        if (input) input.checked = false;
        renderChips(chipsCity, [], null);
      });
      collapseField(cityList.closest(".form-field"));
    });
  }

  // 활동 체크박스 최대 3개 제한
  if (activityList) {
    activityList.addEventListener("change", (e) => {
      const checkboxes = activityList.querySelectorAll(
        'input[name="activity"]'
      );
      const checked = Array.from(checkboxes).filter((c) => c.checked);
      if (checked.length > 3) {
        const target = e.target;
        if (target && target.checked) {
          target.checked = false;
        }
        if (activityError)
          activityError.textContent = "최대 3개까지 선택 가능합니다.";
      } else {
        if (activityError) activityError.textContent = "";
        renderChips(
          chipsActivity,
          checked.map((c) => c.value),
          (value) => {
            const input = activityList.querySelector(`input[value="${value}"]`);
            if (input) input.checked = false;
            const rest = activityList.querySelectorAll(
              'input[name="activity"]:checked'
            );
            renderChips(
              chipsActivity,
              Array.from(rest).map((c) => c.value),
              null
            );
          }
        );
        if (checked.length === 3) {
          collapseField(activityList.closest(".form-field"));
          if (activityError) {
            activityError.textContent = "최대 3개 선택 완료";
            setTimeout(() => {
              activityError.textContent = "";
            }, 1500);
          }
        }
      }
    });
  }

  // 제출 검증
  if (entryForm) {
    entryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // 국가 선택 확인
      const selectedCountry = document.querySelector(
        'input[name="country"]:checked'
      );
      if (!selectedCountry) {
        if (countryError)
          countryError.textContent = "여행지역을 1개 선택해 주세요.";
        return;
      }

      // 대분류 선택 확인
      const selectedPrefCats = document.querySelectorAll(
        'input[name="prefCat"]:checked'
      );
      if (!selectedPrefCats.length) {
        if (prefCatError)
          prefCatError.textContent =
            "선호 대분류 활동을 최소 1개 선택해 주세요.";
        return;
      }

      // 활동 최대 3개 확인(선택은 비필수)
      const selectedActivities = document.querySelectorAll(
        'input[name="activity"]:checked'
      );
      if (selectedActivities.length > 3) {
        if (activityError)
          activityError.textContent = "최대 3개까지 선택 가능합니다.";
        return;
      }

      // 도시 선택 확인 (필수)
      const selectedCity = document.querySelector('input[name="city"]:checked');
      if (!selectedCity) {
        // 도시 필드로 스크롤하고 경고
        const cityField = cityList?.closest(".form-field");
        if (cityField) {
          cityField.classList.remove("collapsed");
          cityField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        alert("도시를 선택해 주세요.");
        return;
      }

      // 매핑 함수들
      const cityToRegionId = {
        도쿄: 1,
        오사카: 2,
        상하이: 3,
        광저우: 4,
        가오슝: 5,
        타이베이: 6,
        방콕: 7,
        치앙마이: 8,
        다낭: 9,
        하노이: 10,
        마닐라: 11,
        세부: 12,
        홍콩: 13,
        마카오: 14,
        발리: 15,
        자카르타: 16,
        괌: 17,
        하와이: 18,
        싱가포르: 19,
        시드니: 20,
      };

      const prefCatToIndoorOutdoor = {
        인도어: "indoor",
        아웃도어: "outdoor",
        둘다: "both",
      };

      const activityToTag = {
        도시: "urban",
        쇼핑: "shopping",
        음식: "food",
        레스토랑: "restaurant",
        미식: "gourmet",
        서핑: "surfing",
        스노클링: "snorkeling",
        다이빙: "diving",
        박물관: "museum",
        아트: "art",
        하이킹: "hiking",
        트레킹: "trekking",
        테마파크: "themepark",
        놀이공원: "amusement",
        "실내 야외 전망대": "observationdeck",
        마켓나이트: "marketnight",
        동물원: "zoo",
        대성당: "cathedral",
        교회: "church",
        사원수: "templeshrine",
        국립공원: "nationalpark",
        수족관: "aquarium",
        해변: "beach",
      };

      // 데이터 변환
      const cityName = selectedCity.value;
      const tripRegionId = cityToRegionId[cityName];
      if (!tripRegionId) {
        alert(`도시 매핑 오류: ${cityName}`);
        return;
      }

      // 대분류 변환 (첫 번째 선택된 것을 사용)
      const prefCatValue = selectedPrefCats[0]?.value || "";
      const indoorOutdoor = prefCatToIndoorOutdoor[prefCatValue];
      if (!indoorOutdoor) {
        alert("선호 활동 대분류 매핑 오류");
        return;
      }

      // 소분류 변환 (영문 키 배열)
      const activityTags = Array.from(selectedActivities)
        .map((el) => activityToTag[el.value])
        .filter(Boolean); // null/undefined 제거

      // 날짜 처리 (비어있으면 기본값)
      const startDate =
        document.getElementById("startDate")?.value || "2025-10-20";
      const endDate = document.getElementById("endDate")?.value || "2025-10-30";

      // 서버 전송용 데이터 준비
      const submitData = {
        name: document.getElementById("entryName")?.value?.trim() || null,
        email: document.getElementById("entryEmail")?.value?.trim() || null,
        trip_region_id: tripRegionId,
        trip_start_date: startDate,
        trip_end_date: endDate,
        indoor_outdoor: indoorOutdoor,
        activity_tags: activityTags.length > 0 ? activityTags : null,
      };

      console.log("진입 폼 제출 (변환됨):", submitData);

      // 서버로 전송
      async function submitUserData() {
        try {
          const response = await fetch(
            "/.netlify/functions/db?op=user_register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(submitData),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("서버 응답 오류:", response.status, errorText);
            throw new Error(`서버 오류: ${response.status} - ${errorText}`);
          }

          const result = await response.json();

          if (result.ok) {
            console.log("사용자 등록 성공:", result);

            // 로컬 스토리지에 유저 정보 저장
            const userData = {
              user_id: result.user_id,
              trip_region_id: submitData.trip_region_id,
              name: submitData.name,
              email: submitData.email,
              indoor_outdoor: submitData.indoor_outdoor,
              activity_tags: submitData.activity_tags,
              registered_at: new Date().toISOString(),
            };
            localStorage.setItem("fitpl_user", JSON.stringify(userData));
            console.log("로컬 스토리지에 저장됨:", userData);

            // 제출 후 팝업 닫기
            hideEntryPopup();

            // 유저 정보가 저장되었으므로 제품 다시 로드 (유저 추천으로 변경 가능)
            setTimeout(() => {
              loadAndRenderGuestProducts();
            }, 500);
          } else {
            console.error("사용자 등록 실패:", result.error);
            alert(`등록 실패: ${result.error || "알 수 없는 오류"}`);
          }
        } catch (error) {
          console.error("전송 오류:", error);
          console.error("에러 상세:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
          });

          // 사용자 친화적인 에러 메시지
          let errorMessage = "정보 전송 중 오류가 발생했습니다.";
          if (error.message.includes("fetch")) {
            errorMessage +=
              "\n\n네트워크 연결을 확인해주세요. 또는 잠시 후 다시 시도해주세요.";
          } else if (error.message.includes("서버 오류")) {
            errorMessage = error.message;
          }

          alert(errorMessage);
        }
      }

      submitUserData();
    });
  }

  // 토글 화살표: 리스트 펼치기/접기
  const toggleButtons = document.querySelectorAll(".entry-popup .toggle-btn");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const field = btn.closest(".form-field");
      if (!field) return;
      const isCollapsed = field.classList.toggle("collapsed");
      btn.setAttribute("aria-expanded", String(!isCollapsed));
    });
  });

  function renderChips(container, values, onRemove) {
    if (!container) return;
    container.innerHTML = "";
    values.forEach((val) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      const text = document.createElement("span");
      text.textContent = val;
      chip.appendChild(text);
      if (onRemove) {
        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.setAttribute("aria-label", `${val} 제거`);
        closeBtn.textContent = "×";
        closeBtn.addEventListener("click", () => onRemove(val));
        chip.appendChild(closeBtn);
      }
      container.appendChild(chip);
    });
  }

  function collapseField(field) {
    if (!field) return;
    field.classList.add("collapsed");
    const btn = field.querySelector(".toggle-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }
});

// ---- 유저 ID 관리 유틸리티 ----
// 로컬 스토리지에서 유저 정보 가져오기
function getUserFromStorage() {
  try {
    const stored = localStorage.getItem("fitpl_user");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("로컬 스토리지 파싱 오류:", e);
    return null;
  }
}

// 현재 페이지의 지역 ID를 파악하는 함수
// URL 경로나 페이지 특성에 따라 지역 ID 반환
function getCurrentPageRegionId() {
  // URL에서 추출 시도 (예: /Nation1-1/index.html → region_id 1)
  const path = window.location.pathname;
  const regionMatch = path.match(/Nation(\d+)/);
  if (regionMatch) {
    return parseInt(regionMatch[1]);
  }

  // 쿼리 파라미터에서 추출 시도
  const params = new URLSearchParams(window.location.search);
  const regionId = params.get("region_id");
  if (regionId) {
    return parseInt(regionId);
  }

  // 데이터 속성에서 추출 시도
  const pageElement = document.querySelector("[data-region-id]");
  if (pageElement) {
    return parseInt(pageElement.dataset.regionId);
  }

  return null;
}

// 유저 ID 결정 함수: 유저의 trip_region_id와 현재 페이지 지역 ID 비교
// 일치하면 유저 ID, 불일치하면 게스트 ID 반환
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

// 전역으로 노출 (다른 페이지에서도 사용 가능하도록)
window.fitplUserUtils = {
  getUserFromStorage,
  getCurrentPageRegionId,
  determineUserId,
};

// ---- 개발/테스트용 함수 (콘솔에서 확인용) ----
// 브라우저 콘솔에서 fitplTest() 실행하여 테스트
window.fitplTest = function () {
  console.log("=== FitPl 로직 테스트 ===");

  // 1. 로컬 스토리지 확인
  const user = getUserFromStorage();
  console.log("1. 로컬 스토리지 유저 정보:", user);

  // 2. 현재 페이지 지역 ID 확인
  const pageRegionId = getCurrentPageRegionId();
  console.log("2. 현재 페이지 지역 ID:", pageRegionId);

  // 3. 유저 ID 결정
  const userId = determineUserId(pageRegionId);
  console.log("3. 결정된 유저 ID:", userId);
  console.log("   - 유저 정보 있음:", !!user);
  console.log("   - 유저 trip_region_id:", user?.trip_region_id);
  console.log("   - 페이지 region_id:", pageRegionId);
  console.log("   - 일치 여부:", user?.trip_region_id === pageRegionId);

  // 4. 테스트 시나리오
  console.log("\n=== 테스트 시나리오 ===");
  if (user) {
    console.log("시나리오 A: 같은 지역 방문");
    console.log("  유저 trip_region_id:", user.trip_region_id);
    console.log("  페이지 region_id:", user.trip_region_id);
    console.log(
      "  → 사용될 ID:",
      determineUserId(user.trip_region_id),
      "(유저 ID)"
    );

    console.log("\n시나리오 B: 다른 지역 방문");
    const otherRegion = user.trip_region_id === 1 ? 4 : 1;
    console.log("  유저 trip_region_id:", user.trip_region_id);
    console.log("  페이지 region_id:", otherRegion);
    console.log("  → 사용될 ID:", determineUserId(otherRegion), "(게스트 ID)");
  } else {
    console.log("유저 정보가 없습니다. 폼을 제출하여 유저 정보를 저장하세요.");
  }

  return {
    user,
    pageRegionId,
    userId,
    scenarios: user
      ? {
          sameRegion: determineUserId(user.trip_region_id),
          differentRegion: determineUserId(user.trip_region_id === 1 ? 4 : 1),
        }
      : null,
  };
};

// 개발 모드에서 자동 테스트 (선택사항)
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("💡 개발 모드: 콘솔에서 fitplTest() 실행하여 로직을 확인하세요.");
}

// ---- 제품 표시 기능 ----
// 제품 카드 HTML 생성 함수
function createProductCard(product) {
  const price = Number(product.price || 0).toLocaleString();
  const name = (product.product_name || "").replace(/\s+/g, " ").trim();
  const brand = product.brand || "";
  const imgUrl =
    product.img_url ||
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=260&h=312&fit=crop";
  const discountRate = product.discount_rate
    ? Math.round(product.discount_rate)
    : null;
  const productUrl = product.product_url || "#";

  const discountHTML = discountRate
    ? `<span class="discount">${discountRate}%</span>`
    : "";

  return `
    <div class="product-card" data-product-id="${product.product_id || ""}">
      <div class="product-image">
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
          ${discountHTML}
          <span class="price">${price}원</span>
        </div>
      </div>
    </div>
  `;
}

// 제품 그리드에 제품 렌더링 (단일 섹션)
function renderProductsToGrid(selector, products, maxProducts = 10) {
  const grid = document.querySelector(selector);
  if (!grid) {
    console.warn(`그리드 요소를 찾을 수 없습니다: ${selector}`);
    return;
  }

  if (!products || products.length === 0) {
    console.warn("제품 데이터가 없습니다.");
    return;
  }

  // 기존 제품 카드 제거
  grid.innerHTML = "";

  // 최대 개수만큼 제품 카드 생성
  const productsToShow = products.slice(0, maxProducts);
  productsToShow.forEach((product) => {
    grid.insertAdjacentHTML("beforeend", createProductCard(product));
  });

  // 좋아요 버튼 및 클릭 이벤트 추가
  attachProductEvents(grid);

  console.log(
    `${productsToShow.length}개 제품을 ${selector}에 렌더링했습니다.`
  );
}

// 제품 이벤트 핸들러 추가 (공통 함수)
function attachProductEvents(container) {
  // 좋아요 버튼 이벤트
  container.querySelectorAll(".like-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle("liked");
      const svg = btn.querySelector("svg path");
      if (btn.classList.contains("liked")) {
        svg.style.fill = "#f31110";
        svg.style.stroke = "#f31110";
      } else {
        svg.style.fill = "none";
        svg.style.stroke = "#666";
      }
    });
  });

  // 제품 카드 클릭 이벤트 (상세 페이지로 이동)
  container.querySelectorAll(".product-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      if (e.target.closest(".like-btn")) return;
      const productId = card.dataset.productId;
      if (productId) {
        window.location.href = `../Detail/navigation.html?product_id=${productId}`;
      } else {
        window.location.href = "../Detail/navigation.html";
      }
    });
  });
}

// 제품을 여러 섹션으로 나누어 렌더링 (스크롤 버튼용)
function renderProductsWithSections(
  containerSelector,
  products,
  itemsPerSection = 10
) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.warn(`컨테이너를 찾을 수 없습니다: ${containerSelector}`);
    return;
  }

  const wrapper = container.querySelector(".products-grid-wrapper");
  if (!wrapper) {
    console.warn("products-grid-wrapper를 찾을 수 없습니다.");
    return;
  }

  if (!products || products.length === 0) {
    console.warn("제품 데이터가 없습니다.");
    return;
  }

  // 기존 섹션 제거 (첫 번째 섹션만 유지하고 내용만 교체)
  const existingSections = wrapper.querySelectorAll(".product-section");

  // 제품을 섹션별로 분할
  const sections = [];
  for (let i = 0; i < products.length; i += itemsPerSection) {
    sections.push(products.slice(i, i + itemsPerSection));
  }

  // 첫 번째 섹션 업데이트
  const firstSection = existingSections[0] || document.createElement("div");
  if (!existingSections[0]) {
    firstSection.className = "product-section";
    wrapper.appendChild(firstSection);
  }

  const firstGrid =
    firstSection.querySelector(".products-grid") ||
    document.createElement("div");
  if (!firstSection.querySelector(".products-grid")) {
    firstGrid.className = "products-grid";
    firstSection.appendChild(firstGrid);
  }

  firstGrid.innerHTML = "";
  sections[0].forEach((product) => {
    firstGrid.insertAdjacentHTML("beforeend", createProductCard(product));
  });
  attachProductEvents(firstGrid);

  // 두 번째 섹션 이상이 있으면 추가 (스크롤 가능하게)
  if (sections.length > 1) {
    // 기존 두 번째 섹션 제거
    for (let i = 1; i < existingSections.length; i++) {
      existingSections[i].remove();
    }

    // 새 섹션들 추가
    for (let i = 1; i < sections.length; i++) {
      const section = document.createElement("div");
      section.className = "product-section";

      const grid = document.createElement("div");
      grid.className = "products-grid";

      sections[i].forEach((product) => {
        grid.insertAdjacentHTML("beforeend", createProductCard(product));
      });
      attachProductEvents(grid);

      section.appendChild(grid);
      wrapper.appendChild(section);
    }

    // 오른쪽 스크롤 버튼 표시 (두 번째 섹션이 있을 때만)
    const rightButton = container.querySelector(".scroll-right-btn");
    if (rightButton && sections.length > 1) {
      rightButton.style.opacity = "1";
      rightButton.style.pointerEvents = "auto";
    }
  } else {
    // 제품이 한 섹션만 있으면 오른쪽 버튼 숨김
    const rightButton = container.querySelector(".scroll-right-btn");
    if (rightButton) {
      rightButton.style.opacity = "0";
      rightButton.style.pointerEvents = "none";
    }
  }

  console.log(
    `${products.length}개 제품을 ${sections.length}개 섹션으로 나누어 렌더링했습니다.`
  );
}

// 게스트 추천 제품 로드
async function loadGuestProducts() {
  const base = "/.netlify/functions/db";

  try {
    const [climateRes, activityRes] = await Promise.all([
      fetch(`${base}?op=guest_reco_climate`),
      fetch(`${base}?op=guest_reco_activity`),
    ]);

    const climateData = await climateRes.json();
    const activityData = await activityRes.json();

    return {
      climate: climateData?.rows || climateData?.data?.rows || [],
      activity: activityData?.rows || activityData?.data?.rows || [],
    };
  } catch (error) {
    console.error("게스트 추천 로드 실패:", error);
    return { climate: [], activity: [] };
  }
}

// 유저 추천 제품 로드
async function loadUserProducts(userId) {
  const base = "/.netlify/functions/db";

  if (!userId) {
    return { climate: [], activity: [] };
  }

  try {
    const [climateRes, activityRes] = await Promise.all([
      fetch(`${base}?op=user_country_climate_top&user_id=${userId}&limit=20`),
      fetch(`${base}?op=user_country_activity_top&user_id=${userId}&limit=20`),
    ]);

    const climateData = await climateRes.json();
    const activityData = await activityRes.json();

    return {
      climate: climateData?.rows || climateData?.data?.rows || [],
      activity: activityData?.rows || activityData?.data?.rows || [],
    };
  } catch (error) {
    console.error("유저 추천 로드 실패:", error);
    return { climate: [], activity: [] };
  }
}

// 제품 로드 및 표시 (게스트/유저 자동 판별)
async function loadAndRenderProducts() {
  const user = getUserFromStorage();
  let products;

  if (user && user.user_id) {
    // 유저가 있는 경우: 유저 추천 사용
    console.log("유저 모드: 유저 추천 로드 중...", user.user_id);
    products = await loadUserProducts(user.user_id);

    if (products.climate.length === 0 && products.activity.length === 0) {
      // 유저 추천이 없으면 게스트 추천으로 fallback
      console.log("유저 추천이 없어 게스트 추천으로 대체");
      products = await loadGuestProducts();
    }
  } else {
    // 게스트인 경우: 게스트 추천 사용
    console.log("게스트 모드: 게스트 추천 로드 중...");
    products = await loadGuestProducts();
  }

  // 기후 추천 섹션 렌더링 (첫 번째 .celebrity-pick)
  const climateSection = document.querySelector(
    ".celebrity-pick:not(#climate-recommendation)"
  );
  if (climateSection) {
    const climateContainer = climateSection.querySelector(
      ".products-grid-container"
    );
    if (climateContainer) {
      renderProductsWithSections(
        ".celebrity-pick:not(#climate-recommendation) .products-grid-container",
        products.climate,
        10
      );
    }
  }

  // 활동 추천 섹션 렌더링 (#climate-recommendation)
  const activitySection = document.getElementById("climate-recommendation");
  if (activitySection) {
    const activityContainer = activitySection.querySelector(
      ".products-grid-container"
    );
    if (activityContainer) {
      renderProductsWithSections(
        "#climate-recommendation .products-grid-container",
        products.activity,
        10
      );
    }
  }

  console.log("제품 로드 완료:", {
    mode: user ? "유저" : "게스트",
    climate: products.climate.length,
    activity: products.activity.length,
  });
}

// 기존 함수명 유지 (하위 호환성)
async function loadAndRenderGuestProducts() {
  return loadAndRenderProducts();
}

// 페이지 로드 시 제품 표시
document.addEventListener("DOMContentLoaded", () => {
  // 팝업이 닫힌 후 또는 페이지 로드 시 제품 로드
  setTimeout(() => {
    loadAndRenderGuestProducts();
  }, 1000); // 팝업 표시 후 조금 지연
});
