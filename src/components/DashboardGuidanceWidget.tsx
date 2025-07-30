import { Brain, Target, Lightbulb, ChevronRight } from 'lucide-react';
import { useOrganizationalGuidance } from '../hooks/useOrganizationalGuidance';
import { useNavigate } from 'react-router-dom';

const DashboardGuidanceWidget = () => {
  const navigate = useNavigate();
  const {
    currentMaturityLevel,
    insights,
    recommendations,
    complianceScore
  } = useOrganizationalGuidance();

  const topInsights = insights.slice(0, 2);
  const topRecommendations = recommendations.slice(0, 2);

  return (
    <div className="bg-gradient-to-br from-violet-50 to-orange-50 rounded-xl p-6 border border-violet-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-orange-500 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-montserrat font-semibold text-gray-900">Guide Intuitif</h3>
            <p className="text-sm text-gray-600">Assistant organisationnel</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/guidance')}
          className="text-violet-600 hover:text-violet-700 flex items-center gap-1 text-sm font-medium"
        >
          Voir tout
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Niveau de maturité */}
      <div className="mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${currentMaturityLevel.color}`}>
          <Target className="h-4 w-4" />
          <span>{currentMaturityLevel.name}</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Conformité : <span className="font-medium text-green-600">{complianceScore}%</span>
        </div>
      </div>

      {/* Insights rapides */}
      {topInsights.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-orange-500" />
            Insights
          </h4>
          {topInsights.map((insight) => (
            <div key={insight.id} className="text-sm text-gray-600 flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>{insight.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recommandations rapides */}
      {topRecommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Actions recommandées</h4>
          {topRecommendations.map((rec) => (
            <div key={rec.id} className="text-sm text-gray-600 flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>{rec.title}</span>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={() => navigate('/guidance')}
        className="mt-4 w-full bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
      >
        Accéder au guide complet
      </button>
    </div>
  );
};

export default DashboardGuidanceWidget;
