import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css"; // 전역 스타일 적용

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Next App",
  description: "This is my Next.js 14 App with Google Login",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}
