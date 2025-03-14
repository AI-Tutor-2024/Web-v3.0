'use client';

import React, { useState } from 'react';
import Button from '@/app/components/atoms/Button';
import {
  SectionFolder,
  SectionModal,
  SectionModify,
} from '@/app/components/molecules/Modal';
import { useFetchFolders } from '@/app/hooks/folder/useFetchFolders';
import { useCreateFolder } from '@/app/hooks/folder/useCreateFolder';
import { useUpdateFolder } from '@/app/hooks/folder/useUpdateFolder';
import { useDeleteFolder } from '@/app/hooks/folder/useDeleteFolder';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import speach_bubble from '../../../../public/speech_bubble.svg';
import { Folder } from '@/app/types/folder';

import { useOnboarding } from '@/app/hooks/useOnboarding';

import OnBoardingModal from '@/app/components/molecules/OnBoardingModal';

const HomePage = () => {
  const { data: session } = useSession();
  const { data: folders = [] } = useFetchFolders();
  const createFolder = useCreateFolder();
  const updateFolder = useUpdateFolder();
  const deleteFolder = useDeleteFolder();

  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [showModify, setShowModify] = useState<{ [key: string]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [professor, setProfessor] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const handleCreateFolder = async () => {
    try {
      await createFolder.mutateAsync({
        folderName: subject,
        professorName: professor,
      });
      setShowModal(false);
      setSubject('');
      setProfessor('');
    } catch (error) {
      console.error('폴더 생성 실패:', error);
    }
  };

  const handleUpdateFolder = async () => {
    if (!selectedFolder) return;
    try {
      await updateFolder.mutateAsync({
        folderId: selectedFolder.folderId,
        folderName: subject,
        professorName: professor,
      });
      setShowModify((prev) => ({ ...prev, [selectedFolder.folderId]: false }));
      setShowModal(false);
    } catch (error) {
      console.error('폴더 수정 실패:', error);
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      await deleteFolder.mutateAsync(folderId);
      setSelectedFolder(null);
    } catch (error) {
      console.error('폴더 삭제 실패:', error);
    }
  };
  const { showOnboarding, closeOnboarding } = useOnboarding();

  console.log(session?.user.name, 'section');
  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="flex flex-col h-full rounded-t-xl rounded-r-ml rounded-l-ml bg-black-90">
        <div className="flex flex-col justify-between p-5 gap-8">
          <div className="text-4xl font-semibold text-white">
            <span className="flex gap-2">
              <Image src={speach_bubble} alt="speach_bubble" />
              <span> 안녕하세요!</span>
            </span>
            <span className="text-primary">{session?.user.name}</span> 교수님을
            도와드릴 AI Tutor예요
          </div>
          <div className="w-full align-middle flex pt-5">
            <div className="flex flex-row w-full">
              <p className="flex flex-col text-white font-semibold text-lg">
                홈
              </p>
            </div>
            <Button
              label="새 과목 만들기"
              variant="create"
              onClick={() => {
                setIsEditMode(false);
                setSubject('');
                setProfessor('');
                setShowModal(true);
              }}
            />
          </div>
        </div>

        <div className="bg-black-80 rounded-lg rounded-b-none mx-4 h-full">
          <div className="flex text-center">
            {showOnboarding && (
              <OnBoardingModal onClose={closeOnboarding}></OnBoardingModal>
            )}
          </div>
          {folders.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-center text-white">
              <div className="flex items-center justify-center"> </div>
              <p className="text-xl font-bold mb-4">
                강의 과목 폴더를 만들어 보세요.
              </p>
              <p className="text-base text-black-70">
                새 과목 만들기 버튼을 누르면 강의 과목 폴더를 만들어 수업을
                관리할 수 있어요
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-start items-start gap-4 mx-5 py-4">
              {folders.map((folder: any) => (
                <div
                  key={folder.folderId}
                  className="relative flex flex-col items-center"
                >
                  <SectionFolder
                    section={folder}
                    onClick={() => {
                      setSelectedFolder(folder);
                      setSubject(folder.folderName);
                      setProfessor(folder.professor);
                    }}
                    onMenuClick={() =>
                      setShowModify((prev) => ({
                        ...prev,
                        [folder.folderId]: !prev[folder.folderId],
                      }))
                    }
                    showModify={showModify[folder.folderId] || false}
                  />
                  {showModify[folder.folderId] && (
                    <div className="absolute top-full right-3 z-50">
                      <SectionModify
                        section={folder}
                        onEditClick={() => {
                          setIsEditMode(true);
                          setShowModify((prev) => ({
                            ...prev,
                            [folder.folderId]: false,
                          }));
                          setSelectedFolder(folder);
                          setSubject(folder.folderName);
                          setProfessor(folder.professor);
                          setShowModal(true);
                        }}
                        onDelete={() => handleDeleteFolder(folder.folderId)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <SectionModal
            subject={subject}
            professor={professor}
            setSubject={setSubject}
            setProfessor={setProfessor}
            onSave={isEditMode ? handleUpdateFolder : handleCreateFolder}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
