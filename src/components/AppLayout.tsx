import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
  showFooter?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  sidebarOpen, 
  onToggleSidebar, 
  onCloseSidebar,
  showFooter = true
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} closeSidebar={onCloseSidebar} />
        <div className="flex-1 lg:ml-64 flex flex-col">
          <Header onMenuToggle={onToggleSidebar} isMenuOpen={sidebarOpen} />
          <main className="flex-1 p-6">
            {children}
          </main>
          {showFooter && <Footer />}
        </div>
      </div>
    </div>
  );
};
