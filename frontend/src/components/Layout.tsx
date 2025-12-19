import { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  const mainRef = useRef<HTMLElement>(null);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ScrollToTop scrollContainerRef={mainRef} />

      {/* Fixed Navbar at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Scrollable Main Content */}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto bg-gray-50"
        style={{ marginTop: '34px', marginBottom: '30px' }}
      >
        <Outlet />
      </main>

      {/* Fixed Footer at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>
    </div>
  );
}
