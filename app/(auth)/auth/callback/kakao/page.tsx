import KakaoLogin from './KakaoLogin';

export default async function KakaoLoginPage({ searchParams }: { searchParams: Promise<{ code: string }> }) {
  const { code } = await searchParams;

  return <KakaoLogin code={code} />;
}
