import React from 'react';
import { PublicHeader } from './PublicHeader';
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
      {/* Breadcrumb supprimé */}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
