# Google Apps Script 설정 가이드

## 1. Google 스프레드시트 생성

1. [Google Drive](https://drive.google.com)에서 새 스프레드시트 생성
2. 첫 번째 행에 헤더 추가 (순서대로):
   - A1: `email`
   - B1: `message`
   - C1: `product_id`
   - D1: `timestamp`

## 2. Google Apps Script 설정

1. 스프레드시트에서 **확장 프로그램** > **Apps Script** 선택
2. 아래 코드를 복사하여 붙여넣기:

```javascript
function doPost(e) {
  try {
    // 스프레드시트 ID 가져오기 (스프레드시트 URL에서 복사)
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();

    // 요청 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 컬럼 순서: email, message, product_id, timestamp
    const timestamp = data.timestamp || new Date().toISOString();
    
    // 행 추가 (컬럼 순서에 맞게)
    sheet.appendRow([
      data.email || '',
      data.message || '',
      data.product_id || '',
      timestamp
    ]);

    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 테스트 함수 (선택사항)
function test() {
  const testData = {
    email: 'test@example.com',
    message: '테스트 메시지',
    product_id: '123456',
    timestamp: new Date().toISOString()
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
```

## 3. 스크립트 배포

1. **배포** > **새 배포** 클릭
2. **유형 선택** 드롭다운에서 **웹 앱** 선택
3. 설정:
   - **설명**: "Contact Form Web App"
   - **실행할 사용자**: "나"
   - **액세스 권한이 있는 사용자**: "모든 사용자"
4. **배포** 클릭
5. **웹 앱 URL** 복사 (예: `https://script.google.com/macros/s/AKfycb.../exec`)

## 4. Netlify 환경변수 설정

1. [Netlify Dashboard](https://app.netlify.com)에서 프로젝트 선택
2. **Site settings** > **Environment variables**
3. 다음 환경변수 추가:
   - **Key**: `GOOGLE_SCRIPT_URL`
   - **Value**: 위에서 복사한 웹 앱 URL

## 5. 스프레드시트 ID 찾기

스프레드시트 URL 예시:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```

이 `SPREADSHEET_ID_HERE` 부분을 코드의 `YOUR_SPREADSHEET_ID_HERE`에 붙여넣기

## 테스트

1. 장바구니 페이지에서 "contact to us" 버튼 클릭
2. 이메일 입력 후 제출
3. Google 스프레드시트에서 데이터 확인

## 보안 참고사항

- Google Apps Script Web App은 공개적으로 접근 가능합니다
- 필요시 추가 인증 로직을 구현할 수 있습니다
- 스프레드시트 접근 권한은 설정에서 제어할 수 있습니다

