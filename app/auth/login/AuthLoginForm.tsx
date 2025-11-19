'use client';

import { useActionState } from 'react';

import { Card, Input, Link, SubmitButton } from '@/component/common';

import { type FormState, loginUser } from './actions';

const initialState: FormState = {};

export default function AuthLoginForm() {
  const [state, formAction] = useActionState<FormState, FormData>(loginUser, initialState);

  return (
    <Card shadow="lg">
      <form action={formAction} className="space-y-6">
        {state.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{state.error}</div>
        )}

        <div>
          <Input
            name="email"
            type="email"
            label="이메일"
            placeholder="email@example.com"
            fullWidth
            required
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
          />
        </div>

        <div>
          <Input
            name="password"
            type="password"
            label="비밀번호"
            placeholder="숫자 4자리 이상"
            helperText="숫자만 입력 가능하며 4자리 이상 입력하세요"
            fullWidth
            required
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">로그인 상태 유지</span>
          </label>
          <Link href="/auth/forgot-password" variant="primary" className="text-sm">
            비밀번호 찾기
          </Link>
        </div>

        <SubmitButton fullWidth>로그인</SubmitButton>
      </form>
    </Card>
  );
}
