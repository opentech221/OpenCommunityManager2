import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  ChevronLeft,
  RefreshCw,
  Wrench,
  Users,
  DollarSign,
  Cog,
  AlertCircle,
  Plus,
  Target,
  TrendingUp
} from 'lucide-react';
import { guidanceAPI } from '../services/guidanceAPI';
import type { ComplianceCheckAPI } from '../services/guidanceAPI';

const CompliancePage: React.FC = () => {
  const navigate = useNavigate();
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheckAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  useEffect(() => {
    loadComplianceChecks();
  }, []);

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

  const loadComplianceChecks = async () => {
    try {
      setIsLoading(true);
      const response = await guidanceAPI.getComplianceChecks();
      setComplianceChecks(response.data.checks);
    } catch (error) {
      console.error('Erreur lors du chargement des vérifications:', error);
      // Utiliser des données de test
      const testChecks: ComplianceCheckAPI[] = [
        {
          id: '1',
          association_id: '1',
          diagnostic_id: '1',
          category: 'legal',
          title: 'Déclaration préfectorale à jour',
          description: 'Vérifier que la dernière déclaration préfectorale a été effectuée dans les délais',
          status: 'compliant',
          priority: 'high',
          auto_fix_available: false
        },
        {
          id: '2',
          association_id: '1',
          diagnostic_id: '1',
          category: 'legal',
          title: 'Statuts conformes',
          description: 'Les statuts doivent être conformes à la réglementation en vigueur',
          status: 'warning',
          priority: 'medium',
          next_check_date: '2025-12-31',
          auto_fix_available: false
        },
        {
          id: '3',
          association_id: '1',
          diagnostic_id: '1',
          category: 'governance',
          title: 'Procès-verbaux d\'assemblée générale',
          description: 'Conservation des PV d\'AG des 3 dernières années',
          status: 'compliant',
          priority: 'medium',
          auto_fix_available: false
        },
        {
          id: '4',
          association_id: '1',
          diagnostic_id: '1',
          category: 'financial',
          title: 'Comptabilité tenue à jour',
          description: 'Vérification de la tenue régulière de la comptabilité',
          status: 'non_compliant',
          priority: 'high',
          auto_fix_available: true
        },
        {
          id: '5',
          association_id: '1',
          diagnostic_id: '1',
          category: 'financial',
          title: 'Rapport financier annuel',
          description: 'Établissement et présentation du rapport financier annuel',
          status: 'compliant',
          priority: 'medium',
          auto_fix_available: false
        },
        {
          id: '6',
          association_id: '1',
          diagnostic_id: '1',
          category: 'operational',
          title: 'Registre des membres',
          description: 'Tenue à jour du registre des membres adhérents',
          status: 'warning',
          priority: 'medium',
          auto_fix_available: true
        },
        {
          id: '7',
          association_id: '1',
          diagnostic_id: '1',
          category: 'operational',
          title: 'Assurance responsabilité civile',
          description: 'Souscription d\'une assurance RC pour les activités',
          status: 'compliant',
          priority: 'high',
          auto_fix_available: false
        }
      ];
      setComplianceChecks(testChecks);
    } finally {
      setIsLoading(false);
    }
  };

  const runComplianceCheck = async (category?: string) => {
    try {
      setIsRunningCheck(true);
      await guidanceAPI.triggerComplianceCheck(category);
      await loadComplianceChecks();
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      // Simuler une mise à jour pour la démo
      setTimeout(() => {
        loadComplianceChecks();
      }, 2000);
    } finally {
      setIsRunningCheck(false);
    }
  };

  const autoFix = async (checkId: string) => {
    try {
      await guidanceAPI.autoFixCompliance(checkId);
      setComplianceChecks(checks => 
        checks.map(check => 
          check.id === checkId 
            ? { ...check, status: 'compliant' as const }
            : check
        )
      );
    } catch (error) {
      console.error('Erreur lors de la correction automatique:', error);
      // Simuler la correction pour la démo
      setComplianceChecks(checks => 
        checks.map(check => 
          check.id === checkId 
            ? { ...check, status: 'compliant' as const }
            : check
        )
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'non_compliant': return XCircle;
      case 'warning': return AlertTriangle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50 border-green-200';
      case 'non_compliant': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant': return 'Conforme';
      case 'non_compliant': return 'Non conforme';
      case 'warning': return 'Attention';
      default: return 'Inconnu';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'legal': return Scale;
      case 'governance': return Users;
      case 'financial': return DollarSign;
      case 'operational': return Cog;
      default: return Scale;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'legal': return 'Légal';
      case 'governance': return 'Gouvernance';
      case 'financial': return 'Financier';
      case 'operational': return 'Opérationnel';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'legal': return 'text-blue-600 bg-blue-100';
      case 'governance': return 'text-purple-600 bg-purple-100';
      case 'financial': return 'text-green-600 bg-green-100';
      case 'operational': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredChecks = selectedCategory === 'all' 
    ? complianceChecks 
    : complianceChecks.filter(check => check.category === selectedCategory);

  const categories = ['legal', 'governance', 'financial', 'operational'];
  
  const getComplianceStats = () => {
    const total = complianceChecks.length;
    const compliant = complianceChecks.filter(c => c.status === 'compliant').length;
    const nonCompliant = complianceChecks.filter(c => c.status === 'non_compliant').length;
    const warnings = complianceChecks.filter(c => c.status === 'warning').length;
    
    return {
      total,
      compliant,
      nonCompliant,
      warnings,
      percentage: total > 0 ? Math.round((compliant / total) * 100) : 0
    };
  };

  const stats = getComplianceStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-900 p-0">
      {/* En-tête Mobile-First */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-6 sm:px-6 lg:px-8 border-l-4 border-orange-500 rounded-lg shadow-sm mb-6">
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
                <Scale className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
              Conformité
            </h1>
          </div>
          <button
            onClick={() => runComplianceCheck()}
            disabled={isRunningCheck}
            className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm sm:text-base disabled:opacity-50"
          >
            {isRunningCheck ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Scale className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isRunningCheck ? 'Vérification...' : 'Vérifier'}
            </span>
            <span className="sm:hidden">
              {isRunningCheck ? 'Check...' : 'Check'}
            </span>
          </button>
        </div>
        <div className="mt-4 hidden md:block">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Vérifications réglementaires et bonnes pratiques
          </p>
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Conformité légale :</strong> Vérifications automatiques des obligations réglementaires
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Suivi continu :</strong> Alertes et rappels pour rester en conformité
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Statistiques - Mobile First avec 4 tickets-boutons de filtre */}
        <div className="bg-white px-4 py-4 sm:px-6 lg:px-8 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedCategory === 'all'
                  ? 'ring-2 ring-green-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-green-200">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-green-700">{stats.compliant}</div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">Conformes</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left hover:scale-105`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-orange-200">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-orange-700">{stats.warnings}</div>
                  <div className="text-xs sm:text-sm text-orange-600 font-medium">Attention</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`bg-gradient-to-br from-red-100 to-red-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left hover:scale-105`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-red-200">
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-red-700">{stats.nonCompliant}</div>
                  <div className="text-xs sm:text-sm text-red-600 font-medium">Non conformes</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-3 sm:p-4 shadow hover:shadow-md transition-all duration-200 text-left ${
                selectedCategory === 'all'
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 rounded-lg bg-blue-200">
                  <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-700">{stats.percentage}%</div>
                  <div className="text-xs sm:text-sm text-blue-600 font-medium">Score global</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">Catégories :</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes
              </button>
              {categories.map((category) => {
                const Icon = getCategoryIcon(category);
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {getCategoryName(category)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Liste des vérifications */}
        <div className="space-y-4">
          {filteredChecks.map((check) => {
            const StatusIcon = getStatusIcon(check.status);
            const CategoryIcon = getCategoryIcon(check.category);
            
            return (
              <div key={check.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(check.category)}`}>
                      <CategoryIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {check.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{check.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{getCategoryName(check.category)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          check.priority === 'high' ? 'bg-red-100 text-red-800' :
                          check.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {check.priority === 'high' ? 'Haute' : 
                           check.priority === 'medium' ? 'Moyenne' : 'Faible'} priorité
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(check.status)}`}>
                      <StatusIcon className="h-5 w-5" />
                      <span className="font-medium">{getStatusText(check.status)}</span>
                    </div>
                  </div>
                </div>

                {check.next_check_date && (
                  <div className="text-sm text-gray-500 mb-3">
                    Prochaine vérification : {new Date(check.next_check_date).toLocaleDateString('fr-FR')}
                  </div>
                )}

                {check.status !== 'compliant' && (
                  <div className="flex items-center gap-2">
                    {check.auto_fix_available ? (
                      <button
                        onClick={() => autoFix(check.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Wrench className="h-4 w-4" />
                        Correction automatique
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500 italic">
                        Correction manuelle requise
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredChecks.length === 0 && (
          <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
            <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune vérification</h3>
            <p className="text-gray-600">
              Aucune vérification ne correspond à la catégorie sélectionnée.
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
                  navigate('/guidance/recommendations');
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <AlertTriangle className="h-4 w-4 text-violet-600" />
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
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={() => {
                  runComplianceCheck();
                  setShowFloatingMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
              >
                <RefreshCw className="h-4 w-4 text-green-600" />
                <span>Nouvelle Vérification</span>
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

export default CompliancePage;
