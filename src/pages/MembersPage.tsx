import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Phone, Mail, Calendar } from 'lucide-react';
import type { MemberType, MemberRole as MemberRoleType, MemberStatus as MemberStatusType } from '../types';
import { MemberRole, MemberStatus } from '../types';

export default function MembersPageMobile() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
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

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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

  const getStatusColor = (status: MemberStatusType) => {
    switch (status) {
      case MemberStatus.ACTIVE: return 'bg-green-100 text-green-800';
      case MemberStatus.SUSPENDED: return 'bg-yellow-100 text-yellow-800';
      case MemberStatus.INACTIVE: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: MemberRoleType) => {
    switch (role) {
      case MemberRole.PRESIDENT: return 'bg-purple-100 text-purple-800';
      case MemberRole.VICE_PRESIDENT: return 'bg-blue-100 text-blue-800';
      case MemberRole.SECRETARY: return 'bg-green-100 text-green-800';
      case MemberRole.TREASURER: return 'bg-orange-100 text-orange-800';
      case MemberRole.MEMBER: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête Mobile-First */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Membres
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Gérez les membres de votre association
              </p>
            </div>
            <button className="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm sm:text-base">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Nouveau membre</span>
              <span className="sm:hidden">Nouveau</span>
            </button>
          </div>
          
          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-purple-600">{members.length}</div>
              <div className="text-xs sm:text-sm text-purple-600">Total</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-green-600">
                {members.filter(m => m.status === MemberStatus.ACTIVE).length}
              </div>
              <div className="text-xs sm:text-sm text-green-600">Actifs</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-yellow-600">
                {members.filter(m => m.status === MemberStatus.SUSPENDED).length}
              </div>
              <div className="text-xs sm:text-sm text-yellow-600">Suspendus</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-red-600">
                {members.filter(m => m.status === MemberStatus.INACTIVE).length}
              </div>
              <div className="text-xs sm:text-sm text-red-600">Inactifs</div>
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
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Bouton filtres mobile */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
            {(selectedRole !== 'all' || selectedStatus !== 'all') && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Filtres actifs:</span>
                {selectedRole !== 'all' && (
                  <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    {getRoleLabel(selectedRole as MemberRoleType)}
                  </span>
                )}
                {selectedStatus !== 'all' && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {getStatusLabel(selectedStatus as MemberStatusType)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="all">Tous les rôles</option>
                  <option value={MemberRole.PRESIDENT}>Président</option>
                  <option value={MemberRole.VICE_PRESIDENT}>Vice-président</option>
                  <option value={MemberRole.SECRETARY}>Secrétaire</option>
                  <option value={MemberRole.TREASURER}>Trésorier</option>
                  <option value={MemberRole.MEMBER}>Membre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value={MemberStatus.ACTIVE}>Actif</option>
                  <option value={MemberStatus.SUSPENDED}>Suspendu</option>
                  <option value={MemberStatus.INACTIVE}>Inactif</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Liste des membres - Mobile First */}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg">Aucun membre trouvé</div>
            <p className="text-gray-400 text-sm mt-2">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm sm:text-base">
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Informations principales */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {member.firstName} {member.lastName}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                              {getRoleLabel(member.role)}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                              {getStatusLabel(member.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Informations de contact */}
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Adhéré le {member.joinDate.toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </button>
                    </div>
                    <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination mobile */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{filteredMembers.length}</span> sur <span className="font-medium">{members.length}</span> membres
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
