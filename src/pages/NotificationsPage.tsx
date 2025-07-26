import React from 'react';
import { Bell, Check, Trash2, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'Nouveau membre',
      message: 'Fatou Camara a rejoint votre association avec le rôle de membre actif.',
      time: '2024-01-15T10:30:00Z',
      read: false,
      type: 'success'
    },
    {
      id: '2',
      title: 'Cotisation en retard',
      message: 'Trois membres ont des cotisations en retard pour le mois de janvier.',
      time: '2024-01-15T09:15:00Z',
      read: false,
      type: 'warning'
    },
    {
      id: '3',
      title: 'Événement demain',
      message: 'Assemblée générale prévue demain à 14h en salle de réunion.',
      time: '2024-01-15T08:00:00Z',
      read: true,
      type: 'info'
    },
    {
      id: '4',
      title: 'Erreur de paiement',
      message: 'Le paiement de la cotisation de Moussa Diallo a été refusé.',
      time: '2024-01-14T16:45:00Z',
      read: true,
      type: 'error'
    },
    {
      id: '5',
      title: 'Rapport mensuel',
      message: 'Le rapport financier du mois de décembre est maintenant disponible.',
      time: '2024-01-14T14:20:00Z',
      read: true,
      type: 'info'
    }
  ]);

  const markAsRead = (id: string) => {
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
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Il y a moins d\'une heure';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête décoré avec couleur orange */}
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-500 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Bell className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-500">
                Centre de Notifications
              </h1>
            </div>
            <div>
              <p className="text-gray-700 font-medium text-lg">
                Restez informé en temps réel de toutes les activités importantes
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <strong>Alertes personnalisées :</strong> Recevez uniquement ce qui vous concerne
                  </p>
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <strong>Suivi en temps réel :</strong> Ne manquez aucune information importante
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm text-gray-600">
                    {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Tout marquer comme lu</span>
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-200">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50/50 border-l-4 border-l-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {formatDate(notification.time)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Marquer comme lu"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune notification
                </h3>
                <p className="text-gray-600">
                  Vous n'avez aucune notification pour le moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
