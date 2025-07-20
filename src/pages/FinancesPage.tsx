
import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, Filter } from 'lucide-react';
import type { TransactionType } from '../types';
import { TransactionTypeEnum } from '../types';

const transactionsData: TransactionType[] = [
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

const FinancesPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | TransactionTypeEnum>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [localTransactions, setLocalTransactions] = useState<TransactionType[]>(transactionsData);

  const handleAddTransaction = (transaction: TransactionType) => {
    setLocalTransactions(prev => [...prev, transaction]);
    setFeedbackMessage('Transaction ajoutée avec succès');
    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  const handleDeleteTransaction = (id: string) => {
    setLocalTransactions(prev => prev.filter(t => t.id !== id));
    setFeedbackMessage('Transaction supprimée avec succès');
    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  const totalIncome = localTransactions.filter(t => t.type === TransactionTypeEnum.INCOME).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = localTransactions.filter(t => t.type === TransactionTypeEnum.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;


  // États locaux pour le formulaire d'ajout
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newType, setNewType] = useState<TransactionTypeEnum | ''>('');
  const [newCategory, setNewCategory] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
      {feedbackMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50" data-testid="finances-feedback">
          {feedbackMessage}
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-montserrat font-bold text-violet-700 mb-6" data-testid="finances-title">Gestion des finances</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center">
            <Wallet className="text-violet-700 mb-2" size={32} />
            <span className="font-bold text-lg text-gray-900 font-montserrat">Solde</span>
            <span className="font-bold text-2xl text-violet-700" data-testid="finances-balance">{balance} €</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center">
            <TrendingUp className="text-green-600 mb-2" size={32} />
            <span className="font-bold text-lg text-gray-900 font-montserrat">Entrées</span>
            <span className="font-bold text-2xl text-green-600" data-testid="finances-income">{totalIncome} €</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center">
            <TrendingDown className="text-red-500 mb-2" size={32} />
            <span className="font-bold text-lg text-gray-900 font-montserrat">Sorties</span>
            <span className="font-bold text-2xl text-red-500" data-testid="finances-expenses">{totalExpenses} €</span>
          </div>
        </div>
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 items-center">
            <Filter className="text-gray-500" size={20} />
            <select value={filterType} onChange={e => setFilterType(e.target.value as 'all' | TransactionTypeEnum)} className="border rounded px-2 py-1 text-sm">
              <option value="all">Tous</option>
              <option value={TransactionTypeEnum.INCOME}>Entrées</option>
              <option value={TransactionTypeEnum.EXPENSE}>Sorties</option>
            </select>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border rounded px-2 py-1 text-sm">
              <option value="all">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button onClick={() => setShowAddModal(true)} className="bg-violet-700 text-white px-4 py-2 rounded flex items-center gap-2 font-poppins" aria-label="ajouter une transaction" data-testid="add-transaction-btn">
            <Plus size={18} /> Ajouter une transaction
          </button>
        </div>
        <div className="mb-8">
          <div className="md:hidden">
            {localTransactions.filter(t => (filterType === 'all' || t.type === filterType) && (filterCategory === 'all' || t.category === filterCategory)).map((tx) => (
              <div key={tx.id} className="bg-white rounded-xl shadow-sm border p-4 mb-4" data-testid={`transaction-mobile-${tx.id}`}> 
                <span className="font-bold text-lg text-gray-900 font-montserrat">{tx.description}</span>
                <span className={`font-bold text-sm ${tx.type === TransactionTypeEnum.INCOME ? 'text-green-600' : 'text-red-500'}`} data-testid={`transaction-amount-mobile-${tx.id}`}>{tx.type === TransactionTypeEnum.INCOME ? '+' : '-'}{tx.amount} €</span>
                <div className="flex items-center justify-between text-xs text-gray-500 font-poppins">
                  <span>{tx.category}</span>
                  <span>{tx.date.toLocaleDateString()}</span>
                </div>
                {tx.receipt && (
                  <a href={tx.receipt} className="text-blue-500 underline text-xs" target="_blank" rel="noopener noreferrer">Reçu</a>
                )}
                <button onClick={() => handleDeleteTransaction(tx.id)} className="mt-2 text-xs text-red-500 underline" data-testid={`delete-transaction-mobile-btn-${tx.id}`}>Supprimer</button>
              </div>
            ))}
          </div>
          <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden" data-testid="finances-table-block">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900" data-testid="finances-table-title">Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="finances-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reçu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {localTransactions.filter(t => (filterType === 'all' || t.type === filterType) && (filterCategory === 'all' || t.category === filterCategory)).map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50" data-testid={`transaction-row-${tx.id}`}> 
                      <td className="px-6 py-4" data-testid={`transaction-desc-${tx.id}`}>{tx.description}</td>
                      <td className="px-6 py-4" data-testid={`transaction-type-${tx.id}`}>{tx.type === TransactionTypeEnum.INCOME ? 'Entrée' : 'Sortie'}</td>
                      <td className={`px-6 py-4 font-bold ${tx.type === TransactionTypeEnum.INCOME ? 'text-green-600' : 'text-red-500'}`} data-testid={`transaction-amount-${tx.id}`}>{tx.type === TransactionTypeEnum.INCOME ? '+' : '-'}{tx.amount} €</td>
                      <td className="px-6 py-4" data-testid={`transaction-category-${tx.id}`}>{tx.category}</td>
                      <td className="px-6 py-4" data-testid={`transaction-date-${tx.id}`}>{tx.date.toLocaleDateString()}</td>
                      <td className="px-6 py-4" data-testid={`transaction-receipt-${tx.id}`}>{tx.receipt ? (<a href={tx.receipt} className="text-blue-500 underline text-xs" target="_blank" rel="noopener noreferrer">Reçu</a>) : '-'}</td>
                      <td className="px-6 py-4"><button onClick={() => handleDeleteTransaction(tx.id)} className="text-xs text-red-500 underline" data-testid={`delete-transaction-btn-${tx.id}`}>Supprimer</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Modal d'ajout mobile-first */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm">
                <h2 className="text-lg font-bold mb-4">Ajouter une transaction</h2>
                <form onSubmit={e => {
                  e.preventDefault();
                  if (
                    newDescription &&
                    newAmount > 0 &&
                    newType !== '' &&
                    newCategory
                  ) {
                    const transaction: TransactionType = {
                      id: Date.now().toString(),
                      description: newDescription,
                      amount: newAmount,
                      type: newType as TransactionTypeEnum,
                      category: newCategory,
                      date: new Date(),
                      associationId: 'assoc1',
                      receipt: ''
                    };
                    handleAddTransaction(transaction);
                    setShowAddModal(false);
                    setNewDescription('');
                    setNewAmount(0);
                    setNewType('');
                    setNewCategory('');
                  }
                }}>
                  <input
                    type="text"
                    placeholder="Description"
                    className="border rounded w-full mb-2 px-2 py-1"
                    required
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Montant"
                    className="border rounded w-full mb-2 px-2 py-1"
                    required
                    min={1}
                    value={newAmount === 0 ? '' : newAmount}
                    onChange={e => setNewAmount(Number(e.target.value))}
                  />
                  <select
                    className="border rounded w-full mb-2 px-2 py-1"
                    required
                    value={newType}
                    onChange={e => setNewType(e.target.value as TransactionTypeEnum | '')}
                  >
                    <option value="">Type</option>
                    <option value={TransactionTypeEnum.INCOME}>Entrée</option>
                    <option value={TransactionTypeEnum.EXPENSE}>Sortie</option>
                  </select>
                  <select
                    className="border rounded w-full mb-2 px-2 py-1"
                    required
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                  >
                    <option value="">Catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button type="submit" className="bg-violet-700 text-white px-4 py-2 rounded w-full mt-2">Ajouter</button>
                  <button type="button" className="mt-2 w-full text-gray-500 underline" onClick={() => {
                    setShowAddModal(false);
                    setNewDescription('');
                    setNewAmount(0);
                    setNewType('');
                    setNewCategory('');
                  }}>Annuler</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancesPage;
