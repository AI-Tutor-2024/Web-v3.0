import NextAuth from "next-auth";

// `Session` 타입을 확장해 `accessToken` 속성을 추가
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
