import BoardWriteButton from './BoardWriteButton';

export default async function BoardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">게시판</h1>
        <BoardWriteButton />
      </div>

      {/* <BoardListClient initialBoards={boards} initialPagination={pagination} /> */}
    </div>
  );
}
