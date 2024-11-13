  import axios from 'axios';
  import { baseURL } from '..';
import apiClient from '@/app/utils/api';

  interface CreatePracticeRequest {
    noteId: number;
    createPracticeReq: {
      practiceSize?: number;
      type: string;
      keywords?: string;
      requirement?: string;
    };
    file: File;
  }

  // 문제 생성 함수
  export const createPractice = async ({
    noteId,
    createPracticeReq,
    file,
  }: CreatePracticeRequest) => {
    try {
      // FormData 생성
      const formData = new FormData();

      // createPracticeReq 객체를 JSON으로 변환하고 FormData에 추가
      formData.append(
        'createPracticeReq',
        new Blob([JSON.stringify(createPracticeReq)], { type: 'application/json' })
      );

      // 파일을 FormData에 추가
      formData.append('file', file);

      // API 호출 (multipart/form-data로 전송)
      const response = await apiClient.post(
        `/api/v1/professor/practice/${noteId}/new`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // API 응답 출력 (디버깅용)
      console.log('API 응답:', response.data);

      return response.data; 
    } catch (error) {
      console.error('문제 생성 실패:', error);
      throw error;
    }
  };
