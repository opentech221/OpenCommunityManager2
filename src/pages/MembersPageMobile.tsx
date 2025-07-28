import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Phone, Calendar, User, MoreVertical } from 'lucide-react';
import type { MemberType, MemberRole as MemberRoleType, MemberStatus as MemberStatusType } from '../types';
import { MemberRole, MemberStatus } from '../types';
import { formatDate } from '../utils';

interface MemberCardProps {
  member: MemberType;
  onEdit: (member: MemberType) => void;
  onDelete: (id: string) => void;
  onView: (member: MemberType) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ 
  member, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusStyle = (status: MemberStatusType) => {
    switch (status) {
      case MemberStatus.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case MemberStatus.SUSPENDED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case MemberStatus.INACTIVE:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: MemberStatusType) => {
    switch (status) {
      case MemberStatus.ACTIVE:
        return '✅';
      case MemberStatus.SUSPENDED:
        return '⏸️';
      case MemberStatus.INACTIVE:
        return '❌';
      default:
        return '❓';
    }
  };

  const getRoleStyle = (role: MemberRoleType) => {
    switch (role) {
      case MemberRole.PRESIDENT:
        return 'bg-violet-100 text-violet-800 border-violet-200';
      case MemberRole.VICE_PRESIDENT:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case MemberRole.SECRETARY:
        return 'bg-green-100 text-green-800 border-green-200';
      case MemberRole.TREASURER:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case MemberRole.MEMBER:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: MemberRoleType) => {
    switch (role) {
      case MemberRole.PRESIDENT: return 'Président';
      case MemberRole.VICE_PRESIDENT: return 'Vice-président';
      case MemberRole.SECRETARY: return 'Secrétaire';
      case MemberRole.TREASURER: return 'Trésorier';
      case MemberRole.MEMBER: return 'Membre';
      default: return role;
    }
  };

  const getStatusLabel = (status: MemberStatusType) => {
    switch (status) {
      case MemberStatus.ACTIVE: return 'Actif';
      case MemberStatus.SUSPENDED: return 'Suspendu';
      case MemberStatus.INACTIVE: return 'Inactif';
      default: return status;
    }
  };

  function handleAddNew(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 relative">
      {/* Header avec nom et statut */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900 text-sm">
              {member.firstName} {member.lastName}
            </span>
          </div>
          <div className="text-sm text-gray-600">{member.email}</div>
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
                    onView(member);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Voir
                </button>
                <button 
                  onClick={() => {
                    onEdit(member);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button 
                  onClick={() => {
                    onDelete(member.id);
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

      {/* Badges de statut et rôle */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(member.status)}`}>
          <span>{getStatusIcon(member.status)}</span>
          {getStatusLabel(member.status)}
        </span>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleStyle(member.role)}`}>
          {getRoleLabel(member.role)}
        </span>
      </div>

      {/* Informations détaillées */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{member.phone}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Membre depuis le {formatDate(member.joinDate)}</span>
        </div>
      </div>

      {/* Indicator ID pour debug */}
      <div className="absolute top-2 right-12 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
        #{member.id}
      </div>

      {/* Bouton flottant d'ajout - Mobile First */}
      <button
        onClick={handleAddNew}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors z-10"
        aria-label="Ajouter une cotisation"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default function MembersPageMobile() {
  // États locaux pour l'interface
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<keyof typeof MemberStatus | 'ALL'>('ALL');
  const [roleFilter, setRoleFilter] = useState<keyof typeof MemberRole | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Données fictives des membres
  const members: MemberType[] = [
    {
      id: '1',
      firstName: 'Mamadou',
      lastName: 'Diallo',
      email: 'mamadou.diallo@email.com',
      phone: '+224 123 456 789',
      role: MemberRole.PRESIDENT,
      status: MemberStatus.ACTIVE,
      joinDate: new Date('2023-01-15'),
      associationId: '1'
    },
    {
      id: '2',
      firstName: 'Fatou',
      lastName: 'Camara',
      email: 'fatou.camara@email.com',
      phone: '+224 987 654 321',
      role: MemberRole.SECRETARY,
      status: MemberStatus.ACTIVE,
      joinDate: new Date('2023-02-20'),
      associationId: '1'
    },
    {
      id: '3',
      firstName: 'Ibrahima',
      lastName: 'Bah',
      email: 'ibrahima.bah@email.com',
      phone: '+224 555 123 456',
      role: MemberRole.TREASURER,
      status: MemberStatus.ACTIVE,
      joinDate: new Date('2023-03-10'),
      associationId: '1'
    },
    {
      id: '4',
      firstName: 'Aissatou',
      lastName: 'Sow',
      email: 'aissatou.sow@email.com',
      phone: '+224 777 888 999',
      role: MemberRole.MEMBER,
      status: MemberStatus.SUSPENDED,
      joinDate: new Date('2023-04-05'),
      associationId: '1'
    },
    {
      id: '5',
      firstName: 'Oumar',
      lastName: 'Keita',
      email: 'oumar.keita@email.com',
      phone: '+224 666 777 888',
      role: MemberRole.MEMBER,
      status: MemberStatus.ACTIVE,
      joinDate: new Date('2023-05-12'),
      associationId: '1'
    }
  ];

  // Stats basées sur les données
  const total = members.length;
  const active = members.filter(m => m.status === MemberStatus.ACTIVE).length;
  const suspended = members.filter(m => m.status === MemberStatus.SUSPENDED).length;
  const inactive = members.filter(m => m.status === MemberStatus.INACTIVE).length;

  const filteredMembers = members.filter(member => {
    const fullName = `${member.firstName} ${member.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(search.toLowerCase()) ||
                         member.email.toLowerCase().includes(search.toLowerCase()) ||
                         member.phone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || member.status === statusFilter;
    const matchesRole = roleFilter === 'ALL' || member.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleEdit = (member: MemberType) => {
    console.log('Modifier membre:', member);
    // TODO: Ouvrir modal d'édition
  };

  const handleDelete = (id: string) => {
    console.log('Supprimer membre:', id);
    // TODO: Ouvrir modal de confirmation
  };

  const handleView = (member: MemberType) => {
    console.log('Voir membre:', member);
    // TODO: Ouvrir modal de détails
  };

  const handleAddNew = () => {
    console.log('Ajouter nouveau membre');
    // TODO: Ouvrir modal d'ajout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête décoré avec couleur orange */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-orange-500">
            Membres
          </h1>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Statistiques résumé */}
        <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
          <p className="text-gray-700 font-medium">
            {total} membre{total > 1 ? 's' : ''} • {active} actif{active > 1 ? 's' : ''}
          </p>
        </div>
        {/* Stats en grille compacte - Mobile First */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => setStatusFilter('ALL')}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all hover:bg-gray-50 ${
              statusFilter === 'ALL' ? 'ring-2 ring-orange-500' : ''
            }`}
            aria-label="Afficher tous les membres"
          >
            <div className="text-xs text-gray-500 mb-1">Total</div>
            <div className="text-xl font-bold text-gray-900">{total}</div>
          </button>
          
          <button 
            onClick={() => setStatusFilter(statusFilter === MemberStatus.ACTIVE ? 'ALL' : MemberStatus.ACTIVE)}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
              statusFilter === MemberStatus.ACTIVE ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div className="text-xs text-green-600 mb-1">✅ Actifs</div>
            <div className="text-xl font-bold text-green-700">{active}</div>
          </button>
          
          <button 
            onClick={() => setStatusFilter(statusFilter === MemberStatus.SUSPENDED ? 'ALL' : MemberStatus.SUSPENDED)}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
              statusFilter === MemberStatus.SUSPENDED ? 'ring-2 ring-yellow-500' : ''
            }`}
          >
            <div className="text-xs text-orange-600 mb-1">⏸️ Suspendus</div>
            <div className="text-xl font-bold text-orange-700">{suspended}</div>
          </button>
          
          <button 
            onClick={() => setStatusFilter(statusFilter === MemberStatus.INACTIVE ? 'ALL' : MemberStatus.INACTIVE)}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
              statusFilter === MemberStatus.INACTIVE ? 'ring-2 ring-red-500' : ''
            }`}
          >
            <div className="text-xs text-red-600 mb-1">❌ Inactifs</div>
            <div className="text-xl font-bold text-red-700">{inactive}</div>
          </button>
        </div>

        {/* Répartition par rôles - Design moderne mobile */}
        <div className="bg-gradient-to-r from-violet-600 to-orange-600 rounded-xl p-4 mb-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Répartition par rôles</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Bureau: {members.filter(m => m.role !== MemberRole.MEMBER).length}</div>
            <div>Membres: {members.filter(m => m.role === MemberRole.MEMBER).length}</div>
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un membre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl transition-all ${
              showFilters ? 'bg-orange-100 text-orange-700' : 'bg-white text-gray-600'
            } border border-gray-200`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Liste des membres */}
        {members.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun membre</h3>
            <p className="text-gray-600 mb-6">Commencez par ajouter le premier membre</p>
            <button 
              onClick={handleAddNew}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-medium"
            >
              Ajouter un membre
            </button>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
            <p className="text-gray-600 mb-4">
              Aucun membre ne correspond à vos critères
            </p>
            <button 
              onClick={() => { setSearch(''); setStatusFilter('ALL'); setRoleFilter('ALL'); }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMembers.map(member => (
              <MemberCard 
                key={member.id}
                member={member}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bouton flottant d'ajout - Mobile First */}
      <button
        onClick={handleAddNew}
        className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors z-10"
        aria-label="Ajouter un membre"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
