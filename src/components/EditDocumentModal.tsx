import React, { useState, useEffect } from 'react';
import { X, Save, Upload, FileText, FileSpreadsheet, FileImage, User, Calendar, AlertCircle } from 'lucide-react';
import { DocumentTypeEnum, type DocumentType } from '../types';

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentType;
  onSave: (data: Partial<DocumentType>) => void;
  isLoading?: boolean;
}

export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  isOpen,
  onClose,
  document,
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: DocumentTypeEnum.OTHER as DocumentTypeEnum,
    uploadedBy: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialiser le formulaire avec les données du document
  useEffect(() => {
    if (document && isOpen) {
      setFormData({
        name: document.name,
        type: document.type,
        uploadedBy: document.uploadedBy,
      });
    }
    setErrors({});
  }, [document, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du document est requis';
    }

    if (!formData.uploadedBy.trim()) {
      newErrors.uploadedBy = 'Le nom de l\'utilisateur est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedData: Partial<DocumentType> = {
        name: formData.name.trim(),
        type: formData.type,
        uploadedBy: formData.uploadedBy.trim(),
      };
      onSave(updatedData);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              {getFileIcon(document.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Modifier le document</h2>
              <p className="text-sm text-gray-500">ID: #{document.id}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Informations non modifiables */}
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Informations du fichier</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Taille:</span>
              <p className="font-medium text-blue-900">{formatFileSize(document.size)}</p>
            </div>
            <div>
              <span className="text-blue-700">Téléchargé le:</span>
              <p className="font-medium text-blue-900">{formatDate(document.uploadDate)}</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Nom du document */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Nom du document *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du document..."
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isLoading}
                required
              />
              {errors.name && (
                <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Type de document */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4" />
                Type de document
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentTypeEnum })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={isLoading}
              >
                <option value={DocumentTypeEnum.PV}>📋 Procès-verbal</option>
                <option value={DocumentTypeEnum.FINANCIAL_REPORT}>💰 Rapport financier</option>
                <option value={DocumentTypeEnum.STATUTES}>📜 Statuts</option>
                <option value={DocumentTypeEnum.OTHER}>📁 Autre</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Sélectionnez le type qui correspond le mieux à ce document
              </p>
            </div>

            {/* Auteur */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Téléchargé par *
              </label>
              <input
                type="text"
                value={formData.uploadedBy}
                onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                placeholder="Nom de l'utilisateur..."
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.uploadedBy ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isLoading}
                required
              />
              {errors.uploadedBy && (
                <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.uploadedBy}
                </p>
              )}
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Note importante</span>
              </div>
              <p className="text-yellow-900 text-sm">
                La modification ne change que les métadonnées du document. 
                Le fichier original reste inchangé.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Modification...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Modifier
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
