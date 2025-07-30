import { useState, useEffect } from 'react';
import type { OrganizationalDiagnostic, ComplianceCheck, Recommendation, SmartInsight } from '../types/guidance';
import { MATURITY_LEVELS, DEFAULT_COMPLIANCE_CHECKS } from '../constants/guidance';

export const useOrganizationalGuidance = () => {
  const [diagnostic, setDiagnostic] = useState<OrganizationalDiagnostic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Simuler un diagnostic initial
  useEffect(() => {
    const loadInitialDiagnostic = async () => {
      setIsLoading(true);
      
      // Simulation d'un diagnostic
      const mockDiagnostic: OrganizationalDiagnostic = {
        id: 'diag_001',
        associationId: 'assoc_001',
        performedAt: new Date(),
        currentMaturityLevel: 2,
        targetMaturityLevel: 4,
        overallScore: 65,
        categories: {
          governance: 70,
          operations: 60,
          compliance: 55,
          performance: 75
        },
        strengths: [
          "Équipe dirigeante motivée et compétente",
          "Bonnes relations avec les membres",
          "Activités régulières et appréciées"
        ],
        weaknesses: [
          "Documentation administrative incomplète",
          "Processus financiers à formaliser",
          "Communication interne à améliorer"
        ],
        recommendations: generateRecommendations(),
        complianceChecks: [...DEFAULT_COMPLIANCE_CHECKS],
        nextAssessmentDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 jours
      };

      setDiagnostic(mockDiagnostic);
      setRecommendations(mockDiagnostic.recommendations);
      generateSmartInsights();
      setIsLoading(false);
    };

    loadInitialDiagnostic();
  }, []);

  const generateRecommendations = (): Recommendation[] => {
    return [
      {
        id: 'rec_001',
        priority: 'high',
        category: 'Gouvernance',
        title: 'Finaliser le règlement intérieur',
        description: 'Votre association gagnerait à avoir un règlement intérieur complet pour clarifier les processus internes.',
        actionSteps: [
          'Organiser une réunion de travail avec le bureau',
          'Rédiger le projet de règlement en utilisant notre template',
          'Soumettre le projet en assemblée générale',
          'Voter et adopter le règlement définitif'
        ],
        estimatedDuration: '2-3 semaines',
        resources: [
          'Template de règlement intérieur',
          'Guide méthodologique',
          'Exemples sectoriels'
        ],
        impact: 'Amélioration significative de la gouvernance interne',
        status: 'pending'
      },
      {
        id: 'rec_002',
        priority: 'medium',
        category: 'Finances',
        title: 'Mettre en place un système de suivi budgétaire',
        description: 'Un suivi budgétaire régulier vous permettra de mieux maîtriser vos finances.',
        actionSteps: [
          'Définir les catégories de recettes et dépenses',
          'Mettre en place un tableau de suivi mensuel',
          'Former le trésorier aux outils de gestion',
          'Établir des points de contrôle trimestriels'
        ],
        estimatedDuration: '1 mois',
        resources: [
          'Template budget prévisionnel',
          'Outils de suivi financier',
          'Formation en ligne'
        ],
        impact: 'Meilleure maîtrise financière et transparence',
        status: 'pending'
      },
      {
        id: 'rec_003',
        priority: 'low',
        category: 'Communication',
        title: 'Améliorer la communication avec les membres',
        description: 'Une communication régulière renforce l\'engagement des membres.',
        actionSteps: [
          'Créer une newsletter mensuelle',
          'Mettre en place un groupe de discussion',
          'Organiser des réunions d\'information trimestrielles',
          'Développer une stratégie de communication digitale'
        ],
        estimatedDuration: '6 semaines',
        resources: [
          'Templates de newsletter',
          'Guide communication associative',
          'Outils de communication digitale'
        ],
        impact: 'Engagement des membres renforcé',
        status: 'pending'
      }
    ];
  };

  const generateSmartInsights = () => {
    const newInsights: SmartInsight[] = [
      {
        id: 'insight_001',
        type: 'opportunity',
        title: 'Éligibilité aux subventions régionales',
        description: 'Votre niveau de maturité vous rend éligible aux subventions de développement associatif de la région.',
        category: 'Financement',
        priority: 8,
        actionable: true,
        actions: [
          'Consulter le calendrier des appels à projets',
          'Préparer un dossier de demande',
          'Contacter le référent associatif régional'
        ],
        createdAt: new Date(),
        dismissed: false
      },
      {
        id: 'insight_002',
        type: 'warning',
        title: 'Échéance assemblée générale approche',
        description: 'Votre assemblée générale annuelle doit être tenue avant le 31 mars.',
        category: 'Gouvernance',
        priority: 9,
        actionable: true,
        actions: [
          'Fixer la date de l\'AG',
          'Préparer les rapports (moral et financier)',
          'Convoquer les membres dans les délais'
        ],
        createdAt: new Date(),
        dismissed: false
      },
      {
        id: 'insight_003',
        type: 'suggestion',
        title: 'Formation dirigeants disponible',
        description: 'Une formation "Gestion associative moderne" est proposée gratuitement par le département.',
        category: 'Formation',
        priority: 6,
        actionable: true,
        actions: [
          'S\'inscrire à la formation',
          'Identifier les participants prioritaires',
          'Planifier l\'application des acquis'
        ],
        createdAt: new Date(),
        dismissed: false
      }
    ];

    setInsights(newInsights);
  };

  const updateComplianceCheck = (checkId: string, status: ComplianceCheck['status']) => {
    if (!diagnostic) return;

    const updatedChecks = diagnostic.complianceChecks.map(check =>
      check.id === checkId 
        ? { ...check, status, lastChecked: new Date() }
        : check
    );

    setDiagnostic({
      ...diagnostic,
      complianceChecks: updatedChecks
    });
  };

  const markRecommendationComplete = (recommendationId: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === recommendationId
          ? { ...rec, status: 'completed' }
          : rec
      )
    );
  };

  const dismissInsight = (insightId: string) => {
    setInsights(prev =>
      prev.map(insight =>
        insight.id === insightId
          ? { ...insight, dismissed: true }
          : insight
      )
    );
  };

  const getCurrentMaturityLevel = () => {
    if (!diagnostic) return MATURITY_LEVELS[0];
    return MATURITY_LEVELS.find(level => level.id === diagnostic.currentMaturityLevel) || MATURITY_LEVELS[0];
  };

  const getNextMaturityLevel = () => {
    if (!diagnostic) return MATURITY_LEVELS[1];
    return MATURITY_LEVELS.find(level => level.id === diagnostic.currentMaturityLevel + 1) || MATURITY_LEVELS[MATURITY_LEVELS.length - 1];
  };

  const getComplianceScore = () => {
    if (!diagnostic) return 0;
    
    const totalChecks = diagnostic.complianceChecks.length;
    const compliantChecks = diagnostic.complianceChecks.filter(check => check.status === 'compliant').length;
    
    return totalChecks > 0 ? Math.round((compliantChecks / totalChecks) * 100) : 0;
  };

  const getActiveInsights = () => {
    return insights.filter(insight => !insight.dismissed);
  };

  const getPendingRecommendations = () => {
    return recommendations.filter(rec => rec.status === 'pending');
  };

  return {
    // State
    diagnostic,
    insights: getActiveInsights(),
    recommendations: getPendingRecommendations(),
    isLoading,
    
    // Computed values
    currentMaturityLevel: getCurrentMaturityLevel(),
    nextMaturityLevel: getNextMaturityLevel(),
    complianceScore: getComplianceScore(),
    
    // Actions
    updateComplianceCheck,
    markRecommendationComplete,
    dismissInsight,
    
    // Utils
    maturityLevels: MATURITY_LEVELS
  };
};
