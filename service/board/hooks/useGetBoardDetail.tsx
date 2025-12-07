import { useQuery } from "@tanstack/react-query";
import { getBoardDetailAction } from "../action";

export const useGetBoardDetail = (boardId: number) => {
    const { data, isPending, error } = useQuery({
        queryKey: ['boardDetail'],
        queryFn: () => getBoardDetailAction(boardId),
    });

    return {
        data,
        isPending,
        error,
    };
};