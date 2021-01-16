
export function response(code, body, headers={}) {
  return {
    statusCode: code,
    body: JSON.stringify(body, null, 2),
    headers,
  }
}