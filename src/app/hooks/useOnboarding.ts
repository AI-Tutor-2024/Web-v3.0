import { getIsFirstTimeUser, setIsFirstTimeUser } from '../utils/localstorage'; //@
import { useEffect, useState } from 'react';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (getIsFirstTimeUser()) {
      setShowOnboarding(true);
    }
  }, []);

  const closeOnboarding = () => {
    setShowOnboarding(false);
    setIsFirstTimeUser(false);
  };

  return { showOnboarding, closeOnboarding };
};
