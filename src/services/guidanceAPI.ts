/**
 * Service API pour le système de guidance organisationnelle
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/guidance';

// Configuration axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT si disponible
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types pour les réponses API
export interface DiagnosticAPI {
  id: string;
  association_id: string;
  performed_at: string;
  current_maturity_level: number;
  target_maturity_level: number;
  overall_score: number;
  category_scores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  next_assessment_date: string;
}

export interface RecommendationAPI {
  id: string;
  association_id: string;
  diagnostic_id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  deadline?: string;
  progress: number;
  assigned_to?: string;
}

export interface ComplianceCheckAPI {
  id: string;
  association_id: string;
  diagnostic_id: string;
  category: string;
  title: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'warning' | 'unknown';
  priority: 'high' | 'medium' | 'low';
  next_check_date?: string;
  auto_fix_available: boolean;
}

export interface SmartInsightAPI {
  id: string;
  association_id: string;
  diagnostic_id: string;
  type: 'warning' | 'opportunity' | 'suggestion' | 'achievement';
  title: string;
  content: string;
  data_points?: Record<string, any>;
  confidence_score: number;
  is_active: boolean;
  expires_at?: string;
}

export interface DocumentTemplateAPI {
  id: string;
  name: string;
  category: string;
  description?: string;
  template_content: string;
  template_variables: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
    defaultValue?: string;
  }>;
  organization_types: string[];
  maturity_level: number;
  required: boolean;
}

export interface AIQueryAPI {
  id: string;
  association_id: string;
  diagnostic_id?: string;
  query: string;
  context?: Record<string, any>;
  response: string;
  suggestions: string[];
  related_resources: string[];
  follow_up_questions: string[];
  confidence?: number;
}

// Services API
export const guidanceAPI = {
  // Diagnostics
  getDiagnostics: () => api.get<{ diagnostics: DiagnosticAPI[] }>('/diagnostics'),
  getDiagnostic: (id: string) => api.get<DiagnosticAPI>(`/diagnostics/${id}`),
  createDiagnostic: (data: Partial<DiagnosticAPI>) => api.post<DiagnosticAPI>('/diagnostics', data),
  updateDiagnostic: (id: string, data: Partial<DiagnosticAPI>) => api.put<DiagnosticAPI>(`/diagnostics/${id}`, data),
  deleteDiagnostic: (id: string) => api.delete(`/diagnostics/${id}`),

  // Recommandations
  getRecommendations: (params?: { priority?: string; status?: string }) => 
    api.get<{ recommendations: RecommendationAPI[] }>('/recommendations', { params }),
  createRecommendation: (data: Partial<RecommendationAPI>) => api.post<RecommendationAPI>('/recommendations', data),
  updateRecommendationProgress: (id: string, progress: number) => 
    api.put(`/recommendations/${id}/progress`, { progress }),
  getRecommendationsByPriority: (priority: string) => 
    api.get<{ recommendations: RecommendationAPI[] }>(`/recommendations/priority/${priority}`),

  // Conformité
  getComplianceChecks: (params?: { status?: string; category?: string }) => 
    api.get<{ checks: ComplianceCheckAPI[] }>('/compliance', { params }),
  triggerComplianceCheck: (category?: string) => 
    api.post('/compliance/check', { category }),
  autoFixCompliance: (id: string) => 
    api.put(`/compliance/${id}/fix`),

  // Insights
  getInsights: () => api.get<{ insights: SmartInsightAPI[] }>('/insights'),
  getActiveInsights: () => api.get<{ insights: SmartInsightAPI[] }>('/insights/active'),

  // Templates
  getTemplates: (params?: { category?: string }) => 
    api.get<{ templates: DocumentTemplateAPI[] }>('/templates', { params }),
  getTemplatesByCategory: (category: string) => 
    api.get<{ templates: DocumentTemplateAPI[] }>(`/templates/category/${category}`),
  generateDocument: (templateId: string, variables: Record<string, any>) => 
    api.post<{ document: string }>(`/templates/${templateId}/generate`, { variables }),

  // IA
  queryAI: (query: string, context?: Record<string, any>) => 
    api.post<AIQueryAPI>('/ai/query', { query, context }),
  getAIHistory: () => api.get<{ queries: AIQueryAPI[] }>('/ai/history'),

  // Analytics
  getAnalyticsOverview: () => api.get<{
    total_diagnostics: number;
    avg_maturity_score: number;
    top_recommendations: RecommendationAPI[];
    compliance_summary: Record<string, number>;
    recent_insights: SmartInsightAPI[];
  }>('/analytics/overview'),
  
  getMaturityProgression: () => api.get<{
    progression: Array<{
      date: string;
      maturity_level: number;
      overall_score: number;
    }>;
  }>('/analytics/maturity-progression')
};

export default guidanceAPI;
