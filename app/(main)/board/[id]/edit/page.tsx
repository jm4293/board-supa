import { redirect } from 'next/navigation';


import BoardEditForm from './BoardEditForm';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function BoardEditPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const boardId = parseInt(resolvedParams.id);

  if (isNaN(boardId)) {
    redirect('/board');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">게시글 수정</h1>
      </div>

      <BoardEditForm boardId={boardId} />
    </div>
  );
}
