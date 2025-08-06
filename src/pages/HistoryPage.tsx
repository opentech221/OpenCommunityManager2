import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Activity, 
  ChevronLeft,
  Download,
  Filter,
  Plus,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../hooks/useHistory';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { activities, isLoading, getStats } = useHistory();
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL'); // ALL, TODAY, WEEK, MONTH
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  
  // Obtenir les statistiques
  const stats = getStats();

  // Gestion de la fermeture du menu flottant
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showFloatingMenu && !target.closest('.floating-menu-container')) {
        setShowFloatingMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFloatingMenu]);

  // Configuration des types et actions
  const activityTypes = [
    { value: 'ALL', label: 'Tous les types', color: 'gray' },
    { value: 'member', label: 'Membres', color: 'blue' },
    { value: 'cotisation', label: 'Cotisations', color: 'green' },
    { value: 'event', label: 'Événements', color: 'purple' },
    { value: 'finance', label: 'Finances', color: 'orange' },
    { value: 'document', label: 'Documents', color: 'indigo' },
    { value: 'message', label: 'Messages', color: 'pink' }
  ];

  const actionTypes = [
    { value: 'ALL', label: 'Toutes les actions' },
    { value: 'create', label: 'Création' },
    { value: 'update', label: 'Modification' },
    { value: 'delete', label: 'Suppression' },
    { value: 'payment', label: 'Paiement' },
    { value: 'registration', label: 'Inscription' }
  ];

  const dateFilters = [
    { value: 'ALL', label: 'Toutes les dates' },
    { value: 'TODAY', label: "Aujourd'hui" },
    { value: 'WEEK', label: 'Cette semaine' },
    { value: 'MONTH', label: 'Ce mois' }
  ];

  // Fonction pour filtrer les activités
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || activity.type === typeFilter;
    const matchesAction = actionFilter === 'ALL' || activity.action === actionFilter;
    
    // Filtre par date
    let matchesDate = true;
    const now = new Date();
    const activityDate = activity.timestamp;
    
    if (dateFilter === 'TODAY') {
      matchesDate = activityDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'WEEK') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = activityDate >= weekAgo;
    } else if (dateFilter === 'MONTH') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = activityDate >= monthAgo;
    }
    
    return matchesSearch && matchesType && matchesAction && matchesDate;
  });

  // Fonction pour obtenir l'icône selon le type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'member': return <User className="h-4 w-4" />;
      case 'cotisation': return <Activity className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'finance': return <Activity className="h-4 w-4" />;
      case 'document': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  // Fonction pour obtenir la couleur selon le type
  const getTypeColor = (type: string) => {
    const typeConfig = activityTypes.find(t => t.value === type);
    return typeConfig?.color || 'gray';
  };

  // Fonction pour formater la date relative
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Il y a quelques secondes';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jour${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  return (
    <div className="min-h-screen bg-purple-900 p-0 sm:p-0 md:p-0 lg:p-0">
      {/* État de chargement */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
              <span>Chargement de l'historique...</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {/* En-tête Mobile-First */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-6 sm:px-6 lg:px-8 border-l-4 border-orange-500 rounded-lg shadow-sm mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-orange-200 rounded-lg transition-colors mr-2"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5 text-orange-600" />
          </button>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
            Historique des Activités
          </h1>
        </div>
        <div className="mt-4 hidden md:block">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Traçabilité complète et audit de toutes les actions
          </p>
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Suivi en temps réel :</strong> Toutes les actions sont automatiquement enregistrées
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Filtrage avancé :</strong> Recherchez par type, date ou utilisateur
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Statistiques - Mobile First avec 4 tickets-boutons de filtre */}
        <div className="bg-white px-4 py-4 sm:px-6 lg:px-8 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => setDateFilter('ALL')}
              className={`bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                dateFilter === 'ALL'
                  ? 'ring-2 ring-gray-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-gray-200">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-gray-700">{stats.total}</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Actions</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setDateFilter('TODAY')}
              className={`bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                dateFilter === 'TODAY'
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-blue-200">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-700">{stats.today}</div>
                  <div className="text-xs sm:text-sm text-blue-600 font-medium">Aujourd'hui</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setDateFilter('WEEK')}
              className={`bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                dateFilter === 'WEEK'
                  ? 'ring-2 ring-green-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-green-200">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-green-700">{stats.thisWeek}</div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">Cette Semaine</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setDateFilter('MONTH')}
              className={`bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                dateFilter === 'MONTH'
                  ? 'ring-2 ring-purple-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-purple-200">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-purple-700">{stats.thisMonth}</div>
                  <div className="text-xs sm:text-sm text-purple-600 font-medium">Ce Mois</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans l'historique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {actionTypes.map(action => (
                <option key={action.value} value={action.value}>{action.label}</option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {dateFilters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtres actifs */}
        {(typeFilter !== 'ALL' || actionFilter !== 'ALL' || dateFilter !== 'ALL' || searchTerm) && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-500">
            <div className="flex flex-wrap gap-2">
              {typeFilter !== 'ALL' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Type: {activityTypes.find(t => t.value === typeFilter)?.label}
                </span>
              )}
              {actionFilter !== 'ALL' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Action: {actionTypes.find(a => a.value === actionFilter)?.label}
                </span>
              )}
              {dateFilter !== 'ALL' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Période: {dateFilters.find(d => d.value === dateFilter)?.label}
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Recherche: "{searchTerm}"
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setTypeFilter('ALL');
                setActionFilter('ALL');
                setDateFilter('ALL');
                setSearchTerm('');
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      {/* Liste des activités */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune activité trouvée
            </h3>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'ALL' || actionFilter !== 'ALL' || dateFilter !== 'ALL'
                ? 'Aucune activité ne correspond à vos critères de recherche'
                : 'Aucune activité enregistrée pour le moment'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Icône du type d'activité */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-${getTypeColor(activity.type)}-100`}>
                    <div className={`text-${getTypeColor(activity.type)}-600`}>
                      {getTypeIcon(activity.type)}
                    </div>
                  </div>

                  {/* Contenu de l'activité */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${getTypeColor(activity.type)}-100 text-${getTypeColor(activity.type)}-800`}>
                          {activityTypes.find(t => t.value === activity.type)?.label}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {getRelativeTime(activity.timestamp)}
                      </div>
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-600">
                      {activity.description}
                    </p>
                    
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      Par {activity.user}
                      <span className="mx-2">•</span>
                      {activity.timestamp.toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Résumé en bas de page */}
      {filteredActivities.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="text-sm text-gray-600 text-center">
            Affichage de {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''} sur {activities.length} au total
            {filteredActivities.length !== activities.length && (
              <span className="ml-2 text-orange-600">• Filtres actifs</span>
            )}
          </div>
        </div>
      )}

        {/* Bouton flottant avec menu d'actions */}
        <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
          {/* Menu d'actions (visible quand showFloatingMenu est true) */}
          {showFloatingMenu && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
              <button
                onClick={() => {
                  // Fonction de filtrage rapide
                  setDateFilter('TODAY');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Filter className="h-4 w-4 text-blue-600" />
                <span>Filtrer Aujourd'hui</span>
              </button>
              
              <button
                onClick={() => {
                  // Reset filtres
                  setDateFilter('ALL');
                  setTypeFilter('ALL');
                  setActionFilter('ALL');
                  setSearchTerm('');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <AlertCircle className="h-4 w-4 text-gray-600" />
                <span>Réinitialiser Filtres</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={() => {
                  // Fonction d'export à implémenter
                  console.log('Export de l\'historique');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Download className="h-4 w-4 text-green-600" />
                <span>Exporter Historique</span>
              </button>
            </div>
          )}

          {/* Bouton principal flottant */}
          <button
            onClick={() => setShowFloatingMenu(!showFloatingMenu)}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
              showFloatingMenu 
                ? 'bg-gray-600 hover:bg-gray-700 transform rotate-45' 
                : 'bg-orange-500 hover:bg-orange-600 hover:scale-110'
            }`}
          >
            <Plus className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
