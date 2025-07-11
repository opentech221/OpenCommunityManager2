import React from 'react';
import {
  Users,
  CreditCard,
  Calendar,
  DollarSign,
  Activity,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const stats = [
    {
      name: 'Membres actifs',
      value: '142',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Cotisations ce mois',
      value: '85 000 FCFA',
      change: '+8%',
      changeType: 'increase',
      icon: CreditCard,
    },
    {
      name: 'Événements prévus',
      value: '5',
      change: '+2',
      changeType: 'increase',
      icon: Calendar,
    },
    {
      name: 'Solde actuel',
      value: '1 250 000 FCFA',
      change: '+15%',
      changeType: 'increase',
      icon: DollarSign,
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
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre association - Association des Jeunes Développeurs
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
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
            <button className="text-sm text-purple-600 hover:text-purple-500 font-medium">
              Voir toutes les activités
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
