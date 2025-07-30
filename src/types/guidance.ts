// Types pour le système de guidance organisationnelle

export interface OrganizationalMaturityLevel {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirements: string[];
  benefits: string[];
}

export interface ComplianceCheck {
  id: string;
  category: 'legal' | 'governance' | 'financial' | 'operational';
  title: string;
  description: string;
  required: boolean;
  status: 'compliant' | 'non_compliant' | 'pending' | 'not_applicable';
  lastChecked?: Date;
  nextDeadline?: Date;
  documents?: string[];
  actionItems?: string[];
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  actionSteps: string[];
  estimatedDuration: string;
  resources: string[];
  impact: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
}

export interface SmartInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  category: string;
  priority: number;
  actionable: boolean;
  actions?: string[];
  createdAt: Date;
  dismissed?: boolean;
}

export interface OrganizationalDiagnostic {
  id: string;
  associationId: string;
  performedAt: Date;
  currentMaturityLevel: number;
  targetMaturityLevel: number;
  overallScore: number;
  categories: {
    governance: number;
    operations: number;
    compliance: number;
    performance: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
  complianceChecks: ComplianceCheck[];
  nextAssessmentDate: Date;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: 'statuts' | 'reglement' | 'pv' | 'rapport' | 'budget' | 'demande_financement';
  description: string;
  required: boolean;
  template: string;
  variables: TemplateVariable[];
  organizationType: string[];
  maturityLevel: number;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'date' | 'number' | 'boolean' | 'list';
  description: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  options?: string[];
}

export interface GuidanceModule {
  id: string;
  title: string;
  description: string;
  category: 'structuration' | 'governance' | 'compliance' | 'performance';
  maturityLevel: number;
  duration: string;
  steps: GuidanceStep[];
  prerequisites: string[];
  outcomes: string[];
}

export interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  type: 'reading' | 'form' | 'template' | 'assessment' | 'action';
  content: string;
  resources: string[];
  estimatedTime: string;
  completed: boolean;
  notes?: string;
}

export interface BenchmarkData {
  category: string;
  metric: string;
  organizationValue: number;
  sectorAverage: number;
  topPerformers: number;
  trend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
}

export interface AIAssistantQuery {
  query: string;
  context: {
    associationId: string;
    currentPage: string;
    userRole: string;
    maturityLevel: number;
  };
}

export interface AIAssistantResponse {
  response: string;
  suggestions: string[];
  relatedResources: string[];
  followUpQuestions: string[];
  confidence: number;
}
