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

  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const currentFolderId = params.folderId;
  const currentNoteId = params.noteId;
  const isHome = pathname === '/home';

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

  const folders: Folder[] = data?.folderNoteDetailList || [];

  const [noteOpenSet, setNoteOpenSet] = useState<Set<number>>(new Set());

  const toggleNote = (folderId: number) => {
    setNoteOpenSet((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleGuideClick = () => {
    open();
  };

  return (
    <div className="min-w-[220px] max-w-[280px] w-full h-screen flex flex-col justify-between bg-black z-20">
      <div className="flex flex-col h-full overflow-y-auto pr-1">
        <Link href="/home">
          <div className="flex items-center justify-center py-4">
            <Icon label="icon" className="w-[110px] h-[70px] m-auto" />
          </div>
        </Link>

        <Link href="/home">
          <div
            className={`px-8 py-2 flex items-center gap-3 cursor-pointer hover:bg-black-80 transition-colors ${
              isHome ? 'bg-black-90' : ''
            }`}
          >
            <Icon label="ic_side_home" className="w-[20px] h-[20px]" />
            <p className="text-white">홈</p>
          </div>
        </Link>

        <div className="mt-2">
          <div className="px-8 py-2 text-white text-sm font-semibold">
            강의 과목
          </div>

          {folders.map((folder) => {
            const isOpen = noteOpenSet.has(folder.folderId);
            const folderPath = `/notes/${folder.folderId}`;
            const isSelectedFolder = pathname.startsWith(folderPath);

            return (
              <div key={folder.folderId} className="flex flex-col">
                <div
                  className={`px-8 py-2 flex justify-between items-center cursor-pointer hover:bg-black-80 transition-colors ${
                    isSelectedFolder
                      ? 'bg-black-90 border-l-4 border-mju-primary'
                      : ''
                  }`}
                >
                  <div
                    className="flex items-center gap-3 w-full"
                    onClick={() => router.push(folderPath)}
                  >
                    <Icon
                      label="ic_side_folder"
                      className="w-[20px] h-[20px]"
                    />
                    <p className="text-white text-base truncate">
                      {folder.folderName}
                    </p>
                  </div>

                  {folder.notesInFolderRes.length > 0 && (
                    <Icon
                      label="arrow_sidebar"
                      className={`w-[16px] h-[16px] invert transition-transform duration-300 ${
                        isOpen ? '-rotate-90' : 'rotate-90'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNote(folder.folderId);
                      }}
                    />
                  )}
                </div>

                {folder.notesInFolderRes.length > 0 && isOpen && (
                  <div className="bg-black-80">
                    {folder.notesInFolderRes.map((note) => {
                      const notePath = `/notes/${folder.folderId}/${note.noteId}/summary`;
                      const isSelectedNote = pathname === notePath;

                      return (
                        <Link key={note.noteId} href={notePath}>
                          <div
                            className={`pl-16 pr-4 py-2 text-base cursor-pointer truncate ${
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

      <div className="pb-8 px-[35px]">
        <div
          className="flex gap-3 items-center px-2 py-2 cursor-pointer hover:bg-black-80 rounded-md transition-colors"
          onClick={handleGuideClick}
        >
          <Icon label="guide" className="w-[20px] h-[20px]" />
          <p className="text-white">가이드 보기</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
