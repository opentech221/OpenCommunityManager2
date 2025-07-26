import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Calendar,
  DollarSign,
  Activity,
  ArrowRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div>
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className={`p-2 rounded-lg ${
                  stat.changeType === 'increase' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <span className={`text-sm font-medium mt-2 ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            
            {/* Bouton Détails */}
            <button
              onClick={() => navigate(stat.route)}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label={stat.description}
            >
              <span className="font-medium">Détails</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        ))}
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
              <div key={activity.id} className="flex items-start space-x-3">
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
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
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
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique des cotisations</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Répartition des membres</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique des membres</p>
          </div>
        </div>
      </div>
    </div>
  );
};
