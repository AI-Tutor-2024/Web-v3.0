'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchNotes, deleteNote, createSTT } from '@/app/api/notes';
import { getFolders } from '@/app/api/folders';
import Info from '@/app/components/molecules/Info';
import NoteList from '@/app/components/organisms/NoteList';
import Button from '@/app/components/atoms/Button';
import { NoteData, NoteResponse } from '@/app/types/note';
import Skeleton from '@/app/components/utils/Skeleton';
import NewNoteForm from '@/app/components/organisms/NewNoteForm';
import { usePracticeContext } from '@/app/context/PracticeContext';
import { createNote } from '@/app/api/notes';
import { toast } from 'react-hot-toast';

const NotesPage = () => {
  const router = useRouter();
  const { folderId } = useParams();

  const {
    file,
    setFile,
    setKeywords,
    setRequirement,
    setFolderName,
    setProfessor,
    folderName,
    professor,
    setSttLoading,
  } = usePracticeContext();

  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [noteName, setNoteName] = useState('');
  const isNextBtnDisabled = !noteName || !file;
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    if (folderId) {
      const loadNotes = async () => {
        try {
          hasFetched.current = true;
          const folders = await getFolders();
          const currentFolder = folders.find(
            (folder: any) => folder.folderId === Number(folderId)
          );
          if (currentFolder) {
            setFolderName(currentFolder.folderName);
            setProfessor(currentFolder.professor);
          }

          const notesData: NoteResponse = await fetchNotes(Number(folderId));
          setNotes(notesData.noteListDetailRes);
        } catch (error) {
          toast.error('노트를 불러오는데 실패했어요2');
        } finally {
          setLoading(false);
        }
      };

      loadNotes();
    }
  }, [folderId, setFolderName, setProfessor]);

  const handleDeleteNote = async (noteId: number) => {
    try {
      await deleteNote(folderId, noteId);
      const notesData: NoteResponse = await fetchNotes(Number(folderId));
      setNotes(notesData.noteListDetailRes);
    } catch (error) {
      toast.error('노트 삭제하는데데 실패했어요.');
    }
  };

  const handleNoteNextBtn = async () => {
    try {
      if (!noteName) {
        toast.error('노트 이름을 입력해 주세요.');
        return;
      }

      setSttLoading(true);
      const createdNoteResponse = await createNote(Number(folderId), {
        title: noteName,
      });

      toast.success('노트가 생성되었습니다.');

      const notesData: NoteResponse = await fetchNotes(Number(folderId));
      const newNote =
        notesData.noteListDetailRes[notesData.noteListDetailRes.length - 1];

      if (newNote) {
        router.push(
          `/notes/${folderId}/${createdNoteResponse.information.noteId}/confirm`
        );
      } else {
        toast.error('생성된 노트를 찾을 수 없습니다.');
        setSttLoading(false);
      }
    } catch (error) {
      toast.error('노트 생성 중 오류가 발생했습니다.');
      setSttLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col justify-start">
        <div className="flex flex-row justify-between p-8">
          <div className="flex flex-col">
            <Skeleton width="200px" height="24px" />
            <Skeleton width="150px" height="18px" className="mt-2" />
          </div>
          <div className="flex flex-col justify-center items-center pr-2">
            <Skeleton width="120px" height="40px" className="rounded-full" />
          </div>
        </div>

        <div className="p-8 mt-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="mb-4">
              <Skeleton width="100%" height="40px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between pt-5">
      {isFormOpen ? (
        <div className="flex flex-row justify-between p-8 gap-2">
          <div>
            <p className="text-white text-2xl font-normal">새로운 수업</p>
            <p className="text-white text-sm font-normal">
              수업 정보를 입력해 주세요
            </p>
          </div>
          <div>
            <Button
              label="다음"
              disabled={isNextBtnDisabled}
              variant="next"
              onClick={handleNoteNextBtn}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-row justify-between">
          <Info folderName={folderName} professorName={professor} />
          <div className="flex flex-col justify-center items-center p-8">
            <Button
              label="새 노트 만들기"
              variant="create"
              onClick={() => setIsFormOpen(true)}
            />
          </div>
        </div>
      )}

      {isFormOpen && (
        <NewNoteForm
          folderId={Number(folderId)}
          noteId={0}
          setNoteName={setNoteName}
          setFile={setFile}
          setKeywords={setKeywords}
          setRequirement={setRequirement}
        />
      )}

      <div className="h-full flex flex-col justify-between">
        {isFormOpen ? null : notes.length === 0 ? (
          <div className="flex flex-col justify-center items-center text-center text-white h-full">
            <p className="text-2xl mb-2">새로운 수업을 만들어 보세요.</p>
            <p className="text-base text-gray-400 mb-8">
              강의 녹화 파일을 업로드하면 복습 문제 생성이 가능해요
            </p>
          </div>
        ) : (
          <div>
            <NoteList
              notes={notes}
              onDeleteNote={handleDeleteNote}
              folderId={Number(folderId)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
