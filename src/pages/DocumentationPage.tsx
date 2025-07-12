import React from 'react';
import { 
  Book, 
  FileText, 
  Video, 
  Download, 
  Search,
  ChevronRight,
  Users,
  Settings,
  CreditCard,
  Calendar,
  MessageSquare,
  Shield,
  Code,
  Zap
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

export const DocumentationPage: React.FC = () => {
  const sections = [
    {
      icon: Users,
      title: 'Gestion des membres',
      description: 'Apprenez à gérer vos membres, leurs rôles et permissions',
      articles: [
        'Ajouter un nouveau membre',
        'Gérer les rôles et permissions',
        'Importer des membres en masse',
        'Historique des adhésions'
      ]
    },
    {
      icon: CreditCard,
      title: 'Cotisations et finances',
      description: 'Maîtrisez la gestion financière de votre association',
      articles: [
        'Configurer les cotisations',
        'Suivre les paiements',
        'Générer des rapports financiers',
        'Relances automatiques'
      ]
    },
    {
      icon: Calendar,
      title: 'Événements',
      description: 'Organisez et gérez vos événements efficacement',
      articles: [
        'Créer un événement',
        'Gérer les inscriptions',
        'Envoyer des invitations',
        'Suivi de participation'
      ]
    },
    {
      icon: FileText,
      title: 'Documents',
      description: 'Centralisez et partagez vos documents importants',
      articles: [
        'Télécharger des documents',
        'Organiser par catégories',
        'Partager avec les membres',
        'Contrôler les accès'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Communiquez efficacement avec vos membres',
      articles: [
        'Envoyer des messages',
        'Créer des groupes',
        'Notifications automatiques',
        'Historique des conversations'
      ]
    },
    {
      icon: Settings,
      title: 'Configuration',
      description: 'Personnalisez votre espace association',
      articles: [
        'Paramètres généraux',
        'Personnaliser l\'interface',
        'Gérer les notifications',
        'Sauvegardes et export'
      ]
    }
  ];

  const quickLinks = [
    { title: 'Guide de démarrage rapide', icon: Zap, time: '5 min' },
    { title: 'Première connexion', icon: Users, time: '3 min' },
    { title: 'Configurer votre association', icon: Settings, time: '10 min' },
    { title: 'Inviter des membres', icon: MessageSquare, time: '5 min' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Book className="h-16 w-16 mx-auto mb-6 text-purple-200" />
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
            Documentation
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Tout ce que vous devez savoir pour maîtriser Open Community Manager. 
            Guides détaillés, tutoriels vidéo et ressources pratiques.
          </p>
        </div>
      </div>

      {/* Fil d'Ariane */}
      <Breadcrumb current="Documentation" />
      
      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-montserrat font-bold text-gray-900 mb-6">
            🚀 Démarrage rapide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <link.icon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{link.title}</h3>
                  <p className="text-gray-600 text-xs">{link.time} de lecture</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <section.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-montserrat font-bold text-gray-900">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{section.description}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {section.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <a 
                      href="#" 
                      className="flex items-center text-gray-700 hover:text-purple-600 transition-colors group"
                    >
                      <FileText className="h-4 w-4 mr-3 text-gray-400 group-hover:text-purple-600" />
                      {article}
                      <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* API Documentation */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-montserrat font-bold text-gray-900">
                API & Intégrations
              </h3>
              <p className="text-gray-600">Intégrez Open Community Manager à vos outils existants</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Code className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">API REST</h4>
              <p className="text-gray-600 text-sm mb-4">Documentation complète de notre API</p>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Voir la documentation →
              </button>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Download className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">SDK</h4>
              <p className="text-gray-600 text-sm mb-4">Kits de développement disponibles</p>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Télécharger →
              </button>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Shield className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Authentification</h4>
              <p className="text-gray-600 text-sm mb-4">Sécurisez vos intégrations</p>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Guide de sécurité →
              </button>
            </div>
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-montserrat font-bold text-gray-900">
                Tutoriels vidéo
              </h3>
              <p className="text-gray-600">Apprenez visuellement avec nos vidéos explicatives</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Prise en main', duration: '10:30', views: '1.2k' },
              { title: 'Gestion des membres', duration: '8:45', views: '856' },
              { title: 'Configuration avancée', duration: '15:20', views: '543' }
            ].map((video, index) => (
              <div key={index} className="relative bg-gray-100 rounded-lg p-6 hover:bg-gray-200 transition-colors cursor-pointer">
                <div className="flex items-center justify-center h-24 bg-gray-300 rounded-lg mb-4">
                  <Video className="h-8 w-8 text-gray-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{video.title}</h4>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{video.duration}</span>
                  <span>{video.views} vues</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
