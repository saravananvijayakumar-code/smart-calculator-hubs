import { useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  children: ReactNode;
}

export const ScrollToTop = ({ children }: ScrollToTopProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top for all route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
};