# GTM/GA에서 user_type 변수 확인 가이드

## 빠른 확인 방법

### 1. 브라우저 콘솔에서 즉시 확인

**개발자 도구 열기 (F12) → Console 탭:**

```javascript
// user_type 확인
getUserType();
// 출력: "Peer_User", "Ad_User", "CRM_User" 또는 null

// dataLayer 확인
console.log(window.dataLayer);
// 출력: [{event: '...', user_type: 'Peer_User', ...}, ...]

// 로컬 스토리지 확인
localStorage.getItem("fitpl_user_type");
// 출력: "Peer_User"
```

---

## 2. GTM 미리보기 모드에서 확인

### 단계별 가이드

#### 1단계: GTM 미리보기 모드 시작

1. [Google Tag Manager](https://tagmanager.google.com) 접속
2. 워크스페이스 선택
3. 상단 **미리보기** 버튼 클릭
4. **연결** 버튼 클릭

#### 2단계: 웹사이트 접속

브라우저에 다음 URL 입력:

```
https://fitplweb-final.netlify.app/?utm_source=peer
```

또는

```
https://fitplweb-final.netlify.app/?utm_source=meta
```

#### 3단계: GTM 미리보기 창에서 확인

**Variables 탭에서 확인:**

1. GTM 미리보기 창 왼쪽 **Variables** 탭 클릭
2. 아래 변수들을 찾아서 값 확인:
   - **User Type** (Data Layer 변수) → `Peer_User` 또는 `Ad_User` 등
   - 또는 **User Type (JS)** (JavaScript 변수) → `Peer_User` 등

**Data Layer 탭에서 확인:**

1. **Data Layer** 탭 클릭
2. `user_type` 키를 찾아서 값 확인
3. 또는 이벤트 객체를 클릭하여 상세 내용 확인:
   ```json
   {
     "event": "page_view",
     "user_type": "Peer_User",
     "page_type": "main",
     ...
   }
   ```

**Tags 탭에서 확인:**

1. **Tags** 탭 클릭
2. 실행된 태그 목록 확인
3. 각 태그의 **이벤트 데이터**에서 `user_type` 매개변수 확인

---

## 3. GA4 실시간 보고서에서 확인

### GA4 디버그 뷰

#### 방법 1: GA4 DebugView

1. [Google Analytics](https://analytics.google.com) 접속
2. 왼쪽 메뉴 → **관리** → **DebugView** 선택
3. 웹사이트에서 이벤트 발생
4. DebugView에서 실시간 이벤트 확인
5. 각 이벤트의 매개변수에서 `user_type` 확인

#### 방법 2: GA4 실시간 보고서

1. GA4 → **보고서** → **실시간** 선택
2. **이벤트** 섹션 확인
3. 이벤트 이름 클릭 → 매개변수에서 `user_type` 확인

---

## 4. GTM 변수 설정 (아직 안 했다면)

### Data Layer 변수 생성

1. GTM → **변수** → **새로 만들기**
2. 변수 설정:
   - **변수 이름**: `User Type`
   - **변수 유형**: **Data Layer 변수**
   - **Data Layer 변수 이름**: `user_type`
3. **저장**

### JavaScript 변수 생성 (선택사항)

1. GTM → **변수** → **새로 만들기**
2. 변수 설정:
   - **변수 이름**: `User Type (JS)`
   - **변수 유형**: **JavaScript 변수**
   - **전역 변수 이름**: `getUserType`
3. **저장**

---

## 5. 실제 사용 예시

### GA4 이벤트 태그에서 사용

**태그 설정:**

- 이벤트 이름: `page_view`
- 이벤트 매개변수:
  - `page_type`: `{{Page Type}}`
  - `user_type`: `{{User Type}}` ← 여기서 사용
  - `country`: `{{Country}}`

### 트리거 조건에서 사용

**트리거 설정:**

- 트리거 유형: **커스텀 이벤트**
- 이벤트 이름: `page_view`
- 조건 추가:
  - `{{User Type}}` equals `Peer_User`

---

## 6. 문제 해결

### user_type이 null로 보이는 경우

1. **브라우저 콘솔 확인:**

   ```javascript
   getUserType(); // null이면 UTM 파라미터가 없거나 저장된 값이 없음
   ```

2. **로컬 스토리지 확인:**

   ```javascript
   localStorage.getItem("fitpl_user_type"); // null이면 저장되지 않음
   ```

3. **URL 확인:**
   - `?utm_source=peer`, `?utm_source=meta`, `?utm_source=crm` 중 하나인지 확인
   - 오타: `utm_souce` (지원됨) 또는 `utm_source` (정확한 철자)

### 변수가 GTM에서 보이지 않는 경우

1. **변수 생성 확인:**

   - Data Layer 변수 이름이 정확히 `user_type`인지 확인 (소문자, 언더스코어)

2. **dataLayer 확인:**

   ```javascript
   console.log(window.dataLayer);
   // user_type이 포함되어 있는지 확인
   ```

3. **이벤트 전송 확인:**
   - `pushGAEvent()` 함수가 호출되었는지 확인
   - 콘솔에 `[GA Utils] 이벤트 전송:` 로그 확인

---

## 7. 체크리스트

- [ ] 브라우저 콘솔에서 `getUserType()` 실행하여 값 확인
- [ ] 로컬 스토리지에 `fitpl_user_type` 저장 확인
- [ ] GTM에서 Data Layer 변수 `user_type` 생성
- [ ] GTM 미리보기 모드에서 변수 값 확인
- [ ] GA4 DebugView에서 `user_type` 매개변수 확인
- [ ] GA4 실시간 보고서에서 이벤트 확인

---

## 8. 빠른 테스트 스크립트

브라우저 콘솔에서 실행:

```javascript
// 1. user_type 확인
console.log("현재 user_type:", getUserType());

// 2. dataLayer 확인
console.log("dataLayer:", window.dataLayer);

// 3. 로컬 스토리지 확인
console.log("저장된 user_type:", localStorage.getItem("fitpl_user_type"));

// 4. 테스트 이벤트 전송
pushGAEvent("test_event", {
  test_param: "test_value",
});

// 5. dataLayer 다시 확인
console.log("업데이트된 dataLayer:", window.dataLayer);
```

---

## 9. 참고 링크

- [GTM 미리보기 모드 가이드](https://support.google.com/tagmanager/answer/6107056)
- [GA4 DebugView 가이드](https://support.google.com/analytics/answer/7201382)
- [GTM Data Layer 변수 설정](https://support.google.com/tagmanager/answer/7683363)
