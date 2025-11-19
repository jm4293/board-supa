# 환경 변수 파일 종류 및 차이점

Next.js에서 사용하는 환경 변수 파일들의 차이점과 우선순위에 대한 가이드입니다.

## 환경 변수 파일 종류

### 1. `.env.local`

- **용도**: 모든 환경에서 로컬 우선 설정
- **특징**:
  - 로컬 개발 환경 전용
  - `.gitignore`에 포함되어 버전 관리 제외
  - 개발/프로덕션 모두에서 로드됨
  - 가장 높은 우선순위
- **사용 예시**:
  ```bash
  DATABASE_URL=mysql://localhost:3306/mydb
  SECRET_KEY=local-secret-key
  ```

### 2. `.env.development` / `.env.production`

- **용도**: 환경별 설정
- **특징**:
  - `NODE_ENV`에 따라 자동 선택
  - 개발: `npm run dev` → `.env.development`
  - 프로덕션: `npm run build` / `npm start` → `.env.production`
  - 환경별로 다른 값 설정 가능
- **사용 예시**:

  ```bash
  # .env.development
  API_URL=http://localhost:3000/api
  DEBUG=true

  # .env.production
  API_URL=https://api.production.com
  DEBUG=false
  ```

### 3. `.env`

- **용도**: 기본값/공통 설정
- **특징**:
  - 모든 환경에서 공통으로 사용
  - 버전 관리에 포함 가능 (공개해도 되는 값)
  - 가장 낮은 우선순위
- **사용 예시**:
  ```bash
  NEXT_PUBLIC_APP_NAME=Study Board
  NEXT_PUBLIC_VERSION=1.0.0
  ```

## 우선순위

환경 변수 파일들은 다음 순서로 우선순위가 적용됩니다:

```
.env.local (최우선)
    ↓
.env.development 또는 .env.production (환경별)
    ↓
.env (기본값)
```

**중요**: 같은 변수가 여러 파일에 있으면 위 순서로 덮어씁니다.

## 실제 동작 예시

```bash
# .env
API_URL=https://default.com
DEBUG=false

# .env.development
API_URL=http://localhost:3000
DEBUG=true

# .env.local
API_URL=http://127.0.0.1:3000
```

**개발 환경(`npm run dev`)에서**:

- 최종 `API_URL` = `http://127.0.0.1:3000` (`.env.local` 우선)
- 최종 `DEBUG` = `true` (`.env.development`에서 가져옴)

## 추가 파일들

### `.env.development.local` / `.env.production.local`

- **용도**: 환경별 로컬 설정
- **특징**:
  - 환경별 로컬 설정
  - `.env.local`보다 우선순위가 높음
  - `.gitignore`에 포함

## 최종 우선순위 (완전한 순서)

```
.env.production.local (프로덕션에서 최우선)
.env.local
.env.production (프로덕션)
.env.development.local (개발에서 최우선)
.env.local
.env.development (개발)
.env
```

## 권장 사용 패턴

```bash
# .env (공개 가능한 기본값)
NEXT_PUBLIC_APP_NAME=Study Board

# .env.development (개발 환경 설정)
NEXT_PUBLIC_API_URL=http://localhost:3000

# .env.production (프로덕션 환경 설정)
NEXT_PUBLIC_API_URL=https://api.production.com

# .env.local (로컬 전용, gitignore)
DATABASE_URL=mysql://user:pass@localhost:3306/db
JWT_SECRET=your-secret-key
```

## 주의사항

1. **민감한 정보**: `.env.local`, `.env.development.local`, `.env.production.local`은 반드시 `.gitignore`에 포함되어야 합니다.
2. **NEXT*PUBLIC* 접두사**: 클라이언트에서 접근 가능한 변수는 `NEXT_PUBLIC_` 접두사를 붙여야 합니다.
3. **환경 변수 변경 후**: 환경 변수를 변경한 후에는 개발 서버를 재시작해야 합니다.
