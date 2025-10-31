# DB 브리지 서버 배포 가이드

## 문제: 로컬 브리지 서버는 Netlify에서 접근 불가

Netlify Functions는 클라우드에서 실행되므로 `localhost`나 `127.0.0.1`로는 접근할 수 없습니다.
브리지 서버를 외부에서 접근 가능한 곳에 배포해야 합니다.

---

## 방법 1: Railway로 배포 (권장, 무료 티어 있음)

### 1단계: Railway 가입 및 프로젝트 생성

1. [Railway](https://railway.app) 가입 (GitHub 연동 가능)
2. "New Project" → "Deploy from GitHub repo" 선택
3. `fitpl-db-bridge` 폴더가 있는 리포지토리 연결
4. 또는 "Empty Project" → "Add Service" → "GitHub Repo" 선택

### 2단계: 환경 변수 설정

Railway 대시보드 → Variables 탭에서 다음 변수 추가:

```
DB_HOST=127.0.0.1 (또는 DB 호스트)
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=fitpl
BRIDGE_TOKEN=your_secret_token_here
```

**중요:** `DB_HOST`는 Railway 서버에서 접근 가능한 MySQL 서버 주소여야 합니다.

- 로컬 DB 사용 불가
- 클라우드 MySQL 서비스 사용 권장 (AWS RDS, PlanetScale, Railway MySQL 등)

### 3단계: 배포

1. Railway가 자동으로 배포 시작
2. 배포 완료 후 "Settings" → "Networking"에서 생성된 URL 확인
   - 예: `https://your-project.railway.app`
3. 이 URL을 Netlify의 `BRIDGE_URL` 환경 변수로 설정

### 4단계: Netlify 환경 변수 업데이트

1. Netlify Dashboard → Site settings → Environment variables
2. `BRIDGE_URL`을 Railway URL로 업데이트:
   ```
   BRIDGE_URL = https://your-project.railway.app
   ```
3. **재배포 필요** (환경 변수 변경 후)

---

## 방법 2: Render로 배포

### 1단계: Render 가입

1. [Render](https://render.com) 가입
2. "New +" → "Web Service" 선택

### 2단계: 설정

- **Name:** fitpl-db-bridge
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Root Directory:** `fitpl-db-bridge` (리포지토리 루트가 아닌 경우)

### 3단계: 환경 변수 추가

Render 대시보드 → Environment 탭에서 추가:

```
DB_HOST=...
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=fitpl
BRIDGE_TOKEN=...
```

### 4단계: 배포 및 URL 확인

1. Render가 자동 배포
2. 배포 완료 후 생성된 URL 확인 (예: `https://fitpl-db-bridge.onrender.com`)
3. Netlify의 `BRIDGE_URL` 업데이트

---

## 방법 3: 임시 테스트용 - ngrok (개발용만)

**주의:** 이 방법은 개발/테스트용이며 프로덕션에는 부적합합니다.

### 사용 방법:

1. ngrok 설치: https://ngrok.com/download
2. 로컬 브리지 서버 실행: `node server.js`
3. 새 터미널에서:
   ```bash
   ngrok http 3001
   ```
4. ngrok이 제공하는 URL (예: `https://xxxx.ngrok.io`)을 Netlify `BRIDGE_URL`로 설정
5. **단점:** ngrok 무료 플랜은 세션마다 URL이 변경됨

---

## 방법 4: VPS/서버 직접 배포

### 요구사항:

- Node.js 설치된 서버
- 도메인 또는 공인 IP
- PM2 또는 systemd로 서비스 관리

### 배포 단계:

1. 서버에 코드 업로드
2. 환경 변수 설정 (`.env` 파일 또는 시스템 환경 변수)
3. PM2로 실행:
   ```bash
   npm install -g pm2
   pm2 start server.js --name fitpl-bridge
   pm2 save
   pm2 startup
   ```
4. Nginx 리버스 프록시 설정 (선택사항)
5. 방화벽 포트 오픈
6. Netlify `BRIDGE_URL` 업데이트

---

## MySQL 데이터베이스 접근 문제

**중요:** 로컬 MySQL(`127.0.0.1`)은 클라우드 서버에서 접근할 수 없습니다.

### 해결 방법:

#### 옵션 A: 클라우드 MySQL 서비스 사용

- **Railway MySQL:** Railway에서 MySQL 서비스 추가
- **PlanetScale:** 무료 MySQL 호스팅
- **AWS RDS:** 프로덕션용
- **Supabase/Neon:** PostgreSQL도 가능 (코드 수정 필요)

#### 옵션 B: MySQL 원격 접근 허용 (보안 주의)

1. MySQL `bind-address`를 `0.0.0.0`으로 변경
2. 방화벽 포트 3306 오픈
3. 특정 IP만 접근 허용하도록 설정

---

## 배포 후 확인

### 1. 브리지 서버 Health Check

브라우저 또는 curl로 테스트 (실제로는 토큰 필요):

```bash
curl https://your-bridge-url.com/ping
# 또는 Postman 등으로 Bearer 토큰과 함께 테스트
```

### 2. Netlify Function 테스트

Netlify 배포 후 브라우저 콘솔:

```javascript
fetch("/.netlify/functions/db?op=ping")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

### 3. Netlify Functions 로그 확인

Netlify Dashboard → Functions → `db` → 로그에서 확인:

- `Function called:` 로그 확인
- 에러 메시지 확인

---

## 빠른 체크리스트

- [ ] 브리지 서버가 외부에서 접근 가능한 URL로 배포됨
- [ ] Railway/Render/etc에서 환경 변수 설정됨
- [ ] Netlify에 `BRIDGE_URL` 환경 변수 설정됨
- [ ] Netlify에 `BRIDGE_TOKEN` 환경 변수 설정됨
- [ ] `BRIDGE_TOKEN`이 브리지 서버와 Netlify에서 동일함
- [ ] MySQL이 브리지 서버에서 접근 가능함
- [ ] Netlify 재배포 완료 (환경 변수 변경 후)

---

## 문제 해결

### "Cannot reach bridge server" 에러

1. 브리지 서버 URL이 올바른지 확인
2. 브리지 서버가 실행 중인지 확인
3. Railway/Render 대시보드에서 로그 확인

### "Missing BRIDGE_URL/BRIDGE_TOKEN" 에러

1. Netlify 환경 변수가 설정되었는지 확인
2. 환경 변수 이름이 정확한지 확인 (대소문자 구분)
3. 재배포 필요

### 데이터베이스 연결 오류

1. 브리지 서버 로그 확인
2. DB 호스트가 외부 접근 가능한지 확인
3. DB 사용자 권한 확인
