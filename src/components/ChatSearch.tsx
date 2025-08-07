import React, { useState, useEffect } from 'react';
import { Search, X, ChevronUp, ChevronDown, Calendar } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  type: 'sent' | 'received';
}

interface MessageSearchProps {
  messages: Message[];
  onMessageSelect: (messageId: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const MessageSearch: React.FC<MessageSearchProps> = ({
  messages,
  onMessageSelect,
  isVisible,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [dateFilter, setDateFilter] = useState('');
  const [senderFilter, setSenderFilter] = useState('');

  // Filtrer les messages en fonction des critères de recherche
  useEffect(() => {
    if (!searchTerm.trim() && !dateFilter && !senderFilter) {
      setSearchResults([]);
      return;
    }

    let filtered = messages;

    // Filtrer par texte
    if (searchTerm.trim()) {
      filtered = filtered.filter(message =>
        message.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(message => {
        const messageDate = new Date(message.timestamp);
        return messageDate.toDateString() === filterDate.toDateString();
      });
    }

    // Filtrer par expéditeur
    if (senderFilter) {
      filtered = filtered.filter(message =>
        message.sender.toLowerCase().includes(senderFilter.toLowerCase())
      );
    }

    setSearchResults(filtered);
    setCurrentResultIndex(0);
  }, [searchTerm, dateFilter, senderFilter, messages]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const navigateResults = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = currentResultIndex < searchResults.length - 1 
        ? currentResultIndex + 1 
        : 0;
    } else {
      newIndex = currentResultIndex > 0 
        ? currentResultIndex - 1 
        : searchResults.length - 1;
    }
    
    setCurrentResultIndex(newIndex);
    onMessageSelect(searchResults[newIndex].id);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Obtenir la liste unique des expéditeurs
  const uniqueSenders = [...new Set(messages.map(m => m.sender))];

  if (!isVisible) return null;

  return (
    <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
      <div className="p-4">
        {/* Barre de recherche principale */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans les messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          {/* Navigation des résultats */}
          {searchResults.length > 0 && (
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1">
              <span className="text-xs text-gray-600 whitespace-nowrap">
                {currentResultIndex + 1} / {searchResults.length}
              </span>
              <button
                onClick={() => navigateResults('prev')}
                disabled={searchResults.length <= 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => navigateResults('next')}
                disabled={searchResults.length <= 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filtres avancés */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <Calendar size={14} className="text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
          
          <select
            value={senderFilter}
            onChange={(e) => setSenderFilter(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded"
          >
            <option value="">Tous les expéditeurs</option>
            {uniqueSenders.map(sender => (
              <option key={sender} value={sender}>{sender}</option>
            ))}
          </select>

          {/* Bouton pour effacer les filtres */}
          {(dateFilter || senderFilter) && (
            <button
              onClick={() => {
                setDateFilter('');
                setSenderFilter('');
              }}
              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
            >
              Effacer filtres
            </button>
          )}
        </div>

        {/* Résultats de recherche */}
        {searchTerm.trim() && (
          <div className="border-t pt-3">
            {searchResults.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucun message trouvé pour "{searchTerm}"
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="text-xs font-medium text-gray-700 mb-2">
                  {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                </h4>
                
                {searchResults.map((message, index) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setCurrentResultIndex(index);
                      onMessageSelect(message.id);
                    }}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      index === currentResultIndex
                        ? 'bg-orange-100 border border-orange-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        {message.sender}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {highlightText(message.text, searchTerm)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
