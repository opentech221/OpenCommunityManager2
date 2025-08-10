import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Phone, Mail, Calendar, Users, Download, FileText, DollarSign, Crown, Shield, FileCheck, User } from 'lucide-react';
import type { MemberType, MemberRole as MemberRoleType, MemberStatus as MemberStatusType } from '../types';
import { MemberRole, MemberStatus } from '../types';
import { useMembers } from '../hooks/useMembers';
import AddMemberModal from '../components/modals/AddMemberModal';
import EditMemberModal from '../components/modals/EditMemberModal';
import MemberDetailModal from '../components/modals/MemberDetailModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

export default function MembersPage() {
  const {
    members,
    isLoading,
    addMember,
    updateMember,
    deleteMember
  } = useMembers();

  // Modal states
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<MemberType | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<MemberRoleType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<MemberStatusType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats pour les boutons
  const total = members.length;
  const active = members.filter(m => m.status === MemberStatus.ACTIVE).length;
  const suspended = members.filter(m => m.status === MemberStatus.SUSPENDED).length;
  const inactive = members.filter(m => m.status === MemberStatus.INACTIVE).length;

  // Modal handlers
  const handleViewMember = (member: MemberType) => {
    setSelectedMember(member);
    setIsDetailModalOpen(true);
  };

  const handleEditMember = (member: MemberType) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleDeleteMember = (member: MemberType) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const handleAddMember = async (memberData: Omit<MemberType, 'id' | 'joinDate'>) => {
    try {
      const newMember = {
        ...memberData,
        joinDate: new Date()
      };
      await addMember(newMember);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
    }
  };

  const handleUpdateMember = async (memberData: MemberType) => {
    try {
      await updateMember(memberData.id, memberData);
      setIsEditModalOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Erreur lors de la modification du membre:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    
    try {
      await deleteMember(memberToDelete.id);
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error);
    }
  };

  const getRoleIcon = (role: MemberRoleType) => {
    switch (role) {
      case MemberRole.PRESIDENT: return Crown;
      case MemberRole.VICE_PRESIDENT: return Shield;
      case MemberRole.SECRETARY: return FileCheck;
      case MemberRole.TREASURER: return DollarSign;
      case MemberRole.MEMBER: return User;
      default: return User;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des membres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-900 p-0 sm:p-0 md:p-0 lg:p-0">
      {/* En-tête Mobile-First */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-2 py-6 sm:px-3 lg:px-4 border-l-4 border-orange-500 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
              Gestion des Membres
            </h1>
          </div>
          <button
            className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm sm:text-base"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Nouveau membre</span>
            <span className="sm:hidden">Nouveau</span>
          </button>
        </div>
        <div className="mt-4 hidden md:block">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Gérez et développez votre communauté facilement
          </p>
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Adhésions simplifiées :</strong> Inscriptions et renouvellements automatisés
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Communication directe :</strong> Coordonnées et historique centralisés
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques avec boutons fonctionnels */}
      <div className="bg-white px-2 py-4 sm:px-3 lg:px-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button 
            className={`bg-purple-100 rounded-lg p-3 shadow hover:bg-purple-200 transition-colors border border-purple-500 ${
              statusFilter === 'all' ? 'ring-2 ring-violet-500' : ''
            }`}
            onClick={() => setStatusFilter('all')}
            aria-label="Afficher tous les membres"
          >
            <div className="text-lg sm:text-xl font-bold text-purple-700">{total}</div>
            <div className="text-xs sm:text-sm text-gray-500">Total</div>
          </button>
          <button 
            className={`bg-green-100 rounded-lg p-3 shadow hover:bg-green-200 border border-green-500 transition-colors ${
              statusFilter === MemberStatus.ACTIVE ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === MemberStatus.ACTIVE ? 'all' : MemberStatus.ACTIVE)}
            aria-label="Filtrer les membres actifs"
          >
            <div className="text-lg sm:text-xl font-bold text-green-600">{active}</div>
            <div className="text-xs sm:text-sm text-green-600">Actifs</div>
          </button>
          <button 
            className={`bg-yellow-100 rounded-lg p-3 shadow hover:bg-yellow-200 border border-yellow-500  transition-colors ${
              statusFilter === MemberStatus.SUSPENDED ? 'ring-2 ring-yellow-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === MemberStatus.SUSPENDED ? 'all' : MemberStatus.SUSPENDED)}
            aria-label="Filtrer les membres suspendus"
          >
            <div className="text-lg sm:text-xl font-bold text-yellow-600">{suspended}</div>
            <div className="text-xs sm:text-sm text-yellow-600">Suspendus</div>
          </button>
          <button 
            className={`bg-red-100 rounded-lg p-3 shadow hover:bg-red-200 border border-red-500 transition-colors ${
              statusFilter === MemberStatus.INACTIVE ? 'ring-2 ring-red-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === MemberStatus.INACTIVE ? 'all' : MemberStatus.INACTIVE)}
            aria-label="Filtrer les membres inactifs"
          >
            <div className="text-lg sm:text-xl font-bold text-red-600">{inactive}</div>
            <div className="text-xs sm:text-sm text-red-600">Inactifs</div>
          </button>
        </div>
      </div>

      {/* Section de recherche et filtres */}
      <div className="bg-white px-2 py-4 sm:px-3 lg:px-4 mb-6">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as MemberRoleType | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as MemberStatusType | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value={MemberStatus.ACTIVE}>Actif</option>
                  <option value={MemberStatus.SUSPENDED}>Suspendu</option>
                  <option value={MemberStatus.INACTIVE}>Inactif</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des membres */}
      <div className="bg-white px-2 py-6 sm:px-3 lg:px-4">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre trouvé</h3>
            <p className="text-gray-500">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? "Aucun membre ne correspond à vos critères de recherche."
                : "Commencez par ajouter votre premier membre."}
            </p>
            {(!searchTerm && roleFilter === 'all' && statusFilter === 'all') && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Ajouter un membre
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              return (
                <div
                  key={member.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${getRoleColor(member.role)}`}>
                        <RoleIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {member.firstName} {member.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{getRoleLabel(member.role)}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {getStatusLabel(member.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {member.email}
                    </div>
                    {member.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {member.phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Adhésion: {new Date(member.joinDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewMember(member)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditMember(member)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions en bas de page */}
      <div className="bg-white px-2 py-4 sm:px-3 lg:px-4 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-600">
            {filteredMembers.length} membre{filteredMembers.length > 1 ? 's' : ''} affiché{filteredMembers.length > 1 ? 's' : ''}
            {total !== filteredMembers.length && ` sur ${total} au total`}
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              Rapport
            </button>
          </div>
        </div>
      </div>

      {/* Modaux */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
      />

      {selectedMember && (
        <>
          <MemberDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            member={selectedMember}
            onEdit={() => {
              setIsDetailModalOpen(false);
              setIsEditModalOpen(true);
            }}
          />

          <EditMemberModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            member={selectedMember}
            onUpdate={handleUpdateMember}
          />
        </>
      )}

      {memberToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Supprimer le membre"
          message={`Êtes-vous sûr de vouloir supprimer ${memberToDelete.firstName} ${memberToDelete.lastName} ? Cette action est irréversible.`}
        />
      )}
    </div>
  );
}
