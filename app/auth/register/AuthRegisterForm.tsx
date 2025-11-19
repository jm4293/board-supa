'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { Card, Input, SubmitButton } from '@/component/common';

import { type FormState, registerUser } from './actions';

const initialState: FormState = {};

export default function AuthRegisterForm() {
  const [state, formAction] = useActionState<FormState, FormData>(registerUser, initialState);

  return (
    <Card shadow="lg">
      <form action={formAction} className="space-y-5">
        {state.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{state.error}</div>
        )}
        <div>
          <Input
            name="username"
            type="text"
            label="이름"
            placeholder="홍길동"
            helperText="이름은 최소 2자 이상 입력하세요"
            fullWidth
            required
            minLength={2}
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>

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

        <div>
          <Input
            name="passwordConfirm"
            type="password"
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
            fullWidth
            required
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        </div>

        {/* 약관 동의 */}
        <div className="space-y-3">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="agreeTerms"
              required
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-700">
                이용약관
              </Link>{' '}
              및{' '}
              <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-700">
                개인정보처리방침
              </Link>
              에 동의합니다 <span className="text-red-500">*</span>
            </span>
          </label>
        </div>

        <SubmitButton fullWidth>회원가입</SubmitButton>
      </form>
    </Card>
  );
}
