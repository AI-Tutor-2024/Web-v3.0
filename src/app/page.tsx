"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from 'react';
const Home = () => {
  const router = useRouter();

  const handleProfessorClick = () => {
    router.push('/login');
  };
  
  return (
    <div className="flex flex-row bg-bgDeepGray">
      <div className="w-full h-lvh flex flex-col justify-center items-center">
        <div className="px-8 py-8 font-Pretendard font-semibold leading-[70px] text-[57px] text-customGreen">
        <div className="px-8 py-8 font-Pretendard font-semibold leading-[70px] text-[57px] text-customGreen">
          회원님의 신분을 선택해주세요
        </div>
        <div className="flex justify-center items-center space-x-4">
          <button className="bg-primaryGray text-white font-Pretendard text-[18px] hover:bg-customGreen active:bg-customGreen rounded-lg px-16 py-8 space-y-4" onClick={handleProfessorClick}>
            <Image src="professor.svg" alt="logo" width={100} height={100} />
            <p className="font-Pretendard font-normal text-2xl">교수자</p>
          </button>
            <button className="bg-[#242424] text-[#4F4F4F] font-Pretendard text-[18px] rounded-lg px-16 py-8 space-y-4" disabled>
              <Image src="student.svg" alt="logo" width={100} height={100} style={{ opacity: 0.2 }} />
              <p className="font-Pretendard font-normal text-2xl">학생</p>
            </button>
        </div>
        <p className="font-Pretendard font-normal text-base text-center text-gray-500 mt-2">학생 서비스는 현재 준비중입니다 :)<br/>빠른 시일 내로 준비하도록 하겠습니다.</p>
      </div>
    </div>
  </div>
  );
};

export default Home;