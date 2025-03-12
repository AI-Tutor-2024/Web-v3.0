import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import apiClient, { setAuthToken } from "@/app/utils/api";
import toast from "react-hot-toast";
import { refreshAuthToken } from "@/app/api/auth/[...nextauth]/auth";

const useAuthInterceptor = () => {
  const { data: session, update } = useSession();
  const BASE_TIMEOUT = 1000 * 60 * 30;

  useEffect(() => {
    if (!session?.user?.aiTutorToken) {
      setAuthToken(null);
      return;
    }

    setAuthToken(session.user.aiTutorToken);

    const timer = setTimeout(async () => {
      if (!session.user.refreshToken) return;

      const newTokens = await refreshAuthToken(session.user.refreshToken);

      if (newTokens) {
        await update({
          user: {
            ...session.user,
            aiTutorToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          },
        });
        setAuthToken(newTokens.accessToken);
      } else {
        toast.error("토큰 갱신 실패, 다시 로그인 해주세요.");
        signOut({ callbackUrl: "/login" });
      }
    }, BASE_TIMEOUT);

    return () => clearTimeout(timer);
  }, [session, update]);

  return null;
};

export default useAuthInterceptor;
