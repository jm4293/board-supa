
import BoardList from './BoardList';
import BoardWriteButton from './BoardWriteButton';

interface BoardPageProps {
  searchParams: Promise<{ page?: number }>;
}

export default async function BoardPage({ searchParams }: BoardPageProps) {
  const params = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">게시판</h1>
        </div>
        <BoardWriteButton />
      </div>
      <BoardList params={params} />
    </div>
  );
}
