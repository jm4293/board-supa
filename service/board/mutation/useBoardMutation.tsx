'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { CreateBoardActionParams, createBoardAction, uploadImageAction } from '../action';

export const useBoardMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const uploadImage = useMutation({
    mutationFn: (formData: FormData) => uploadImageAction(formData),
  });

  const createBoard = useMutation({
    mutationFn: (dto: CreateBoardActionParams) => createBoardAction(dto),
    onSuccess: (response) => {
      const { success, message } = response;

      if (!success) {
        alert(message);
        return;
      }

      alert('게시글이 생성되었습니다.');
      router.push('/board');
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: (error) => {
      throw error;
    },
  });

  return {
    uploadImage,
    createBoard,
  };
};
