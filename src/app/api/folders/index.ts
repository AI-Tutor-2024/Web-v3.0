// folderApi.ts
import {
  FolderListData,
  FolderListResponse,
  PatchFolderProps,
  PostFolderProps,
} from "@/app/types/folder";
import { baseURL } from "..";
import axios from "axios";
import apiClient from "@/app/utils/api";

// 폴더 목록 가져오기
export const getFolders = async (): Promise<FolderListData[]> => {
  const response = await apiClient.get(`api/v1/folder/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    console.log(response);
    throw new Error("Failed to fetch folders");
  }

  const data: FolderListResponse = response.data;
  return data.information; // `information` 배열만 반환
};

// 폴더 생성
export const createFolder = async ({
  folderName,
  professorName,
}: PostFolderProps) => {
  const response = await apiClient.post(
    `api/v1/folder/`,
    {
      folderName,
      professorName,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status !== 201) {
    throw new Error("Failed to create folder");
  }

  return response.data;
};

// 폴더 수정
export const updateFolder = async ({
  folderId,
  folderName,
  professorName,
}: PatchFolderProps) => {
  const response = await apiClient.patch(
    `/api/v1/folder/${folderId}`,
    {
      folderName,
      professorName,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to update folder");
  }

  return response.data;
};

// 폴더 삭제
export const deleteFolder = async (folderId: number) => {
  const response = await apiClient.delete(`/api/v1/folder/${folderId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to delete folder");
  }

  return response.data;
};
