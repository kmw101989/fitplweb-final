# GTM에서 검색어 추적 설정 가이드

## 개요

검색창에서 사용자가 입력하는 검색어를 GTM에서 매개변수로 가져오는 방법입니다.
코드 변경 없이 GTM 설정만으로 구현 가능합니다.

---

## 방법 1: DOM 요소에서 검색어 읽기 (권장)

### 1단계: JavaScript 변수 생성

1. **GTM → 변수 → 새로 만들기**
2. **변수 설정:**

   - **변수 이름**: `Search Query`
   - **변수 유형**: **JavaScript 변수**
   - **전역 변수 이름**:

     ```javascript
     function() {
       // 검색 페이지
       const searchInput = document.getElementById('searchInput');
       if (searchInput && searchInput.value) {
         return searchInput.value.trim();
       }

       // 메인 페이지 검색 모달
       const searchInputModal = document.getElementById('searchInputModal');
       if (searchInputModal && searchInputModal.value) {
         return searchInputModal.value.trim();
       }

       return '';
     }
     ```

3. **저장**

### 2단계: 검색 이벤트 트리거 생성 (검색 버튼 클릭)

1. **GTM → 트리거 → 새로 만들기**
2. **트리거 설정:**
   - **트리거 이름**: `Search Button Click`
   - **트리거 유형**: **클릭 - 모든 요소**
   - **이 트리거 발생 시점**:
     - **일부 클릭**
   - **조건:**
     - **클릭 요소** `matches CSS selector` `.search-btn` 또는 `#searchButton`
     - 또는
     - **클릭 텍스트** `contains` `검색`
3. **저장**

### 2-2단계: Enter 키 트리거 생성

1. **GTM → 트리거 → 새로 만들기**
2. **트리거 설정:**
   - **트리거 이름**: `Search Enter Key`
   - **트리거 유형**: **키보드 이벤트**
   - **조건:**
     - **이벤트 타입** `equals` `keypress`
     - **키 코드** `equals` `13` (Enter 키)
     - **요소** `matches CSS selector` `#searchInput, #searchInputModal`
3. **저장**

### 2-3단계: 통합 트리거 생성 (검색 버튼 + Enter 키)

1. **GTM → 트리거 → 새로 만들기**
2. **트리거 설정:**
   - **트리거 이름**: `Search Submit`
   - **트리거 유형**: **커스텀 이벤트**
   - **이벤트 이름**: `gtm.click` (검색 버튼 클릭) 또는 `gtm.keypress` (Enter 키)
   - **조건 추가:**
     - **조건 1**: `{{Click Element}}` `matches CSS selector` `.search-btn, #searchButton`
     - **또는**
     - **조건 2**: `{{Event}}` `equals` `gtm.keypress` **AND** `{{Key Code}}` `equals` `13` **AND** `{{Click Element}}` `matches CSS selector` `#searchInput, #searchInputModal`
3. **저장**

**또는 더 간단한 방법:**

1. **트리거 이름**: `Search Submit`
2. **트리거 유형**: **트리거 그룹**
3. **트리거 구성:**
   - `Search Button Click` (방금 만든 트리거)
   - `Search Enter Key` (방금 만든 트리거)
4. **저장**

### 3단계: GA4 이벤트 태그 생성

1. **GTM → 태그 → 새로 만들기**
2. **태그 설정:**
   - **태그 이름**: `GA4 - Search Event`
   - **태그 유형**: **Google Analytics: GA4 이벤트**
   - **측정 ID**: (GA4 측정 ID 입력)
   - **이벤트 이름**: `search`
   - **이벤트 매개변수:**
     - `search_term`: `{{Search Query}}`
     - `user_type`: `{{User Type}}` (기존 변수)
     - `page_type`: `search`
3. **트리거 선택**: `Search Submit` (통합 트리거 또는 트리거 그룹)
4. **저장**

**중요**: 트리거 그룹을 사용하면 검색 버튼 클릭과 Enter 키 입력 모두를 하나의 태그로 추적할 수 있습니다.

---

## 방법 2: 트리거 그룹 사용 (권장 - 검색 버튼 + Enter 키 모두 추적)

### 설정 순서

1. **방법 1의 1단계** 완료 (JavaScript 변수 생성)
2. **방법 1의 2단계** 완료 (검색 버튼 클릭 트리거)
3. **방법 1의 2-2단계** 완료 (Enter 키 트리거)
4. **방법 1의 2-3단계** 완료 (트리거 그룹 생성)
5. **방법 1의 3단계** 완료 (GA4 태그 생성 시 트리거 그룹 사용)

