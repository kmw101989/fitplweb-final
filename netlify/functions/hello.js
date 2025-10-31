exports.handler = async () => ({
  statusCode: 200,
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ ok: true, hello: "world" }),
});
