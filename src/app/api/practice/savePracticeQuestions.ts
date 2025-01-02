// api/practiceApi.ts
import axios from "axios";
import { baseURL } from "../index";
import { PracticeRequest } from "@/app/types/practice";
import apiClient from "@/app/utils/api";

// 함수 정의
export default async function savePracticeQuestions(noteId: number, questions: PracticeRequest[]) {
  try {
    const response = await apiClient.post(`/api/v1/professor/practice/${noteId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questions),
    });
    console.log("response:", response);
    return response.data;
  } catch (error) {
    console.error("Error saving practice questions:", error);
    throw error;
  }
};
