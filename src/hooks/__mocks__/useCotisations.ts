/**
 * Mock du hook useCotisations pour les tests
 */

export const useCotisations = jest.fn(() => ({
  cotisations: [
    {
      id: '1',
      memberId: 'member-1',
      memberName: 'Aminata Diallo',
      year: 2024,
      amount: 50,
      status: 'paid',
      paymentDate: new Date('2024-01-15T10:00:00Z'),
      paidAt: '2024-01-15T10:00:00Z',
      dueDate: '2024-12-31',
      createdAt: '2024-01-01T00:00:00Z',
      paymentMethod: 'CASH',
      notes: 'Cotisation 2024'
    },
    {
      id: '2',
      memberId: 'member-2', 
      memberName: 'Mamadou Ba',
      year: 2024,
      amount: 50,
      status: 'pending',
      paymentDate: new Date('2024-12-31T00:00:00Z'),
      dueDate: '2024-12-31',
      createdAt: '2024-01-01T00:00:00Z',
      paymentMethod: 'MOBILE_MONEY',
      notes: 'En attente'
    }
  ],
  stats: {
    total: 2,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0
  },
  isLoading: false,
  error: null,
  addCotisation: jest.fn(),
  updateCotisation: jest.fn(),
  deleteCotisation: jest.fn(),
  refreshCotisations: jest.fn()
}));
