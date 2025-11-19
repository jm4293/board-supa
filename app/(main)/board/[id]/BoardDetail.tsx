'use client';

import Link from 'next/link';

import { Button, Card } from '@/component/common';

import { formatDate } from '@/share/utils/format';

import { deleteBoard } from './actions';

interface Board {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
  };
}

interface BoardDetailProps {
  board: Board;
  boardId: string;
  currentUserId: number | null;
}

export default function BoardDetail({ board, boardId, currentUserId }: BoardDetailProps) {
  return (
    <Card shadow="lg" className="mb-8">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{board.title}</h1>
          <div className="flex items-center space-x-2">
            {currentUserId === board.user.id && (
              <>
                <Link href={`/board/${boardId}/edit`}>
                  <Button variant="secondary" size="sm">
                    수정
                  </Button>
                </Link>
                <form action={deleteBoard} className="inline">
                  <input type="hidden" name="boardId" value={board.id} />
                  <Button type="submit" variant="outline" size="sm">
                    삭제
                  </Button>
                </form>
              </>
            )}
            <Link href="/board">
              <Button variant="outline" size="sm">
                목록
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6 pb-6 border-b">
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {board.user.username}
          </span>
          <span>{formatDate(board.createdAt)}</span>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            조회 {board.viewCount}
          </span>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            좋아요 {board.likeCount}
          </span>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            댓글 {board.commentCount}
          </span>
        </div>

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700">{board.content}</div>
        </div>
      </div>
    </Card>
  );
}

