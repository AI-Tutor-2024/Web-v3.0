import apiClient from '@/app/utils/api';
import toast from 'react-hot-toast';
interface CreatePracticeReq {
  practiceSize: number;
  type: string; // 문제의 유형 (예: "OX")
  keywords: string; // 키워드 (예: "네트워크 강의 OSI")
  requirement: string; // 요약에 필요한 요구사항 (예: "요약에 필요한 요구사항")
}

interface PostSummaryProps {
  file: File; // 전송할 파일
  request: CreatePracticeReq; // `CreatePracticeReq` 형식의 JSON 데이터
  noteId: number; // 동적으로 noteId를 받아오도록 추가
}

export const postSummary = async ({ file, request }: PostSummaryProps) => {
  const formData = new FormData();

  formData.append('file', file);

  formData.append(
    'createPracticeReq',
    new Blob([JSON.stringify(request)], {
      type: 'application/json',
    })
  );

  try {
    const response = await apiClient.post(
      `/api/v1/professor/practice`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    toast.error('업로드 도중 오류가 발생했습니다.');
    throw error;
  }
};
