import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface FileUploadProps {
  noteId?: number; // `noteId`를 선택적 속성으로 변경
  onUploadSuccess: (file: File | null) => void; // 업로드 성공 시 파일 전달
  onUploadError: (error: any) => void; // 오류 처리 함수
  label: string;
  description?: string; // `description`을 선택적 속성으로 변경
  labelClassName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  noteId,
  onUploadSuccess,
  onUploadError,
  label = "파일 첨부",
  description = "드래그하거나 클릭하여 파일을 업로드하세요.",
  labelClassName,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // 파일 선택 처리
  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setUploadStatus("파일 선택됨");

    // 파일을 상위 컴포넌트에 전달
    onUploadSuccess(selectedFile);
  };

  // Dropzone 설정
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".m4a", ".mp3", ".wav"],
      "video/*": [".mp4"],
    },
    maxFiles: 1,
  });

  return (
    <div className="mb-4">
      <div className="flex flex-row">
        <div className={`text-white text-base flex-shrink-0 ${labelClassName}`}>
          {label}
        </div>
        <div
          {...getRootProps()}
          className="flex flex-col justify-start w-[730px] h-32 rounded-md p-5 cursor-pointer bg-[#252424] text-gray-400 hover:text-gray-500 hover:bg-bgDeepGray"
        >
          <input {...getInputProps()} />
          {!file ? (
            <>
              <div className="flex flex-col text-start items-start justify-start">
                <p className="mb-1 text-sm text-[#D9D9D9]">
                  <span className="font-normal">
                    강의 녹화, 녹음본으로 학습 콘텐츠를 만들어보세요
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {description} (파일 길이: 최대 120분, 지원 형식: m4a, mp3,
                  wav, mp4)
                </p>
              </div>
              <div className="mt-3 flex flex-col justify-end items-end">
                <button className="pr-3 pl-2 py-2 flex flex-row gap-1 rounded-md bg-[#5F5F5F]">
                  <Image
                    src="/icon_upload.svg"
                    alt="file-upload"
                    width={22}
                    height={22}
                  />
                  <span className="text-[14px] text-mainWhite">파일 첨부</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col text-start items-start justify-start">
              <p className="mb-1 text-sm text-[#D9D9D9]">
                <span className="font-normal">파일 이름: {file.name}</span>
              </p>
              <p className="text-xs text-gray-500">파일 형식: {file.type}</p>
            </div>
          )}
        </div>
      </div>

      {/* 업로드 상태 메시지 */}
      {uploadStatus && <p className="mt-2 text-white">{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
