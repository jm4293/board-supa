import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createBoardAction, deleteBoardAction, uploadImageAction, updateBoardAction, deleteBoardCommentAction } from "../action";


export const useBoardMutation = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const createBoard = useMutation({
        mutationFn: (params: { title: string; content: string; image?: string | null }) => createBoardAction(params),
        onSuccess: (response) => {
            const { success, message, data } = response;
            if (!success) {
                alert(message);
                return;
            }

            if (data?.id) {
                router.push(`/board/${data.id}`);
            }
        },
        onError: (error) => {
            throw error;
        },
    });

    const updateBoard = useMutation({
        mutationFn: ({ boardId, formData }: { boardId: number; formData: FormData }) => updateBoardAction(boardId, formData),
        onSuccess: (response) => {
            const { success, message } = response;
            if (!success) {
                alert(message);
                return;
            }
        },
        onError: (error) => {
            throw error;
        },
    });

    const deleteBoard = useMutation({
        mutationFn: (boardId: number) => deleteBoardAction(boardId),
        onSuccess: (response) => {
            const { success, message } = response;
            if (!success) {
                alert(message);
                return;
            }
        },
    });

    const uploadImage = useMutation({
        mutationFn: (formData: FormData) => uploadImageAction(formData),
        onError: (error) => {
            throw error;
        },
    });

    const deleteBoardComment = useMutation({
        mutationFn: (commentId: number) => deleteBoardCommentAction(commentId),
        onSuccess: (response, commentId) => {
            const { success, message } = response;
            if (!success) {
                alert(message);
                return;
            }
            // 댓글 목록 새로고침을 위해 boardId를 찾아야 하는데, 현재는 commentId만 있음
            // 일단 모든 boardComments 쿼리를 invalidate
            queryClient.invalidateQueries({ queryKey: ['boardComments'] });
        },
        onError: (error) => {
            throw error;
        },
    });

    return {
        createBoard,
        deleteBoard,
        uploadImage,
        updateBoard,
        deleteBoardComment,
    }
}