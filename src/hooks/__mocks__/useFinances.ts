// Mock du hook useFinances pour Jest
export const useFinances = jest.fn(() => ({
  transactions: [
    {
      id: '1',
      type: 'INCOME' as const,
      amount: 5000,
      category: 'Cotisations',
      description: 'Cotisations annuelles',
      date: new Date('2024-01-15'),
      paymentMethod: 'Virement'
    },
    {
      id: '2', 
      type: 'EXPENSE' as const,
      amount: 1950,
      category: 'Frais généraux',
      description: 'Frais de bureau',
      date: new Date('2024-01-20'),
      paymentMethod: 'Carte bancaire'
    }
  ],
  totals: {
    income: 5000,
    expense: 1950,
    balance: 3050
  },
  isLoading: false,
  addTransaction: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn(),
  refreshTransactions: jest.fn()
}));
