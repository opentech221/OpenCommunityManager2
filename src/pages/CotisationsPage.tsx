/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Plus, Trash2, Edit, Search } from 'lucide-react';
import { PaymentStatus, PaymentMethod, type CotisationType } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { useCotisations } from '../hooks/useCotisations';
import { useMembers } from '../hooks/useMembers';
import { CotisationFormModal } from '../components';

export default function CotisationsPage() {
  // Hooks pour les données
  const { 
    cotisations, 
    isLoading, 
    addCotisation, 
    updateCotisation, 
    deleteCotisation 
  } = useCotisations();
  
  const { members, isLoading: membersLoading } = useMembers();
  
  // États locaux
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<keyof typeof PaymentStatus | 'ALL'>('ALL');
  const [feedback, setFeedback] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCotisation, setEditCotisation] = useState<CotisationType | null>(null);

  // Stats
  const total = cotisations.length;
  const paid = cotisations.filter(c => c.status === PaymentStatus.PAID).length;
  const pending = cotisations.filter(c => c.status === PaymentStatus.PENDING).length;
  const overdue = cotisations.filter(c => c.status === PaymentStatus.OVERDUE).length;
  const totalAmount = cotisations.reduce((sum, c) => sum + c.amount, 0);
  const paidAmount = cotisations.filter(c => c.status === PaymentStatus.PAID).reduce((sum, c) => sum + c.amount, 0);

  // Debug des données
  console.log('🔍 [CotisationsPage] Données chargées:', {
    total,
    paid,
    pending,
    overdue,
    totalAmount,
    cotisations: cotisations.slice(0, 3) // Premières cotisations pour debug
  });

  const filteredCotisations = cotisations.filter(c => {
    const member = members.find(m => m.id === c.memberId);
    const memberName = member ? `${member.firstName} ${member.lastName}` : '';
    const matchesSearch = memberName.toLowerCase().includes(search.toLowerCase()) || c.notes?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleAdd = async (cotisationData: Partial<CotisationType>) => {
    try {
      await addCotisation(cotisationData as Omit<CotisationType, 'id'>);
      setFeedback('Cotisation ajoutée avec succès');
      setShowAddModal(false);
      setTimeout(() => setFeedback(''), 2000);
    } catch {
      setFeedback('Erreur lors de l\'ajout de la cotisation');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCotisation(id);
      setFeedback('Cotisation supprimée avec succès');
      setTimeout(() => setFeedback(''), 2000);
    } catch {
      setFeedback('Erreur lors de la suppression de la cotisation');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  const handleEdit = async (cotisationData: Partial<CotisationType>) => {
    if (!editCotisation) return;
    try {
      await updateCotisation(editCotisation.id, { ...editCotisation, ...cotisationData });
      setFeedback('Cotisation modifiée avec succès');
      setShowEditModal(false);
      setEditCotisation(null);
      setTimeout(() => setFeedback(''), 2000);
    } catch {
      setFeedback('Erreur lors de la modification de la cotisation');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  // Modal form handlers
  const openAddModal = () => {
    setShowAddModal(true);
  };

  const openEditModal = (cotisation: CotisationType) => {
    setEditCotisation(cotisation);
    setShowEditModal(true);
  };

  // Simulate edit for test
  const simulateEdit = () => {
    if (cotisations.length > 0) {
      openEditModal(cotisations[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header décoré avec couleur orange */}
      <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-500 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-orange-500" data-testid="cotisations-title">
              Gestion des Cotisations
            </h1>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors flex items-center space-x-2"
            data-testid="add-cotisation-btn"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvelle cotisation</span>
          </button>
        </div>
        <div className="mt-4">
          <p className="text-gray-700 font-medium">
            Optimisez vos revenus associatifs avec un suivi professionnel
          </p>
          <div className="text-sm text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Recouvrement automatisé :</strong> Relances et rappels intelligents
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Revenus prévisibles :</strong> Planification budgétaire et croissance assurée
            </p>
          </div>
        </div>
        
        {/* Indicateur de statut API - Debug */}
        <div className="flex items-center space-x-2 text-sm mt-3">
          <div className={`w-2 h-2 rounded-full ${
            isLoading ? 'bg-yellow-400 animate-pulse' : 
            cotisations.length > 0 ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
          <span className="text-gray-600">
            {isLoading ? 'Chargement...' : 
             cotisations.length > 0 ? `${cotisations.length} cotisations` : 'Aucune donnée'}
          </span>
        </div>
      </div>
      
      {/* État de chargement */}
      {(isLoading || membersLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Chargement des données...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Feedback */}
      {feedback && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50" role="alert">
          {feedback}
        </div>
      )}

      {/* Statistiques */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <button 
            className={`bg-white rounded-lg p-4 shadow hover:bg-violet-50 transition-colors border ${
              statusFilter === 'ALL' ? 'ring-2 ring-violet-500' : ''
            }`} 
            onClick={() => setStatusFilter('ALL')} 
            aria-label="Afficher toutes les cotisations" 
            data-testid="stat-total"
          >
            <div className="text-sm text-gray-500" data-testid="stat-total-label">Total</div>
            <div className="text-xl font-bold" data-testid="stat-total-value">{total}</div>
          </button>
          <button className={`bg-green-100 rounded-lg p-4 shadow hover:bg-green-200 transition-colors ${statusFilter === PaymentStatus.PAID ? 'ring-2 ring-green-500' : ''}`} onClick={() => setStatusFilter(PaymentStatus.PAID)} aria-label="Filtrer payées" data-testid="stat-paid">
            <div className="text-sm text-green-700" data-testid="stat-paid-label">Payées</div>
            <div className="text-xl font-bold" data-testid="stat-paid-value">{paid}</div>
          </button>
          <button className={`bg-yellow-100 rounded-lg p-4 shadow hover:bg-yellow-200 transition-colors ${statusFilter === PaymentStatus.PENDING ? 'ring-2 ring-yellow-500' : ''}`} onClick={() => setStatusFilter(PaymentStatus.PENDING)} aria-label="Filtrer en attente" data-testid="stat-pending">
            <div className="text-sm text-yellow-700" data-testid="stat-pending-label">En attente</div>
            <div className="text-xl font-bold" data-testid="stat-pending-value">{pending}</div>
          </button>
          <button className={`bg-red-100 rounded-lg p-4 shadow hover:bg-red-200 transition-colors ${statusFilter === PaymentStatus.OVERDUE ? 'ring-2 ring-red-500' : ''}`} onClick={() => setStatusFilter(PaymentStatus.OVERDUE)} aria-label="Filtrer en retard" data-testid="stat-overdue">
            <div className="text-sm text-red-700" data-testid="stat-overdue-label">En retard</div>
            <div className="text-xl font-bold" data-testid="stat-overdue-value">{overdue}</div>
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4" data-testid="stat-total-amount">
          <div className="text-sm text-gray-500" data-testid="stat-total-amount-label">Montant total perçu</div>
          <div className="text-xl font-bold text-green-600" data-testid="stat-total-amount-value">{formatCurrency(paidAmount)}</div>
          <div className="text-xs text-gray-400 mt-1">
            Total possible: {formatCurrency(totalAmount)} • Reste à percevoir: {formatCurrency(totalAmount - paidAmount)}
          </div>
        </div>
      </div>
      {/* Barre de recherche et bouton ajout */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-violet-800" />
        </div>
        <input
          type="text"
          placeholder="Rechercher une cotisation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="block flex-1 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
        />
      </div>
      {/* Liste des cotisations */}
      <div className="bg-white rounded-lg shadow p-4">
        {isLoading || membersLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-gray-500 mt-2">Chargement des cotisations...</p>
          </div>
        ) : cotisations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M12 11h.01M12 7V4a1 1 0 011-1h4a1 1 0 011 1v3M8 21l4-7 4 7H8z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Aucune cotisation enregistrée</p>
            <p className="text-gray-500 mb-4">Commencez par ajouter la première cotisation de votre association</p>
          </div>
        ) : filteredCotisations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">Aucune cotisation ne correspond à vos critères de recherche</p>
            <p className="text-sm text-gray-400">
              {total} cotisation{total > 1 ? 's' : ''} au total • 
              Recherche: "{search}" • 
              Filtre: {statusFilter === 'ALL' ? 'Tous' : statusFilter}
            </p>
            <button
              onClick={() => { setSearch(''); setStatusFilter('ALL'); }}
              className="btn-secondary mt-2"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-3 font-medium text-gray-700">Membre</th>
                  <th className="text-left p-3 font-medium text-gray-700">Montant</th>
                  <th className="text-left p-3 font-medium text-gray-700">Date</th>
                  <th className="text-left p-3 font-medium text-gray-700">Méthode</th>
                  <th className="text-left p-3 font-medium text-gray-700">Statut</th>
                  <th className="text-left p-3 font-medium text-gray-700">Année</th>
                  <th className="text-left p-3 font-medium text-gray-700">Notes</th>
                  <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCotisations.map((c, index) => (
                  <tr key={c.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="p-3">
                      {(() => {
                        const member = members.find(m => m.id === c.memberId);
                        return member ? (
                          <div>
                            <div className="font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                            <div className="text-xs text-gray-500">{member.role}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Membre inconnu</span>
                        );
                      })()}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-gray-900">{formatCurrency(c.amount)}</span>
                    </td>
                    <td className="p-3 text-gray-600">{formatDate(c.paymentDate)}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {c.paymentMethod === PaymentMethod.CASH ? 'Espèces' : 
                         c.paymentMethod === PaymentMethod.BANK_TRANSFER ? 'Virement' : 
                         c.paymentMethod === PaymentMethod.MOBILE_MONEY ? 'Mobile Money' : 'Chèque'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.status === PaymentStatus.PAID ? 'bg-green-100 text-green-800' :
                        c.status === PaymentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {c.status === PaymentStatus.PAID ? '✓ Payée' : 
                         c.status === PaymentStatus.PENDING ? '⏳ En attente' : '⚠️ En retard'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                        {c.year}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 max-w-xs truncate" title={c.notes || ''}>
                      {c.notes || '-'}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-1">
                        <button 
                          className="inline-flex items-center justify-center w-8 h-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-full transition-colors" 
                          onClick={() => openEditModal(c)} 
                          aria-label="Modifier"
                          title="Modifier cette cotisation"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="inline-flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors" 
                          onClick={() => handleDelete(c.id)} 
                          aria-label="Supprimer"
                          title="Supprimer cette cotisation"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Résumé en bas de page */}
      {cotisations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <div className="text-sm text-gray-600">
            Affichage de {filteredCotisations.length} cotisation{filteredCotisations.length > 1 ? 's' : ''} sur {total} au total
            {filteredCotisations.length !== total && (
              <span className="ml-2 text-blue-600">
                • Filtres actifs
              </span>
            )}
          </div>
        </div>
      )}

      {/* Modal ajout/modification harmonisé */}
      <CotisationFormModal
        isOpen={showAddModal || showEditModal}
        onClose={() => { 
          setShowAddModal(false); 
          setShowEditModal(false); 
          setEditCotisation(null); 
        }}
        cotisation={editCotisation}
        onSave={showAddModal ? handleAdd : handleEdit}
      />
    </div>
  );
}
