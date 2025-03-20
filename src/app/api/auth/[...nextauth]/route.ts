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

      if (token.aiTutorToken) {
        cookies().set("aiTutorToken", token.aiTutorToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          domain:
            process.env.NODE_ENV === "production"
              ? ".ai-tutor.co.kr"
              : undefined,
        });

        if (token.refreshToken) {
          cookies().set("refreshToken", token.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            domain:
              process.env.NODE_ENV === "production"
                ? ".ai-tutor.co.kr"
                : undefined,
          });
        }
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/home",
  },
});

export { handler as GET, handler as POST };
