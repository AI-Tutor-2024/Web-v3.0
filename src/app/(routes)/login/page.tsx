"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const GoogleLoginCTA = dynamic(
  () => import("@/app/components/utils/GoogleLoginCTA"),
  { ssr: false }
);

const Login = () => {
  const [isClient, setIsClient] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 사용자가 로그인된 상태면 /home으로 리디렉션
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);

  if (status === "authenticated") {
    return null; // 리디렉션이 일어나기 전까지 이 컴포넌트를 숨깁니다.
  }

  console.log("status", status, "session", session);

  return (
    <div className="w-full h-screen bg-black-90 flex flex-col md:flex-row">
      <div className="text-white w-full">
        <div className="fixed py-8 px-8">
          <Link href="/home">
            <Image src="/icon.svg" alt="logo" width={100} height={100} />
          </Link>
        </div>
        <div className="h-full flex flex-col justify-center px-8 items-start">
          <div className="flex flex-col relative justify-start items-start">
            {isClient && (
              <div className="h-[50px] w-[50px] md:h-[70px] md:w-[70px] z-10 ml-[-10px] md:ml-[-20px]">
                <Lottie
                  loop={true}
                  animationData={require("../../../../public/BouncingBall.json")}
                />
              </div>
            )}
            <section className="overflow-auto md:overflow-hidden">
              <div className="animate-[textAnimation_8s_infinite] md:whitespace-nowrap">
                <p className="font-Pretendard font-normal text-[20px] md:text-[28px] block">
                  녹화한 강의 영상을 업로드 해보세요!
                </p>
                <p className="font-Pretendard font-normal text-[20px] md:text-[28px] block">
                  1단계 : 학생들에게 제공할 문제 유형을 선택해보세요
                </p>
                <p className="font-Pretendard font-normal text-[20px] md:text-[28px] block">
                  2단계 : 생성될 문제를 확인하고 수정해보세요
                </p>
                <p className="font-Pretendard font-normal text-[20px] md:text-[28px] block">
                  3단계 : 마지막으로 생성된 문제와 요약문을 학습자에게
                  전달해보세요!
                </p>
                <p className="font-Pretendard font-normal text-[20px] md:text-[28px] block">
                  이제 AI Tutor와 함께 질문 및 요약문을 생성하러 가볼까요?
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center bg-black-90 w-full md:w-1/3">
        <div className="text-white font-Pretendard font-normal text-xl whitespace-nowrap md:text-[24px] px-4 py-4">
          <p>자기주도학습 시작하기</p>
        </div>
        <GoogleLoginCTA />
      </div>
    </div>
  );
};

export default Login;
