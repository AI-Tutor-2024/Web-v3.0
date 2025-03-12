import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFolder } from "@/app/api/folders";
import toast from "react-hot-toast";

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("폴더 삭제를 성공하였습니다");
    },
    onError: () => {
      toast.error("폴더 삭제를 실패하였습니다");
    },
  });
};
