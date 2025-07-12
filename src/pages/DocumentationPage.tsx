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

  // Mobile-first : layout vertical, padding, cards, accessibilité
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold font-montserrat text-purple-700 mb-2">Documentation</h1>
        <p className="text-gray-600 font-poppins mb-4">Retrouvez tous les guides et ressources pour utiliser Open Community Manager.</p>
        <div className="flex flex-col gap-4">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border-l-4 border-orange-500">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-6 h-6 text-purple-600" aria-hidden="true" />
                  <span className="font-bold text-lg font-montserrat text-gray-900">{section.title}</span>
                </div>
                <p className="text-gray-500 font-poppins text-sm mb-2">{section.description}</p>
                <ul className="flex flex-col gap-1">
                  {section.articles.map((article, i) => (
                    <li key={i} className="text-xs text-gray-700 font-poppins pl-2 relative before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-purple-400 before:rounded-full">
                      {article}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
