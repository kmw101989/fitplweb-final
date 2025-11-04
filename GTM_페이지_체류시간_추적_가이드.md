# GTM에서 페이지 체류 시간 추적 가이드 (코드 변경 없음)

## 개요

JavaScript 코드 변경 없이 GTM 설정만으로 페이지 체류 시간을 추적하는 방법입니다.

## ⭐ 정확한 시간 측정 방법 (추천)

정확히 몇 초 머물렀는지 측정하려면 **방법 3**을 사용하세요.
타이머 트리거는 특정 구간(30초, 1분 등)에 도달했는지만 확인합니다.

---

## 빠른 설정 가이드 (정확한 시간 측정) ⭐

### 1. 변수 생성 (2개)

#### 변수 1: Page Start Time

1. **GTM → 변수 → 새로 만들기**
2. **변수 설정:**
   - **변수 이름**: `Page Start Time`
   - **변수 유형**: **JavaScript 변수**
   - **전역 변수 이름**:
     ```javascript
     function() {
       if (!window.__pageStartTime) {
         window.__pageStartTime = Date.now();
       }
       return window.__pageStartTime;
     }
     ```
3. **저장**

#### 변수 2: Page Duration (Seconds)

1. **GTM → 변수 → 새로 만들기**
2. **변수 설정:**
   - **변수 이름**: `Page Duration (Seconds)`
   - **변수 유형**: **JavaScript 변수**
   - **전역 변수 이름**:
     ```javascript
     function() {
       if (window.__pageStartTime) {
         return Math.round((Date.now() - window.__pageStartTime) / 1000);
       }
       return 0;
     }
     ```
3. **저장**

### 2. 트리거 생성

1. **GTM → 트리거 → 새로 만들기**
2. **트리거 설정:**
   - **트리거 이름**: `Page Unload`
   - **트리거 유형**: **커스텀 이벤트**
   - **이벤트 이름**: `gtm.visibilityHidden`
   - **조건**: 없음
3. **저장**

### 3. 태그 생성

1. **GTM → 태그 → 새로 만들기**
2. **태그 설정:**
   - **태그 이름**: `GA4 - Page Exit with Duration`
   - **태그 유형**: **Google Analytics: GA4 이벤트**
   - **측정 ID**: (GA4 측정 ID 입력)
   - **이벤트 이름**: `page_exit`
   - **이벤트 매개변수:**
     - `duration_seconds`: `{{Page Duration (Seconds)}}` ← **정확한 초 단위 시간**
     - `user_type`: `{{User Type}}`
     - `page_path`: `{{Page Path}}`
   - **트리거**: `Page Unload`
3. **저장**

### 결과

페이지를 떠날 때 (탭 전환, 닫기 등) 정확히 몇 초 머물렀는지 측정됩니다.

**예시:**

- 페이지 로드: 10:00:00
- 페이지 종료: 10:02:15
- → `duration_seconds`: `135` (정확히 135초)

---

## 방법 1: GA4 자동 추적 활용 (가장 간단)

### GA4 기본 기능

GA4는 자동으로 페이지 체류 시간을 추적합니다:

- **매개변수**: `engagement_time_msec` (밀리초 단위)
- **자동 수집**: 페이지뷰 시 자동으로 포함됨

### 확인 방법

1. **GA4 → 보고서 → 실시간**
2. 이벤트를 클릭하여 매개변수 확인
3. `engagement_time_msec` 값 확인

### 장점

- 별도 설정 불필요
- 자동으로 모든 페이지뷰에 포함

### 단점

- 페이지 종료 시점의 정확한 시간 측정 불가
- 탭 전환 시 시간이 멈춤

---

## 방법 2: GTM Timer Trigger 사용 (구간별 체크)

**참고**: 이 방법은 특정 구간(30초, 1분 등)에 도달했는지만 확인합니다.
**정확한 시간**을 측정하려면 **방법 3**을 사용하세요.

### 1단계: 타이머 트리거 생성

