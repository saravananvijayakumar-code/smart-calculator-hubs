import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = (trigger?: boolean) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (trigger !== false) {
      window.scrollTo(0, 0);
    }
  }, [pathname, trigger]);
};

export default useScrollToTop;