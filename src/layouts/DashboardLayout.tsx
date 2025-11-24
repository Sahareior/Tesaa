import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAppStore } from '@/store';
import { useBreakpoint } from '@/hooks';

export function DashboardLayout() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  const { isMobile } = useBreakpoint();

  React.useEffect(() => {
    // Auto-collapse sidebar on mobile
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, setSidebarCollapsed]);

  return (
    <div className="flex h-screen bg-bg-page dark:bg-dark-bg-page">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar />
        
        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-hidden"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}