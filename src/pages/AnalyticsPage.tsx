import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  ChevronLeft,
  Activity,
  Target,
  Users,
  Download,
  Filter,
  Plus,
  CheckCircle
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalDiagnostics: number;
    avgMaturityLevel: number;
    completedRecommendations: number;
    complianceScore: number;
    trend: 'up' | 'down' | 'stable';
    trendPercentage: number;
  };
  maturityEvolution: {
    month: string;
    level: number;
    score: number;
  }[];
  categoryScores: {
    category: string;
    current: number;
    target: number;
    improvement: number;
  }[];
  recentActivities: {
    id: string;
    type: 'diagnostic' | 'recommendation' | 'compliance';
    title: string;
    date: string;
    status: 'completed' | 'in_progress' | 'pending';
  }[];
}

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState<string>('all');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

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

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      // Simulation de données analytiques
      const testAnalytics: AnalyticsData = {
        overview: {
          totalDiagnostics: 12,
          avgMaturityLevel: 2.8,
          completedRecommendations: 18,
          complianceScore: 87,
          trend: 'up',
          trendPercentage: 15.3
        },
        maturityEvolution: [
          { month: 'Jan 2025', level: 2, score: 65 },
          { month: 'Feb 2025', level: 2, score: 68 },
          { month: 'Mar 2025', level: 2, score: 72 },
          { month: 'Apr 2025', level: 2, score: 75 },
          { month: 'Mai 2025', level: 3, score: 78 },
          { month: 'Jun 2025', level: 3, score: 82 },
          { month: 'Jul 2025', level: 3, score: 85 }
        ],
        categoryScores: [
          { category: 'Gouvernance', current: 85, target: 90, improvement: 12 },
          { category: 'Opérations', current: 78, target: 85, improvement: 8 },
          { category: 'Finances', current: 92, target: 95, improvement: 5 },
          { category: 'Communication', current: 75, target: 80, improvement: 15 },
          { category: 'Ressources Humaines', current: 88, target: 90, improvement: 3 },
          { category: 'Performance', current: 82, target: 88, improvement: 10 }
        ],
        recentActivities: [
          {
            id: '1',
            type: 'diagnostic',
            title: 'Diagnostic complet de gouvernance',
            date: '2025-07-28',
            status: 'completed'
          },
          {
            id: '2',
            type: 'recommendation',
            title: 'Mise à jour des statuts',
            date: '2025-07-25',
            status: 'in_progress'
          },
          {
            id: '3',
            type: 'compliance',
            title: 'Vérification conformité RGPD',
            date: '2025-07-22',
            status: 'completed'
          },
          {
            id: '4',
            type: 'recommendation',
            title: 'Formation équipe bénévoles',
            date: '2025-07-20',
            status: 'pending'
          }
        ]
      };
      setAnalyticsData(testAnalytics);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'diagnostic': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'recommendation': return <Target className="h-4 w-4 text-orange-600" />;
      case 'compliance': return <BarChart3 className="h-4 w-4 text-green-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  const exportData = () => {
    // Simulation d'export de données
    const dataToExport = {
      date: new Date().toISOString(),
      period: selectedPeriod,
      data: analyticsData
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Données analytiques non disponibles</h3>
          <p className="text-gray-600">Effectuez quelques diagnostics pour voir vos statistiques.</p>
        </div>
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
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
              Analytics
            </h1>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-2 py-1 sm:px-3 sm:py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
            >
              <option value="1m">1 mois</option>
              <option value="3m">3 mois</option>
              <option value="6m">6 mois</option>
              <option value="1y">1 an</option>
            </select>
            <button
              onClick={exportData}
              className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm sm:text-base"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>
        <div className="mt-4 hidden md:block">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Tableaux de bord et métriques de performance
          </p>
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Données temps réel :</strong> Suivi de l'évolution de maturité organisationnelle
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Rapports détaillés :</strong> Export et analyse de performance par catégorie
            </p>
          </div>
        </div>
      </div>

      <div className="px-1 sm:px-2 lg:px-3 py-6">
        {/* Statistiques - Mobile First avec 4 tickets-boutons de filtre */}
        <div className="bg-white px-1 py-4 sm:px-2 lg:px-3 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => setSelectedMetric('diagnostics')}
              className={`bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-500 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedMetric === 'diagnostics'
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-blue-200">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-700">{analyticsData.overview.totalDiagnostics}</div>
                  <div className="text-xs sm:text-sm text-blue-600 font-medium">Diagnostics</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMetric('maturity')}
              className={`bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-500 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedMetric === 'maturity'
                  ? 'ring-2 ring-orange-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-orange-200">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-orange-700">{analyticsData.overview.avgMaturityLevel.toFixed(1)}</div>
                  <div className="text-xs sm:text-sm text-orange-600 font-medium">Maturité</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMetric('actions')}
              className={`bg-gradient-to-br from-green-100 to-green-50 border border-green-500 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedMetric === 'actions'
                  ? 'ring-2 ring-green-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-green-200">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-green-700">{analyticsData.overview.completedRecommendations}</div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">Actions</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMetric('all')}
              className={`bg-gradient-to-br from-violet-100 to-violet-50 border border-violet-500 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedMetric === 'all'
                  ? 'ring-2 ring-violet-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-violet-200">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-violet-700">{analyticsData.overview.complianceScore}%</div>
                  <div className="text-xs sm:text-sm text-violet-600 font-medium">Conformité</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Indicateur de tendance */}
        <div className="bg-white rounded-lg p-1 mb-6 border border-gray-200 sm:p-2 lg:p-3">
          <div className="flex items-center justify-center">
            <TrendingUp className={`h-4 w-4 ${analyticsData.overview.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-sm ml-1 ${analyticsData.overview.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              +{analyticsData.overview.trendPercentage}% ce mois
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Évolution de la maturité */}
          <div className="bg-white rounded-xl p-1 border border-gray-200 sm:p-2 lg:p-3">
            <h3 className="text-xl font-montserrat font-semibold mb-4">Évolution de la Maturité</h3>
            <div className="space-y-3">
              {analyticsData.maturityEvolution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-20">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Niveau {item.level}</span>
                      <span className="text-xs text-gray-500">({item.score}%)</span>
                    </div>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scores par catégorie */}
          <div className="bg-white rounded-xl p-1 border border-gray-200 sm:p-2 lg:p-3">
            <h3 className="text-xl font-montserrat font-semibold mb-4">Performance par Catégorie</h3>
            <div className="space-y-4">
              {analyticsData.categoryScores.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{category.current}%</span>
                      <span className="text-xs text-green-600">+{category.improvement}%</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${category.current}%` }}
                      ></div>
                    </div>
                    <div 
                      className="absolute top-0 h-2 w-1 bg-orange-500 rounded-full"
                      style={{ left: `${category.target}%` }}
                      title={`Objectif: ${category.target}%`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-xl p-1 border border-gray-200 sm:p-2 lg:p-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-montserrat font-semibold">Activités Récentes</h3>
            <button className="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors">
              <Filter className="h-4 w-4" />
              Filtrer
            </button>
          </div>

          <div className="space-y-4">
            {analyticsData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-1 border border-gray-500 rounded-lg hover:bg-gray-50 transition-colors sm:p-2 lg:p-3">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{activity.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {getStatusText(activity.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/guidance/diagnostic')}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-left"
          >
            <Activity className="h-6 w-6 mb-2" />
            <div className="font-medium mb-1">Nouveau Diagnostic</div>
            <div className="text-sm text-blue-100">Évaluer votre progression</div>
          </button>

          <button
            onClick={() => navigate('/guidance/action-plan')}
            className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors text-left"
          >
            <Target className="h-6 w-6 mb-2" />
            <div className="font-medium mb-1">Plan d'Action</div>
            <div className="text-sm text-orange-100">Voir votre feuille de route</div>
          </button>

          <button
            onClick={() => navigate('/guidance/compliance')}
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-left"
          >
            <BarChart3 className="h-6 w-6 mb-2" />
            <div className="font-medium mb-1">Conformité</div>
            <div className="text-sm text-green-100">Vérifier votre état</div>
          </button>
        </div>

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
                  navigate('/guidance/recommendations');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Activity className="h-4 w-4 text-violet-600" />
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
                  // Fonction d'export à implémenter
                  console.log('Export des analytiques');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <Download className="h-4 w-4 text-indigo-600" />
                <span>Exporter Rapport</span>
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

export default AnalyticsPage;
