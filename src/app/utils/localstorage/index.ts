export const getIsFirstTimeUser = (): boolean => {
  if (typeof window !== 'undefined') {
    const value: string | null = localStorage.getItem('isFirstTimeUser'); // "true" or "false"
    if (value === null) {
      return true;
    }

    return value === 'true';
  }

  return true;
};

export const setIsFirstTimeUser = (value: boolean): void => {
  if (typeof window != 'undefined') {
    localStorage.setItem('isFirstTimeUser', value.toString());
  }
};
