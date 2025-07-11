import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import type { MemberType, MemberRole as MemberRoleType, MemberStatus as MemberStatusType } from '../types';
import { MemberRole, MemberStatus } from '../types';

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de la page */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Gestion des membres
            </h1>
            <p className="text-gray-600">
              Gérez les membres de votre association
            </p>
          </div>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Ajouter un membre</span>
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tous les rôles</option>
            <option value={MemberRole.PRESIDENT}>Président</option>
            <option value={MemberRole.VICE_PRESIDENT}>Vice-président</option>
            <option value={MemberRole.SECRETARY}>Secrétaire</option>
            <option value={MemberRole.TREASURER}>Trésorier</option>
            <option value={MemberRole.MEMBER}>Membre</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value={MemberStatus.ACTIVE}>Actif</option>
            <option value={MemberStatus.SUSPENDED}>Suspendu</option>
            <option value={MemberStatus.INACTIVE}>Inactif</option>
          </select>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      {/* Tableau des membres */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'adhésion
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.email}</div>
                    <div className="text-sm text-gray-500">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {getRoleLabel(member.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                      {getStatusLabel(member.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.joinDate.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-purple-600 hover:text-purple-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-sm px-6 py-3 mt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredMembers.length}</span> sur <span className="font-medium">{members.length}</span> membres
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
              Précédent
            </button>
            <button className="px-3 py-1 text-sm bg-purple-500 text-white rounded disabled:opacity-50">
              1
            </button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
