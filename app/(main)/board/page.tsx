import { getBoardListAction } from '@/service/board/action';

import BoardList from './BoardList';
import BoardPagination from './BoardPagination';
import BoardWriteButton from './BoardWriteButton';

interface BoardPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BoardPage({ searchParams }: BoardPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const response = await getBoardListAction({ page, limit: 10 });

  const boards = response.data?.boards ?? [];
  const total = response.data?.total ?? 0;
  const limit = response.data?.limit ?? 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">게시판</h1>
          <p className="text-sm text-gray-500 mt-1">
            총 {total}개의 게시글이 있습니다
          </p>
        </div>
        <BoardWriteButton />
      </div>

      <BoardList boards={boards} />
      <BoardPagination total={total} page={page} limit={limit} />
    </div>
  );
}
