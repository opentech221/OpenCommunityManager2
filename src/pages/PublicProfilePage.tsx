import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Users, 
  Award,
  Edit,
  Share2,
  Download,
  Eye,
  ChevronLeft,
  Plus,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PublicProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
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

  // Données fictives de l'association
  const association = {
    name: "Association Communautaire de Conakry",
    sigle: "ACC",
    description: "Nous œuvrons pour le développement communautaire et l'autonomisation des jeunes dans la région de Conakry.",
    address: "Conakry, Guinée",
    phone: "+224 123 456 789",
    email: "contact@acc-guinee.org",
    website: "www.acc-guinee.org",
    foundedDate: "2018",
    membersCount: 45,
    achievements: [
      "Formation de 200 jeunes en entrepreneuriat",
      "Création de 15 micro-entreprises",
      "Organisation de 25 événements communautaires",
      "Sensibilisation de 1000 personnes sur l'hygiène"
    ],
    projects: [
      {
        title: "Projet Jeunesse et Emploi",
        description: "Formation et accompagnement des jeunes vers l'emploi",
        status: "En cours",
        participants: 50
      },
      {
        title: "Sensibilisation Santé",
        description: "Campagne de sensibilisation sur la santé communautaire",
        status: "Terminé",
        participants: 200
      }
    ]
  };

  return (
    <div className="min-h-screen bg-purple-900 p-0 sm:p-0 md:p-0 lg:p-0">
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
              <Globe className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
            Profil Public
          </h1>
        </div>
        <div className="mt-4 hidden md:block">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Vitrine publique de votre association
          </p>
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Visibilité publique :</strong> Présentez votre association au monde
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Attraction de membres :</strong> Attirez de nouveaux adhérents
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Statistiques - Mobile First avec 4 tickets-boutons de filtre */}
        <div className="bg-white px-4 py-4 sm:px-6 lg:px-8 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => console.log('Vues du profil')}
              className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left hover:scale-105"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-blue-200">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-700">342</div>
                  <div className="text-xs sm:text-sm text-blue-600 font-medium">Vues</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => console.log('Membres actifs')}
              className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left hover:scale-105"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-green-200">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-green-700">{association.membersCount}</div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">Membres</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => console.log('Projets en cours')}
              className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left hover:scale-105"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-purple-200">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-purple-700">{association.projects.length}</div>
                  <div className="text-xs sm:text-sm text-purple-600 font-medium">Projets</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => console.log('Années d\'existence')}
              className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left hover:scale-105"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-orange-200">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-orange-700">
                    {new Date().getFullYear() - parseInt(association.foundedDate)}
                  </div>
                  <div className="text-xs sm:text-sm text-orange-600 font-medium">Années</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              {/* À propos */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">À propos</h2>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 text-gray-500 hover:text-purple-500 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed">{association.description}</p>
            </div>

            {/* Projets récents */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Projets récents</h2>
              <div className="space-y-4">
                {association.projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        project.status === 'En cours' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {project.participants} participants
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Réalisations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Nos réalisations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {association.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations de contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{association.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{association.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{association.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{association.website}</span>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Créée en</span>
                  </div>
                  <span className="font-semibold text-gray-900">{association.foundedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Membres</span>
                  </div>
                  <span className="font-semibold text-gray-900">{association.membersCount}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Demander à rejoindre</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Partager</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Télécharger le profil</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton flottant avec menu d'actions */}
        <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
          {/* Menu d'actions (visible quand showFloatingMenu est true) */}
          {showFloatingMenu && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Edit className="h-4 w-4 text-blue-600" />
                <span>Éditer Profil</span>
              </button>
              
              <button
                onClick={() => {
                  // Fonction de partage
                  navigator.share?.({
                    title: association.name,
                    text: association.description,
                    url: window.location.href,
                  }).catch(() => {
                    // Fallback pour navigateurs sans support
                    navigator.clipboard.writeText(window.location.href);
                  });
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Share2 className="h-4 w-4 text-green-600" />
                <span>Partager</span>
              </button>
              
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Settings className="h-4 w-4 text-purple-600" />
                <span>Paramètres</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={() => {
                  // Fonction d'export PDF
                  console.log('Export du profil en PDF');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Download className="h-4 w-4 text-orange-600" />
                <span>Télécharger PDF</span>
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
    </div>
  );
} 