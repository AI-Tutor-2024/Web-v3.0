import axios from "axios";
import {
  NoteResponse,
  FolderInfo,
  CreateNoteRequest,
  DeleteNoteResponse,
} from "@/app/types/note";
import { baseURL } from "..";
import apiClient from "@/app/utils/api";

export const fetchNotes = async (folderId: number): Promise<NoteResponse> => {
  const response = await apiClient.get(
    `${baseURL}/api/v1/folders/${folderId}/notes`
  );

  return response.data;
};

export const createNote = async (
  folderId: number,
  noteData: CreateNoteRequest
): Promise<{ message: string }> => {
  const response = await apiClient.post(
    `/api/v1/professor/note/${folderId}`,
    noteData
  );
  return response.data;
};

export const fetchFolderInfo = async (
  folderId: number
): Promise<FolderInfo> => {
  const response = await apiClient.get(
    `${baseURL}/api/v1/professor/note/${folderId}/info`
  );
  return response.data;
};

export const deleteNote = async (
  folderId: number,
  noteId: number
): Promise<DeleteNoteResponse> => {
  const response = await apiClient.delete(
    `${baseURL}/api/v1/folders/${folderId}/notes/${noteId}`
  );
  return response.data;
};
