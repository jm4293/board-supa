import { Link } from '@/component/common';

import AuthLoginForm from './AuthLoginForm';

export default async function AuthLoginPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const { email } = resolvedSearchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* 로고/타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Study Board</h1>
          <p className="text-gray-600">로그인하여 게시판을 이용하세요</p>
        </div>

        {/* 로그인 폼 */}
        <AuthLoginForm email={email} />

        {/* 회원가입 링크 */}
        <div className="text-center mt-6">
          <span className="text-gray-600">아직 계정이 없으신가요? </span>
          <Link href="/auth/register" variant="primary" className="font-semibold">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
