import React, { useState, useEffect } from 'react';
import { X, Save, Upload, FileText, Tag, AlertCircle } from 'lucide-react';
import { DocumentTypeEnum, type DocumentType } from '../types';

interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentType | null;
  onSave: (document: Partial<DocumentType>) => void;
  isLoading?: boolean;
}

export const DocumentFormModal: React.FC<DocumentFormModalProps> = ({
  isOpen,
  onClose,
  document,
  onSave,
  isLoading = false
}) => {
  // États du formulaire
  const [formData, setFormData] = useState({
    name: '',
    type: DocumentTypeEnum.PV as DocumentTypeEnum,
    description: '',
    size: 0,
    mimeType: '',
    file: null as File | null
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialiser le formulaire avec les données du document existant
  useEffect(() => {
    if (document) {
      setFormData({
        name: document.name,
        type: document.type,
        description: '',
        size: document.size,
        mimeType: '',
        file: null
      });
    } else {
      // Réinitialiser pour nouveau
      setFormData({
        name: '',
        type: DocumentTypeEnum.PV,
        description: '',
        size: 0,
        mimeType: '',
        file: null
      });
    }
    setErrors({});
  }, [document, isOpen]);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du document est requis';
    }

    if (!document && !formData.file) {
      newErrors.file = 'Veuillez sélectionner un fichier';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion du changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        file,
        name: formData.name || file.name.split('.')[0],
        size: file.size,
        mimeType: file.type
      });
    }
  };

  // Gestion de la soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isLoading) return;

    const documentData: Partial<DocumentType> = {
      name: formData.name.trim(),
      type: formData.type,
      size: formData.size
    };

    // Ajouter le fichier si c'est un nouveau document
    if (formData.file) {
      // Dans une vraie implémentation, on uploadrait le fichier ici
      // Pour l'instant, on simule avec l'URL
      documentData.url = `uploads/${formData.file.name}`;
    }

    onSave(documentData);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!document;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center">
      {/* Modal mobile - glisse depuis le bas */}
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Modifier le document' : 'Nouveau document'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Corps du formulaire */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Nom du document */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Nom du document
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Nom du document"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Type de document */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4" />
                Type de document
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentTypeEnum })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                disabled={isLoading}
              >
                <option value={DocumentTypeEnum.PV}>Procès-verbal</option>
                <option value={DocumentTypeEnum.FINANCIAL_REPORT}>Rapport financier</option>
                <option value={DocumentTypeEnum.STATUTES}>Statuts</option>
                <option value={DocumentTypeEnum.OTHER}>Autre</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Description (optionnel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
                placeholder="Description du document..."
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Upload de fichier (seulement pour les nouveaux documents) */}
            {!isEditing && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4" />
                  Fichier
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                    errors.file ? 'border-red-300' : 'border-gray-200'
                  }`}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"
                  disabled={isLoading}
                />
                {errors.file && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.file}
                  </p>
                )}
                {formData.file && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Fichier sélectionné:</strong> {formData.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Taille: {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditing ? 'Modification...' : 'Upload...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? 'Modifier' : 'Télécharger'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
