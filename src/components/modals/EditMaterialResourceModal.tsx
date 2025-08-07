import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, MapPin, User, Calendar, FileText, Wrench } from 'lucide-react';
import type { MaterialResourceType, MaterialCategory } from '../../types';
import { MaterialCategory as MaterialCategoryEnum } from '../../types';

interface EditMaterialResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (resource: MaterialResourceType) => void;
  resource: MaterialResourceType | null;
}

const EditMaterialResourceModal: React.FC<EditMaterialResourceModalProps> = ({ isOpen, onClose, onUpdate, resource }) => {
  const [formData, setFormData] = useState({
    name: resource?.name || '',
    category: (resource?.category || MaterialCategoryEnum.AUTRE) as MaterialCategory,
    description: resource?.description || '',
    condition: (resource?.condition || 'BON') as 'EXCELLENT' | 'BON' | 'MOYEN' | 'MAUVAIS',
    location: resource?.location || '',
    purchaseDate: resource?.purchaseDate ? resource.purchaseDate.toISOString().split('T')[0] : '',
    purchasePrice: resource?.purchasePrice?.toString() || '',
    currentValue: resource?.currentValue?.toString() || '',
    responsible: resource?.responsible || '',
    availability: (resource?.availability || 'DISPONIBLE') as 'DISPONIBLE' | 'UTILISÉ' | 'EN_MAINTENANCE' | 'INDISPONIBLE',
    serialNumber: resource?.serialNumber || '',
    warranty: resource?.warranty ? resource.warranty.toISOString().split('T')[0] : '',
    notes: resource?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Réinitialiser le formulaire quand la ressource change
  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name,
        category: resource.category,
        description: resource.description,
        condition: resource.condition,
        location: resource.location,
        purchaseDate: resource.purchaseDate ? resource.purchaseDate.toISOString().split('T')[0] : '',
        purchasePrice: resource.purchasePrice?.toString() || '',
        currentValue: resource.currentValue?.toString() || '',
        responsible: resource.responsible || '',
        availability: resource.availability,
        serialNumber: resource.serialNumber || '',
        warranty: resource.warranty ? resource.warranty.toISOString().split('T')[0] : '',
        notes: resource.notes || ''
      });
      setErrors({});
    }
  }, [resource]);

  if (!isOpen || !resource) return null;

  const getCategoryLabel = (category: MaterialCategory) => {
    const labels = {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.location.trim()) newErrors.location = 'L\'emplacement est requis';
    
    if (formData.purchasePrice && isNaN(Number(formData.purchasePrice))) {
      newErrors.purchasePrice = 'Le prix d\'achat doit être un nombre';
    }
    if (formData.currentValue && isNaN(Number(formData.currentValue))) {
      newErrors.currentValue = 'La valeur actuelle doit être un nombre';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onUpdate({
      ...resource,
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      condition: formData.condition,
      location: formData.location.trim(),
      purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : resource.purchaseDate,
      purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : resource.purchasePrice,
      currentValue: formData.currentValue ? Number(formData.currentValue) : resource.currentValue,
      responsible: formData.responsible.trim() || undefined,
      availability: formData.availability,
      serialNumber: formData.serialNumber.trim() || undefined,
      warranty: formData.warranty ? new Date(formData.warranty) : resource.warranty,
      notes: formData.notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Modifier {resource.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Package className="w-4 h-4 inline mr-1" />
                Nom du matériel *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ordinateur portable HP"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as MaterialCategory })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(MaterialCategoryEnum).map(category => (
                  <option key={category} value={category}>{getCategoryLabel(category)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 inline mr-1" />
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
              placeholder="Description détaillée du matériel..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* État et emplacement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Wrench className="w-4 h-4 inline mr-1" />
                État
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as 'EXCELLENT' | 'BON' | 'MOYEN' | 'MAUVAIS' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="EXCELLENT">Excellent</option>
                <option value="BON">Bon</option>
                <option value="MOYEN">Moyen</option>
                <option value="MAUVAIS">Mauvais</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Emplacement *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Bureau principal"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Disponibilité et responsable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disponibilité
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value as 'DISPONIBLE' | 'UTILISÉ' | 'EN_MAINTENANCE' | 'INDISPONIBLE' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="DISPONIBLE">Disponible</option>
                <option value="UTILISÉ">Utilisé</option>
                <option value="EN_MAINTENANCE">En maintenance</option>
                <option value="INDISPONIBLE">Indisponible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Responsable
              </label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nom du responsable"
              />
            </div>
          </div>

          {/* Informations financières */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Prix d'achat (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.purchasePrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.purchasePrice && <p className="text-red-500 text-xs mt-1">{errors.purchasePrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Valeur actuelle (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.currentValue ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.currentValue && <p className="text-red-500 text-xs mt-1">{errors.currentValue}</p>}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date d'achat
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fin de garantie
              </label>
              <input
                type="date"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Numéro de série */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de série
            </label>
            <input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Numéro de série ou référence"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 inline mr-1" />
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Informations complémentaires..."
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaterialResourceModal;
