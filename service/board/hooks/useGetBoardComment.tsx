import { useQuery } from "@tanstack/react-query";
import { getBoardCommentAction } from "../action";

const useGetBoardComment = (boardId: number) => {
    const result = useQuery({
        queryKey: ['boardComments', boardId],
        queryFn: () => getBoardCommentAction(boardId),
    });

    return result;
};

export default useGetBoardComment;