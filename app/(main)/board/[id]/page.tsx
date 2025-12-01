import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/component/common';

import { getBoardDetailAction } from '@/service/board/action';
import { getUserInfoAction } from '@/service/user';

import BoardDelete from './BoardDelete';

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: userInfo } = await getUserInfoAction();
  const { data, success } = await getBoardDetailAction({ id });

  if (!success) {
    redirect('/board');
  }

  if (!data) {
    redirect('/board');
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{data?.title}</h1>
        <p className="text-gray-700 mb-4">{data?.content}</p>

        {data?.boardImage.length > 0 && (
          <Image src={data?.boardImage?.[0]?.imageUrl} alt={data?.title} width={500} height={500} />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between">
        <Link href="/board">
          <Button variant="outline" size="sm">
            목록
          </Button>
        </Link>

        {!!userInfo && userInfo?.userAccountId === data?.userAccountId && (
          <div className="flex space-x-4">
            <Link href={`/board/${id}/edit`}>
              <Button variant="outline" size="sm">
                수정
              </Button>
            </Link>
            <BoardDelete id={data.id} />
          </div>
        )}
      </div>
    </>
  );
}
