import { PatchFolderProps, PostFolderProps } from "@/app/types/folder";
import { baseURL } from "..";

import apiClient from "@/app/utils/api";

export const createFolder = async ({
  folderName,
  professorName,
}: PostFolderProps) => {
  const response = await apiClient.post(`${baseURL}/api/v1/folders`, {
    folderName,
    professorName,
  });

  return response.data;
};

export const updateFolder = async ({
  folderId,
  folderName,
  professorName,
}: PatchFolderProps) => {
  const response = await apiClient.patch(
    `${baseURL}/api/v1/folders/${folderId}`,
    {
      folderName,
      professorName,
    }
  );

  return response.data;
};

export const deleteFolder = async (folderId: number) => {
  const response = await apiClient.delete(
    `${baseURL}/api/v1/folders/${folderId}`
  );

  return response.data;
};

export const fetchFolderName = async () => {
  const response = await apiClient.get(`${baseURL}/api/v1/folders/names`);
  return response.data;
};

export const getFolders = async () => {
  const response = await apiClient.get(`${baseURL}/api/v1/folders`);
  return response.data.information;
};
