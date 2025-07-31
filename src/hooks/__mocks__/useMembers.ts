/**
 * Mock du hook useMembers pour les tests
 */

export const useMembers = jest.fn(() => ({
  members: [
    {
      id: 'member-1',
      firstName: 'Aminata',
      lastName: 'Diallo',
      name: 'Aminata Diallo',
      email: 'aminata.diallo@email.com',
      phone: '+33123456789',
      role: 'Présidente',
      status: 'active',
      joinDate: '2023-01-15',
      address: '123 Rue de la Paix, 75001 Paris',
      createdAt: '2023-01-15T10:00:00Z'
    },
    {
      id: 'member-2',
      firstName: 'Mamadou',
      lastName: 'Ba',
      name: 'Mamadou Ba',
      email: 'mamadou.ba@email.com', 
      phone: '+33987654321',
      role: 'Trésorier',
      status: 'active',
      joinDate: '2023-02-20',
      address: '456 Avenue des Champs, 75008 Paris',
      createdAt: '2023-02-20T14:30:00Z'
    }
  ],
  isLoading: false,
  error: null,
  addMember: jest.fn(),
  updateMember: jest.fn(),
  deleteMember: jest.fn(),
  refreshMembers: jest.fn()
}));
