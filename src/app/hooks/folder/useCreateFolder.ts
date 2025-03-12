import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "@/app/api/folders";
import toast from "react-hot-toast";

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.error("폴더가 생성되었습니다");
    },
    onError: () => {
      toast.error("폴더 생성을 실패하였습니다 ");
    },
  });
};
