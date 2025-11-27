'use server';

import { ResponseType } from '@/share/type/response.type';

export const kakaoLoginAction = async (): Promise<ResponseType<{ url: string }>> => {
  try {
    const clientId = process.env.REST_API_KEY;
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return {
        success: false,
        data: null,
        message: '카카오 OAuth 설정이 올바르지 않습니다',
      };
    }

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

    return {
      success: true,
      data: { url: kakaoAuthUrl },
      message: null,
    };
  } catch (error) {
    throw error;
  }
};

export const requestKakaoTokenAction = async (code: string): Promise<ResponseType<{ token: string }>> => {
  try {
    const response = await fetch(`https://kauth.kakao.com/oauth/token`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
};
