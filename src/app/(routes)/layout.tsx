"use client";

import Sidebar from "@/app/components/utils/Sidebar";
import { PracticeProvider } from "@/app/context/PracticeContext";
import { usePathname } from "next/navigation";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith("/login");

  return (
    <div>
      <PracticeProvider>
        <div className="flex bg-black">
          {!isLoginPage && <Sidebar />}
          <div className="flex-1 bg-black-90">{children}</div>
        </div>
      </PracticeProvider>
    </div>
  );
}
