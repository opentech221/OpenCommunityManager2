import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  ChevronLeft,
  Users,
  Calendar,
  ArrowRight,
  Star,
  Plus,
  Download
} from 'lucide-react';

interface ActionPlan {
  id: string;
  title: string;
  description: string;
  currentLevel: number;
  targetLevel: number;
  estimatedDuration: string;
  priority: 'high' | 'medium' | 'low';
  prerequisites: string[];
  actions: {
    id: string;
    title: string;
    description: string;
    category: string;
    estimatedTime: string;
    completed: boolean;
    assigned_to?: string;
    deadline?: string;
  }[];
}

const ActionPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  useEffect(() => {
    loadActionPlan();
  }, []);

  // Fermer le menu flottant quand on clique à l'extérieur
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

  const loadActionPlan = async () => {
    try {
      setIsLoading(true);
      // Simulation d'un plan d'action basé sur le diagnostic
      const testActionPlan: ActionPlan = {
        id: '1',
        title: 'Plan de progression vers le niveau Organisé',
        description: 'Feuille de route personnalisée pour faire évoluer votre association du niveau Structuré vers le niveau Organisé',
        currentLevel: 2,
        targetLevel: 3,
        estimatedDuration: '6-12 mois',
        priority: 'high',
        prerequisites: [
          'Avoir une gouvernance stable',
          'Disposer de ressources humaines suffisantes',
          'Avoir des finances équilibrées'
        ],
        actions: [
          {
            id: '1',
            title: 'Mettre à jour les statuts et règlement intérieur',
            description: 'Réviser et moderniser les statuts pour intégrer les nouvelles pratiques',
            category: 'Gouvernance',
            estimatedTime: '2-3 semaines',
            completed: false,
            assigned_to: 'Président',
            deadline: '2025-09-30'
          },
          {
            id: '2',
            title: 'Implémenter un système de gestion documentaire',
            description: 'Organiser et digitaliser tous les documents importants',
            category: 'Opérations',
            estimatedTime: '1 mois',
            completed: false,
            assigned_to: 'Secrétaire'
          },
          {
            id: '3',
            title: 'Créer un tableau de bord de pilotage',
            description: 'Mettre en place des indicateurs de performance clés',
            category: 'Performance',
            estimatedTime: '3 semaines',
            completed: false,
            assigned_to: 'Trésorier'
          },
          {
            id: '4',
            title: 'Développer un plan de communication stratégique',
            description: 'Élaborer une stratégie de communication annuelle',
            category: 'Communication',
            estimatedTime: '2 semaines',
            completed: true,
            assigned_to: 'Chargé de communication'
          },
          {
            id: '5',
            title: 'Former les bénévoles aux nouvelles procédures',
            description: 'Organiser des sessions de formation pour l\'équipe',
            category: 'Ressources Humaines',
            estimatedTime: '1 mois',
            completed: false
          },
          {
            id: '6',
            title: 'Mettre en place un système d\'évaluation',
            description: 'Créer des processus d\'évaluation des activités et projets',
            category: 'Performance',
            estimatedTime: '2 semaines',
            completed: false
          }
        ]
      };
      setActionPlan(testActionPlan);
    } catch (error) {
      console.error('Erreur lors du chargement du plan d\'action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActionCompletion = (actionId: string) => {
    if (!actionPlan) return;
    
    setActionPlan({
      ...actionPlan,
      actions: actionPlan.actions.map(action =>
        action.id === actionId
          ? { ...action, completed: !action.completed }
          : action
      )
    });
  };

  const getMaturityLevelName = (level: number) => {
    const levels = {
      1: { name: '🌱 Émergent', color: 'bg-red-100 text-red-800' },
      2: { name: '🏗️ Structuré', color: 'bg-orange-100 text-orange-800' },
      3: { name: '⚡ Organisé', color: 'bg-yellow-100 text-yellow-800' },
      4: { name: '🚀 Optimisé', color: 'bg-blue-100 text-blue-800' },
      5: { name: '⭐ Excellence', color: 'bg-green-100 text-green-800' }
    };
    return levels[level as keyof typeof levels] || levels[1];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Gouvernance': return '👥';
      case 'Opérations': return '⚙️';
      case 'Performance': return '📈';
      case 'Communication': return '📢';
      case 'Ressources Humaines': return '👤';
      default: return '📋';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Gouvernance': return 'bg-blue-100 text-blue-800';
      case 'Opérations': return 'bg-orange-100 text-orange-800';
      case 'Performance': return 'bg-green-100 text-green-800';
      case 'Communication': return 'bg-purple-100 text-purple-800';
      case 'Ressources Humaines': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!actionPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Plan d'action non disponible</h3>
          <p className="text-gray-600">Effectuez d'abord un diagnostic pour générer votre plan d'action.</p>
        </div>
      </div>
    );
  }

  const completedActions = actionPlan.actions.filter(action => action.completed).length;
  const totalActions = actionPlan.actions.length;
  const progressPercentage = Math.round((completedActions / totalActions) * 100);

  return (
    <div className="min-h-screen bg-purple-900 p-0">
      {/* En-tête Mobile-First */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-6 sm:px-6 lg:px-8 border-l-4 border-orange-500 rounded-lg shadow-sm mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/guidance')}
            className="p-2 hover:bg-orange-200 rounded-lg transition-colors mr-2"
            aria-label="Retour au guide"
          >
            <ChevronLeft className="h-5 w-5 text-orange-600" />
          </button>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
            Plan d'Action
          </h1>
        </div>
        <div className="mt-4 hidden md:block">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Votre feuille de route vers l'excellence organisationnelle
          </p>
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Étapes prioritaires :</strong> Actions concrètes pour atteindre vos objectifs
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Suivi du progrès :</strong> Avancement mesurable et deadlines définies
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Statistiques - Mobile First avec 4 tickets-boutons de filtre */}
        <div className="bg-white px-4 py-4 sm:px-6 lg:px-8 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => setSelectedFilter('progress')}
              className={`bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedFilter === 'progress'
                  ? 'ring-2 ring-purple-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-purple-200">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-purple-700">{progressPercentage}%</div>
                  <div className="text-xs sm:text-sm text-purple-600 font-medium">Avancement</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedFilter('completed')}
              className={`bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedFilter === 'completed'
                  ? 'ring-2 ring-green-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-green-200">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-green-700">{completedActions}</div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">Terminées</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedFilter('remaining')}
              className={`bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedFilter === 'remaining'
                  ? 'ring-2 ring-orange-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-orange-200">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-orange-700">{totalActions - completedActions}</div>
                  <div className="text-xs sm:text-sm text-orange-600 font-medium">Restantes</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedFilter('all')}
              className={`bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedFilter === 'all'
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-blue-200">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-700">{actionPlan.targetLevel}</div>
                  <div className="text-xs sm:text-sm text-blue-600 font-medium">Objectif</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Vue d'ensemble du plan */}
        <div className="bg-white rounded-xl p-6 border border-gray-500 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progression */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Progression Globale</h3>
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercentage * 2.51} 251`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-violet-600">{progressPercentage}%</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">{completedActions}/{totalActions} actions terminées</div>
            </div>

            {/* Niveaux */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Évolution de Niveau</h3>
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className={`px-3 py-2 rounded-lg ${getMaturityLevelName(actionPlan.currentLevel).color}`}>
                  <span className="font-semibold text-sm">
                    {getMaturityLevelName(actionPlan.currentLevel).name}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <div className={`px-3 py-2 rounded-lg ${getMaturityLevelName(actionPlan.targetLevel).color}`}>
                  <span className="font-semibold text-sm">
                    {getMaturityLevelName(actionPlan.targetLevel).name}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">Objectif à atteindre</div>
            </div>

            {/* Durée estimée */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Durée Estimée</h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-semibold text-blue-600">{actionPlan.estimatedDuration}</span>
              </div>
              <div className="text-sm text-gray-600">Temps nécessaire estimé</div>
            </div>
          </div>
        </div>

        {/* Description et prérequis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Description */}
          <div className="bg-white rounded-xl p-6 border border-gray-500">
            <h3 className="text-xl font-montserrat font-semibold mb-3">Description</h3>
            <p className="text-gray-600">{actionPlan.description}</p>
          </div>

          {/* Prérequis */}
          <div className="bg-white rounded-xl p-6 border border-gray-500">
            <h3 className="text-xl font-montserrat font-semibold mb-3">Prérequis</h3>
            <div className="space-y-2">
              {actionPlan.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{prerequisite}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions à réaliser */}
        <div className="bg-white rounded-xl p-6 border border-gray-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-montserrat font-semibold">Actions à Réaliser</h3>
            <div className="text-sm text-gray-500">
              {completedActions} sur {totalActions} terminées
            </div>
          </div>

          <div className="space-y-4">
            {actionPlan.actions.map((action, index) => (
              <div key={action.id} className={`border rounded-lg p-4 transition-colors ${
                action.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-500 hover:border-violet-300'
              }`}>
                <div className="flex items-start gap-4">
                  <div className="flex items-center mt-1">
                    <button
                      onClick={() => toggleActionCompletion(action.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        action.completed
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'border-gray-300 hover:border-violet-600'
                      }`}
                    >
                      {action.completed && <CheckCircle className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-medium mb-1 ${
                          action.completed ? 'text-green-800 line-through' : 'text-gray-900'
                        }`}>
                          {index + 1}. {action.title}
                        </h4>
                        <p className={`text-sm mb-2 ${
                          action.completed ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {action.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xl">{getCategoryIcon(action.category)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(action.category)}`}>
                          {action.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {action.estimatedTime}
                      </div>
                      {action.assigned_to && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {action.assigned_to}
                        </div>
                      )}
                      {action.deadline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(action.deadline).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/guidance/recommendations')}
            className="bg-violet-600 text-white p-4 rounded-lg hover:bg-violet-700 transition-colors text-left"
          >
            <TrendingUp className="h-6 w-6 mb-2" />
            <div className="font-medium mb-1">Voir les Recommandations</div>
            <div className="text-sm text-violet-100">Détails des actions suggérées</div>
          </button>

          <button
            onClick={() => navigate('/guidance/compliance')}
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-left"
          >
            <CheckCircle className="h-6 w-6 mb-2" />
            <div className="font-medium mb-1">État de Conformité</div>
            <div className="text-sm text-green-100">Vérifier votre progression</div>
          </button>

          <button
            onClick={() => navigate('/guidance/diagnostic')}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-left"
          >
            <Star className="h-6 w-6 mb-2" />
            <div className="font-medium mb-1">Nouveau Diagnostic</div>
            <div className="text-sm text-blue-100">Réévaluer votre niveau</div>
          </button>
        </div>

        {/* Bouton flottant avec menu d'actions */}
        <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
          {/* Menu d'actions (visible quand showFloatingMenu est true) */}
          {showFloatingMenu && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
              <button
                onClick={() => {
                  navigate('/guidance/recommendations');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <TrendingUp className="h-4 w-4 text-violet-600" />
                <span>Voir Recommandations</span>
              </button>
              
              <button
                onClick={() => {
                  navigate('/guidance/diagnostic');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Star className="h-4 w-4 text-blue-600" />
                <span>Nouveau Diagnostic</span>
              </button>
              
              <button
                onClick={() => {
                  navigate('/guidance/compliance');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>État Conformité</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={() => {
                  // Fonction d'export à implémenter
                  console.log('Export du plan d\'action');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Download className="h-4 w-4 text-orange-600" />
                <span>Exporter Plan PDF</span>
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
};

export default ActionPlanPage;
