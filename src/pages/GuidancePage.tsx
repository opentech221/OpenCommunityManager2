import { Lightbulb, Brain, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrganizationalGuidanceDashboard from '../components/OrganizationalGuidanceDashboard';

export default function GuidancePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-orange-500 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-montserrat font-bold text-gray-900">
                Guide Intuitif Organisationnel
              </h1>
              <p className="text-gray-600 mt-1">
                Votre assistant intelligent pour l'excellence associative
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation rapide */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/guidance/diagnostic')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-violet-300 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-violet-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-900">Diagnostic</span>
            </div>
            <p className="text-sm text-gray-600">Évaluer votre maturité organisationnelle</p>
          </button>

          <button 
            onClick={() => navigate('/guidance/recommendations')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-900">Recommandations</span>
            </div>
            <p className="text-sm text-gray-600">Actions prioritaires pour progresser</p>
          </button>

          <button 
            onClick={() => navigate('/guidance/compliance')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-900">Conformité</span>
            </div>
            <p className="text-sm text-gray-600">Vérifier votre niveau de conformité</p>
          </button>

          <button 
            onClick={() => navigate('/training')}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-gray-900">Formation</span>
            </div>
            <p className="text-sm text-gray-600">Modules d'apprentissage adaptatifs</p>
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
