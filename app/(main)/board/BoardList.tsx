import Link from 'next/link';

import { BoardModel } from '@/service/board/model';
import { formatDate } from '@/share/utils';

interface BoardListProps {
  boards: BoardModel[];
}

export default function BoardList({ boards }: BoardListProps) {
  if (boards.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-2">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">등록된 게시글이 없습니다</p>
        <p className="text-gray-400 text-sm mt-1">첫 번째 게시글을 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 테이블 헤더 */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
        <div className="col-span-1 text-center">번호</div>
        <div className="col-span-7">제목</div>
        <div className="col-span-2 text-center">조회수</div>
        <div className="col-span-2 text-center">작성일</div>
      </div>

      {/* 게시글 목록 */}
      <ul className="divide-y divide-gray-200">
        {boards.map((board) => (
          <li key={board.id}>
            <Link
              href={`/board/${board.id}`}
              className="block hover:bg-blue-50 transition-colors duration-150"
            >
              {/* 모바일 레이아웃 */}
              <div className="sm:hidden px-4 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {board.title}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span>조회 {board.viewCount ?? 0}</span>
                      <span>{board.createdAt ? formatDate(board.createdAt.toString()) : '-'}</span>
                    </div>
                  </div>
                  <span className="ml-2 text-xs text-gray-400">#{board.id}</span>
                </div>
              </div>

              {/* 데스크톱 레이아웃 */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-4 items-center">
                <div className="col-span-1 text-center text-sm text-gray-500">
                  {board.id}
                </div>
                <div className="col-span-7">
                  <p className="text-sm font-medium text-gray-900 truncate hover:text-blue-600">
                    {board.title}
                  </p>
                </div>
                <div className="col-span-2 text-center text-sm text-gray-500">
                  {board.viewCount ?? 0}
                </div>
                <div className="col-span-2 text-center text-sm text-gray-500">
                  {board.createdAt ? formatDate(board.createdAt.toString()) : '-'}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

