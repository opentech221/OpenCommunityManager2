import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, 
  CheckCircle, 
  Clock,
  ChevronLeft,
  Filter,
  AlertTriangle,
  TrendingUp,
  User,
  Plus,
  Target,
  Download
} from 'lucide-react';
import { guidanceAPI } from '../services/guidanceAPI';
import type { RecommendationAPI } from '../services/guidanceAPI';

const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<RecommendationAPI[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<RecommendationAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  useEffect(() => {
    filterRecommendations();
  }, [recommendations, selectedPriority, selectedStatus]);

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

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      const response = await guidanceAPI.getRecommendations();
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations:', error);
      // Utiliser des données de test en cas d'erreur
      const testRecommendations: RecommendationAPI[] = [
        {
          id: '1',
          association_id: '1',
          diagnostic_id: '1',
          title: 'Mettre à jour les statuts de l\'association',
          description: 'Vos statuts datent de plus de 5 ans. Une mise à jour permettrait d\'intégrer les nouvelles réglementations et d\'optimiser le fonctionnement.',
          category: 'governance',
          priority: 'high',
          impact: 'high',
          effort: 'medium',
          status: 'pending',
          deadline: '2025-09-30',
          progress: 0,
          assigned_to: 'Président'
        },
        {
          id: '2',
          association_id: '1',
          diagnostic_id: '1',
          title: 'Digitaliser le processus d\'adhésion',
          description: 'Mettre en place un formulaire en ligne pour simplifier les adhésions et améliorer le suivi des membres.',
          category: 'operations',
          priority: 'medium',
          impact: 'medium',
          effort: 'low',
          status: 'in_progress',
          progress: 30,
          assigned_to: 'Secrétaire'
        },
        {
          id: '3',
          association_id: '1',
          diagnostic_id: '1',
          title: 'Établir un plan de communication annuel',
          description: 'Définir une stratégie de communication claire avec calendrier éditorial pour améliorer la visibilité.',
          category: 'communication',
          priority: 'medium',
          impact: 'high',
          effort: 'medium',
          status: 'pending',
          progress: 0
        },
        {
          id: '4',
          association_id: '1',
          diagnostic_id: '1',
          title: 'Mettre en place un tableau de bord financier',
          description: 'Créer des indicateurs de suivi financier pour une meilleure gestion et transparence.',
          category: 'financial',
          priority: 'high',
          impact: 'high',
          effort: 'low',
          status: 'completed',
          progress: 100,
          assigned_to: 'Trésorier'
        }
      ];
      setRecommendations(testRecommendations);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRecommendations = () => {
    let filtered = recommendations;

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(rec => rec.priority === selectedPriority);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(rec => rec.status === selectedStatus);
    }

    setFilteredRecommendations(filtered);
  };

  const updateProgress = async (id: string, progress: number) => {
    try {
      await guidanceAPI.updateRecommendationProgress(id, progress);
      setRecommendations(recommendations.map(rec => 
        rec.id === id ? { ...rec, progress, status: progress === 100 ? 'completed' : 'in_progress' } : rec
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      // Mise à jour locale en cas d'erreur API
      setRecommendations(recommendations.map(rec => 
        rec.id === id ? { ...rec, progress, status: progress === 100 ? 'completed' : 'in_progress' } : rec
      ));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'dismissed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'governance': return '👥';
      case 'operations': return '⚙️';
      case 'communication': return '📢';
      case 'financial': return '💰';
      default: return '📋';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'in_progress': return 'En cours';
      case 'pending': return 'À faire';
      case 'dismissed': return 'Annulée';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return priority;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-900 p-0 sm:p-0 md:p-0 lg:p-0">
      {/* En-tête Mobile-First */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-1 py-6 sm:px-2 lg:px-3 border-l-4 border-orange-500 rounded-lg shadow-sm mb-6">
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
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
            Recommandations
          </h1>
        </div>
        <div className="mt-4 hidden md:block">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Actions prioritaires pour améliorer votre organisation
          </p>
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Actions ciblées :</strong> Recommandations personnalisées basées sur votre diagnostic
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Suivi du progrès :</strong> Avancement et priorités clairement définis
            </p>
          </div>
        </div>
      </div>

      <div className="px-1 sm:px-2 lg:px-3">
        {/* Statistiques - Mobile First avec 4 tickets-boutons de filtre */}
        <div className="bg-white px-1 py-4 sm:px-2 lg:px-3 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => {
                setSelectedPriority('all');
                setSelectedStatus('all');
              }}
              className={`bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-500 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedPriority === 'all' && selectedStatus === 'all' 
                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-blue-200">
                  <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-700">{recommendations.length}</div>
                  <div className="text-xs sm:text-sm text-blue-600 font-medium">Total</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedPriority('high');
                setSelectedStatus('all');
              }}
              className={`bg-gradient-to-br from-red-100 to-red-50 border border-red-500 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedPriority === 'high' && selectedStatus === 'all'
                  ? 'ring-2 ring-red-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-red-200">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-red-700">
                    {recommendations.filter(r => r.priority === 'high').length}
                  </div>
                  <div className="text-xs sm:text-sm text-red-600 font-medium">Urgentes</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedPriority('all');
                setSelectedStatus('in_progress');
              }}
              className={`bg-gradient-to-br from-green-100 to-green-50 border border-green-500 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedPriority === 'all' && selectedStatus === 'in_progress'
                  ? 'ring-2 ring-green-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-green-200">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-green-700">
                    {recommendations.filter(r => r.status === 'in_progress').length}
                  </div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">En cours</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedPriority('all');
                setSelectedStatus('completed');
              }}
              className={`bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-500 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedPriority === 'all' && selectedStatus === 'completed'
                  ? 'ring-2 ring-purple-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-purple-200">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-purple-700">
                    {recommendations.filter(r => r.status === 'completed').length}
                  </div>
                  <div className="text-xs sm:text-sm text-purple-600 font-medium">Terminées</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">Toutes</option>
                  <option value="high">Haute</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Faible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">Tous</option>
                  <option value="pending">À faire</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminées</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des recommandations */}
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getCategoryIcon(recommendation.category)}</span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {recommendation.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                        {getPriorityText(recommendation.priority)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(recommendation.status)}`}>
                        {getStatusText(recommendation.status)}
                      </span>
                      <span className="text-sm text-gray-500">{recommendation.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {recommendation.deadline && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                      <Clock className="h-4 w-4" />
                      {new Date(recommendation.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                  {recommendation.assigned_to && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      {recommendation.assigned_to}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-4">{recommendation.description}</p>

              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progression</span>
                  <span className="text-sm text-gray-500">{recommendation.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-violet-600 to-orange-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${recommendation.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              {recommendation.status !== 'completed' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateProgress(recommendation.id, Math.min(100, recommendation.progress + 25))}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    +25%
                  </button>
                  <button
                    onClick={() => updateProgress(recommendation.id, 100)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Marquer terminée
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRecommendations.length === 0 && (
          <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
            <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune recommandation</h3>
            <p className="text-gray-600">
              {recommendations.length === 0 
                ? "Lancez un diagnostic pour obtenir des recommandations personnalisées."
                : "Aucune recommandation ne correspond aux filtres sélectionnés."
              }
            </p>
          </div>
        )}

        {/* Bouton flottant avec menu d'actions */}
        <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
          {/* Menu d'actions (visible quand showFloatingMenu est true) */}
          {showFloatingMenu && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
              <button
                onClick={() => {
                  navigate('/guidance/diagnostic');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>Nouveau Diagnostic</span>
              </button>
              
              <button
                onClick={() => {
                  navigate('/guidance/action-plan');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Target className="h-4 w-4 text-orange-600" />
                <span>Plan d'Action</span>
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
                  console.log('Export des recommandations');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Download className="h-4 w-4 text-purple-600" />
                <span>Exporter PDF</span>
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

export default RecommendationsPage;
