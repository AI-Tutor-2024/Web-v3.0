// app/api/practice/fetchPractice.ts

import axios from 'axios';
import { baseURL } from '..';
import apiClient from '@/app/utils/api';
import toast from 'react-hot-toast';
interface FetchPracticeResponse {
  information: {
    practiceId: number;
    practiceNumber: number;
    content: string;
    result: string;
    additionalResults: string | null;
    solution: string;
    practiceType: 'OX' | 'SHORT';
  }[];
}

export const fetchPractice = async (
  noteId: number
): Promise<FetchPracticeResponse> => {
  try {
    const response = await apiClient.get(
      `/api/v1/professor/practice/${noteId}`
    );

    return response.data;
  } catch (error) {
    toast.error('폴더 불러오는데 실패했어요.');
    throw error;
  }
};
