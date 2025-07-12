import { useState } from 'react';
import { Plus, Search, Eye, Download, Edit, Trash2, DollarSign, Calendar, User, CreditCard, Filter } from 'lucide-react';
import type { CotisationType, MemberType } from '../types';
import { PaymentMethod, PaymentStatus, MemberRole, MemberStatus } from '../types';

// Données de démonstration pour les membres
const mockMembers: MemberType[] = [
  {
    id: '1',
    firstName: 'Aminata',
    lastName: 'Diallo',
    email: 'aminata.diallo@email.com',
    phone: '+221 77 123 45 67',
    role: 'PRESIDENT' as MemberRole,
    status: 'ACTIVE' as MemberStatus,
    joinDate: new Date('2023-01-15'),
    associationId: 'assoc-1'
  },
  {
    id: '2',
    firstName: 'Mamadou',
    lastName: 'Ba',
    email: 'mamadou.ba@email.com',
    phone: '+221 70 987 65 43',
    role: 'TREASURER' as MemberRole,
    status: 'ACTIVE' as MemberStatus,
    joinDate: new Date('2023-02-10'),
    associationId: 'assoc-1'
  },
  {
    id: '3',
    firstName: 'Fatou',
    lastName: 'Sow',
    email: 'fatou.sow@email.com',
    phone: '+221 76 555 44 33',
    role: 'MEMBER' as MemberRole,
    status: 'ACTIVE' as MemberStatus,
    joinDate: new Date('2023-03-05'),
    associationId: 'assoc-1'
  },
  {
    id: '4',
    firstName: 'Ibrahima',
    lastName: 'Kane',
    email: 'ibrahima.kane@email.com',
    phone: '+221 78 888 99 00',
    role: 'MEMBER' as MemberRole,
    status: 'ACTIVE' as MemberStatus,
    joinDate: new Date('2023-04-20'),
    associationId: 'assoc-1'
  }
];

// Données de démonstration pour les cotisations
const mockCotisations: CotisationType[] = [
  {
    id: '1',
    memberId: '1',
    amount: 15000,
    paymentDate: new Date('2025-01-15'),
    paymentMethod: PaymentMethod.MOBILE_MONEY,
    status: PaymentStatus.PAID,
    year: 2025,
    notes: 'Cotisation annuelle 2025'
  },
  {
    id: '2',
    memberId: '2',
    amount: 15000,
    paymentDate: new Date('2025-02-01'),
    paymentMethod: PaymentMethod.CASH,
    status: PaymentStatus.PAID,
    year: 2025,
    notes: 'Cotisation annuelle 2025'
  },
  {
    id: '3',
    memberId: '3',
    amount: 15000,
    paymentDate: new Date('2025-03-01'),
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    status: PaymentStatus.PENDING,
    year: 2025,
    notes: 'Cotisation en attente de validation'
  },
  {
    id: '4',
    memberId: '4',
    amount: 15000,
    paymentDate: new Date('2025-01-30'),
    paymentMethod: PaymentMethod.MOBILE_MONEY,
    status: PaymentStatus.OVERDUE,
    year: 2025,
    notes: 'Cotisation en retard'
  },
  {
    id: '5',
    memberId: '1',
    amount: 15000,
    paymentDate: new Date('2024-12-15'),
    paymentMethod: PaymentMethod.CASH,
    status: PaymentStatus.PAID,
    year: 2024,
    notes: 'Cotisation annuelle 2024'
  }
];

