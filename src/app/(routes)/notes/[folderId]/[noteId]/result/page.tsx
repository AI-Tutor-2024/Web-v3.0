'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReviewQuestions from '@/app/components/organisms/ReviewQuestions';
import Info from '@/app/components/molecules/Info';
import { usePracticeContext } from '@/app/context/PracticeContext';
import {
  getPractice,
  PracticeItemResponse,
} from '@/app/api/practice/getPractice';
import toast from 'react-hot-toast';

const ResultPage = () => {
  const params = useParams<{ folderId: string; noteId: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState<
    PracticeItemResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { folderName, professor, setQuestions } = usePracticeContext();
  const noteId = Number(params.noteId);

  useEffect(() => {
    const fetchPractice = async () => {
      try {
        setIsLoading(true);
        const data = await getPractice(noteId);
        if (data && data.information) {
          setPracticeQuestions(data.information);
          setQuestions(data.information);
        } else {
          setPracticeQuestions([]);
          setQuestions([]);
          console.warn('API 응답에 information 필드가 없습니다.', data);
        }
      } catch (e) {
        toast.error('문제를 가져오는데 실패했어요.');
        setPracticeQuestions([]);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (noteId) fetchPractice();
  }, [noteId, setQuestions]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">문제를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4 pt-4">
        <Info folderName={folderName} professorName={professor} />
      </div>

      <div className="flex flex-col">
        {practiceQuestions && practiceQuestions.length > 0 ? (
          <ReviewQuestions noteId={Number(params.noteId)} />
        ) : (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="text-lg text-gray-500">등록된 문제가 없습니다.</div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResultPage;
