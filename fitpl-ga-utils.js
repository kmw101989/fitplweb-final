// ============================================
// FitPl GA4/GTM 추적 유틸리티
// ============================================
// UTM 파라미터 기반 user_type 관리 및 GA 이벤트 추적

(function () {
  "use strict";

  // 로컬 스토리지 키
  const STORAGE_KEY_USER_TYPE = "fitpl_user_type";
  const STORAGE_KEY_UTM_SOURCE = "fitpl_utm_source";

  // UTM 파라미터에서 user_type 결정
  function getUserTypeFromUTM() {
    const urlParams = new URLSearchParams(window.location.search);

    // 디버깅: URL 정보 로그
    console.log("[GA Utils] URL 확인:", {
      href: window.location.href,
      search: window.location.search,
      allParams: urlParams.toString(),
    });

    // utm_source (정확한 철자) 또는 utm_souce (오타) 둘 다 지원
    let utmSource = urlParams.get("utm_source");
    if (!utmSource) {
      utmSource = urlParams.get("utm_souce"); // 오타 지원
    }

    console.log("[GA Utils] utm_source 값:", utmSource);

    if (!utmSource) {
      return null;
    }

    // utm_source 값에 따라 user_type 결정
    const utmToUserType = {
      meta: "Ad_User",
      peer: "Peer_User",
      crm: "CRM_User",
    };

    return utmToUserType[utmSource.toLowerCase()] || null;
  }

  // 로컬 스토리지에서 user_type 가져오기
  function getUserTypeFromStorage() {
    try {
      return localStorage.getItem(STORAGE_KEY_USER_TYPE);
    } catch (e) {
      console.warn("[GA Utils] 로컬 스토리지 읽기 실패:", e);
      return null;
    }
  }

  // 로컬 스토리지에 user_type 저장
  function saveUserTypeToStorage(userType) {
    try {
      localStorage.setItem(STORAGE_KEY_USER_TYPE, userType);
      console.log("[GA Utils] user_type 저장됨:", userType);
    } catch (e) {
      console.warn("[GA Utils] 로컬 스토리지 저장 실패:", e);
    }
  }

  // UTM source 저장 (참고용)
  function saveUTMSourceToStorage(utmSource) {
    try {
      localStorage.setItem(STORAGE_KEY_UTM_SOURCE, utmSource);
    } catch (e) {
      console.warn("[GA Utils] UTM source 저장 실패:", e);
    }
  }

  // user_type 초기화 및 저장
  function initializeUserType() {
    // 1. URL에서 UTM 파라미터 확인
    const utmUserType = getUserTypeFromUTM();

    if (utmUserType) {
      // UTM 파라미터가 있으면 저장
      saveUserTypeToStorage(utmUserType);

      const urlParams = new URLSearchParams(window.location.search);
      // utm_source (정확한 철자) 또는 utm_souce (오타) 둘 다 지원
      let utmSource = urlParams.get("utm_source");
      if (!utmSource) {
        utmSource = urlParams.get("utm_souce"); // 오타 지원
      }
      if (utmSource) {
        saveUTMSourceToStorage(utmSource);
      }

      console.log("[GA Utils] UTM 파라미터에서 user_type 설정:", utmUserType);
      return utmUserType;
    }

    // 2. 로컬 스토리지에서 기존 값 확인
    const storedUserType = getUserTypeFromStorage();
    if (storedUserType) {
      console.log("[GA Utils] 저장된 user_type 사용:", storedUserType);
      return storedUserType;
    }

    // 3. 기본값 없음 (null 반환)
    console.log("[GA Utils] user_type이 설정되지 않음");
    return null;
  }

  // ============================================
  // Public API
  // ============================================

  // user_type 가져오기 (공용 함수)
  window.getUserType = function () {
    const stored = getUserTypeFromStorage();
    if (stored) {
      return stored;
    }

    // 저장된 값이 없으면 다시 초기화 시도
    return initializeUserType();
  };

  // user_type 강제 설정 (필요시 사용)
  window.setUserType = function (userType) {
    if (userType && ["Ad_User", "Peer_User", "CRM_User"].includes(userType)) {
      saveUserTypeToStorage(userType);
      return userType;
    }
    console.warn("[GA Utils] 유효하지 않은 user_type:", userType);
    return null;
  };

  // GA 이벤트 전송 헬퍼 함수
  window.pushGAEvent = function (eventName, eventParams = {}) {
    // user_type이 없으면 자동으로 가져오기
    if (!eventParams.user_type) {
      eventParams.user_type = window.getUserType() || "Unknown";
    }

    // dataLayer가 없으면 초기화
    if (typeof window.dataLayer === "undefined") {
      window.dataLayer = [];
    }

    const eventData = {
      event: eventName,
      ...eventParams,
    };

    window.dataLayer.push(eventData);
    console.log("[GA Utils] 이벤트 전송:", eventData);

    return eventData;
  };

  // 페이지 로드 시 자동 초기화
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeUserType);
  } else {
    // DOM이 이미 로드된 경우 즉시 실행
    initializeUserType();
  }

  // 페이지 로드 직후에도 한 번 더 확인 (비동기 로드 대응)
  setTimeout(initializeUserType, 100);

  // URL 파라미터 유지 헬퍼 함수 (페이지 이동 시 utm_source 유지)
  window.preserveUTMParams = function (url) {
    if (!url) return url;

    // 현재 URL에서 utm_source 또는 utm_souce 파라미터 가져오기
    const currentParams = new URLSearchParams(window.location.search);
    const utmSource =
      currentParams.get("utm_source") || currentParams.get("utm_souce");

    // 로컬 스토리지에서도 확인 (URL에 없을 경우)
    if (!utmSource) {
      const storedUTMSource = localStorage.getItem(STORAGE_KEY_UTM_SOURCE);
      if (storedUTMSource) {
        try {
          const urlObj = new URL(url, window.location.origin);
          urlObj.searchParams.set("utm_source", storedUTMSource);
          return urlObj.toString().replace(urlObj.origin, "");
        } catch (e) {
          // 상대 경로인 경우
          const urlObj = new URL(url, window.location.href);
          urlObj.searchParams.set("utm_source", storedUTMSource);
          return urlObj.pathname + urlObj.search;
        }
      }
    }

    // URL에 utm_source가 이미 있으면 그대로 반환
    if (utmSource) {
      try {
        const urlObj = new URL(url, window.location.origin);
        if (
          !urlObj.searchParams.has("utm_source") &&
          !urlObj.searchParams.has("utm_souce")
        ) {
          urlObj.searchParams.set("utm_source", utmSource);
        }
        return urlObj.toString().replace(urlObj.origin, "");
      } catch (e) {
        // 상대 경로인 경우
        const separator = url.includes("?") ? "&" : "?";
        if (!url.includes("utm_source=") && !url.includes("utm_souce=")) {
          return (
            url + separator + `utm_source=${encodeURIComponent(utmSource)}`
          );
        }
      }
    }

    return url;
  };

  console.log("[GA Utils] 초기화 완료");
})();
