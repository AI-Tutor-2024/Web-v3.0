import { useSession, signOut } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { setAuthToken } from '@/app/utils/api';
import toast from 'react-hot-toast';
import { refreshAuthToken } from '@/app/api/auth/[...nextauth]/auth';

const useAuthInterceptor = () => {
  const { data: session, update } = useSession();
  const isRefreshing = useRef(false);

  const REFRESH_TIMEOUT = 1000 * 30 * 60;
  const REDIRECT_TIMEOUT = 1000 * 60 * 60 * 24;

  useEffect(() => {
    if (!session?.user?.aiTutorToken) {
      setAuthToken(null);
      return;
    }

    setAuthToken(session.user.aiTutorToken);

    const refreshTimer = setTimeout(async () => {
      if (isRefreshing.current) {
        return;
      }

      if (!session.user.refreshToken) {
        toast.error('리프레시 토큰이 없습니다. 다시 로그인해주세요.');
        signOut({ callbackUrl: '/login' });
        return;
      }

      try {
        isRefreshing.current = true;

        const newTokens = await refreshAuthToken(session.user.refreshToken);

        if (!newTokens?.accessToken || !newTokens?.refreshToken) {
          throw new Error('토큰 갱신 응답이 올바르지 않습니다.');
        }

        setAuthToken(newTokens.accessToken);

        const updatedSession = await update({
          user: {
            ...session.user,
            aiTutorToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          },
        });

        if (!updatedSession?.user?.aiTutorToken) {
          throw new Error('세션 업데이트 실패');
        }

        toast.success('세션이 갱신되었습니다.');
      } catch (error: any) {
        toast.error(`세션 갱신 실패: ${error.message}`);
        signOut({ callbackUrl: '/login' });
      } finally {
        isRefreshing.current = false;
      }
    }, REFRESH_TIMEOUT);

    const redirectTimer = setTimeout(() => {
      signOut({ callbackUrl: '/login' });
    }, REDIRECT_TIMEOUT);

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(redirectTimer);
    };
  }, [session?.user?.aiTutorToken]);

  return null;
};

export default useAuthInterceptor;
