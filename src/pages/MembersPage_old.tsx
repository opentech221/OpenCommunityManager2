import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Phone, Mail, Calendar, Users, Download, FileText, DollarSign, Eye } from 'lucide-react';
import type { MemberType, MemberRole as MemberRoleType, MemberStatus as MemberStatusType } from '../types';
import { MemberRole, MemberStatus } from '../types';
import { useMembers } from '../hooks/useMembers';
import { MemberForm } from '../components/MemberForm';
import AddMemberModal from '../components/modals/AddMemberModal';
import EditMemberModal from '../components/modals/EditMemberModal';
import MemberDetailModal from '../components/modals/MemberDetailModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<keyof typeof MemberStatus | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMember, setEditMember] = useState<MemberType | undefined>(undefined);
  const [feedback, setFeedback] = useState<string>('');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const { members, addMember, updateMember, deleteMember } = useMembers();

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

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesStatus = statusFilter === 'ALL' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats pour les boutons
  const total = members.length;
  const active = members.filter(m => m.status === MemberStatus.ACTIVE).length;
  const suspended = members.filter(m => m.status === MemberStatus.SUSPENDED).length;
  const inactive = members.filter(m => m.status === MemberStatus.INACTIVE).length;

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

  // Actions CRUD
  const handleAddMember = async (member: Omit<MemberType, 'id'>) => {
    await addMember(member);
    setFeedback('Membre ajouté avec succès');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleEditMember = async (member: Omit<MemberType, 'id'>) => {
    if (editMember) {
      await updateMember(editMember.id, member);
      setEditMember(undefined);
    }
    setShowForm(false);
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce membre ?')) {
      await deleteMember(id);
      setFeedback('Membre supprimé avec succès');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-purple-900 p-0 sm:p-0 md:p-0 lg:p-0">
      {feedback && (
        <div data-testid="members-feedback" className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50">
          {feedback}
        </div>
      )}
      {/* En-tête Mobile-First */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-6 sm:px-6 lg:px-8 border-l-4 border-orange-500 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 data-testid="members-title" className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
              Gestion des Membres
            </h1>
          </div>
          <button
            data-testid="add-member-btn"
            className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-500 transition-colors flex items-center space-x-2 text-sm sm:text-base"
            onClick={() => { setShowForm(true); setEditMember(undefined); }}
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
      <div className="bg-white px-4 py-4 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button 
            className={`bg-purple-100 rounded-lg p-3 shadow hover:bg-purple-200 transition-colors border ${
              statusFilter === 'ALL' ? 'ring-2 ring-violet-500' : ''
            }`}
            onClick={() => setStatusFilter('ALL')}
            aria-label="Afficher tous les membres"
          >
            <div className="text-lg sm:text-xl font-bold text-purple-700">{total}</div>
            <div className="text-xs sm:text-sm text-gray-500">Total</div>
          </button>
          <button 
            className={`bg-green-100 rounded-lg p-3 shadow hover:bg-green-200 transition-colors ${
              statusFilter === MemberStatus.ACTIVE ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === MemberStatus.ACTIVE ? 'ALL' : MemberStatus.ACTIVE)}
            aria-label="Filtrer les membres actifs"
          >
            <div className="text-lg sm:text-xl font-bold text-green-600">{active}</div>
            <div className="text-xs sm:text-sm text-green-600">Actifs</div>
          </button>
          <button 
            className={`bg-yellow-100 rounded-lg p-3 shadow hover:bg-yellow-200 transition-colors ${
              statusFilter === MemberStatus.SUSPENDED ? 'ring-2 ring-yellow-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === MemberStatus.SUSPENDED ? 'ALL' : MemberStatus.SUSPENDED)}
            aria-label="Filtrer les membres suspendus"
          >
            <div className="text-lg sm:text-xl font-bold text-yellow-600">{suspended}</div>
            <div className="text-xs sm:text-sm text-yellow-600">Suspendus</div>
          </button>
          <button 
            className={`bg-red-100 rounded-lg p-3 shadow hover:bg-red-200 transition-colors ${
              statusFilter === MemberStatus.INACTIVE ? 'ring-2 ring-red-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === MemberStatus.INACTIVE ? 'ALL' : MemberStatus.INACTIVE)}
            aria-label="Filtrer les membres inactifs"
          >
            <div className="text-lg sm:text-xl font-bold text-red-600">{inactive}</div>
            <div className="text-xs sm:text-sm text-red-600">Inactifs</div>
          </button>
        </div>
      </div>


      {/* Resultats et filtres mobiles */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          
        {/* Barre de recherche */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-violet-800" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

          {/* Bouton filtres mobile */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-purple-500 rounded-lg bg-purple-200 hover:bg-purple-300 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
            {(selectedRole !== 'all' || statusFilter !== 'ALL') && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Filtres actifs:</span>
                {selectedRole !== 'all' && (
                  <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    {getRoleLabel(selectedRole as MemberRoleType)}
                  </span>
                )}
                {statusFilter !== 'ALL' && (
                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {getStatusLabel(statusFilter as MemberStatusType)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-purple-100 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="block w-full px-3 py-2 border border-purple-500 bg-purple-200 hover:bg-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as keyof typeof MemberStatus | 'ALL')}
                  className="block w-full px-3 py-2 border border-purple-500 bg-purple-200 hover:bg-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value={MemberStatus.ACTIVE}>Actif</option>
                  <option value={MemberStatus.SUSPENDED}>Suspendu</option>
                  <option value={MemberStatus.INACTIVE}>Inactif</option>
                </select>
              </div>
            </div>
          )}
          {/* Liste des membres - Mobile First */}
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg">Aucun membre trouvé</div>
                <p className="text-gray-400 text-sm mt-2">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <div data-testid="members-list" className="space-y-3">
                {filteredMembers.map((member) => (
                  <div key={member.id} data-testid={`member-card-${member.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
                              <span>Adhéré le {member.joinDate ? new Date(member.joinDate).toLocaleDateString('fr-FR') : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            data-testid={`edit-member-btn-${member.id}`}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 bg-white rounded-md hover:bg-orange-100 transition-colors"
                            onClick={() => { setEditMember(member); setShowForm(true); }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </button>
                        </div>
                        <button
                          data-testid={`delete-member-btn-${member.id}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                          onClick={() => handleDeleteMember(member.id)}
                        >
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
        </div>
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
            <button className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded-md">
              1
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 border border-gray-300 rounded-md">
              Suivant
            </button>
          </div>
        </div>
      </div>
      {/* Modale ajout/édition membre */}
      <MemberForm
        isOpen={showForm}
        member={editMember}
        onClose={() => { setShowForm(false); setEditMember(undefined); }}
        onSave={editMember ? handleEditMember : handleAddMember}
      />

      {/* Bouton flottant avec menu d'actions */}
      <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
        {/* Menu d'actions (visible quand showFloatingMenu est true) */}
        {showFloatingMenu && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
            <button
              onClick={() => {
                setShowForm(true);
                setEditMember(undefined);
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Plus className="h-4 w-4 text-orange-600" />
              <span>Nouveau Membre</span>
            </button>
            
            <button
              onClick={() => {
                // Navigation vers cotisations
                window.location.href = '/cotisations';
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Voir Cotisations</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => {
                // Fonction d'export à implémenter
                console.log('Export des membres');
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Download className="h-4 w-4 text-blue-600" />
              <span>Exporter Liste</span>
            </button>
            
            <button
              onClick={() => {
                // Fonction de rapport à implémenter
                console.log('Générer rapport membres');
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <FileText className="h-4 w-4 text-purple-600" />
              <span>Rapport Adhésions</span>
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