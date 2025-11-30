import Link from 'next/link';

import { Button } from '@/component/common';

import { getBoardListAction } from '@/service/board/action';
import { getUserInfoAction } from '@/service/user';

import BoardList from './BoardList';

export default async function BoardPage({ searchParams }: { searchParams: Promise<{ page: string }> }) {
  const { page } = await searchParams;

  const { data: auth, success } = await getUserInfoAction();
  const boardList = await getBoardListAction({ page: Number(page) || 0 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">게시판</h1>

        {!!auth && (
          <Link href="/board/write">
            <Button variant="primary">글쓰기</Button>
          </Link>
        )}
      </div>

      <BoardList boardList={boardList.data || []} />
    </div>
  );
}
