'use client';
import Link from 'next/link';

import { Button, Card, Input, SubmitButton } from '@/component/common';

import { useBoardMutation } from '@/service/board/hooks/useBoardMutation';
import { useGetBoardDetail } from '@/service/board/hooks/useGetBoardDetail';

interface BoardEditFormProps {
  boardId: number;
}

export default function BoardEditForm({ boardId }: BoardEditFormProps) {
  const { data: boardData } = useGetBoardDetail(boardId);
  const { updateBoard } = useBoardMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateBoard.mutate({ boardId, formData });
  };

  return (
    <Card shadow="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            name="title"
            type="text"
            label="제목"
            placeholder="제목을 입력하세요"
            defaultValue={boardData?.data?.title ?? ''}
            fullWidth
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <textarea
            name="content"
            rows={15}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="내용을 입력하세요"
            defaultValue={boardData?.data?.content ?? ''}
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Link href={`/board/${boardId}`}>
            <Button type="button" variant="outline">
              취소
            </Button>
          </Link>
          <SubmitButton>수정하기</SubmitButton>
        </div>
      </form>
    </Card>
  );
}

