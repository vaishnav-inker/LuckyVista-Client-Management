import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { useViewport } from '../../hooks/useViewport';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isMobile } = useViewport();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Desktop Sidebar - always visible on desktop */}
      {!isMobile && (
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Mobile Menu - overlay on mobile */}
      {isMobile && (
        <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMobileMenuClose}>
          <Sidebar isMobileMenuOpen={isMobileMenuOpen} onMobileMenuClose={handleMobileMenuClose} />
        </MobileMenu>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          title={title}
          onMobileMenuToggle={isMobile ? handleMobileMenuToggle : undefined}
          showMobileMenu={isMobile}
        />

        {/* Main Content */}
        <main className="p-4 sm:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
