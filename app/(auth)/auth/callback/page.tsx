import KakaoLogin from "./KakaoLogin";

const AuthCallbackPage = async ({ searchParams }: { searchParams: Promise<{ code: string }> }) => {
    const { code } = await searchParams;

    return <KakaoLogin code={code} />;
};

export default AuthCallbackPage;    
