import { NextResponse } from 'next/server';

import { KAKAO_REDIRECT_URI, KAKAO_REST_API_KEY } from '@/share/const/kakao';

export async function POST(request: Request) {
  const { code } = await request.json();

  const response = await fetch(`https://kauth.kakao.com/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: KAKAO_REST_API_KEY,
      redirect_uri: KAKAO_REDIRECT_URI,
      code,
    }),
  });

  const data = await response.json();
  const { access_token, refresh_token, expires_in, refresh_token_expires_in, token_type } = data;

  const user = await fetch(`https://kapi.kakao.com/v2/user/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${access_token}`,
    },
  });

  const userData = await user.json();

  return NextResponse.json(userData);
}
