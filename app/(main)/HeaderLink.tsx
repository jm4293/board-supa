'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HeaderLink() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600';
  };

  return (
    <nav className="flex space-x-6">
      <Link href="/home" className={`${isActive('/home')} transition-colors`}>
        홈
      </Link>
      <Link href="/board" className={`${isActive('/board')} transition-colors`}>
        게시판
      </Link>
    </nav>
  );
}
