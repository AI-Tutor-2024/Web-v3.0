import React, { useEffect, useState } from "react";
import { FormInput } from "@/app/components/atoms/FormInput";
import FileUpload from "@/app/components/atoms/FileUpload";
import TabComponent from "@/app/components/atoms/Tab";
import { usePracticeContext } from "@/app/context/PracticeContext";
import { getFolders } from "@/app/api/folders";
import { useSession } from "next-auth/react";

interface NewNoteFormProps {
  folderId: number;
  noteId: number;
  setNoteName: (name: string) => void;
  setFile: (file: File | null) => void;
  setKeywords: (keywords: string) => void;
  setRequirement: (requirement: string) => void;
}

const NewNoteForm: React.FC<NewNoteFormProps> = ({
  folderId,
  noteId,
  setNoteName,
}) => {
  const { setFile, setKeywords, setRequirement } = usePracticeContext();
  const { data: session } = useSession();
  const token = session?.user.aiTutorToken;

  const [keywords, setLocalKeywords] = useState("");
  const [requirement, setLocalRequirement] = useState("");
  const [folderInfo, setFolderInfo] = useState<{
    folderName: string;
    professor: string;
  }>({
    folderName: "",
    professor: "",
  });

  useEffect(() => {
    const fetchFolderDetails = async () => {
      try {
        const folders = await getFolders();

        interface Folder {
          folderId: number;
          folderName: string;
          professor: string;
        }

        const currentFolder = folders.find(
          (folder: Folder) => folder.folderId === folderId
        );
        if (currentFolder) {
          setFolderInfo({
            folderName: currentFolder.folderName,
            professor: currentFolder.professor,
          });
        } else {
          console.error("Folder not found");
        }
      } catch (error) {
        console.error("Failed to fetch folder details:", error);
      }
    };

    fetchFolderDetails();
  }, [folderId]);

  useEffect(() => {
    setKeywords(keywords);
    setRequirement(requirement);
  }, [keywords, requirement, setKeywords, setRequirement]);

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="flex flex-col space-y-5 px-8 pt-4">
        <FormInput
          name="folderName"
          defaultValue={folderInfo.folderName}
          label="폴더명"
          variant="square"
          onChange={() => {}}
          labelClassName="mr-14"
          disabled={true}
        />

        <FormInput
          name="professorName"
          defaultValue={folderInfo.professor}
          label="교수자"
          variant="square"
          onChange={() => {}}
          labelClassName="mr-14"
          disabled={true}
        />

        <FormInput
          name="noteName"
          placeholder="노트 이름을 입력하세요"
          label="강의명"
          variant="square"
          onChange={(e) => setNoteName(e.target.value)}
          labelClassName="mr-14"
        />

        <FileUpload
          noteId={noteId}
          onUploadSuccess={setFile}
          onUploadError={console.error}
          label="강의 파일"
          labelClassName="mr-[38px] mt-2"
        />

        <TabComponent
          onKeywordChange={setLocalKeywords}
          onRequirementChange={setLocalRequirement}
          labelClassName="mr-[38px] mt-2"
        />
      </div>
    </div>
  );
};

export default NewNoteForm;
