import React, { useState, useEffect } from 'react';
import { X, Plus, Upload, FileText, User, AlertCircle, File } from 'lucide-react';
import { DocumentTypeEnum } from '../types';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { file: File; name: string; type: DocumentTypeEnum; uploadedBy: string }) => void;
  isLoading?: boolean;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: DocumentTypeEnum.OTHER as DocumentTypeEnum,
    uploadedBy: '',
    file: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        type: DocumentTypeEnum.OTHER,
        uploadedBy: '',
        file: null,
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.file) {
      newErrors.file = 'Veuillez sélectionner un fichier';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du document est requis';
    }

    if (!formData.uploadedBy.trim()) {
      newErrors.uploadedBy = 'Votre nom est requis';
    }

    // Validation de la taille du fichier (max 10MB)
    if (formData.file && formData.file.size > 10 * 1024 * 1024) {
      newErrors.file = 'Le fichier ne peut pas dépasser 10 MB';
    }

    // Validation du type de fichier
    if (formData.file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      if (!allowedTypes.includes(formData.file.type)) {
        newErrors.file = 'Type de fichier non autorisé. Formats acceptés : PDF, Excel, Word, Images (JPG, PNG, GIF)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && formData.file) {
      onSave({
        file: formData.file,
        name: formData.name.trim(),
        type: formData.type,
        uploadedBy: formData.uploadedBy.trim(),
      });
    }
  };

  const handleFileChange = (file: File) => {
    setFormData(prev => ({
      ...prev,
      file,
      // Auto-remplir le nom si vide
      name: prev.name || file.name
    }));
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Nouveau document</h2>
              <p className="text-sm text-gray-500">Télécharger un nouveau fichier</p>
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

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Zone de téléchargement */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4" />
                Fichier à télécharger *
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                  dragActive 
                    ? 'border-orange-500 bg-orange-50' 
                    : errors.file 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  disabled={isLoading}
                />
                
                {formData.file ? (
                  <div className="space-y-2">
                    <File className="w-8 h-8 text-green-500 mx-auto" />
                    <p className="font-medium text-green-700">{formData.file.name}</p>
                    <p className="text-sm text-green-600">{formatFileSize(formData.file.size)}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, file: null }));
                      }}
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      Changer de fichier
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-gray-600">
                      <span className="font-medium">Cliquez pour télécharger</span> ou glissez-déposez
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, Excel, Word, Images (max. 10 MB)
                    </p>
                  </div>
                )}
              </div>
              {errors.file && (
                <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.file}
                </p>
              )}
            </div>

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
              <p className="text-xs text-gray-500 mt-1">
                Par défaut, le nom du fichier sera utilisé
              </p>
            </div>

            {/* Type de document */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
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
                Votre nom *
              </label>
              <input
                type="text"
                value={formData.uploadedBy}
                onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                placeholder="Votre nom et prénom..."
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

            {/* Information sur la sécurité */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">À propos de vos documents</span>
              </div>
              <p className="text-blue-900 text-sm">
                Vos documents sont stockés de manière sécurisée et ne sont accessibles 
                qu'aux membres autorisés de votre association.
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
              disabled={isLoading || !formData.file}
              className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Upload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Télécharger
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
