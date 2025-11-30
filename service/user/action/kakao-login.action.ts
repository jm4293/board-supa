'use server';

import axios from 'axios';

import { ResponseType } from '@/share/type/response.type';

const KAKAO_CLIENT_ID = process.env.REST_API_KEY;
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

export const kakaoLoginAction = async (): Promise<ResponseType<{ url: string }>> => {
  try {
    if (!KAKAO_CLIENT_ID || !KAKAO_REDIRECT_URI) {
      return {
        success: false,
        data: null,
        message: '카카오 OAuth 설정이 올바르지 않습니다',
      };
    }

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`;

    return {
      success: true,
      data: { url: kakaoAuthUrl },
      message: null,
    };
  } catch (error) {
    throw error;
  }
};

export const requestKakaoTokenAction = async (code: string): Promise<ResponseType> => {
  try {
    if (!KAKAO_CLIENT_ID || !KAKAO_REDIRECT_URI) {
      return {
        success: false,
        data: null,
        message: '카카오 OAuth 설정이 올바르지 않습니다',
      };
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URI,
      code: code,
    });

    const response = await axios.post('https://kauth.kakao.com/oauth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    return {
      success: true,
      data: response.data,
      message: '카카오 토큰 요청이 완료되었습니다',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '카카오 토큰 요청 중 오류가 발생했습니다',
    };
  }
};
