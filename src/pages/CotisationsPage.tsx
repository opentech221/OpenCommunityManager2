import { useState } from 'react';
import { Plus, Search, Eye, Download, Edit, Trash2 } from 'lucide-react';
import type { CotisationType, MemberType } from '../types';
import { PaymentMethod, PaymentStatus, MemberRole, MemberStatus } from '../types';
import { PAYMENT_METHODS, PAYMENT_STATUS } from '../constants';

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
    memberId: '1',
    amount: 15000,
    paymentDate: new Date('2025-03-01'),
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    status: PaymentStatus.PENDING,
    year: 2025,
    notes: 'Cotisation en attente de validation'
  }
];

export default function CotisationsPage() {
  const [cotisations] = useState<CotisationType[]>(mockCotisations);
  const [members] = useState<MemberType[]>(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [yearFilter, setYearFilter] = useState<number | 'ALL'>(2025);
  const [showAddModal, setShowAddModal] = useState(false);

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
      cotisation.memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || cotisation.status === statusFilter;
    const matchesYear = yearFilter === 'ALL' || cotisation.year === yearFilter;
    
    return matchesSearch && matchesStatus && matchesYear;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      [PaymentStatus.PAID]: 'bg-green-100 text-green-800',
      [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [PaymentStatus.OVERDUE]: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {PAYMENT_STATUS[status]}
      </span>
    );
  };

  const getPaymentMethodBadge = (method: PaymentMethod) => {
    const methodConfig = {
      [PaymentMethod.CASH]: 'bg-blue-100 text-blue-800',
      [PaymentMethod.BANK_TRANSFER]: 'bg-purple-100 text-purple-800',
      [PaymentMethod.MOBILE_MONEY]: 'bg-orange-100 text-orange-800',
      [PaymentMethod.CHECK]: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${methodConfig[method]}`}>
        {PAYMENT_METHODS[method]}
      </span>
    );
  };

  // Calculs statistiques
  const totalAmount = cotisations.reduce((sum, c) => sum + c.amount, 0);
  const paidAmount = cotisations.filter(c => c.status === PaymentStatus.PAID).reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = cotisations.filter(c => c.status === PaymentStatus.PENDING).reduce((sum, c) => sum + c.amount, 0);
  const overdueAmount = cotisations.filter(c => c.status === PaymentStatus.OVERDUE).reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-montserrat font-bold text-gray-900 mb-2">
          Gestion des cotisations
        </h1>
        <p className="text-gray-600">
          Suivez les paiements des cotisations et générez vos rapports
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total collecté</h3>
          <p className="text-3xl font-bold text-green-600">{paidAmount.toLocaleString()} FCFA</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">En attente</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingAmount.toLocaleString()} FCFA</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">En retard</h3>
          <p className="text-3xl font-bold text-red-600">{overdueAmount.toLocaleString()} FCFA</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Taux de collecte</h3>
          <p className="text-3xl font-bold text-blue-600">
            {totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un membre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'ALL')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                title="Filtrer par statut"
                aria-label="Filtrer par statut"
              >
                <option value="ALL">Tous les statuts</option>
                <option value={PaymentStatus.PAID}>Payé</option>
                <option value={PaymentStatus.PENDING}>En attente</option>
                <option value={PaymentStatus.OVERDUE}>En retard</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                title="Filtrer par année"
                aria-label="Filtrer par année"
              >
                <option value="ALL">Toutes les années</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-secondary flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Enregistrer cotisation
            </button>
          </div>
        </div>
      </div>

      {/* Cotisations Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode de paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Année
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCotisations.map((cotisation, index) => (
                <tr key={cotisation.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {cotisation.memberName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {cotisation.memberEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {cotisation.amount.toLocaleString()} FCFA
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentMethodBadge(cotisation.paymentMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cotisation.paymentDate.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cotisation.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(cotisation.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir les détails"
                        aria-label="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Modifier"
                        aria-label="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCotisations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune cotisation trouvée</p>
          </div>
        )}
      </div>

      {/* Add Cotisation Modal - TODO: Implement */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Enregistrer une cotisation</h3>
            <p className="text-gray-600 mb-4">Fonctionnalité à implémenter...</p>
            <button
              onClick={() => setShowAddModal(false)}
              className="btn-primary"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}