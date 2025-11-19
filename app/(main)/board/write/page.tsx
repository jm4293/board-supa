import BoardWriteForm from './BoardWriteForm';

export default function BoardWritePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">게시글 작성</h1>
      </div>

      <BoardWriteForm />
    </div>
  );
}
