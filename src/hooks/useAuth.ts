/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, createContext, useContext } from 'react';
import { apiUrl } from '../utils';
import type { AssociationType } from '../types';

interface AuthContextType {
  association: AssociationType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

interface RegisterData {
  name: string;
  sigle?: string;
  email: string;
  phone: string;
  password: string;
  logo?: File;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook personnalisé pour la gestion d'authentification
export const useAuthState = () => {
  const [association, setAssociation] = useState<AssociationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const token = localStorage.getItem('auth_token');
    const savedAssociation = localStorage.getItem('association_data');
    
    if (token && savedAssociation) {
      try {
        setAssociation(JSON.parse(savedAssociation));
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('association_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Appel API d'authentification
      const response = await fetch(apiUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Erreur de connexion');
      }

      const data = await response.json();
      
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('association_data', JSON.stringify(data.association));
      setAssociation(data.association);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Préparer les données en JSON (sans le logo pour le moment)
      const requestData = {
        name: data.name,
        sigle: data.sigle,
        email: data.email,
        phone: data.phone,
        password: data.password
      };

      const response = await fetch(apiUrl('/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      let result;
      if (!response.ok) {
        // Tente de parser en JSON, sinon récupère le texte brut
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de l\'inscription');
        } catch (e) {
          const errorText = await response.text();
          throw new Error(errorText || 'Erreur lors de l\'inscription');
        }
      }
      try {
        result = await response.json();
      } catch (e) {
        // Si la réponse n'est pas du JSON, affiche le texte brut
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors de l\'inscription');
      }
      
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('association_data', JSON.stringify(result.association));
      setAssociation(result.association);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('association_data');
    setAssociation(null);
  };

  return {
    association,
    isAuthenticated: !!association,
    isLoading,
    login,
    logout,
    register,
  };
};

export { AuthContext };
export type { AuthContextType, RegisterData };
