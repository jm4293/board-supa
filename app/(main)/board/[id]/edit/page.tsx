import { redirect } from 'next/navigation';

import { getBoardDetailAction } from '@/service/board/action';
import { getUserInfoAction } from '@/service/user';

import BoardEdit from './BoardEdit';

export default async function BoardEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: userInfo } = await getUserInfoAction();
  const { data, success } = await getBoardDetailAction({ id });

  if (!userInfo) {
    redirect(`/board/${id}`);
  }

  if (!success) {
    redirect('/board');
  }

  if (!data) {
    redirect('/board');
  }

  if (userInfo?.userAccountId !== data?.userAccountId) {
    redirect(`/board/${id}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">게시글 수정</h1>
      </div>

      <BoardEdit data={data} />
    </div>
  );
}
