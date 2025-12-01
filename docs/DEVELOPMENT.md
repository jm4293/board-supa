# 개발 가이드

## 1. 데이터베이스 모델 (Model)

### Model 정의

**정의**: 데이터베이스 테이블과 **직접 매핑**되는 TypeScript Interface

**용도**: Supabase를 통해 데이터베이스와 상호작용할 때 사용하는 타입 정의

**특징**:

- TypeScript Interface로 정의
- 데이터베이스 스키마를 타입으로 표현
- 테이블 구조와 1:1 대응
- snake_case DB 컬럼명을 camelCase로 매핑

**예시**:

```typescript
// database/entities/User.ts
export interface UserModel {
  id: number;
  username: string;
  nickname: string | null;
  profileImage: string | null;
  status: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
```

### Supabase 클라이언트 사용

**Server Component / Server Actions에서 사용**:

```typescript
import { createClient } from '@/config/supabase/server';

export async function getUsers() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('User').select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data as UserModel[];
}
```

**Client Component에서 사용**:

```typescript
'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
```

### 데이터베이스 작업 패턴

#### 조회 (SELECT)

```typescript
// 단일 조회
const { data, error } = await supabase
  .from('User')
  .select('*')
  .eq('id', userId)
  .single();

// 목록 조회
const { data, error } = await supabase
  .from('Board')
  .select('*')
  .eq('is_deleted', 0)
  .order('created_at', { ascending: false })
  .range(0, 9);
```

#### 생성 (INSERT)

```typescript
const { data, error } = await supabase
  .from('Board')
  .insert({
    user_id: userId,
    title: title,
    content: content,
    view_count: 0,
    is_deleted: 0,
  })
  .select()
  .single();
```

#### 수정 (UPDATE)

```typescript
const { data, error } = await supabase
  .from('Board')
  .update({
    title: newTitle,
    content: newContent,
    updated_at: new Date().toISOString(),
  })
  .eq('id', boardId)
  .select()
  .single();
```

#### 삭제 (DELETE)

```typescript
// 실제 삭제
const { error } = await supabase
  .from('Board')
  .delete()
  .eq('id', boardId);

// Soft Delete (is_deleted 플래그 사용)
const { error } = await supabase
  .from('Board')
  .update({
    is_deleted: 1,
    deleted_at: new Date().toISOString(),
  })
  .eq('id', boardId);
```

---

## 2. API Request/Response Model

### Request/Response 타입 정의

**정의**: API 요청/응답에서 사용하는 **데이터 구조**

**용도**: Server Actions, API 라우트의 입출력 타입 정의

**특징**:

- TypeScript 인터페이스나 타입으로 정의
- Model과 다른 형태로 변환 가능
- 클라이언트에 노출되는 데이터 구조
- 필요한 필드만 선택적으로 포함

**예시**:

```typescript
// app/(main)/board/write/types.ts

// 생성 요청 타입
export interface CreateBoardRequest {
  title: string;
  content: string;
}

// 응답 타입 (민감한 정보 제외)
export interface BoardResponse {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  createdAt: string;
  // user_id는 제외하거나 userId로 변환
}

// 목록 조회 응답 타입
export interface BoardListResponse {
  boards: BoardResponse[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

## 3. Form 처리 및 API 요청 패턴 (React Hook Form + Zod + Mutation + Server Action)

### 전체 아키텍처

프로젝트의 모든 API 요청은 다음 패턴을 따릅니다:

```
Form Component (Client)
  → Mutation Hook (React Query)
    → Server Action (Server)
      → Supabase
```

### 패턴 구성 요소

1. **Form Component**: React Hook Form + Zod로 폼 검증
2. **Mutation Hook**: React Query의 `useMutation`으로 상태 관리
3. **Server Action**: 서버 측 비즈니스 로직 처리
4. **ResponseType**: 일관된 응답 형식

---

## 3-1. Form Validation (React Hook Form + Zod)

### 설치

```bash
npm install react-hook-form zod @hookform/resolvers
```

### 기본 사용법

#### 1. Zod 스키마 정의

```typescript
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(1, '제목은 최소 1자 이상이어야 합니다.').max(255, '제목은 최대 255자 이하여야 합니다.'),
  content: z.string().min(1, '내용은 최소 1자 이상이어야 합니다.'),
});

type FormValues = z.infer<typeof formSchema>;
```

#### 2. React Hook Form 설정

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function BoardWriteForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    await createBoard(data);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* 폼 내용 */}</form>;
}
```

#### 3. Input 등록 및 에러 표시

