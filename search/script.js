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
        const category = e.target.dataset.category;

        // 베트남( player ) 클릭 시 Nation1-1로 이동
        if (category === "player") {
          this.navigateToNation1_1();
          return;
        }

        // beauty 태그가 selected 상태일 때 Detailpage로 이동
        if (category === "beauty" && e.target.classList.contains("selected")) {
          this.navigateToDetailPage();
          return;
        }

        this.moveTagToSearchBar(e.target);
        this.filterByCategory(category);
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

    // 프레임 정보 표시 (더블클릭)
    const searchPageFrame = document.getElementById("searchPageFrame");
    if (searchPageFrame) {
      searchPageFrame.addEventListener("dblclick", () => this.showFrameInfo());
    }
  }

  // 검색 실행
  performSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
      this.showToast("검색어를 입력해주세요", "warning");
      return;
    }

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

  // Nation1-1로 이동
  navigateToNation1_1() {
    window.location.href = "../Nation1-1/index.html";
  }

  // Fitpl Website로 이동
  navigateToFitplWebsite() {
    // Fitpl Website로 이동
    window.location.href = "../fitpl-website/index.html";
  }

  // 태그를 검색바로 이동
  moveTagToSearchBar(tagElement) {
    const selectedTagsContainer = document.getElementById("selectedTagsContainer");
    
    // 이미 선택된 태그인지 확인
    const isAlreadySelected = tagElement.classList.contains("selected");
    
    if (isAlreadySelected) {
      // 이미 선택된 태그면 제거하고 category-tags-section으로 다시 이동
      this.moveTagBackToCategory(tagElement);
    } else {
      // 원래 인덱스 저장
      const categoryTagsSection = document.querySelector(".category-tags-section");
      const allTags = Array.from(categoryTagsSection.children);
      const originalIndex = allTags.indexOf(tagElement);
      tagElement.dataset.originalIndex = originalIndex;
      
      // 태그를 search-bar로 이동
      selectedTagsContainer.appendChild(tagElement);
      tagElement.classList.add("selected");
      
      // 제거 버튼 추가
      const removeBtn = document.createElement("span");
      removeBtn.className = "tag-remove";
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.moveTagBackToCategory(tagElement);
      });
      
      tagElement.appendChild(removeBtn);
      selectedTagsContainer.style.display = "flex";
    }
  }
  
  // 태그를 다시 category-tags-section으로 이동
  moveTagBackToCategory(tagElement) {
    const selectedTagsContainer = document.getElementById("selectedTagsContainer");
    const categoryTagsSection = document.querySelector(".category-tags-section");
    
    // 제거 버튼 제거
    const removeBtn = tagElement.querySelector(".tag-remove");
    if (removeBtn) {
      removeBtn.remove();
    }
    
    // 원래 인덱스 가져오기
    const originalIndex = parseInt(tagElement.dataset.originalIndex);
    
    // category-tags-section으로 이동 - 원래 위치에 배치
    if (isNaN(originalIndex) || originalIndex >= categoryTagsSection.children.length) {
      // 인덱스가 유효하지 않으면 마지막에 추가
      categoryTagsSection.appendChild(tagElement);
    } else {
      // 원래 위치에 삽입
      const referenceTag = categoryTagsSection.children[originalIndex];
      categoryTagsSection.insertBefore(tagElement, referenceTag);
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
