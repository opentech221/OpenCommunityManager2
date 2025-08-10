import React, { useState, useEffect } from 'react';
import {
  Users,
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Wrench,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Download
} from 'lucide-react';
import type { HumanResourceType, MaterialResourceType, MaterialCategory } from '../types';
import { MaterialCategory as MaterialCategoryEnum } from '../types';
import AddHumanResourceModal from '../components/modals/AddHumanResourceModal';
import AddMaterialResourceModal from '../components/modals/AddMaterialResourceModal';
import EditHumanResourceModal from '../components/modals/EditHumanResourceModal';
import EditMaterialResourceModal from '../components/modals/EditMaterialResourceModal';
import HumanResourceDetailModal from '../components/modals/HumanResourceDetailModal';
import MaterialResourceDetailModal from '../components/modals/MaterialResourceDetailModal';
import ExportModal from '../components/modals/ExportModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

const ResourcesPage: React.FC = () => {
  // États pour la gestion des onglets
  const [activeTab, setActiveTab] = useState<'human' | 'material'>('human');
  
  // États pour les ressources humaines
  const [humanResources, setHumanResources] = useState<HumanResourceType[]>([
    {
      id: '1',
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@email.com',
      phone: '06 12 34 56 78',
      skills: ['Communication', 'Gestion de projet', 'Comptabilité'],
      availability: 'DISPONIBLE',
      position: 'Responsable communication',
      experience: '5 ans dans le secteur associatif',
      associationId: 'assoc1',
      addedDate: new Date('2024-01-15'),
      notes: 'Très investie, disponible les week-ends'
    },
    {
      id: '2',
      firstName: 'Jean',
      lastName: 'Martin',
      email: 'jean.martin@email.com',
      phone: '06 98 76 54 32',
      skills: ['Informatique', 'Formation', 'Support technique'],
      availability: 'OCCUPÉ',
      position: 'Responsable IT',
      experience: '3 ans en informatique associative',
      associationId: 'assoc1',
      addedDate: new Date('2024-02-10'),
      notes: 'Expert en systèmes informatiques'
    },
    {
      id: '3',
      firstName: 'Sophie',
      lastName: 'Leroy',
      email: 'sophie.leroy@email.com',
      phone: '06 45 67 89 12',
      skills: ['Animation', 'Pédagogie', 'Arts créatifs'],
      availability: 'DISPONIBLE',
      position: 'Animatrice',
      experience: '7 ans d\'animation jeunesse',
      associationId: 'assoc1',
      addedDate: new Date('2024-01-20'),
      notes: 'Spécialisée dans les activités créatives'
    }
  ]);

  // États pour les ressources matérielles
  const [materialResources, setMaterialResources] = useState<MaterialResourceType[]>([
    {
      id: '1',
      name: 'Ordinateur portable HP',
      category: MaterialCategoryEnum.INFORMATIQUE,
      description: 'Laptop HP ProBook 450 G8, 16GB RAM, 512GB SSD',
      condition: 'BON',
      location: 'Bureau principal',
      purchaseDate: new Date('2023-09-15'),
      purchasePrice: 800,
      currentValue: 600,
      responsible: 'Jean Martin',
      availability: 'UTILISÉ',
      associationId: 'assoc1',
      addedDate: new Date('2023-09-15'),
      serialNumber: 'HP-2023-001',
      warranty: new Date('2026-09-15'),
      notes: 'Utilisé pour les formations informatiques'
    },
    {
      id: '2',
      name: 'Table de réunion',
      category: MaterialCategoryEnum.MOBILIER,
      description: 'Table ovale en bois pour 12 personnes',
      condition: 'EXCELLENT',
      location: 'Salle de réunion',
      purchaseDate: new Date('2023-06-01'),
      purchasePrice: 350,
      currentValue: 320,
      responsible: 'Marie Dupont',
      availability: 'DISPONIBLE',
      associationId: 'assoc1',
      addedDate: new Date('2023-06-01'),
      notes: 'Idéale pour les assemblées générales'
    },
    {
      id: '3',
      name: 'Projecteur Epson',
      category: MaterialCategoryEnum.AUDIOVISUEL,
      description: 'Projecteur Full HD avec écran de projection',
      condition: 'BON',
      location: 'Salle polyvalente',
      purchaseDate: new Date('2023-11-20'),
      purchasePrice: 450,
      currentValue: 380,
      responsible: 'Sophie Leroy',
      availability: 'DISPONIBLE',
      associationId: 'assoc1',
      addedDate: new Date('2023-11-20'),
      lastMaintenanceDate: new Date('2024-06-15'),
      nextMaintenanceDate: new Date('2024-12-15'),
      serialNumber: 'EPSON-2023-PRJ',
      warranty: new Date('2025-11-20'),
      notes: 'Nécessite un nettoyage régulier des filtres'
    }
  ]);

  // États pour les modales et filtres
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showAddHumanModal, setShowAddHumanModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showHumanDetailModal, setShowHumanDetailModal] = useState(false);
  const [showMaterialDetailModal, setShowMaterialDetailModal] = useState(false);
  const [showEditHumanModal, setShowEditHumanModal] = useState(false);
  const [showEditMaterialModal, setShowEditMaterialModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'human' | 'material', id: string, name: string } | null>(null);
  const [selectedHumanResource, setSelectedHumanResource] = useState<HumanResourceType | null>(null);
  const [selectedMaterialResource, setSelectedMaterialResource] = useState<MaterialResourceType | null>(null);
  const [humanSearchTerm, setHumanSearchTerm] = useState('');
  const [materialSearchTerm, setMaterialSearchTerm] = useState('');
  const [humanFilter, setHumanFilter] = useState<'all' | 'DISPONIBLE' | 'OCCUPÉ' | 'INDISPONIBLE'>('all');
  const [materialFilter, setMaterialFilter] = useState<'all' | MaterialCategory>('all');
  const [materialAvailabilityFilter, setMaterialAvailabilityFilter] = useState<'all' | 'DISPONIBLE' | 'UTILISÉ' | 'EN_MAINTENANCE' | 'INDISPONIBLE'>('all');
  const [feedback, setFeedback] = useState<string>('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Mots-clés populaires pour la recherche
  const popularHumanKeywords = ['communication', 'informatique', 'gestion', 'animation', 'formation', 'comptabilité'];
  const popularMaterialKeywords = ['ordinateur', 'projecteur', 'table', 'hp', 'epson', 'bureau', 'réunion'];

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

  // Filtrage des ressources humaines avec recherche avancée
  const filteredHumanResources = humanResources.filter(resource => {
    if (!humanSearchTerm) {
      const matchesFilter = humanFilter === 'all' || resource.availability === humanFilter;
      return matchesFilter;
    }

    // Recherche par mots-clés multiples (séparés par des espaces)
    const searchTerms = humanSearchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const searchableFields = [
      resource.firstName.toLowerCase(),
      resource.lastName.toLowerCase(),
      resource.position.toLowerCase(),
      resource.email.toLowerCase(),
      resource.phone.toLowerCase(),
      resource.experience?.toLowerCase() || '',
      resource.notes?.toLowerCase() || '',
      ...resource.skills.map(skill => skill.toLowerCase())
    ].join(' ');

    const matchesSearch = searchTerms.every(term => searchableFields.includes(term));
    const matchesFilter = humanFilter === 'all' || resource.availability === humanFilter;
    return matchesSearch && matchesFilter;
  });

  // Filtrage des ressources matérielles avec recherche avancée
  const filteredMaterialResources = materialResources.filter(resource => {
    if (!materialSearchTerm) {
      const matchesCategory = materialFilter === 'all' || resource.category === materialFilter;
      const matchesAvailability = materialAvailabilityFilter === 'all' || resource.availability === materialAvailabilityFilter;
      return matchesCategory && matchesAvailability;
    }

    // Recherche par mots-clés multiples (séparés par des espaces)
    const searchTerms = materialSearchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const searchableFields = [
      resource.name.toLowerCase(),
      resource.description.toLowerCase(),
      resource.location.toLowerCase(),
      resource.responsible?.toLowerCase() || '',
      resource.serialNumber?.toLowerCase() || '',
      resource.notes?.toLowerCase() || '',
      getCategoryLabel(resource.category).toLowerCase(),
      resource.availability.toLowerCase(),
      resource.condition.toLowerCase()
    ].join(' ');

    const matchesSearch = searchTerms.every(term => searchableFields.includes(term));
    const matchesCategory = materialFilter === 'all' || resource.category === materialFilter;
    const matchesAvailability = materialAvailabilityFilter === 'all' || resource.availability === materialAvailabilityFilter;
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Fonctions utilitaires
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  const highlightSearchTerms = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
    let highlightedText = text;
    
    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
    });
    
    return highlightedText;
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800';
      case 'OCCUPÉ':
      case 'UTILISÉ':
        return 'bg-yellow-100 text-yellow-800';
      case 'INDISPONIBLE':
      case 'EN_MAINTENANCE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT':
        return 'bg-green-100 text-green-800';
      case 'BON':
        return 'bg-blue-100 text-blue-800';
      case 'MOYEN':
        return 'bg-yellow-100 text-yellow-800';
      case 'MAUVAIS':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  const handleDeleteHumanResource = (id: string) => {
    setHumanResources(prev => prev.filter(r => r.id !== id));
    setFeedback('Ressource humaine supprimée avec succès.');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleDeleteMaterialResource = (id: string) => {
    setMaterialResources(prev => prev.filter(r => r.id !== id));
    setFeedback('Ressource matérielle supprimée avec succès.');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleAddHumanResource = (resource: Omit<HumanResourceType, 'id'>) => {
    const newResource: HumanResourceType = {
      ...resource,
      id: `human_${Date.now()}`
    };
    setHumanResources(prev => [...prev, newResource]);
    setFeedback('Nouvelle personne ajoutée avec succès.');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleAddMaterialResource = (resource: Omit<MaterialResourceType, 'id'>) => {
    const newResource: MaterialResourceType = {
      ...resource,
      id: `material_${Date.now()}`
    };
    setMaterialResources(prev => [...prev, newResource]);
    setFeedback('Nouveau matériel ajouté avec succès.');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleViewHumanDetails = (resource: HumanResourceType) => {
    setSelectedHumanResource(resource);
    setShowHumanDetailModal(true);
  };

  const handleViewMaterialDetails = (resource: MaterialResourceType) => {
    setSelectedMaterialResource(resource);
    setShowMaterialDetailModal(true);
  };

  // Gestionnaires pour l'édition
  const handleEditHumanResource = (resource: HumanResourceType) => {
    setSelectedHumanResource(resource);
    setShowEditHumanModal(true);
  };

  const handleEditMaterialResource = (resource: MaterialResourceType) => {
    setSelectedMaterialResource(resource);
    setShowEditMaterialModal(true);
  };

  const handleUpdateHumanResource = (updatedResource: HumanResourceType) => {
    setHumanResources(prev => 
      prev.map(resource => 
        resource.id === updatedResource.id ? updatedResource : resource
      )
    );
    setShowEditHumanModal(false);
    setSelectedHumanResource(null);
    setFeedback('Ressource humaine modifiée avec succès !');
  };

  const handleUpdateMaterialResource = (updatedResource: MaterialResourceType) => {
    setMaterialResources(prev => 
      prev.map(resource => 
        resource.id === updatedResource.id ? updatedResource : resource
      )
    );
    setShowEditMaterialModal(false);
    setSelectedMaterialResource(null);
    setFeedback('Ressource matérielle modifiée avec succès !');
  };

  // Gestionnaires pour la suppression avec confirmation
  const handleDeleteRequest = (type: 'human' | 'material', id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'human') {
        handleDeleteHumanResource(deleteTarget.id);
      } else {
        handleDeleteMaterialResource(deleteTarget.id);
      }
    }
    setDeleteTarget(null);
    setShowDeleteConfirmModal(false);
  };

  // Statistiques
  const humanStats = {
    total: humanResources.length,
    available: humanResources.filter(r => r.availability === 'DISPONIBLE').length,
    busy: humanResources.filter(r => r.availability === 'OCCUPÉ').length,
    unavailable: humanResources.filter(r => r.availability === 'INDISPONIBLE').length
  };

  const materialStats = {
    total: materialResources.length,
    available: materialResources.filter(r => r.availability === 'DISPONIBLE').length,
    used: materialResources.filter(r => r.availability === 'UTILISÉ').length,
    maintenance: materialResources.filter(r => r.availability === 'EN_MAINTENANCE').length,
    totalValue: materialResources.reduce((sum, r) => sum + (r.currentValue || 0), 0)
  };

  return (
    <div className="min-h-screen bg-purple-900 p-0">
      {feedback && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50">
          {feedback}
        </div>
      )}
      
      <div className="flex-1 px-1 py-2 sm:px-2 lg:px-3 flex flex-col min-h-0">
        {/* En-tête avec couleur orange */}
        <div className="mb-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border-l-4 border-orange-500 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-white"/>
                </div>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-orange-500">
                Gestion des Ressources
              </h1>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowAddHumanModal(true)}
                className="bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Nouvelle personne</span>
                <span className="sm:hidden">Personne</span>
              </button>
              <button 
                onClick={() => setShowAddMaterialModal(true)}
                className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Nouveau matériel</span>
                <span className="sm:hidden">Matériel</span>
              </button>
            </div>
          </div>
          <div className="mt-3 hidden lg:block">
            <p className="text-gray-700 font-medium text-base">
              Inventaire complet des ressources humaines et matérielles
            </p>
            <div className="text-xs text-gray-600 space-y-0.5 mt-1">
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                <strong>Suivi en temps réel :</strong> Disponibilité et état de toutes vos ressources
              </p>
              <p className="flex items-center">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                <strong>Optimisation :</strong> Maximisez l'utilisation de vos moyens
              </p>
            </div>
          </div>
        </div>

        {/* Section principale */}
        <div className="bg-white rounded-xl shadow-sm border px-1 py-4 sm:px-2 lg:px-3 mb-8">
          {/* Onglets */}
          <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('human')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'human'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Ressources Humaines ({humanStats.total})
            </button>
            <button
              onClick={() => setActiveTab('material')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'material'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-4 h-4 inline-block mr-2" />
              Ressources Matérielles ({materialStats.total})
            </button>
          </div>

          {/* Contenu des onglets */}
          {activeTab === 'human' && (
            <>
              {/* Statistiques ressources humaines */}
              <div className="mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <button 
                    onClick={() => setHumanFilter('all')}
                    className={`bg-purple-100 rounded-lg p-2 shadow border hover:bg-purple-200 transition-colors ${
                      humanFilter === 'all' ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                    }`}
                    title="Afficher tous les membres"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Users className="h-6 w-6 text-purple-600" />
                      <div className="text-sm sm:text-lg font-bold text-purple-700">{humanStats.total}</div>
                      <div className="text-xs text-purple-600">Total</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setHumanFilter(humanFilter === 'DISPONIBLE' ? 'all' : 'DISPONIBLE')}
                    className={`bg-green-100 rounded-lg p-2 shadow border hover:bg-green-200 transition-colors ${
                      humanFilter === 'DISPONIBLE' ? 'ring-2 ring-green-500 ring-offset-2' : ''
                    }`}
                    title="Filtrer les membres disponibles"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div className="text-sm sm:text-lg font-bold text-green-700">{humanStats.available}</div>
                      <div className="text-xs text-green-600">Disponibles</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setHumanFilter(humanFilter === 'OCCUPÉ' ? 'all' : 'OCCUPÉ')}
                    className={`bg-yellow-100 rounded-lg p-2 shadow border hover:bg-yellow-200 transition-colors ${
                      humanFilter === 'OCCUPÉ' ? 'ring-2 ring-yellow-500 ring-offset-2' : ''
                    }`}
                    title="Filtrer les membres occupés"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Clock className="h-6 w-6 text-yellow-600" />
                      <div className="text-sm sm:text-lg font-bold text-yellow-700">{humanStats.busy}</div>
                      <div className="text-xs text-yellow-600">Occupés</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setHumanFilter(humanFilter === 'INDISPONIBLE' ? 'all' : 'INDISPONIBLE')}
                    className={`bg-red-100 rounded-lg p-2 shadow border hover:bg-red-200 transition-colors ${
                      humanFilter === 'INDISPONIBLE' ? 'ring-2 ring-red-500 ring-offset-2' : ''
                    }`}
                    title="Filtrer les membres indisponibles"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                      <div className="text-sm sm:text-lg font-bold text-red-700">{humanStats.unavailable}</div>
                      <div className="text-xs text-red-600">Indisponibles</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recherche et filtres ressources humaines */}
              <div className="border-b border-gray-200 pb-3 mb-4">
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-orange-600" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher une personne... (ex: marie, communication, gestion)"
                      value={humanSearchTerm}
                      onChange={(e) => setHumanSearchTerm(e.target.value)}
                      onFocus={() => setShowSearchSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    />
                    
                    {/* Suggestions de recherche */}
                    {showSearchSuggestions && humanSearchTerm.length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="p-3">
                          <p className="text-xs text-gray-500 mb-2">Mots-clés populaires :</p>
                          <div className="flex flex-wrap gap-1">
                            {popularHumanKeywords.map((keyword) => (
                              <button
                                key={keyword}
                                onClick={() => setHumanSearchTerm(keyword)}
                                className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors"
                              >
                                {keyword}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={humanFilter}
                      onChange={(e) => setHumanFilter(e.target.value as 'all' | 'DISPONIBLE' | 'OCCUPÉ' | 'INDISPONIBLE')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      <option value="all">Toutes les disponibilités</option>
                      <option value="DISPONIBLE">Disponible</option>
                      <option value="OCCUPÉ">Occupé</option>
                      <option value="INDISPONIBLE">Indisponible</option>
                    </select>
                  </div>

                  {/* Aide à la recherche */}
                  {humanSearchTerm.length > 0 && (
                    <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-md">
                      💡 <strong>Astuce :</strong> Utilisez plusieurs mots-clés séparés par des espaces pour affiner votre recherche (ex: "marie communication")
                    </div>
                  )}

                  {/* Filtres actifs */}
                  {(humanSearchTerm || humanFilter !== 'all') && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Filtres actifs:</span>
                      {humanSearchTerm && (
                        <span className="inline-flex px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          Recherche: "{humanSearchTerm}"
                        </span>
                      )}
                      {humanFilter !== 'all' && (
                        <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {humanFilter}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setHumanSearchTerm('');
                          setHumanFilter('all');
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        Effacer tout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Liste des ressources humaines */}
              <div>
                {filteredHumanResources.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune ressource humaine</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Commencez par ajouter les personnes de votre association.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHumanResources.map((resource) => (
                      <div key={resource.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 
                                className="font-semibold text-gray-900"
                                dangerouslySetInnerHTML={{
                                  __html: highlightSearchTerms(`${resource.firstName} ${resource.lastName}`, humanSearchTerm)
                                }}
                              />
                              <p 
                                className="text-sm text-gray-600"
                                dangerouslySetInnerHTML={{
                                  __html: highlightSearchTerms(resource.position, humanSearchTerm)
                                }}
                              />
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(resource.availability)}`}>
                            {resource.availability}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {resource.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {resource.phone}
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Compétences</p>
                          <div className="flex flex-wrap gap-1">
                            {resource.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                                {skill}
                              </span>
                            ))}
                            {resource.skills.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                                +{resource.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            Ajouté le {formatDate(resource.addedDate)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-800 transition-colors" 
                              title="Voir les détails"
                              onClick={() => handleViewHumanDetails(resource)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-orange-600 hover:text-orange-800 transition-colors" 
                              title="Modifier"
                              onClick={() => handleEditHumanResource(resource)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-800 transition-colors" 
                              title="Supprimer"
                              onClick={() => handleDeleteRequest('human', resource.id, `${resource.firstName} ${resource.lastName}`)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'material' && (
            <>
              {/* Statistiques ressources matérielles */}
              <div className="mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                  <button 
                    onClick={() => {
                      setMaterialFilter('all');
                      setMaterialAvailabilityFilter('all');
                    }}
                    className={`bg-purple-100 rounded-lg p-2 shadow border hover:bg-purple-200 transition-colors ${
                      materialFilter === 'all' && materialAvailabilityFilter === 'all' ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                    }`}
                    title="Afficher tout le matériel"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Package className="h-6 w-6 text-purple-600" />
                      <div className="text-sm sm:text-lg font-bold text-purple-700">{materialStats.total}</div>
                      <div className="text-xs text-purple-600">Total</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      setMaterialAvailabilityFilter(materialAvailabilityFilter === 'DISPONIBLE' ? 'all' : 'DISPONIBLE');
                      setMaterialFilter('all');
                    }}
                    className={`bg-green-100 rounded-lg p-2 shadow border hover:bg-green-200 transition-colors ${
                      materialAvailabilityFilter === 'DISPONIBLE' ? 'ring-2 ring-green-500 ring-offset-2' : ''
                    }`}
                    title="Filtrer le matériel disponible"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div className="text-sm sm:text-lg font-bold text-green-700">{materialStats.available}</div>
                      <div className="text-xs text-green-600">Disponibles</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      setMaterialAvailabilityFilter(materialAvailabilityFilter === 'UTILISÉ' ? 'all' : 'UTILISÉ');
                      setMaterialFilter('all');
                    }}
                    className={`bg-yellow-100 rounded-lg p-2 shadow border hover:bg-yellow-200 transition-colors ${
                      materialAvailabilityFilter === 'UTILISÉ' ? 'ring-2 ring-yellow-500 ring-offset-2' : ''
                    }`}
                    title="Filtrer le matériel utilisé"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Clock className="h-6 w-6 text-yellow-600" />
                      <div className="text-sm sm:text-lg font-bold text-yellow-700">{materialStats.used}</div>
                      <div className="text-xs text-yellow-600">Utilisés</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      setMaterialAvailabilityFilter(materialAvailabilityFilter === 'EN_MAINTENANCE' ? 'all' : 'EN_MAINTENANCE');
                      setMaterialFilter('all');
                    }}
                    className={`bg-red-100 rounded-lg p-2 shadow border hover:bg-red-200 transition-colors ${
                      materialAvailabilityFilter === 'EN_MAINTENANCE' ? 'ring-2 ring-red-500 ring-offset-2' : ''
                    }`}
                    title="Filtrer le matériel en maintenance"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Wrench className="h-6 w-6 text-red-600" />
                      <div className="text-sm sm:text-lg font-bold text-red-700">{materialStats.maintenance}</div>
                      <div className="text-xs text-red-600">Maintenance</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      setMaterialFilter('all');
                      setMaterialAvailabilityFilter('all');
                    }}
                    className={`bg-blue-100 rounded-lg p-2 shadow border hover:bg-blue-200 transition-colors`}
                    title="Voir la valeur totale du matériel"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                      <div className="text-sm sm:text-lg font-bold text-blue-700">{materialStats.totalValue}€</div>
                      <div className="text-xs text-blue-600">Valeur totale</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recherche et filtres ressources matérielles */}
              <div className="border-b border-gray-200 pb-3 mb-4">
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-orange-600" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher un matériel... (ex: ordinateur, projecteur, hp)"
                      value={materialSearchTerm}
                      onChange={(e) => setMaterialSearchTerm(e.target.value)}
                      onFocus={() => setShowSearchSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    />
                    
                    {/* Suggestions de recherche pour matériel */}
                    {showSearchSuggestions && materialSearchTerm.length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="p-3">
                          <p className="text-xs text-gray-500 mb-2">Mots-clés populaires :</p>
                          <div className="flex flex-wrap gap-1">
                            {popularMaterialKeywords.map((keyword) => (
                              <button
                                key={keyword}
                                onClick={() => setMaterialSearchTerm(keyword)}
                                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                              >
                                {keyword}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <select
                        value={materialFilter}
                        onChange={(e) => setMaterialFilter(e.target.value as 'all' | MaterialCategory)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      >
                        <option value="all">Toutes les catégories</option>
                        {Object.values(MaterialCategoryEnum).map(category => (
                          <option key={category} value={category}>{getCategoryLabel(category)}</option>
                        ))}
                      </select>
                    </div>
                    <select
                      value={materialAvailabilityFilter}
                      onChange={(e) => setMaterialAvailabilityFilter(e.target.value as 'all' | 'DISPONIBLE' | 'UTILISÉ' | 'EN_MAINTENANCE' | 'INDISPONIBLE')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      <option value="all">Toutes les disponibilités</option>
                      <option value="DISPONIBLE">Disponible</option>
                      <option value="UTILISÉ">Utilisé</option>
                      <option value="EN_MAINTENANCE">En maintenance</option>
                      <option value="INDISPONIBLE">Indisponible</option>
                    </select>
                  </div>
                  
                  {/* Filtres rapides par catégorie */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 self-center">Filtres rapides:</span>
                    {[
                      { key: 'INFORMATIQUE', label: 'Informatique', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
                      { key: 'MOBILIER', label: 'Mobilier', color: 'bg-brown-100 text-brown-700 hover:bg-brown-200' },
                      { key: 'AUDIOVISUEL', label: 'Audiovisuel', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
                      { key: 'TRANSPORT', label: 'Transport', color: 'bg-green-100 text-green-700 hover:bg-green-200' }
                    ].map(({ key, label, color }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setMaterialFilter(materialFilter === key ? 'all' : key as MaterialCategory);
                          setMaterialAvailabilityFilter('all');
                        }}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${color} ${
                          materialFilter === key ? 'ring-2 ring-offset-1' : ''
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Aide à la recherche */}
                  {materialSearchTerm.length > 0 && (
                    <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-md">
                      💡 <strong>Astuce :</strong> Recherchez par nom, marque, lieu, responsable ou numéro de série (ex: "hp bureau" ou "projecteur epson")
                    </div>
                  )}

                  {/* Filtres actifs */}
                  {(materialSearchTerm || materialFilter !== 'all' || materialAvailabilityFilter !== 'all') && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Filtres actifs:</span>
                      {materialSearchTerm && (
                        <span className="inline-flex px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          Recherche: "{materialSearchTerm}"
                        </span>
                      )}
                      {materialFilter !== 'all' && (
                        <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {getCategoryLabel(materialFilter as MaterialCategory)}
                        </span>
                      )}
                      {materialAvailabilityFilter !== 'all' && (
                        <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          {materialAvailabilityFilter}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setMaterialSearchTerm('');
                          setMaterialFilter('all');
                          setMaterialAvailabilityFilter('all');
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        Effacer tout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Liste des ressources matérielles */}
              <div>
                {filteredMaterialResources.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune ressource matérielle</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Commencez par ajouter le matériel de votre association.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMaterialResources.map((resource) => (
                      <div key={resource.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 
                              className="font-semibold text-gray-900 mb-1"
                              dangerouslySetInnerHTML={{
                                __html: highlightSearchTerms(resource.name, materialSearchTerm)
                              }}
                            />
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800`}>
                              {getCategoryLabel(resource.category)}
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(resource.availability)}`}>
                            {resource.availability}
                          </span>
                        </div>
                        
                        <p 
                          className="text-sm text-gray-600 mb-3"
                          dangerouslySetInnerHTML={{
                            __html: highlightSearchTerms(resource.description, materialSearchTerm)
                          }}
                        />

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">État:</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getConditionColor(resource.condition)}`}>
                              {resource.condition}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {resource.location}
                          </div>
                          {resource.responsible && (
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              {resource.responsible}
                            </div>
                          )}
                          {resource.currentValue && (
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="w-4 h-4 mr-2" />
                              {resource.currentValue}€
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {resource.purchaseDate ? formatDate(resource.purchaseDate) : 'Date inconnue'}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-800 transition-colors" 
                              title="Voir les détails"
                              onClick={() => handleViewMaterialDetails(resource)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-orange-600 hover:text-orange-800 transition-colors" 
                              title="Modifier"
                              onClick={() => handleEditMaterialResource(resource)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-800 transition-colors" 
                              title="Supprimer"
                              onClick={() => handleDeleteRequest('material', resource.id, resource.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bouton flottant avec menu d'actions */}
      <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
        {showFloatingMenu && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] animate-fadeIn">
            <button
              onClick={() => {
                setShowAddHumanModal(true);
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Users className="h-4 w-4 text-orange-600" />
              <span>Nouvelle Personne</span>
            </button>
            
            <button
              onClick={() => {
                setShowAddMaterialModal(true);
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Package className="h-4 w-4 text-blue-600" />
              <span>Nouveau Matériel</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => {
                setShowExportModal(true);
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Download className="h-4 w-4 text-green-600" />
              <span>Exporter Inventaire</span>
            </button>
          </div>
        )}

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

      {/* Modales */}
      <AddHumanResourceModal
        isOpen={showAddHumanModal}
        onClose={() => setShowAddHumanModal(false)}
        onSave={handleAddHumanResource}
      />

      <AddMaterialResourceModal
        isOpen={showAddMaterialModal}
        onClose={() => setShowAddMaterialModal(false)}
        onSave={handleAddMaterialResource}
      />

      <HumanResourceDetailModal
        isOpen={showHumanDetailModal}
        onClose={() => setShowHumanDetailModal(false)}
        onEdit={handleEditHumanResource}
        resource={selectedHumanResource}
      />

      <MaterialResourceDetailModal
        isOpen={showMaterialDetailModal}
        onClose={() => setShowMaterialDetailModal(false)}
        onEdit={handleEditMaterialResource}
        resource={selectedMaterialResource}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        humanResources={humanResources}
        materialResources={materialResources}
      />

      <EditHumanResourceModal
        isOpen={showEditHumanModal}
        onClose={() => setShowEditHumanModal(false)}
        onUpdate={handleUpdateHumanResource}
        resource={selectedHumanResource}
      />

      <EditMaterialResourceModal
        isOpen={showEditMaterialModal}
        onClose={() => setShowEditMaterialModal(false)}
        onUpdate={handleUpdateMaterialResource}
        resource={selectedMaterialResource}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer cette ressource ${deleteTarget?.type === 'human' ? 'humaine' : 'matérielle'} ?`}
        itemName={deleteTarget?.name}
        type="danger"
      />
    </div>
  );
};

export default ResourcesPage;
