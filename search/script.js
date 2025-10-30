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
    this.updateRankings();
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

    // 최근 검색어 삭제
    const deleteRecentBtn = document.getElementById("deleteRecentBtn");
    if (deleteRecentBtn) {
      deleteRecentBtn.addEventListener("click", () =>
        this.clearRecentSearches()
      );
    }

    // 최근 브랜드 삭제
    const deleteBrandBtn = document.getElementById("deleteBrandBtn");
    if (deleteBrandBtn) {
      deleteBrandBtn.addEventListener("click", () => this.clearRecentBrands());
    }

    // 검색 태그 클릭
    document.querySelectorAll(".search-tag").forEach((tag) => {
      tag.addEventListener("click", (e) => {
        const searchTerm = e.target.dataset.search;
        this.searchFromTag(searchTerm);
      });
    });

    // 브랜드 태그 클릭
    document.querySelectorAll(".brand-tag").forEach((tag) => {
      tag.addEventListener("click", (e) => {
        const brandName = e.target.dataset.brand;
        this.searchFromBrand(brandName);
      });
    });

    // 랭킹 아이템 클릭
    document.querySelectorAll(".rank-item").forEach((item) => {
      item.addEventListener("click", () => {
        const rankText = item.querySelector(".rank-text").textContent;
        this.searchFromRanking(rankText);
      });
    });

    // 카테고리 태그 클릭
    document.querySelectorAll(".category-tag").forEach((tag) => {
      tag.addEventListener("click", (e) => {
        const category = e.target.dataset.category;

        // beauty 카테고리 클릭 시 Detailpage로 이동
        if (category === "beauty") {
          this.navigateToDetailPage();
          return;
        }

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
      this.updateSearchHistoryUI();
    }
  }

  // 브랜드 히스토리에 추가
  addToBrandHistory(brandName) {
    if (!this.brandHistory.includes(brandName)) {
      this.brandHistory.unshift(brandName);
      if (this.brandHistory.length > 10) {
        this.brandHistory.pop();
      }
      this.saveStoredData();
      this.updateBrandHistoryUI();
    }
  }

  // 태그에서 검색
  searchFromTag(searchTerm) {
    const searchInput = document.getElementById("searchInput");
    searchInput.value = searchTerm;
    this.performSearch();
  }

  // 브랜드에서 검색
  searchFromBrand(brandName) {
    this.addToBrandHistory(brandName);
    const searchInput = document.getElementById("searchInput");
    searchInput.value = brandName;
    this.performSearch();
  }

  // 랭킹에서 검색
  searchFromRanking(rankText) {
    const searchInput = document.getElementById("searchInput");
    searchInput.value = rankText;
    this.performSearch();
  }

  // Detailpage로 이동
  navigateToDetailPage() {
    // Detailpage로 이동
    window.location.href = "../Detailpage/index.html";
  }

  // Fitpl Website로 이동
  navigateToFitplWebsite() {
    // Fitpl Website로 이동
    window.location.href = "../fitpl-website/index.html";
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

  // 검색어 히스토리 UI 업데이트
  updateSearchHistoryUI() {
    const tagContainer = document.querySelector(
      ".recent-search-section .tag-container"
    );
    if (!tagContainer) return;

    tagContainer.innerHTML = "";
    this.searchHistory.slice(0, 6).forEach((searchTerm) => {
      const tag = document.createElement("div");
      tag.className = "search-tag";
      tag.dataset.search = searchTerm;
      tag.textContent = `${searchTerm} ×`;
      tag.addEventListener("click", (e) => {
        this.searchFromTag(e.target.dataset.search);
      });
      tagContainer.appendChild(tag);
    });
  }

  // 브랜드 히스토리 UI 업데이트
  updateBrandHistoryUI() {
    const tagContainer = document.querySelector(
      ".recent-brand-section .tag-container"
    );
    if (!tagContainer) return;

    tagContainer.innerHTML = "";
    this.brandHistory.slice(0, 8).forEach((brandName) => {
      const tag = document.createElement("div");
      tag.className = "brand-tag";
      tag.dataset.brand = brandName;
      tag.textContent = `${brandName} ×`;
      tag.addEventListener("click", (e) => {
        this.searchFromBrand(e.target.dataset.brand);
      });
      tagContainer.appendChild(tag);
    });
  }

  // 최근 검색어 삭제
  clearRecentSearches() {
    this.searchHistory = [];
    this.saveStoredData();
    this.updateSearchHistoryUI();
    this.showToast("최근 검색어가 삭제되었습니다", "info");
  }

  // 최근 브랜드 삭제
  clearRecentBrands() {
    this.brandHistory = [];
    this.saveStoredData();
    this.updateBrandHistoryUI();
    this.showToast("최근 방문 브랜드가 삭제되었습니다", "info");
  }

  // 검색어 지우기
  clearSearch() {
    const searchInput = document.getElementById("searchInput");
    searchInput.value = "";
    searchInput.focus();
  }

  // 랭킹 업데이트 (실시간 시뮬레이션)
  updateRankings() {
    setInterval(() => {
      this.simulateRankingChange();
    }, 30000); // 30초마다 랭킹 변화 시뮬레이션
  }

  // 랭킹 변화 시뮬레이션
  simulateRankingChange() {
    const rankItems = document.querySelectorAll(".rank-item");
    rankItems.forEach((item) => {
      const indicator = item.querySelector(".rank-indicator");
      if (indicator && Math.random() < 0.1) {
        // 10% 확률로 변화
        const changes = ["▲", "▼", "-"];
        const colors = ["#ff0000", "#5998ff", "#aaaaaa"];
        const randomIndex = Math.floor(Math.random() * changes.length);

        indicator.textContent = changes[randomIndex];
        indicator.style.color = colors[randomIndex];

        setTimeout(() => {
          indicator.textContent = "-";
          indicator.style.color = "#aaaaaa";
        }, 5000);
      }
    });
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
        this.updateSearchHistoryUI();
      }

      if (storedBrandHistory) {
        this.brandHistory = JSON.parse(storedBrandHistory);
        this.updateBrandHistoryUI();
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
  clearAllData: () => {
    window.figmaSearchController.clearRecentSearches();
    window.figmaSearchController.clearRecentBrands();
  },
};
