// 검색 모달 관련 변수
console.log("[검색 초기화] 스크립트 로드됨");
const searchModal = document.getElementById("searchModal");
const searchInputModal = document.getElementById("searchInputModal");
const searchButtonModal = document.getElementById("searchButtonModal");
const closeButtonModal = document.getElementById("closeButtonModal");

console.log("[검색 초기화] 요소 확인:", {
  searchModal: !!searchModal,
  searchInputModal: !!searchInputModal,
  searchButtonModal: !!searchButtonModal,
  closeButtonModal: !!closeButtonModal,
});

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
(function setupSearchSectionRedirect() {
  console.log("[검색 리디렉션] 초기화 시작...");

  function redirectToSearch() {
    console.log("[검색 리디렉션] 🔵🔵🔵 리디렉션 실행!");
    let url = "../search/index.html";
    // utm_source 파라미터 유지
    if (typeof window.preserveUTMParams === "function") {
      url = window.preserveUTMParams(url);
    }
    window.location.href = url;
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

// 지역명과 region_id 매핑
const regionNameToId = {
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

// 카테고리 태그와 국가명 매핑
const categoryToCountry = {
  beauty: "일본",
  player: "베트남",
  outlet: "중국",
  boutique: "홍콩",
  shoes: "대만",
  kids: "태국",
  used: "라오스",
  travel: "싱가포르",
  america: "미국",
  australia: "호주",
};

// 국가명과 기본 region_id 매핑
const countryToDefaultRegionId = {
  일본: 1, // 도쿄
  베트남: 10, // 하노이
  중국: 3, // 상하이
  홍콩: 13,
  대만: 6, // 타이베이
  태국: 7, // 방콕
  싱가포르: 19,
  미국: 17, // 괌
  호주: 20, // 시드니
  라오스: null, // 기본 지역 없음
};

// 활성화된 카테고리 태그 확인
function getActiveCategoryTag() {
  // 모달 내부와 모달 외부 모두에서 찾기
  const activeTag = document.querySelector(".category-tag.selected");
  console.log("[검색 디버깅] 활성화된 태그:", activeTag);
  if (activeTag) {
    const category = activeTag.dataset.category;
    const country = categoryToCountry[category];
    console.log("[검색 디버깅] 카테고리:", category, "→ 국가:", country);
    return country || null;
  }
  console.log("[검색 디버깅] 활성화된 태그 없음");
  return null;
}

// 지역명으로 검색하는 함수
function navigateToRegionPage(regionName) {
  console.log("[검색 디버깅] navigateToRegionPage 호출:", regionName);
  const regionId = regionNameToId[regionName];
  console.log("[검색 디버깅] regionId:", regionId);

  if (regionId) {
    // 지역명과 국가 매핑
    const regionToCountry = {
      도쿄: "일본",
      오사카: "일본",
      상하이: "중국",
      광저우: "중국",
      가오슝: "대만",
      타이베이: "대만",
      방콕: "태국",
      치앙마이: "태국",
      다낭: "베트남",
      하노이: "베트남",
      마닐라: "필리핀",
      세부: "필리핀",
      홍콩: "홍콩",
      마카오: "홍콩",
      발리: "인도네시아",
      자카르타: "인도네시아",
      괌: "미국",
      하와이: "미국",
      싱가포르: "싱가포르",
      시드니: "호주",
    };

    const country = regionToCountry[regionName];
    console.log("[검색 디버깅] 매핑된 국가:", country);

    if (country) {
      const params = new URLSearchParams();
      params.set("country", country);
      params.set("region_id", regionId);
      params.set("source", "search"); // 검색창에서 이동
      let url = `../Detailpage/index.html?${params.toString()}`;
      // utm_source 파라미터 유지
      if (typeof window.preserveUTMParams === "function") {
        url = window.preserveUTMParams(url);
      }
      console.log("[검색 디버깅] 최종 이동 URL:", url);
      window.location.href = url;
      return true;
    } else {
      console.log("[검색 디버깅] 국가 매핑 실패");
    }
  } else {
    console.log("[검색 디버깅] regionId 찾기 실패");
  }
  return false;
}

// 검색 실행 함수 (통합)
function executeSearch() {
  console.log("[검색] executeSearch 함수 호출됨");

  const searchInput = document.getElementById("searchInputModal");
  const searchTerm = searchInput?.value.trim() || "";
  const activeCountry = getActiveCategoryTag();

  console.log("[검색] 검색어:", searchTerm, "활성 국가:", activeCountry);

  // 경우 1: 태그 활성화되었지만 검색어가 없는 경우 → 해당 국가 페이지로 이동
  if (!searchTerm && activeCountry) {
    console.log("[검색] ✅ 경우 1 실행: 태그 활성화 + 검색어 없음");
    const defaultRegionId = countryToDefaultRegionId[activeCountry];
    if (defaultRegionId) {
      const params = new URLSearchParams();
      params.set("country", activeCountry);
      params.set("region_id", defaultRegionId);
      params.set("source", "search"); // 검색창에서 이동
      let url = `../Detailpage/index.html?${params.toString()}`;
      // utm_source 파라미터 유지
      if (typeof window.preserveUTMParams === "function") {
        url = window.preserveUTMParams(url);
      }
      console.log("[검색] 이동 URL:", url);
      window.location.href = url;
      return true;
    } else {
      const params = new URLSearchParams();
      params.set("country", activeCountry);
      params.set("source", "search"); // 검색창에서 이동
      let url = `../Detailpage/index.html?${params.toString()}`;
      // utm_source 파라미터 유지
      if (typeof window.preserveUTMParams === "function") {
        url = window.preserveUTMParams(url);
      }
      console.log("[검색] 이동 URL (기본 지역 없음):", url);
      window.location.href = url;
      return true;
    }
  }

  // 경우 2: 지역명 입력 시 → 해당 지역 페이지로 이동
  if (searchTerm) {
    console.log("[검색] 경우 2 체크: 지역명 매칭 중...");
    const matchingRegion = Object.keys(regionNameToId).find(
      (region) =>
        region === searchTerm ||
        region.includes(searchTerm) ||
        searchTerm.includes(region)
    );

    console.log("[검색] 매칭된 지역:", matchingRegion);

    if (matchingRegion) {
      console.log("[검색] ✅ 경우 2 실행: 지역명으로 페이지 이동");
      if (navigateToRegionPage(matchingRegion)) {
        return true;
      }
    }
  }

  // 일반 검색 (검색어가 있는 경우만)
  if (searchTerm) {
    console.log("[검색] 일반 검색 실행:", searchTerm);
    searchProducts(searchTerm);
    hideSearchModal();
    return true;
  } else if (!activeCountry) {
    console.log("[검색] 검색어 없음 + 태그 없음 - 아무 동작 없음");
  }

  return false;
}

// 검색 모달 내부 검색 기능 (우선순위 높게 실행)
function setupSearchButtonHandler() {
  const btn = document.getElementById("searchButtonModal");
  if (!btn) {
    console.log("[검색] searchButtonModal 요소를 찾을 수 없습니다");
    return;
  }

  console.log("[검색] 검색 버튼 이벤트 리스너 설정 중...");

  // 모든 기존 이벤트 리스너 제거
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  const searchBtn = document.getElementById("searchButtonModal");
  const searchInput = document.getElementById("searchInputModal");

  if (!searchBtn) {
    console.log("[검색] 검색 버튼을 찾을 수 없습니다");
    return;
  }

  searchBtn.addEventListener(
    "click",
    function handleSearchClick(e) {
      console.log("[검색] 🔵 검색 버튼 클릭 이벤트 발생!");
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); // 다른 리스너도 차단

      executeSearch();
    },
    true
  ); // capture phase에서 먼저 실행

  console.log("[검색] 검색 버튼 이벤트 리스너 설정 완료");
}

// Enter 키 이벤트 설정
function setupSearchInputHandler() {
  const input = document.getElementById("searchInputModal");
  if (!input) {
    console.log("[검색] searchInputModal 요소를 찾을 수 없습니다");
    return;
  }

  console.log("[검색] 검색 입력창 이벤트 리스너 설정 중...");

  // 기존 리스너 제거 후 재설정
  const newInput = input.cloneNode(true);
  input.parentNode.replaceChild(newInput, input);

  const searchInput = document.getElementById("searchInputModal");

  searchInput.addEventListener(
    "keypress",
    function handleEnterKey(e) {
      if (e.key === "Enter") {
        console.log("[검색] 🔵 Enter 키 입력 이벤트 발생!");
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        executeSearch();
      }
    },
    true
  );

  // 참조 업데이트
  window.searchInputModal = searchInput;
  console.log("[검색] 검색 입력창 이벤트 리스너 설정 완료");
}

// DOM 로드 후 실행 및 주기적 재설정
function initializeSearchHandlers() {
  console.log("[검색 초기화] initializeSearchHandlers 호출됨");
  setupSearchButtonHandler();
  setupSearchInputHandler();
  console.log("[검색 초기화] 완료");
}

console.log("[검색 초기화] document.readyState:", document.readyState);

if (document.readyState === "loading") {
  console.log("[검색 초기화] DOMContentLoaded 이벤트 등록");
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[검색 초기화] DOMContentLoaded 이벤트 발생");
    initializeSearchHandlers();
  });
} else {
  console.log("[검색 초기화] DOM 이미 로드됨, 즉시 실행");
  initializeSearchHandlers();
}

// 모달 열릴 때마다 재설정 (원본 함수 오버라이드)
const originalShowSearchModal = window.showSearchModal;
window.showSearchModal = function () {
  if (
    originalShowSearchModal &&
    originalShowSearchModal !== window.showSearchModal
  ) {
    originalShowSearchModal.call(this);
  } else {
    // 기본 동작
    const modal = document.getElementById("searchModal");
    if (modal) {
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        const input = document.getElementById("searchInputModal");
        if (input) input.focus();
      }, 300);
    }
  }
  // 이벤트 리스너 재설정 (다른 스크립트가 덮어쓸 수 있으므로)
  setTimeout(initializeSearchHandlers, 150);
};

