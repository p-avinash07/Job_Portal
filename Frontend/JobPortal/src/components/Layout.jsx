import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-[#1E293B]">
      <Sidebar 
        role={user?.role} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Navbar 
          toggleSidebar={() => setIsSidebarOpen(true)} 
          user={user} 
        />
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-4 sm:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
