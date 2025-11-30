'use client';

import { Button } from '@/component/common';

export default function LogoutButton() {
  const handleLogout = async () => {};

  return (
    <Button variant="secondary" size="sm" onClick={handleLogout}>
      로그아웃
    </Button>
  );
}