export default function CotisationsPage() {
  const [cotisations] = useState<CotisationType[]>(mockCotisations);
  const [members] = useState<MemberType[]>(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [yearFilter, setYearFilter] = useState<number | 'ALL'>(2025);
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Enrichir les cotisations avec les informations des membres
  const enrichedCotisations = cotisations.map(cotisation => {
    const member = members.find(m => m.id === cotisation.memberId);
    return {
      ...cotisation,
      memberName: member ? `${member.firstName} ${member.lastName}` : 'Membre inconnu',
      memberEmail: member?.email || ''
    };
  });

  const filteredCotisations = enrichedCotisations.filter(cotisation => {
    const matchesSearch = 
      cotisation.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cotisation.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cotisation.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || cotisation.status === statusFilter;
    const matchesYear = yearFilter === 'ALL' || cotisation.year === yearFilter;
    const matchesMethod = methodFilter === 'ALL' || cotisation.paymentMethod === methodFilter;
    
    return matchesSearch && matchesStatus && matchesYear && matchesMethod;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      [PaymentStatus.PAID]: { label: 'Payé', className: 'bg-green-100 text-green-800' },
      [PaymentStatus.PENDING]: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      [PaymentStatus.OVERDUE]: { label: 'En retard', className: 'bg-red-100 text-red-800' }
    };
    
    return statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const methodLabels = {
      [PaymentMethod.CASH]: 'Espèces',
      [PaymentMethod.MOBILE_MONEY]: 'Mobile Money',
      [PaymentMethod.BANK_TRANSFER]: 'Virement',
      [PaymentMethod.CHECK]: 'Chèque',
      [PaymentMethod.CARD]: 'Carte'
    };
    
    return methodLabels[method] || method;
  };

  const getPaymentMethodColor = (method: PaymentMethod) => {
    const methodColors = {
      [PaymentMethod.CASH]: 'bg-gray-100 text-gray-800',
      [PaymentMethod.MOBILE_MONEY]: 'bg-blue-100 text-blue-800',
      [PaymentMethod.BANK_TRANSFER]: 'bg-purple-100 text-purple-800',
      [PaymentMethod.CHECK]: 'bg-orange-100 text-orange-800',
      [PaymentMethod.CARD]: 'bg-green-100 text-green-800'
    };
    
    return methodColors[method] || 'bg-gray-100 text-gray-800';
  };

  const getCotisationStats = () => {
    const paid = cotisations.filter(c => c.status === PaymentStatus.PAID).length;
    const pending = cotisations.filter(c => c.status === PaymentStatus.PENDING).length;
    const overdue = cotisations.filter(c => c.status === PaymentStatus.OVERDUE).length;
    const totalAmount = cotisations
      .filter(c => c.status === PaymentStatus.PAID)
      .reduce((sum, c) => sum + c.amount, 0);
    
    return { paid, pending, overdue, total: cotisations.length, totalAmount };
  };

  const stats = getCotisationStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête Mobile-First */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Cotisations
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Gérez les cotisations de vos membres
              </p>
            </div>
            <button className="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm sm:text-base">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Nouvelle cotisation</span>
              <span className="sm:hidden">Nouveau</span>
            </button>
          </div>
          
          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-purple-600">{stats.total}</div>
              <div className="text-xs sm:text-sm text-purple-600">Total</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-green-600">{stats.paid}</div>
              <div className="text-xs sm:text-sm text-green-600">Payées</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-xs sm:text-sm text-yellow-600">En attente</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-xs sm:text-sm text-red-600">En retard</div>
            </div>
          </div>
          
          {/* Montant total */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Montant total perçu</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mt-1">
              {stats.totalAmount.toLocaleString()} FCFA
            </div>
          </div>
        </div>
      </div>

      {/* Recherche et filtres mobiles */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une cotisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Filtres rapides */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'ALL' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setStatusFilter(PaymentStatus.PAID)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === PaymentStatus.PAID 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Payées
            </button>
            <button
              onClick={() => setStatusFilter(PaymentStatus.PENDING)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === PaymentStatus.PENDING 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setStatusFilter(PaymentStatus.OVERDUE)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === PaymentStatus.OVERDUE 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En retard
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0 flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="ALL">Toutes les années</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value as typeof methodFilter)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="ALL">Toutes les méthodes</option>
                  <option value={PaymentMethod.CASH}>Espèces</option>
                  <option value={PaymentMethod.MOBILE_MONEY}>Mobile Money</option>
                  <option value={PaymentMethod.BANK_TRANSFER}>Virement</option>
                  <option value={PaymentMethod.CHECK}>Chèque</option>
                  <option value={PaymentMethod.CARD}>Carte</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Liste des cotisations - Mobile First */}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        {filteredCotisations.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-gray-500 text-lg mt-2">Aucune cotisation trouvée</div>
            <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCotisations.map((cotisation) => {
              const statusBadge = getStatusBadge(cotisation.status);
              
              return (
                <div key={cotisation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {cotisation.memberName}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {cotisation.memberEmail}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-bold text-purple-600">
                          {cotisation.amount.toLocaleString()} FCFA
                        </div>
                        <div className="text-xs text-gray-500">
                          Année {cotisation.year}
                        </div>
                      </div>
                    </div>
                    
                    {/* Badges de statut et méthode */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentMethodColor(cotisation.paymentMethod)}`}>
                        {getPaymentMethodLabel(cotisation.paymentMethod)}
                      </span>
                    </div>
                    
                    {/* Informations détaillées */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>
                          Payé le {cotisation.paymentDate.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {cotisation.notes && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Note:</span> {cotisation.notes}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors">
                          <Download className="w-4 h-4 mr-1" />
                          Reçu
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination mobile */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{filteredCotisations.length}</span> sur <span className="font-medium">{cotisations.length}</span> cotisations
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 border border-gray-300 rounded-md">
              Précédent
            </button>
            <button className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md">
              1
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 border border-gray-300 rounded-md">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
