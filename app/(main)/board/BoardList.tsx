'use client';

import { useGetBoardList } from '@/service/board/hooks/useGetBoardList';
import EmptyBoard from './EmptyBoard';
import BoardListItems from './BoardListItems';

export default function BoardList({ params }: { params: { page?: number | undefined } }) {
  const { data, isPending } = useGetBoardList(params);
  const boards = data?.data?.boards ?? [];

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (boards.length === 0) {
    return <EmptyBoard />;
  }

  return <BoardListItems boards={boards} />;
}

