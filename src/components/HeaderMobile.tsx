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

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // États pour les modales et menus
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Refs pour gérer les clics extérieurs
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);

  // Notifications mockées optimisées pour mobile
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nouveau membre',
      message: 'Marie Dubois a rejoint l\'association',
      time: 'Il y a 5 min',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Cotisation en retard',
      message: '3 membres n\'ont pas payé leur cotisation',
      time: 'Il y a 1h',
      read: false,
      type: 'warning'
    },
    {
      id: '3',
      title: 'Événement confirmé',
      message: 'Assemblée générale du 25/12 confirmée',
      time: 'Il y a 2h',
      read: true,
      type: 'success'
    }
  ]);

  // Résultats de recherche mockés
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim()) return [];
    
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Jean Dupont',
        subtitle: 'Membre - Trésorier',
        type: 'member',
        route: '/members/1'
      },
      {
        id: '2',
        title: 'Assemblée Générale 2024',
        subtitle: 'Événement - 25 décembre 2024',
        type: 'event',
        route: '/events/1'
      },
      {
        id: '3',
        title: 'Rapport financier Q4',
        subtitle: 'Document - PDF',
        type: 'document',
        route: '/documents/1'
      },
      {
        id: '4',
        title: 'Cotisation 2024',
        subtitle: 'Cotisation - 50€',
        type: 'cotisation',
        route: '/cotisations/1'
      }
    ];

    return mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const unreadNotifications = notifications.filter(n => !n.read);

  // Fermer les menus lors du clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (createRef.current && !createRef.current.contains(event.target as Node)) {
        setIsCreateOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer la recherche mobile avec Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isSearchOpen]);

  // Handlers
  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleSearchSelect = (result: SearchResult) => {
    navigate(result.route);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleCreateAction = (type: string) => {
    setIsCreateOpen(false);
    switch (type) {
      case 'member':
        navigate(ROUTES.MEMBERS);
        break;
      case 'event':
        navigate(ROUTES.EVENTS);
        break;
      case 'document':
        navigate(ROUTES.DOCUMENTS);
        break;
      case 'cotisation':
        navigate(ROUTES.COTISATIONS);
        break;
    }
  };

  const handleProfileAction = (action: string) => {
    setIsProfileOpen(false);
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate(ROUTES.SETTINGS);
        break;
      case 'billing':
        navigate(ROUTES.BILLING);
        break;
      case 'security':
        navigate(ROUTES.SECURITY);
        break;
      case 'help':
        navigate(ROUTES.HELP);
        break;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getSearchIcon = (type: string) => {
    const iconProps = { className: "h-4 w-4 text-gray-400" };
    switch (type) {
      case 'member': return <Users {...iconProps} />;
      case 'event': return <Calendar {...iconProps} />;
      case 'document': return <FileText {...iconProps} />;
      case 'cotisation': return <DollarSign {...iconProps} />;
      default: return <Search {...iconProps} />;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-3 sm:px-4 lg:px-6">
        {/* Menu hamburger et logo - mobile-first */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 min-h-12 min-w-12 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
          
          {/* Logo et nom - adaptatif */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">O</span>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 font-heading leading-tight">
                {APP_NAME}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Gestion d'associations
              </p>
            </div>
          </div>
        </div>

        {/* Barre de recherche desktop */}
        <div className="flex-1 max-w-lg mx-3 sm:mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-sm placeholder:text-gray-400"
            />
            
            {/* Résultats de recherche desktop */}
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchSelect(result)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      {getSearchIcon(result.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">{result.title}</p>
                        <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions utilisateur - mobile optimisé */}
        <div className="flex items-center gap-1">
          {/* Recherche mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 min-h-12 min-w-12 flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Bouton Créer - mobile adaptatif */}
          <div className="relative" ref={createRef}>
            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 min-h-12"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">Créer</span>
            </button>
            
            {/* Menu création */}
            {isCreateOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => handleCreateAction('member')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                >
                  <Users className="h-4 w-4" />
                  Nouveau membre
                </button>
                <button
                  onClick={() => handleCreateAction('event')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                >
                  <Calendar className="h-4 w-4" />
                  Nouvel événement
                </button>
                <button
                  onClick={() => handleCreateAction('document')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                >
                  <FileText className="h-4 w-4" />
                  Nouveau document
                </button>
                <button
                  onClick={() => handleCreateAction('cotisation')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                >
                  <DollarSign className="h-4 w-4" />
                  Nouvelle cotisation
                </button>
              </div>
            )}
          </div>

          {/* Notifications - mobile optimisé */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 min-h-12 min-w-12 flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                </span>
              )}
            </button>
            
            {/* Panneau notifications - responsive */}
            {isNotificationOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-screen overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadNotifications.length > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-purple-600 hover:text-purple-700 focus:outline-none focus:underline"
                      >
                        Tout marquer lu
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Aucune notification</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${
                          !notification.read ? 'bg-purple-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.type === 'success' ? 'bg-green-500' :
                            notification.type === 'warning' ? 'bg-yellow-500' :
                            notification.type === 'error' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1.5 text-purple-600 hover:text-purple-700 focus:outline-none rounded hover:bg-purple-100 transition-colors duration-150"
                                aria-label="Marquer comme lu"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1.5 text-red-600 hover:text-red-700 focus:outline-none rounded hover:bg-red-100 transition-colors duration-150"
                              aria-label="Supprimer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profil utilisateur - mobile optimisé */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 min-h-12"
            >
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <ChevronDown className="h-3 w-3 hidden sm:block" />
            </button>
            
            {/* Menu profil */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-medium text-gray-900 text-sm truncate">{user?.name || 'Utilisateur'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                
                <button
                  onClick={() => handleProfileAction('profile')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                >
                  <User className="h-4 w-4" />
                  Mon profil
                </button>
                
                <button
                  onClick={() => handleProfileAction('settings')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                >
                  <Settings className="h-4 w-4" />
                  Paramètres
                </button>
                
                <button
                  onClick={() => handleProfileAction('billing')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                >
                  <CreditCard className="h-4 w-4" />
                  Facturation
                </button>
                
                <button
                  onClick={() => handleProfileAction('security')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                >
                  <Shield className="h-4 w-4" />
                  Sécurité
                </button>
                
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4" />
                      Mode clair
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      Mode sombre
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleProfileAction('help')}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                >
                  <HelpCircle className="h-4 w-4" />
                  Aide
                </button>
                
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                  >
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barre de recherche mobile */}
      {isSearchOpen && (
        <div className="md:hidden border-t border-gray-200 p-4 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des membres, événements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-base bg-white"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Résultats de recherche mobile */}
          {searchQuery && searchResults.length > 0 && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSearchSelect(result)}
                  className="w-full p-3 text-left bg-white rounded-lg border border-gray-200 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150"
                >
                  <div className="flex items-center gap-3">
                    {getSearchIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">{result.title}</p>
                      <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {searchQuery && searchResults.length === 0 && (
            <div className="mt-3 p-6 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucun résultat trouvé</p>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
