import supertest from 'supertest';

export function extractJwtFromSupertestResponse(response: supertest.Response): string | null {
  const cookies = response.headers['set-cookie'];
  if (!cookies || !Array.isArray(cookies)) {
    return null;
  }

  const jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt='));
  if (!jwtCookie) {
    return null;
  }

  const jwtMatch = jwtCookie.match(/jwt=([^;]+)/);
  return jwtMatch ? jwtMatch[1] : null;
}
