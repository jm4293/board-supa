import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { deleteBoardCommentAction } from '../action';

export const useBoardCommentMutation = (boardId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteBoardComment = useMutation({
    mutationFn: (commentId: number) => deleteBoardCommentAction(commentId),
    onSuccess: (response) => {
      const { success, message } = response;
      if (!success) {
        alert(message);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['boardComments', boardId] });
      router.refresh();
    },
    onError: (error) => {
      throw error;
    },
  });
  return {
    deleteBoardComment,
  };
};
