import React, { useState } from 'react';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Filter,
  Download,
  Calendar,
  Euro,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import type { TransactionType } from '../types';
import { TransactionTypeEnum } from '../types';

const FinancesPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | TransactionTypeEnum>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Données de démonstration
  const transactions: TransactionType[] = [
    {
      id: '1',
      type: TransactionTypeEnum.INCOME,
      amount: 5000,
      description: 'Cotisations annuelles',
      date: new Date('2024-01-15'),
      category: 'Cotisations',
      associationId: 'assoc1',
      receipt: 'receipt_001.pdf'
    },
    {
      id: '2',
      type: TransactionTypeEnum.EXPENSE,
      amount: 1200,
      description: 'Location salle événement',
      date: new Date('2024-01-20'),
      category: 'Événements',
      associationId: 'assoc1'
    },
    {
      id: '3',
      type: TransactionTypeEnum.INCOME,
      amount: 800,
      description: 'Subvention municipale',
      date: new Date('2024-02-01'),
      category: 'Subventions',
      associationId: 'assoc1'
    },
    {
      id: '4',
      type: TransactionTypeEnum.EXPENSE,
      amount: 450,
      description: 'Matériel bureau',
      date: new Date('2024-02-10'),
      category: 'Fournitures',
      associationId: 'assoc1'
    },
    {
      id: '5',
      type: TransactionTypeEnum.EXPENSE,
      amount: 300,
      description: 'Assurance annuelle',
      date: new Date('2024-02-15'),
      category: 'Administration',
      associationId: 'assoc1'
    }
  ];

  const categories = ['Cotisations', 'Subventions', 'Événements', 'Fournitures', 'Administration'];

  // Calculs financiers
  const totalIncome = transactions
    .filter(t => t.type === TransactionTypeEnum.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === TransactionTypeEnum.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Filtrage des transactions
  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filterType === 'all' || transaction.type === filterType;
    const categoryMatch = filterCategory === 'all' || transaction.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  // Mobile-first : layout vertical, padding, boutons larges, responsive, accessibilité
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold font-montserrat text-purple-700 mb-2">Finances</h1>
        <p className="text-gray-600 font-poppins mb-4">Suivi des entrées/sorties et bilans financiers de l'association.</p>
        <div className="flex flex-col gap-4 mb-4">
          <button
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={() => setShowAddModal(true)}
            aria-label="Ajouter une transaction"
          >
            <Plus className="w-5 h-5" /> Ajouter une transaction
          </button>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <button
              className={`min-w-[100px] px-3 py-2 rounded-lg font-poppins text-xs font-medium snap-center focus:outline-none focus:ring-2 focus:ring-purple-500 ${filterType === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => setFilterType('all')}
            >Toutes</button>
            <button
              className={`min-w-[100px] px-3 py-2 rounded-lg font-poppins text-xs font-medium snap-center focus:outline-none focus:ring-2 focus:ring-purple-500 ${filterType === TransactionTypeEnum.INCOME ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => setFilterType(TransactionTypeEnum.INCOME)}
            >Entrées</button>
            <button
              className={`min-w-[100px] px-3 py-2 rounded-lg font-poppins text-xs font-medium snap-center focus:outline-none focus:ring-2 focus:ring-purple-500 ${filterType === TransactionTypeEnum.EXPENSE ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => setFilterType(TransactionTypeEnum.EXPENSE)}
            >Sorties</button>
          </div>
        </div>
        {/* Liste des transactions - layout vertical, cards mobiles */}
        <div className="flex flex-col gap-3">
          {transactions.filter(t => filterType === 'all' || t.type === filterType).map((tx) => (
            <div key={tx.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-900 font-montserrat">{tx.description}</span>
                <span className={`font-bold text-sm ${tx.type === TransactionTypeEnum.INCOME ? 'text-green-600' : 'text-red-500'}`}>{tx.type === TransactionTypeEnum.INCOME ? '+' : '-'}{tx.amount} €</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-poppins">
                <span>{tx.category}</span>
                <span>{tx.date.toLocaleDateString()}</span>
              </div>
              {tx.receipt && (
                <a href={tx.receipt} className="text-blue-500 underline text-xs" target="_blank" rel="noopener noreferrer">Reçu</a>
              )}
            </div>
          ))}
        </div>
        {/* Modal d'ajout mobile-first à ajouter ici si besoin */}
      </div>
    </div>
  );
};

export default FinancesPage;
