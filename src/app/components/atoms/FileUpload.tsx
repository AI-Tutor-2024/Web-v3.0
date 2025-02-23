import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Icon from "./Icon"; // 아이콘 컴포넌트 import
import useFileDuration from "@/app/hooks/useFileDuration";
import Button from "./Button";

interface FileUploadProps {
  noteId?: number;
  onUploadSuccess: (file: File | null) => void;
  onUploadError: (error: any) => void;
  label: string;
  description?: string;
  labelClassName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  noteId,
  onUploadSuccess,
  onUploadError,
  label,
  description,
  labelClassName,
}) => {
  const [
    file, setFile] = useState<File | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const duration = useFileDuration(file); // 파일 재생 시간 가져오기

  // 파일 선택 처리
  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setIsUploading(true);
    setProgress(0);

    // 업로드 진행을 자연스럽게 만들기 위한 setTimeout 사용
    const uploadSimulation = (currentProgress: number) => {
      if (currentProgress < 100) {
        const nextProgress = Math.min(100, currentProgress + Math.floor(Math.random() * 10 + 5)); // 5~15% 증가
        setProgress(nextProgress);

        setTimeout(() => uploadSimulation(nextProgress), Math.random() * 300 + 200); // 200~500ms 사이 랜덤 대기
      } else {
        setIsUploading(false);
        onUploadSuccess(selectedFile);
      }
    };

    uploadSimulation(0);
  };

  // 파일 삭제 처리
  const removeFile = (event: React.MouseEvent) => {
    event.stopPropagation();
    setFile(null);
    setProgress(0);
    setIsUploading(false);
    onUploadSuccess(null);
  };

  // Dropzone 설정
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".m4a", ".mp3", ".wav"],
      "video/*": [".mp4"],
    },
    maxFiles: 1,
    noClick: false,
  });

  return (
    <div className="mb-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <div className={`text-mainWhite text-base flex-shrink-0 ${labelClassName}`}>{label}</div>
          <div className="flex flex-col">
          <div
            {...getRootProps()}
            className="flex flex-col justify-start w-[730px] h-32 rounded-md p-5 cursor-pointer bg-[#252424] text-gray-400 hover:text-gray-500 hover:bg-bgDeepGray"
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex flex-row">
                {/* 프로그레스 바 및 업로드 상태 표시 */}
                <div className="flex items-center gap-2">
                  {isUploading ? (
                    <>
                      {/* 원형 로딩 애니메이션 */}
                      <div className="w-4 h-4 animate-spin border-2 border-primary border-t-transparent rounded-full"></div>
                      {/* 업로드 진행률 표시 */}
                      <p className="text-sm text-green-400 font-medium">{progress}%</p>
                    </>
                  ) : null}
                  <p className="text-base text-white font-normal">
                    {file.name} {duration !== null && `(${duration}분)`}
                  </p>
                </div>

                {/* 파일 삭제 버튼 */}
                <button
                  onClick={removeFile}
                  className="ml-3"
                  disabled={isUploading}
                >
                  <Icon label="ic_delete" size={12} />
                </button>
              </div>
            ) : (
              // 파일이 없을 때 기본 UI
              <div className="flex flex-col text-start items-start justify-start">
                <div className="flex items-center gap-2">
                  <p className="text-base text-black-60">
                    파일 첨부를 클릭하거나 파일을 마우스로 끌어 오세요
                  </p>
                </div>
                <p className="text-base text-black-60 mt-1">
                  (파일 크기: 최대 120분, 지원 형식: m4a, mp3, wav)
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <label className="cursor-pointer">
              <Button label="파일 선택" imgSrc="ic_file" variant="create" iconPosition="left" onClick={open}/>
            </label>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
