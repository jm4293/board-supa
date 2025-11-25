import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { LoginUserActionParams, RegisterUserActionParams, loginUserAction, registerUserAction } from '../action';

export const useUserMutation = () => {
  const router = useRouter();

  const loginUser = useMutation({
    mutationFn: (params: LoginUserActionParams) => loginUserAction(params),
    onSuccess: (response) => {
      const { success, message } = response;

      if (!success) {
        alert(message);
        return;
      }

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

  return {
    loginUser,
    registerUser,
  };
};
