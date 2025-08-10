import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Users, Download, Eye, DollarSign } from 'lucide-react';
import { PaymentStatus, PaymentMethod, type CotisationType } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { useCotisations } from '../hooks/useCotisations';
import { useMembers } from '../hooks/useMembers';
import { 
  CotisationDetailModal,
  EditCotisationModal,
  AddCotisationModal
} from '../components';

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
  
  // États pour les modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCotisation, setSelectedCotisation] = useState<CotisationType | null>(null);
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
    cotisations: cotisations.slice(0, 3)
  });

  const filteredCotisations = cotisations.filter(c => {
    const member = members.find(m => m.id === c.memberId);
    const memberName = member ? `${member.firstName} ${member.lastName}` : '';
    const matchesSearch = memberName.toLowerCase().includes(search.toLowerCase()) || c.notes?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleAdd = async (cotisationData: Omit<CotisationType, 'id'>) => {
    try {
      await addCotisation(cotisationData);
      setFeedback('Cotisation ajoutée avec succès');
      setShowAddModal(false);
      setTimeout(() => setFeedback(''), 2000);
    } catch {
      setFeedback('Erreur lors de l\'ajout de la cotisation');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette cotisation ?')) {
      try {
        await deleteCotisation(id);
        setFeedback('Cotisation supprimée avec succès');
        setTimeout(() => setFeedback(''), 2000);
      } catch {
        setFeedback('Erreur lors de la suppression de la cotisation');
        setTimeout(() => setFeedback(''), 2000);
      }
    }
  };

  const handleEdit = async (cotisationData: Partial<CotisationType>) => {
    if (!selectedCotisation) return;
    try {
      await updateCotisation(selectedCotisation.id, cotisationData);
      setFeedback('Cotisation modifiée avec succès');
      setShowEditModal(false);
      setSelectedCotisation(null);
      setTimeout(() => setFeedback(''), 2000);
    } catch {
      setFeedback('Erreur lors de la modification de la cotisation');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setSelectedCotisation(null);
    setShowAddModal(true);
    setShowFloatingMenu(false);
  };

  const openEditModal = (cotisation: CotisationType) => {
    setSelectedCotisation(cotisation);
    setShowEditModal(true);
  };

  const openDetailModal = (cotisation: CotisationType) => {
    setSelectedCotisation(cotisation);
    setShowDetailModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedCotisation(null);
  };

  return (
    <div className="min-h-screen bg-purple-900 p-0">
      {/* Header décoré avec couleur orange */}
      <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-500 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-orange-500" data-testid="cotisations-title">
              Gestion des Cotisations
            </h1>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
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
      </div>

      {/* Message de feedback */}
      {feedback && (
        <div className={`mb-4 p-3 rounded-lg ${
          feedback.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback}
        </div>
      )}

      {/* Tableau de bord des statistiques */}
      <div className="bg-white grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button 
          className={`bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow border ${
            statusFilter === 'ALL' ? 'ring-2 ring-purple-500 ring-offset-2' : ''
          }`} 
          onClick={() => setStatusFilter('ALL')} 
          aria-label="Afficher toutes les cotisations" 
          data-testid="stat-total"
        >
          <div className="text-2xl font-bold text-purple-600" data-testid="stat-total-value">{total}</div>
          <div className="text-sm text-purple-600" data-testid="stat-total-label">Total</div>
        </button>
        <button 
          className={`bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow border ${
            statusFilter === PaymentStatus.PAID ? 'ring-2 ring-green-500 ring-offset-2' : ''
          }`} 
          onClick={() => setStatusFilter(statusFilter === PaymentStatus.PAID ? 'ALL' : PaymentStatus.PAID)} 
          aria-label="Filtrer payées" 
          data-testid="stat-paid"
        >
          <div className="text-2xl font-bold text-green-600" data-testid="stat-paid-value">{paid}</div>
          <div className="text-sm text-green-600" data-testid="stat-paid-label">Payées</div>
        </button>
        <button 
          className={`bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow border ${
            statusFilter === PaymentStatus.PENDING ? 'ring-2 ring-yellow-500 ring-offset-2' : ''
          }`} 
          onClick={() => setStatusFilter(statusFilter === PaymentStatus.PENDING ? 'ALL' : PaymentStatus.PENDING)} 
          aria-label="Filtrer en attente" 
          data-testid="stat-pending"
        >
          <div className="text-2xl font-bold text-yellow-600" data-testid="stat-pending-value">{pending}</div>
          <div className="text-sm text-yellow-600" data-testid="stat-pending-label">En attente</div>
        </button>
        <button 
          className={`bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow border ${
            statusFilter === PaymentStatus.OVERDUE ? 'ring-2 ring-red-500 ring-offset-2' : ''
          }`} 
          onClick={() => setStatusFilter(statusFilter === PaymentStatus.OVERDUE ? 'ALL' : PaymentStatus.OVERDUE)} 
          aria-label="Filtrer en retard" 
          data-testid="stat-overdue"
        >
          <div className="text-2xl font-bold text-red-600" data-testid="stat-overdue-value">{overdue}</div>
          <div className="text-sm text-red-600" data-testid="stat-overdue-label">En retard</div>
        </button>
      </div>

      {/* Widget montants */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-green-700">Montants collectés</div>
          <div className="text-2xl font-bold text-green-600" data-testid="stat-total-amount-value">{formatCurrency(paidAmount)}</div>
          <div className="text-xs text-gray-400 mt-1">
            Total possible: {formatCurrency(totalAmount)} • Reste à percevoir: {formatCurrency(totalAmount - paidAmount)}
          </div>
        </div>
      </div>

      {/* Liste des cotisations */}
      <div className="bg-white rounded-lg shadow p-4">
        {/* Barre de recherche */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une cotisation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="block flex-1 w-full pl-10 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

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
              <DollarSign className="w-16 h-16 mx-auto mb-4" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Aucune cotisation enregistrée</p>
            <p className="text-gray-500 mb-4">Commencez par ajouter la première cotisation de votre association</p>
            <button 
              onClick={openAddModal}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Ajouter une cotisation
            </button>
          </div>
        ) : filteredCotisations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune cotisation trouvée pour votre recherche</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
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
                          className="inline-flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors" 
                          onClick={() => openDetailModal(c)} 
                          aria-label="Voir détails"
                          title="Voir les détails"
                        >
                          <Eye size={14} />
                        </button>
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

      {/* Modals */}
      <AddCotisationModal
        isOpen={showAddModal}
        onClose={closeModals}
        members={members}
        onSave={handleAdd}
        isLoading={isLoading}
      />

      <EditCotisationModal
        isOpen={showEditModal}
        onClose={closeModals}
        cotisation={selectedCotisation!}
        members={members}
        onSave={handleEdit}
        isLoading={isLoading}
      />

      <CotisationDetailModal
        isOpen={showDetailModal}
        onClose={closeModals}
        cotisation={selectedCotisation}
        member={selectedCotisation ? members.find(m => m.id === selectedCotisation.memberId) : null}
      />

      {/* Bouton flottant avec menu d'actions */}
      <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
        {/* Menu d'actions (visible quand showFloatingMenu est true) */}
        {showFloatingMenu && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
            <button
              onClick={openAddModal}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Plus className="h-4 w-4 text-orange-600" />
              <span>Nouvelle Cotisation</span>
            </button>
            
            <button
              onClick={() => {
                // Navigation vers membres pour voir les cotisations
                window.location.href = '/members';
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Users className="h-4 w-4 text-blue-600" />
              <span>Voir Membres</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => {
                // Fonction d'export à implémenter
                console.log('Export des cotisations');
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Download className="h-4 w-4 text-green-600" />
              <span>Exporter</span>
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
}
