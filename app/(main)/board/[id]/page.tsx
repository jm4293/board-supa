import { redirect } from 'next/navigation';

import { authUtil, JwtPayload } from '@/share/utils/auth';
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BoardDetail boardId={boardId} />
    </div>
  );
}
