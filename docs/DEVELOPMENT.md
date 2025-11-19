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

## 3. Form Validation (React Hook Form + Zod)

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
<SubmitButton text="등록하기" disabled={isSubmitting} />
```

### 주요 기능

| 기능           | 설명                | 사용법                                      |
| -------------- | ------------------- | ------------------------------------------- |
| `register`     | Input을 폼에 등록   | `{...register('fieldName')}`                |
| `handleSubmit` | 폼 제출 처리        | `onSubmit={handleSubmit(onSubmit)}`         |
| `getValues`    | 현재 폼 값 가져오기 | `getValues()` 또는 `getValues('fieldName')` |
| `errors`       | 검증 에러 확인      | `errors.fieldName?.message`                 |
| `isSubmitting` | 제출 중 상태        | `formState.isSubmitting`                    |

---

## 4. 프로젝트 구조 권장사항

```
database/
  entities/              # Model 정의 (TypeScript Interface)
    User.ts
    Board.ts
    BoardComment.ts

app/
  (main)/
    board/
      write/
        actions.ts       # Server Actions
        BoardWriteForm.tsx
      [id]/
        actions.ts
        BoardDetail.tsx

service/                 # 비즈니스 로직 & 변환 로직 (선택사항)
  board/
    get-board-list.service.ts
```

**핵심 원칙**:

- `database/entities/`: 데이터베이스 구조 정의 (Model Interface)
- `app/**/actions.ts`: Server Actions (비즈니스 로직)
- `app/**/*.tsx`: React 컴포넌트
- `service/`: 복잡한 비즈니스 로직이나 Model ↔ Response 변환 로직

---

## 5. Server Actions 패턴

### 기본 구조

```typescript
'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/config/supabase/server';

export async function createBoard(formData: FormData) {
  const supabase = await createClient();

  // 세션 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  // 데이터 추출
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // 유효성 검사
  if (!title || !title.trim()) {
    throw new Error('제목을 입력해주세요');
  }

  // 데이터베이스 작업
  const { data, error } = await supabase
    .from('Board')
    .insert({
      user_id: user.id,
      title: title.trim(),
      content: content.trim(),
      view_count: 0,
      is_deleted: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error('게시글 작성에 실패했습니다');
  }

  redirect(`/board/${data.id}`);
}
```

### 에러 처리

```typescript
export interface FormState {
  error?: string;
}

export async function createBoard(prevState: FormState | null, formData: FormData): Promise<FormState> {
  try {
    // ... 작업 수행
    return {};
  } catch (error) {
    // redirect()는 NEXT_REDIRECT 에러를 throw하는데, 이것은 정상 동작이므로 다시 throw
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : '작업에 실패했습니다';
    return {
      error: errorMessage,
    };
  }
}
```

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

## 7. 주의사항

- **비동기 처리**: async/await 사용, Promise 체이닝 지양
- **에러 핸들링**: try-catch 블록 필수, 의미 있는 에러 메시지
- **보안**: 환경변수로 민감 정보 관리 (`.env.local`)
- **타입 안정성**: `any` 사용 금지, 명시적 타입 정의 필수
- **코드 품질**: ESLint 규칙 준수, 불필요한 console.log 제거
- **Supabase RLS**: Row Level Security 정책 설정 권장
