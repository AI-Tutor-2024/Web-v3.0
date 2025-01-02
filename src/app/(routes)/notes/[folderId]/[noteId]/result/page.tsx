"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReviewQuestions from "@/app/components/organisms/ReviewQuestions";
import SummaryText from "@/app/components/organisms/SummaryText";
import Info from "@/app/components/molecules/Info";
import { usePracticeContext } from "@/app/context/PracticeContext";
import { fetchPractice } from "@/app/api/practice/fetchPractice";
import axios from "axios";

const ResultPage = () => {
  const { noteId } = useParams();
  const [activeTab, setActiveTab] = useState<"questions" | "summary">(
    "questions"
  );
  const {
    folderName,
    professor,
    questions,
    setQuestions,
    summary,
    setSummary,
  } = usePracticeContext();

  const handleTabChange = (tab: "questions" | "summary") => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 문제 목록 API 호출
        const fetchedQuestions = await fetchPractice(Number(noteId));
        if (fetchedQuestions.information.length > 0) {
          // API에서 데이터를 받은 경우, Context에 설정
          setQuestions(fetchedQuestions.information);
        }

        // 요약문 API 호출
        const response = await axios.get(`/api/summary/${noteId}`);
        if (response.data.summary) {
          // API에서 요약문을 받은 경우, Context에 설정
          setSummary(response.data.summary);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // API 호출을 먼저 하고, 저장된 데이터가 없는 경우 Context에 있는 데이터를 표시
    fetchData();
  }, [noteId, setQuestions, setSummary]);

  return (
    <>
      <div className="flex justify-between items-center">
        <Info folderName={folderName} professorName={professor} />
      </div>

      <div className="flex flex-col">
        {/* 탭 메뉴 */}
        <div className="w-full flex justify-center items-stretch">
          <button
            className={`w-full py-2 text-white ${
              activeTab === "questions" ? "bg-primary" : "bg-black-80"
            }`}
            onClick={() => handleTabChange("questions")}
          >
            생성된 복습 문제 확인 및 선택
          </button>
          <button
            className={`w-full py-2 text-white ${
              activeTab === "summary" ? "bg-primary" : "bg-black-80"
            }`}
            onClick={() => handleTabChange("summary")}
          >
            생성된 요약문 확인
          </button>
        </div>

        {/* 탭에 따른 컴포넌트 렌더링 */}
        {activeTab === "questions" && (
          <ReviewQuestions noteId={Number(noteId)} />
        )}
        {activeTab === "summary" && <SummaryText noteId={Number(noteId)} />}
      </div>
    </>
  );
};

export default ResultPage;
