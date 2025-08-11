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
  FileImage,
  Share
} from 'lucide-react';
import { DocumentTypeEnum, type DocumentType } from '../types';
import { formatDate } from '../utils';
import {
  DocumentDetailModal,
  EditDocumentModal,
  AddDocumentModal
} from '../components';

const DocumentsPage: React.FC = () => {
  // Détection mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      <div className="px-1 sm:px-2 lg:px-3 py-6">
      {/* Header décoré avec couleur orange */}
      <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 sm:p-5 lg:p-6 border-l-4 border-orange-500 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500 truncate">
              Gestion des Documents
            </h1>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 flex-shrink-0"
          >
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Nouveau document</span>
            <span className="sm:hidden">Nouveau</span>
          </button>
        </div>
        <div className="mt-4 space-y-2 sm:space-y-3">
          <p className="text-gray-700 font-medium">
            Centralisez et organisez tous vos documents associatifs
          </p>
          <div className="text-sm text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Stockage sécurisé :</strong> Vos documents protégés et toujours accessibles
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Organisation intelligente :</strong> Classement par type et recherche avancée
            </p>
          </div>
        </div>
      </div>

      {/* Message de feedback */}
      {feedback && (
        <div className={`mb-4 p-3 rounded-lg ${
          feedback.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback}
        </div>
      )}

      {/* Tableau de bord des statistiques */}
      <div className={`grid gap-4 mb-6 ${
        isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'
      }`}>
        <button 
          className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow border ${
            isMobile ? 'p-2' : 'p-4 sm:p-5 lg:p-6'
          } ${filterType === 'all' ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`} 
          onClick={() => setFilterType('all')} 
          aria-label="Afficher tous les documents"
        >
          <div className={`font-bold text-purple-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{totalDocuments}</div>
          <div className={`text-purple-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Total</div>
        </button>
        
        <button 
          className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow border ${
            isMobile ? 'p-2' : 'p-4 sm:p-5 lg:p-6'
          } ${filterType === DocumentTypeEnum.PV ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
          onClick={() => setFilterType(filterType === DocumentTypeEnum.PV ? 'all' : DocumentTypeEnum.PV)}
        >
          <div className={`font-bold text-blue-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{pvCount}</div>
          <div className={`text-blue-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>PV</div>
        </button>
        
        <button 
          className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow border ${
            isMobile ? 'p-2' : 'p-4 sm:p-5 lg:p-6'
          } ${filterType === DocumentTypeEnum.FINANCIAL_REPORT ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
          onClick={() => setFilterType(filterType === DocumentTypeEnum.FINANCIAL_REPORT ? 'all' : DocumentTypeEnum.FINANCIAL_REPORT)}
        >
          <div className={`font-bold text-green-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{financialReportCount}</div>
          <div className={`text-green-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Financiers</div>
        </button>
        
        <button 
          className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow border ${
            isMobile ? 'p-2' : 'p-4 sm:p-5 lg:p-6'
          } ${filterType === DocumentTypeEnum.STATUTES ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`} 
          onClick={() => setFilterType(filterType === DocumentTypeEnum.STATUTES ? 'all' : DocumentTypeEnum.STATUTES)}
        >
          <div className={`font-bold text-purple-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{statutesCount}</div>
          <div className={`text-purple-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Statuts</div>
        </button>
      </div>

      {/* Liste des documents */}
      <div className={`bg-white rounded-lg shadow ${isMobile ? 'p-2' : 'p-4 sm:p-5 lg:p-6'}`}>
        {/* Barre de recherche */}
        <div className={`relative mb-4 ${isMobile ? 'mb-3' : ''}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`text-gray-400 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </div>
          <input
            type="text"
            placeholder={isMobile ? 'Rechercher...' : 'Rechercher un document...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`block flex-1 w-full border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              isMobile ? 'pl-8 pr-2 py-2 text-sm' : 'pl-10 pr-3 py-2 text-sm sm:text-base'
            }`}
          />
        </div>

        {localDocuments.length === 0 ? (
          <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
            <div className="text-gray-400 mb-4">
              <FileText className={`mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`} />
            </div>
            <p className={`font-medium text-gray-900 mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>Aucun document enregistré</p>
            <p className={`text-gray-500 mb-4 ${isMobile ? 'text-sm' : ''}`}>
              {isMobile ? 'Ajoutez votre premier document' : 'Commencez par télécharger votre premier document'}
            </p>
            <button 
              onClick={openAddModal}
              className={`bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors ${
                isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'
              }`}
            >
              {isMobile ? 'Ajouter' : 'Télécharger un document'}
            </button>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun document trouvé pour votre recherche</p>
          </div>
        ) : (
          <>
          {isMobile ? (
            // Vue mobile - Liste de cartes
            <div className="space-y-3">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start justify-between space-y-2 sm:space-y-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {getFileIcon(document.name)}
                        <div className="font-medium text-gray-900 text-sm truncate">{document.name}</div>
                      </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 overflow-hidden">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getTypeBadgeColor(document.type)}`}>
                          {getTypeLabel(document.type)}
                        </span>
                        <span className="flex-shrink-0">{formatFileSize(document.size)}</span>
                        <span className="truncate">{formatDate(document.uploadDate)}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1 truncate">Par {document.uploadedBy}</div>
                    </div>
                    <div className="flex space-x-1 ml-2 flex-shrink-0">
                      <button 
                        className="inline-flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors" 
                        onClick={() => openDetailModal(document)} 
                        aria-label="Voir détails"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="inline-flex items-center justify-center w-8 h-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-full transition-colors" 
                        onClick={() => openEditModal(document)}
                        aria-label="Modifier"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="inline-flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors" 
                        onClick={() => handleDeleteDocument(document.id)}
                        aria-label="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Vue desktop - Tableau
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-700">Document</th>
                    <th className="text-left p-3 font-medium text-gray-700">Type</th>
                    <th className="text-left p-3 font-medium text-gray-700">Taille</th>
                    <th className="text-left p-3 font-medium text-gray-700">Auteur</th>
                    <th className="text-left p-3 font-medium text-gray-700">Date</th>
                    <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {filteredDocuments.map((document, index) => (
                  <tr key={document.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(document.name)}
                        <div>
                          <div className="font-medium text-gray-900">{document.name}</div>
                          <div className="text-sm text-gray-500">{formatFileSize(document.size)}</div>
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
          )}
          </>
        )}
      </div>

      {/* Résumé en bas de page */}
      {localDocuments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-5 lg:p-6 mt-4">
          <div className="text-sm text-gray-600 space-y-2 sm:space-y-3">
            Affichage de {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''} sur {totalDocuments} au total
            {filteredDocuments.length !== totalDocuments && (
              <span className="ml-2 text-blue-600">
                • Filtres actifs
              </span>
            )}
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
      <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
        {/* Menu d'actions (visible quand showFloatingMenu est true) */}
        {showFloatingMenu && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
            <button
              onClick={openAddModal}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Upload className="h-4 w-4 text-orange-600" />
              <span>Nouveau Document</span>
            </button>
            
            <button
              onClick={() => {
                // Fonction d'export à implémenter
                console.log('Export des documents');
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Download className="h-4 w-4 text-green-600" />
              <span>Exporter la liste</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => {
                // Fonction de partage à implémenter
                console.log('Partage des documents');
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Share className="h-4 w-4 text-blue-600" />
              <span>Partager</span>
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
    </div>
  );
};

export default DocumentsPage;
