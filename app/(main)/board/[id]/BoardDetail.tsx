'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button, Card } from '@/component/common';

import { formatDate } from '@/share/utils/format';

import { useGetBoardDetail } from '@/service/board/hooks/useGetBoardDetail';
import { useGetUser } from '@/service/user/hooks/useGetUser';
import { useBoardMutation } from '@/service/board/hooks/useBoardMutation';
import { createBoardCommentAction } from '@/service/board/action';
import useGetBoardComment from '@/service/board/hooks/useGetBoardComment';
import { useBoardCommentMutation } from '@/service/board/hooks/useBoardCommentMutation';

interface BoardDetailProps {
  boardId: number;
}

export default function BoardDetail({ boardId }: BoardDetailProps) {
  const { data, isPending } = useGetBoardDetail(boardId);
  const { data: userData } = useGetUser();
  const { deleteBoard } = useBoardMutation();
  const [comment, setComment] = useState<string>('');
  const { data: comments, isPending: isCommentsPending } = useGetBoardComment(boardId);
  const queryClient = useQueryClient();
  const { deleteBoardComment } = useBoardCommentMutation(boardId);

  // userData.data는 JwtPayload | string | null 타입이므로 타입 가드 필요
  const userAccountId =
    userData?.data &&
      typeof userData.data === 'object' &&
      'userAccountId' in userData.data
      ? userData.data.userAccountId
      : null;

  const board = data?.data ?? null;

  if (isPending) {
    return (
      <Card shadow="lg" className="mb-8">
        <div className="p-6">
          <div className="text-center">로딩 중...</div>
        </div>
      </Card>
    );
  }

  if (!board) {
    return (
      <Card shadow="lg" className="mb-8">
        <div className="p-6">
          <div className="text-center text-red-600">게시글을 불러올 수 없습니다.</div>
        </div>
      </Card>
    );
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    const response = await createBoardCommentAction({
      boardId: boardId,
      userId: userAccountId,
      content: comment,
    });

    if (response.success) {
      setComment('');
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['boardComments', boardId] });
    }
  };

  return (
    <>
      <Card shadow="lg" className="mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{board.title}</h1>
            <div className="flex items-center space-x-2">
              {userAccountId === board.userAccountId && (
                <>
                  <Link href={`/board/${boardId}/edit`}>
                    <Button variant="secondary" size="sm">
                      수정
                    </Button>
                  </Link>
                  <form action={() => deleteBoard.mutate(board.id)} className="inline">
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
            <span>{formatDate(String(board.createdAt))}</span>
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              댓글 {comments?.data?.length ?? 0}
            </span>
          </div>

          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">{board.content}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {board.boardImage?.map((image) => (
              <img key={image.id} src={image.imageUrl ?? ''} alt={image.imageName ?? ''} className="w-24 h-24 object-cover" />
            ))}
          </div>
        </div>
      </Card>

      {/* 댓글 작성 폼 */}
      {userAccountId && (
        <Card shadow="md" className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">댓글 작성</h2>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="댓글을 입력하세요"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="sm">
                  댓글 작성
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* 댓글 목록 */}
      <Card shadow="md">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            댓글 {comments?.data?.length ?? 0}개
          </h2>

          {isCommentsPending ? (
            <div className="text-center py-8 text-gray-500">댓글을 불러오는 중...</div>
          ) : !comments?.data || comments.data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">아직 댓글이 없습니다.</div>
          ) : (
            <div className="space-y-6">
              {comments.data.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {comment.user?.username || '익명'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(String(comment.createdAt))}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    {userAccountId === comment.userId && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="text" size="sm" onClick={() => deleteBoardComment.mutate(comment.id)}>
                          삭제
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

