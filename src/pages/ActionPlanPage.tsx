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
  Star
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

  useEffect(() => {
    loadActionPlan();
  }, []);

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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-500">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/guidance')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-orange-500 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-montserrat font-bold text-gray-900">
                Plan d'Action Personnalisé
              </h1>
              <p className="text-gray-600 mt-1">
                Votre feuille de route vers l'excellence organisationnelle
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
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
      </div>
    </div>
  );
};

export default ActionPlanPage;
