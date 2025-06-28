// api/practiceApi.ts

import { PracticeRequest } from '@/app/types/practice';
import apiClient from '@/app/utils/api';

// 함수 정의
export default async function savePracticeQuestions(
  noteId: number,
  questions: PracticeRequest[]
) {
  try {
    const response = await apiClient.post(
      `/api/v1/professor/practice/${noteId}`,
      questions,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error saving practice questions:', error);
    throw error;
  }
}
