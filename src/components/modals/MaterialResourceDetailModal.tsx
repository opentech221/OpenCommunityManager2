import React from 'react';
import { X, Package, MapPin, User, Calendar, DollarSign, FileText, Wrench, Award } from 'lucide-react';
import type { MaterialResourceType, MaterialCategory } from '../../types';

interface MaterialResourceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (resource: MaterialResourceType) => void;
  resource: MaterialResourceType | null;
}

const MaterialResourceDetailModal: React.FC<MaterialResourceDetailModalProps> = ({ isOpen, onClose, onEdit, resource }) => {
  if (!isOpen || !resource) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryLabel = (category: MaterialCategory) => {
    const labels: Record<MaterialCategory, string> = {
      INFORMATIQUE: 'Informatique',
      MOBILIER: 'Mobilier',
      AUDIOVISUEL: 'Audiovisuel',
      TRANSPORT: 'Transport',
      OUTILLAGE: 'Outillage',
      SPORT: 'Sport',
      CUISINE: 'Cuisine',
      DECORATION: 'Décoration',
      AUTRE: 'Autre'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: MaterialCategory) => {
    const colors: Record<MaterialCategory, string> = {
      INFORMATIQUE: 'bg-blue-100 text-blue-800',
      MOBILIER: 'bg-green-100 text-green-800',
      AUDIOVISUEL: 'bg-purple-100 text-purple-800',
      TRANSPORT: 'bg-red-100 text-red-800',
      OUTILLAGE: 'bg-gray-100 text-gray-800',
      SPORT: 'bg-yellow-100 text-yellow-800',
      CUISINE: 'bg-orange-100 text-orange-800',
      DECORATION: 'bg-pink-100 text-pink-800',
      AUTRE: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT':
        return 'bg-green-100 text-green-800';
      case 'BON':
        return 'bg-blue-100 text-blue-800';
      case 'CORRECT':
        return 'bg-yellow-100 text-yellow-800';
      case 'MAUVAIS':
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
              <Package className="w-5 h-5 mr-2 text-orange-600" />
              Détails du matériel
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
          {/* En-tête avec icône et nom */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{resource.name}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(resource.category)} mt-2`}>
                {getCategoryLabel(resource.category)}
              </span>
            </div>
          </div>

          {/* Informations générales */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Informations générales
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Disponibilité</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(resource.availability)}`}>
                  {resource.availability}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">État</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(resource.condition)}`}>
                  <Award className="w-3 h-3 mr-1" />
                  {resource.condition}
                </span>
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Localisation
            </h4>
            <p className="text-gray-900">{resource.location}</p>
          </div>

          {/* Responsable */}
          {resource.responsible && (
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Responsable
              </h4>
              <p className="text-gray-900">{resource.responsible}</p>
            </div>
          )}

          {/* Valeur */}
          {resource.currentValue && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
                Valeur actuelle
              </h4>
              <p className="text-lg font-bold text-gray-900">{resource.currentValue.toLocaleString('fr-FR')} €</p>
              {resource.purchasePrice && (
                <p className="text-sm text-gray-600 mt-1">
                  Prix d'achat: {resource.purchasePrice.toLocaleString('fr-FR')} €
                </p>
              )}
            </div>
          )}

          {/* Description */}
          {resource.description && (
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Description
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap">{resource.description}</p>
            </div>
          )}

          {/* Informations d'achat et garantie */}
          {(resource.purchaseDate || resource.warranty) && (
            <div className="bg-indigo-50 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                Informations d'achat et garantie
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resource.purchaseDate && (
                  <div>
                    <p className="text-sm text-gray-500">Date d'achat</p>
                    <p className="text-gray-900">{formatDate(resource.purchaseDate)}</p>
                  </div>
                )}
                {resource.warranty && (
                  <div>
                    <p className="text-sm text-gray-500">Garantie jusqu'au</p>
                    <p className="text-gray-900">{formatDate(resource.warranty)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Maintenance */}
          {(resource.lastMaintenanceDate || resource.nextMaintenanceDate) && (
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-red-600" />
                Maintenance
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resource.lastMaintenanceDate && (
                  <div>
                    <p className="text-sm text-gray-500">Dernière maintenance</p>
                    <p className="text-gray-900">{formatDate(resource.lastMaintenanceDate)}</p>
                  </div>
                )}
                {resource.nextMaintenanceDate && (
                  <div>
                    <p className="text-sm text-gray-500">Prochaine maintenance</p>
                    <p className="text-gray-900">{formatDate(resource.nextMaintenanceDate)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Numéro de série */}
          {resource.serialNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                Numéro de série
              </h4>
              <p className="font-mono text-gray-900">{resource.serialNumber}</p>
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

export default MaterialResourceDetailModal;
