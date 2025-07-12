import React, { useState } from 'react';
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
} from 'lucide-react';
import type { DocumentType } from '../types';
import { DocumentTypeEnum } from '../types';

const DocumentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | DocumentTypeEnum>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

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

  // Filtrage des documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

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

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* En-tête responsive */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-montserrat text-purple-700 mb-2">Documents</h1>
          <p className="text-gray-600 font-poppins">Gestion des documents de l'association</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg font-bold shadow-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <Upload className="w-5 h-5" /> Télécharger un document
        </button>
        {/* Statistiques - colonne mobile, ligne desktop */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between flex-1">
            <div>
              <p className="text-xs font-poppins text-gray-600">Total documents</p>
              <p className="text-xl font-bold font-montserrat text-gray-900">{documents.length}</p>
            </div>
            <File className="w-6 h-6 text-blue-600" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between flex-1">
            <div>
              <p className="text-xs font-poppins text-gray-600">Procès-verbaux</p>
              <p className="text-xl font-bold text-blue-600">{documents.filter(d => d.type === DocumentTypeEnum.PV).length}</p>
            </div>
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between flex-1">
            <div>
              <p className="text-xs font-poppins text-gray-600">Rapports financiers</p>
              <p className="text-xl font-bold text-green-600">{documents.filter(d => d.type === DocumentTypeEnum.FINANCIAL_REPORT).length}</p>
            </div>
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between flex-1">
            <div>
              <p className="text-xs font-poppins text-gray-600">Taille totale</p>
              <p className="text-xl font-bold text-purple-600">{formatFileSize(documents.reduce((sum, d) => sum + d.size, 0))}</p>
            </div>
            <Upload className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        {/* Barre de recherche et filtres - empilés mobile, ligne desktop */}
        <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent font-poppins"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | DocumentTypeEnum)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent font-poppins"
              aria-label="Filtrer par type de document"
            >
              <option value="all">Tous les types</option>
              <option value={DocumentTypeEnum.PV}>Procès-verbaux</option>
              <option value={DocumentTypeEnum.FINANCIAL_REPORT}>Rapports financiers</option>
              <option value={DocumentTypeEnum.STATUTES}>Statuts</option>
              <option value={DocumentTypeEnum.OTHER}>Autres</option>
            </select>
          </div>
        </div>
        {/* Liste des documents - cards mobile, table desktop */}
        <div className="block md:hidden flex flex-col gap-3">
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <File className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Aucun document trouvé avec ce terme de recherche.' : 'Commencez par télécharger votre premier document.'}
              </p>
            </div>
          )}
          {filteredDocuments.map((document) => (
            <div key={document.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border-l-4 border-purple-500">
              <div className="flex items-center gap-2">
                {getFileIcon(document.name)}
                <span className="font-bold text-base text-gray-900 font-montserrat">{document.name}</span>
                <span className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(document.type)}`}>{getTypeLabel(document.type)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-poppins">
                <User className="w-4 h-4" /> {document.uploadedBy}
                <Calendar className="w-4 h-4 ml-2" /> {formatDate(document.uploadDate)}
                <span className="ml-auto text-xs text-gray-700">{formatFileSize(document.size)}</span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button className="text-violet-600 hover:text-violet-800 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded" title="Voir le document" aria-label="Voir le document"><Eye className="w-5 h-5" /></button>
                <button className="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" title="Télécharger" aria-label="Télécharger le document"><Download className="w-5 h-5" /></button>
                <button className="text-red-600 hover:text-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded" title="Supprimer" aria-label="Supprimer le document"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Documents ({filteredDocuments.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléchargé par</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getFileIcon(document.name)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{document.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(document.type)}`}>{getTypeLabel(document.type)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatFileSize(document.size)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{document.uploadedBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{formatDate(document.uploadDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="text-violet-600 hover:text-violet-800 transition-colors" title="Voir le document"><Eye className="w-4 h-4" /></button>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors" title="Télécharger"><Download className="w-4 h-4" /></button>
                        <button className="text-red-600 hover:text-red-800 transition-colors" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modal de téléchargement - inchangé, déjà mobile-first */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Télécharger un document</h3>
                
                <form className="space-y-4">
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
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        aria-label="Sélectionner un fichier"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de document
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      aria-label="Type de document"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Description du document..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
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
    </div>
  );
};

export default DocumentsPage;
