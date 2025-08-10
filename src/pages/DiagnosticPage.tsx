import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  ChevronLeft,
  RefreshCw,
  Download,
  Plus
} from 'lucide-react';
import { guidanceAPI } from '../services/guidanceAPI';
import type { DiagnosticAPI } from '../services/guidanceAPI';

const DiagnosticPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDiagnostic, setCurrentDiagnostic] = useState<DiagnosticAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  // Fonction utilitaire pour formater les dates de manière sécurisée
  const formatDiagnosticDate = (dateStr: string | undefined | null, options?: Intl.DateTimeFormatOptions): string => {
    if (!dateStr) return 'Date non renseignée';
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    return date.toLocaleDateString('fr-FR', options || {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const loadTestDiagnostic = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    const testDiagnostic: DiagnosticAPI = {
      id: 'test-1',
      association_id: 'test-association-1',
      performed_at: today.toISOString(),
      next_assessment_date: nextMonth.toISOString(),
      current_maturity_level: 2,
      target_maturity_level: 3,
      overall_score: 78,
      category_scores: {
        governance: 82,
        operations: 75,
        finances: 85,
        communication: 70,
        human_resources: 80,
        performance: 76
      },
      strengths: [
        'Gouvernance structurée avec des statuts clairs',
        'Finances bien gérées et transparentes',
        'Équipe de bénévoles motivée'
      ],
      weaknesses: [
        'Communication externe à améliorer',
        'Processus opérationnels à standardiser',
        'Système d\'évaluation des performances manquant'
      ]
    };
    setCurrentDiagnostic(testDiagnostic);
  };

  const loadDiagnostics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await guidanceAPI.getDiagnostics();
      if (response.data.diagnostics && response.data.diagnostics.length > 0) {
        setCurrentDiagnostic(response.data.diagnostics[0]);
      } else {
        // Fallback avec données de test si aucun diagnostic trouvé
        loadTestDiagnostic();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des diagnostics:', error);
      // Charger les données de test en cas d'erreur
      loadTestDiagnostic();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiagnostics();
  }, [loadDiagnostics]);

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

  const runNewDiagnostic = async () => {
    try {
      setIsRunningDiagnostic(true);
      // Simuler un nouveau diagnostic (ici vous pouvez implémenter la logique de diagnostic)
      const newDiagnostic = {
        current_maturity_level: 2,
        target_maturity_level: 3,
        overall_score: Math.floor(Math.random() * 30) + 70, // Score entre 70-100
        category_scores: {
          governance: Math.floor(Math.random() * 20) + 75,
          operations: Math.floor(Math.random() * 20) + 70,
          compliance: Math.floor(Math.random() * 30) + 60,
          performance: Math.floor(Math.random() * 25) + 70,
        },
        strengths: [
          "Excellente gouvernance",
          "Équipe motivée et compétente",
          "Bonne gestion financière"
        ],
        weaknesses: [
          "Documentation incomplète",
          "Processus de communication à améliorer",
          "Suivi des indicateurs à renforcer"
        ]
      };

      const response = await guidanceAPI.createDiagnostic(newDiagnostic);
      await loadDiagnostics();
      setCurrentDiagnostic(response.data);
    } catch (error) {
      console.error('Erreur lors de l\'exécution du diagnostic:', error);
    } finally {
      setIsRunningDiagnostic(false);
    }
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
      case 'governance': return '👥';
      case 'operations': return '⚙️';
      case 'compliance': return '📋';
      case 'performance': return '📈';
      default: return '📊';
    }
  };

  const getCategoryName = (category: string) => {
    const names = {
      governance: 'Gouvernance',
      operations: 'Opérations',
      compliance: 'Conformité',
      performance: 'Performance'
    };
    return names[category as keyof typeof names] || category;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-900 p-0">
      {/* En-tête Mobile-First */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-1 py-6 sm:px-2 lg:px-3 border-l-4 border-orange-500 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between">
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
              Diagnostic
            </h1>
          </div>
          <button
            onClick={runNewDiagnostic}
            disabled={isRunningDiagnostic}
            className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm sm:text-base disabled:opacity-50"
          >
            {isRunningDiagnostic ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Target className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isRunningDiagnostic ? 'Analyse en cours...' : 'Nouveau diagnostic'}
            </span>
            <span className="sm:hidden">
              {isRunningDiagnostic ? 'Analyse...' : 'Nouveau'}
            </span>
          </button>
        </div>
        <div className="mt-4 hidden md:block">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Évaluez votre niveau de maturité organisationnelle
          </p>
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Analyse complète :</strong> Évaluation des 6 domaines clés de votre organisation
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Score détaillé :</strong> Points forts et axes d'amélioration identifiés
            </p>
          </div>
        </div>
      </div>

      <div className="px-1 sm:px-2 lg:px-3 py-6">
        {currentDiagnostic ? (
          <div className="space-y-6">
            {/* Vue d'ensemble */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Niveau actuel */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-violet-500">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Niveau Actuel</h3>
                      <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-violet-600" />
                      </div>
                    </div>
                    <div className={`inline-flex px-4 py-2 rounded-lg font-medium text-sm mb-4 ${getMaturityLevelName(currentDiagnostic.current_maturity_level).color} shadow-sm`}>
                      {getMaturityLevelName(currentDiagnostic.current_maturity_level).name}
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <div className="text-4xl font-bold text-violet-600">
                        {currentDiagnostic.overall_score}
                      </div>
                      <div className="text-xl text-violet-500 font-medium">%</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Score global</div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${currentDiagnostic.overall_score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Progression */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-orange-500">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Progression</h3>
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="flex flex-col items-center">
                        <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getMaturityLevelName(currentDiagnostic.current_maturity_level).color} shadow-sm`}>
                          Niveau {currentDiagnostic.current_maturity_level}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">Actuel</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-orange-300 to-orange-500 mt-2"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getMaturityLevelName(currentDiagnostic.target_maturity_level).color} shadow-sm`}>
                          Niveau {currentDiagnostic.target_maturity_level}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">Objectif</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 font-medium">
                        Objectif à atteindre
                      </div>
                      <div className="text-xs text-orange-600 mt-1">
                        +{currentDiagnostic.target_maturity_level - currentDiagnostic.current_maturity_level} niveau{currentDiagnostic.target_maturity_level - currentDiagnostic.current_maturity_level > 1 ? 'x' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-emerald-500">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Dernier diagnostic</h3>
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-emerald-100">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Effectué le</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {formatDiagnosticDate(currentDiagnostic.performed_at, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-emerald-100">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Prochain prévu</div>
                        <div className="text-sm font-medium text-emerald-700">
                          {formatDiagnosticDate(currentDiagnostic.next_assessment_date)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scores par catégorie */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-montserrat font-semibold mb-6">Scores par Catégorie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(currentDiagnostic.category_scores).map(([category, score]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(category)}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">{getCategoryName(category)}</span>
                          <span className="font-semibold text-violet-600">{score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-violet-600 to-orange-500 h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Points forts et faibles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Points forts */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-montserrat font-semibold">Points Forts</h3>
                </div>
                <div className="space-y-3">
                  {currentDiagnostic.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Points à améliorer */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  <h3 className="text-xl font-montserrat font-semibold">Points à Améliorer</h3>
                </div>
                <div className="space-y-3">
                  {currentDiagnostic.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-orange-800">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-montserrat font-semibold mb-4">Actions Disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => navigate('/guidance/recommendations')}
                  className="bg-violet-600 text-white p-4 rounded-lg hover:bg-violet-700 transition-colors text-left"
                >
                  <div className="font-medium mb-1">Voir les Recommandations</div>
                  <div className="text-sm text-violet-100">Actions prioritaires pour progresser</div>
                </button>
                
                <button 
                  onClick={() => navigate('/guidance/compliance')}
                  className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-left"
                >
                  <div className="font-medium mb-1">Vérifier la Conformité</div>
                  <div className="text-sm text-green-100">État de conformité réglementaire</div>
                </button>
                
                <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-left flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  <div>
                    <div className="font-medium mb-1">Télécharger le Rapport</div>
                    <div className="text-sm text-blue-100">Rapport PDF complet</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun diagnostic disponible</h3>
            <p className="text-gray-600 mb-6">
              Lancez votre premier diagnostic pour évaluer votre niveau de maturité organisationnelle.
            </p>
            <button
              onClick={runNewDiagnostic}
              disabled={isRunningDiagnostic}
              className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Target className="h-5 w-5" />
              Lancer le diagnostic
            </button>
          </div>
        )}

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
                  runNewDiagnostic();
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <span>Nouveau Diagnostic</span>
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

export default DiagnosticPage;
