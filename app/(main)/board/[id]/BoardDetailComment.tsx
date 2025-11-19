'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button, Card } from '@/component/common';

import { formatDate } from '@/share/utils/format';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
  replies?: Comment[];
}

interface UserInfo {
  userId: number;
  username: string;
  email: string;
}

interface BoardDetailCommentProps {
  boardId: string;
  initialComments: Comment[];
}

export default function BoardDetailComment({ boardId, initialComments }: BoardDetailCommentProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.success && data.data) {
        setUser(data.data);
      }
    } catch {
      // Error handling
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/boards/${boardId}/comments`);
      const data = await response.json();

      if (data.success) {
        setComments(data.data);
      }
    } catch {
      // Error handling
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다');
      router.push('/auth/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/boards/${boardId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCommentContent('');
        fetchComments();
        // 댓글 수 업데이트를 위해 페이지 새로고침
        router.refresh();
      } else {
        alert(data.error || '댓글 작성에 실패했습니다');
      }
    } catch {
      alert('댓글 작성에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 댓글 작성 */}
      {user && (
        <Card shadow="md" className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">댓글 작성</h2>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="댓글을 입력하세요"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" loading={isSubmitting}>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">댓글 {comments.length}개</h2>

          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">아직 댓글이 없습니다.</div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">{comment.user.username}</span>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>

                  {/* 대댓글 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-8 pl-4 border-l-2 border-gray-200 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-gray-900">{reply.user.username}</span>
                              <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

