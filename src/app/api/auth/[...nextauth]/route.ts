import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token as string;
        console.log("JWT Callback - Access Token:", token.accessToken); // 디버깅용 로그
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      console.log("Session Callback - Access Token:", session.accessToken); // 디버깅용 로그
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/home", // 로그인이 필요한 경우 리디렉션할 페이지 경로를 지정
  },
});

export { handler as GET, handler as POST };
