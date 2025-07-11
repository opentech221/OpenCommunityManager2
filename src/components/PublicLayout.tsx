import React from 'react';
import { PublicHeader, PublicBreadcrumb } from './PublicHeader';
import { Footer } from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
  currentPage?: string;
  backTo?: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  showBreadcrumb = false, 
  currentPage = '', 
  backTo 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader />
      {showBreadcrumb && (
        <PublicBreadcrumb 
          currentPage={currentPage} 
          showBackButton={showBreadcrumb}
          backTo={backTo}
        />
      )}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