1. **GTM → 트리거 → 새로 만들기**
2. **트리거 설정:**

   - **트리거 이름**: `Page Timer - 10s`
   - **트리거 유형**: **타이머**
   - **간격**: `10000` (10초 = 10000밀리초)
   - **제한**: `1` (한 번만 실행)
   - **조건**: **페이지뷰가 발생할 때** (기본값)

3. **저장**

### 2단계: 여러 시간대 트리거 생성

다양한 체류 시간을 추적하려면 여러 트리거를 만듭니다:

- `Page Timer - 10s` (10초)
- `Page Timer - 30s` (30초)
- `Page Timer - 60s` (1분)
- `Page Timer - 180s` (3분)
- `Page Timer - 300s` (5분)

### 3단계: GA4 이벤트 태그 생성

1. **GTM → 태그 → 새로 만들기**
2. **태그 설정:**

   - **태그 이름**: `GA4 - Page Duration (10s)`
   - **태그 유형**: **Google Analytics: GA4 이벤트**
   - **측정 ID**: (GA4 측정 ID 입력)
   - **이벤트 이름**: `page_duration`
   - **이벤트 매개변수:**
     - `duration_seconds`: `10`
     - `duration_category`: `short` (10초 미만)
     - `user_type`: `{{User Type}}`
     - `page_type`: `{{Page Type}}` (또는 페이지 경로 변수)
   - **트리거**: `Page Timer - 10s`

3. **저장**

4. **다른 시간대 태그도 동일하게 생성**
   - `duration_seconds`: 해당 시간 값
   - `duration_category`: `short` (30초 미만), `medium` (30초~3분), `long` (3분 이상)

---

## 방법 3: 정확한 체류 시간 측정 (페이지 종료 시) ⭐⭐⭐ 가장 정확한 방법

### 1단계: 페이지 종료 트리거 생성

1. **GTM → 트리거 → 새로 만들기**
2. **트리거 설정:**

   - **트리거 이름**: `Page Unload`
   - **트리거 유형**: **커스텀 이벤트**
   - **이벤트 이름**: `gtm.visibilityHidden`
   - **조건**: 없음 (모든 경우)

3. **저장**

**참고**: GTM은 `visibilitychange` 이벤트를 자동으로 `gtm.visibilityHidden`으로 변환합니다.

### 2단계: JavaScript 변수 생성 (내장 함수 사용)

**주의**: 이 방법은 JavaScript 변수를 사용하지만, GTM 내장 함수를 활용합니다.

1. **GTM → 변수 → 새로 만들기**
2. **변수 설정:**
   - **변수 이름**: `Page Start Time`
   - **변수 유형**: **JavaScript 변수**
   - **전역 변수 이름**:
     ```javascript
     function() {
       // 페이지 로드 시간을 저장
       if (!window.__pageStartTime) {
         window.__pageStartTime = Date.now();
       }
       return window.__pageStartTime;
     }
     ```
3. **저장**

### 3단계: 체류 시간 계산 변수 생성

1. **GTM → 변수 → 새로 만들기**
2. **변수 설정:**
   - **변수 이름**: `Page Duration`
   - **변수 유형**: **JavaScript 변수**
   - **전역 변수 이름**:
     ```javascript
     function() {
       if (window.__pageStartTime) {
         return Math.round((Date.now() - window.__pageStartTime) / 1000); // 초 단위
       }
       return 0;
     }
     ```
3. **저장**

### 4단계: 페이지 종료 이벤트 태그 생성

1. **GTM → 태그 → 새로 만들기**
2. **태그 설정:**

   - **태그 이름**: `GA4 - Page Exit with Duration`
   - **태그 유형**: **Google Analytics: GA4 이벤트**
   - **측정 ID**: (GA4 측정 ID 입력)
   - **이벤트 이름**: `page_exit`
   - **이벤트 매개변수:**
     - `duration_seconds`: `{{Page Duration}}`
     - `user_type`: `{{User Type}}`
     - `page_path`: `{{Page Path}}`
   - **트리거**: `Page Unload`

3. **저장**

---

## 방법 4: GA4 내장 engagement_time 활용 (가장 간단, 권장)

### GA4 기본 수집

