# Page Duration 콘솔 확인 가이드

## 브라우저 콘솔에서 Page Duration 확인 방법

### 방법 1: 직접 시간 계산 (가장 간단)

브라우저 콘솔(F12)에서 다음 코드를 실행하세요:

```javascript
// 현재 페이지에 머문 시간 계산 (초 단위)
if (window.__pageStartTime) {
  const duration = Math.round((Date.now() - window.__pageStartTime) / 1000);
  console.log(`페이지 체류 시간: ${duration}초`);
  console.log(`페이지 로드 시간: ${new Date(window.__pageStartTime).toLocaleTimeString()}`);
  console.log(`현재 시간: ${new Date().toLocaleTimeString()}`);
} else {
  console.warn('__pageStartTime이 설정되지 않았습니다. GTM 변수가 제대로 로드되었는지 확인하세요.');
}
```

---

### 방법 2: 실시간 모니터링 (자동 업데이트)

콘솔에서 다음 코드를 실행하면 실시간으로 체류 시간이 업데이트됩니다:

```javascript
// 실시간 체류 시간 모니터링
if (!window.__pageDurationMonitor) {
  window.__pageDurationMonitor = setInterval(() => {
    if (window.__pageStartTime) {
      const duration = Math.round((Date.now() - window.__pageStartTime) / 1000);
      console.log(`[실시간] 페이지 체류 시간: ${duration}초`);
    }
  }, 1000); // 1초마다 업데이트
  
  console.log('✅ Page Duration 모니터링 시작 (중지하려면: clearInterval(window.__pageDurationMonitor))');
} else {
  console.log('이미 모니터링이 실행 중입니다.');
}
```

**중지 방법:**
```javascript
clearInterval(window.__pageDurationMonitor);
window.__pageDurationMonitor = null;
```

---

### 방법 3: GTM 변수 직접 확인 (GTM 미리보기 모드)

GTM 미리보기 모드가 활성화된 상태에서:

1. **GTM 미리보기 패널** 열기
2. **Variables** 탭 클릭
3. 다음 변수들을 확인:
   - `Page Start Time`: 페이지 로드 시점 (타임스탬프)
   - `Page Duration (Seconds)`: 현재 체류 시간 (초 단위)

**콘솔에서 GTM 변수 확인:**
```javascript
// GTM Data Layer 확인
console.log('Data Layer:', window.dataLayer);

// GTM 변수 확인 (미리보기 모드에서만 가능)
// Variables 탭에서 직접 확인하는 것이 더 정확합니다.
```

---

### 방법 4: 페이지 이벤트 감지 (visibilityHidden)

페이지를 떠날 때 (탭 전환, 닫기 등) 이벤트가 발생하는지 확인:

```javascript
// visibilityHidden 이벤트 리스너 추가
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    if (window.__pageStartTime) {
      const duration = Math.round((Date.now() - window.__pageStartTime) / 1000);
      console.log('🔴 페이지를 떠났습니다. 최종 체류 시간:', duration + '초');
    }
  } else {
    console.log('🟢 페이지로 돌아왔습니다.');
  }
});

console.log('✅ visibilitychange 이벤트 리스너가 추가되었습니다.');
```

---

### 방법 5: GA4 이벤트 확인

GA4 DebugView에서 `page_exit` 이벤트와 `duration_seconds` 매개변수를 확인:

**콘솔에서 Data Layer 이벤트 확인:**
```javascript
// Data Layer 이벤트 모니터링
window.dataLayer = window.dataLayer || [];
window.dataLayer.push = (function(originalPush) {
  return function() {
    const args = Array.from(arguments);
    console.log('📊 Data Layer Push:', args);
    
    // page_exit 이벤트 확인
    if (args[0] && args[0].event === 'page_exit') {
      console.log('✅ Page Exit 이벤트 감지!');
      console.log('   - duration_seconds:', args[0].duration_seconds);
      console.log('   - user_type:', args[0].user_type);
      console.log('   - page_path:', args[0].page_path);
    }
    
    return originalPush.apply(this, arguments);
  };
})(window.dataLayer.push);

console.log('✅ Data Layer 모니터링 시작');
```

---

## 빠른 확인 체크리스트

### 1단계: 기본 확인
```javascript
// __pageStartTime이 설정되었는지 확인
console.log('__pageStartTime:', window.__pageStartTime);
```

**예상 결과:**
- ✅ 숫자 (타임스탬프): 정상 작동
- ❌ `undefined`: GTM 변수가 로드되지 않음

### 2단계: 현재 체류 시간 확인
```javascript
if (window.__pageStartTime) {
  console.log('체류 시간:', Math.round((Date.now() - window.__pageStartTime) / 1000) + '초');
}
```

### 3단계: 페이지 이벤트 확인
```javascript
// 페이지를 떠날 때 이벤트 발생 확인
document.addEventListener('visibilitychange', () => {
  console.log('visibilitychange:', document.hidden ? 'hidden' : 'visible');
  if (document.hidden && window.__pageStartTime) {
    console.log('최종 체류 시간:', Math.round((Date.now() - window.__pageStartTime) / 1000) + '초');
  }
});
```

