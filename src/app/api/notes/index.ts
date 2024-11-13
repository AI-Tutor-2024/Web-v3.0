import axios from 'axios';
import { NoteResponse, FolderInfo, CreateNoteRequest, DeleteNoteResponse } from '@/app/types/note';
import { baseURL } from '..';
import apiClient from '@/app/utils/api';

// 노트 목록 조회(GET)
export const fetchNotes = async (folderId: number): Promise<NoteResponse> => {
  const response = await apiClient.get(`/api/v1/professor/note/${folderId}`);
  return response.data;
};

// 새로운 노트 생성(POST)
export const createNote = async (folderId: number, noteData: CreateNoteRequest): Promise<{ message: string }> => {
  const response = await apiClient.post(`/api/v1/professor/note/${folderId}`, noteData);
  return response.data;
};

// 노트에 대한 폴더 정보 조회(GET)
export const fetchFolderInfo = async (folderId: number): Promise<FolderInfo> => {
  const response = await apiClient.get(`${baseURL}/api/v1/professor/note/${folderId}/info`);
  return response.data;
};

// 노트 삭제(DELETE)
export const deleteNote = async (noteId: number): Promise<DeleteNoteResponse> => {
  const response = await apiClient.delete(`${baseURL}/api/v1/professor/note/${noteId}`);
  return response.data;
};
