import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="erp-layout">
      {/* Sidebar Panel */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleCollapse={toggleSidebar} />

      {/* Main Content Container */}
      <div className="erp-content-container">
        <Header isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        
        {/* Scrollable Workarea */}
        <main className="erp-main-area">
          <div className="container-fluid py-4 px-3 px-md-4 px-lg-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
