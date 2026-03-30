import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Briefcase, X, Bot, FileText, ClipboardList } from 'lucide-react';

const Sidebar = ({ role, isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = role === 'USER' 
    ? [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/user-dashboard' },
        { name: 'AI Interview', icon: Bot, path: '/ai-interview' },
      ]
    : [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/recruiter-dashboard' },
      ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-secondary/20 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-[72px] px-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 text-primary font-bold tracking-tight text-xl">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <Briefcase size={20} />
            </div>
            <span>NovaJobs</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-secondary transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col flex-1 overflow-y-auto py-6">
          <nav className="flex-1 px-4 space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-secondary"}
                  `}
                >
                  <Icon className="w-[18px] h-[18px] mr-3" />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>
          
          <div className="p-4 mt-auto">
            <button 
              onClick={handleLogout}
              className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-500 rounded-xl hover:bg-red-50 hover:text-error transition-all duration-200"
            >
              <LogOut className="w-[18px] h-[18px] mr-3 group-hover:text-error transition-colors" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