```typescript
<div>
  <Input
    title="제목"
    placeholder="제목을 입력해주세요"
    {...register('title')}
  />
  {errors.title && (
    <p className="text-red-500">{errors.title.message}</p>
  )}
</div>

<div>
  <Textarea
    title="내용"
    placeholder="내용을 입력해주세요"
    {...register('content')}
  />
  {errors.content && (
    <p className="text-red-500">{errors.content.message}</p>
  )}
</div>
```

#### 4. 제출 버튼

```typescript
<SubmitButton text="등록하기" disabled={mutation.isPending} />
```

### 주요 기능

| 기능           | 설명                | 사용법                                                                |
| -------------- | ------------------- | --------------------------------------------------------------------- |
| `register`     | Input을 폼에 등록   | `{...register('fieldName')}`                                          |
| `handleSubmit` | 폼 제출 처리        | `onSubmit={handleSubmit(onSubmit)}`                                   |
| `getValues`    | 현재 폼 값 가져오기 | `getValues()` 또는 `getValues('fieldName')`                           |
| `errors`       | 검증 에러 확인      | `errors.fieldName?.message`                                           |
| `isSubmitting` | 제출 중 상태        | `formState.isSubmitting` (Mutation 사용 시 `mutation.isPending` 권장) |

---

## 3-2. Mutation 패턴 (React Query)

### 설치

```bash
npm install @tanstack/react-query
```

### QueryProvider 설정

루트 레이아웃에 `QueryProvider`를 추가합니다:

```typescript
// app/layout.tsx
import { QueryProvider } from '@/config/react-query/QueryProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

### Mutation Hook 작성

**파일 위치**: `service/{domain}/mutation/use{Mutation}Mutation.tsx`

**예시**:

```typescript
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { loginUserAction } from '../action';

export const useUserMutation = () => {
  const router = useRouter();

  const loginUser = useMutation({
    mutationFn: (formData: FormData) => loginUserAction(formData),
    onSuccess: (response) => {
      const { success, message } = response;

      if (!success) {
        alert(message);
        return;
      }

      alert('로그인이 완료되었습니다.');
      router.push('/home');
    },
    onError: (error) => {
      throw error;
    },
  });

  return {
    loginUser,
  };
};
```

### Form에서 Mutation 사용

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useUserMutation } from '@/service/user';

const formSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(4, '비밀번호는 최소 4자리 이상이어야 합니다'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AuthLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { loginUser } = useUserMutation();

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    loginUser.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 폼 필드 */}
      <SubmitButton disabled={loginUser.isPending}>로그인</SubmitButton>
    </form>
  );
}
```

### Mutation 주요 속성

| 속성         | 설명          | 사용법                               |
| ------------ | ------------- | ------------------------------------ |
| `mutationFn` | 실행할 함수   | `mutationFn: (data) => action(data)` |
| `onSuccess`  | 성공 시 콜백  | `onSuccess: (response) => {}`        |
| `onError`    | 에러 시 콜백  | `onError: (error) => {}`             |
| `isPending`  | 진행 중 상태  | `mutation.isPending`                 |
| `mutate`     | Mutation 실행 | `mutation.mutate(data)`              |

---

## 3-3. Server Action 패턴

### ResponseType 정의

모든 Server Action은 `ResponseType<T>`을 반환합니다:

```typescript
// share/type/response.type.ts
export interface ResponseType<T = undefined> {
  success: boolean;
  data: T | null;
  message: string | null;
}
```

### Server Action 작성

**파일 위치**: `service/{domain}/action/{action-name}.action.ts`

**예시**:

```typescript
'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';

export const loginUserAction = async (formData: FormData): Promise<ResponseType> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  try {
    // 비즈니스 로직 처리
    const userAccount = await supabase.from(DATABASE_TABLE.USER_ACCOUNT).select('*').eq('email', email).single();

    if (!userAccount.data) {
      return {
        success: false,
        data: null,
        message: '사용자를 찾을 수 없습니다',
      };
    }

    // 성공 응답
    return {
      success: true,
      data: null,
      message: null,
    };
  } catch (error) {
    throw error;
  }
};
```

### Server Action 규칙

1. **파일 위치**: `service/{domain}/action/{action-name}.action.ts`
2. **디렉티브**: `'use server'` 필수
3. **파라미터**: FormData 또는 명시적 타입
4. **반환 타입**: `Promise<ResponseType<T>>`
5. **에러 처리**: try-catch 블록 필수
6. **에러 throw**: 예상치 못한 에러는 throw하여 Mutation의 `onError`에서 처리

### Server Action Export

```typescript
// service/{domain}/action/index.ts
export * from './login-user.action';
export * from './register-user.action';
```

### Service Export

```typescript
// service/{domain}/index.ts
export * from './action';
export * from './mutation';
export * from './model';
```

---

## 5. 프로젝트 구조 패턴

### 권장 구조

