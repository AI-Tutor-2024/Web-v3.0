'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/atoms/Button';
import {
  SectionFolder,
  SectionModal,
  SectionModify,
} from '@/app/components/molecules/Modal';
import {
  getIsFirstTimeUser,
  setIsFirstTimeUser,
} from '@/app/utils/localstorage';
import { useFetchFolders } from '@/app/hooks/folder/useFetchFolders';
import { useCreateFolder } from '@/app/hooks/folder/useCreateFolder';
import { useUpdateFolder } from '@/app/hooks/folder/useUpdateFolder';
import { useDeleteFolder } from '@/app/hooks/folder/useDeleteFolder';
import { useOnboardingstore } from '@/app/store/useOnboardingStore';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import speach_bubble from '../../../../public/speech_bubble.svg';
import { Folder } from '@/app/types/folder';
import useAuthInterceptor from '@/app/hooks/auth/useAuthInterceptor';

import OnBoardingModal from '@/app/components/molecules/OnBoardingModal';
import toast from 'react-hot-toast';
import { DeleteModal } from '@/app/components/molecules/Modal';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const token = session?.user?.aiTutorToken;
  const { data: folders = [], refetch } = useFetchFolders({
    enabled: status === 'authenticated' && !!token,
  });
  const createFolder = useCreateFolder();
  const updateFolder = useUpdateFolder();
  const deleteFolder = useDeleteFolder();
  const { isOpen, open } = useOnboardingstore();
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [showModify, setShowModify] = useState<{ [key: string]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [professor, setProfessor] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const hasRefetched = useRef(false);

  const handleCreateFolder = async (): Promise<boolean> => {
    if (!subject) {
      toast.error('과목명을 입력해주세요.');
      return false;
    }

    if (!professor) {
      toast.error('교수명을 입력해주세요.');
      return false;
    }

    await createFolder.mutateAsync({
      folderName: subject,
      professorName: professor,
    });
    setSubject('');
    setProfessor('');
    return true;
  };

  const handleUpdateFolder = async (): Promise<boolean> => {
    if (!selectedFolder) return false;

    updateFolder.mutate({
      folderId: selectedFolder.folderId,
      folderName: subject,
      professorName: professor,
    });

    setShowModify((prev) => ({ ...prev, [selectedFolder.folderId]: false }));
    setShowModal(false);
    return true;
  };

  const handleDeleteFolder = async (folderId: number) => {
    await deleteFolder.mutateAsync(folderId);
    setSelectedFolder(null);
    setShowDeleteModal(false);
    setPendingDeleteId(null);
  };

  useAuthInterceptor();

  useEffect(() => {
    refetch();
  }, [token, status, refetch, folders.length]);

  useEffect(() => {
    if (getIsFirstTimeUser()) {
      open();
      setIsFirstTimeUser(false);
    }
  }, [open]);

  const profName = session?.user.name;

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="flex flex-col h-full rounded-t-xl rounded-r-ml rounded-l-ml bg-black-90">
        <div className="flex flex-col justify-between p-5 pt-8 gap-8">
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
                setProfessor(profName || '');
                setShowModal(true);
              }}
            />
          </div>
        </div>

        <div className="bg-black-80 rounded-lg rounded-b-none mx-4 h-full">
          {isOpen && <OnBoardingModal></OnBoardingModal>}

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
                    noteIsExist={folder.noteCount > 0}
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
                        onDelete={() => {
                          setPendingDeleteId(folder.folderId);
                          setShowDeleteModal(true);
                        }}
                      />
                      {showDeleteModal && pendingDeleteId !== null && (
                        <DeleteModal
                          message="정말 해당 과목 폴더를 삭제하시겠습니까?"
                          onDelete={() => {
                            if (pendingDeleteId !== null) {
                              handleDeleteFolder(pendingDeleteId);
                            }
                          }}
                          onClose={() => {
                            setShowDeleteModal(false);
                            setPendingDeleteId(null);
                          }}
                        />
                      )}
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
