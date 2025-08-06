import { useState, useEffect } from 'react';
import { 
  Save, 
  Upload, 
  Eye, 
  EyeOff, 
  User,
  Building2,
  Shield,
  Bell,
  Palette,
  Globe,
  ChevronLeft,
  Plus,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

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

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'association', name: 'Association', icon: Building2 },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Apparence', icon: Palette },
    { id: 'public', name: 'Profil public', icon: Globe },
  ];

  // Mobile-first : carrousel horizontal pour onglets, layout vertical, boutons larges, accessibilité
  return (
    <div className="min-h-screen bg-purple-900 pb-0">
      <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* En-tête Mobile-First */}
        <div className="mb-4 sm:mb-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 sm:p-6 border-l-4 border-orange-500 shadow-sm">
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
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
              Paramètres Système
            </h1>
          </div>
          <div className="mt-4 hidden md:block">
            <p className="text-sm sm:text-base text-gray-700 font-medium">
              Personnalisez votre expérience et sécurisez votre association
            </p>
            <div className="text-xs text-gray-600 space-y-1 mt-2">
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <strong>Configuration avancée :</strong> Adaptez l'application à vos besoins
              </p>
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <strong>Sécurité renforcée :</strong> Protégez vos données sensibles
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques du compte - Mobile First avec 4 tickets-boutons de navigation */}
        <div className="bg-white px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-4 mb-4 sm:mb-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-2 sm:p-3 lg:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                activeTab === 'profile'
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-blue-200">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-blue-700">98%</div>
                  <div className="text-xs sm:text-sm text-blue-600 font-medium">Profil</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-2 sm:p-3 lg:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                activeTab === 'security'
                  ? 'ring-2 ring-green-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-green-200">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-green-700">Forte</div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">Sécurité</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-2 sm:p-3 lg:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                activeTab === 'notifications'
                  ? 'ring-2 ring-orange-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-orange-200">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600" />
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-orange-700">5</div>
                  <div className="text-xs sm:text-sm text-orange-600 font-medium">Notifs</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('public')}
              className={`bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-2 sm:p-3 lg:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                activeTab === 'public'
                  ? 'ring-2 ring-purple-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-purple-200">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-purple-700">Public</div>
                  <div className="text-xs sm:text-sm text-purple-600 font-medium">Visibilité</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm md:grid md:grid-cols-5 md:gap-0">
          {/* Onglets - carrousel mobile, menu vertical desktop */}
          <nav
            className="flex flex-row flex-nowrap w-full gap-x-2 px-0 py-2 md:flex-col md:gap-y-2 md:col-span-1 md:py-8 md:px-4 md:border-r md:border-gray-100 md:bg-gray-50"
            aria-label="Onglets paramètres"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 px-1 py-1 rounded-lg flex flex-col items-center justify-center space-y-0 text-[11px] font-medium font-poppins transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 md:min-w-0 md:max-w-none md:flex-row md:space-y-0 md:space-x-2 md:rounded-lg md:border-l-4 md:py-3 md:px-2 md:justify-start md:items-center
                  ${activeTab === tab.id
                    ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-500 shadow md:bg-orange-50 md:shadow-none'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-l-4 border-transparent md:bg-transparent md:hover:bg-gray-100'}
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <tab.icon className="w-3 h-3 mb-0 md:mb-0 md:mr-2" aria-hidden="true" />
              <span className="truncate md:text-base">{tab.name}</span>
            </button>
            ))}
          </nav>
          {/* Contenu des onglets - layout vertical mobile, carte à droite desktop */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 md:col-span-4">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Profil utilisateur</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      defaultValue="Admin"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      defaultValue="Utilisateur"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@asso.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+224 123 456 789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-end gap-3">
                  <button className="w-full md:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    Annuler
                  </button>
                  <button className="w-full md:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'association' && (
              <div className="space-y-6">
                <div className="md:max-w-2xl w-full mx-auto">
                  <h2 className="text-xl font-semibold text-gray-900">Informations de l'association</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'association
                      </label>
                      <input
                        type="text"
                        defaultValue="Association Communautaire de Conakry"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sigle (optionnel)
                      </label>
                      <input
                        type="text"
                        defaultValue="ACC"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        defaultValue="Nous œuvrons pour le développement communautaire et l'autonomisation des jeunes dans la région de Conakry."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo de l'association
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-orange-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">ACC</span>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                          <Upload className="w-4 h-4" />
                          <span>Changer le logo</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-end gap-3">
                    <button className="w-full md:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      Annuler
                    </button>
                    <button className="w-full md:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Sauvegarder</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
                <form className="space-y-6" autoComplete="off">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      name="new-password"
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      name="confirm-password"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-end gap-3">
                    <button type="reset" className="w-full md:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      Annuler
                    </button>
                    <button type="submit" className="w-full md:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Changer le mot de passe</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Notifications par email</h3>
                      <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Notifications push</h3>
                      <p className="text-sm text-gray-500">Recevoir les notifications dans le navigateur</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Nouvelles cotisations</h3>
                      <p className="text-sm text-gray-500">Être notifié des nouvelles cotisations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Apparence</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thème
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Clair</option>
                      <option>Sombre</option>
                      <option>Système</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur principale
                    </label>
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-purple-500"></div>
                      <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-gray-300"></div>
                      <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-gray-300"></div>
                      <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-gray-300"></div>
                      <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-gray-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'public' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Profil public</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Profil public visible</h3>
                      <p className="text-sm text-gray-500">Rendre le profil de l'association visible publiquement</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Autoriser les demandes d'adhésion</h3>
                      <p className="text-sm text-gray-500">Permettre aux visiteurs de demander à rejoindre l'association</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Lien du profil public</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value="https://openassos.com/asso/acc-guinee"
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm"
                    />
                    <button className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      Copier
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bouton flottant avec menu d'actions */}
        <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
          {/* Menu d'actions (visible quand showFloatingMenu est true) */}
          {showFloatingMenu && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
              <button
                onClick={() => {
                  // Sauvegarde rapide
                  console.log('Sauvegarde des paramètres');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Save className="h-4 w-4 text-green-600" />
                <span>Sauvegarder</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <User className="h-4 w-4 text-blue-600" />
                <span>Profil</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('security');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Sécurité</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={() => {
                  // Fonction d'export à implémenter
                  console.log('Export des paramètres');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Download className="h-4 w-4 text-orange-600" />
                <span>Exporter Config</span>
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
}
