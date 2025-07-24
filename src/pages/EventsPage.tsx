import { useState } from 'react';
import EventForm from '../components/EventForm';
import { Plus, Search, Calendar, MapPin, Users, Eye, Edit, Trash2, Clock, Filter } from 'lucide-react';
import type { EventType } from '../types';
import { useEvents } from '../hooks/useEvents';

export default function EventsPage() {
  const { 
    events, 
    isLoading, 
    addEvent, 
    updateEvent, 
    deleteEvent,
    filterEvents
  } = useEvents();
  
  // States pour l'interface
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalEvent, setModalEvent] = useState<EventType | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  
  // States pour les filtres simples
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [typeFilter, setTypeFilter] = useState<'all' | 'MEETING' | 'SOCIAL' | 'TRAINING'>('all');

  // Logique de filtrage simple
  const filteredEvents = filterEvents({
    search: searchTerm,
    type: typeFilter === 'all' ? undefined : typeFilter,
    dateRange: dateFilter === 'all' ? undefined : dateFilter
  });

  // Handlers CRUD utilisant le hook
  const handleAddEvent = async (newEvent: Omit<EventType, 'id'>) => {
    try {
      await addEvent(newEvent);
      setFeedback('Événement ajouté avec succès');
      setShowModal(false);
    } catch {
      setFeedback('Erreur lors de l\'ajout de l\'événement');
    }
  };

  const handleEditEvent = async (updatedEvent: EventType) => {
    try {
      await updateEvent(updatedEvent.id, updatedEvent);
      setFeedback('Événement modifié avec succès');
      setShowModal(false);
    } catch {
      setFeedback('Erreur lors de la modification de l\'événement');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      setFeedback('Événement supprimé avec succès');
    } catch {
      setFeedback('Erreur lors de la suppression de l\'événement');
    }
  };

  // Modal form (simplifié)
  const openAddModal = () => {
    setModalEvent(null);
    setShowModal(true);
  };
  const openEditModal = (event: EventType) => {
    setModalEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalEvent(null);
  };

  // Helpers
  // Fonction utilitaire pour formater les dates de manière sûre
  const formatDate = (date: Date | string, options: Intl.DateTimeFormatOptions) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return 'Date invalide';
      }
      return dateObj.toLocaleDateString('fr-FR', options);
    } catch {
      return 'Date invalide';
    }
  };

  const formatTime = (date: Date | string, options: Intl.DateTimeFormatOptions) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return 'Heure invalide';
      }
      return dateObj.toLocaleTimeString('fr-FR', options);
    } catch {
      return 'Heure invalide';
    }
  };
  const getEventStatus = (eventDate: Date) => {
    const today = new Date();
    if (eventDate > today) {
      return { status: 'upcoming', label: 'À venir', className: 'bg-blue-100 text-blue-800' };
    } else if (eventDate.toDateString() === today.toDateString()) {
      return { status: 'today', label: 'Aujourd\'hui', className: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'past', label: 'Passé', className: 'bg-gray-100 text-gray-800' };
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'MEETING': return 'Réunion';
      case 'SOCIAL': return 'Social';
      case 'TRAINING': return 'Formation';
      default: return type;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'MEETING': return 'bg-purple-100 text-purple-800';
      case 'SOCIAL': return 'bg-green-100 text-green-800';
      case 'TRAINING': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventStats = () => {
    const now = new Date();
    
    const upcoming = events.filter(event => {
      const eventDate = event.startDate instanceof Date ? event.startDate : new Date(event.startDate);
      return eventDate > now;
    }).length;
    
    const past = events.filter(event => {
      const eventDate = event.startDate instanceof Date ? event.startDate : new Date(event.startDate);
      return eventDate < now;
    }).length;
    
    const thisMonth = events.filter(event => {
      const eventDate = event.startDate instanceof Date ? event.startDate : new Date(event.startDate);
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    }).length;
    
    return { upcoming, past, thisMonth, total: events.length };
  };

  const stats = getEventStats();

  // Affichage du loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Feedback */}
      {feedback && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg mx-4 mt-4 mb-2 text-center font-medium">
          {feedback}
          <button className="ml-2 text-xs text-green-700 underline" onClick={() => setFeedback('')}>Fermer</button>
        </div>
      )}
      {/* En-tête Mobile-First */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Événements
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Gérez les événements de votre association
              </p>
            </div>
            <button
              className="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
              onClick={openAddModal}
              aria-label="ouvrir modal ajout événement"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Nouvel événement</span>
              <span className="sm:hidden">Nouveau</span>
            </button>
          </div>
          
          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-purple-600">{stats.total}</div>
              <div className="text-xs sm:text-sm text-purple-600">Total</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-blue-600">{stats.upcoming}</div>
              <div className="text-xs sm:text-sm text-blue-600">À venir</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-green-600">{stats.thisMonth}</div>
              <div className="text-xs sm:text-sm text-green-600">Ce mois</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-gray-600">{stats.past}</div>
              <div className="text-xs sm:text-sm text-gray-600">Passés</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recherche et filtres mobiles */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Filtres rapides */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <button
              onClick={() => setDateFilter('upcoming')}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateFilter === 'upcoming' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setDateFilter('past')}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateFilter === 'past' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Passés
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateFilter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0 flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'événement</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="all">Tous les types</option>
                  <option value="MEETING">Réunion</option>
                  <option value="SOCIAL">Social</option>
                  <option value="TRAINING">Formation</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Liste des événements - Mobile First */}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-gray-500 text-lg mt-2">Aucun événement trouvé</div>
            <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const eventStatus = getEventStatus(event.startDate);
              const participantCount = event.participants?.length || 0;
              return (
                <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)}`}>
                            {getEventTypeLabel(event.type)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${eventStatus.className}`}>
                            {eventStatus.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    {/* Informations détaillées */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {formatDate(event.startDate, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {formatTime(event.startDate, {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {participantCount} / {event.maxParticipants || '∞'} participants
                        </span>
                      </div>
                    </div>
                    {/* Barre de progression des participants */}
                    {event.maxParticipants && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Participants</span>
                          <span>{Math.round((participantCount / event.maxParticipants) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((participantCount / event.maxParticipants) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                          onClick={() => openEditModal(event)}
                          aria-label="modifier l'événement"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </button>
                      </div>
                      <button
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                        onClick={() => handleDeleteEvent(event.id)}
                        aria-label="supprimer l'événement"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal ajout/modification événement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">{modalEvent ? 'Modifier' : 'Ajouter'} un événement</h2>
            <EventForm
              event={modalEvent}
              onSave={modalEvent ? handleEditEvent : handleAddEvent}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      {/* Pagination mobile */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{filteredEvents.length}</span> sur <span className="font-medium">{events.length}</span> événements
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 border border-gray-300 rounded-md">
              Précédent
            </button>
            <button className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md">
              1
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 border border-gray-300 rounded-md">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
