/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
// @ts-ignore
import { apiUrl } from '../utils/apiUrl.node';
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
      // Simulation d'appel API - à remplacer par votre vraie API
      const response = await fetch(apiUrl('/api/members'));
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
      // Données fictives en cas d'erreur
      setMembers(getMockMembers());
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (memberData: Omit<MemberType, 'id'>) => {
    try {
      const response = await fetch(apiUrl('/api/members'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        const newMember = await response.json();
        setMembers(prev => [...prev, newMember]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
      // Simulation pour développement
      const newMember: MemberType = {
        ...memberData,
        id: Date.now().toString(),
      };
      setMembers(prev => [...prev, newMember]);
    }
  };

  const updateMember = async (id: string, updates: Partial<MemberType>) => {
    try {
      const response = await fetch(apiUrl(`/api/members/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
      const response = await fetch(apiUrl(`/api/members/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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

// Données fictives pour le développement
const getMockMembers = (): MemberType[] => [
  {
    id: '1',
    firstName: 'Mamadou',
    lastName: 'Diallo',
    email: 'mamadou.diallo@email.com',
    phone: '+224 123 456 789',
    role: 'PRESIDENT' as unknown,
    status: 'ACTIVE' as any,
    joinDate: new Date('2023-01-15'),
    associationId: '1'
  },
  {
    id: '2',
    firstName: 'Fatou',
    lastName: 'Camara',
    email: 'fatou.camara@email.com',
    phone: '+224 987 654 321',
    role: 'SECRETARY' as any,
    status: 'ACTIVE' as any,
    joinDate: new Date('2023-02-20'),
    associationId: '1'
  },
  {
    id: '3',
    firstName: 'Ibrahima',
    lastName: 'Bah',
    email: 'ibrahima.bah@email.com',
    phone: '+224 555 123 456',
    role: 'TREASURER' as any,
    status: 'ACTIVE' as any,
    joinDate: new Date('2023-03-10'),
    associationId: '1'
  }
];
