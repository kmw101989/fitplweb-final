# GTM Page Duration 변수 만들기 (간단 가이드)

## 정확한 체류 시간 측정을 위한 변수 설정

### 1단계: Page Start Time 변수 생성

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

---

### 2단계: Page Duration (Seconds) 변수 생성

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

---

### 3단계: 트리거 생성 (페이지 종료 감지)

1. **GTM → 트리거 → 새로 만들기**
2. **트리거 설정:**
   - **트리거 이름**: `Page Unload`
   - **트리거 유형**: **커스텀 이벤트**
   - **이벤트 이름**: `gtm.visibilityHidden`
3. **저장**

---

### 4단계: GA4 태그 생성

1. **GTM → 태그 → 새로 만들기**
2. **태그 설정:**
   - **태그 이름**: `GA4 - Page Exit with Duration`
   - **태그 유형**: **Google Analytics: GA4 이벤트**
   - **측정 ID**: (GA4 측정 ID)
   - **이벤트 이름**: `page_exit`
   - **이벤트 매개변수:**
     - `duration_seconds`: `{{Page Duration (Seconds)}}`
     - `user_type`: `{{User Type}}`
     - `page_path`: `{{Page Path}}`
   - **트리거**: `Page Unload`
3. **저장**

---

## 동작 원리

1. **페이지 로드 시**: `window.__pageStartTime`에 현재 시간 저장
2. **페이지 종료 시**: `gtm.visibilityHidden` 이벤트 발생
3. **시간 계산**: `Date.now() - window.__pageStartTime` (초 단위)
4. **GA4 전송**: `duration_seconds` 매개변수에 정확한 시간 포함

---

## 확인 방법

### GTM 미리보기 모드

1. GTM 미리보기 모드 활성화
2. 페이지 접속 후 시간 경과 대기
3. 페이지를 떠나거나 탭 전환
4. **Variables** 탭에서 `{{Page Duration (Seconds)}}` 값 확인
5. **Tags** 탭에서 `page_exit` 이벤트 확인

### GA4 DebugView

1. GA4 DebugView 활성화
2. 페이지 접속 후 시간 경과
3. 페이지 종료
4. `page_exit` 이벤트 확인
5. `duration_seconds` 매개변수 값 확인

---

## 예시

```
페이지 로드: 10:00:00 (window.__pageStartTime = 1000000)
페이지 종료: 10:02:15 (Date.now() = 1013500)
→ duration_seconds: 135 (정확히 135초)
```

---

## 주의사항

1. **JavaScript 변수**: GTM 설정 내에서만 사용하므로 코드 파일 수정 불필요
2. **페이지 새로고침**: 새로고침 시 시간이 리셋됨 (정상 동작)
3. **탭 전환**: `gtm.visibilityHidden` 이벤트가 발생하여 시간 측정됨

