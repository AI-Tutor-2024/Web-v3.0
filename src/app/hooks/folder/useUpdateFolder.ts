import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFolder } from "@/app/api/folders";
import toast from "react-hot-toast";

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("폴더 수정을 성공하였습니다");
    },
    onError: () => {
      toast.error("폴더 수정을 실패하였습니다");
    },
  });
};
