import { Link } from '@/component/common';

import AuthLoginForm from './AuthLoginForm';

export default function AuthLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* 로그인 폼 */}
        <AuthLoginForm />

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
