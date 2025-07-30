import React, { useState } from 'react';
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
  History,
  Brain,
  ChevronDown,
  ChevronRight,
  Target,
  Lightbulb,
  CheckCircle,
  ClipboardList,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface SubMenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { name: 'Tableau de bord', path: '/dashboard', icon: Home },
  { 
    name: 'Guide Intuitif', 
    path: '/guidance', 
    icon: Brain,
    subItems: [
      { name: 'Diagnostic', path: '/guidance/diagnostic', icon: Target },
      { name: 'Recommandations', path: '/guidance/recommendations', icon: Lightbulb },
      { name: 'Conformité', path: '/guidance/compliance', icon: CheckCircle },
      { name: 'Plan d\'Action', path: '/guidance/action-plan', icon: ClipboardList },
      { name: 'Tableaux de Bord', path: '/guidance/analytics', icon: BarChart3 }
    ]
  },
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Guide Intuitif']);

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isSubmenuExpanded = (menuName: string) => expandedMenus.includes(menuName);
  
  const isPathActive = (path: string) => {
    if (path === '/guidance') {
      return location.pathname === path || location.pathname.startsWith('/guidance');
    }
    return location.pathname === path;
  };

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
            const isActive = isPathActive(item.path);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = isSubmenuExpanded(item.name);
            
            return (
              <div key={item.path}>
                {/* Menu principal */}
                <div className="flex items-center">
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors flex-1
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
                  
                  {hasSubItems && (
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`
                        p-2 rounded-lg transition-colors ml-1
                        ${isActive 
                          ? 'bg-purple-600 text-white hover:bg-orange-600' 
                          : 'text-gray-500 hover:bg-gray-100'
                        }
                      `}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Sous-menus */}
                {hasSubItems && isExpanded && (
                  <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = location.pathname === subItem.path;
                      
                      return (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={closeSidebar}
                          className={`
                            flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm
                            ${isSubActive 
                              ? 'bg-purple-100 text-purple-700 border-l-2 border-purple-500' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-purple-600' : 'text-gray-400'}`} />
                          <span>{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer du sidebar */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-600">admin@asso.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
