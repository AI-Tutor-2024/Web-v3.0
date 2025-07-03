'use client';

import { useState } from 'react';
import { useOnboardingstore } from '@/app/store/useOnboardingStore';
import Link from 'next/link';
import Icon from '../atoms/Icon';
import { useParams, usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  data?: any;
}

const Sidebar: React.FC<SidebarProps> = ({ data }) => {
  const { open } = useOnboardingstore();

  type Note = {
    noteId: number;
    noteName: string;
  };

  type Folder = {
    folderId: number;
    folderName: string;
    noteCount: number;
    notesInFolderRes: Note[];
  };

  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const currentFolderId = params.folderId;
  const currentNoteId = params.noteId;
  const isHome = pathname === '/home';
  const folders = data?.folderNoteDetailList || [];

  const [showSections, setShowSections] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState<{ [noteId: number]: boolean }>(
    {}
  );

  const toggleSections = () => setShowSections(!showSections);
  const toggleNote = (noteId: number) => {
    setIsNoteOpen(prev => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  const handleGuideClick = () => {
    open();
  };

  return (
    <div className="min-w-[220px] h-screen justify-between flex flex-col z-20 bg-black">
      <div className="flex flex-col h-full rounded-lg bg-black">
        <Link href="/home">
          <div className="flex items-center justify-center px-2">
            <Icon label="icon" className="w-[110px] h-[70px] m-auto" />
          </div>
        </Link>

        <div>
          <div
            className={`${
              isHome ? 'bg-black-90' : ''
            } cursor-pointer transition-colors duration-200`}
          >
            <Link href="/home">
              <div className="px-8 py-2 flex flex-row text-center gap-3">
                <Icon
                  label="ic_side_home"
                  className="w-[20px] h-[20px] my-auto"
                />
                <p className="text-white">홈</p>
              </div>
            </Link>
          </div>

          <div className="flex flex-col">
            <div
              className="px-8 py-2 flex flex-row text-center gap-3 cursor-pointer transition-colors duration-200"
              onClick={toggleSections}
            >
              <Icon
                label="ic_side_folder"
                className="w-[20px] h-[20px] m-auto"
              />
              <p className="text-white mr-8 flex-shrink-0">강의 과목</p>
              <Icon
                label="arrow_sidebar"
                className={`h-[16px] w-[16px] my-auto invert transition-transform duration-300 ${
                  showSections ? '-rotate-90' : 'rotate-90'
                }`}
              />
            </div>

            {showSections &&
              folders.map((folder: Folder) => {
                const isSelectedFolder: boolean =
                  currentFolderId?.toString() === folder.folderId.toString();

                return (
                  <div key={folder.folderId}>
                    <div className="px-8 py-2 flex justify-between flex-row text-center gap-3 cursor-pointer">
                      <div className="flex flex-row gap-3">
                        <Icon
                          label="ic_side_folder"
                          className="w-[20px] h-[20px] my-auto"
                        />
                        <p
                          onClick={() =>
                            router.push(`/notes/${folder.folderId}`)
                          }
                          className="text-base text-white flex-shrink-0"
                        >
                          {folder.folderName}
                        </p>
                      </div>
                      {(folder.notesInFolderRes?.length ?? 0) > 0 && (
                        <Icon
                          label="arrow_sidebar"
                          className={`h-[16px] w-[16px] my-auto invert transition-transform duration-300 ${
                            isNoteOpen[folder.folderId]
                              ? '-rotate-90'
                              : 'rotate-90'
                          }`}
                          onClick={() => toggleNote(folder.folderId)}
                        />
                      )}
                    </div>

                    {(folder.notesInFolderRes?.length ?? 0) > 0 &&
                      isNoteOpen[folder.folderId] && (
                        <div className="space-y-1 bg-black-80">
                          {folder.notesInFolderRes.map((note: Note) => {
                            const isSelectedNote: boolean =
                              currentFolderId?.toString() ===
                                folder.folderId.toString() &&
                              currentNoteId?.toString() ===
                                note.noteId.toString();

                            return (
                              <Link
                                key={note.noteId}
                                href={`/notes/${folder.folderId}/${note.noteId}/summary`}
                              >
                                <div
                                  className={`w-full pl-16 text-base py-2 cursor-pointer bg-black-80 ${
                                    isSelectedNote
                                      ? 'bg-black-90 text-white'
                                      : 'text-white hover:bg-black-90'
                                  }`}
                                >
                                  {note.noteName}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="pb-8">
        <div className="hover:bg-black-80 hover:rounded-md cursor-pointer transition-colors duration-200 rounded-md">
          <div
            onClick={handleGuideClick}
            className="flex flex-row px-[35px] py-2 gap-3"
          >
            <Icon label="guide" className="w-[20px] h-[20px] my-auto" />
            <p className="text-white">가이드보기</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
