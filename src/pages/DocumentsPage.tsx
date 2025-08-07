import React, { useState, useEffect } from 'react';
import {
  Upload,
  File,
  Download,
  Trash2,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  FileText,
  FileSpreadsheet,
  FileImage,
  Plus,
  Archive,
  Share
} from 'lucide-react';
import type { DocumentType } from '../types';
import { DocumentTypeEnum } from '../types';

const DocumentsPage: React.FC = () => {
  // ...autres states...
  const [uploadFileName, setUploadFileName] = useState('');

  // Données de démonstration
  const documents: DocumentType[] = [
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
    },
    {
      id: '5',
      name: 'Reglement_Interieur.pdf',
      type: DocumentTypeEnum.OTHER,
      url: '/documents/reglement.pdf',
      uploadDate: new Date('2024-01-20'),
      uploadedBy: 'Sophie Leroy',
      associationId: 'assoc1',
      size: 768000 // 768KB
    }
  ];

  const [localDocuments, setLocalDocuments] = useState<DocumentType[]>(documents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | DocumentTypeEnum>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Mots-clés populaires pour les suggestions de recherche
  const popularDocumentKeywords = [
    'pv', 'rapport', 'financier', 'statuts', 'contrat', 'facture', 'photo',
    'marie', 'jean', 'sophie', '2024', '2023', 'ag', 'assemblée'
  ];

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

  // États locaux pour l’upload
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<DocumentTypeEnum>(DocumentTypeEnum.PV);
  const [uploadDescription, setUploadDescription] = useState('');

  // Filtrage des documents avec recherche avancée multi-mots-clés
  const filteredDocuments = localDocuments.filter(doc => {
    if (!searchTerm) {
      const matchesType = filterType === 'all' || doc.type === filterType;
      return matchesType;
    }

    // Recherche par mots-clés multiples (séparés par des espaces)
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const searchableFields = [
      doc.name.toLowerCase(),
      doc.uploadedBy.toLowerCase(),
      getTypeLabel(doc.type).toLowerCase(),
      doc.uploadDate.getFullYear().toString(),
      formatFileSize(doc.size).toLowerCase()
    ].join(' ');

    const matchesSearch = searchTerms.every(term => searchableFields.includes(term));
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  // Fonction pour mettre en surbrillance les termes de recherche
  const highlightSearchTerms = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
    let highlightedText = text;
    
    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="bg-yellow-200 font-semibold">$1</span>');
    });
    
    return highlightedText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

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

  function handleDeleteDocument(id: string): void {
    setLocalDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
    setFeedback('Document supprimé avec succès.');
    setTimeout(() => setFeedback(''), 2000);
  }

  function handleAddDocument(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!uploadFile) {
      setFeedback("Veuillez sélectionner un fichier.");
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    // Simule l'upload et ajoute le document localement
    const newDocument: DocumentType = {
      id: (Date.now() + Math.random()).toString(),
      name: uploadFile.name,
      type: uploadType,
      url: URL.createObjectURL(uploadFile),
      uploadDate: new Date(),
      uploadedBy: "Vous", // À remplacer par l'utilisateur connecté
      associationId: "assoc1",
      size: uploadFile.size,
      // description: uploadDescription, // Retiré car non présent dans DocumentType
    };

    setLocalDocuments(prevDocs => [newDocument, ...prevDocs]);
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadType(DocumentTypeEnum.PV);
    setUploadDescription('');
    setFeedback('Document ajouté avec succès.');
    setTimeout(() => setFeedback(''), 2000);
  }

  return (
    <div className="h-screen bg-purple-900 p-0 flex flex-col overflow-hidden">
      {feedback && (
        <div data-testid="documents-feedback" className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50">
          {feedback}
        </div>
      )}
      <div className="flex-1 px-4 py-2 sm:px-6 lg:px-8 flex flex-col min-h-0">
        {/* En-tête décoré avec couleur orange */}
        <div className="mb-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border-l-4 border-orange-500 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white"/>
                </div>
              </div>
              <h1 data-testid="documents-title" className="text-xl md:text-2xl font-bold text-orange-500">
                Gestion Documentaire
              </h1>
            </div>
            <button 
              data-testid="add-document-btn"
              onClick={() => setShowUploadModal(true)}
              className="bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Nouveau document</span>
              <span className="sm:hidden">Nouveau</span>
            </button>
          </div>
          <div className="mt-3 hidden lg:block">
            <p className="text-gray-700 font-medium text-base">
              Archivage intelligent et conformité juridique assurée
            </p>
            <div className="text-xs text-gray-600 space-y-0.5 mt-1">
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                <strong>Sécurité renforcée :</strong> Stockage sécurisé et accès contrôlé
              </p>
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                <strong>Recherche instantanée :</strong> Retrouvez tous vos documents en un clic
              </p>
            </div>
          </div>
        </div>

        {/* Section unifiée : recherche, filtres et liste */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden px-4 py-4 sm:px-6 lg:px-8 flex-1 flex flex-col min-h-0">
          {/* Statistiques avec boutons fonctionnels */}
          <div className="mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <button 
                onClick={() => setFilterType('all')}
                className={`bg-purple-100 rounded-lg p-2 shadow hover:bg-purple-200 transition-colors border ${
                  filterType === 'all' ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                }`}
                aria-label="Afficher tous les documents"
              >
                <div className="flex flex-col items-center space-y-1">
                  <FileText className="h-6 w-6 text-purple-600" />
                  <div className="text-sm sm:text-lg font-bold text-purple-700">{localDocuments.length}</div>
                  <div className="text-xs text-purple-600">Total</div>
                </div>
              </button>
              <button 
                onClick={() => setFilterType(filterType === DocumentTypeEnum.PV ? 'all' : DocumentTypeEnum.PV)}
                className={`bg-blue-100 rounded-lg p-2 shadow hover:bg-blue-200 transition-colors border ${
                  filterType === DocumentTypeEnum.PV ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
                aria-label="Filtrer procès-verbaux"
              >
                <div className="flex flex-col items-center space-y-1">
                  <File className="h-6 w-6 text-blue-600" />
                  <div className="text-sm sm:text-lg font-bold text-blue-700">
                    {localDocuments.filter(d => d.type === DocumentTypeEnum.PV).length}
                  </div>
                  <div className="text-xs text-blue-600">PV</div>
                </div>
              </button>
              <button 
                onClick={() => setFilterType(filterType === DocumentTypeEnum.FINANCIAL_REPORT ? 'all' : DocumentTypeEnum.FINANCIAL_REPORT)}
                className={`bg-green-100 rounded-lg p-2 shadow hover:bg-green-200 transition-colors border ${
                  filterType === DocumentTypeEnum.FINANCIAL_REPORT ? 'ring-2 ring-green-500 ring-offset-2' : ''
                }`}
                aria-label="Filtrer rapports financiers"
              >
                <div className="flex flex-col items-center space-y-1">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                  <div className="text-sm sm:text-lg font-bold text-green-700">
                    {localDocuments.filter(d => d.type === DocumentTypeEnum.FINANCIAL_REPORT).length}
                  </div>
                  <div className="text-xs text-green-600">Finances</div>
                </div>
              </button>
              <button 
                onClick={() => setFilterType(filterType === DocumentTypeEnum.STATUTES ? 'all' : DocumentTypeEnum.STATUTES)}
                className={`bg-orange-100 rounded-lg p-2 shadow hover:bg-orange-200 transition-colors border ${
                  filterType === DocumentTypeEnum.STATUTES ? 'ring-2 ring-orange-500 ring-offset-2' : ''
                }`}
                aria-label="Filtrer statuts"
              >
                <div className="flex flex-col items-center space-y-1">
                  <Archive className="h-6 w-6 text-orange-600" />
                  <div className="text-sm sm:text-lg font-bold text-orange-700">
                    {localDocuments.filter(d => d.type === DocumentTypeEnum.STATUTES).length}
                  </div>
                  <div className="text-xs text-orange-600">Statuts</div>
                </div>
              </button>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="border-b border-gray-200 pb-3 mb-4">
          <div className="space-y-3">
            {/* Barre de recherche avec suggestions */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-orange-600" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un document... (ex: pv marie, rapport 2024)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
              />
              
              {/* Suggestions de recherche */}
              {showSearchSuggestions && searchTerm.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                  {popularDocumentKeywords
                    .filter(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()) && !searchTerm.toLowerCase().includes(keyword.toLowerCase()))
                    .slice(0, 5)
                    .map((keyword, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchTerm(searchTerm + ' ' + keyword);
                          setShowSearchSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-600">+ {keyword}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Filtres */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | DocumentTypeEnum)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  aria-label="Filtrer par type de document"
                >
                  <option value="all">Tous les types</option>
                  <option value={DocumentTypeEnum.PV}>Procès-verbaux</option>
                  <option value={DocumentTypeEnum.FINANCIAL_REPORT}>Rapports financiers</option>
                  <option value={DocumentTypeEnum.STATUTES}>Statuts</option>
                  <option value={DocumentTypeEnum.OTHER}>Autres</option>
                </select>
              </div>
              
              {/* Taille totale des documents */}
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg border">
                <Upload className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Taille totale: {formatFileSize(localDocuments.reduce((sum, d) => sum + d.size, 0))}
                </span>
              </div>
            </div>

            {/* Filtres actifs */}
            {(searchTerm || filterType !== 'all') && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Filtres actifs:</span>
                {searchTerm && (
                  <span className="inline-flex px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                    Recherche: "{searchTerm}"
                  </span>
                )}
                {filterType !== 'all' && (
                  <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {getTypeLabel(filterType as DocumentTypeEnum)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

          {/* Liste des documents - cards mobile, table desktop */}
          <div data-testid="documents-list-mobile" className="md:hidden grid grid-cols-1 gap-1 flex-1 overflow-y-auto">
            {filteredDocuments.length === 0 && (
              <div className="text-center py-8">
                <File className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {searchTerm ? 'Aucun document trouvé avec ce terme de recherche.' : 'Commencez par télécharger votre premier document.'}
                </p>
              </div>
            )}
            {filteredDocuments.map((document) => (
              <div key={document.id} data-testid={`document-card-${document.id}`} className="bg-white rounded-lg shadow p-3 flex flex-col gap-2 border-l-4 border-purple-500">
                <div className="flex items-center gap-2">
                  {getFileIcon(document.name)}
                  <span className="font-bold text-base text-gray-900 font-montserrat">
                    <span 
                      dangerouslySetInnerHTML={{ 
                        __html: highlightSearchTerms(document.name, searchTerm) 
                      }}
                    />
                  </span>
                  <span className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(document.type)}`}>{getTypeLabel(document.type)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-poppins">
                  <User className="w-4 h-4" /> 
                  <span 
                    dangerouslySetInnerHTML={{ 
                      __html: highlightSearchTerms(document.uploadedBy, searchTerm) 
                    }}
                  />
                  <Calendar className="w-4 h-4 ml-2" /> {formatDate(document.uploadDate)}
                  <span className="ml-auto text-xs text-gray-700">{formatFileSize(document.size)}</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button data-testid={`view-document-btn-${document.id}`} className="text-orange-600 hover:text-orange-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded" title="Voir le document" aria-label="Voir le document"><Eye className="w-5 h-5" /></button>
                  <button data-testid={`download-document-btn-${document.id}`} className="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" title="Télécharger" aria-label="Télécharger le document"><Download className="w-5 h-5" /></button>
                  <button data-testid={`delete-document-btn-${document.id}`} className="text-red-600 hover:text-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded" title="Supprimer" aria-label="Supprimer le document" onClick={() => handleDeleteDocument(document.id)}><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block bg-gray-50 rounded-xl border overflow-hidden flex-1">
            <div className="p-3 border-b bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Documents ({filteredDocuments.length})</h3>
            </div>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                    <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Par</th>
                    <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredDocuments.map((document) => (
                    <tr key={document.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="px-3 py-1">
                        <div className="flex items-center">
                          {getFileIcon(document.name)}
                          <div className="ml-2 flex-1">
                            <div className="text-xs font-medium text-gray-900 truncate" title={document.name}>
                              <span 
                                dangerouslySetInnerHTML={{ 
                                  __html: highlightSearchTerms(document.name, searchTerm) 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(document.type)}`}>
                          {getTypeLabel(document.type)}
                        </span>
                      </td>
                      <td className="px-3 py-1">
                        <div className="text-xs text-gray-900">{formatFileSize(document.size)}</div>
                      </td>
                      <td className="px-3 py-1">
                        <div className="flex items-center">
                          <User className="w-3 h-3 text-gray-400 mr-1 flex-shrink-0" />
                          <span className="text-xs text-gray-900 truncate" title={document.uploadedBy}>
                            {document.uploadedBy}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-1">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 text-gray-400 mr-1 flex-shrink-0" />
                          <span className="text-xs text-gray-900">{formatDate(document.uploadDate)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-1">
                        <div className="flex items-center gap-1">
                          <button className="text-violet-600 hover:text-violet-800 transition-colors" title="Voir le document">
                            <Eye className="w-3 h-3" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 transition-colors" title="Télécharger">
                            <Download className="w-3 h-3" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 transition-colors" 
                            title="Supprimer" 
                            onClick={() => handleDeleteDocument(document.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal de téléchargement - sans scroll */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-hidden">
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Télécharger un document</h3>
                <form className="space-y-4" onSubmit={handleAddDocument}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="documentNameInput">
                      Nom du document
                    </label>
                    <input
                      id="documentNameInput"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      aria-label="Nom du document"
                      placeholder="Nom du document"
                      value={uploadFileName}
                      onChange={e => setUploadFileName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fichier
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Cliquez pour sélectionner un fichier ou glissez-déposez
                      </p>
                      <input
                        type="file"
                        className="mt-2"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        aria-label="Sélectionner un fichier"
                        required
                        onChange={e => setUploadFile(e.target.files ? e.target.files[0] : null)}
                      />
                      {uploadFile && <div className="mt-2 text-xs text-gray-700">{uploadFile.name}</div>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de document
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      aria-label="Type de document"
                      value={uploadType}
                      onChange={e => setUploadType(e.target.value as DocumentTypeEnum)}
                      required
                    >
                      <option value={DocumentTypeEnum.PV}>Procès-verbal</option>
                      <option value={DocumentTypeEnum.FINANCIAL_REPORT}>Rapport financier</option>
                      <option value={DocumentTypeEnum.STATUTES}>Statuts</option>
                      <option value={DocumentTypeEnum.OTHER}>Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (optionnel)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Description du document..."
                      value={uploadDescription}
                      onChange={e => setUploadDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadModal(false);
                        setUploadFile(null);
                        setUploadType(DocumentTypeEnum.PV);
                        setUploadDescription('');
                      }}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Télécharger
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bouton flottant avec menu d'actions */}
      <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
        {/* Menu d'actions (visible quand showFloatingMenu est true) */}
        {showFloatingMenu && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
            <button
              onClick={() => {
                setShowUploadModal(true);
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Upload className="h-4 w-4 text-orange-600" />
              <span>Nouveau Document</span>
            </button>
            
            <button
              onClick={() => {
                // Navigation vers événements pour voir les documents liés
                window.location.href = '/events';
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Voir Événements</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => {
                // Fonction d'export à implémenter
                console.log('Export des documents');
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Download className="h-4 w-4 text-green-600" />
              <span>Exporter Archive</span>
            </button>
            
            <button
              onClick={() => {
                // Fonction de partage à implémenter
                console.log('Partager documents');
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Share className="h-4 w-4 text-purple-600" />
              <span>Partager Dossier</span>
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
  );
};

export default DocumentsPage;
