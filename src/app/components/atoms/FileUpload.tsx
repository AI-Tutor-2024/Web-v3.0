import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Icon from './Icon';
import useFileDuration from '@/app/hooks/useFileDuration';
import Button from './Button';
import Image from 'next/image';

interface FileUploadProps {
  noteId?: number;
  onUploadSuccess: (file: File | null) => void;
  onUploadError: (error: any) => void;
  onUploadingStart?: () => void;
  label: string;
  description?: string;
  labelClassName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  noteId,
  onUploadSuccess,
  onUploadError,
  onUploadingStart,
  label,
  description,
  labelClassName,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const duration = useFileDuration(file);

  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setIsUploading(true);
    onUploadingStart?.();

    setProgress(0);

    const uploadSimulation = (currentProgress: number) => {
      if (currentProgress < 100) {
        const nextProgress = Math.min(
          100,
          currentProgress + Math.floor(Math.random() * 10 + 5)
        );
        setProgress(nextProgress);

        setTimeout(
          () => uploadSimulation(nextProgress),
          Math.random() * 10 + 10
        );
      } else {
        setIsUploading(false);
        setTimeout(() => {
          onUploadSuccess(selectedFile);
        }, 100);
      }
    };

    uploadSimulation(0);
  };

  const removeFile = (event: React.MouseEvent) => {
    event.stopPropagation();
    setFile(null);
    setProgress(0);
    setIsUploading(false);
    onUploadSuccess(null);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.m4a', '.mp3', '.wav'],
      'video/*': ['.mp4'],
    },
    maxFiles: 1,
    noClick: true,
  });

  return (
    <div className="mb-4 h-fit">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <div
            className={`text-white text-base flex-shrink-0 ${labelClassName}`}
          >
            {label}
          </div>
          <div className="flex flex-col">
            <div
              {...getRootProps()}
              className="flex flex-col justify-start md:w-[730px] rounded-md p-5 cursor-pointer bg-neutral-800 text-gray-400 hover:text-gray-500"
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex flex-row w-full justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="text-base text-black-70 flex font-semibold gap-4">
                      <Image
                        src={`/active_folder.svg`}
                        alt={'active_folder'}
                        width={40}
                        height={40}
                      />
                      <div className="flex flex-col gap-1">
                        <div className="text-white">{file.name}</div>
                        <p className="font-medium text-sm">
                          {duration !== null && `${duration}분`}
                        </p>
                      </div>
                    </p>
                  </div>

                  <button
                    onClick={removeFile}
                    className="ml-3"
                    disabled={isUploading}
                  >
                    <Icon label="delete_bin_red" size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center justify-start">
                  <div className="flex items-center gap-3">
                    <p className="text-base text-white">
                      파일 첨부를 클릭하거나 파일을 마우스로 끌어 오세요
                    </p>
                  </div>
                  <p className="text-base text-black-60 mt-1">
                    (파일 크기: 최대 120분, 지원 형식: m4a, mp3, wav, mp4)
                  </p>

                  <label className="cursor-pointer pt-3">
                    <Button label="파일 첨부" variant="select" onClick={open} />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
