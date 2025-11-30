'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Card, Input, SubmitButton } from '@/component/common';

import { useBoardMutation } from '@/service/board/mutation';

import { IMAGE_STORAGE_PATH } from '@/share/const';

const formSchema = z.object({
  title: z.string().min(1, '제목은 최소 1자 이상이어야 합니다.').max(255, '제목은 최대 255자 이하여야 합니다.'),
  content: z.string().min(1, '내용은 최소 1자 이상이어야 합니다.'),
});

export default function BoardWriteForm() {
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const imageRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);

  const { uploadImage, createBoard } = useBoardMutation();

  const handleImageButtonClick = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await uploadImage.mutateAsync(formData);

    if (!response.success) {
      alert(response.message);
      return;
    }

    const { fullPath } = response.data!;

    setImage(`${IMAGE_STORAGE_PATH}/${fullPath}`);

    imageRef.current!.value = '';
  };

  const onSubmit = () => {
    createBoard.mutate({ ...getValues(), image: image });
  };

  return (
    <Card shadow="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input type="text" label="제목" placeholder="제목을 입력하세요" fullWidth {...register('title')} />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <textarea
            rows={15}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="내용을 입력하세요"
            {...register('content')}
          />
          {errors.content && <p className="text-red-500">{errors.content.message}</p>}
        </div>

        <div>
          <input ref={imageRef} type="file" onChange={handleImageChange} className="hidden" />
          <Button type="button" onClick={handleImageButtonClick}>
            이미지 선택
          </Button>
          {image && <Image src={image} alt="이미지 미리보기" width={100} height={100} />}
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/board">
            <Button type="button" variant="outline">
              취소
            </Button>
          </Link>
          <SubmitButton>작성하기</SubmitButton>
        </div>
      </form>
    </Card>
  );
}
