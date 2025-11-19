import { Link } from '@/component/common';

import AuthRegisterForm from './AuthRegisterForm';

export default function AuthRegister() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* 로고/타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Study Board</h1>
          <p className="text-gray-600">새로운 계정을 만들어보세요</p>
        </div>

        {/* 회원가입 폼 */}
        <AuthRegisterForm />

        {/* 로그인 링크 */}
        <div className="text-center mt-6">
          <span className="text-gray-600">이미 계정이 있으신가요? </span>
          <Link href="/auth/login" variant="primary" className="font-semibold">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
