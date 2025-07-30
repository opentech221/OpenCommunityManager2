import { 
  Brain, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen,
  Users,
  Scale,
  DollarSign,
  Cog,
  ChevronRight,
  Star,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrganizationalGuidance } from '../hooks/useOrganizationalGuidance';
import { COMPLIANCE_CATEGORIES } from '../constants/guidance';

const OrganizationalGuidanceDashboard = () => {
  const navigate = useNavigate();
  const {
    diagnostic,
    insights,
    recommendations,
    isLoading,
    currentMaturityLevel,
    nextMaturityLevel,
    complianceScore,
    markRecommendationComplete,
    dismissInsight
  } = useOrganizationalGuidance();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!diagnostic) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      case 'suggestion': return Lightbulb;
      case 'achievement': return Star;
      default: return CheckCircle;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-red-600 bg-red-50';
      case 'opportunity': return 'text-green-600 bg-green-50';
      case 'suggestion': return 'text-blue-600 bg-blue-50';
      case 'achievement': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec vue d'ensemble */}
      <div className="bg-gradient-to-r from-violet-600 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-8 w-8" />
          <h1 className="text-2xl font-montserrat font-bold">
            Assistant de Guidance Organisationnelle
          </h1>
        </div>
        <p className="text-violet-100 text-lg">
          Votre guide intelligent pour l'excellence organisationnelle
        </p>
      </div>

      {/* Niveau de maturité actuel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-violet-600" />
            <h2 className="text-xl font-montserrat font-semibold">Niveau de Maturité</h2>
          </div>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${currentMaturityLevel.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{currentMaturityLevel.name.split(' ')[0]}</span>
                <span className="font-semibold">{currentMaturityLevel.name.split(' ').slice(1).join(' ')}</span>
              </div>
              <p className="text-sm opacity-90">{currentMaturityLevel.description}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Score global :</span>
              <span className="font-semibold text-violet-600">{diagnostic.overallScore}/100</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gouvernance</span>
                <span className="font-medium">{diagnostic.categories.governance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-violet-600 h-2 rounded-full" 
                  style={{ width: `${diagnostic.categories.governance}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Opérations</span>
                <span className="font-medium">{diagnostic.categories.operations}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${diagnostic.categories.operations}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conformité</span>
                <span className="font-medium">{diagnostic.categories.compliance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${diagnostic.categories.compliance}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Performance</span>
                <span className="font-medium">{diagnostic.categories.performance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${diagnostic.categories.performance}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Objectif de niveau suivant */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-montserrat font-semibold">Objectif Suivant</h2>
          </div>

          <div className={`p-4 rounded-lg ${nextMaturityLevel.color} mb-4`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{nextMaturityLevel.name.split(' ')[0]}</span>
              <span className="font-semibold">{nextMaturityLevel.name.split(' ').slice(1).join(' ')}</span>
            </div>
            <p className="text-sm opacity-90">{nextMaturityLevel.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Prérequis pour y accéder :</h3>
            {nextMaturityLevel.requirements.slice(0, 3).map((requirement, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{requirement}</span>
              </div>
            ))}
            {nextMaturityLevel.requirements.length > 3 && (
              <div className="text-sm text-gray-500">
                +{nextMaturityLevel.requirements.length - 3} autres prérequis
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('/guidance/action-plan')}
            className="mt-4 w-full bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
          >
            <Target className="h-4 w-4" />
            Voir le plan d'action
          </button>
        </div>
      </div>

      {/* Insights intelligents */}
      {insights.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-montserrat font-semibold">Insights Intelligents</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight) => {
              const IconComponent = getInsightIcon(insight.type);
              return (
                <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                    <button
                      onClick={() => dismissInsight(insight.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  {insight.actionable && (
                    <button 
                      onClick={() => navigate('/guidance/recommendations')}
                      className="text-sm font-medium text-current underline hover:no-underline"
                    >
                      Voir les actions →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommandations prioritaires */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-montserrat font-semibold">Recommandations Prioritaires</h2>
          </div>

          <div className="space-y-4">
            {recommendations.slice(0, 3).map((recommendation) => (
              <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority === 'high' ? 'Haute' : 
                       recommendation.priority === 'medium' ? 'Moyenne' : 'Faible'}
                    </span>
                    <span className="text-sm text-gray-500">{recommendation.category}</span>
                  </div>
                  <button
                    onClick={() => markRecommendationComplete(recommendation.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </div>

                <h3 className="font-medium text-gray-900 mb-2">{recommendation.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Durée estimée : {recommendation.estimatedDuration}</span>
                  <button 
                    onClick={() => navigate('/guidance/recommendations')}
                    className="flex items-center gap-1 text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Voir détails
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* État de conformité */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-montserrat font-semibold">État de Conformité</h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{complianceScore}%</div>
            <div className="text-sm text-gray-500">Score global</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(COMPLIANCE_CATEGORIES).map(([key, category]) => {
            const categoryChecks = diagnostic.complianceChecks.filter(check => check.category === key);
            const compliantChecks = categoryChecks.filter(check => check.status === 'compliant');
            const percentage = categoryChecks.length > 0 ? Math.round((compliantChecks.length / categoryChecks.length) * 100) : 0;

            return (
              <div key={key} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${category.color} bg-opacity-10`}>
                  {key === 'legal' && <Scale className={`h-6 w-6 ${category.color}`} />}
                  {key === 'governance' && <Users className={`h-6 w-6 ${category.color}`} />}
                  {key === 'financial' && <DollarSign className={`h-6 w-6 ${category.color}`} />}
                  {key === 'operational' && <Cog className={`h-6 w-6 ${category.color}`} />}
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                <div className={`text-lg font-bold ${category.color}`}>{percentage}%</div>
                <div className="text-xs text-gray-500">{compliantChecks.length}/{categoryChecks.length} conformes</div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => navigate('/guidance/compliance')}
          className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          Voir le détail de conformité
        </button>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/guidance/diagnostic')}
          className="bg-violet-600 text-white p-4 rounded-lg hover:bg-violet-700 transition-colors text-left"
        >
          <Target className="h-6 w-6 mb-2" />
          <div className="font-medium mb-1">Nouveau Diagnostic</div>
          <div className="text-sm text-violet-100">Évaluer votre progression</div>
        </button>

        <button
          onClick={() => navigate('/guidance/action-plan')}
          className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors text-left"
        >
          <TrendingUp className="h-6 w-6 mb-2" />
          <div className="font-medium mb-1">Plan d'Action</div>
          <div className="text-sm text-orange-100">Votre feuille de route</div>
        </button>

        <button
          onClick={() => navigate('/guidance/analytics')}
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-left"
        >
          <BookOpen className="h-6 w-6 mb-2" />
          <div className="font-medium mb-1">Tableaux de Bord</div>
          <div className="text-sm text-blue-100">Analyser vos données</div>
        </button>
      </div>
    </div>
  );
};

export default OrganizationalGuidanceDashboard;