```
service/
  {domain}/                    # 도메인별 폴더 (예: user, board)
    action/                    # Server Actions
      {action-name}.action.ts
      index.ts                 # Export 파일
    mutation/                  # React Query Mutations
      use{Mutation}Mutation.tsx
      index.ts                 # Export 파일
    model/                     # 도메인별 Model (선택사항)
      {Model}.ts
      index.ts
    index.ts                   # 전체 Export

app/
  (main)/
    board/
      write/
        BoardWriteForm.tsx     # Form Component (Client)
      [id]/
        BoardDetail.tsx        # Page Component
```

### 구조 원칙

1. **Service 레이어**: 비즈니스 로직과 API 호출을 `service/` 폴더에서 관리
2. **도메인별 분리**: 기능별로 도메인 폴더로 분리 (user, board 등)
3. **Action 분리**: Server Action은 `action/` 폴더에 별도 관리
4. **Mutation 분리**: React Query Mutation은 `mutation/` 폴더에 별도 관리
5. **Form Component**: 페이지와 같은 위치에 배치하되, Client Component로 분리

---

## 6. 인증 처리

### 세션 확인

```typescript
import { createClient } from '@/config/supabase/server';

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
```

### 보호된 페이지/액션

```typescript
export async function protectedAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // 보호된 작업 수행
}
```

---

## 6. 완전한 예시: 로그인 기능 구현

### 1. Zod 스키마 정의 (Form Component 내부)

```typescript
const formSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(4, '비밀번호는 최소 4자리 이상이어야 합니다'),
});

type FormValues = z.infer<typeof formSchema>;
```

### 2. Form Component 작성

```typescript
// app/(auth)/auth/login/AuthLoginForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input, SubmitButton } from '@/component/common';
import { useUserMutation } from '@/service/user';

const formSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(4, '비밀번호는 최소 4자리 이상이어야 합니다'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AuthLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { loginUser } = useUserMutation();

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    loginUser.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="email"
        label="이메일"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        type="password"
        label="비밀번호"
        error={errors.password?.message}
        {...register('password')}
      />
      <SubmitButton disabled={loginUser.isPending}>로그인</SubmitButton>
    </form>
  );
}
```

### 3. Mutation Hook 작성

```typescript
// service/user/mutation/useUserMutation.tsx
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { loginUserAction } from '../action';

export const useUserMutation = () => {
  const router = useRouter();

  const loginUser = useMutation({
    mutationFn: (formData: FormData) => loginUserAction(formData),
    onSuccess: (response) => {
      const { success, message } = response;

      if (!success) {
        alert(message);
        return;
      }

      alert('로그인이 완료되었습니다.');
      router.push('/home');
    },
    onError: (error) => {
      throw error;
    },
  });

  return {
    loginUser,
  };
};
```

### 4. Server Action 작성

```typescript
// service/user/action/login-user.action.ts
'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';
import { passwordUtil } from '@/share/utils';

export const loginUserAction = async (formData: FormData): Promise<ResponseType> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  try {
    const userAccount = await supabase.from(DATABASE_TABLE.USER_ACCOUNT).select('*').eq('email', email).single();

    if (!userAccount.data) {
      return {
        success: false,
        data: null,
        message: '사용자를 찾을 수 없습니다',
      };
    }

    const isValid = await passwordUtil.comparePassword(password, userAccount.data.password);

    if (!isValid) {
      return {
        success: false,
        data: null,
        message: '비밀번호가 일치하지 않습니다',
      };
    }

    return {
      success: true,
      data: null,
      message: null,
    };
  } catch (error) {
    throw error;
  }
};
```

### 5. Export 설정

```typescript
// service/user/action/index.ts
export * from './login-user.action';

// service/user/mutation/index.ts
export * from './useUserMutation';

// service/user/index.ts
export * from './action';
export * from './mutation';
export * from './model';
```

---

## 7. 주의사항

- **비동기 처리**: async/await 사용, Promise 체이닝 지양
- **에러 핸들링**: try-catch 블록 필수, 의미 있는 에러 메시지
- **보안**: 환경변수로 민감 정보 관리 (`.env.local`)
- **타입 안정성**: `any` 사용 금지, 명시적 타입 정의 필수
- **코드 품질**: ESLint 규칙 준수, 불필요한 console.log 제거
- **Supabase RLS**: Row Level Security 정책 설정 권장
- **Form 처리**: 모든 폼은 React Hook Form + Zod + Mutation 패턴 사용
- **Server Action**: 직접 호출하지 않고 Mutation을 통해 호출
- **ResponseType**: 모든 Server Action은 `ResponseType<T>` 반환
- **Mutation 상태**: `isPending`으로 로딩 상태 관리
