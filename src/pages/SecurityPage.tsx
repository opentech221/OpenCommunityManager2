import React from 'react';
import { Shield, Key, Smartphone, Eye, EyeOff, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

const SecurityPage: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);

  const securityEvents = [
    {
      id: '1',
      event: 'Connexion réussie',
      location: 'Dakar, Sénégal',
      device: 'Chrome sur Windows',
      time: '2024-01-15T10:30:00Z',
      status: 'success'
    },
    {
      id: '2',
      event: 'Mot de passe modifié',
      location: 'Dakar, Sénégal',
      device: 'Chrome sur Windows',
      time: '2024-01-10T14:20:00Z',
      status: 'info'
    },
    {
      id: '3',
      event: 'Tentative de connexion échouée',
      location: 'Adresse IP inconnue',
      device: 'Safari sur iPhone',
      time: '2024-01-08T22:15:00Z',
      status: 'warning'
    }
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de changement de mot de passe
    console.log('Changement de mot de passe...');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Shield className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full max-w-full mx-auto px-2 py-2 sm:px-6 sm:py-8">
        {/* En-tête décoré avec couleur orange */}
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-500 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">
                Sécurité Avancée
              </h1>
              <div className="space-y-1">
                <p className="text-gray-700 font-medium">
                  Protection maximale et contrôle total de votre compte
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <strong>Authentification renforcée :</strong> Double facteur et mots de passe sécurisés
                  </p>
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <strong>Surveillance continue :</strong> Suivi des accès et alertes en temps réel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Changement de mot de passe */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Key className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Mot de passe</h2>
                <p className="text-gray-600">Changez votre mot de passe régulièrement pour plus de sécurité</p>
              </div>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      placeholder="Entrez un nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  Changer le mot de passe
                </button>
              </div>
            </form>
          </div>
          {/* Authentification à deux facteurs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Authentification à deux facteurs</h2>
                  <p className="text-gray-600">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${twoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {twoFactorEnabled ? 'Activée' : 'Désactivée'}
                </span>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    twoFactorEnabled ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            {twoFactorEnabled && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-800">
                    L'authentification à deux facteurs est activée. Votre compte est mieux protégé.
                  </p>
                </div>
              </div>
            )}
            {!twoFactorEnabled && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <p className="text-yellow-800">
                    Nous recommandons fortement d'activer l'authentification à deux facteurs pour sécuriser votre compte.
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Activité récente */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
            <div className="px-4 py-4 sm:px-6 sm:py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Activité récente</h2>
                  <p className="text-gray-600">Surveillez les connexions et activités sur votre compte</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {securityEvents.map((event) => (
                <div key={event.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    {getEventIcon(event.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{event.event}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.time)}</span>
                        </div>
                      </div>
                      <div className="mt-1 space-y-1">
                        <p className="text-gray-600">📍 {event.location}</p>
                        <p className="text-gray-600">💻 {event.device}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-4 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-200">
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Voir toute l'activité
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
