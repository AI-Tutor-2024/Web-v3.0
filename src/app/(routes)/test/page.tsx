'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/app/components/atoms/Button';
import CheckCircle from '@/app/components/atoms/CheckCircle';
import { FormInput } from '@/app/components/atoms/FormInput';
import FileUpload from '@/app/components/atoms/FileUpload';
import toast from 'react-hot-toast';
import Icon from '@/app/components/atoms/Icon';
import TabComponent from '@/app/components/atoms/TextInputSection';
import Popover from '@/app/components/molecules/PopOver';
import CountInput from '@/app/components/atoms/CountInput';
import {
  SectionFolder,
  SectionModal,
  SectionModify,
} from '@/app/components/molecules/Modal';
import { FolderListData } from '@/app/types/folder';
import {
  createFolder,
  deleteFolder,
  fetchFolderName,
  getFolders,
  updateFolder,
} from '@/app/api/folders';
import Info from '@/app/components/molecules/Info';
import NoteList from '@/app/components/organisms/NoteList';
import ReviewQuestions from '@/app/components/organisms/ReviewQuestions';
import { useSession } from 'next-auth/react';

const Page = () => {
  const { data: session } = useSession();
  const token = session?.user.aiTutorToken;
  const [folders, setFolders] = useState<FolderListData[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FolderListData | null>(
    null
  );
  const [showModify, setShowModify] = useState<{ [key: string]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [professor, setProfessor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isSelected, setIsSelected] = useState([false, false, false, false]);
  const [checkedStates, setCheckedStates] = useState([false, false]);
  const [formInputValue, setFormInputValue] = useState('');
  const [keywords, setKeywords] = useState('');
  const [requirement, setRequirement] = useState('');
  const [responseData, setResponseData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState<'OX' | '단답형' | null>(null);
  const [count, setCount] = useState('');

  const fetchFolderNames = async () => {
    try {
      const data = await fetchFolderName();
    } catch (error) {
      toast.error('폴더 불러오는데 실패했어요.');
    }
  };

  useEffect(() => {
    fetchFolderNames();
  }, []);

  const fetchFolders = async () => {
    try {
      const data = await getFolders();
      setFolders(data);
    } catch (error) {
      toast.error('폴더 불러오는데 실패했어요.');
      setFolders([]);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleCreateFolder = async () => {
    setIsLoading(true);
    try {
      await createFolder({
        folderName: subject,
        professorName: professor,
      });
      await fetchFolders();
      setSubject('');
      setProfessor('');
      setShowModal(false);
    } catch (err) {
      toast.error('폴더 불러오는데 실패했어요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFolder = async () => {
    if (selectedFolder) {
      try {
        await updateFolder({
          folderId: selectedFolder.folderId,
          folderName: subject,
          professorName: professor,
        });
        await fetchFolders();
        setShowModify((prevState) => ({
          ...prevState,
          [selectedFolder.folderId]: false,
        }));
        setShowModal(false);
      } catch (error) {
        toast.error('폴더 불러오는데 실패했어요.');
      }
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      await deleteFolder(folderId);
      await fetchFolders();
      setSelectedFolder(null);
      setShowModify((prevState) => ({
        ...prevState,
        [folderId]: false,
      }));
    } catch (error) {
      toast.error('폴더 불러오는데 실패했어요.');
    }
  };

  const handleKeywordChange = (value: string) => setKeywords(value);
  const handleRequirementChange = (value: string) => setRequirement(value);

  const handleUploadSuccess = (response: any) => {
    setResponseData(response);
    setError(null);
  };

  const handleUploadError = (err: any) => {
    setResponseData(null);
    setError('업로드 중 오류가 발생했습니다.');
    toast.error('폴더 불러오는데 실패했어요.');
  };

  const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCount(event.target.value);
  };

  const handleSelectClick = (index: number) => {
    setIsSelected((prevState) =>
      prevState.map((selected, i) => (i === index ? !selected : selected))
    );
  };

  const handleCheckCircleClick = (index: number) => {
    setCheckedStates((prevState) =>
      prevState.map((checked, i) => (i === index ? !checked : checked))
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormInputValue(event.target.value);

  return (
    <>
      {/* 1. 폴더 생성 */}
      <Info folderName="빅데이터기술특론" professorName="하석재" />
      <h1>folder</h1>
      <div className="flex flex-wrap gap-4">
        {folders.map((folder) => (
          <div key={folder.folderId} className="relative">
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
              <div className="absolute top-full right-0 z-50">
                <SectionModify
                  section={folder}
                  onEditClick={() => {
                    setIsEditMode(true); // 수정 모드
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

      {/* 폴더 생성 버튼 */}
      <Button
        label="새로 만들기"
        variant="create"
        onClick={() => {
          setIsEditMode(false); // 생성 모드
          setSubject('');
          setProfessor('');
          setShowModal(true);
        }}
      />

      {/* 폴더 생성/수정 모달 */}
      {showModal && (
        <SectionModal
          subject={subject}
          professor={professor}
          setSubject={setSubject}
          setProfessor={setProfessor}
          onSave={async () => {
            try {
              if (isEditMode) {
                await handleUpdateFolder();
              } else {
                await handleCreateFolder();
              }
              return true;
            } catch (e) {
              return false;
            }
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* 2. 노트 입력 */}
      <h1>Form</h1>
      <FormInput
        name="noteName"
        defaultValue="기본 노트 이름"
        placeholder="노트 이름을 입력하세요"
        onChange={handleInputChange}
        label="노트 이름"
        variant="round"
        labelClassName="mr-10"
      />

      <FormInput
        name="noteName"
        defaultValue="기본 노트 이름"
        placeholder="노트 이름을 입력하세요"
        onChange={handleInputChange}
        label="노트 이름"
        variant="round"
        labelClassName="mr-10"
      />

      {/* 3. 요구사항 입력 */}
      <TabComponent
        onKeywordChange={handleKeywordChange}
        onRequirementChange={handleRequirementChange}
      />

      {/* 4. 파일 업로드 */}
      <h1>Form Example</h1>
      {/* <FileUpload
        request={{ practiceSize:10, type: "OX", keywords, requirement }}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        label="파일 업로드"
        description="드래그하거나 클릭하여 파일을 업로드하세요."
      /> */}

      {/* 업로드 성공 시 응답 데이터 표시 */}
      {responseData && (
        <div className="mt-4 p-4 bg-gray-700 text-white rounded">
          <h2>서버 응답</h2>
          <div className="overflow-auto h-9">
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* 업로드 실패 시 에러 메시지 표시 */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* 5. 복습 문제 생성 */}
      <h1>Button</h1>
      <div className="flex flex-row gap-10">
        {/* OX Quiz Button */}
        <div className="relative">
          <Button
            label="OX 퀴즈"
            variant="select"
            isSelected={isSelected[0]}
            onClick={() => handleSelectClick(0)}
            onMouseEnter={() => setShowPopover('OX')}
            onMouseLeave={() => setShowPopover(null)}
          />
          {showPopover === 'OX' && (
            <Popover type="OX" position={{ top: '60px', left: '0px' }} />
          )}
        </div>

        {/* Short Answer Button */}
        <div className="relative">
          <Button
            label="단답형"
            variant="select"
            isSelected={isSelected[1]}
            onClick={() => handleSelectClick(1)}
            onMouseEnter={() => setShowPopover('단답형')}
            onMouseLeave={() => setShowPopover(null)}
          />
          {showPopover === '단답형' && (
            <Popover type="단답형" position={{ top: '60px', left: '0px' }} />
          )}
        </div>
        <Button
          label="직접 입력"
          variant="select"
          isSelected={isSelected[2]}
          onClick={() => handleSelectClick(2)}
        />
        <Button
          label="AI 추천"
          variant="select"
          isSelected={isSelected[3]}
          onClick={() => handleSelectClick(3)}
        />
        <form className="flex flex-row pl-5">
          <CountInput
            name="count"
            defaultValue={count}
            onChange={handleCountChange}
            placeholder="0"
          />
        </form>
      </div>

      {/* NextButton */}
      <Button label="복습 문제 생성" variant="next" imgSrc="arrow_next" />

      {/* CheckCircle 컴포넌트 */}
      <h1>CheckedCircle</h1>
      {checkedStates.map((isChecked, index) => (
        <CheckCircle
          key={index}
          isChecked={isChecked}
          onChange={() => handleCheckCircleClick(index)}
          size={40} // 필요에 따라 크기를 조절할 수 있습니다
        />
      ))}

      {/* Icon 컴포넌트 */}
      <h1>Icon Component</h1>
      <Icon label="ic_side_all" />
      <Icon label="ic_side_home" />
      <Icon label="ic_side_folder" />
      <Icon label="guide" />
      <Icon label="kebab-menu" invert={true} />
      <Icon label="kebab-menu" invert={false} />
      <Icon label="delete-icon" />
      <Icon label="update" />

      {/* 취소 버튼 */}
      {/* <Button
        label="취소"
        variant="cancel"
        onClick={onClose}
      /> */}

      {/* 저장 버튼 */}
      <Button label="저장" variant="save" type="submit" />
      {/* <NoteList /> */}
    </>
  );
};

export default Page;
