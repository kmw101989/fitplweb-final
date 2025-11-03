// netlify/functions/contact.js
// 구글 스프레드시트에 문의 정보를 저장하는 함수

function json(status, body, headers = {}) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  // CORS preflight 요청 처리
  if (event.httpMethod === "OPTIONS") {
    return json(200, {});
  }

  // POST 요청만 허용
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { email, message = "", product_id = null, timestamp } = body;

    // 이메일 검증
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return json(400, { ok: false, error: "Valid email is required" });
    }

    // Google Apps Script Web App URL (환경변수에서 가져오기)
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      console.error("GOOGLE_SCRIPT_URL 환경변수가 설정되지 않았습니다.");
      return json(500, {
        ok: false,
        error: "Server configuration error",
      });
    }

    // Google Apps Script로 데이터 전송 (컬럼 순서: email, message, product_id, timestamp)
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        message: message.trim() || "",
        product_id: product_id || "",
        timestamp: timestamp || new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[contact] Google Script error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return json(500, {
        ok: false,
        error: "Failed to save contact information",
        details: `HTTP ${response.status}: ${errorText.substring(0, 200)}`,
      });
    }

    let result;
    try {
      const responseText = await response.text();
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[contact] JSON parse error:", parseError);
      return json(500, {
        ok: false,
        error: "Invalid response from Google Script",
        details: parseError.message,
      });
    }

    return json(200, {
      ok: true,
      message: "Contact information saved successfully",
      result,
    });
  } catch (err) {
    console.error("[contact] handler error:", {
      message: err.message,
      stack: err.stack,
    });
    return json(500, {
      ok: false,
      error: err.message || "Internal server error",
    });
  }
};
