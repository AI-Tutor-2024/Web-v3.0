"use client";

import Sidebar from "@/app/components/utils/Sidebar";
import { PracticeProvider } from "@/app/context/PracticeContext";
import { usePathname } from "next/navigation";
import Header from "@/app/components/utils/Header";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";
import useAuthInterceptor from "../hooks/auth/useAuthInterceptor";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith("/login");

  useAuthInterceptor();

  return (
    <div>
      <PracticeProvider>
        <Toaster />
        <div className="flex bg-black">
          {!isLoginPage && <Sidebar />}
          <div className="flex flex-col w-full">
            <div className="flex-1 bg-black-90">{children}</div>
          </div>
        </div>
      </PracticeProvider>
    </div>
  );
}
