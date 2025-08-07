import React from 'react';
import { X, User, Mail, Phone, Briefcase, Award, Calendar, FileText, Clock } from 'lucide-react';
import type { HumanResourceType } from '../../types';

interface HumanResourceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (resource: HumanResourceType) => void;
  resource: HumanResourceType | null;
}

const HumanResourceDetailModal: React.FC<HumanResourceDetailModalProps> = ({ isOpen, onClose, onEdit, resource }) => {
  if (!isOpen || !resource) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800';
      case 'OCCUPÉ':
        return 'bg-yellow-100 text-yellow-800';
      case 'INDISPONIBLE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-orange-600" />
              Détails de la personne
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
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {resource.firstName} {resource.lastName}
              </h3>
              <p className="text-lg text-gray-600">{resource.position}</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(resource.availability)} mt-2`}>
                <Clock className="w-4 h-4 mr-1" />
                {resource.availability}
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
                    href={`mailto:${resource.email}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {resource.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <a 
                    href={`tel:${resource.phone}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {resource.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Informations professionnelles
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Poste/Fonction</p>
                <p className="font-medium text-gray-900">{resource.position}</p>
              </div>
              {resource.experience && (
                <div>
                  <p className="text-sm text-gray-500">Expérience</p>
                  <p className="text-gray-900">{resource.experience}</p>
                </div>
              )}
            </div>
          </div>

          {/* Compétences */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Compétences
            </h4>
            <div className="flex flex-wrap gap-2">
              {resource.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {resource.notes && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-yellow-600" />
                Notes
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap">{resource.notes}</p>
            </div>
          )}

          {/* Informations système */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-600" />
              Informations système
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date d'ajout</p>
                <p className="font-medium text-gray-900">{formatDate(resource.addedDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-mono text-sm text-gray-600">{resource.id}</p>
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
                onEdit(resource);
                onClose();
              }
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default HumanResourceDetailModal;