GA4는 자동으로 다음을 수집합니다:

- `engagement_time_msec`: 페이지 체류 시간 (밀리초)
- `session_engaged`: 세션 참여 여부

### GTM에서 활용

1. **GA4 이벤트 태그에 자동 포함**

   - 별도 설정 불필요
   - 모든 페이지뷰에 자동 포함

2. **커스텀 이벤트에 포함**
   - GA4 이벤트 태그를 사용하면 자동으로 포함됨

### GA4 보고서에서 확인

1. **GA4 → 보고서 → 이벤트**
2. `page_view` 이벤트 선택
3. 매개변수에서 `engagement_time_msec` 확인

---

## 방법 5: GTM Timer Trigger + 단계별 이벤트 (상세 추적)

### 설정 예시

**10초마다 체류 시간 이벤트 전송:**

1. **트리거**: `Page Timer - 10s` (간격: 10000ms, 제한: 없음)
2. **태그**: `GA4 - Page Duration Check`
   - 이벤트: `page_duration_check`
   - 매개변수:
     - `duration_seconds`: `10` (고정값)
     - `check_count`: JavaScript 변수로 카운트 (선택사항)

**또는 주기적으로 업데이트:**

1. **트리거**: `Page Timer - 30s` (간격: 30000ms, 제한: 없음)
2. **태그**: `GA4 - Page Still Active`
   - 이벤트: `page_active`
   - 매개변수:
     - `duration_seconds`: `30`
     - `session_active`: `true`

---

## 추천 설정 조합

### 기본 설정 (코드 변경 없음)

1. **GA4 자동 수집 활용**

   - `engagement_time_msec` 자동 수집
   - 별도 설정 불필요

2. **Timer Trigger로 주요 구간 체크**
   - 30초, 1분, 3분, 5분 트리거 생성
   - 각 구간 도달 시 이벤트 전송

### ⭐ 정확한 체류 시간 측정 (권장)

1. **방법 3: 페이지 종료 시 정확한 시간 측정**
   - `Page Start Time` 변수 생성
   - `Page Duration (Seconds)` 변수 생성
   - `Page Unload` 트리거 생성
   - `page_exit` 이벤트 태그 생성
   - **결과**: 페이지를 떠날 때 정확히 몇 초 머물렀는지 측정

### 고급 설정 (실시간 + 정확한 종료 시간)

1. **방법 3-1: 주기적 업데이트** (10초마다 현재 시간 전송)
2. **방법 3: 페이지 종료 시** (정확한 최종 시간)
3. **GA4 자동 수집** (백업용)

---

## GA4 이벤트 매개변수 예시

### 구간별 체크 (Timer Trigger 사용)

```json
{
  "event": "page_duration",
  "duration_seconds": 30,
  "duration_category": "short",
  "user_type": "Peer_User",
  "page_type": "detail"
}
```

### 정확한 체류 시간 (페이지 종료 시)

```json
{
  "event": "page_exit",
  "duration_seconds": 127, // 정확히 127초 머물림
  "duration_minutes": 2.12,
  "user_type": "Peer_User",
  "page_type": "country_detail",
  "page_path": "/Detailpage/index.html",
  "country": "일본"
}
```

### 주기적 업데이트

```json
{
  "event": "page_duration_update",
  "duration_seconds": 45, // 현재까지 체류 시간
  "check_interval": 10
}
```

---

## 페이지 타입별 체류 시간 추적

### 메인 페이지

- `page_type`: `main`
- `page_path`: `/fitpl-website/index.html`

### 국가별 페이지

- `page_type`: `country_detail`
- `page_path`: `/Detailpage/index.html`
- `country`: URL 파라미터에서 가져오기

### 제품 상세 페이지

- `page_type`: `product_detail`
- `page_path`: `/Detail/navigation.html`
- `product_id`: URL 파라미터에서 가져오기

---

## GTM 변수 설정 예시

### 페이지 타입 변수

