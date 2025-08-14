import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import AIAssistant from './AIAssistantOptimized';
import { useAIContext } from '../hooks/useAIContext';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
  showFooter?: boolean;
  overrideAI?: {
    show?: boolean;
    size?: 'small' | 'medium' | 'large';
    theme?: 'light' | 'dark' | 'auto';
    defaultExpanded?: boolean;
  };
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  sidebarOpen, 
  onToggleSidebar, 
  onCloseSidebar,
  showFooter = true,
  overrideAI
}) => {
  const aiContext = useAIContext();
  const location = useLocation();

  // Configuration intelligente de l'assistant IA basée sur la page
  const getAIConfig = () => {
    const pathname = location.pathname;
    
    // Configuration par défaut intelligente
    let config = {
      show: true,
      size: 'medium' as const,
      theme: 'auto' as const,
      defaultExpanded: false
    };

    // Pages avec assistant IA étendu
    if (pathname.includes('/guidance')) {
      config = {
        show: true,
        size: 'large',
        theme: 'auto',
        defaultExpanded: true // Ouvert par défaut pour les guidances
      };
    }
    // Dashboard - assistant visible mais compact
    else if (pathname.includes('/dashboard')) {
      config = {
        show: true,
        size: 'medium',
        theme: 'auto',
        defaultExpanded: false
      };
    }
    // Pages financières - assistant spécialisé
    else if (pathname.includes('/finance') || pathname.includes('/cotisation') || pathname.includes('/billing')) {
      config = {
        show: true,
        size: 'medium',
        theme: 'auto',
        defaultExpanded: false
      };
    }
    // Pages de gestion - assistant compact
    else if (pathname.includes('/member') || pathname.includes('/event') || pathname.includes('/document') || pathname.includes('/resource')) {
      config = {
        show: true,
        size: 'small',
        theme: 'auto',
        defaultExpanded: false
      };
    }
    // Pages de communication - assistant masqué
    else if (pathname.includes('/message') || pathname.includes('/notification') || pathname.includes('/chat')) {
      config = {
        show: false,
        size: 'small',
        theme: 'auto',
        defaultExpanded: false
      };
    }
    // Pages de paramètres - assistant minimal
    else if (pathname.includes('/setting') || pathname.includes('/security') || pathname.includes('/history')) {
      config = {
        show: true,
        size: 'small',
        theme: 'auto',
        defaultExpanded: false
      };
    }

    // Application des surcharges
    if (overrideAI) {
      config = {
        ...config,
        ...overrideAI
      };
    }

    return config;
  };

  const aiConfig = getAIConfig();

  return (
    <div className="min-h-screen bg-purple-900 flex flex-col relative">
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} closeSidebar={onCloseSidebar} />
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          <Header onMenuToggle={onToggleSidebar} isMenuOpen={sidebarOpen} />
          <main className="flex-1 p-3 sm:p-4 md:p-6 pt-3 sm:pt-4 md:pt-6 bg-purple-900 overflow-x-hidden">
            <div className="max-w-full">
              {children}
            </div>
          </main>
          {showFooter && <Footer />}
        </div>
      </div>
      
      {/* Assistant IA Global - Positionné intelligemment */}
      {aiConfig.show && (
        <div className="fixed bottom-6 left-6 z-50 hidden sm:block">
          <AIAssistant 
            context={{
              currentPage: aiContext.currentPage,
              userRole: aiContext.userRole,
              maturityLevel: aiContext.maturityLevel
            }}
            position="fixed"
            size={aiConfig.size}
            theme={aiConfig.theme}
            defaultExpanded={aiConfig.defaultExpanded}
            className="shadow-2xl backdrop-blur-sm"
          />
        </div>
      )}

      {/* Version mobile - Assistant IA en bas */}
      {aiConfig.show && (
        <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
          <AIAssistant 
            context={{
              currentPage: aiContext.currentPage,
              userRole: aiContext.userRole,
              maturityLevel: aiContext.maturityLevel
            }}
            position="fixed"
            size="small"
            theme={aiConfig.theme}
            defaultExpanded={false}
            className="shadow-xl backdrop-blur-sm w-full"
          />
        </div>
      )}
    </div>
  );
};
