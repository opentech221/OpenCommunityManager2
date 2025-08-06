import { Lightbulb, Brain, Target, TrendingUp, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrganizationalGuidanceDashboard from '../components/OrganizationalGuidanceDashboard';

export default function GuidancePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-900 p-0 sm:p-0 md:p-0 lg:p-0">
      {/* En-tête Mobile-First */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-6 sm:px-6 lg:px-8 border-l-4 border-orange-500 rounded-lg shadow-sm mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
            Guide Organisationnel
          </h1>
        </div>
        <div className="mt-4 hidden md:block">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Votre assistant intelligent pour l'excellence associative
          </p>
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Diagnostic intelligent :</strong> Évaluez votre maturité organisationnelle
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Actions prioritaires :</strong> Recommandations personnalisées pour progresser
            </p>
          </div>
        </div>
      </div>

      {/* Navigation rapide - Mobile First avec 4 tickets */}
      <div className="bg-white px-4 py-4 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button 
            onClick={() => navigate('/guidance/diagnostic')}
            className="bg-gradient-to-br from-violet-100 to-violet-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 hover:from-violet-200 hover:to-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 group"
            aria-label="Accéder au diagnostic organisationnel"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="p-2 rounded-lg bg-violet-200 group-hover:bg-violet-300 transition-colors">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600" />
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-base font-bold text-violet-700">Diagnostic</div>
                <div className="text-xs text-violet-600 font-medium">Maturité</div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/guidance/recommendations')}
            className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 hover:from-orange-200 hover:to-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 group"
            aria-label="Voir les recommandations"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="p-2 rounded-lg bg-orange-200 group-hover:bg-orange-300 transition-colors">
                <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-base font-bold text-orange-700">Conseils</div>
                <div className="text-xs text-orange-600 font-medium">Actions</div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/guidance/compliance')}
            className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 hover:from-green-200 hover:to-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 group"
            aria-label="Vérifier la conformité"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="p-2 rounded-lg bg-green-200 group-hover:bg-green-300 transition-colors">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-base font-bold text-green-700">Conformité</div>
                <div className="text-xs text-green-600 font-medium">Vérification</div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/guidance/action-plan')}
            className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 hover:from-blue-200 hover:to-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
            aria-label="Accéder au plan d'action"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="p-2 rounded-lg bg-blue-200 group-hover:bg-blue-300 transition-colors">
                <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-base font-bold text-blue-700">Plan d'action</div>
                <div className="text-xs text-blue-600 font-medium">Étapes</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 sm:px-6 lg:px-8">
        <OrganizationalGuidanceDashboard />
      </div>
    </div>
  );
}
