import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface AdvancedSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder: string;
  suggestions: string[];
  filters?: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }[];
  onClearAll?: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  searchTerm,
  onSearchChange,
  placeholder,
  suggestions,
  filters = [],
  onClearAll
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filters.some(filter => filter.value !== 'all');

  return (
    <div className="space-y-3">
      {/* Barre de recherche principale */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-orange-600" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
        />
        
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Suggestions de recherche */}
        {showSuggestions && searchTerm.length === 0 && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-fadeIn">
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-2">Mots-clés populaires :</p>
              <div className="flex flex-wrap gap-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSearchChange(suggestion)}
                    className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filtres */}
      {filters.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-orange-50 border-orange-200 text-orange-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filtres</span>
              {hasActiveFilters && (
                <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {filters.filter(f => f.value !== 'all').length}
                </span>
              )}
            </button>
          </div>

          {(searchTerm || hasActiveFilters) && (
            <button
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Effacer tout
            </button>
          )}
        </div>
      )}

      {/* Panel de filtres */}
      {showFilters && filters.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-slideUp">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtres actifs */}
      {(searchTerm || hasActiveFilters) && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-xs text-gray-500">Filtres actifs:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
              <Search className="w-3 h-3 mr-1" />
              "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 text-orange-600 hover:text-orange-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters
            .filter(filter => filter.value !== 'all')
            .map((filter, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                <Filter className="w-3 h-3 mr-1" />
                {filter.options.find(opt => opt.value === filter.value)?.label}
                <button
                  onClick={() => filter.onChange('all')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
        </div>
      )}

      {/* Aide à la recherche */}
      {searchTerm.length > 0 && (
        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-md">
          💡 <strong>Astuce :</strong> Utilisez plusieurs mots-clés séparés par des espaces pour affiner votre recherche
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
