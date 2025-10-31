# Netlify 배포 환경 변수 설정 가이드

## 필수 환경 변수

Netlify 대시보드에서 다음 환경 변수를 설정해야 합니다:

### 1. Netlify 대시보드 접속

- [Netlify Dashboard](https://app.netlify.com) → 프로젝트 선택
- Site settings → Build & deploy → Environment variables

### 2. 환경 변수 추가

다음 두 개의 환경 변수를 추가하세요:

```
BRIDGE_URL = https://your-bridge-server-url.com
BRIDGE_TOKEN = your-secret-token-here
```

#### BRIDGE_URL 설정

- 로컬 개발: `http://localhost:3001` (로컬 브리지 서버)
- 배포 환경: 외부에서 접근 가능한 브리지 서버 URL (예: VPS, Railway, Render 등)

#### BRIDGE_TOKEN 설정

- `fitpl-db-bridge/.env` 파일의 `BRIDGE_TOKEN`과 동일한 값 사용
- 보안을 위해 복잡한 랜덤 문자열 사용 권장

### 3. 배포 후 확인

배포 후 Netlify Functions 로그에서 확인:

1. Netlify Dashboard → Functions 탭
2. `db` 함수 클릭
3. 로그에서 `Missing BRIDGE_URL/BRIDGE_TOKEN` 에러가 나오지 않는지 확인

### 4. DB 브리지 서버 배포

로컬 서버가 아닌 경우, 다음 중 하나를 선택:

#### 옵션 A: Railway 사용 (권장)

1. [Railway](https://railway.app) 가입
2. `fitpl-db-bridge` 폴더를 새 프로젝트로 추가
3. 환경 변수 설정:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `BRIDGE_TOKEN`
4. Railway에서 제공하는 URL을 `BRIDGE_URL`로 설정

#### 옵션 B: Render 사용

1. [Render](https://render.com) 가입
2. Web Service로 `fitpl-db-bridge` 배포
3. 환경 변수 설정 후 URL을 `BRIDGE_URL`로 설정

#### 옵션 C: VPS 서버

1. Node.js 서버 환경 구성
2. PM2 등으로 서버 실행
3. 공인 IP/도메인을 `BRIDGE_URL`로 설정

### 5. 로컬 개발 환경 변수 (선택사항)

로컬에서 `netlify dev` 사용 시 `.env` 파일 필요 없음
Netlify CLI가 자동으로 Netlify 환경 변수를 로드합니다.

### 문제 해결

#### "fetch failed" 에러 발생 시 체크리스트:

1. ✅ Netlify 환경 변수가 설정되었는가?

   - Site settings → Environment variables 확인

2. ✅ BRIDGE_URL이 올바른가?

   - 브라우저에서 직접 접속해보기
   - `https://your-bridge-url.com/ping` (Bearer 토큰 필요)

3. ✅ BRIDGE_TOKEN이 일치하는가?

   - Netlify의 `BRIDGE_TOKEN`과 브리지 서버의 `.env` 파일의 `BRIDGE_TOKEN` 동일한지 확인

4. ✅ 브리지 서버가 실행 중인가?

   - 서버 로그 확인
   - Health check endpoint (`/ping`) 테스트

5. ✅ CORS 설정이 올바른가?
   - 브리지 서버에서 `cors()` 미들웨어가 설정되어 있는지 확인

### 테스트 방법

배포 후 브라우저 콘솔에서:

```javascript
// Netlify Function 테스트
fetch("/.netlify/functions/db?op=ping")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

성공하면: `{ ok: true, ... }`
실패하면: 에러 메시지 확인
