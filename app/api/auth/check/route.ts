import { NextResponse } from 'next/server';

import { checkLoginAction } from '@/service/user/action/check-login.action';

export async function GET() {
  try {
    const response = await checkLoginAction();
    return NextResponse.json(response, { status: response.success ? 200 : 401 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : '인증 확인 중 오류가 발생했습니다',
      },
      { status: 500 },
    );
  }
}

