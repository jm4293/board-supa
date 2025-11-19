import Link from 'next/link';

import { Button, Card, Input, SubmitButton } from '@/component/common';

import { createBoard } from './actions';

export default function BoardWriteForm() {
  return (
    <Card shadow="lg">
      <form action={createBoard} className="space-y-6">
        <div>
          <Input name="title" type="text" label="제목" placeholder="제목을 입력하세요" fullWidth required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <textarea
            name="content"
            rows={15}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="내용을 입력하세요"
            required
          />
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
