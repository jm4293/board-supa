export const KAKAO_REST_API_KEY = 'a3fd62b596b6856a4c1bc1174e441934';
export const KAKAO_REDIRECT_URI =
  process.env.NODE_ENV === 'production'
    ? 'https://board-supa.vercel.app/auth/callback/kakao'
    : 'http://localhost:3000/auth/callback/kakao';
export const KAKAO_CLIENT_SECRET = 'ujKOw9jxZ04q9kFgGgJeJI8266nniNng';
