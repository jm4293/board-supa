import dayjs from 'dayjs';
import Link from 'next/link';

import { BoardModel } from '@/service/board/model';

export default function BoardList({ boardList }: { boardList: BoardModel[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
        {boardList.map((board) => (
          <tr key={board.id} className="group hover:bg-blue-50 transition-colors">
            <td>
              <Link href={`/board/${board.id}`} className="block">
                {board.id}
              </Link>
            </td>
            <td>
              <Link href={`/board/${board.id}`} className="block">
                {board.title}
              </Link>
            </td>
            <td>
              <Link href={`/board/${board.id}`} className="block">
                {board.userAccount.user.nickname}
              </Link>
            </td>
            <td>
              <Link href={`/board/${board.id}`} className="block">
                {board.createdAt ? dayjs(board.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
