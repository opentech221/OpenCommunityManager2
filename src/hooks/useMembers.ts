// ...existing code...
import { useState, useEffect } from 'react';
import { apiUrl } from '../utils';
import type { MemberType } from '../types';

interface UseMembersReturn {
  members: MemberType[];
  isLoading: boolean;
  addMember: (member: Omit<MemberType, 'id'>) => Promise<void>;
  updateMember: (id: string, updates: Partial<MemberType>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMemberById: (id: string) => MemberType | undefined;
  searchMembers: (query: string) => MemberType[];
  filterMembers: (filters: MemberFilters) => MemberType[];
}

interface MemberFilters {
  role?: string;
  status?: string;
  search?: string;
}

export const useMembers = (): UseMembersReturn => {
  const [members, setMembers] = useState<MemberType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(apiUrl('/api/members'), {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (memberData: Omit<MemberType, 'id'>) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(apiUrl('/api/members'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        const newMember = await response.json();
        setMembers(prev => [...prev, newMember]);
      } else {
        let errorMsg = 'Erreur lors de l\'ajout du membre.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          const errorText = await response.text();
          if (errorText) errorMsg = errorText;
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
      alert(error instanceof Error ? error.message : String(error));
    }
  };

  const updateMember = async (id: string, updates: Partial<MemberType>) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(apiUrl(`/api/members/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setMembers(prev =>
          prev.map(member =>
            member.id === id ? { ...member, ...updates } : member
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du membre:', error);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(apiUrl(`/api/members/${id}`), {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        setMembers(prev => prev.filter(member => member.id !== id));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error);
    }
  };

  const getMemberById = (id: string): MemberType | undefined => {
    return members.find(member => member.id === id);
  };

  const searchMembers = (query: string): MemberType[] => {
    if (!query.trim()) return members;
    
    const lowercaseQuery = query.toLowerCase();
    return members.filter(member =>
      member.firstName.toLowerCase().includes(lowercaseQuery) ||
      member.lastName.toLowerCase().includes(lowercaseQuery) ||
      member.email.toLowerCase().includes(lowercaseQuery) ||
      member.phone.includes(query)
    );
  };

  const filterMembers = (filters: MemberFilters): MemberType[] => {
    let filteredMembers = members;

    if (filters.search) {
      filteredMembers = searchMembers(filters.search);
    }

    if (filters.role && filters.role !== 'all') {
      filteredMembers = filteredMembers.filter(member => member.role === filters.role);
    }

    if (filters.status && filters.status !== 'all') {
      filteredMembers = filteredMembers.filter(member => member.status === filters.status);
    }

    return filteredMembers;
  };

  return {
    members,
    isLoading,
    addMember,
    updateMember,
    deleteMember,
    getMemberById,
    searchMembers,
    filterMembers,
  };
};

