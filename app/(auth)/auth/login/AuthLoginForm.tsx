'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Card, Input, Link, SubmitButton } from '@/component/common';

import { useUserMutation } from '@/service/user';

const formSchema = z.object({
  email: z.email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(4, '비밀번호는 최소 4자리 이상이어야 합니다'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AuthLoginForm({ email }: { email: string | undefined }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
    },
  });

  const { loginUser } = useUserMutation();

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    loginUser.mutate(formData);
  };

  return (
    <Card shadow="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            type="email"
            label="이메일"
            placeholder="email@example.com"
            error={errors.email?.message}
            {...register('email')}
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
            type="password"
            label="비밀번호"
            placeholder="숫자 4자리 이상"
            helperText="숫자만 입력 가능하며 4자리 이상 입력하세요"
            error={errors.password?.message}
            {...register('password')}
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

        <SubmitButton fullWidth disabled={loginUser.isPending}>
          로그인
        </SubmitButton>
      </form>
    </Card>
  );
}
