// utils/api.ts
import axios from "axios";
import { baseURL } from "@/app/api/index"; 

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken"); // 예시로 localStorage에서 토큰을 가져옴
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정 (필요에 따라 추가 가능)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리 로직 추가 가능
    return Promise.reject(error);
  }
);

export default apiClient;