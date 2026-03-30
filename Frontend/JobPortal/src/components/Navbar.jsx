import React from 'react';
import { Menu, Bell } from 'lucide-react';

const Navbar = ({ toggleSidebar, user }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const displayName = user?.name || user?.username || 'User';

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-[72px] flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>
      
      <div className="flex items-center space-x-5">
        <button className="text-gray-400 hover:text-secondary transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="flex flex-col items-end hidden sm:block">
            <span className="text-sm font-semibold text-secondary">{displayName}</span>
            <span className="text-xs font-medium text-gray-400">{user?.role === 'RECRUITER' ? 'Recruiter' : 'Job Seeker'}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex flex-shrink-0 items-center justify-center text-primary font-bold shadow-sm group-hover:shadow transition-all">
            {getInitials(displayName)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
