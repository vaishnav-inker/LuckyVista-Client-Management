import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  onMobileMenuClose,
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-purple-600 to-purple-700 flex flex-col shadow-xl">
      {/* Logo Section */}
      <div className="p-6 flex items-center space-x-3 border-b border-purple-500">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <span className="text-white font-bold text-lg">Super Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-purple-500 text-white font-medium shadow-lg min-h-[44px]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Client Management</span>
        </button>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-purple-500">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">Super Admin</p>
            <p className="text-purple-200 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-purple-100 hover:bg-purple-500 transition-colors min-h-[44px]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};
