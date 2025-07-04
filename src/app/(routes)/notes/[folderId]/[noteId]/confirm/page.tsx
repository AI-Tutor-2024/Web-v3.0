'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Button from '@/app/components/atoms/Button';
import TextInputSection from '@/app/components/atoms/TextInputSection';
import Loader, { SmallLoader } from '@/app/components/utils/Loader';

import { createSTT, summaryNote } from '@/app/api/notes';
import { usePracticeContext } from '@/app/context/PracticeContext';

const ConfirmNotePage = () => {
  const {
    file,
    keywords,
    requirement,
    setKeywords,
    setRequirement,
    sttLoading,
    setSttLoading,
  } = usePracticeContext();

  const [summaryLoading, setSummaryLoading] = useState(false);
  const hasRunRef = useRef(false);
  const { folderId, noteId } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!file || !folderId || !noteId) return;
    if (hasRunRef.current) return;

    const runSTT = async () => {
      try {
        hasRunRef.current = true;
        setSttLoading(true);
        await createSTT(Number(folderId), Number(noteId), file);
      } catch (err) {
        toast.error('STT 생성 중 오류가 발생했습니다.');
      } finally {
        setSttLoading(false);
      }
    };

    runSTT();
  }, [file, folderId, noteId, setSttLoading]);

  const handleNoteFinalBtn = async () => {
    if (sttLoading || summaryLoading) return;

    if (!keywords || !requirement) {
      toast.error('키워드와 요구사항을 모두 입력해주세요.');
      return;
    }

    try {
      setSummaryLoading(true);
      await summaryNote(
        Number(folderId),
        Number(noteId),
        keywords,
        requirement
      );
      router.push(`/notes/${folderId}/${noteId}/summary`);
    } catch (err) {
      toast.error('요약문 생성 중 오류가 발생했습니다.');
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <>
      {summaryLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader
            message="요약문을 생성 중입니다."
            subMessage="잠시만 기다려주세요. 1분 정도 소요됩니다."
          />
        </div>
      )}

      <div>
        <div className="flex flex-row items-center p-8 justify-between">
          <div className="flex flex-col justify-center items-center text-center text-white h-full">
            <div className="flex flex-col items-start">
              <p className="text-xl mb-2 font-semibold">새로운 수업</p>
              <p className="text-base text-white">
                강의 녹화 파일을 업로드하면 복습 문제 생성이 가능해요
              </p>
            </div>
          </div>
          <Button
            label="다음"
            variant="next"
            onClick={handleNoteFinalBtn}
            disabled={sttLoading || summaryLoading}
          />
        </div>

        <div className="flex w-full flex-row justify-start px-2">
          <TextInputSection
            onKeywordChange={setKeywords}
            onRequirementChange={setRequirement}
          />
          <hr className="border-t-[0.5px] border-black-80 my-4" />
          <div className="flex flex-col items-start font-semibold gap-2 w-2/5 pt-8 px-4 border-l border-black-80">
            <p className="text-white">강의 파일</p>
            <p className="text-black-60 font-normal">
              * 파일 업로드 중에 다른 페이지로 이동하면 입력한 내용이 모두
              사라져요!
            </p>
            <p
              className={`text-base border-[0.5px] py-3 px-4 w-full border-black-80 rounded-md p-2 text-black-70 flex font-semibold gap-4 transition-colors duration-300 ${
                !sttLoading && file ? 'bg-primary/10' : ''
              }`}
            >
              <Image
                src="/active_folder.svg"
                alt="active_folder"
                width={40}
                height={40}
              />
              <div className="flex flex-col gap-1 whitespace-nowrap">
                <div className="text-white flex items-center gap-2">
                  {file?.name && (
                    <>
                      {file.name.slice(0, 15)}
                      {file.name.length > 15 && '...'}
                    </>
                  )}
                  {sttLoading && <SmallLoader />}
                </div>
              </div>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmNotePage;
