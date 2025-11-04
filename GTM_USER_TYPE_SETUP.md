# GTM에서 user_type 변수 설정 가이드

## 개요
FitPl 웹사이트에서 `user_type` (Ad_User, Peer_User, CRM_User)을 GTM에서 사용하기 위한 설정 방법입니다.

## 1. Data Layer 변수로 설정 (권장)

### 방법 A: Data Layer에서 직접 읽기

`fitpl-ga-utils.js`에서 `pushGAEvent()` 함수를 사용하면 자동으로 `user_type`이 dataLayer에 포함됩니다.

**GTM 설정:**
1. GTM 대시보드 → **변수** → **새로 만들기**
2. 변수 유형: **Data Layer 변수**
3. 변수 이름: `user_type`
4. Data Layer 변수 이름: `user_type`
5. 저장

**사용 예시:**
- 이벤트에서 `{{user_type}}` 변수 사용
- 트리거 조건: `{{user_type}}` equals `Ad_User`
- 태그에서 `user_type` 매개변수로 전달

---

### 방법 B: JavaScript 변수로 window.getUserType() 읽기

**GTM 설정:**
1. GTM 대시보드 → **변수** → **새로 만들기**
2. 변수 유형: **JavaScript 변수**
3. 변수 이름: `User Type`
4. 전역 변수 이름: `getUserType`
5. 저장

**사용 방법:**
- 이벤트에서 `{{User Type}}` 변수 사용
- 조건: `{{User Type}}` equals `Ad_User`

---

## 2. 각 이벤트에 user_type 자동 포함

### 현재 구현 방식

`pushGAEvent()` 함수를 사용하면 자동으로 `user_type`이 포함됩니다:

```javascript
// 예시: 페이지 뷰 이벤트
pushGAEvent('page_view', {
  page_type: 'main',
  country: 'KR',
  region: 'Seoul'
});

// dataLayer에 푸시되는 내용:
// {
//   event: 'page_view',
//   page_type: 'main',
//   country: 'KR',
//   region: 'Seoul',
//   user_type: 'Ad_User'  // 자동 포함
// }
```

### GTM에서 변수 읽기

**Data Layer 변수 생성:**
1. 변수 이름: `User Type`
2. Data Layer 변수 이름: `user_type`
3. 변수 유형: **Data Layer 변수**

이제 모든 이벤트에서 `{{User Type}}` 변수를 사용할 수 있습니다.

---

## 3. GTM 태그 설정 예시

### GA4 이벤트 태그 설정

**이벤트 이름:** `page_view`

**이벤트 매개변수:**
- `page_type`: `{{Page Type}}` (Data Layer 변수)
- `user_type`: `{{User Type}}` (Data Layer 변수)
- `country`: `{{Country}}` (Data Layer 변수)
- `region`: `{{Region}}` (Data Layer 변수)

---

## 4. 트리거 조건 예시

### 특정 user_type만 추적하기

**트리거 설정:**
- 트리거 유형: **커스텀 이벤트**
- 이벤트 이름: `page_view`
- 조건: `{{User Type}}` equals `Ad_User`

---

## 5. 디버깅 방법

### 브라우저 콘솔에서 확인

```javascript
// user_type 확인
console.log(getUserType()); // "Ad_User", "Peer_User", "CRM_User" 또는 null

// dataLayer 확인
console.log(window.dataLayer);

// 로컬 스토리지 확인
console.log(localStorage.getItem('fitpl_user_type'));
```

### GTM 미리보기 모드

1. GTM 대시보드 → **미리보기** 클릭
2. 웹사이트 URL 입력
3. 변수 탭에서 `{{User Type}}` 값 확인
4. 디버깅 콘솔에서 dataLayer 확인

---

## 6. 변수 우선순위

GTM에서 변수를 읽을 때 우선순위:

1. **Data Layer 변수** (가장 권장)
   - `pushGAEvent()`로 전송된 이벤트의 `user_type` 매개변수
   - 이벤트마다 자동으로 포함됨

2. **JavaScript 변수**
   - `window.getUserType()` 함수 호출
   - 페이지 로드 시점의 값 사용

---

## 7. 실제 사용 예시

### 예시 1: page_view 이벤트

**코드:**
```javascript
pushGAEvent('page_view', {
  page_type: 'main',
  country: 'KR',
  region: 'Seoul',
  climate_tag: 'warm'
});
```

**GTM 설정:**
- 이벤트 이름: `page_view`
- 매개변수:
  - `page_type`: `{{Page Type}}`
  - `user_type`: `{{User Type}}`
  - `country`: `{{Country}}`
  - `region`: `{{Region}}`
  - `climate_tag`: `{{Climate Tag}}`

### 예시 2: product_click 이벤트

**코드:**
```javascript
pushGAEvent('product_click', {
  product_id: 'A12345',
  category: 'outer',
  rank: 1,
  list_position: 1
});
```

**GTM 설정:**
- 이벤트 이름: `product_click`
- 매개변수:
  - `product_id`: `{{Product ID}}`
  - `category`: `{{Category}}`
  - `rank`: `{{Rank}}`
  - `list_position`: `{{List Position}}`
  - `user_type`: `{{User Type}}` (자동 포함)

---

## 8. 주의사항

1. **변수 이름 통일**
   - Data Layer 변수 이름: `user_type` (소문자, 언더스코어)
   - GTM 변수 이름: `User Type` (가독성을 위해 띄어쓰기 사용 가능)

2. **null 값 처리**
   - UTM 파라미터가 없고 저장된 값도 없으면 `null` 반환
   - GTM에서 `null` 값에 대한 조건 추가 고려

3. **로컬 스토리지 확인**
   - 브라우저 개발자 도구 → Application → Local Storage에서 확인 가능
   - 키: `fitpl_user_type`

---

## 9. 체크리스트

- [ ] GTM에서 Data Layer 변수 `user_type` 생성
- [ ] GTM 변수 이름: `User Type` 설정
- [ ] 각 GA4 이벤트 태그에 `user_type` 매개변수 추가
- [ ] GTM 미리보기 모드에서 변수 값 확인
- [ ] 브라우저 콘솔에서 `getUserType()` 테스트
- [ ] dataLayer 확인 (`window.dataLayer`)

---

## 10. 추가 리소스

- [GTM Data Layer 변수 가이드](https://support.google.com/tagmanager/answer/7683363)
- [GA4 이벤트 매개변수](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GTM JavaScript 변수](https://support.google.com/tagmanager/answer/7189569)

