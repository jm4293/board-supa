import Link from 'next/link';

import { getUserInfoAction } from '@/service/user';

import Button from '../../component/common/Button';
import HeaderLink from './HeaderLink';
import LogoutButton from './LogoutButton';

interface UserInfo {
  userId: number;
  username: string;
  email: string;
}

export default async function Header() {
  // const router = useRouter();
  // const pathname = usePathname();
  // const [user, setUser] = useState<UserInfo | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // const checkAuth = async () => {
  //   try {
  //     const response = await fetch('/api/auth/me');
  //     const data = await response.json();

  //     if (data.success && data.data) {
  //       setUser(data.data);
  //     }
  //   } catch {
  //     // Error handling
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const { data, success } = await getUserInfoAction();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/home" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              Study Board
            </Link>
            <HeaderLink />
          </div>

          <div className="flex items-center space-x-4">
            {success ? (
              <>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{data?.nickname}</span>님 환영합니다
                </span>
                <LogoutButton />
              </>
            ) : (
              <Link href="/auth/login">
                <Button variant="primary" size="sm">
                  로그인
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
