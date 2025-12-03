'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Card, Input, SubmitButton } from '@/component/common';

import { useBoardMutation } from '@/service/board/mutation';

const formSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(255, '제목은 최대 255자 이하여야 합니다'),
  content: z.string().min(1, '내용을 입력해주세요'),
});

type FormValues = z.infer<typeof formSchema>;

export default function BoardWriteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { createBoard } = useBoardMutation();

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);

    createBoard.mutate(formData);
  };

  return (
    <Card shadow="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            type="text"
            label="제목"
            placeholder="제목을 입력하세요"
            fullWidth
            error={errors.title?.message}
            {...register('title')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <textarea
            rows={15}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="내용을 입력하세요"
            {...register('content')}
          />
          {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/board">
            <Button type="button" variant="outline">
              취소
            </Button>
          </Link>
          <SubmitButton disabled={createBoard.isPending}>작성하기</SubmitButton>
        </div>
      </form>
    </Card>
  );
}
