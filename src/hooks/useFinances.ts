import { useState, useEffect } from 'react';
import type { Transaction, TransactionType } from '../types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Debug de la configuration
console.log('🔧 [useFinances] Configuration API:', {
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  API_BASE_URL,
  mode: import.meta.env.MODE
});

interface FinanceStats {
  total_income: number;
  total_expenses: number;
  balance: number;
  transactions_count: number;
  categories_stats: Record<string, { income: number; expenses: number; count: number }>;
  recent_transactions: Transaction[];
}

export const useFinances = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction utilitaire pour obtenir l'en-tête d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Interface pour les données API
  interface APITransactionData {
    id: number;
    type: TransactionType;
    amount: number;
    description: string;
    date: string;
    category: string;
    association_id: number;
    receipt?: string;
    notes?: string;
  }

  // Fonction pour normaliser les données de transaction depuis l'API
  const normalizeTransactionFromAPI = (apiData: APITransactionData): Transaction => {
    return {
      id: apiData.id.toString(),
      type: apiData.type as TransactionType,
      amount: Number(apiData.amount),
      description: apiData.description,
      date: new Date(apiData.date),
      category: apiData.category,
      associationId: apiData.association_id.toString(),
      receipt: apiData.receipt || '',
      notes: apiData.notes || ''
    };
  };

  // Charger toutes les transactions
  const fetchTransactions = async (filters?: {
    type?: string;
    category?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.start_date) queryParams.append('start_date', filters.start_date);
      if (filters?.end_date) queryParams.append('end_date', filters.end_date);

      const url = `${API_BASE_URL}/finances${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      console.log('🚀 [useFinances] Requête GET vers:', url);
      console.log('📋 [useFinances] Headers:', getAuthHeaders());
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📦 [useFinances] Données reçues:', data.length, 'transactions');
        
        const normalizedTransactions = data.map((transaction: APITransactionData) => {
          const normalized = normalizeTransactionFromAPI(transaction);
          console.log('🔄 [useFinances] Transaction normalisée:', normalized);
          return normalized;
        });
        
        setTransactions(normalizedTransactions);
      } else {
        console.error('❌ [useFinances] Erreur lors du chargement des transactions:', response.status);
        throw new Error(`Erreur HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('❌ [useFinances] Erreur lors du chargement des transactions:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter une nouvelle transaction
  const addTransaction = async (transactionData: Partial<Transaction>) => {
    try {
      const payload = {
        description: transactionData.description,
        amount: transactionData.amount,
        type: transactionData.type,
        category: transactionData.category,
        date: transactionData.date?.toISOString(),
        receipt: transactionData.receipt || null,
        notes: transactionData.notes || null
      };

      console.log('🔄 [useFinances] Envoi des données:', payload);

      const postUrl = `${API_BASE_URL}/finances`;
      console.log('🚀 [useFinances] Requête POST vers:', postUrl);

      const response = await fetch(postUrl, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newTransaction = await response.json();
        console.log('✅ [useFinances] Transaction créée:', newTransaction);
        
        const normalized = normalizeTransactionFromAPI(newTransaction);
        setTransactions(prev => [normalized, ...prev]);
        return normalized;
      } else {
        const errorData = await response.json();
        console.error('❌ [useFinances] Erreur lors de la création:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la création de la transaction');
      }
    } catch (error) {
      console.error('❌ [useFinances] Erreur lors de l\'ajout de la transaction:', error);
      throw error;
    }
  };

  // Mettre à jour une transaction
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const payload = {
        ...(updates.description && { description: updates.description }),
        ...(updates.amount && { amount: updates.amount }),
        ...(updates.type && { type: updates.type }),
        ...(updates.category && { category: updates.category }),
        ...(updates.date && { date: updates.date.toISOString() }),
        ...(updates.receipt !== undefined && { receipt: updates.receipt }),
        ...(updates.notes !== undefined && { notes: updates.notes })
      };

      console.log('🔄 [useFinances] Mise à jour transaction:', id, payload);

      const response = await fetch(`${API_BASE_URL}/finances/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedTransaction = await response.json();
        console.log('✅ [useFinances] Transaction mise à jour:', updatedTransaction);
        
        const normalized = normalizeTransactionFromAPI(updatedTransaction);
        setTransactions(prev => 
          prev.map(t => t.id === id ? normalized : t)
        );
        return normalized;
      } else {
        const errorData = await response.json();
        console.error('❌ [useFinances] Erreur lors de la mise à jour:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de la transaction');
      }
    } catch (error) {
      console.error('❌ [useFinances] Erreur lors de la mise à jour de la transaction:', error);
      throw error;
    }
  };

  // Supprimer une transaction
  const deleteTransaction = async (id: string) => {
    try {
      console.log('🗑️ [useFinances] Suppression transaction:', id);

      const response = await fetch(`${API_BASE_URL}/finances/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        console.log('✅ [useFinances] Transaction supprimée:', id);
        setTransactions(prev => prev.filter(t => t.id !== id));
      } else {
        const errorData = await response.json();
        console.error('❌ [useFinances] Erreur lors de la suppression:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la suppression de la transaction');
      }
    } catch (error) {
      console.error('❌ [useFinances] Erreur lors de la suppression de la transaction:', error);
      throw error;
    }
  };

  // Récupérer une transaction par ID
  const getTransactionById = async (id: string): Promise<Transaction | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/finances/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        return normalizeTransactionFromAPI(data);
      } else {
        console.error('❌ [useFinances] Transaction non trouvée:', id);
        return null;
      }
    } catch (error) {
      console.error('❌ [useFinances] Erreur lors de la récupération de la transaction:', error);
      return null;
    }
  };

  // Filtrer les transactions localement
  const filterTransactions = (filters: {
    type?: TransactionType | 'all';
    category?: string;
    searchTerm?: string;
  }) => {
    return transactions.filter(transaction => {
      if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }
      
      if (filters.category && filters.category !== 'all' && transaction.category !== filters.category) {
        return false;
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!transaction.description.toLowerCase().includes(searchLower) &&
            !transaction.category.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Récupérer les statistiques financières
  const getStats = async (filters?: { year?: string; month?: string }): Promise<FinanceStats> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.year) queryParams.append('year', filters.year);
      if (filters?.month) queryParams.append('month', filters.month);

      const url = `${API_BASE_URL}/finances/stats${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 [useFinances] Statistiques reçues:', data);
        return {
          ...data,
          recent_transactions: data.recent_transactions.map(normalizeTransactionFromAPI)
        };
      } else {
        console.error('❌ [useFinances] Erreur lors de la récupération des statistiques:', response.status);
        throw new Error(`Erreur HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('❌ [useFinances] Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  };

  // Récupérer les catégories disponibles
  const getCategories = async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/finances/categories`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        return data.categories || [];
      } else {
        console.error('❌ [useFinances] Erreur lors de la récupération des catégories:', response.status);
        return [];
      }
    } catch (error) {
      console.error('❌ [useFinances] Erreur lors de la récupération des catégories:', error);
      return [];
    }
  };

  // Recharger les transactions
  const refreshTransactions = () => {
    fetchTransactions();
  };

  // Charger les transactions au montage du composant
  useEffect(() => {
    fetchTransactions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    filterTransactions,
    getStats,
    getCategories,
    refreshTransactions,
    fetchTransactions
  };
};
