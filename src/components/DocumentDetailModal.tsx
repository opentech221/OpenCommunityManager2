import React from 'react';
import { X, FileText, FileSpreadsheet, FileImage, Download, User, Calendar, HardDrive, Eye } from 'lucide-react';
import { DocumentTypeEnum, type DocumentType } from '../types';
import { formatDate } from '../utils';

interface DocumentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentType | null;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  isOpen,
  onClose,
  document
}) => {
  if (!isOpen || !document) return null;

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="w-6 h-6 text-blue-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: DocumentTypeEnum) => {
    switch (type) {
      case DocumentTypeEnum.PV:
        return 'Procès-verbal';
      case DocumentTypeEnum.FINANCIAL_REPORT:
        return 'Rapport financier';
      case DocumentTypeEnum.STATUTES:
        return 'Statuts';
      case DocumentTypeEnum.OTHER:
        return 'Autre';
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: DocumentTypeEnum) => {
    switch (type) {
      case DocumentTypeEnum.PV:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case DocumentTypeEnum.FINANCIAL_REPORT:
        return 'bg-green-100 text-green-800 border-green-200';
      case DocumentTypeEnum.STATUTES:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case DocumentTypeEnum.OTHER:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    // Simuler le téléchargement (à remplacer par la vraie URL)
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = () => {
    // Ouvrir dans un nouvel onglet pour prévisualisation
    window.open(document.url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header avec type de document */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              {getFileIcon(document.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Détails du document</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getTypeBadgeColor(document.type)}`}>
                  {getTypeLabel(document.type)}
                </span>
                <span className="text-sm text-gray-500">#{document.id}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Contenu principal */}
        <div className="p-6 space-y-6">
          {/* Nom du fichier */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              {getFileIcon(document.name)}
              <h3 className="font-semibold text-blue-900">Nom du fichier</h3>
            </div>
            <p className="text-blue-800 font-medium break-all">{document.name}</p>
          </div>

          {/* Informations du fichier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Taille */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Taille du fichier</span>
              </div>
              <p className="text-xl font-bold text-green-900">{formatFileSize(document.size)}</p>
            </div>

            {/* Type */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Type de document</span>
              </div>
              <p className="text-xl font-bold text-purple-900">{getTypeLabel(document.type)}</p>
            </div>
          </div>

          {/* Informations d'upload */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Informations d'upload
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Téléchargé par</span>
                </div>
                <p className="font-medium text-gray-900">{document.uploadedBy}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Date d'upload</span>
                </div>
                <p className="font-medium text-gray-900">{formatDate(document.uploadDate)}</p>
              </div>
            </div>
          </div>

          {/* Actions sur le document */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePreview}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Prévisualiser
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
            </div>
          </div>

          {/* Informations système */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Informations système</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">ID du document:</span>
                <p className="font-mono text-gray-700">{document.id}</p>
              </div>
              <div>
                <span className="text-gray-500">Association ID:</span>
                <p className="font-mono text-gray-700">{document.associationId}</p>
              </div>
              <div>
                <span className="text-gray-500">URL:</span>
                <p className="font-mono text-gray-700 truncate">{document.url}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
