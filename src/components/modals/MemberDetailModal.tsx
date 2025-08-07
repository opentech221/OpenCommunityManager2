import React from 'react';
import { X, User, Mail, Phone, Briefcase, Award, Calendar, FileText, Clock, Crown, Shield } from 'lucide-react';
import type { MemberType } from '../../types';
import { MemberRole, MemberStatus } from '../../types';

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (member: MemberType) => void;
  member: MemberType | null;
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ isOpen, onClose, onEdit, member }) => {
  if (!isOpen || !member) return null;

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'Date non renseignée';
    
    let dateObj: Date;
    
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      return 'Date invalide';
    }
    
    // Vérifier si la date est valide
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case MemberRole.PRESIDENT:
        return Crown;
      case MemberRole.VICE_PRESIDENT:
        return Shield;
      case MemberRole.SECRETARY:
        return FileText;
      case MemberRole.TREASURER:
        return Award;
      default:
        return User;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      [MemberRole.PRESIDENT]: 'Président(e)',
      [MemberRole.VICE_PRESIDENT]: 'Vice-Président(e)',
      [MemberRole.SECRETARY]: 'Secrétaire',
      [MemberRole.TREASURER]: 'Trésorier(ère)',
      [MemberRole.MEMBER]: 'Membre'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case MemberStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case MemberStatus.SUSPENDED:
        return 'bg-yellow-100 text-yellow-800';
      case MemberStatus.INACTIVE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      [MemberStatus.ACTIVE]: 'Actif',
      [MemberStatus.SUSPENDED]: 'Suspendu',
      [MemberStatus.INACTIVE]: 'Inactif'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const RoleIcon = getRoleIcon(member.role);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Détails du membre
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* En-tête avec avatar et nom */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
              <RoleIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-lg text-gray-600">{getRoleLabel(member.role)}</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)} mt-2`}>
                <Clock className="w-4 h-4 mr-1" />
                {getStatusLabel(member.status)}
              </span>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a 
                    href={`mailto:${member.email}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <a 
                    href={`tel:${member.phone}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {member.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Rôle et responsabilités */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
              Rôle dans l'association
            </h4>
            <div className="flex items-center space-x-3">
              <RoleIcon className="w-8 h-8 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900 text-lg">{getRoleLabel(member.role)}</p>
                <p className="text-sm text-gray-600">
                  {member.role === MemberRole.PRESIDENT && "Dirige l'association et représente légalement l'organisation"}
                  {member.role === MemberRole.VICE_PRESIDENT && "Assiste le président et peut le remplacer en cas d'absence"}
                  {member.role === MemberRole.SECRETARY && "Rédige les procès-verbaux et gère la correspondance"}
                  {member.role === MemberRole.TREASURER && "Gère les finances et tient la comptabilité"}
                  {member.role === MemberRole.MEMBER && "Participe aux activités et aux décisions de l'association"}
                </p>
              </div>
            </div>
          </div>

          {/* Statut et adhésion */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Statut d'adhésion
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Statut actuel</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}>
                  {getStatusLabel(member.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Membre depuis</p>
                <p className="font-medium text-gray-900">{formatDate(member.joinDate)}</p>
              </div>
            </div>
          </div>

          {/* Informations système */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-600" />
              Informations système
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date d'inscription</p>
                <p className="font-medium text-gray-900">{formatDate(member.joinDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-mono text-sm text-gray-600">{member.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              if (onEdit) {
                onEdit(member);
                onClose();
              }
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
