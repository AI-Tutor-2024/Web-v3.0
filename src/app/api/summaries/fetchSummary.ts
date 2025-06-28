import axios from 'axios';
import { baseURL } from '..';
import apiClient from '@/app/utils/api';

interface FetchSummaryRequest {
  folderId: number;
  noteId: number;
}

export const fetchSummary = async ({
  folderId,
  noteId,
}: FetchSummaryRequest) => {
  try {
    const response = await apiClient.get(
      `/api/v1/folders/${folderId}/notes/${noteId}/summaries`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error('Error at fetching Summary ');
    throw error;
  }
};
