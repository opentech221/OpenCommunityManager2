import { useState, useEffect } from 'react';
import { apiUrl } from '../utils';
import type { CotisationType, PaymentStatus, PaymentMethod } from '../types';

interface CotisationFilters {
  year?: number;
  status?: PaymentStatus;
  memberId?: string;
}

interface CotisationStats {
  year: number;
  stats: Array<{
    status: PaymentStatus;
    count: number;
    total: number;
  }>;
}

interface UseCotisationsReturn {
  cotisations: CotisationType[];
  isLoading: boolean;
  addCotisation: (cotisation: Omit<CotisationType, 'id'>) => Promise<void>;
  updateCotisation: (id: string, updates: Partial<CotisationType>) => Promise<void>;
  deleteCotisation: (id: string) => Promise<void>;
  getCotisationById: (id: string) => CotisationType | undefined;
  filterCotisations: (filters: CotisationFilters) => CotisationType[];
  getStats: (year?: number) => Promise<CotisationStats>;
  refreshCotisations: () => Promise<void>;
}

// Utilitaire pour convertir les données reçues de l'API (snake_case vers camelCase et dates en objets Date)
function normalizeCotisationFromAPI(cotisationData: Record<string, unknown>): CotisationType {
  return {
    id: String(cotisationData.id),
    memberId: String(cotisationData.member_id),
    amount: Number(cotisationData.amount),
    paymentDate: new Date(String(cotisationData.payment_date)),
    paymentMethod: String(cotisationData.payment_method) as PaymentMethod,
    status: String(cotisationData.status) as PaymentStatus,
    year: Number(cotisationData.year),
    notes: cotisationData.notes ? String(cotisationData.notes) : undefined,
  };
}

// Utilitaire pour convertir les données vers l'API (camelCase vers snake_case)
function convertCotisationForAPI(cotisation: Partial<CotisationType>): Record<string, unknown> {
  const apiData: Record<string, unknown> = {};
  
  if (cotisation.memberId !== undefined) apiData.member_id = cotisation.memberId;
  if (cotisation.amount !== undefined) apiData.amount = cotisation.amount;
  if (cotisation.paymentDate !== undefined) {
    apiData.payment_date = cotisation.paymentDate instanceof Date 
      ? cotisation.paymentDate.toISOString() 
      : new Date(cotisation.paymentDate).toISOString();
  }
  if (cotisation.paymentMethod !== undefined) apiData.payment_method = cotisation.paymentMethod;
  if (cotisation.status !== undefined) apiData.status = cotisation.status;
  if (cotisation.year !== undefined) apiData.year = cotisation.year;
  if (cotisation.notes !== undefined) apiData.notes = cotisation.notes;
  
  return apiData;
}

