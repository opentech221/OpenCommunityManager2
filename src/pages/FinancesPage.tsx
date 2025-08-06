
import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, Filter, Download, FileText, BarChart3 } from 'lucide-react';
import type { Transaction } from '../types';
import { TransactionType } from '../types';
import { TransactionFormModal } from '../components';
import { useFinances } from '../hooks/useFinances';

const categories = ['Cotisations', 'Subventions', 'Événements', 'Fournitures', 'Administration'];

const FinancesPage: React.FC = () => {
  const { 
    transactions, 
    isLoading, 
    addTransaction, 
    deleteTransaction
  } = useFinances();
  
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  // Gestion du clic extérieur pour fermer le menu flottant
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.floating-menu-container')) {
        setShowFloatingMenu(false);
      }
    };

    if (showFloatingMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFloatingMenu]);

  const handleAddTransaction = async (transactionData: Partial<Transaction>) => {
    try {
      await addTransaction(transactionData);
      setFeedbackMessage('Transaction ajoutée avec succès');
      setShowAddModal(false);
      setTimeout(() => setFeedbackMessage(''), 2000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      setFeedbackMessage('Erreur lors de l\'ajout de la transaction');
      setTimeout(() => setFeedbackMessage(''), 2000);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setFeedbackMessage('Transaction supprimée avec succès');
      setTimeout(() => setFeedbackMessage(''), 2000);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setFeedbackMessage('Erreur lors de la suppression de la transaction');
      setTimeout(() => setFeedbackMessage(''), 2000);
    }
  };

  const totalIncome = transactions.filter((t: Transaction) => t.type === TransactionType.INCOME).reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t: Transaction) => t.type === TransactionType.EXPENSE).reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-purple-900 p-0">
      {feedbackMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50" data-testid="finances-feedback">
          {feedbackMessage}
        </div>
      )}
      
      {isLoading && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow z-50">
          Chargement des transactions...
        </div>
      )}
      
      <div className="px-4 sm:px-6 lg:px-8">
        {/* En-tête décoré avec couleur orange */}
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-500 shadow-sm">
          <div className="flex items-center justify-between">
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
            <button 
              onClick={() => setShowAddModal(true)} 
              className="bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 text-sm sm:text-base" 
              aria-label="Ajouter une transaction" 
              data-testid="add-transaction-btn"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Nouvelle transaction</span>
              <span className="sm:hidden">Nouveau</span>
            </button>
          </div>
          <div className="mt-4 hidden md:block">
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
      </div>

      
        {/* Statistiques financières avec boutons fonctionnels */}
        <div className="bg-white px-4 py-4 sm:px-6 lg:px-8 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button 
              className={`bg-purple-100 rounded-lg p-3 shadow hover:bg-purple-200 transition-colors border ${
                filterType === 'all' ? 'ring-2 ring-purple-500 ring-offset-2' : ''
              }`}
              onClick={() => setFilterType('all')}
              aria-label="Afficher toutes les transactions"
            >
              <div className="flex flex-col items-center space-y-1">
                <Wallet className="h-6 w-6 text-purple-600" />
                <div className="text-lg sm:text-xl font-bold text-purple-700" data-testid="finances-balance">{balance}€</div>
                <div className="text-xs sm:text-sm text-purple-600">Solde</div>
              </div>
            </button>
            <button 
              className={`bg-green-100 rounded-lg p-3 shadow hover:bg-green-200 transition-colors border ${
                filterType === TransactionType.INCOME ? 'ring-2 ring-green-500 ring-offset-2' : ''
              }`}
              onClick={() => setFilterType(filterType === TransactionType.INCOME ? 'all' : TransactionType.INCOME)}
              aria-label="Filtrer les entrées"
            >
              <div className="flex flex-col items-center space-y-1">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <div className="text-lg sm:text-xl font-bold text-green-700" data-testid="finances-income">{totalIncome}€</div>
                <div className="text-xs sm:text-sm text-green-600">Entrées</div>
              </div>
            </button>
            <button 
              className={`bg-red-100 rounded-lg p-3 shadow hover:bg-red-200 transition-colors border ${
                filterType === TransactionType.EXPENSE ? 'ring-2 ring-red-500 ring-offset-2' : ''
              }`}
              onClick={() => setFilterType(filterType === TransactionType.EXPENSE ? 'all' : TransactionType.EXPENSE)}
              aria-label="Filtrer les sorties"
            >
              <div className="flex flex-col items-center space-y-1">
                <TrendingDown className="h-6 w-6 text-red-600" />
                <div className="text-lg sm:text-xl font-bold text-red-700" data-testid="finances-expenses">{totalExpenses}€</div>
                <div className="text-xs sm:text-sm text-red-600">Sorties</div>
              </div>
            </button>
            <button 
              className="bg-blue-100 rounded-lg p-3 shadow hover:bg-blue-200 transition-colors border"
              onClick={() => {
                // Action pour voir les statistiques détaillées
                console.log('Statistiques détaillées');
              }}
              aria-label="Voir statistiques détaillées"
            >
              <div className="flex flex-col items-center space-y-1">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <div className="text-lg sm:text-xl font-bold text-blue-700">{transactions.length}</div>
                <div className="text-xs sm:text-sm text-blue-600">Transactions</div>
              </div>
            </button>
          </div>
        </div>

      <div className="px-4 py-4 bg-white gap-6 mb-8">
        {/* Systeme de filtre des transactions */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 items-center">
            <Filter className="text-purple-500" size={30} />
            <select value={filterType} onChange={e => setFilterType(e.target.value as 'all' | TransactionType)} className="border rounded px-2 py-1 text-sm bg-purple-200 border-purple-600 hover:bg-purple-300">
              <option value="all">Tous</option>
              <option value={TransactionType.INCOME}>Entrées</option>
              <option value={TransactionType.EXPENSE}>Sorties</option>
            </select>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border rounded px-2 py-1 text-sm bg-purple-200 border-purple-600 hover:bg-purple-300">
              <option value="all">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Liste des transactions */}
        <div className="mb-8">
          <div className="md:hidden">
            {transactions.filter((t: Transaction) => (filterType === 'all' || t.type === filterType) && (filterCategory === 'all' || t.category === filterCategory)).map((tx: Transaction) => (
              <div key={tx.id} className="bg-white rounded-xl shadow-sm border p-4 mb-4" data-testid={`transaction-mobile-${tx.id}`}> 
                <span className="font-bold text-lg text-gray-900 font-montserrat">{tx.description}</span>
                <span className={`font-bold text-sm ${tx.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-500'}`} data-testid={`transaction-amount-mobile-${tx.id}`}>{tx.type === TransactionType.INCOME ? '+' : '-'}{tx.amount} €</span>
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
                  {transactions.filter((t: Transaction) => (filterType === 'all' || t.type === filterType) && (filterCategory === 'all' || t.category === filterCategory)).map((tx: Transaction) => (
                    <tr key={tx.id} className="hover:bg-gray-50" data-testid={`transaction-row-${tx.id}`}> 
                      <td className="px-6 py-4" data-testid={`transaction-desc-${tx.id}`}>{tx.description}</td>
                      <td className="px-6 py-4" data-testid={`transaction-type-${tx.id}`}>{tx.type === TransactionType.INCOME ? 'Entrée' : 'Sortie'}</td>
                      <td className={`px-6 py-4 font-bold ${tx.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-500'}`} data-testid={`transaction-amount-${tx.id}`}>{tx.type === TransactionType.INCOME ? '+' : '-'}{tx.amount} €</td>
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

      {/* Bouton flottant avec menu d'actions */}
      <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
        {/* Menu d'actions (visible quand showFloatingMenu est true) */}
        {showFloatingMenu && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
            <button
              onClick={() => {
                setShowAddModal(true);
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Plus className="h-4 w-4 text-orange-600" />
              <span>Nouvelle Transaction</span>
            </button>
            
            <button
              onClick={() => {
                // Navigation vers cotisations
                window.location.href = '/cotisations';
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Wallet className="h-4 w-4 text-blue-600" />
              <span>Voir Cotisations</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => {
                // Fonction d'export à implémenter
                console.log('Export des finances');
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Download className="h-4 w-4 text-green-600" />
              <span>Exporter Données</span>
            </button>
            
            <button
              onClick={() => {
                // Fonction de rapport à implémenter
                console.log('Générer bilan financier');
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <FileText className="h-4 w-4 text-purple-600" />
              <span>Bilan Financier</span>
            </button>
          </div>
        )}

        {/* Bouton principal flottant */}
        <button
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            showFloatingMenu 
              ? 'bg-gray-600 hover:bg-gray-700 transform rotate-45' 
              : 'bg-orange-500 hover:bg-orange-600 hover:scale-110'
          }`}
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default FinancesPage;
