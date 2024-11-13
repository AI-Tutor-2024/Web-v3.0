"use client";

import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

const GoogleLoginCTA = () => {
  const handleGoogleLogin = () => {

    signIn("google", {
      callbackUrl: "/home"
    });
  };

  return (
    <button
      className="h-[57px] w-[264px] bg-mainWhite flex flex-col justify-center items-center rounded-md"
      onClick={handleGoogleLogin}
    >
      <div className="flex flex-row gap-3">
        <Image src="/google.svg" alt="google" width={24} height={24} />
        <p className="text-bgDeepGray flex flex-col justify-center text-center items-center">
          Google 계정으로 계속하기
        </p>
      </div>
    </button>
  );
};

export default GoogleLoginCTA;