export const useCotisations = (): UseCotisationsReturn => {
  const [cotisations, setCotisations] = useState<CotisationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCotisations();
  }, []);

  const fetchCotisations = async () => {
    setIsLoading(true);
    console.log('🔍 [useCotisations] Début du chargement des cotisations...');
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🔑 [useCotisations] Token trouvé:', token ? 'Oui' : 'Non');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const url = apiUrl('/api/cotisations/');
      console.log('🌐 [useCotisations] URL de l\'API:', url);
      
      const response = await fetch(url, {
        headers,
      });
      
      console.log('📡 [useCotisations] Status de la réponse:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 [useCotisations] Données reçues:', data.length, 'cotisations');
        console.log('📦 [useCotisations] Première cotisation brute:', data[0]);
        console.log('📦 [useCotisations] IDs des cotisations reçues:', data.map((c: Record<string, unknown>) => c.id));
        
        // Normaliser les données reçues
        const normalizedCotisations = data.map((cotisation: Record<string, unknown>) => {
          const normalized = normalizeCotisationFromAPI(cotisation);
          console.log('🔄 [useCotisations] Cotisation normalisée:', normalized);
          return normalized;
        });
        
        console.log('✅ [useCotisations] Données normalisées:', normalizedCotisations.length, 'cotisations');
        console.log('✅ [useCotisations] IDs normalisés:', normalizedCotisations.map(c => c.id));
        setCotisations(normalizedCotisations);
      } else {
        console.error('❌ [useCotisations] Erreur lors du chargement des cotisations:', response.status);
        const errorText = await response.text();
        console.error('❌ [useCotisations] Détails de l\'erreur:', errorText);
      }
    } catch (error) {
      console.error('❌ [useCotisations] Erreur lors du chargement des cotisations:', error);
    } finally {
      setIsLoading(false);
      console.log('🏁 [useCotisations] Fin du chargement des cotisations');
    }
  };

  const refreshCotisations = async () => {
    await fetchCotisations();
  };

  const addCotisation = async (cotisationData: Omit<CotisationType, 'id'>) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Convertir les données pour l'API
      const cotisationForAPI = convertCotisationForAPI(cotisationData);
      
      const response = await fetch(apiUrl('/api/cotisations/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(cotisationForAPI),
      });

      if (response.ok) {
        const newCotisation = await response.json();
        // Normaliser les données reçues et les ajouter aux cotisations
        const normalizedCotisation = normalizeCotisationFromAPI(newCotisation);
        setCotisations(prev => [...prev, normalizedCotisation]);
      } else {
        let errorMsg = 'Erreur lors de l\'ajout de la cotisation.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
          console.error('Erreur API:', errorData);
        } catch {
          const errorText = await response.text();
          if (errorText) errorMsg = errorText;
          console.error('Erreur texte:', errorText);
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la cotisation:', error);
      throw error;
    }
  };

  const updateCotisation = async (id: string, updates: Partial<CotisationType>) => {
    try {
      console.log('Updating cotisation with ID:', id, 'Updates:', updates);
      
      const token = localStorage.getItem('auth_token');
      
      // Convertir les données pour l'API
      const updatesForAPI = convertCotisationForAPI(updates);
      
      console.log('Data for API:', updatesForAPI);
      
      const response = await fetch(apiUrl(`/api/cotisations/${id}/`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatesForAPI),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const updatedCotisation = await response.json();
        console.log('Updated cotisation from API:', updatedCotisation);
        
        // Normaliser les données reçues
        const normalizedCotisation = normalizeCotisationFromAPI(updatedCotisation);
        
        setCotisations(prev =>
          prev.map(cotisation =>
            cotisation.id === id ? normalizedCotisation : cotisation
          )
        );
      } else {
        let errorMsg = 'Erreur lors de la mise à jour de la cotisation.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
          console.error('Erreur API:', errorData);
        } catch {
          const errorText = await response.text();
          if (errorText) errorMsg = errorText;
          console.error('Erreur texte:', errorText);
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la cotisation:', error);
      throw error;
    }
  };

  const deleteCotisation = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(apiUrl(`/api/cotisations/${id}/`), {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        setCotisations(prev => prev.filter(cotisation => cotisation.id !== id));
      } else {
        let errorMsg = 'Erreur lors de la suppression de la cotisation.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
          console.error('Erreur API suppression:', errorData);
        } catch {
          const errorText = await response.text();
          if (errorText) errorMsg = errorText;
          console.error('Erreur texte suppression:', errorText);
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la cotisation:', error);
      throw error;
    }
  };

  const getCotisationById = (id: string): CotisationType | undefined => {
    return cotisations.find(cotisation => cotisation.id === id);
  };

  const filterCotisations = (filters: CotisationFilters): CotisationType[] => {
    let filtered = cotisations;

    if (filters.year) {
      filtered = filtered.filter(c => c.year === filters.year);
    }

    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters.memberId) {
      filtered = filtered.filter(c => c.memberId === filters.memberId);
    }

    return filtered;
  };

  const getStats = async (year?: number): Promise<CotisationStats> => {
    try {
      const token = localStorage.getItem('auth_token');
      const yearParam = year || new Date().getFullYear();
      
      const response = await fetch(apiUrl(`/api/cotisations/stats?year=${yearParam}`), {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        const stats = await response.json();
        return stats;
      } else {
        throw new Error('Erreur lors de la récupération des statistiques');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  };

  return {
    cotisations,
    isLoading,
    addCotisation,
    updateCotisation,
    deleteCotisation,
    getCotisationById,
    filterCotisations,
    getStats,
    refreshCotisations,
  };
};
