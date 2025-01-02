// 프로젝트 루트에 위치한 middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // 보호할 라우트를 설정합니다
  const protectedRoutes = ["/home", "/notes"];

  // 요청된 경로가 보호된 라우트인지 확인
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 이 설정은 /home 및 /notes와 해당 하위 경로에만 미들웨어를 적용합니다
export const config = {
  matcher: ["/home/:path*", "/notes/:path*"],
};
