# Study Board - Supabase

Next.js 16 기반의 게시판 프로젝트입니다. Supabase를 백엔드로 사용합니다.

## 🚀 Quick Start

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Supabase 프로젝트 설정:**

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 설정 > API에서 URL과 anon key 확인
3. `.env.local` 파일에 추가

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

**브라우저에서 접속:** http://localhost:3000

---

## 📁 프로젝트 구조

```
app/                    # Next.js App Router (페이지, 레이아웃)
  (main)/               # 메인 레이아웃 그룹
    board/              # 게시판 관련 페이지
    home/               # 홈 페이지
  (auth)/               # 인증 레이아웃 그룹
    auth/               # 인증 관련 페이지
component/              # React 컴포넌트
  common/               # 공통 컴포넌트
config/                 # 설정 파일
  supabase/            # Supabase 클라이언트 설정
  react-query/         # React Query Provider 설정
database/
  model/                # 데이터베이스 모델 (TypeScript Interface)
service/                # 비즈니스 로직 서비스 레이어
  {domain}/             # 도메인별 폴더 (예: user, board)
    action/             # Server Actions
    mutation/           # React Query Mutations
    model/              # 도메인별 Model (선택사항)
share/                  # 공유 리소스
  utils/                # 유틸리티 함수
  const/                # 상수 정의
  type/                 # 공통 타입 정의
docs/                   # 문서
```

## 🛠 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Form**: React Hook Form + Zod
- **State Management**: React Query (@tanstack/react-query)
- **Authentication**: Supabase Auth

## 📚 주요 기능

- 사용자 인증 (회원가입, 로그인)
- 게시판 (작성, 조회, 수정, 삭제)
- 댓글 기능
- 이미지 업로드

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 실행
npm run lint

# 빌드 캐시 제거
npm run build-rm

# node_modules 및 빌드 캐시 모두 제거
npm run clear-all
```

## 📖 문서

- [개발 가이드](./docs/DEVELOPMENT.md) - 개발 규칙 및 패턴
- [환경 변수 가이드](./docs/ENVIROMENT.md) - 환경 변수 설정 가이드

## 🚢 배포

### Vercel 배포

1. GitHub에 프로젝트 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 배포 완료

## 📝 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
