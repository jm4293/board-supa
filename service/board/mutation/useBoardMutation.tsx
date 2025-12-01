'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import {
  CreateBoardActionParams,
  ModifyBoardActionParams,
  createBoardAction,
  deleteBoardAction,
  modifyBoardAction,
  uploadImageAction,
} from '../action';

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

  const modifyBoard = useMutation({
    mutationFn: (dto: ModifyBoardActionParams) => modifyBoardAction(dto),
    onSuccess: async (response, variables) => {
      const { success, message } = response;

      if (!success) {
        alert(message);
        return;
      }

      alert('게시글이 수정되었습니다.');
      await queryClient.invalidateQueries({ queryKey: ['boards'] });
      await queryClient.invalidateQueries({ queryKey: ['board', variables.id] });

      router.push(`/board/${variables.id}`);
    },
    onError: (error) => {
      throw error;
    },
  });

  const deleteBoard = useMutation({
    mutationFn: (id: number) => deleteBoardAction({ id }),
    onSuccess: async (response) => {
      const { success, message } = response;

      if (!success) {
        alert(message);
        return;
      }

      alert('게시글이 삭제되었습니다.');
      await queryClient.invalidateQueries({ queryKey: ['boards'] });
      router.push('/board');
    },
    onError: (error) => {
      throw error;
    },
  });

  return {
    uploadImage,
    createBoard,
    modifyBoard,
    deleteBoard,
  };
};