// MutationObserver로 모달이 열릴 때 감지
const modalObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      const modal = document.getElementById("searchModal");
      if (modal && modal.classList.contains("show")) {
        setTimeout(initializeSearchHandlers, 50);
      }
    }
  });
});

// searchModal은 이미 상단에서 선언되었으므로 중복 선언 제거
if (searchModal) {
  modalObserver.observe(searchModal, {
    attributes: true,
    attributeFilter: ["class"],
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

// 카테고리 태그 클릭 이벤트 (중복 방지)
let categoryTagListenersSetup = false;

function setupCategoryTagListeners() {
  // 이미 설정되었으면 중복 방지
  if (categoryTagListenersSetup) {
    console.log("[태그 디버깅] 리스너 이미 설정됨");
    return;
  }

  const tags = document.querySelectorAll(".category-tag");
  console.log(`[태그 디버깅] ${tags.length}개 태그에 리스너 설정`);

  tags.forEach((tag) => {
    // 기존 리스너 제거 (이벤트 위임 방식으로 변경)
    tag.removeEventListener("click", handleCategoryTagClick);
    tag.addEventListener("click", handleCategoryTagClick);
  });

  categoryTagListenersSetup = true;
}

function handleCategoryTagClick(e) {
  e.stopPropagation();
  e.preventDefault();

  const tag = e.currentTarget || e.target.closest(".category-tag");
  if (!tag) return;

  const category = tag.dataset.category;
  const country = categoryToCountry[category];

  console.log(
    "[태그 디버깅] 태그 클릭 - 카테고리:",
    category,
    "국가:",
    country
  );

  if (!country) {
    console.log("[태그 디버깅] 국가 매핑 실패");
    return;
  }

  // 이미 선택된 태그인지 확인
  const isCurrentlySelected = tag.classList.contains("selected");
  console.log("[태그 디버깅] 현재 선택 상태:", isCurrentlySelected);

  // 모든 태그 선택 해제
  document.querySelectorAll(".category-tag").forEach((t) => {
    t.classList.remove("selected");
  });

  if (!isCurrentlySelected) {
    // 태그 선택
    tag.classList.add("selected");
    console.log(`[태그 디버깅] ${country} 태그 활성화됨`);
    console.log(
      `[태그 디버깅] selected 클래스 추가 확인:`,
      tag.classList.contains("selected")
    );
  } else {
    // 태그 선택 해제
    console.log(`[태그 디버깅] ${country} 태그 비활성화됨`);
  }
}

// 페이지 로드 시 카테고리 태그 리스너 설정
document.addEventListener("DOMContentLoaded", () => {
  setupCategoryTagListeners();
});

// 모달이 열릴 때도 리스너 다시 설정
// topbar의 검색 버튼 (모달을 여는 버튼)
const topbarSearchBtn = document.querySelector(".topbar .search-btn");
if (topbarSearchBtn) {
  const originalSearchBtnClick = topbarSearchBtn.onclick;
  topbarSearchBtn.addEventListener("click", () => {
    setTimeout(() => {
      categoryTagListenersSetup = false; // 리셋하여 다시 설정
      setupCategoryTagListeners();
    }, 100);
  });
}

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
// searchInput과 searchBtn은 이미 다른 곳에서 선언되었거나 사용되지 않으므로 중복 선언 제거
// const searchInput = document.querySelector(".search-input");
// const searchBtn = document.querySelector(".search-btn");
const navLinks = document.querySelectorAll(".nav-link");
const logoutBtn = document.querySelector(".logout-btn");

// FITPL 버튼 클릭 이벤트
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    // 현재 페이지이므로 새로고침 또는 다른 동작
    window.location.reload();
  });
}

