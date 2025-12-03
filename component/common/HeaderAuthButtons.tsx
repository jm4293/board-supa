'use client';

import { useEffect } from 'react';

import { useUserMutation } from '@/service/user/mutation/useUserMutation';

import Button from './Button';
import Link from './Link';

export default function HeaderAuthButtons() {
  const { checkLogin, logoutUser } = useUserMutation();
  const { isSuccess } = checkLogin;
  const { isPending: isLogoutPending } = logoutUser;

  useEffect(() => {
    checkLogin.mutate();
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {isSuccess ? (
        <>
          {isLogoutPending ? (
            <Button variant="secondary" size="sm" disabled>
              로그아웃 중...
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => logoutUser.mutate()}>
              로그아웃
            </Button>
          )}
        </>
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

