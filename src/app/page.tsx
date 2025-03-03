"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Home = () => {
  const router = useRouter();
  const [role, setRole] = useState<"professor" | "student" | "undefined">(
    "undefined"
  );

  const handleNextButton = () => {
    if (role !== "undefined") {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-row bg-black-90 w-full h-full justify-center items-center">
      <div className="h-lvh flex flex-col justify-center items-center">
        <div>
          <div className="font-Pretendard font-bold text-xl text-white whitespace-nowrap text-center">
            역할을 선택해주세요
          </div>
          <p className="font-Pretendard font-normal text-base text-center text-black-60 mt-2">
            학생 서비스는 아직 준비 중이에요!
            <br />
            빠른 시일 내로 제공해드릴게요 :)
          </p>
          <div className="flex justify-center items-center flex-col mt-6 gap-5">
            <div className="flex gap-5">
              <div className="flex flex-col gap-2 items-center group">
                <button
                  onClick={() => setRole("professor")}
                  className="bg-black-80 text-white font-Pretendard text-xl flex flex-col justify-center items-center gap-2 p-4 rounded-lg transition-all duration-300 ease-in-out "
                >
                  <Image
                    src={
                      role === "professor"
                        ? "active_professor.svg"
                        : "professor.svg"
                    }
                    alt="professor-logo"
                    width={124}
                    height={124}
                    className="transition-all duration-300 ease-in-out group-hover:scale-110"
                  />
                </button>

                <p
                  className={`h-0.5 w-0 bg-transparent transition-all duration-300 ease-in-out ${
                    role === "professor"
                      ? "w-full bg-primary"
                      : "group-hover:w-full group-hover:bg-primary"
                  }`}
                ></p>

                <p
                  className={`text-base font-normal transition-all duration-300 ${
                    role === "professor"
                      ? "text-primary"
                      : "group-hover:text-primary text-white"
                  }`}
                >
                  교수자
                </p>
              </div>

              <div className="flex flex-col gap-2 items-center">
                <button
                  onClick={() => setRole("student")}
                  className="bg-black-80 text-black-60 font-Pretendard text-xl rounded-lg flex flex-col gap-2 p-4 justify-center items-center"
                  disabled
                >
                  <Image
                    src="student.svg"
                    alt="student-logo"
                    width={124}
                    height={70}
                    className="opacity-40"
                  />
                </button>
                <p className="text-base text-black-60 font-normal">학생</p>
              </div>
            </div>

            {/* 다음 버튼 */}
            <button
              onClick={handleNextButton}
              className={`px-12 py-2 font-semibold rounded-3xl transition-all duration-300 ${
                role !== "undefined"
                  ? "bg-primary text-white hover:scale-105"
                  : "bg-black-80 text-black-70"
              }`}
              disabled={role === "undefined"}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
