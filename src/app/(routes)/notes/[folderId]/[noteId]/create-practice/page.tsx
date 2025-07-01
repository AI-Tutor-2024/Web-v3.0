'use client';

import React, { useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePracticeContext } from '@/app/context/PracticeContext';
import NewPracticeForm from '@/app/components/organisms/NewPracticeForm';
import Button from '@/app/components/atoms/Button';
import { createPractice } from '@/app/api/practice/createPractice';
import Loader from '@/app/components/utils/Loader';
import { createSTT } from '@/app/api/notes';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface CreatePracticeApiResponse {
  check: boolean;
  information: {
    practiceResList: Array<{
      practiceNumber: number;
      content: string;
      result: string;
      solution: string;
      practiceType: string;
    }>;
    summary: string;
  };
}

const CreatePracticePage = () => {
  const router = useRouter();
  const { folderId, noteId } = useParams();
  const {
    file,
    keywords,
    requirement,
    practiceSize,
    type,
    setType,
    setQuestions,
    setSummary,
  } = usePracticeContext();

  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasRunSTTRef = useRef(false);

  const handleCreatePractice = async () => {
    if (!noteId || !file || file.size === 0) {
      toast.error('파일이 업로드되지 않았습니다. 파일을 선택해주세요.');
      return;
    }

    if (!type) {
      toast.error('문제 유형을 최소 하나 선택해야 합니다.');
      return;
    }

    try {
      setIsLoading(true);

      if (!hasRunSTTRef.current) {
        hasRunSTTRef.current = true;
        await createSTT(Number(folderId), Number(noteId), file);
      }

      const createPayload = {
        noteId: Number(noteId),
        createPracticeReq: {
          practiceSize: practiceSize || undefined,
          type,
          keywords,
          requirement,
        },
      };

      const createRes: CreatePracticeApiResponse = await createPractice(
        createPayload
      );

      toast.success('문제 생성이 완료되었습니다.');
      setQuestions(createRes.information.practiceResList);
      setSummary(createRes.information.summary);

      router.push(`/notes/${folderId}/${noteId}/result`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `API 에러: ${
            error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'
          }`
        );
      } else {
        toast.error(
          `오류 발생: ${
            error instanceof Error
              ? error.message
              : '알 수 없는 오류가 발생했습니다.'
          }`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader
            message="요약문을 기반으로 퀴즈를 생성 중이에요."
            subMessage="약 1분 정도 소요돼요, 잠시만 기다려 주세요!"
          />
        </div>
      )}
      <div className="flex flex-col justify-between h-full p-8">
        <div className="flex flex-row w-full justify-between items-center pb-8">
          <div className="flex flex-col justify-start gap-2">
            <p className="text-white text-2xl font-bold">새로운 수업</p>
            <p className="text-white text-sm font-normal">
              복습 문제 옵션을 선택하세요
            </p>
          </div>
          <Button
            label="만들기"
            variant="next"
            disabled={!isFormValid || isLoading}
            onClick={handleCreatePractice}
          />
        </div>

        <NewPracticeForm onFormValidChange={setIsFormValid} />
      </div>
    </>
  );
};

export default CreatePracticePage;
