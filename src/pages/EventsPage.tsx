import React, { useState } from 'react';
import EventForm from '../components/EventForm';
import { Plus, Search, Calendar, MapPin, Users, Eye, Edit, Trash2, Clock, Filter } from 'lucide-react';
import type { EventType } from '../types';
import { EventStatus } from '../types';
import { useEvents } from '../hooks/useEvents';

export default function EventsPage() {
  const { 
    events, 
    isLoading, 
    addEvent, 
    updateEvent, 
    deleteEvent
  } = useEvents();
  
  // States pour l'interface
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalEvent, setModalEvent] = useState<EventType | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  
  // States pour les filtres simples
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'all' | 'MEETING' | 'SOCIAL' | 'TRAINING'>('all');

  // Logique de filtrage simple
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handler unifié pour ajouter et modifier
  const handleSaveEvent = async (eventData: EventType | Omit<EventType, 'id'>) => {
    try {
      if (modalEvent) {
        // Mode modification - eventData doit avoir un ID
        const fullEvent = eventData as EventType;
        await updateEvent(fullEvent.id, fullEvent);
        setFeedback('Événement modifié avec succès');
      } else {
        // Mode ajout - eventData n'a pas d'ID
        const newEvent = eventData as Omit<EventType, 'id'>;
        await addEvent(newEvent);
        setFeedback('Événement ajouté avec succès');
      }
      setShowModal(false);
      setModalEvent(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const action = modalEvent ? 'modification' : 'ajout';
      setFeedback(`Erreur lors de l'${action} de l'événement`);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    // Demander confirmation avant suppression
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }
    
    try {
      await deleteEvent(id);
      setFeedback('Événement supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
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
    const eventDateObj = typeof eventDate === 'string' ? new Date(eventDate) : eventDate;
    
    // Vérifier que la date est valide
    if (!eventDateObj || isNaN(eventDateObj.getTime())) {
      return { status: 'unknown', label: 'Date invalide', className: 'bg-gray-100 text-gray-800' };
    }
    
    if (eventDateObj > today) {
      return { status: 'upcoming', label: 'À venir', className: 'bg-blue-100 text-blue-800' };
    } else if (eventDateObj.toDateString() === today.toDateString()) {
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
    const total = events.length;
    const planned = events.filter(event => event.status === EventStatus.PLANNED).length;
    const ongoing = events.filter(event => event.status === EventStatus.ONGOING).length;
    const completed = events.filter(event => event.status === EventStatus.COMPLETED).length;
    const cancelled = events.filter(event => event.status === EventStatus.CANCELLED).length;
    
    return { total, planned, ongoing, completed, cancelled };
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

  // Fonction pour le bouton flottant d'ajout
  const handleAddNew = () => {
    openAddModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Feedback */}
      {feedback && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg mx-4 mt-4 mb-2 text-center font-medium">
          {feedback}
          <button className="ml-2 text-xs text-green-700 underline" onClick={() => setFeedback('')}>Fermer</button>
        </div>
      )}
      {/* En-tête décoré avec couleur orange */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-6 sm:px-6 lg:px-8 border-l-4 border-orange-500 rounded-lg shadow-sm mb-6 mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">
              Gestion des Événements
            </h1>
          </div>
          <button
            className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm sm:text-base shadow-sm hover:shadow-md"
            onClick={openAddModal}
            aria-label="ouvrir modal ajout événement"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Nouvel événement</span>
            <span className="sm:hidden">Nouveau</span>
          </button>
        </div>
        <div className="mt-4 hidden md:block">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Créez des expériences mémorables pour votre communauté
          </p>
          <div className="text-xs text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Planification optimale :</strong> Calendrier intelligent et gestion des inscriptions
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Engagement maximal :</strong> Communication automatisée et suivi des participants
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques avec boutons fonctionnels */}
      <div className="bg-orange-50 px-4 py-4 sm:px-6 lg:px-8 mb-6 mx-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button 
            className={`bg-purple-100 rounded-lg p-3 shadow hover:bg-purple-200 transition-colors border ${
              statusFilter === 'ALL' ? 'ring-2 ring-violet-500' : ''
            }`}
            onClick={() => setStatusFilter('ALL')}
            aria-label="Afficher tous les événements"
          >
            <div className="text-lg sm:text-xl font-bold text-purple-800">{stats.total}</div>
            <div className="text-xs sm:text-sm text-purple-600">Total</div>
          </button>
          <button 
            className={`bg-green-100 rounded-lg p-3 shadow hover:bg-green-200 transition-colors ${
              statusFilter === EventStatus.PLANNED ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === EventStatus.PLANNED ? 'ALL' : EventStatus.PLANNED)}
            aria-label="Filtrer les événements planifiés"
          >
            <div className="text-lg sm:text-xl font-bold text-green-600">{stats.planned}</div>
            <div className="text-xs sm:text-sm text-green-600">Planifiés</div>
          </button>
          <button 
            className={`bg-yellow-100 rounded-lg p-3 shadow hover:bg-yellow-200 transition-colors ${
              statusFilter === EventStatus.ONGOING ? 'ring-2 ring-yellow-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === EventStatus.ONGOING ? 'ALL' : EventStatus.ONGOING)}
            aria-label="Filtrer les événements en cours"
          >
            <div className="text-lg sm:text-xl font-bold text-yellow-600">{stats.ongoing}</div>
            <div className="text-xs sm:text-sm text-yellow-600">En cours</div>
          </button>
          <button 
            className={`bg-red-100 rounded-lg p-3 shadow hover:bg-red-200 transition-colors ${
              statusFilter === EventStatus.COMPLETED ? 'ring-2 ring-red-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === EventStatus.COMPLETED ? 'ALL' : EventStatus.COMPLETED)}
            aria-label="Filtrer les événements terminés"
          >
            <div className="text-lg sm:text-xl font-bold text-red-600">{stats.completed}</div>
            <div className="text-xs sm:text-sm text-red-600">Terminés</div>
          </button>
        </div>
      </div>

      {/* Recherche et filtres mobiles */}
      <div className="bg-orange-50 border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Filtres rapides */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0 flex items-center space-x-2 px-3 py-2 border border-purple-700 bg-purple-200 rounded-lg hover:bg-purple-300 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <div className="p-4 bg-purple-100 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'événement</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                  className="block w-full px-3 py-2 border border-purple-700 bg-purple-200 hover:bg-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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
                          <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors">
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </button>
                          <button
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors"
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
      </div>

      {/* Modal ajout/modification événement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">{modalEvent ? 'Modifier' : 'Ajouter'} un événement</h2>
            <EventForm
              event={modalEvent}
              onSave={handleSaveEvent}
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
            <button className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded-md">
              1
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 border border-gray-300 rounded-md">
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Bouton flottant d'ajout - Mobile First */}
      <button
        onClick={handleAddNew}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors z-10"
        aria-label="Ajouter une cotisation"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
