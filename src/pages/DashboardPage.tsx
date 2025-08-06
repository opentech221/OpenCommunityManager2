import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import DashboardGuidanceWidget from '../components/DashboardGuidanceWidget';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = React.useState(false);

  const stats = [
    {
      name: 'Membres actifs',
      value: '142',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      route: '/members',
      description: 'Voir tous les membres'
    },
    {
      name: 'Cotisations ce mois',
      value: '85 000 FCFA',
      change: '+8%',
      changeType: 'increase',
      icon: CreditCard,
      route: '/cotisations',
      description: 'Gérer les cotisations'
    },
    {
      name: 'Événements prévus',
      value: '5',
      change: '+2',
      changeType: 'increase',
      icon: Calendar,
      route: '/events',
      description: 'Voir les événements'
    },
    {
      name: 'Solde actuel',
      value: '1 250 000 FCFA',
      change: '+15%',
      changeType: 'increase',
      icon: DollarSign,
      route: '/finances',
      description: 'Voir les finances'
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'member',
      message: 'Nouvel membre inscrit: Amadou Ba',
      time: 'Il y a 2 heures',
      icon: Users,
    },
    {
      id: 2,
      type: 'payment',
      message: 'Cotisation reçue de Fatou Diop - 5 000 FCFA',
      time: 'Il y a 4 heures',
      icon: CreditCard,
    },
    {
      id: 3,
      type: 'event',
      message: 'Nouvel événement créé: Assemblée générale',
      time: 'Il y a 6 heures',
      icon: Calendar,
    },
    {
      id: 4,
      type: 'finance',
      message: 'Dépense enregistrée: Achat matériel - 15 000 FCFA',
      time: 'Il y a 1 jour',
      icon: DollarSign,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Assemblée générale ordinaire',
      date: '2025-07-15',
      time: '15:00',
      participants: 45,
    },
    {
      id: 2,
      title: 'Formation en leadership',
      date: '2025-07-20',
      time: '10:00',
      participants: 28,
    },
    {
      id: 3,
      title: 'Réunion du bureau exécutif',
      date: '2025-07-25',
      time: '18:00',
      participants: 12,
    },
  ];

  // Fermer le menu flottant quand on clique ailleurs
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const floatingMenu = target.closest('.floating-menu-container');
      
      if (!floatingMenu && isFloatingMenuOpen) {
        setIsFloatingMenuOpen(false);
      }
    };

    if (isFloatingMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isFloatingMenuOpen]);

  return (
    <div className="min-h-screen bg-purple-900 p-0">
      <div>
      {/* En-tête de la page */}
      <div className="mb-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-500">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-orange-500">
              Tableau de bord
            </h1>
          </div>
          <div className="hidden md:block">
            <p className="text-gray-700 font-medium text-lg">
              Vue d'ensemble de votre association - Association des Jeunes Développeurs
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <strong>Gestion simplifiée :</strong> Pilotez votre association en temps réel avec des indicateurs clés
              </p>
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <strong>Digitalisation complète :</strong> Fini la paperasse, tout votre écosystème associatif est centralisé
              </p>
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <strong>Croissance assurée :</strong> Optimisez vos cotisations, événements et finances pour développer votre impact
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques - Mobile First avec 4 tickets */}
      <div className="bg-white px-4 py-4 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <button
              key={stat.name}
              onClick={() => navigate(stat.route)}
              className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 hover:from-purple-200 hover:to-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 group"
              aria-label={stat.description}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-purple-200 group-hover:bg-purple-300 transition-colors">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-purple-700">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-purple-600 font-medium">{stat.name}</div>
                  <div className={`text-xs font-medium mt-1 ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Widget Guide Organisationnel */}
      <div className="mb-8">
        <DashboardGuidanceWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Activités récentes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Activités récentes
            </h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="border border-gray-200 bg-purple-100 rounded-lg p-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <activity.icon className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button 
              onClick={() => navigate('/history')}
              className="text-sm text-purple-600 hover:text-purple-500 font-medium transition-colors"
            >
              Voir l'historique complet
            </button>
          </div>
        </div>

        {/* Événements à venir */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Événements à venir
            </h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 bg-purple-100 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</span>
                  <span>{event.participants} participants</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="text-sm text-purple-600 hover:text-purple-500 font-medium">
              Voir tous les événements
            </button>
          </div>
        </div>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Évolution des cotisations</h2>
          <div className="h-64 bg-purple-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique des cotisations</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Répartition des membres</h2>
          <div className="h-64 bg-purple-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique des membres</p>
          </div>
        </div>
      </div>

      {/* Bouton flottant avec menu contextuel - Mobile First */}
      <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
        {/* Menu contextuel */}
        {isFloatingMenuOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/members');
                setIsFloatingMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Users className="w-4 h-4 text-orange-600" />
              <span>Ajouter membre</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/cotisations');
                setIsFloatingMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <CreditCard className="w-4 h-4 text-green-600" />
              <span>Nouvelle cotisation</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/events');
                setIsFloatingMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Créer événement</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/finances');
                setIsFloatingMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span>Transaction</span>
            </button>
          </div>
        )}

        {/* Bouton principal flottant */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFloatingMenuOpen(!isFloatingMenuOpen);
          }}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            isFloatingMenuOpen 
              ? 'bg-gray-600 hover:bg-gray-700 transform rotate-45' 
              : 'bg-orange-500 hover:bg-orange-600 hover:scale-110'
          }`}
          aria-label="Menu d'actions rapides"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      </div>
    </div>
  );
};
