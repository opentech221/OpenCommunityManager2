import { useState, useMemo } from 'react';
import type { HumanResourceType, MaterialResourceType, MaterialCategory } from '../types';

export const useResourceManagement = (
  initialHumanResources: HumanResourceType[],
  initialMaterialResources: MaterialResourceType[]
) => {
  // États des ressources
  const [humanResources, setHumanResources] = useState<HumanResourceType[]>(initialHumanResources);
  const [materialResources, setMaterialResources] = useState<MaterialResourceType[]>(initialMaterialResources);

  // États des filtres
  const [humanSearchTerm, setHumanSearchTerm] = useState('');
  const [materialSearchTerm, setMaterialSearchTerm] = useState('');
  const [humanFilter, setHumanFilter] = useState<'all' | 'DISPONIBLE' | 'OCCUPÉ' | 'INDISPONIBLE'>('all');
  const [materialFilter, setMaterialFilter] = useState<'all' | MaterialCategory>('all');
  const [materialAvailabilityFilter, setMaterialAvailabilityFilter] = useState<'all' | 'DISPONIBLE' | 'UTILISÉ' | 'EN_MAINTENANCE' | 'INDISPONIBLE'>('all');

  // Fonctions utilitaires
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

  // Filtrage des ressources humaines
  const filteredHumanResources = useMemo(() => {
    return humanResources.filter(resource => {
      const matchesFilter = humanFilter === 'all' || resource.availability === humanFilter;
      
      if (!humanSearchTerm) {
        return matchesFilter;
      }

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
      return matchesSearch && matchesFilter;
    });
  }, [humanResources, humanSearchTerm, humanFilter]);

  // Filtrage des ressources matérielles
  const filteredMaterialResources = useMemo(() => {
    return materialResources.filter(resource => {
      const matchesCategory = materialFilter === 'all' || resource.category === materialFilter;
      const matchesAvailability = materialAvailabilityFilter === 'all' || resource.availability === materialAvailabilityFilter;
      
      if (!materialSearchTerm) {
        return matchesCategory && matchesAvailability;
      }

      const searchTerms = materialSearchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
      
      const searchableFields = [
        resource.name.toLowerCase(),
        resource.description.toLowerCase(),
        resource.location.toLowerCase(),
        resource.responsible?.toLowerCase() || '',
        resource.serialNumber?.toLowerCase() || '',
        resource.notes?.toLowerCase() || '',
        resource.category.toLowerCase(),
        resource.availability.toLowerCase(),
        resource.condition.toLowerCase()
      ].join(' ');

      const matchesSearch = searchTerms.every(term => searchableFields.includes(term));
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [materialResources, materialSearchTerm, materialFilter, materialAvailabilityFilter]);

  // Statistiques
  const humanStats = useMemo(() => ({
    total: humanResources.length,
    available: humanResources.filter(r => r.availability === 'DISPONIBLE').length,
    busy: humanResources.filter(r => r.availability === 'OCCUPÉ').length,
    unavailable: humanResources.filter(r => r.availability === 'INDISPONIBLE').length
  }), [humanResources]);

  const materialStats = useMemo(() => ({
    total: materialResources.length,
    available: materialResources.filter(r => r.availability === 'DISPONIBLE').length,
    used: materialResources.filter(r => r.availability === 'UTILISÉ').length,
    maintenance: materialResources.filter(r => r.availability === 'EN_MAINTENANCE').length,
    totalValue: materialResources.reduce((sum, r) => sum + (r.currentValue || 0), 0)
  }), [materialResources]);

  // Actions CRUD
  const addHumanResource = (resource: Omit<HumanResourceType, 'id'>) => {
    const newResource: HumanResourceType = {
      ...resource,
      id: `human_${Date.now()}`
    };
    setHumanResources(prev => [...prev, newResource]);
    return newResource;
  };

  const addMaterialResource = (resource: Omit<MaterialResourceType, 'id'>) => {
    const newResource: MaterialResourceType = {
      ...resource,
      id: `material_${Date.now()}`
    };
    setMaterialResources(prev => [...prev, newResource]);
    return newResource;
  };

  const deleteHumanResource = (id: string) => {
    setHumanResources(prev => prev.filter(r => r.id !== id));
  };

  const deleteMaterialResource = (id: string) => {
    setMaterialResources(prev => prev.filter(r => r.id !== id));
  };

  const updateHumanResource = (id: string, updates: Partial<HumanResourceType>) => {
    setHumanResources(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const updateMaterialResource = (id: string, updates: Partial<MaterialResourceType>) => {
    setMaterialResources(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  // Fonctions de nettoyage des filtres
  const clearHumanFilters = () => {
    setHumanSearchTerm('');
    setHumanFilter('all');
  };

  const clearMaterialFilters = () => {
    setMaterialSearchTerm('');
    setMaterialFilter('all');
    setMaterialAvailabilityFilter('all');
  };

  const clearAllFilters = () => {
    clearHumanFilters();
    clearMaterialFilters();
  };

  return {
    // Données
    humanResources,
    materialResources,
    filteredHumanResources,
    filteredMaterialResources,
    humanStats,
    materialStats,

    // Filtres
    humanSearchTerm,
    setHumanSearchTerm,
    materialSearchTerm,
    setMaterialSearchTerm,
    humanFilter,
    setHumanFilter,
    materialFilter,
    setMaterialFilter,
    materialAvailabilityFilter,
    setMaterialAvailabilityFilter,

    // Actions
    addHumanResource,
    addMaterialResource,
    deleteHumanResource,
    deleteMaterialResource,
    updateHumanResource,
    updateMaterialResource,

    // Utilitaires
    highlightSearchTerms,
    clearHumanFilters,
    clearMaterialFilters,
    clearAllFilters
  };
};
