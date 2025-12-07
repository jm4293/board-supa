import { useQuery } from "@tanstack/react-query";
import { getBoardListAction, GetBoardListActionParams } from "../action";

export const useGetBoardList = (params: GetBoardListActionParams) => {
    const { data, isPending, error } = useQuery({
        queryKey: ['boardList'],
        queryFn: () => getBoardListAction(params),
    });

    return {
        data,
        isPending,
        error,
    };
};