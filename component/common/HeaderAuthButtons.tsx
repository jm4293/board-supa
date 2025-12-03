'use client';

import { useEffect } from 'react';

import { useUserMutation } from '@/service/user/mutation/useUserMutation';

import Button from './Button';
import Link from './Link';

export default function HeaderAuthButtons() {
  const { checkLogin, logoutUser } = useUserMutation();
  const isLoggedIn = checkLogin.data?.success;
  const userInfo = checkLogin.data?.data;
  const { isPending: isLogoutPending } = logoutUser;

  useEffect(() => {
    checkLogin.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {isLoggedIn ? (
        isLogoutPending ? (
          <Button variant="secondary" size="sm" disabled>
            로그아웃 중...
          </Button>
        ) : (
          <>
            {userInfo && typeof userInfo === 'object' && 'nickname' in userInfo && (
              <span className="text-gray-700">{userInfo.nickname}님 환영합니다</span>
            )}
            <Button variant="secondary" size="sm" onClick={() => logoutUser.mutate()}>
              로그아웃
            </Button>
          </>
        )
      ) : (
        <Link href="/auth/login">
          <Button variant="primary" size="sm">
            로그인
          </Button>
        </Link>
      )}
    </div>
  );
}
