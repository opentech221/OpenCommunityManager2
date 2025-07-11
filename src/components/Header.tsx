import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  Search,
  ChevronDown,
  Plus,
  HelpCircle,
  Moon,
  Sun,
  CreditCard,
  Shield,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Check,
  Trash2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuthContext';
import { useTheme } from '../hooks/useTheme';
import { APP_NAME, ROUTES } from '../constants';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'member' | 'event' | 'document' | 'cotisation';
  route: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'member' | 'event' | 'document' | 'cotisation';
  route: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nouveau membre',
      message: 'Fatou Camara a rejoint votre association',
      time: 'Il y a 5 min',
      read: false,
      type: 'success'
    },
    {
      id: '2',
      title: 'Cotisation en retard',
      message: '3 membres ont des cotisations en retard',
      time: 'Il y a 1h',
      read: false,
      type: 'warning'
    },
    {
      id: '3',
      title: 'Événement demain',
      message: 'Assemblée générale programmée à 14h',
      time: 'Il y a 2h',
      read: true,
      type: 'info'
    },
    {
      id: '4',
      title: 'Paiement reçu',
      message: 'Cotisation de Moussa Diallo confirmée',
      time: 'Il y a 3h',
      read: true,
      type: 'success'
    }
  ]);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  
  const { logout, association } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  // Actions rapides
  const quickActions: QuickAction[] = [
    {
      id: 'member',
      title: 'Nouveau membre',
      description: 'Ajouter un membre à votre association',
      icon: <Users className="w-4 h-4" />,
      route: '/members?action=add',
      color: 'text-blue-600'
    },
    {
      id: 'event',
      title: 'Nouvel événement',
      description: 'Créer un événement ou une activité',
      icon: <Calendar className="w-4 h-4" />,
      route: '/events?action=add',
      color: 'text-green-600'
    },
    {
      id: 'document',
      title: 'Document',
      description: 'Télécharger un document',
      icon: <FileText className="w-4 h-4" />,
      route: '/documents?action=upload',
      color: 'text-purple-600'
    },
    {
      id: 'cotisation',
      title: 'Cotisation',
      description: 'Enregistrer un paiement',
      icon: <DollarSign className="w-4 h-4" />,
      route: '/cotisations?action=add',
      color: 'text-orange-600'
    }
  ];

  // Données de recherche mockées
  const allSearchData: SearchResult[] = useMemo(() => [
    { id: '1', title: 'Mamadou Diallo', subtitle: 'Président', type: 'member', route: '/members/1' },
    { id: '2', title: 'Fatou Camara', subtitle: 'Trésorière', type: 'member', route: '/members/2' },
    { id: '3', title: 'Assemblée générale', subtitle: 'Demain à 14h', type: 'event', route: '/events/1' },
    { id: '4', title: 'Rapport financier 2024', subtitle: 'Document PDF', type: 'document', route: '/documents/1' },
    { id: '5', title: 'Cotisations janvier', subtitle: '15 paiements', type: 'cotisation', route: '/cotisations?month=1' },
  ], []);

  // Fermer les menus quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setIsQuickActionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recherche en temps réel
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = allSearchData.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allSearchData]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsProfileOpen(false);
  };

  const handleHelp = () => {
    navigate(ROUTES.HELP);
    setIsProfileOpen(false);
  };

  const handleBilling = () => {
    navigate('/billing');
    setIsProfileOpen(false);
  };

  const handleSecurity = () => {
    navigate('/security');
    setIsProfileOpen(false);
  };

  const handleQuickAction = (action: QuickAction) => {
    navigate(action.route);
    setIsQuickActionsOpen(false);
  };

  const handleSearchResult = (result: SearchResult) => {
    navigate(result.route);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getSearchIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'member': return <Users className="w-4 h-4 text-blue-500" />;
      case 'event': return <Calendar className="w-4 h-4 text-green-500" />;
      case 'document': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'cotisation': return <DollarSign className="w-4 h-4 text-orange-500" />;
      default: return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Section gauche */}
        <div className="flex items-center space-x-4">
          {/* Bouton menu */}
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            {isMenuOpen ? 
              <X className="w-5 h-5 text-gray-600" /> : 
              <Menu className="w-5 h-5 text-gray-600" />
            }
          </button>
          
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-montserrat font-bold text-gray-900">{APP_NAME}</h1>
              <p className="text-xs text-gray-500">{association?.name || 'Association'}</p>
            </div>
          </div>
        </div>

        {/* Section centre - Recherche */}
        <div className="hidden md:flex flex-1 max-w-md mx-8" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher membres, événements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            
            {/* Résultats de recherche */}
            {isSearchOpen && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {searchQuery ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Recherche pour "{searchQuery}" ({searchResults.length} résultats)
                    </div>
                    <div className="border-t border-gray-100">
                      {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleSearchResult(result)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                          >
                            {getSearchIcon(result.type)}
                            <div>
                              <div className="text-sm font-medium">{result.title}</div>
                              <div className="text-xs text-gray-500">{result.subtitle}</div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">Aucun résultat trouvé</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Tapez pour rechercher...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section droite */}
        <div className="flex items-center space-x-2">
          {/* Bouton recherche mobile */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Bouton d'actions rapides */}
          <div className="relative" ref={quickActionsRef}>
            <button 
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Nouveau</span>
            </button>

            {/* Menu des actions rapides */}
            {isQuickActionsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Actions rapides</h3>
                  <p className="text-xs text-gray-500">Créer rapidement un élément</p>
                </div>
                <div className="py-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                    >
                      <div className={`p-2 rounded-lg bg-gray-100 ${action.color}`}>
                        {action.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{action.title}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Menu notifications */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{unreadCount} non lues</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Tout marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`group px-4 py-3 hover:bg-gray-50 border-l-4 ${
                        notification.read ? 'border-transparent' : 'border-purple-500 bg-purple-50/30'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                              title="Marquer comme lu"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      navigate('/notifications');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bouton thème */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            {isDark ? 
              <Sun className="w-5 h-5 text-gray-600" /> : 
              <Moon className="w-5 h-5 text-gray-600" />
            }
          </button>

          {/* Profil utilisateur */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-700">Admin</div>
                <div className="text-xs text-gray-500">{association?.email || 'admin@email.com'}</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu profil */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Administrateur</div>
                      <div className="text-sm text-gray-500">{association?.name || 'Association'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={handleSettings}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Paramètres du compte</span>
                  </button>
                  <button 
                    onClick={handleBilling}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Facturation</span>
                  </button>
                  <button 
                    onClick={handleSecurity}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Sécurité</span>
                  </button>
                  <button 
                    onClick={handleHelp}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Aide & Support</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de recherche mobile */}
      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white m-4 rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-lg font-medium focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {searchQuery ? (
                searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        handleSearchResult(result);
                        setIsSearchOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100"
                    >
                      {getSearchIcon(result.type)}
                      <div>
                        <div className="text-sm font-medium">{result.title}</div>
                        <div className="text-xs text-gray-500">{result.subtitle}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    Aucun résultat trouvé pour "{searchQuery}"
                  </div>
                )
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  Tapez pour rechercher...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
