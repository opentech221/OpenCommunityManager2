/**
 * Service API pour la gestion des finances
 * Interface entre le frontend et le backend pour les transactions financières
 */
import type { Transaction, TransactionType } from '../types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

interface FinanceStats {
  total_income: number;
  total_expenses: number;
  balance: number;
  transactions_count: number;
  categories_stats: Record<string, { income: number; expenses: number; count: number }>;
  recent_transactions: Transaction[];
}

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

class FinanceAPI {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private normalizeTransaction(apiData: APITransactionData): Transaction {
    return {
      id: apiData.id.toString(),
      type: apiData.type,
      amount: Number(apiData.amount),
      description: apiData.description,
      date: new Date(apiData.date),
      category: apiData.category,
      associationId: apiData.association_id.toString(),
      receipt: apiData.receipt || '',
      notes: apiData.notes || ''
    };
  }

  async getAllTransactions(filters?: {
    type?: string;
    category?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Transaction[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.start_date) queryParams.append('start_date', filters.start_date);
      if (filters?.end_date) queryParams.append('end_date', filters.end_date);

      const url = `${API_BASE_URL}/finances${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data: APITransactionData[] = await response.json();
      return data.map(transaction => this.normalizeTransaction(transaction));
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw error;
    }
  }

  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
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

      const response = await fetch(`${API_BASE_URL}/finances`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la transaction');
      }

      const data: APITransactionData = await response.json();
      return this.normalizeTransaction(data);
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
      throw error;
    }
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
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

      const response = await fetch(`${API_BASE_URL}/finances/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de la transaction');
      }

      const data: APITransactionData = await response.json();
      return this.normalizeTransaction(data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/finances/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de la transaction');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la transaction:', error);
      throw error;
    }
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/finances/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data: APITransactionData = await response.json();
      return this.normalizeTransaction(data);
    } catch (error) {
      console.error('Erreur lors de la récupération de la transaction:', error);
      throw error;
    }
  }

  async getStats(filters?: { year?: string; month?: string }): Promise<FinanceStats> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.year) queryParams.append('year', filters.year);
      if (filters?.month) queryParams.append('month', filters.month);

      const url = `${API_BASE_URL}/finances/stats${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        ...data,
        recent_transactions: data.recent_transactions.map((tx: APITransactionData) => this.normalizeTransaction(tx))
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/finances/categories`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return [];
    }
  }
}

// Instance singleton de l'API
export const financeAPI = new FinanceAPI();
export type { FinanceStats };
