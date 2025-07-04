import apiClient from '@/app/utils/api';
import toast from 'react-hot-toast';

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
    toast.error('요약본을 불러오는데 실패했어요.');
    throw error;
  }
};
