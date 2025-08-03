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
  Filter
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

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

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
            <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-blue-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-montserrat font-bold text-gray-900">
                Tableaux de Bord Analytiques
              </h1>
              <p className="text-gray-600 mt-1">
                Analysez l'évolution de votre organisation
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
                <option value="1m">1 mois</option>
                <option value="3m">3 mois</option>
                <option value="6m">6 mois</option>
                <option value="1y">1 an</option>
              </select>
              <button
                onClick={exportData}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total diagnostics */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Diagnostics Réalisés</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalDiagnostics}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className={`h-4 w-4 ${analyticsData.overview.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm ml-1 ${analyticsData.overview.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                +{analyticsData.overview.trendPercentage}% ce mois
              </span>
            </div>
          </div>

          {/* Niveau de maturité moyen */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Niveau Moyen</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.avgMaturityLevel.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progression</span>
                <span>{Math.round(analyticsData.overview.avgMaturityLevel * 20)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analyticsData.overview.avgMaturityLevel * 20}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Recommandations terminées */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actions Terminées</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.completedRecommendations}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span>Sur les 6 derniers mois</span>
            </div>
          </div>

          {/* Score de conformité */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conformité</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.complianceScore}%</p>
              </div>
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-violet-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analyticsData.overview.complianceScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Évolution de la maturité */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
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
          <div className="bg-white rounded-xl p-6 border border-gray-200">
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
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-montserrat font-semibold">Activités Récentes</h3>
            <button className="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors">
              <Filter className="h-4 w-4" />
              Filtrer
            </button>
          </div>

          <div className="space-y-4">
            {analyticsData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 border border-gray-500 rounded-lg hover:bg-gray-50 transition-colors">
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
      </div>
    </div>
  );
};

export default AnalyticsPage;
