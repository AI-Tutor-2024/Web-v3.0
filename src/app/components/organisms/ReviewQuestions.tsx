// src/components/ReviewQuestions.tsx
import React, { useCallback, useEffect, useState } from "react";
import Button from "@/app/components/atoms/Button";
import Icon from "@/app/components/atoms/Icon";
import CheckCircle from "@/app/components/atoms/CheckCircle";
import { FormInput } from "@/app/components/atoms/FormInput";
import savePracticeQuestions from "@/app/api/practice/savePracticeQuestions";
import { PracticeRequest } from "@/app/types/practice";
import { fetchPractice } from "@/app/api/practice/fetchPractice";
import { usePracticeContext } from "@/app/context/PracticeContext";

interface ReqList {
  practiceNumber: number;
  content: string;
  result: string;
  solution: string;
  practiceType: "OX" | "SHORT";
}

interface ReviewQuestionsProps {
  noteId: number;
}

const ReviewQuestions: React.FC<ReviewQuestionsProps> = ({ noteId }) => {
  const { questions, setQuestions } = usePracticeContext(); // context에서 questions 가져오기
  const [filteredQuestions, setFilteredQuestions] = useState<ReqList[] | null>(
    questions
  );
  const [isEditable, setIsEditable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [editMode, setEditMode] = useState<Record<number, boolean>>({});
  const [editedQuestions, setEditedQuestions] = useState<
    Record<number, { content: string; result: string }>
  >({});

  const loadPractice = useCallback(async () => {
    if (questions && questions.length > 0) {
      setFilteredQuestions(questions);
      setIsEditable(true);
    } else {
      try {
        setLoading(true);
        const response = await fetchPractice(noteId);
        setFilteredQuestions(response.information);
        setIsEditable(false);
      } catch (error) {
        console.error("Failed to load practice questions:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [questions, noteId]); // Add dependencies for useCallback

  useEffect(() => {
    loadPractice();
  }, [loadPractice]);

  const toggleSelect = (practiceNumber: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(practiceNumber)
        ? prev.filter((num) => num !== practiceNumber)
        : [...prev, practiceNumber]
    );
  };

  const toggleEditMode = (practiceNumber: number) => {
    if (!isEditable) return;
    setEditMode((prev) => ({
      ...prev,
      [practiceNumber]: !prev[practiceNumber],
    }));

    if (!editMode[practiceNumber] && filteredQuestions) {
      const question = filteredQuestions.find(
        (q) => q.practiceNumber === practiceNumber
      );
      if (question) {
        setEditedQuestions((prev) => ({
          ...prev,
          [practiceNumber]: {
            content: question.content,
            result: question.result,
          },
        }));
      }
    } else if (editMode[practiceNumber]) {
      const updatedContent = editedQuestions[practiceNumber]?.content;
      const updatedResult = editedQuestions[practiceNumber]?.result;
      setFilteredQuestions(
        (prev) =>
          prev?.map((q) =>
            q.practiceNumber === practiceNumber
              ? { ...q, content: updatedContent, result: updatedResult }
              : q
          ) || null
      );
    }
  };

  const handleInputChange = (
    practiceNumber: number,
    field: "content" | "result",
    value: string
  ) => {
    setEditedQuestions((prev) => ({
      ...prev,
      [practiceNumber]: { ...prev[practiceNumber], [field]: value },
    }));
  };

  const saveSelectedQuestions = async () => {
    setLoading(true);
    try {
      const dataToSave: PracticeRequest[] = selectedQuestions.map(
        (practiceNumber) => {
          const originalQuestion = filteredQuestions?.find(
            (q) => q.practiceNumber === practiceNumber
          );
          const editedQuestion = editedQuestions[practiceNumber];

          return {
            practiceNumber,
            content: editedQuestion?.content || originalQuestion?.content || "",
            additionalResults: [],
            result: editedQuestion?.result || originalQuestion?.result || "",
            solution: "",
            practiceType: originalQuestion?.practiceType || "OX",
          };
        }
      );

      await savePracticeQuestions(noteId, dataToSave);
      alert("선택된 문제들이 저장되었습니다.");

      // 저장 성공 후 context의 questions를 초기화
      setQuestions([]); // context에서 questions 삭제
      await loadPractice(); // 저장 후 API 호출을 통해 최신 데이터를 다시 로드
      setIsEditable(false); // 이후에는 수정 불가능하도록 설정
    } catch (error) {
      console.error("문제 저장 중 오류 발생:", error);
      alert("문제 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!filteredQuestions || filteredQuestions.length === 0) {
    return (
      <div className="flex h-[84vh] justify-center items-center bg-secondaryGray/45">
        <p className="text-gray-400 text-lg ">
          아직 생성된 문제가 없어요. 다시 문제를 생성해주세요!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <table className="px-5 py-2 table-fixed w-full text-left text-white border-separate border-spacing-0.2">
        <thead>
          <tr className="bg-black-80 text-center whitespace-nowrap m-2">
            <th className="w-[10%] p-4">선택</th>
            <th className="w-[15%] p-4">문제유형</th>
            <th className="w-[45%] p-4">문제</th>
            <th className="w-[20%] p-4">답</th>
            <th className="w-[10%] p-4">수정</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((question) => (
            <tr
              key={question.practiceNumber}
              className="bg-black-90 text-center "
            >
              {/* 선택 */}
              <td className="p-2 ">
                <div className="flex justify-center items-center">
                  <CheckCircle
                    isChecked={selectedQuestions.includes(
                      question.practiceNumber
                    )}
                    onChange={() => toggleSelect(question.practiceNumber)}
                  />
                </div>
              </td>

              {/* 문제유형 */}
              <td className="p-4 ">
                <div className="whitespace-nowrap items-center w-full flex flex-col">
                  <Button
                    label={
                      question.practiceType === "OX" ? "O X 퀴즈" : "단답형"
                    }
                    variant="select"
                    disabled={true}
                  />
                </div>
              </td>

              {/* 문제 */}
              <td className="p-4 text-start">
                {editMode[question.practiceNumber] ? (
                  <FormInput
                    name="content"
                    defaultValue={
                      editedQuestions[question.practiceNumber]?.content ||
                      question.content
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        question.practiceNumber,
                        "content",
                        e.target.value
                      )
                    }
                    className="p-2 w-full"
                  />
                ) : (
                  question.content
                )}
              </td>

              {/* 답 */}
              <td className="p-4">
                {editMode[question.practiceNumber] ? (
                  <FormInput
                    name="result"
                    defaultValue={
                      editedQuestions[question.practiceNumber]?.result ||
                      question.result
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        question.practiceNumber,
                        "result",
                        e.target.value
                      )
                    }
                    className="w-[60px]"
                  />
                ) : (
                  question.result
                )}
              </td>

              {/* 수정 */}
              <td className="p-4">
                <div className="flex justify-center">
                  <Icon
                    label="update"
                    size={20}
                    onClick={() => toggleEditMode(question.practiceNumber)}
                    alt="수정 아이콘"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 저장 버튼 */}
      {isEditable && (
        <div className="z-40 w-full flex justify-end p-10">
          <Button label="저장" variant="next" onClick={saveSelectedQuestions} />
        </div>
      )}
    </div>
  );
};

export default ReviewQuestions;
