import axios from 'axios';
import {
  NoteResponse,
  FolderInfo,
  CreateNoteRequest,
  DeleteNoteResponse,
} from '@/app/types/note';
import { baseURL } from '..';
import apiClient from '@/app/utils/api';

export const fetchNotes = async (folderId: number): Promise<NoteResponse> => {
  const response = await apiClient.get(
    `${baseURL}/api/v1/folders/${folderId}/notes`
  );

  return response.data;
};

//새 노트 만들기
export const createNote = async (
  folderId: number,
  noteData: CreateNoteRequest
): Promise<{ message: string }> => {
  const response = await apiClient.post(
    `/api/v1/folders/${folderId}/notes`,
    noteData
  );
  return response.data;
};

//STT가 없음..
export const createSTT = async (
  folderId: number,
  noteId: number,
  file: File
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file); // Swagger에서 요구한 key: file

  try {
    const response = await apiClient.post(
      `/api/v1/folders/${folderId}/notes/${noteId}/stt`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('STT 생성 실패:', error);
    throw error;
  }
};

export const createNoteSTT = async (
  folderId: number,
  noteId: number,
  keywords: string | null,
  requirement: string | null
): Promise<any> => {
  console.log('🟡 createNoteSTT 시작');
  console.log('📨 요청 인자:', { folderId, noteId, keywords, requirement });

  try {
    const res = await apiClient.post(
      `/api/v1/folders/${folderId}/notes/${noteId}/summaries`,
      {}, // body 없음
      {
        params: {
          ...(keywords && { keywords }),
          ...(requirement && { requirement }),
        },
      }
    );

    console.log('✅ createNoteSTT 응답:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ createNoteSTT 요청 실패');

    if (error instanceof Error && (error as any).response) {
      const axiosError = error as any;
      console.error('응답 데이터:', axiosError.response.data);
      console.error('응답 상태 코드:', axiosError.response.status);
    } else {
      console.error('일반 에러:', error);
    }

    throw error;
  } finally {
    console.log('🔚 createNoteSTT 종료');
  }
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