// 국가 필터 기능 - 리디렉션만 수행 (HTML의 href 속성 사용)
// JavaScript 이벤트 리스너 제거: 모든 국가 버튼은 <a> 태그의 href로 자동 리디렉션됨

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

// 검색 기능 - 메인페이지에서는 검색창 클릭 시 search 페이지로 이동하므로 비활성화
// function performSearch() {
//   const searchTerm = searchInput.value.trim();
//   if (searchTerm) {
//     console.log("검색어:", searchTerm);
//     // 실제 검색 로직 구현
//     searchProducts(searchTerm);
//   }
// }

// 메인페이지의 검색창은 클릭 시 search 페이지로 리디렉션되므로 performSearch 비활성화
// if (searchBtn) {
//   searchBtn.addEventListener("click", performSearch);
// }

// if (searchInput) {
//   searchInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//       performSearch();
//     }
//   });
// }

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

if (header) {
  window.addEventListener("scroll", () => {
    if (!header) return; // 추가 안전 체크

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
}

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
    let url = "../Detail/navigation.html";
    // utm_source 파라미터 유지
    if (typeof window.preserveUTMParams === "function") {
      url = window.preserveUTMParams(url);
    }
    window.location.href = url;
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

  // 오른쪽 배너: 일본 페이지로 리디렉션
  if (popularBanner) {
    popularBanner.style.cursor = "pointer";
    popularBanner.addEventListener("click", () => {
      let url = "../Detailpage/index.html?country=일본&source=banner";
      // utm_source 파라미터 유지
      if (typeof window.preserveUTMParams === "function") {
        url = window.preserveUTMParams(url);
      }
      window.location.href = url;
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

      // product-card 클릭 이벤트 (로드 전에는 비활성화)
      card.dataset.loaded = "false";
      card.style.pointerEvents = "none";
      card.style.opacity = "0.6";
      card.classList.add("product-loading");

      // 이미지 로드 완료 후 활성화
      const img = card.querySelector("img");
      if (img) {
        if (img.complete) {
          card.dataset.loaded = "true";
          card.style.pointerEvents = "auto";
          card.style.opacity = "1";
          card.style.cursor = "pointer";
          card.classList.remove("product-loading");
        } else {
          img.addEventListener("load", () => {
            card.dataset.loaded = "true";
            card.style.pointerEvents = "auto";
            card.style.opacity = "1";
            card.style.cursor = "pointer";
            card.classList.remove("product-loading");
          });
          img.addEventListener("error", () => {
            card.dataset.loaded = "true";
            card.style.pointerEvents = "auto";
            card.style.opacity = "1";
            card.style.cursor = "pointer";
            card.classList.remove("product-loading");
          });
        }
      } else {
        // 이미지가 없으면 즉시 활성화
        card.dataset.loaded = "true";
        card.style.pointerEvents = "auto";
        card.style.opacity = "1";
        card.style.cursor = "pointer";
        card.classList.remove("product-loading");
      }

      card.addEventListener("click", (e) => {
        // 제품이 로드되지 않았으면 클릭 막기
        if (card.dataset.loaded !== "true") {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        if (!e.target.closest(".like-btn")) {
          let url = "../Detail/navigation.html";
          // utm_source 파라미터 유지
          if (typeof window.preserveUTMParams === "function") {
            url = window.preserveUTMParams(url);
          }
          window.location.href = url;
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
        let url = "../Detail/navigation.html";
        // utm_source 파라미터 유지
        if (typeof window.preserveUTMParams === "function") {
          url = window.preserveUTMParams(url);
        }
        window.location.href = url;
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
    // 본문 상호작용 비활성화 (시각적으로만)
    if (appContainer) {
      appContainer.setAttribute("aria-hidden", "true");
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
      appContainer.removeAttribute("aria-hidden");
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

  // 국가-도시 매핑
  const countryToCities = {
    일본: ["도쿄", "오사카"],
    중국: ["상하이", "광저우"],
    대만: ["타이베이", "가오슝"],
    태국: ["방콕", "치앙마이"],
    베트남: ["하노이", "다낭"],
    필리핀: ["마닐라", "세부"],
    홍콩: ["홍콩"],
    마카오: ["마카오"],
    인도네시아: ["자카르타", "발리"],
    미국: ["괌", "하와이"],
    싱가포르: ["싱가포르"],
    호주: ["시드니"],
  };

  // 국가 선택 시 해당 국가의 도시만 표시
  function filterCitiesByCountry(countryName) {
    if (!cityList) {
      console.warn("cityList가 없습니다.");
      return;
    }

    const cities = countryToCities[countryName] || [];
    console.log(
      `[도시 필터링] 선택된 국가: ${countryName}, 표시할 도시:`,
      cities
    );

    const cityItems = cityList.querySelectorAll("li.option-item");
    console.log(`[도시 필터링] 전체 도시 항목 수: ${cityItems.length}`);

    cityItems.forEach((item) => {
      const input = item.querySelector("input");
      const cityName = input?.value;

      if (cityName) {
        if (cities.includes(cityName)) {
          item.style.display = "";
          console.log(`[도시 필터링] 표시: ${cityName}`);
        } else {
          item.style.display = "none";
          // 숨겨진 도시의 선택 해제
          if (input && input.checked) {
            input.checked = false;
            renderChips(chipsCity, [], null);
          }
          console.log(`[도시 필터링] 숨김: ${cityName}`);
        }
      }
    });
  }

  // 초기 로드 시 모든 도시 숨기기 (국가 선택 전까지)
  function hideAllCities() {
    if (!cityList) return;
    const cityItems = cityList.querySelectorAll("li.option-item");
    cityItems.forEach((item) => {
      item.style.display = "none";
    });
  }

  // 초기 로드 시 도시 숨기기
  hideAllCities();

  // 국가 라디오 변경 시 에러 지우기 및 도시 필터링
  if (countryList) {
    countryList.addEventListener("change", (e) => {
      console.log("[국가 선택] 이벤트 발생:", e.target.value);

      if (countryError) countryError.textContent = "";
      const selected = document.querySelector('input[name="country"]:checked');

      console.log("[국가 선택] 선택된 국가:", selected?.value);

      // 국가 선택 시 도시 필터링
      if (selected) {
        filterCitiesByCountry(selected.value);
        // 도시 필드 열기
        const cityField = cityList?.closest(".form-field");
        if (cityField) {
          cityField.classList.remove("collapsed");
        }
      } else {
        // 국가 선택 해제 시 모든 도시 숨기기
        hideAllCities();
      }

      renderChips(chipsCountry, selected ? [selected.value] : [], (value) => {
        const input = countryList.querySelector(`input[value="${value}"]`);
        if (input) input.checked = false;
        renderChips(chipsCountry, [], null);
        // 국가 선택 해제 시 모든 도시 숨기기
        hideAllCities();
      });
      collapseField(countryList.closest(".form-field"));
    });

    // 이미 선택된 국가가 있는 경우 (예: 페이지 리로드 후)
    const initialSelected = document.querySelector(
      'input[name="country"]:checked'
    );
    if (initialSelected) {
      console.log("[초기 로드] 이미 선택된 국가 발견:", initialSelected.value);
      filterCitiesByCountry(initialSelected.value);
    }
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
          countryError.textContent = "국가를 1개 선택해 주세요.";
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

            // 로컬 스토리지에 유저 정보 저장 (1시간 만료)
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1); // 1시간 후 만료

            const userData = {
              user_id: result.user_id,
              trip_region_id: submitData.trip_region_id,
              name: submitData.name,
              email: submitData.email,
              indoor_outdoor: submitData.indoor_outdoor,
              activity_tags: submitData.activity_tags,
              registered_at: new Date().toISOString(),
              expires_at: expiresAt.toISOString(), // 만료 시간 추가
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
// Fallback 이미지 URL
const FALLBACK_IMAGE_URL =
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=260&h=312&fit=crop";

// 이미지 URL 유효성 검사 및 정규화
function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return FALLBACK_IMAGE_URL;

  const trimmed = url.trim();
  if (
    !trimmed ||
    trimmed === "" ||
    trimmed === "null" ||
    trimmed === "undefined"
  ) {
    return FALLBACK_IMAGE_URL;
  }

  // 상대 경로인 경우 (http로 시작하지 않으면)
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    // 상대 경로는 그대로 사용 (서버에서 처리)
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  return trimmed;
}

function createProductCard(product) {
  const price = Number(product.price || 0).toLocaleString();
  const name = (product.product_name || "").replace(/\s+/g, " ").trim();
  const brand = product.brand || "";

  // 이미지 URL 우선순위: product_images 배열의 첫 번째 이미지 > img_url > image_url > fallback
  let imgUrl = FALLBACK_IMAGE_URL;
  if (
    product.images &&
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    imgUrl = normalizeImageUrl(product.images[0]);
  } else if (product.img_url) {
    imgUrl = normalizeImageUrl(product.img_url);
  } else if (product.image_url) {
    imgUrl = normalizeImageUrl(product.image_url);
  }

  const discountRate = product.discount_rate
    ? Math.round(product.discount_rate)
    : null;
  const productUrl = product.product_url || "#";
  const dataSource = product.__source || "";
  const dataRegionId = product.region_id || product.regionId || "";

  const discountHTML = discountRate
    ? `<span class="discount">${discountRate}%</span>`
    : "";

  return `
    <div
      class="product-card product-loading"
      data-product-id="${product.product_id || ""}"
      data-source="${dataSource}"
      data-region-id="${dataRegionId}"
      data-loaded="false"
      style="pointer-events: none; opacity: 0.6; cursor: not-allowed;"
    >
      <div class="product-image">
        <img src="${imgUrl}" alt="${name}" loading="lazy" onerror="this.src='${FALLBACK_IMAGE_URL}'" />
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

  // 제품 카드 로드 완료 표시 (이미지 로드 완료 후)
  const productCards = grid.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    const img = card.querySelector("img");
    if (img) {
      if (img.complete) {
        // 이미지가 이미 로드된 경우
        enableProductCard(card);
      } else {
        // 이미지 로드 대기
        img.addEventListener("load", () => {
          enableProductCard(card);
        });
        img.addEventListener("error", () => {
          // 이미지 로드 실패해도 카드 활성화
          enableProductCard(card);
        });
        // 타임아웃: 3초 후에도 로드되지 않으면 활성화
        setTimeout(() => {
          if (card.dataset.loaded !== "true") {
            enableProductCard(card);
          }
        }, 3000);
      }
    } else {
      // 이미지가 없는 경우 즉시 활성화
      enableProductCard(card);
    }
  });

  // 좋아요 버튼 및 클릭 이벤트 추가
  attachProductEvents(grid);

  console.log(
    `${productsToShow.length}개 제품을 ${selector}에 렌더링했습니다.`
  );
}

// 제품 카드 활성화 함수
function enableProductCard(card) {
  if (!card) return;
  card.dataset.loaded = "true";
  card.classList.remove("product-loading");
  card.style.pointerEvents = "auto";
  card.style.opacity = "1";
  card.style.cursor = "pointer";
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
    // 제품 로드 상태 확인 (data-loaded 속성으로 제어)
    const isLoaded = card.dataset.loaded === "true";

    if (isLoaded) {
      card.style.cursor = "pointer";
      card.style.pointerEvents = "auto";
      card.classList.remove("product-loading");
    } else {
      card.style.cursor = "not-allowed";
      card.style.pointerEvents = "none";
      card.style.opacity = "0.6";
      card.classList.add("product-loading");
    }

    card.addEventListener("click", (e) => {
      // 제품이 로드되지 않았으면 클릭 막기
      if (card.dataset.loaded !== "true") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      if (e.target.closest(".like-btn")) return;
      const productId = card.dataset.productId;
      const source = card.dataset.source;
      const regionId = card.dataset.regionId;
      if (productId) {
        const params = new URLSearchParams();
        params.set("product_id", productId);
        if (source) params.set("source", source);
        if (regionId) params.set("region_id", regionId);
        const url = `../Detail/navigation.html?${params.toString()}`;
        // utm_source 파라미터 유지
        window.location.href =
          typeof window.preserveUTMParams === "function"
            ? window.preserveUTMParams(url)
            : url;
      } else {
        const url = "../Detail/navigation.html";
        window.location.href =
          typeof window.preserveUTMParams === "function"
            ? window.preserveUTMParams(url)
            : url;
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

  // 첫 번째 섹션 제품 카드 로드 완료 표시
  const firstSectionCards = firstGrid.querySelectorAll(".product-card");
  firstSectionCards.forEach((card) => {
    const img = card.querySelector("img");
    if (img) {
      if (img.complete) {
        enableProductCard(card);
      } else {
        img.addEventListener("load", () => enableProductCard(card));
        img.addEventListener("error", () => enableProductCard(card));
        setTimeout(() => {
          if (card.dataset.loaded !== "true") {
            enableProductCard(card);
          }
        }, 3000);
      }
    } else {
      enableProductCard(card);
    }
  });

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

      // 나머지 섹션 제품 카드 로드 완료 표시
      const sectionCards = grid.querySelectorAll(".product-card");
      sectionCards.forEach((card) => {
        const img = card.querySelector("img");
        if (img) {
          if (img.complete) {
            enableProductCard(card);
          } else {
            img.addEventListener("load", () => enableProductCard(card));
            img.addEventListener("error", () => enableProductCard(card));
            setTimeout(() => {
              if (card.dataset.loaded !== "true") {
                enableProductCard(card);
              }
            }, 3000);
          }
        } else {
          enableProductCard(card);
        }
      });

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
async function loadGuestProducts(regionId = null) {
  const base = "/.netlify/functions/db";

  try {
    console.log("[게스트 추천] API 호출 시작", { regionId });

    // region_id 파라미터 추가
    const climateUrl = regionId
      ? `${base}?op=guest_reco_climate&region_id=${regionId}`
      : `${base}?op=guest_reco_climate`;
    const activityUrl = regionId
      ? `${base}?op=guest_reco_activity&region_id=${regionId}`
      : `${base}?op=guest_reco_activity`;

    const [climateRes, activityRes] = await Promise.all([
      fetch(climateUrl),
      fetch(activityUrl),
    ]);

    if (!climateRes.ok) {
      console.error(`[게스트 추천] 기후 API 실패: ${climateRes.status}`);
    }
    if (!activityRes.ok) {
      console.error(`[게스트 추천] 활동 API 실패: ${activityRes.status}`);
    }

    const climateData = await climateRes.json();
    const activityData = await activityRes.json();

    console.log("[게스트 추천] 응답 상세:", {
      climate: {
        ok: climateData?.ok,
        count: climateData?.count,
        rowsLength: climateData?.rows?.length || 0,
        hasRows: !!climateData?.rows,
        error: climateData?.error,
        fullResponse: climateData,
      },
      activity: {
        ok: activityData?.ok,
        count: activityData?.count,
        rowsLength: activityData?.rows?.length || 0,
        hasRows: !!activityData?.rows,
        error: activityData?.error,
        fullResponse: activityData,
      },
    });

    const climateRows = (
      climateData?.rows ||
      climateData?.data?.rows ||
      []
    ).map((row) => ({ ...row, __source: "guest_reco_climate" }));
    const activityRows = (
      activityData?.rows ||
      activityData?.data?.rows ||
      []
    ).map((row) => ({ ...row, __source: "guest_reco_activity" }));

    return {
      climate: climateRows,
      activity: activityRows,
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
    console.warn("[유저 추천] user_id가 없습니다.");
    return { climate: [], activity: [] };
  }

  try {
    console.log(`[유저 추천] API 호출 시작 (user_id: ${userId})`);
    const [climateRes, activityRes] = await Promise.all([
      fetch(`${base}?op=user_country_climate_top&user_id=${userId}&limit=20`),
      fetch(`${base}?op=user_country_activity_top&user_id=${userId}&limit=20`),
    ]);

    // 에러 응답 처리
    if (!climateRes.ok) {
      const errorText = await climateRes.text().catch(() => "");
      console.error(
        `[유저 추천] 기후 API 실패: ${climateRes.status}`,
        errorText
      );
      // 에러가 발생하면 빈 배열 반환하여 fallback 유도
      throw new Error(`기후 추천 API 실패: ${climateRes.status}`);
    }
    if (!activityRes.ok) {
      const errorText = await activityRes.text().catch(() => "");
      console.error(
        `[유저 추천] 활동 API 실패: ${activityRes.status}`,
        errorText
      );
      // 에러가 발생하면 빈 배열 반환하여 fallback 유도
      throw new Error(`활동 추천 API 실패: ${activityRes.status}`);
    }

    const climateData = await climateRes.json();
    const activityData = await activityRes.json();

    // API 응답에서 ok: false인 경우도 에러로 처리
    if (!climateData?.ok || climateData?.error) {
      console.error("[유저 추천] 기후 API 응답 에러:", climateData?.error);
      throw new Error(climateData?.error || "기후 추천 API 응답 에러");
    }
    if (!activityData?.ok || activityData?.error) {
      console.error("[유저 추천] 활동 API 응답 에러:", activityData?.error);
      throw new Error(activityData?.error || "활동 추천 API 응답 에러");
    }

    console.log("[유저 추천] 응답 상세:", {
      climate: {
        ok: climateData?.ok,
        count: climateData?.count,
        rowsLength: climateData?.rows?.length || 0,
        hasRows: !!climateData?.rows,
        error: climateData?.error,
      },
      activity: {
        ok: activityData?.ok,
        count: activityData?.count,
        rowsLength: activityData?.rows?.length || 0,
        hasRows: !!activityData?.rows,
        error: activityData?.error,
      },
    });

    const climateRows = (
      climateData?.rows ||
      climateData?.data?.rows ||
      []
    ).map((row) => ({ ...row, __source: "user_country_climate_top" }));
    const activityRows = (
      activityData?.rows ||
      activityData?.data?.rows ||
      []
    ).map((row) => ({ ...row, __source: "user_country_activity_top" }));

    return {
      climate: climateRows,
      activity: activityRows,
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
    // 유저가 있는 경우
    console.log("[메인페이지] 유저 모드:", {
      user_id: user.user_id,
      trip_region_id: user.trip_region_id,
    });

    // 메인페이지는 특정 지역 페이지가 아니므로 유저의 trip_region_id를 사용해서 게스트 추천 API를 호출
    // 또는 유저 추천 API를 시도하고 실패하면 게스트 추천으로 fallback
    try {
      products = await loadUserProducts(user.user_id);
      console.log("[메인페이지] 유저 추천 결과:", {
        climate: products.climate.length,
        activity: products.activity.length,
      });

      // 유저 추천이 비어있거나 에러가 있으면 게스트 추천으로 fallback
      if (products.climate.length === 0 && products.activity.length === 0) {
        console.log("[메인페이지] 유저 추천이 비어있어 게스트 추천으로 대체");
        // 유저의 trip_region_id가 있으면 해당 지역의 게스트 추천 사용
        if (user.trip_region_id) {
          products = await loadGuestProducts(user.trip_region_id);
        } else {
          products = await loadGuestProducts();
        }
      }
    } catch (error) {
      console.error(
        "[메인페이지] 유저 추천 로드 실패, 게스트 추천으로 대체:",
        error
      );
      // 유저의 trip_region_id가 있으면 해당 지역의 게스트 추천 사용
      if (user.trip_region_id) {
        products = await loadGuestProducts(user.trip_region_id);
      } else {
        products = await loadGuestProducts();
      }
    }
  } else {
    // 게스트인 경우: 게스트 추천 사용
    console.log("[메인페이지] 게스트 모드: 게스트 추천 로드 중...");
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

// 페이지 로드 시 초기화
function initializeMainPage() {
  // URL 파라미터 확인 및 정리 (메인페이지는 country 파라미터 불필요)
  const params = new URLSearchParams(window.location.search);
  const countryParam = params.get("country");

  if (countryParam) {
    // country 파라미터가 있으면 제거하고 URL 정리
    params.delete("country");
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }

  // 필터 버튼은 리디렉션만 수행하므로 active 상태 관리 불필요
  // (HTML에서 ALL 버튼만 active 클래스를 가짐)
}

// 페이지 로드 시 제품 표시
document.addEventListener("DOMContentLoaded", () => {
  // 메인페이지 초기화
  initializeMainPage();

  // 팝업이 닫힌 후 또는 페이지 로드 시 제품 로드
  setTimeout(() => {
    loadAndRenderGuestProducts();
  }, 1000); // 팝업 표시 후 조금 지연
});

// 뒤로가기/앞으로가기 이벤트 처리 (bfcache 대응)
window.addEventListener("pageshow", (event) => {
  // bfcache에서 복원된 경우
  if (event.persisted) {
    initializeMainPage();
    // 제품 다시 로드
    setTimeout(() => {
      loadAndRenderGuestProducts();
    }, 100);
  }
});
