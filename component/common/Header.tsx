'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import HeaderAuthButtons from './HeaderAuthButtons';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600';
  };

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

          <HeaderAuthButtons />
        </div>
      </div>
    </header>
  );
}
