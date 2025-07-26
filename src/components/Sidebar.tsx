import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  FolderOpen, 
  MessageSquare, 
  Globe, 
  Settings,
  Building2,
  Bell,
  History
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { name: 'Tableau de bord', path: '/dashboard', icon: Home },
  { name: 'Membres', path: '/members', icon: Users, badge: 12 },
  { name: 'Cotisations', path: '/cotisations', icon: CreditCard, badge: 3 },
  { name: 'Événements', path: '/events', icon: Calendar },
  { name: 'Finances', path: '/finances', icon: DollarSign },
  { name: 'Documents', path: '/documents', icon: FolderOpen },
  { name: 'Messagerie', path: '/messages', icon: MessageSquare, badge: 5 },
  { name: 'Historique', path: '/history', icon: History },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Paramètres', path: '/settings', icon: Settings },
  { name: 'Profil public', path: '/public-profile', icon: Globe },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-white shadow-lg border-r border-gray-200 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        w-64 flex flex-col
      `}>
        {/* En-tête du sidebar */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Mon Association</h2>
              <p className="text-sm text-gray-500">Association Communautaire</p>
            </div>
          </div>
        </div>

        {/* Navigation avec scroll */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${isActive 
                      ? 'bg-white text-purple-500' 
                      : 'bg-purple-500 text-white'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer du sidebar */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">admin@asso.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
