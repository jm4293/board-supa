'use client';

import { Button } from '@/component/common';

import { useUserMutation } from '@/service/user';

export default function LogoutButton() {
  const { logout } = useUserMutation();

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout.mutate();
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleLogout}>
      로그아웃
    </Button>
  );
}
