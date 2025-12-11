'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { Button, Card, Input, SubmitButton } from '@/component/common';

import { useBoardMutation } from '@/service/board/hooks/useBoardMutation';
import { useGetBoardDetail } from '@/service/board/hooks/useGetBoardDetail';

import { IMAGE_STORAGE_PATH } from '@/share/const';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface BoardEditFormProps {
  boardId: number;
}

const formSchema = z.object({
  title: z.string().min(1, '제목은 최소 1자 이상이어야 합니다.').max(255, '제목은 최대 255자 이하여야 합니다.'),
  content: z.string().min(1, '내용은 최소 1자 이상이어야 합니다.'),
  image: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export default function BoardEditForm({ boardId }: BoardEditFormProps) {
  const { data: boardData } = useGetBoardDetail(boardId);
  const { updateBoard, uploadImage } = useBoardMutation();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(boardData?.data?.boardImage?.[0]?.imageUrl ?? null);
  const formData = new FormData();

  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = () => {
    formData.append('title', getValues('title'));
    formData.append('content', getValues('content'));
    if (image) {
      formData.append('image', image);
    }
    updateBoard.mutate({ boardId, formData: formData });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    formData.append('image', file);

    const response = await uploadImage.mutateAsync(formData);
    if (response.success && response.data) {
      setImage(`${IMAGE_STORAGE_PATH}/${response.data.fullPath}`);
    } else {
      alert(response.message || '이미지 업로드에 실패했습니다.');
      setImage(null);
    }
  };
  const handleImageBtnClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  return (
    <Card shadow="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            type="text"
            label="제목"
            placeholder="제목을 입력하세요"
            defaultValue={boardData?.data?.title ?? ''}
            fullWidth
            required
            {...register('title')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <textarea
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="내용을 입력하세요"
            defaultValue={boardData?.data?.content ?? ''}
            required
            {...register('content')}
          />
          <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <button type="button" onClick={handleImageBtnClick} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            이미지 업로드
          </button>
          <p>이미지</p>
          {image && <img src={image} alt="게시글 이미지" width={100} height={100} />}
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
