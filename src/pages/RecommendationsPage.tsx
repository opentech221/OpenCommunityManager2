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
  User
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

  useEffect(() => {
    loadRecommendations();
  }, []);

  useEffect(() => {
    filterRecommendations();
  }, [recommendations, selectedPriority, selectedStatus]);

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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/guidance')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-montserrat font-bold text-gray-900">
                Recommandations
              </h1>
              <p className="text-gray-600 mt-1">
                Actions prioritaires pour améliorer votre organisation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{recommendations.length}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {recommendations.filter(r => r.priority === 'high').length}
                </div>
                <div className="text-sm text-gray-500">Haute priorité</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {recommendations.filter(r => r.status === 'in_progress').length}
                </div>
                <div className="text-sm text-gray-500">En cours</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {recommendations.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-500">Terminées</div>
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default RecommendationsPage;
