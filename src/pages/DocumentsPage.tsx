import React, { useState, useEffect } from 'react';
import {
  Upload,
  Download,
  Trash2,
  Search,
  Eye,
  Edit,
  Plus,
  FileText,
  FileSpreadsheet,
  FileImage
} from 'lucide-react';
import { DocumentTypeEnum, type DocumentType } from '../types';
import { formatDate } from '../utils';
import {
  DocumentDetailModal,
  EditDocumentModal,
  AddDocumentModal
} from '../components';

const DocumentsPage: React.FC = () => {
  // États locaux
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<DocumentTypeEnum | 'all'>('all');
  const [feedback, setFeedback] = useState('');
  
  // États pour les modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  // Données de démonstration (à remplacer par un hook useDocuments)
  const [localDocuments, setLocalDocuments] = useState<DocumentType[]>([
    {
      id: '1',
      name: 'PV_AG_2024.pdf',
      type: DocumentTypeEnum.PV,
      url: '/documents/pv_ag_2024.pdf',
      uploadDate: new Date('2024-01-15'),
      uploadedBy: 'Marie Dupont',
      associationId: 'assoc1',
      size: 1024000 // 1MB
    },
    {
      id: '2',
      name: 'Rapport_Financier_2023.pdf',
      type: DocumentTypeEnum.FINANCIAL_REPORT,
      url: '/documents/rapport_financier_2023.pdf',
      uploadDate: new Date('2024-01-10'),
      uploadedBy: 'Jean Martin',
      associationId: 'assoc1',
      size: 2048000 // 2MB
    },
    {
      id: '3',
      name: 'Statuts_Association.pdf',
      type: DocumentTypeEnum.STATUTES,
      url: '/documents/statuts.pdf',
      uploadDate: new Date('2023-12-01'),
      uploadedBy: 'Marie Dupont',
      associationId: 'assoc1',
      size: 512000 // 512KB
    },
    {
      id: '4',
      name: 'Liste_Materiel.xlsx',
      type: DocumentTypeEnum.OTHER,
      url: '/documents/liste_materiel.xlsx',
      uploadDate: new Date('2024-02-05'),
      uploadedBy: 'Pierre Dubois',
      associationId: 'assoc1',
      size: 256000 // 256KB
    }
  ]);

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

  // Statistiques
  const totalDocuments = localDocuments.length;
  const pvCount = localDocuments.filter(d => d.type === DocumentTypeEnum.PV).length;
  const financialReportCount = localDocuments.filter(d => d.type === DocumentTypeEnum.FINANCIAL_REPORT).length;
  const statutesCount = localDocuments.filter(d => d.type === DocumentTypeEnum.STATUTES).length;
  const otherCount = localDocuments.filter(d => d.type === DocumentTypeEnum.OTHER).length;
  
  // Calculs de taille
  const totalSize = localDocuments.reduce((sum, doc) => sum + doc.size, 0);
  const averageSize = totalDocuments > 0 ? totalSize / totalDocuments : 0;
  const largestDocument = localDocuments.reduce((max, doc) => doc.size > max.size ? doc : max, localDocuments[0] || { size: 0 });
  
  // Tailles par type
  const pvTotalSize = localDocuments.filter(d => d.type === DocumentTypeEnum.PV).reduce((sum, doc) => sum + doc.size, 0);
  const financeTotalSize = localDocuments.filter(d => d.type === DocumentTypeEnum.FINANCIAL_REPORT).reduce((sum, doc) => sum + doc.size, 0);
  const statutesTotalSize = localDocuments.filter(d => d.type === DocumentTypeEnum.STATUTES).reduce((sum, doc) => sum + doc.size, 0);
  const otherTotalSize = localDocuments.filter(d => d.type === DocumentTypeEnum.OTHER).reduce((sum, doc) => sum + doc.size, 0);

  // Documents filtrés
  const filteredDocuments = localDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                         doc.uploadedBy.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Utilitaires
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
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
        return 'bg-blue-100 text-blue-800';
      case DocumentTypeEnum.FINANCIAL_REPORT:
        return 'bg-green-100 text-green-800';
      case DocumentTypeEnum.STATUTES:
        return 'bg-purple-100 text-purple-800';
      case DocumentTypeEnum.OTHER:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handlers
  const handleAddDocument = (data: { file: File; name: string; type: DocumentTypeEnum; uploadedBy: string }) => {
    try {
      const newDocument: DocumentType = {
        id: (Date.now() + Math.random()).toString(),
        name: data.name,
        type: data.type,
        url: URL.createObjectURL(data.file), // Simuler l'URL
        uploadDate: new Date(),
        uploadedBy: data.uploadedBy,
        associationId: "assoc1",
        size: data.file.size,
      };

      setLocalDocuments(prev => [newDocument, ...prev]);
      setShowAddModal(false);
      setFeedback('Document ajouté avec succès');
      setTimeout(() => setFeedback(''), 3000);
    } catch {
      setFeedback('Erreur lors de l\'ajout du document');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleEditDocument = (data: Partial<DocumentType>) => {
    if (!selectedDocument) return;
    try {
      setLocalDocuments(prev => 
        prev.map(doc => 
          doc.id === selectedDocument.id 
            ? { ...doc, ...data } 
            : doc
        )
      );
      setShowEditModal(false);
      setSelectedDocument(null);
      setFeedback('Document modifié avec succès');
      setTimeout(() => setFeedback(''), 3000);
    } catch {
      setFeedback('Erreur lors de la modification du document');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        setLocalDocuments(prev => prev.filter(doc => doc.id !== id));
        setFeedback('Document supprimé avec succès');
        setTimeout(() => setFeedback(''), 3000);
      } catch {
        setFeedback('Erreur lors de la suppression du document');
        setTimeout(() => setFeedback(''), 3000);
      }
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setSelectedDocument(null);
    setShowAddModal(true);
    setShowFloatingMenu(false);
  };

  const openEditModal = (document: DocumentType) => {
    setSelectedDocument(document);
    setShowEditModal(true);
  };

  const openDetailModal = (document: DocumentType) => {
    setSelectedDocument(document);
    setShowDetailModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedDocument(null);
  };

  return (
    <div className="min-h-screen bg-purple-900 p-0">
      {/* En-tête identique à la page Diagnostics */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-1 py-6 sm:px-2 lg:px-3 border-l-4 border-orange-500 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
              Documents
            </h1>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm sm:text-base"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Nouveau document</span>
            <span className="sm:hidden">Nouveau</span>
          </button>
        </div>
        <div className="mt-4 hidden md:block">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Centralisez et organisez vos documents administratifs
          </p>
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Gestion centralisée :</strong> Tous vos documents importants en un seul endroit
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Organisation intelligente :</strong> Classement automatique par type et recherche avancée
            </p>
          </div>
        </div>
      </div>

      <div className="px-1 sm:px-2 lg:px-3 py-6">

      {/* Message de feedback */}
      {feedback && (
        <div className={`mb-1 sm:mb-2 p-1 sm:p-2 rounded-lg text-xs sm:text-sm ${
          feedback.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback}
        </div>
      )}

      {/* Vue d'ensemble complète - avec informations de taille */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg mb-6">
        <h3 className="text-xl font-montserrat font-semibold mb-6">Vue d'ensemble des Documents</h3>
        
        {/* Première rangée - Statistiques principales */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Total des documents */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-violet-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Total Documents</h3>
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-600" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-4xl font-bold text-violet-600">
                  {totalDocuments}
                </div>
                <div className="text-xl text-violet-500 font-medium">docs</div>
              </div>
              <div className="text-sm text-gray-600 mt-1">Documents stockés</div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (totalDocuments / 50) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Taille totale */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Espace Total</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold text-blue-600">
                  {formatFileSize(totalSize)}
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">Stockage utilisé</div>
              <div className="text-xs text-blue-600 mt-2">
                Moyenne: {formatFileSize(averageSize)}
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (totalSize / 10485760) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Plus gros document */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-orange-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Plus Volumineux</h3>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-orange-600">
                  {largestDocument ? formatFileSize(largestDocument.size) : '0 KB'}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {largestDocument ? largestDocument.name : 'Aucun document'}
                </div>
                <div className="text-xs text-orange-600">
                  {largestDocument ? getTypeLabel(largestDocument.type) : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Dernière activité */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-emerald-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Dernier Ajout</h3>
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-800 truncate">
                  {localDocuments.length > 0 ? localDocuments[localDocuments.length - 1].name : 'Aucun document'}
                </div>
                <div className="text-xs text-emerald-700">
                  {localDocuments.length > 0 ? formatDate(localDocuments[localDocuments.length - 1].uploadDate) : 'N/A'}
                </div>
                <div className="text-xs text-gray-600">
                  {localDocuments.length > 0 ? formatFileSize(localDocuments[localDocuments.length - 1].size) : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deuxième rangée - Répartition détaillée par type avec tailles */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📝</span>
                <span className="font-semibold text-blue-800">Procès-verbaux</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{pvCount}</span>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-blue-700">
                Total: {formatFileSize(pvTotalSize)}
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalSize > 0 ? (pvTotalSize / totalSize) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">💰</span>
                <span className="font-semibold text-green-800">Finances</span>
              </div>
              <span className="text-xl font-bold text-green-600">{financialReportCount}</span>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-green-700">
                Total: {formatFileSize(financeTotalSize)}
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalSize > 0 ? (financeTotalSize / totalSize) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚖️</span>
                <span className="font-semibold text-purple-800">Statuts</span>
              </div>
              <span className="text-xl font-bold text-purple-600">{statutesCount}</span>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-purple-700">
                Total: {formatFileSize(statutesTotalSize)}
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalSize > 0 ? (statutesTotalSize / totalSize) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📄</span>
                <span className="font-semibold text-gray-800">Autres</span>
              </div>
              <span className="text-xl font-bold text-gray-600">{otherCount}</span>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-700">
                Total: {formatFileSize(otherTotalSize)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-gray-500 to-gray-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${totalSize > 0 ? (otherTotalSize / totalSize) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres par type - Style identique à Diagnostics */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <h3 className="text-xl font-montserrat font-semibold mb-6">Filtres par Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            className={`space-y-3 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
              filterType === 'all' 
                ? 'border-purple-500 bg-purple-50 shadow-md' 
                : 'border-gray-200 hover:border-purple-300'
            }`} 
            onClick={() => setFilterType('all')} 
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">Tous</span>
                  <span className="font-semibold text-purple-600">{totalDocuments}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-violet-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>
          </button>

          <button 
            className={`space-y-3 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
              filterType === DocumentTypeEnum.PV 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setFilterType(filterType === DocumentTypeEnum.PV ? 'all' : DocumentTypeEnum.PV)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">Procès-verbaux</span>
                  <span className="font-semibold text-blue-600">{pvCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${totalDocuments > 0 ? (pvCount / totalDocuments) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </button>

          <button 
            className={`space-y-3 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
              filterType === DocumentTypeEnum.FINANCIAL_REPORT 
                ? 'border-green-500 bg-green-50 shadow-md' 
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => setFilterType(filterType === DocumentTypeEnum.FINANCIAL_REPORT ? 'all' : DocumentTypeEnum.FINANCIAL_REPORT)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">Finances</span>
                  <span className="font-semibold text-green-600">{financialReportCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${totalDocuments > 0 ? (financialReportCount / totalDocuments) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </button>

          <button 
            className={`space-y-3 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
              filterType === DocumentTypeEnum.STATUTES 
                ? 'border-purple-500 bg-purple-50 shadow-md' 
                : 'border-gray-200 hover:border-purple-300'
            }`} 
            onClick={() => setFilterType(filterType === DocumentTypeEnum.STATUTES ? 'all' : DocumentTypeEnum.STATUTES)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚖️</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">Statuts</span>
                  <span className="font-semibold text-purple-600">{statutesCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-violet-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${totalDocuments > 0 ? (statutesCount / totalDocuments) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        {/* Barre de recherche */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="block w-full border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent pl-6 sm:pl-8 pr-1 sm:pr-2 py-1 sm:py-1.5 text-xs sm:text-sm"
          />
        </div>

        {localDocuments.length === 0 ? (
          <div className="text-center py-4 sm:py-6">
            <div className="text-gray-400 mb-2 sm:mb-4">
              <FileText className="mx-auto mb-2 sm:mb-4 w-8 h-8 sm:w-12 sm:h-12" />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">Aucun document</p>
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">
              Ajoutez votre premier document
            </p>
            <button 
              onClick={openAddModal}
              className="bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm"
            >
              Ajouter
            </button>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-4 sm:py-6">
            <p className="text-gray-500 text-xs sm:text-sm">Aucun document trouvé</p>
          </div>
        ) : (
          <>
          {/* Vue mobile et desktop unifiée */}
          <div className="block sm:hidden">
            {/* Vue mobile - Liste de cartes */}
            <div className="space-y-1 sm:space-y-2">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="border border-gray-200 rounded-lg p-1 sm:p-2 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center space-x-1 mb-1">
                        {getFileIcon(document.name)}
                        <div className="font-medium text-gray-900 text-xs truncate">{document.name}</div>
                      </div>
                      <div className="flex flex-col space-y-0.5 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getTypeBadgeColor(document.type)}`}>
                            {getTypeLabel(document.type)}
                          </span>
                          <span className="flex-shrink-0 text-xs">{formatFileSize(document.size)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="truncate text-xs">Par {document.uploadedBy}</span>
                          <span className="flex-shrink-0 ml-1 text-xs">{formatDate(document.uploadDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-0.5 ml-1 flex-shrink-0">
                      <button 
                        className="inline-flex items-center justify-center w-6 h-6 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors" 
                        onClick={() => openDetailModal(document)} 
                        aria-label="Voir détails"
                      >
                        <Eye size={10} />
                      </button>
                      <button 
                        className="inline-flex items-center justify-center w-6 h-6 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-full transition-colors" 
                        onClick={() => openEditModal(document)}
                        aria-label="Modifier"
                      >
                        <Edit size={10} />
                      </button>
                      <button 
                        className="inline-flex items-center justify-center w-6 h-6 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors" 
                        onClick={() => handleDeleteDocument(document.id)}
                        aria-label="Supprimer"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:block">
            {/* Vue desktop - Tableau */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-700 text-sm">Document</th>
                    <th className="text-left p-3 font-medium text-gray-700 text-sm">Type</th>
                    <th className="text-left p-3 font-medium text-gray-700 text-sm">Taille</th>
                    <th className="text-left p-3 font-medium text-gray-700 text-sm">Auteur</th>
                    <th className="text-left p-3 font-medium text-gray-700 text-sm">Date</th>
                    <th className="text-left p-3 font-medium text-gray-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {filteredDocuments.map((document, index) => (
                  <tr key={document.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(document.name)}
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{document.name}</div>
                          <div className="text-xs text-gray-500">{formatFileSize(document.size)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(document.type)}`}>
                        {getTypeLabel(document.type)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-sm font-medium text-gray-900">{formatFileSize(document.size)}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-900">{document.uploadedBy}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-900">{formatDate(document.uploadDate)}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-1">
                        <button 
                          className="inline-flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors" 
                          onClick={() => openDetailModal(document)} 
                          aria-label="Voir détails"
                          title="Voir les détails"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="inline-flex items-center justify-center w-8 h-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-full transition-colors" 
                          onClick={() => openEditModal(document)} 
                          aria-label="Modifier"
                          title="Modifier ce document"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="inline-flex items-center justify-center w-8 h-8 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors" 
                          onClick={() => window.open(document.url, '_blank')} 
                          aria-label="Télécharger"
                          title="Télécharger ce document"
                        >
                          <Download size={14} />
                        </button>
                        <button 
                          className="inline-flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors" 
                          onClick={() => handleDeleteDocument(document.id)} 
                          aria-label="Supprimer"
                          title="Supprimer ce document"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
          </>
        )}
      </div>

      {/* Résumé complet en bas de page */}
      {localDocuments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-3 lg:p-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Statistiques de filtrage */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
              <div className="text-sm font-semibold text-blue-800 mb-2">Documents affichés</div>
              <div className="text-xl font-bold text-blue-600">
                {filteredDocuments.length}/{totalDocuments}
              </div>
              {filteredDocuments.length !== totalDocuments && (
                <div className="text-xs text-blue-600 mt-1">• Filtrés</div>
              )}
            </div>

            {/* Espace utilisé */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-3 rounded-lg border border-purple-200">
              <div className="text-sm font-semibold text-purple-800 mb-2">Espace utilisé</div>
              <div className="text-lg font-bold text-purple-600">
                {formatFileSize(totalSize)}
              </div>
              <div className="text-xs text-purple-600 mt-1">
                Moyenne: {formatFileSize(averageSize)}
              </div>
            </div>

            {/* Types de fichiers */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
              <div className="text-sm font-semibold text-green-800 mb-2">Types différents</div>
              <div className="text-lg font-bold text-green-600">
                {[...new Set(localDocuments.map(d => d.type))].length}
              </div>
              <div className="text-xs text-green-600 mt-1">
                Catégories actives
              </div>
            </div>

            {/* Dernière mise à jour */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200">
              <div className="text-sm font-semibold text-orange-800 mb-2">Dernière activité</div>
              <div className="text-sm font-bold text-orange-600">
                {localDocuments.length > 0 ? formatDate(Math.max(...localDocuments.map(d => d.uploadDate.getTime()))) : 'Aucune'}
              </div>
              <div className="text-xs text-orange-600 mt-1">
                Ajout le plus récent
              </div>
            </div>
          </div>

          {/* Barre de progression globale */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Capacité de stockage utilisée</span>
              <span className="text-sm text-gray-500">
                {formatFileSize(totalSize)} / {formatFileSize(50 * 1024 * 1024)} {/* 50MB limite exemple */}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-500 via-purple-500 to-violet-500 h-3 rounded-full transition-all duration-1000 relative overflow-hidden" 
                style={{ width: `${Math.min(100, (totalSize / (50 * 1024 * 1024)) * 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>Utilisation: {((totalSize / (50 * 1024 * 1024)) * 100).toFixed(1)}%</span>
              <span>Espace libre: {formatFileSize((50 * 1024 * 1024) - totalSize)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddDocumentModal
        isOpen={showAddModal}
        onClose={closeModals}
        onSave={handleAddDocument}
        isLoading={false}
      />

      <EditDocumentModal
        isOpen={showEditModal}
        onClose={closeModals}
        document={selectedDocument!}
        onSave={handleEditDocument}
        isLoading={false}
      />

      <DocumentDetailModal
        isOpen={showDetailModal}
        onClose={closeModals}
        document={selectedDocument}
      />

      {/* Bouton flottant avec menu d'actions */}
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 lg:bottom-6 lg:right-6 z-50 floating-menu-container">
        {/* Menu d'actions (visible quand showFloatingMenu est true) */}
        {showFloatingMenu && (
          <div className="absolute bottom-10 right-0 sm:bottom-12 lg:bottom-16 bg-white rounded-lg shadow-lg border border-gray-200 py-1 sm:py-2 min-w-[160px] sm:min-w-[180px] lg:min-w-[200px] animate-fadeIn">
            <button
              onClick={openAddModal}
              className="w-full px-2 py-1 sm:px-3 sm:py-2 text-left hover:bg-gray-50 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <Upload className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
              <span>Nouveau Document</span>
            </button>
            
            <button
              onClick={() => {
                // Fonction d'export à implémenter
                console.log('Export des documents');
                setShowFloatingMenu(false);
              }}
              className="w-full px-2 py-1 sm:px-3 sm:py-2 text-left hover:bg-gray-50 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
              <span>Exporter</span>
            </button>
          </div>
        )}

        {/* Bouton principal flottant */}
        <button
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            showFloatingMenu 
              ? 'bg-gray-600 hover:bg-gray-700 transform rotate-45' 
              : 'bg-orange-500 hover:bg-orange-600 hover:scale-110'
          }`}
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
        </button>
      </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