1. **변수 이름**: `Page Type`
2. **변수 유형**: **JavaScript 변수**
3. **전역 변수 이름**:
   ```javascript
   function() {
     const path = window.location.pathname;
     if (path.includes('Detailpage')) return 'country_detail';
     if (path.includes('Detail/navigation')) return 'product_detail';
     if (path.includes('search')) return 'search';
     if (path.includes('cart')) return 'cart';
     if (path.includes('ranking')) return 'ranking';
     if (path.includes('sale')) return 'sale';
     return 'main';
   }
   ```

### 국가 변수 (URL 파라미터)

1. **변수 이름**: `Country`
2. **변수 유형**: **URL 변수**
3. **요청 유형**: **쿼리**
4. **쿼리 키**: `country`

---

## 테스트 방법

### GTM 미리보기 모드

1. GTM 미리보기 모드 활성화
2. 페이지 접속
3. **Triggers** 탭에서 타이머 트리거 실행 확인
4. **Tags** 탭에서 이벤트 전송 확인
5. **Variables** 탭에서 변수 값 확인

### GA4 DebugView

1. GA4 DebugView 활성화
2. 페이지 접속 후 시간 경과 대기
3. `page_duration` 이벤트 확인
4. `duration_seconds` 매개변수 값 확인

---

## 주의사항

1. **타이머 트리거 제한**:

   - 제한을 설정하지 않으면 계속 실행됨
   - 한 번만 실행하려면 제한을 1로 설정

2. **성능 고려**:

   - 너무 짧은 간격(예: 1초)은 성능에 영향
   - 권장: 10초 이상

3. **탭 전환**:

   - 다른 탭으로 이동하면 타이머가 멈출 수 있음
   - `visibilitychange` 이벤트로 보완 가능

4. **페이지 새로고침**:
   - 새로고침 시 타이머가 리셋됨
   - 정확한 측정을 위해서는 페이지 종료 이벤트 활용

---

## 문제 해결

### 타이머가 실행되지 않는 경우

1. **트리거 조건 확인**: 페이지뷰 조건이 맞는지 확인
2. **간격 설정 확인**: 밀리초 단위로 올바르게 설정되었는지 확인
3. **GTM 미리보기 모드**: 트리거가 활성화되는지 확인

### 시간이 정확하지 않은 경우

1. **GA4 자동 수집 사용**: `engagement_time_msec` 활용
2. **페이지 종료 이벤트 추가**: `visibilitychange` 이벤트 활용
3. **타이머 간격 조정**: 더 자주 체크하도록 간격 단축

---

## 참고

- **GA4 자동 수집**: `engagement_time_msec`는 모든 페이지뷰에 자동 포함
- **GTM Timer Trigger**: 최소 간격 100ms
- **페이지 종료 감지**: `gtm.visibilityHidden` 이벤트 자동 생성
- **정확한 시간 측정**: 방법 3 사용 시 정확한 초 단위 시간 측정 가능
- **JavaScript 변수**: GTM 설정 내에서만 사용하므로 코드 파일 수정 불필요

---

## 빠른 설정 가이드 (정확한 시간 측정)

### 1. 변수 생성 (2개)

1. **Page Start Time** (JavaScript 변수)

   ```javascript
   function() {
     if (!window.__pageStartTime) {
       window.__pageStartTime = Date.now();
     }
     return window.__pageStartTime;
   }
   ```

2. **Page Duration (Seconds)** (JavaScript 변수)
   ```javascript
   function() {
     if (window.__pageStartTime) {
       return Math.round((Date.now() - window.__pageStartTime) / 1000);
     }
     return 0;
   }
   ```

### 2. 트리거 생성

- **트리거 이름**: `Page Unload`
- **트리거 유형**: 커스텀 이벤트
- **이벤트 이름**: `gtm.visibilityHidden`

### 3. 태그 생성

- **태그 이름**: `GA4 - Page Exit with Duration`
- **이벤트 이름**: `page_exit`
- **매개변수**: `duration_seconds` = `{{Page Duration (Seconds)}}`
- **트리거**: `Page Unload`

이렇게 설정하면 페이지를 떠날 때 **정확히 몇 초** 머물렀는지 측정할 수 있습니다!
