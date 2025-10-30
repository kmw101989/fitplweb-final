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
  const firstBannerSlide = document.querySelector(".banner-slide:first-child");
  const secondBannerSlide = document.querySelector(
    ".banner-slide:nth-child(2)"
  );
  const thirdBannerSlide = document.querySelector(".banner-slide:nth-child(3)");

  if (firstBannerSlide) {
    firstBannerSlide.style.cursor = "pointer";
    firstBannerSlide.addEventListener("click", () => {
      // 첫 번째 celebrity-pick으로 스크롤
      const firstCelebrityPick = document.querySelector(".celebrity-pick");
      if (firstCelebrityPick) {
        firstCelebrityPick.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  if (secondBannerSlide) {
    secondBannerSlide.style.cursor = "pointer";
    secondBannerSlide.addEventListener("click", () => {
      smoothScrollTo("climate-recommendation", 150); // 150px 더 아래로 스크롤
    });
  }

  if (thirdBannerSlide) {
    thirdBannerSlide.style.cursor = "pointer";
    thirdBannerSlide.addEventListener("click", () => {
      smoothScrollTo("snap-recommendation");
    });
  }
});

// products-grid 스크롤 버튼 기능 - 버튼 클릭 시 같은 형태의 products-grid 추가
document.addEventListener("DOMContentLoaded", () => {
  // 각 컨테이너별 인덱스 저장
  const containerIndices = new Map();

  // 오른쪽 버튼 클릭 핸들러
  function handleScrollRightClick(event) {
    const button = event.currentTarget;
    const container = button.parentElement;
    const wrapper = container.querySelector(".products-grid-wrapper");

    if (wrapper) {
      // 버튼 클릭 애니메이션 효과
      button.classList.add("clicked");
      setTimeout(() => {
        button.classList.remove("clicked");
      }, 500);

      const currentSections = wrapper.querySelectorAll(".product-section");

      // 첫 번째 클릭 시에만 새 섹션 생성
      if (currentSections.length === 1) {
        const newSection = createNewProductSection();
        wrapper.appendChild(newSection);
      }

      // 오른쪽으로 이동
      containerIndices.set(container, 1);
      wrapper.style.transform = `translateX(-100%)`;

      // 왼쪽 버튼 표시
      const leftButton = container.querySelector(".scroll-left-btn");
      if (leftButton) leftButton.classList.add("show");

      // 오른쪽 버튼 숨김 (두 번째 섹션에서는 제거)
      const rightButton = container.querySelector(".scroll-right-btn");
      if (rightButton) {
        rightButton.style.opacity = "0";
        rightButton.style.pointerEvents = "none";
      }
    }
  }

  // 왼쪽 버튼 클릭 핸들러
  function handleScrollLeftClick(event) {
    const button = event.currentTarget;
    const container = button.parentElement;
    const wrapper = container.querySelector(".products-grid-wrapper");

    if (wrapper) {
      // 버튼 클릭 애니메이션 효과
      button.classList.add("clicked");
      setTimeout(() => {
        button.classList.remove("clicked");
      }, 500);

      // 왼쪽으로 이동
      containerIndices.set(container, 0);
      wrapper.style.transform = `translateX(0%)`;

      // 왼쪽 버튼 숨김
      const leftButton = container.querySelector(".scroll-left-btn");
      if (leftButton) leftButton.classList.remove("show");

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

// ---- 유틸 ----
async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
const rowsOf = (p) => p?.rows || p?.data?.rows || [];

// ---- 스타일 주입 (CSS 파일 건드리지 않음) ----
(function injectStyle() {
  const css = `
  .fitpl-guest { max-width: 1200px; margin: 24px auto; padding: 0 16px; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif; }
  .fitpl-guest h2 { margin: 16px 0 12px; font-size: 20px; }
  .fitpl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
  .fitpl-card { border: 1px solid #eee; border-radius: 12px; padding: 10px; background:#fff; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
  .fitpl-card img { width: 100%; height: 170px; object-fit: cover; border-radius: 10px; }
  .fitpl-brand { margin-top: 8px; font-size: 12px; color:#555; }
  .fitpl-name { margin-top: 4px; font-size: 13px; line-height: 1.3; height: 34px; overflow: hidden; }
  .fitpl-price { margin-top: 6px; font-weight: 700; }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
})();

// ---- 컨테이너 생성 (HTML 수정 없이 동적 삽입) ----
function ensureContainers() {
  let root = document.querySelector("#fitpl-guest-root");
  if (!root) {
    root = document.createElement("section");
    root.id = "fitpl-guest-root";
    root.className = "fitpl-guest";
    // 페이지 최상단에 삽입 (필요시 위치 바꾸려면 여기만 수정)
    document.body.prepend(root);
  }
  if (!document.querySelector("#guestClimate")) {
    root.insertAdjacentHTML(
      "beforeend",
      `
      <div id="guestClimateWrap">
        <h2>기후 기반 추천</h2>
        <div id="guestClimate" class="fitpl-grid"></div>
      </div>
    `
    );
  }
  if (!document.querySelector("#guestActivity")) {
    root.insertAdjacentHTML(
      "beforeend",
      `
      <div id="guestActivityWrap" style="margin-top:20px">
        <h2>활동 기반 추천</h2>
        <div id="guestActivity" class="fitpl-grid"></div>
      </div>
    `
    );
  }
}

function card(r) {
  const price = Number(r.price || 0).toLocaleString();
  const name = (r.product_name || "").replace(/\s+/g, " ").trim();
  const brand = r.brand || "";
  return `
    <a class="fitpl-card" href="${
      r.product_url || "#"
    }" target="_blank" rel="noopener">
      <img src="${r.img_url || ""}" alt="${name}">
      <div class="fitpl-brand">${brand}</div>
      <div class="fitpl-name">${name}</div>
      <div class="fitpl-price">${price}원</div>
    </a>
  `;
}

function renderList(selector, rows) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.innerHTML = (rows || []).slice(0, 20).map(card).join("");
}

async function loadGuestReco() {
  ensureContainers();
  const base = "/.netlify/functions/db";
  try {
    const [climate, activity] = await Promise.all([
      get(`${base}?op=guest_reco_climate`),
      get(`${base}?op=guest_reco_activity`),
    ]);
    renderList("#guestClimate", rowsOf(climate));
    renderList("#guestActivity", rowsOf(activity));
  } catch (e) {
    console.error("게스트 추천 로딩 실패:", e);
    // 최소한의 오류 메시지 표시
    ensureContainers();
    const wrap = document.querySelector("#fitpl-guest-root");
    wrap &&
      wrap.insertAdjacentHTML(
        "beforeend",
        `<p style="color:#c00">추천을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>`
      );
  }
}

document.addEventListener("DOMContentLoaded", loadGuestReco);
