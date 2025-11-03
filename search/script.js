// Figma SearchPage 프레임 기반 인터랙션 시스템
class FigmaSearchPageController {
  constructor() {
    this.frameData = {
      id: "1441:5455",
      name: "SearchPage",
      type: "FRAME",
      width: 1440,
      height: 852,
      position: { x: -24478, y: 4625 },
      backgroundColor: "#f5f5f5",
      elements: [],
    };

    this.searchHistory = [];
    this.brandHistory = [];
    this.isFrameInfoVisible = false;
    this.selectedCountry = null; // 선택된 국가 저장

    // 국가별 지역 매핑 (Detailpage의 countryConfig 기반)
    this.countryRegionMap = {
      일본: ["도쿄", "오사카"],
      베트남: ["하노이", "다낭"],
      중국: ["상하이", "광저우"],
      홍콩: ["홍콩"],
      대만: ["타이베이", "가오슝"],
      태국: ["방콕", "치앙마이"],
      싱가포르: ["싱가포르"],
      미국: ["괌", "하와이"],
      호주: ["시드니"],
    };

    // 카테고리 태그와 국가명 매핑
    this.categoryToCountry = {
      beauty: "일본",
      player: "베트남",
      outlet: "중국",
      boutique: "홍콩",
      shoes: "대만",
      kids: "태국",
      travel: "싱가포르",
      america: "미국",
      australia: "호주",
    };

    // 국가명과 region_id 기본값 매핑
    this.countryToDefaultRegionId = {
      일본: 1, // 도쿄
      베트남: 10, // 하노이
      중국: 3, // 상하이
      홍콩: 13,
      대만: 6, // 타이베이
      태국: 7, // 방콕
      싱가포르: 19,
      미국: 17, // 괌
      호주: 20, // 시드니
    };

    // 지역명과 region_id 매핑
    this.regionNameToId = {
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

    this.init();
  }

  // 초기화
  init() {
    this.setupEventListeners();
    this.loadStoredData();
    console.log("Figma SearchPage Controller 초기화 완료");
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 검색 관련
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const closeButton = document.getElementById("closeButton");

    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.performSearch();
        }
      });
    }

    if (searchButton) {
      searchButton.addEventListener("click", () => this.performSearch());
    }

    if (closeButton) {
      closeButton.addEventListener("click", () =>
        this.navigateToFitplWebsite()
      );
    }



    // 카테고리 태그 클릭
    document.querySelectorAll(".category-tag").forEach((tag) => {
      tag.addEventListener("click", (e) => {
        // 이벤트 버블링 방지
        e.stopPropagation();
        const category = e.target.dataset.category;
        const country = this.categoryToCountry[category];

        // 이미 선택된 태그인지 확인 (원본 위치의 태그 기준)
        const isCurrentlySelected = tag.classList.contains("selected");

        if (isCurrentlySelected) {
          // 선택 해제
          this.deselectTag(tag);
        } else {
          // 다른 태그 선택 해제 (한 개만 선택 가능)
          document.querySelectorAll(".category-tag").forEach((t) => {
            if (t.classList.contains("selected")) {
              this.deselectTag(t);
            }
          });

          // 현재 태그 선택
          this.selectTag(tag, country);
        }
      });
    });

    // 프레임 정보 패널
    const closeFrameInfoBtn = document.getElementById("closeFrameInfo");
    const refreshFrameBtn = document.getElementById("refreshFrameBtn");
    const exportFrameBtn = document.getElementById("exportFrameBtn");
    const overlay = document.getElementById("overlay");

    if (closeFrameInfoBtn) {
      closeFrameInfoBtn.addEventListener("click", () => this.hideFrameInfo());
    }

    if (refreshFrameBtn) {
      refreshFrameBtn.addEventListener("click", () => this.refreshFrameData());
    }

    if (exportFrameBtn) {
      exportFrameBtn.addEventListener("click", () => this.exportFrameData());
    }

    if (overlay) {
      overlay.addEventListener("click", () => this.hideFrameInfo());
    }

    // 토스트 닫기
    const toastClose = document.getElementById("toastClose");
    if (toastClose) {
      toastClose.addEventListener("click", () => this.hideToast());
    }

    // 프레임 정보 표시 (더블클릭) - 개발용이므로 제거 또는 비활성화
    // const searchPageFrame = document.getElementById("searchPageFrame");
    // if (searchPageFrame) {
    //   searchPageFrame.addEventListener("dblclick", () => this.showFrameInfo());
    // }
  }

  // 검색 실행
  performSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
      this.showToast("검색어를 입력해주세요", "warning");
      return;
    }

    // 국가가 선택되었고, 검색어가 해당 국가의 지역명인지 확인
    if (this.selectedCountry) {
      const regions = this.countryRegionMap[this.selectedCountry] || [];
      const matchingRegion = regions.find((region) => region === searchTerm);
      
      if (matchingRegion) {
        // 지역명과 일치하면 해당 국가의 Detailpage로 이동
        const regionId = this.regionNameToId[matchingRegion];
        this.navigateToDetailPageWithRegion(this.selectedCountry, regionId);
        return;
      } else {
        // 지역명이 아니면 일반 검색으로 처리하거나 국가 페이지로 이동
        const defaultRegionId = this.countryToDefaultRegionId[this.selectedCountry];
        this.navigateToDetailPageWithRegion(this.selectedCountry, defaultRegionId);
        return;
      }
    }

    // 국가가 선택되지 않았을 때는 일반 검색 처리
    this.addToSearchHistory(searchTerm);
    this.showToast(`"${searchTerm}" 검색 중...`, "info");

    // 검색 시뮬레이션
    setTimeout(() => {
      this.showToast(`"${searchTerm}" 검색 결과를 찾았습니다`, "success");
      this.updateSearchUI(searchTerm);
    }, 1000);
  }

  // 검색어 히스토리에 추가
  addToSearchHistory(searchTerm) {
    if (!this.searchHistory.includes(searchTerm)) {
      this.searchHistory.unshift(searchTerm);
      if (this.searchHistory.length > 10) {
        this.searchHistory.pop();
      }
      this.saveStoredData();
    }
  }

  // Detailpage로 이동
  navigateToDetailPage() {
    // Detailpage로 이동
    window.location.href = "../Detailpage/index.html";
  }

  // 국가와 지역을 지정하여 Detailpage로 이동
  navigateToDetailPageWithRegion(country, regionId) {
    const params = new URLSearchParams();
    params.set("country", country);
    if (regionId) {
      params.set("region_id", regionId);
    }
    window.location.href = `../Detailpage/index.html?${params.toString()}`;
  }

  // Nation1-1로 이동
  navigateToNation1_1() {
    window.location.href = "../Nation1-1/index.html";
  }

  // Fitpl Website로 이동
  navigateToFitplWebsite() {
    // Fitpl Website로 이동
    window.location.href = "../fitpl-website/index.html";
  }

  // 태그 선택 (목록에 스타일 변경 + 검색창에 표시)
  selectTag(tagElement, country) {
    const selectedTagsContainer = document.getElementById("selectedTagsContainer");
    const categoryTagsSection = document.querySelector(".category-tags-section");

    // 원본 태그에 selected 클래스 추가 (스타일 변경)
    tagElement.classList.add("selected");

    // 검색창에 표시할 태그 복제본 생성
    const tagClone = tagElement.cloneNode(true);
    tagClone.dataset.isClone = "true";
    tagClone.dataset.originalTag = "true";
    
    // x 버튼 추가
    if (!tagClone.querySelector(".tag-remove")) {
      const removeBtn = document.createElement("span");
      removeBtn.className = "tag-remove";
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deselectTag(tagElement);
      });
      tagClone.appendChild(removeBtn);
    }

    // 검색창에 추가
    selectedTagsContainer.appendChild(tagClone);
    selectedTagsContainer.style.display = "flex";

    // 국가 선택 상태 저장
    if (country) {
      this.selectedCountry = country;
      this.showToast(`${country} 선택됨`, "info");
    }
  }

  // 태그 선택 해제
  deselectTag(tagElement) {
    const selectedTagsContainer = document.getElementById("selectedTagsContainer");
    
    // 원본 태그에서 selected 클래스 제거
    tagElement.classList.remove("selected");
    
    // 검색창의 복제본 제거
    const clone = selectedTagsContainer.querySelector(`[data-category="${tagElement.dataset.category}"][data-is-clone="true"]`);
    if (clone) {
      clone.remove();
    }

    // 검색창에 태그가 없으면 컨테이너 숨기기
    if (selectedTagsContainer.children.length === 0) {
      selectedTagsContainer.style.display = "none";
    }

    this.selectedCountry = null;
    this.showToast("선택 해제됨", "info");
  }

  // 태그를 검색바로 이동 (단순 버전)
  moveTagToSearchBarSimple(tagElement) {
    const selectedTagsContainer = document.getElementById("selectedTagsContainer");
    const categoryTagsSection = document.querySelector(".category-tags-section");
    
    // 이미 검색창에 있는지 확인
    const isInSearchBar = tagElement.parentElement === selectedTagsContainer;
    
    if (isInSearchBar) {
      // 이미 검색창에 있으면 원래 위치로 이동
      this.moveTagBackToCategorySimple(tagElement);
    } else {
      // 원래 인덱스 저장
      const allTags = Array.from(categoryTagsSection.children);
      const originalIndex = allTags.indexOf(tagElement);
      if (originalIndex >= 0) {
        tagElement.dataset.originalIndex = originalIndex;
      }
      
      // 태그를 search-bar로 이동
      selectedTagsContainer.appendChild(tagElement);
      tagElement.classList.add("selected");
      
      // x 버튼이 없으면 추가
      if (!tagElement.querySelector(".tag-remove")) {
        const removeBtn = document.createElement("span");
        removeBtn.className = "tag-remove";
        removeBtn.textContent = "×";
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.moveTagBackToCategorySimple(tagElement);
        });
        tagElement.appendChild(removeBtn);
      }
      
      selectedTagsContainer.style.display = "flex";
    }
  }
  
  // 태그를 다시 category-tags-section으로 이동 (단순 버전)
  moveTagBackToCategorySimple(tagElement) {
    const selectedTagsContainer = document.getElementById("selectedTagsContainer");
    const categoryTagsSection = document.querySelector(".category-tags-section");
    
    // x 버튼 제거
    const removeBtn = tagElement.querySelector(".tag-remove");
    if (removeBtn) {
      removeBtn.remove();
    }
    
    // 원래 인덱스 가져오기
    const originalIndex = parseInt(tagElement.dataset.originalIndex);
    
    // category-tags-section으로 이동
    if (!isNaN(originalIndex) && originalIndex < categoryTagsSection.children.length) {
      // 원래 위치에 삽입
      const referenceTag = categoryTagsSection.children[originalIndex];
      categoryTagsSection.insertBefore(tagElement, referenceTag);
    } else {
      // 인덱스가 유효하지 않으면 마지막에 추가
      categoryTagsSection.appendChild(tagElement);
    }
    
    tagElement.classList.remove("selected");
    
    // 선택된 태그가 없으면 컨테이너 숨기기
    if (selectedTagsContainer.children.length === 0) {
      selectedTagsContainer.style.display = "none";
    }
  }

  // 카테고리 필터링
  filterByCategory(category) {
    const categoryNames = {
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

    const categoryName = categoryNames[category];
    this.showToast(`${categoryName} 카테고리로 필터링`, "info");

    // 카테고리별 시각적 피드백
    document.querySelectorAll(".category-tag").forEach((tag) => {
      tag.style.opacity = tag.dataset.category === category ? "1" : "0.5";
    });

    setTimeout(() => {
      document.querySelectorAll(".category-tag").forEach((tag) => {
        tag.style.opacity = "1";
      });
    }, 2000);
  }

  // 검색 UI 업데이트
  updateSearchUI(searchTerm) {
    // 검색 결과에 따른 UI 변화 시뮬레이션
    const searchPageFrame = document.getElementById("searchPageFrame");
    searchPageFrame.style.transform = "scale(1.02)";
    searchPageFrame.style.transition = "transform 0.3s ease";

    setTimeout(() => {
      searchPageFrame.style.transform = "scale(1)";
    }, 300);
  }

  // 프레임 정보 표시
  showFrameInfo() {
    const frameInfoPanel = document.getElementById("frameInfoPanel");
    const overlay = document.getElementById("overlay");

    if (frameInfoPanel && overlay) {
      frameInfoPanel.style.display = "block";
      overlay.style.display = "block";
      this.isFrameInfoVisible = true;

      // 프레임 정보 업데이트
      this.updateFrameInfo();
    }
  }

  // 프레임 정보 숨기기
  hideFrameInfo() {
    const frameInfoPanel = document.getElementById("frameInfoPanel");
    const overlay = document.getElementById("overlay");

    if (frameInfoPanel && overlay) {
      frameInfoPanel.style.display = "none";
      overlay.style.display = "none";
      this.isFrameInfoVisible = false;
    }
  }

  // 프레임 정보 업데이트
  updateFrameInfo() {
    const elements = {
      frameId: this.frameData.id,
      frameName: this.frameData.name,
      frameType: this.frameData.type,
      frameSize: `${this.frameData.width} × ${this.frameData.height}`,
      framePosition: `(${this.frameData.position.x}, ${this.frameData.position.y})`,
      frameBgColor: this.frameData.backgroundColor,
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  // 프레임 데이터 새로고침
  refreshFrameData() {
    this.showToast("프레임 데이터를 새로고침합니다...", "info");

    setTimeout(() => {
      this.updateFrameInfo();
      this.showToast("프레임 데이터가 업데이트되었습니다", "success");
    }, 1000);
  }

  // 프레임 데이터 내보내기
  exportFrameData() {
    const exportData = {
      ...this.frameData,
      searchHistory: this.searchHistory,
      brandHistory: this.brandHistory,
      exportTime: new Date().toISOString(),
      version: "1.0.0",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `figma_searchpage_${this.frameData.id}.json`;
    link.click();

    URL.revokeObjectURL(url);
    this.showToast("프레임 데이터가 내보내기되었습니다", "success");
  }

  // 로컬 스토리지에서 데이터 로드
  loadStoredData() {
    try {
      const storedSearchHistory = localStorage.getItem("figma_search_history");
      const storedBrandHistory = localStorage.getItem("figma_brand_history");

      if (storedSearchHistory) {
        this.searchHistory = JSON.parse(storedSearchHistory);
      }

      if (storedBrandHistory) {
        this.brandHistory = JSON.parse(storedBrandHistory);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  }

  // 로컬 스토리지에 데이터 저장
  saveStoredData() {
    try {
      localStorage.setItem(
        "figma_search_history",
        JSON.stringify(this.searchHistory)
      );
      localStorage.setItem(
        "figma_brand_history",
        JSON.stringify(this.brandHistory)
      );
    } catch (error) {
      console.error("데이터 저장 실패:", error);
    }
  }

  // 토스트 메시지 표시
  showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.className = `toast toast-${type}`;
      toast.style.display = "block";

      // 3초 후 자동 숨기기
      setTimeout(() => {
        this.hideToast();
      }, 3000);
    }
  }

  // 토스트 숨기기
  hideToast() {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.style.display = "none";
    }
  }

  // 키보드 단축키
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + K: 검색창 포커스
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("searchInput");
        searchInput.focus();
      }

      // Escape: 프레임 정보 패널 닫기
      if (e.key === "Escape" && this.isFrameInfoVisible) {
        this.hideFrameInfo();
      }

      // F12: 프레임 정보 표시
      if (e.key === "F12") {
        e.preventDefault();
        this.showFrameInfo();
      }
    });
  }
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  console.log("Figma SearchPage 로딩 중...");
  window.figmaSearchController = new FigmaSearchPageController();
  window.figmaSearchController.setupKeyboardShortcuts();
});

// 개발자 도구용 전역 함수들
window.figmaUtils = {
  getFrameData: () => window.figmaSearchController.frameData,
  getSearchHistory: () => window.figmaSearchController.searchHistory,
  getBrandHistory: () => window.figmaSearchController.brandHistory,
  showFrameInfo: () => window.figmaSearchController.showFrameInfo(),
  exportData: () => window.figmaSearchController.exportFrameData(),
};
