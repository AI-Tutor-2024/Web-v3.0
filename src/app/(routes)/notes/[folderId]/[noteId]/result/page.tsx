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
        const fetchedQuestions = await fetchPractice(Number(noteId));
        if (fetchedQuestions.information.length > 0) {
          setQuestions(fetchedQuestions.information);
        }

        const response = await axios.get(`/api/summary/${noteId}`);
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [noteId, setQuestions, setSummary]);

  return (
    <>
      <div className="flex justify-between items-center">
        <Info folderName={folderName} professorName={professor} />
      </div>

      <div className="flex flex-col">
        <div className="w-full flex justify-center items-stretch">
          <button
            className={`w-full py-2 border-b-2 font-medium ${
              activeTab === "questions"
                ? "border-primary text-primary bg-black-90"
                : "border-black-80 text-white bg-black-90"
            }`}
            onClick={() => handleTabChange("questions")}
          >
            복습 문제 확인 및 선택
          </button>
          <button
            className={`w-full py-2 border-b-2 font-medium ${
              activeTab === "summary"
                ? "border-primary text-primary bg-black-90"
                : "border-black-80 text-white bg-black-90"
            }`}
            onClick={() => handleTabChange("summary")}
          >
            요약문 확인
          </button>
        </div>

        {activeTab === "questions" && (
          <ReviewQuestions noteId={Number(noteId)} />
        )}
        {activeTab === "summary" && <SummaryText noteId={Number(noteId)} />}
      </div>
    </>
  );
};

export default ResultPage;
