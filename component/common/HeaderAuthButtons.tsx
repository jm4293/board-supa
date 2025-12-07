'use client';

import { useUserMutation } from '@/service/user/hooks/useUserMutation';
import { useGetUser } from '@/service/user/hooks/useGetUser';
import Button from './Button';
import Link from './Link';

export default function HeaderAuthButtons() {
  const { logoutUser } = useUserMutation();
  const { data } = useGetUser();
  const { isPending: isLogoutPending } = logoutUser;

  return (
    <div className="flex items-center space-x-4">
      {data?.success ? (
        <>
          {data && data.data && typeof data.data === 'object' && 'nickname' in data.data && (
            <span className="text-gray-700">{data.data?.nickname}님 환영합니다</span>
          )}
          <Button variant="secondary" size="sm" onClick={() => logoutUser.mutate()}>
            {isLogoutPending ? '로그아웃 중...' : '로그아웃'}
          </Button>
        </>
      ) : (
        <Link href="/auth/login">
          <Button variant="primary" size="sm">
            로그인
          </Button>
        </Link>
      )
      }
    </div >
  );
}
