import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export default function ScrollToTop({ scrollContainerRef }: ScrollToTopProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    // If a scroll container ref is provided, scroll that element
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      // Otherwise, scroll the window
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname, scrollContainerRef]);

  return null;
}
