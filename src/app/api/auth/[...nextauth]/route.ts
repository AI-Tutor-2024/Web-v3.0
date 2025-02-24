import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { aiTutorSignIn } from "@/app/api/auth/[...nextauth]/auth";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token as string;

        if (user?.email) {
          try {
            const response = await aiTutorSignIn(
              token.accessToken as string | null,
              {
                email: user.email,
                providerId: user.id,
              }
            );

            if (response.accessToken) {
              cookies().set("aiTutorToken", response.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
              });

              if (typeof response.refreshToken === "string") {
                cookies().set("refreshToken", response.refreshToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
                  path: "/",
                });
              }

              return {
                ...token,
                aiTutorToken: response.accessToken,
                refreshToken: response.refreshToken,
              };
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.aiTutorToken = token.aiTutorToken;
      session.user.refreshToken = token.refreshToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/home",
  },
});

export { handler as GET, handler as POST };
