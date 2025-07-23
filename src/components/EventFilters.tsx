import React, { useState } from 'react';
import { Search, Filter, Calendar, Users, Tag, Clock } from 'lucide-react';

interface EventFiltersProps {
  onFiltersChange: (filters: EventFilters) => void;
  totalEvents: number;
  filteredCount: number;
}

interface EventFilters {
  search?: string;
  type?: 'all' | 'MEETING' | 'SOCIAL' | 'TRAINING';
  status?: 'all' | 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  dateRange?: 'all' | 'upcoming' | 'past' | 'thisWeek' | 'thisMonth' | 'thisYear';
  startDate?: Date;
  endDate?: Date;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  onFiltersChange,
  totalEvents,
  filteredCount
}) => {
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      search: '',
      type: 'all' as const,
      status: 'all' as const,
      dateRange: 'all' as const
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-violet-600" />
          Filtres d'événements
        </h3>
        <div className="text-sm text-gray-500">
          {filteredCount} sur {totalEvents} événements
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Rechercher par titre, description ou lieu..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      {/* Filtres rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Type d'événement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            Type
          </label>
          <select
            value={filters.type || 'all'}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="MEETING">Réunions</option>
            <option value="SOCIAL">Événements sociaux</option>
            <option value="TRAINING">Formations</option>
          </select>
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Statut
          </label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="PLANNED">Planifié</option>
            <option value="ONGOING">En cours</option>
            <option value="COMPLETED">Terminé</option>
            <option value="CANCELLED">Annulé</option>
          </select>
        </div>

        {/* Plage de dates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Période
          </label>
          <select
            value={filters.dateRange || 'all'}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="all">Toutes les dates</option>
            <option value="upcoming">À venir</option>
            <option value="past">Passés</option>
            <option value="thisWeek">Cette semaine</option>
            <option value="thisMonth">Ce mois-ci</option>
            <option value="thisYear">Cette année</option>
          </select>
        </div>
      </div>

      {/* Filtres avancés */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-violet-600 hover:text-violet-700 font-medium mb-3"
        >
          {showAdvanced ? 'Masquer' : 'Afficher'} les filtres avancés
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date de début personnalisée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                À partir du
              </label>
              <input
                type="date"
                value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Date de fin personnalisée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jusqu'au
              </label>
              <input
                type="date"
                value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-4">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default EventFilters;
