'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';
import { jwtUtil } from '@/share/utils/auth';
import { cookieUtil } from '@/share/utils/cookie';

import { UserAccountModel, UserModel } from '../model';

const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
const KAKAO_CLIENT_SECRET = process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET;

export const requestAuthorizationCodeAction = async (): Promise<ResponseType<{ url: string }>> => {
  try {
    if (!KAKAO_REST_API_KEY || !KAKAO_REDIRECT_URI) {
      return {
        success: false,
        data: null,
        message: '카카오 OAuth 설정이 올바르지 않습니다',
      };
    }

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;

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
    if (!KAKAO_REST_API_KEY || !KAKAO_REDIRECT_URI || !KAKAO_CLIENT_SECRET) {
      return {
        success: false,
        data: null,
        message: '카카오 OAuth 설정이 올바르지 않습니다',
      };
    }

    // 1. 카카오 토큰 요청
    const tokenResponse = await fetch(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&code=${code}&client_secret=${KAKAO_CLIENT_SECRET}`,
      { method: 'POST' },
    );

    if (!tokenResponse.ok) {
      return {
        success: false,
        data: null,
        message: '카카오 로그인에 실패했습니다',
      };
    }

    const { access_token } = await tokenResponse.json();

    // 2. 액세스 토큰으로 사용자 정보 가져오기
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me?secure_resource=false', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      return {
        success: false,
        data: null,
        message: '카카오 사용자 정보를 가져오는데 실패했습니다',
      };
    }

    const userResponseData = await userResponse.json();
    const { kakao_account } = userResponseData;
    const { email, profile } = kakao_account;
    const { nickname, profile_image_url } = profile;

    const supabase = await createClient();

    // 3. 데이터베이스에서 사용자 계정 확인
    const userAccountResponse = await supabase
      .from(DATABASE_TABLE.USER_ACCOUNT)
      .select('*')
      .eq('email', email)
      .single<UserAccountModel>();

    // 4. 사용자 정보가 없으면 회원가입 후 로그인
    if (!userAccountResponse.data) {
      // User 생성
      const newUserResponse = await supabase
        .from(DATABASE_TABLE.USER)
        .insert<Pick<UserModel, 'username' | 'nickname' | 'profileImage' | 'status'>>({
          username: nickname,
          nickname: nickname,
          profileImage: profile_image_url,
          status: 1,
        })
        .select('*')
        .single<UserModel>();

      if (!newUserResponse.data) {
        return {
          success: false,
          data: null,
          message: '회원가입에 실패했습니다',
        };
      }

      // UserAccount 생성
      const newUserAccountResponse = await supabase
        .from(DATABASE_TABLE.USER_ACCOUNT)
        .insert<Pick<UserAccountModel, 'userId' | 'email' | 'password' | 'provider'>>({
          userId: newUserResponse.data.id,
          email,
          password: null,
          provider: 2, // 카카오 로그인
        })
        .select('*')
        .single<UserAccountModel>();

      if (!newUserAccountResponse.data) {
        return {
          success: false,
          data: null,
          message: '회원가입에 실패했습니다',
        };
      }

      // JWT 토큰 생성 및 쿠키 저장
      const accessToken = jwtUtil.generateAccessToken(newUserResponse.data.id, email);
      const refreshToken = jwtUtil.generateRefreshToken(newUserResponse.data.id, email);

      await cookieUtil.setAccessToken(accessToken);
      await cookieUtil.setRefreshToken(refreshToken);

      return {
        success: true,
        data: null,
        message: null,
      };
    }

    // 5. 이미 있던 사용자면 로그인만
    const userResponse_db = await supabase
      .from(DATABASE_TABLE.USER)
      .select('*')
      .eq('id', userAccountResponse.data.userId)
      .single<UserModel>();

    if (!userResponse_db.data) {
      return {
        success: false,
        data: null,
        message: '사용자를 찾을 수 없습니다',
      };
    }

    // JWT 토큰 생성 및 쿠키 저장
    const accessToken = jwtUtil.generateAccessToken(userResponse_db.data.id, email);
    const refreshToken = jwtUtil.generateRefreshToken(userResponse_db.data.id, email);

    await cookieUtil.setAccessToken(accessToken);
    await cookieUtil.setRefreshToken(refreshToken);

    return {
      success: true,
      data: null,
      message: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '카카오 로그인 중 오류가 발생했습니다',
    };
  }
};
