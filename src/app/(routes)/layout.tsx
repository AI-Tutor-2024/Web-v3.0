'use client';

import Sidebar from '@/app/components/utils/Sidebar';
import { PracticeProvider } from '@/app/context/PracticeContext';
import { usePathname } from 'next/navigation';
import '@/app/globals.css';
import { Toaster } from 'react-hot-toast';
import useAuthInterceptor from '../hooks/auth/useAuthInterceptor';
import OnBoardingModal from '../components/molecules/OnBoardingModal';
import useFetchFolderContent from '../hooks/folder/useFetchFolderContent';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setAuthToken } from '@/app/utils/api';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith('/login');
  const { data: session } = useSession();
  const token = session?.user?.aiTutorToken;

  useAuthInterceptor();
  const { data } = useFetchFolderContent(token ?? undefined);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  return (
    <div>
      <PracticeProvider>
        <OnBoardingModal />
        <Toaster />
        <div className="flex bg-black">
          {!isLoginPage && <Sidebar data={data} />}
          <div className="flex flex-col w-full">
            <div className="flex-1 bg-black-90">{children}</div>
          </div>
        </div>
      </PracticeProvider>
    </div>
  );
}