### 트리거 그룹 설정 상세

1. **GTM → 트리거 → 새로 만들기**
2. **트리거 설정:**
   - **트리거 이름**: `Search Submit (All)`
   - **트리거 유형**: **트리거 그룹**
   - **트리거 구성:**
     - `Search Button Click` (체크)
     - `Search Enter Key` (체크)
   - **조건**: 모든 트리거 발생 시 (OR 조건)
3. **저장**

이렇게 하면 검색 버튼 클릭과 Enter 키 입력 모두를 하나의 태그로 추적할 수 있습니다.

---

## 방법 3: URL 파라미터로 검색어 추적 (검색 결과 페이지)

검색 결과 페이지로 이동할 때 URL에 검색어가 포함되는 경우:

### 1단계: URL 쿼리 변수 생성

1. **GTM → 변수 → 새로 만들기**
2. **변수 설정:**
   - **변수 이름**: `Search Query (URL)`
   - **변수 유형**: **URL 변수**
   - **요청 유형**: **쿼리**
   - **쿼리 키**: `q` 또는 `search` (실제 URL 파라미터명에 맞춤)
3. **저장**

---

## 방법 4: Data Layer 변수 (향후 확장용)

만약 나중에 코드에서 검색어를 dataLayer에 푸시한다면:

```javascript
// 예시 (참고용, 현재는 코드 변경 없음)
window.dataLayer.push({
  event: "search",
  search_term: "사용자 입력 검색어",
});
```

**GTM 변수 설정:**

- **변수 이름**: `Search Term (Data Layer)`
- **변수 유형**: **Data Layer 변수**
- **Data Layer 변수 이름**: `search_term`

---

## 추천 설정 조합

### 기본 설정 (간단)

1. **방법 1** 사용 (DOM 요소에서 읽기)
2. **검색 버튼 클릭** 트리거로 이벤트 전송

### 고급 설정 (정확도 향상)

1. **방법 1** + **방법 2** 조합
2. 검색 버튼 클릭과 Enter 키 모두 추적
3. 검색어가 비어있지 않을 때만 이벤트 전송

---

## 트리거 고급 조건 예시

### 검색어가 있을 때만 이벤트 전송

**트리거 조건 추가:**

- `{{Search Query}}` `is not empty`

### 검색어 길이 제한

**트리거 조건 추가:**

- `{{Search Query}}` `length` `greater than` `0`

---

## GA4 이벤트 매개변수 예시

```json
{
  "event": "search",
  "search_term": "도쿄",
  "user_type": "Peer_User",
  "page_type": "search",
  "page_path": "/search/index.html"
}
```

---

## 테스트 방법

### GTM 미리보기 모드

1. GTM 미리보기 모드 활성화
2. 검색 페이지 접속
3. 검색어 입력 후 검색 버튼 클릭 (또는 Enter 키)
4. **Tags** 탭에서 이벤트 확인
5. **Variables** 탭에서 `{{Search Query}}` 값 확인

### GA4 DebugView

1. GA4 DebugView 활성화
2. 검색 실행
3. `search` 이벤트 확인
4. `search_term` 매개변수 값 확인

---

## 주의사항

1. **검색어가 비어있을 때**: 이벤트를 전송하지 않도록 조건 추가 권장
2. **검색어 길이**: 너무 긴 검색어는 GA4에서 잘릴 수 있음 (255자 제한)
3. **특수문자**: URL 인코딩이 필요할 수 있음 (GTM이 자동 처리)
4. **개인정보**: 개인정보가 포함될 수 있으므로 주의

---

## 문제 해결

### 검색어가 null로 나오는 경우

1. **변수 이름 확인**: `searchInput`, `searchInputModal` ID가 정확한지 확인
2. **타이밍 이슈**: 검색 버튼 클릭 시점에 검색어가 이미 입력되어 있는지 확인
3. **다른 요소 확인**: 브라우저 개발자 도구에서 실제 검색 입력창 ID 확인

### 이벤트가 전송되지 않는 경우

1. **트리거 조건 확인**: CSS 선택자가 정확한지 확인
2. **트리거 활성화 확인**: GTM 미리보기 모드에서 트리거가 실행되는지 확인
3. **태그 연결 확인**: 태그에 트리거가 제대로 연결되어 있는지 확인

---

## 참고

- **검색 입력창 ID**: `searchInput` (검색 페이지), `searchInputModal` (메인 페이지)
- **검색 버튼 클래스**: `.search-btn` 또는 `#searchButton`
- **검색 이벤트 이름**: GA4 표준은 `search` 이벤트 사용