---

## 문제 해결

### 문제 1: `__pageStartTime`이 `undefined`

**원인:**
- GTM 변수가 아직 로드되지 않음
- GTM 컨테이너가 제대로 로드되지 않음

**해결:**
```javascript
// GTM 로드 확인
console.log('GTM 로드 확인:', typeof window.google_tag_manager !== 'undefined');
console.log('Data Layer:', window.dataLayer);

// 수동으로 설정 (테스트용)
if (!window.__pageStartTime) {
  window.__pageStartTime = Date.now();
  console.log('수동으로 __pageStartTime 설정:', window.__pageStartTime);
}
```

### 문제 2: 시간이 0으로 표시됨

**원인:**
- 페이지가 방금 로드됨
- `__pageStartTime`이 잘못 설정됨

**확인:**
```javascript
if (window.__pageStartTime) {
  const elapsed = Date.now() - window.__pageStartTime;
  console.log('경과 시간 (밀리초):', elapsed);
  console.log('경과 시간 (초):', Math.round(elapsed / 1000));
}
```

### 문제 3: `page_exit` 이벤트가 발생하지 않음

**원인:**
- GTM 트리거가 제대로 설정되지 않음
- `gtm.visibilityHidden` 이벤트가 발생하지 않음

**확인:**
```javascript
// visibilitychange 이벤트 직접 테스트
document.dispatchEvent(new Event('visibilitychange'));
```

---

## 전체 테스트 스크립트

다음 코드를 콘솔에 붙여넣으면 모든 확인을 한 번에 할 수 있습니다:

```javascript
(function() {
  console.log('=== Page Duration 테스트 시작 ===\n');
  
  // 1. __pageStartTime 확인
  if (window.__pageStartTime) {
    console.log('✅ __pageStartTime 설정됨:', window.__pageStartTime);
    console.log('   로드 시간:', new Date(window.__pageStartTime).toLocaleTimeString());
  } else {
    console.log('❌ __pageStartTime이 설정되지 않음');
    console.log('   GTM 변수가 제대로 로드되었는지 확인하세요.');
  }
  
  // 2. 현재 체류 시간
  if (window.__pageStartTime) {
    const duration = Math.round((Date.now() - window.__pageStartTime) / 1000);
    console.log('\n✅ 현재 체류 시간:', duration + '초');
  }
  
  // 3. GTM 확인
  console.log('\n📊 GTM 상태:');
  console.log('   - GTM 로드:', typeof window.google_tag_manager !== 'undefined');
  console.log('   - Data Layer:', window.dataLayer ? '존재' : '없음');
  
  // 4. visibilitychange 이벤트 리스너 추가
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      if (window.__pageStartTime) {
        const duration = Math.round((Date.now() - window.__pageStartTime) / 1000);
        console.log('\n🔴 페이지 종료 감지! 최종 체류 시간:', duration + '초');
      }
    }
  });
  console.log('\n✅ visibilitychange 이벤트 리스너 추가됨');
  
  // 5. 실시간 모니터링 시작
  if (!window.__pageDurationMonitor) {
    window.__pageDurationMonitor = setInterval(() => {
      if (window.__pageStartTime) {
        const duration = Math.round((Date.now() - window.__pageStartTime) / 1000);
        console.log(`[${new Date().toLocaleTimeString()}] 체류 시간: ${duration}초`);
      }
    }, 5000); // 5초마다 업데이트
    
    console.log('\n✅ 실시간 모니터링 시작 (5초마다 업데이트)');
    console.log('   중지하려면: clearInterval(window.__pageDurationMonitor)');
  }
  
  console.log('\n=== 테스트 완료 ===');
  console.log('페이지를 떠나거나 탭을 전환하면 최종 체류 시간이 표시됩니다.');
})();
```

---

## 예상 결과

### 정상 작동 시:
```
=== Page Duration 테스트 시작 ===

✅ __pageStartTime 설정됨: 1704067200000
   로드 시간: 오후 2:30:00

✅ 현재 체류 시간: 45초

📊 GTM 상태:
   - GTM 로드: true
   - Data Layer: 존재

✅ visibilitychange 이벤트 리스너 추가됨

✅ 실시간 모니터링 시작 (5초마다 업데이트)
   중지하려면: clearInterval(window.__pageDurationMonitor)

=== 테스트 완료 ===
페이지를 떠나거나 탭을 전환하면 최종 체류 시간이 표시됩니다.
```

---

## 참고

- **GTM 변수는 페이지 로드 후 즉시 설정됩니다**
- **페이지를 새로고침하면 시간이 리셋됩니다**
- **탭을 전환하거나 닫으면 `gtm.visibilityHidden` 이벤트가 발생합니다**
- **GA4 DebugView에서 `page_exit` 이벤트와 `duration_seconds` 매개변수를 확인할 수 있습니다**

