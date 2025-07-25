import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, Calendar, User, CreditCard, Filter, MoreVertical } from 'lucide-react';
import { PaymentStatus, PaymentMethod, type CotisationType } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { useCotisations } from '../hooks/useCotisations';
import { useMembers } from '../hooks/useMembers';

// Données de démonstration supprimées - nous utilisons les vraies données
interface CotisationCardProps {
  cotisation: CotisationType;
  member: any;
  onEdit: (cotisation: CotisationType) => void;
  onDelete: (id: string) => void;
}

const CotisationCard: React.FC<CotisationCardProps> = ({ 
  cotisation, 
  member, 
  onEdit, 
  onDelete 
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusStyle = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-green-100 text-green-800 border-green-200';
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case PaymentStatus.OVERDUE:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return '✅';
      case PaymentStatus.PENDING:
        return '⏳';
      case PaymentStatus.OVERDUE:
        return '⚠️';
      default:
        return '❓';
    }
  };

  const memberName = member ? `${member.firstName} ${member.lastName}` : `Membre #${cotisation.memberId}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 relative">
      {/* Header avec nom et montant */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900 text-sm">{memberName}</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {formatCurrency(cotisation.amount)}
          </div>
        </div>
        
        {/* Menu actions */}
        <div className="relative">
          <button 
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Actions"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
          
          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowActions(false)}
              ></div>
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[150px]">
                <button 
                  onClick={() => {
                    onEdit(cotisation);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button 
                  onClick={() => {
                    onDelete(cotisation.id);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Badge de statut */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(cotisation.status)}`}>
          <span>{getStatusIcon(cotisation.status)}</span>
          {cotisation.status === PaymentStatus.PAID ? 'Payée' :
           cotisation.status === PaymentStatus.PENDING ? 'En attente' : 'En retard'}
        </span>
        <span className="text-xs text-gray-500 font-medium">
          Année {cotisation.year}
        </span>
      </div>

      {/* Informations détaillées */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Payé le {formatDate(cotisation.paymentDate)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard className="w-4 h-4 text-gray-400" />
          <span>
            {cotisation.paymentMethod === PaymentMethod.CASH ? 'Espèces' :
             cotisation.paymentMethod === PaymentMethod.BANK_TRANSFER ? 'Virement' :
             cotisation.paymentMethod === PaymentMethod.MOBILE_MONEY ? 'Mobile Money' :
             cotisation.paymentMethod === PaymentMethod.CHECK ? 'Chèque' : 'Autre'}
          </span>
        </div>

        {cotisation.notes && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0">📝</div>
            <span className="line-clamp-2">{cotisation.notes}</span>
          </div>
        )}
      </div>

      {/* Indicator ID pour debug */}
      <div className="absolute top-2 right-12 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
        #{cotisation.id}
      </div>
    </div>
  );
};

export default function CotisationsPageMobile() {
  // Hooks pour les données réelles
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
  const [showFilters, setShowFilters] = useState(false);

  // Stats basées sur les vraies données
  const total = cotisations.length;
  const paid = cotisations.filter(c => c.status === PaymentStatus.PAID).length;
  const pending = cotisations.filter(c => c.status === PaymentStatus.PENDING).length;
  const overdue = cotisations.filter(c => c.status === PaymentStatus.OVERDUE).length;
  const totalAmount = cotisations.reduce((sum, c) => sum + c.amount, 0);
  const paidAmount = cotisations.filter(c => c.status === PaymentStatus.PAID).reduce((sum, c) => sum + c.amount, 0);

  // Debug des données
  console.log('📱 [CotisationsPageMobile] Données chargées:', {
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
    const matchesSearch = memberName.toLowerCase().includes(search.toLowerCase()) || 
                         c.notes?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (cotisation: CotisationType) => {
    console.log('Edit cotisation:', cotisation);
    // TODO: Ouvrir modal d'édition
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette cotisation ?')) {
      deleteCotisation(id);
    }
  };

  const handleAddNew = () => {
    console.log('Add new cotisation');
    // TODO: Ouvrir modal d'ajout
  };

  if (isLoading || membersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cards skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="flex justify-between mb-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile optimisé */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Cotisations</h1>
          <p className="text-sm text-gray-600">
            {total} cotisation{total > 1 ? 's' : ''} • {formatCurrency(paidAmount)} perçu
          </p>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Stats en grille compacte - Mobile First */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => setStatusFilter(statusFilter === 'ALL' ? 'ALL' : 'ALL')}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
              statusFilter === 'ALL' ? 'ring-2 ring-violet-500' : ''
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">Total</div>
            <div className="text-xl font-bold text-gray-900">{total}</div>
          </button>
          
          <button 
            onClick={() => setStatusFilter(statusFilter === PaymentStatus.PAID ? 'ALL' : PaymentStatus.PAID)}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
              statusFilter === PaymentStatus.PAID ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div className="text-xs text-green-600 mb-1">✅ Payées</div>
            <div className="text-xl font-bold text-green-700">{paid}</div>
          </button>
          
          <button 
            onClick={() => setStatusFilter(statusFilter === PaymentStatus.PENDING ? 'ALL' : PaymentStatus.PENDING)}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
              statusFilter === PaymentStatus.PENDING ? 'ring-2 ring-yellow-500' : ''
            }`}
          >
            <div className="text-xs text-orange-600 mb-1">⏳ En attente</div>
            <div className="text-xl font-bold text-orange-700">{pending}</div>
          </button>
          
          <button 
            onClick={() => setStatusFilter(statusFilter === PaymentStatus.OVERDUE ? 'ALL' : PaymentStatus.OVERDUE)}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
              statusFilter === PaymentStatus.OVERDUE ? 'ring-2 ring-red-500' : ''
            }`}
          >
            <div className="text-xs text-red-600 mb-1">⚠️ En retard</div>
            <div className="text-xl font-bold text-red-700">{overdue}</div>
          </button>
        </div>

        {/* Montant total - Design moderne mobile */}
        <div className="bg-gradient-to-r from-violet-600 to-orange-600 rounded-xl p-4 mb-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Montant total perçu</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(paidAmount)}</div>
          <div className="text-xs opacity-90 mt-1">
            Total possible: {formatCurrency(totalAmount)}
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl transition-all ${
              showFilters ? 'bg-violet-100 text-violet-700' : 'bg-white text-gray-600'
            } border border-gray-200`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Liste des cotisations */}
        {cotisations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune cotisation</h3>
            <p className="text-gray-600 mb-6">Commencez par ajouter la première cotisation</p>
            <button 
              onClick={handleAddNew}
              className="bg-violet-600 text-white px-6 py-3 rounded-xl font-medium"
            >
              Ajouter une cotisation
            </button>
          </div>
        ) : filteredCotisations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
            <p className="text-gray-600 mb-4">
              Aucune cotisation ne correspond à vos critères
            </p>
            <button 
              onClick={() => { setSearch(''); setStatusFilter('ALL'); }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCotisations.map(cotisation => {
              const member = members.find(m => m.id === cotisation.memberId);
              return (
                <CotisationCard 
                  key={cotisation.id}
                  cotisation={cotisation}
                  member={member}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Bouton flottant d'ajout - Mobile First */}
      <button
        onClick={handleAddNew}
        className="fixed bottom-6 right-6 bg-violet-600 text-white p-4 rounded-full shadow-lg hover:bg-violet-700 transition-colors z-10"
        aria-label="Ajouter une cotisation"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
