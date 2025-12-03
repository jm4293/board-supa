import { redirect } from 'next/navigation';

import { authUtil, JwtPayload } from '@/share/utils';
import { jwtUtil } from '@/share/utils/jwt';

import BoardDetail from './BoardDetail';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function BoardDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const boardId = parseInt(resolvedParams.id);

  if (isNaN(boardId)) {
    redirect('/board');
  }

  // 현재 사용자 정보 가져오기
  const session = await authUtil.getSession();
  if (!session) {
    redirect('/auth/login');
  }

  const decoded = jwtUtil.decode(session) as JwtPayload | null;
  const userAccountId = decoded?.userAccountId ?? null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BoardDetail boardId={boardId} currentUserId={userAccountId} />
    </div>
  );
}
