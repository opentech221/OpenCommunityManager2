/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Monitor, 
  Code, 
  Globe,
  Smartphone,
  Database,
  Shield,
  Zap,
  Settings,
  Users,
  Calendar,
  FileText,
  CreditCard,
  MessageSquare,
  BarChart3,
  Download,
  Eye,
  ExternalLink
} from 'lucide-react';
import { ROUTES } from '../constants';
import { Breadcrumb } from '../components/Breadcrumb';

export const DemoPage: React.FC = () => {
  const demoSections = [
    {
      id: 'overview',
      title: 'Vue d\'ensemble',
      icon: Monitor,
      description: 'Découvrez l\'interface principale et le tableau de bord',
      duration: '3 min',
      color: 'bg-blue-500'
    },
    {
      id: 'members',
      title: 'Gestion des membres',
      icon: Users,
      description: 'Ajout, modification et gestion des rôles membres',
      duration: '5 min',
      color: 'bg-green-500'
    },
    {
      id: 'cotisations',
      title: 'Cotisations',
      icon: CreditCard,
      description: 'Configuration et suivi des paiements',
      duration: '4 min',
      color: 'bg-purple-500'
    },
    {
      id: 'events',
      title: 'Événements',
      icon: Calendar,
      description: 'Planification et gestion des événements',
      duration: '6 min',
      color: 'bg-orange-500'
    },
    {
      id: 'communication',
      title: 'Communication',
      icon: MessageSquare,
      description: 'Messagerie et notifications',
      duration: '3 min',
      color: 'bg-pink-500'
    },
    {
      id: 'reports',
      title: 'Rapports',
      icon: BarChart3,
      description: 'Analyses et rapports détaillés',
      duration: '4 min',
      color: 'bg-indigo-500'
    }
  ];

  const features = [
    {
      icon: Globe,
      title: 'Accessible partout',
      description: 'Plateforme web responsive accessible depuis n\'importe quel appareil'
    },
    {
      icon: Smartphone,
      title: 'Mobile-first',
      description: 'Interface optimisée pour smartphones et tablettes'
    },
    {
      icon: Database,
      title: 'Données sécurisées',
      description: 'Vos données sont stockées en toute sécurité dans le cloud'
    },
    {
      icon: Shield,
      title: 'Conformité RGPD',
      description: 'Respect total des réglementations sur la protection des données'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Interface rapide et réactive pour une expérience optimale'
    },
    {
      icon: Settings,
      title: 'Personnalisable',
      description: 'Adaptez l\'interface selon les besoins de votre association'
    }
  ];

  const screenshots = [
    {
      title: 'Dashboard principal',
      description: 'Vue d\'ensemble avec statistiques et activités récentes',
      image: '/api/placeholder/600/400'
    },
    {
      title: 'Gestion des membres',
      description: 'Interface intuitive pour gérer tous vos membres',
      image: '/api/placeholder/600/400'
    },
    {
      title: 'Suivi des cotisations',
      description: 'Tableau de bord financier complet',
      image: '/api/placeholder/600/400'
    },
    {
      title: 'Planification d\'événements',
      description: 'Calendrier et outils de gestion d\'événements',
      image: '/api/placeholder/600/400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-800 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Play className="h-16 w-16 mx-auto mb-6 text-purple-200" />
          <h1 className="text-4xl md:text-7xl text-orange-500 font-montserrat font-bold mb-4">
            Démo en ligne
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Découvrez Open Community Manager en action. Explorez toutes les fonctionnalités 
            à travers notre démonstration interactive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 text-white-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
              <Play className="h-5 w-5 mr-2" />
              Lancer la démo
            </button>
            <button className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Programmer une démo personnalisée
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Breadcrumb current="Démo" />

        {/* Demo Sections */}
        <div className="mb-12">
          <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-8 text-center">
            Explorez par section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoSections.map((section) => (
              <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className={`w-12 h-12 ${section.color} rounded-xl flex items-center justify-center mb-4`}>
                  <section.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{section.duration}</span>
                  <button className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
                    <Play className="h-4 w-4 mr-1" />
                    Voir la démo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Screenshots Gallery */}
        <div className="mb-12">
          <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-8 text-center">
            Captures d'écran
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Capture d'écran</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-2">
                    {screenshot.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{screenshot.description}</p>
                  <button className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
                    <Eye className="h-4 w-4 mr-1" />
                    Voir en grand
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mb-12">
          <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-8 text-center">
            Pourquoi choisir notre solution ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-6 text-center">
            Essayez maintenant
          </h2>
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-montserrat font-bold text-gray-900 mb-4">
              Démo interactive
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Testez toutes les fonctionnalités dans un environnement de démonstration 
              avec des données d'exemple. Aucune inscription requise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center">
                <Play className="h-5 w-5 mr-2" />
                Lancer la démo
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                Nouvelle fenêtre
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-montserrat font-bold text-gray-900 mb-6 text-center">
            Spécifications techniques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Technologies</h3>
              <p className="text-gray-600 text-sm">
                React, TypeScript, Tailwind CSS, Flask, PostgreSQL
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compatibilité</h3>
              <p className="text-gray-600 text-sm">
                Tous navigateurs modernes, iOS, Android
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Déploiement</h3>
              <p className="text-gray-600 text-sm">
                Cloud sécurisé, 99.9% de disponibilité
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
