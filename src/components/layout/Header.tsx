import { useViewport } from '../../hooks/useViewport';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title?: string;
  onMobileMenuToggle?: () => void;
  showMobileMenu?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Super Admin Portal',
  onMobileMenuToggle,
  showMobileMenu = false,
}) => {
  const { isMobile } = useViewport();

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {/* Hamburger menu for mobile */}
        {isMobile && onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        
        {/* Page title - truncate on mobile */}
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
          {title}
        </h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notification bell - hidden on mobile */}
        {!isMobile && (
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        )}
        
        {/* User avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          SA
        </div>
      </div>
    </header>
  );
};
