import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { loginUserAction, registerUserAction } from '../action';

export const useUserMutation = () => {
  const router = useRouter();

  const loginUser = useMutation({
    mutationFn: (formData: FormData) => loginUserAction(formData),
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
    mutationFn: (formData: FormData) => registerUserAction(formData),
    onSuccess: (_, variables) => {
      const email = variables.get('email') as string;

      alert('회원가입이 완료되었습니다.');
      router.push(`/auth/login?email=${email}`);
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
