"use client";

import React, { useEffect, useState } from "react";
import Button from "@/app/components/atoms/Button";
import {
  SectionFolder,
  SectionModal,
  SectionModify,
} from "@/app/components/molecules/Modal";
import { FolderListData } from "@/app/types/folder";
import { useFolderStore } from "@/app/store/useFolderStore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import speach_bubble from "../../../../public/speech_bubble.svg";

const HomePage = () => {
  const folders = useFolderStore((state) => state.folders);
  const fetchFolders = useFolderStore((state) => state.fetchFolders);
  const addFolder = useFolderStore((state) => state.addFolder);
  const updateFolder = useFolderStore((state) => state.updateFolder);
  const removeFolder = useFolderStore((state) => state.removeFolder);
  const { data: session, status } = useSession();

  const [selectedFolder, setSelectedFolder] = useState<FolderListData | null>(
    null
  );
  const [showModify, setShowModify] = useState<{ [key: string]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [professor, setProfessor] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleCreateFolder = async () => {
    await addFolder(subject, professor);
    setSubject("");
    setProfessor("");
    setShowModal(false);
  };

  const handleUpdateFolder = async () => {
    if (selectedFolder) {
      await updateFolder(selectedFolder.folderId, subject, professor);
      setShowModify((prevState) => ({
        ...prevState,
        [selectedFolder.folderId]: false,
      }));
      setShowModal(false);
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    await removeFolder(folderId);
    setSelectedFolder(null);
  };

  console.log(session?.user.name, "section");
  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="flex flex-col h-full rounded-t-xl rounded-r-ml rounded-l-ml bg-black-90">
        <div className="flex flex-col justify-between p-5">
          <div className="text-4xl font-semibold text-white">
            <span className="flex gap-2">
              <Image src={speach_bubble} alt="speach_bubble" />
              <span> 안녕하세요!</span>
            </span>
            <span className="text-primary">{session?.user.name}</span> 교수님을
            도와드릴 AI Tutor예요
          </div>
          <div className="w-full align-middle flex pt-5">
            <div className="flex flex-row gap-2 w-full">
              <p className="flex flex-col text-white font-semibold text-lg">
                홈
              </p>
            </div>
            <Button
              label="새 과목 만들기"
              variant="create"
              onClick={() => {
                setIsEditMode(false);
                setSubject("");
                setProfessor("");
                setShowModal(true);
              }}
            />
          </div>
        </div>

        <div className="bg-black-80 rounded-lg rounded-b-none mx-4 h-full">
          {folders.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-center text-white">
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
              {folders.map((folder) => (
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
                      setShowModify((prevState) => ({
                        ...prevState,
                        [folder.folderId]: !prevState[folder.folderId],
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
                          setShowModify((prevState) => ({
                            ...prevState,
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
            onSave={() => {
              if (isEditMode) {
                handleUpdateFolder();
              } else {
                handleCreateFolder();
              }
            }}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
