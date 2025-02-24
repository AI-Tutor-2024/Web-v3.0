import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      aiTutorToken?: string | null;
      refreshToken?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    aiTutorToken?: string | null;
    refreshToken?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    aiTutorToken?: string | null;
    refreshToken?: string | null;
  }
}
