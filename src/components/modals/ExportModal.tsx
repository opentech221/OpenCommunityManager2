import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, Calendar, Users, Package } from 'lucide-react';
import type { HumanResourceType, MaterialResourceType } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  humanResources: HumanResourceType[];
  materialResources: MaterialResourceType[];
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, humanResources, materialResources }) => {
  const [exportType, setExportType] = useState<'human' | 'material' | 'both'>('both');
  const [format, setFormat] = useState<'csv' | 'json'>('csv');

  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          let value = row[header];
          if (value instanceof Date) {
            value = formatDate(value);
          } else if (Array.isArray(value)) {
            value = value.join('; ');
          } else if (value === null || value === undefined) {
            value = '';
          }
          // Échapper les guillemets et entourer de guillemets si nécessaire
          value = String(value).replace(/"/g, '""');
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (data: any[], filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const prepareHumanResourcesData = () => {
    return humanResources.map(resource => ({
      'Prénom': resource.firstName,
      'Nom': resource.lastName,
      'Email': resource.email,
      'Téléphone': resource.phone,
      'Poste': resource.position,
      'Expérience': resource.experience,
      'Disponibilité': resource.availability,
      'Compétences': resource.skills.join('; '),
      'Date d\'ajout': resource.addedDate,
      'Notes': resource.notes || ''
    }));
  };

  const prepareMaterialResourcesData = () => {
    return materialResources.map(resource => ({
      'Nom': resource.name,
      'Catégorie': resource.category,
      'Description': resource.description,
      'État': resource.condition,
      'Emplacement': resource.location,
      'Disponibilité': resource.availability,
      'Responsable': resource.responsible || '',
      'Prix d\'achat': resource.purchasePrice || '',
      'Valeur actuelle': resource.currentValue || '',
      'Date d\'achat': resource.purchaseDate || '',
      'Numéro de série': resource.serialNumber || '',
      'Garantie jusqu\'au': resource.warranty || '',
      'Date d\'ajout': resource.addedDate,
      'Notes': resource.notes || ''
    }));
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileExtension = format === 'csv' ? 'csv' : 'json';
    
    if (exportType === 'human' || exportType === 'both') {
      const humanData = prepareHumanResourcesData();
      const filename = `ressources_humaines_${timestamp}.${fileExtension}`;
      
      if (format === 'csv') {
        exportToCSV(humanData, filename);
      } else {
        exportToJSON(humanData, filename);
      }
    }

    if (exportType === 'material' || exportType === 'both') {
      const materialData = prepareMaterialResourcesData();
      const filename = `ressources_materielles_${timestamp}.${fileExtension}`;
      
      if (format === 'csv') {
        exportToCSV(materialData, filename);
      } else {
        exportToJSON(materialData, filename);
      }
    }

    // Fermer la modal après l'export
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Download className="w-5 h-5 mr-2 text-green-600" />
              Exporter les ressources
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Statistiques */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Données disponibles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-600">{humanResources.length} personnes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">{materialResources.length} matériels</span>
              </div>
            </div>
          </div>

          {/* Type d'export */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Que souhaitez-vous exporter ?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exportType"
                  value="both"
                  checked={exportType === 'both'}
                  onChange={(e) => setExportType(e.target.value as 'human' | 'material' | 'both')}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Toutes les ressources</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exportType"
                  value="human"
                  checked={exportType === 'human'}
                  onChange={(e) => setExportType(e.target.value as 'human' | 'material' | 'both')}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Ressources humaines seulement</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exportType"
                  value="material"
                  checked={exportType === 'material'}
                  onChange={(e) => setExportType(e.target.value as 'human' | 'material' | 'both')}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Ressources matérielles seulement</span>
              </label>
            </div>
          </div>

          {/* Format d'export */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Format de fichier
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value as 'csv' | 'json')}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-sm text-gray-700">CSV (Excel)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={format === 'json'}
                  onChange={(e) => setFormat(e.target.value as 'csv' | 'json')}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm text-gray-700">JSON (Données brutes)</span>
              </label>
            </div>
          </div>

          {/* Informations */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-start">
              <Calendar className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
              <div className="text-xs text-blue-700">
                <p className="font-medium">Les fichiers incluront :</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Toutes les informations disponibles</li>
                  <li>La date du jour dans le nom du fichier</li>
                  <li>L'encodage UTF-8 pour les caractères spéciaux</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
