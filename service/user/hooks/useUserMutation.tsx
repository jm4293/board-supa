import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { LoginUserActionParams, RegisterUserActionParams, loginUserAction, logoutUserAction, registerUserAction, requestKakaoTokenAction } from '../action';

export const useUserMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginUser = useMutation({
    mutationFn: (params: LoginUserActionParams) => loginUserAction(params),
    onSuccess: (response) => {
      const { success, message } = response;

      if (!success) {
        alert(message);
        return;
      }

      // 사용자 정보 쿼리 캐시 무효화하여 로그인 상태 반영
      queryClient.invalidateQueries({ queryKey: ['user'] });
      alert('로그인이 완료되었습니다.');

      router.push(`/home`);
    },
    onError: (error) => {
      throw error;
    },
  });

  const registerUser = useMutation({
    mutationFn: (params: RegisterUserActionParams) => registerUserAction(params),
    onSuccess: (response) => {
      const { success, message, data } = response;

      if (!success) {
        alert(message);
        return;
      }

      alert('회원가입이 완료되었습니다.');
      router.push(`/auth/login?email=${data?.userAccount?.email}`);
    },
    onError: (error) => {
      throw error;
    },
  });
  /* eslint-disable no-console */
  const requestKakaoToken = useMutation({
    mutationFn: (code: string) => requestKakaoTokenAction(code),
    onSuccess: (response) => {
      const { success, message } = response;

      if (!success) {
        alert(message || '카카오 토큰 요청에 실패했습니다.');
        return;
      }

      // 사용자 정보 쿼리 캐시 무효화하여 로그인 상태 반영
      queryClient.invalidateQueries({ queryKey: ['user'] });
      alert('카카오 로그인이 완료되었습니다.');
      router.push('/home');
    },
    onError: (error) => {
      console.error('카카오 토큰 요청 에러:', error);
      alert('카카오 로그인 중 오류가 발생했습니다.');
    },
  });

  const logoutUser = useMutation({
    mutationFn: () => logoutUserAction(),
    onSuccess: (response) => {
      const { success, message } = response;

      if (!success) {
        alert(message);
        return;
      }

      // 사용자 정보 쿼리 캐시 무효화하여 로그인 버튼으로 변경
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.refresh();
    },
    onError: (error) => {
      throw error;
    },
  });
  return {
    loginUser,
    registerUser,
    requestKakaoToken,
    logoutUser,
  };

};
