"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FolderListData } from "@/app/types/folder";
import Icon from "../atoms/Icon";
import { useRouter } from "next/navigation";
import forder from "../../../../public/folder.svg";

export const SectionFolder: React.FC<{
  section: FolderListData;
  onClick: (section: FolderListData) => void;
  onMenuClick: (e: React.MouseEvent) => void;
  showModify: boolean;
}> = ({ section, onClick, onMenuClick }) => {
  const router = useRouter();

  return (
    <div className="relative items-center">
      <div
        onClick={() => {
          router.push(`/notes/${section.folderId}`);
          onClick(section);
        }}
      >
        <Image
          src={forder}
          alt="folder"
          width={240}
          height={140}
          className="cursor-pointer"
        />
      </div>
      <div className="flex justify-between w-full px-3 mt-[-60px]">
        <div className="flex flex-col">
          <p className="font-Pretendard text-[20px] text-mainBlack">
            {section.folderName}
          </p>
          <p className="font-Pretendard text-[14px] text-mainBlack/[0.4]">
            {section.professor}
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <Icon
            label="kebab-menu"
            invert={false}
            alt="menu"
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick(e);
            }}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export const SectionModify: React.FC<{
  section: FolderListData;
  onEditClick: () => void;
  onDelete: () => void;
}> = ({ section, onEditClick, onDelete }) => {
  return (
    <div className="py-[12px] px-[15px] w-[180px] bg-[#343434] rounded-md">
      <button
        className="block font-Pretendard font-regular text-[15px] text-left w-full text-mainWhite mb-2 hover:text-gray-300 transition-colors duration-200"
        onClick={onEditClick}
      >
        폴더 정보 수정하기
      </button>
      <button
        className="block font-Pretendard font-regular text-[15px] text-left w-full text-[#CE1E34] hover:text-gray-300 transition-colors duration-200"
        onClick={onDelete}
      >
        폴더 삭제하기
      </button>
    </div>
  );
};

export const SectionModal: React.FC<{
  subject: string;
  professor: string;
  setSubject: (subject: string) => void;
  setProfessor: (professor: string) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ subject, professor, setSubject, setProfessor, onSave, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      console.log("Attempting to save folder...");
      await onSave();
      console.log("Folder saved successfully.");
      onClose();
    } catch (error) {
      console.error("Error saving folder:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col gap-4 items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 ">
      <div className="w-1/3">
        <form onSubmit={handleSave}>
          <div className="flex flex-col gap-4">
            <div className="bg-black-80 py-8 px-6 rounded-lg shadow-lg relative flex flex-col h-full whitespace-nowrap gap-6">
              <div className="flex items-center flex-row gap-3">
                <label className="block text-white" htmlFor="subject">
                  과목명
                </label>
                <input
                  type="text"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="과목명을 입력하세요"
                  className="w-full border border-black-70 px-3 py-2 bg-black-80 text-white rounded-md placeholder-black-60"
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center flex-row gap-3">
                <label className="block text-white" htmlFor="professor">
                  교수명
                </label>
                <input
                  type="text"
                  name="professor"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  placeholder="교수명을 입력하세요"
                  className="w-full border border-black-70 px-3 py-2 bg-black-80 text-white rounded-md placeholder-black-60 "
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="bg-black-80  text-white px-8 py-2 rounded-lg"
                onClick={onClose}
                disabled={isSaving}
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-primary rounded-lg text-white px-8 py-2"
                disabled={isSaving}
              >
                {isSaving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
