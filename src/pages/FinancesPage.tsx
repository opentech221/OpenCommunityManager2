
import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, Filter } from 'lucide-react';
import type { TransactionType } from '../types';
import { TransactionTypeEnum } from '../types';
import { TransactionFormModal } from '../components';

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

  const handleAddTransaction = (transactionData: Partial<TransactionType>) => {
    const transaction: TransactionType = {
      id: Date.now().toString(),
      ...transactionData,
      associationId: 'assoc1',
      receipt: ''
    } as TransactionType;
    
    setLocalTransactions(prev => [...prev, transaction]);
    setFeedbackMessage('Transaction ajoutée avec succès');
    setShowAddModal(false);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
      {feedbackMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50" data-testid="finances-feedback">
          {feedbackMessage}
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        {/* En-tête décoré avec couleur orange */}
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-500 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-orange-500" data-testid="finances-title">
              Gestion Financière
            </h1>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 font-medium">
              Maximisez vos ressources et développez votre impact
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <strong>Transparence totale :</strong> Suivi en temps réel et rapports automatisés
              </p>
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <strong>Croissance maîtrisée :</strong> Budgets prévisionnels et optimisation des coûts
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button 
            className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center hover:bg-violet-50 transition-colors ${
              filterType === 'all' ? 'ring-2 ring-violet-500' : ''
            }`}
            onClick={() => setFilterType('all')}
            aria-label="Afficher toutes les transactions"
          >
            <Wallet className="text-violet-700 mb-2" size={32} />
            <span className="font-bold text-lg text-gray-900 font-montserrat">Solde</span>
            <span className="font-bold text-2xl text-violet-700" data-testid="finances-balance">{balance} €</span>
          </button>
          <button 
            className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center hover:bg-green-50 transition-colors ${
              filterType === TransactionTypeEnum.INCOME ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setFilterType(TransactionTypeEnum.INCOME)}
            aria-label="Filtrer les entrées"
          >
            <TrendingUp className="text-green-600 mb-2" size={32} />
            <span className="font-bold text-lg text-gray-900 font-montserrat">Entrées</span>
            <span className="font-bold text-2xl text-green-600" data-testid="finances-income">{totalIncome} €</span>
          </button>
          <button 
            className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center hover:bg-red-50 transition-colors ${
              filterType === TransactionTypeEnum.EXPENSE ? 'ring-2 ring-red-500' : ''
            }`}
            onClick={() => setFilterType(TransactionTypeEnum.EXPENSE)}
            aria-label="Filtrer les sorties"
          >
            <TrendingDown className="text-red-500 mb-2" size={32} />
            <span className="font-bold text-lg text-gray-900 font-montserrat">Sorties</span>
            <span className="font-bold text-2xl text-red-500" data-testid="finances-expenses">{totalExpenses} €</span>
          </button>
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
          <button onClick={() => setShowAddModal(true)} className="bg-orange-500 text-white px-4 py-2 rounded flex items-center gap-2 font-poppins" aria-label="ajouter une transaction" data-testid="add-transaction-btn">
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

          {/* Modal d'ajout avec composant harmonisé */}
          <TransactionFormModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancesPage;
