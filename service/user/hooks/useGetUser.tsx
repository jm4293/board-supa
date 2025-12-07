import { useQuery } from '@tanstack/react-query';
import { checkLoginAction } from '../action/check-login.action';

export const useGetUser = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ['user'],
        queryFn: () => checkLoginAction(),
    });

    return {
        data,
        isPending,
        error,
    };
};

