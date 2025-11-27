'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from './Button';
import { checkLoginAction } from '@/service/user/action/check-login.action';
import { logoutUserAction } from '@/service/user/action/logout-user.action';

export default function Header() {
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await checkLoginAction();
      if (response.success) {
        setIsLogin(true);
      }
    } catch {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logoutUserAction();

      if (response.success) {
        setIsLogin(false);
        alert(response.message);
      }
    } catch (error) {
      return alert(error);
    }
  };

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600';
  };

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-lg font-bold text-blue-600">Study Board</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/home" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              Study Board
            </Link>
            <nav className="flex space-x-6">
              <Link href="/home" className={`${isActive('/home')} transition-colors`}>
                홈
              </Link>
              <Link href="/board" className={`${isActive('/board')} transition-colors`}>
                게시판
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isLogin ? (
              <>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  로그아웃
                </Button>
              </>
            ) : (
              <Link href="/auth/login">
                <Button variant="primary" size="sm">
                  로그인
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
