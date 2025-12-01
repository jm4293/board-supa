'use client';

import { Button } from '@/component/common';

import { useBoardMutation } from '@/service/board/mutation';

export default function BoardDelete({ id }: { id: number }) {
  const { deleteBoard } = useBoardMutation();

  const handleDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteBoard.mutate(id);
    }
  };

  return <Button onClick={handleDelete}>게시글 삭제</Button>;
}
