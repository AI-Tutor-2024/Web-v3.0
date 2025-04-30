import { useQuery } from "@tanstack/react-query";
import { getFolders } from "@/app/api/folders";
import { FolderListData } from "@/app/types/folder";

export const useFetchFolders = (options?: { enabled?: boolean }) => {
  return useQuery<FolderListData[]>({
    queryKey: ["folders"],
    queryFn: getFolders,
  });
};
