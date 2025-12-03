import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createBoardAction, GetBoardListActionParams, getBoardListAction, deleteBoardAction, getBoardDetailAction, uploadImageAction } from "../action";


export const useBoardMutation = () => {
    const router = useRouter();

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

    const getBoardList = useMutation({
        mutationFn: (params: GetBoardListActionParams) => getBoardListAction(params),
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
    const getBoardDetail = useMutation({
        mutationFn: (boardId: number) => getBoardDetailAction(boardId),
        onSuccess: (response) => {
            const { success, message, data } = response;
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

    return {
        createBoard,
        getBoardList,
        getBoardDetail,
        deleteBoard,
        uploadImage,
    }
}