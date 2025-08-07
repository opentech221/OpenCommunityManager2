import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, MapPin, Users, Clock, Download, FileText, Tag } from 'lucide-react';
import type { EventType } from '../types';
import { EventStatus } from '../types';
import { useEvents } from '../hooks/useEvents';
import AddEventModal from '../components/modals/AddEventModal';
import EditEventModal from '../components/modals/EditEventModal';
import EventDetailModal from '../components/modals/EventDetailModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

export default function EventsPage() {
  const { 
    events, 
    isLoading, 
    addEvent, 
    updateEvent, 
    deleteEvent
  } = useEvents();

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventType | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'all' | 'MEETING' | 'SOCIAL' | 'TRAINING'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Calcul des statistiques
  const stats = {
    total: events.length,
    planned: events.filter(e => e.status === EventStatus.PLANNED).length,
    ongoing: events.filter(e => e.status === EventStatus.ONGOING).length,
    completed: events.filter(e => e.status === EventStatus.COMPLETED).length,
    cancelled: events.filter(e => e.status === EventStatus.CANCELLED).length
  };

  // Filtrage des événements
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter;
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Modal handlers
  const handleViewEvent = (event: EventType) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleEditEvent = (event: EventType) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDeleteEvent = (event: EventType) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleAddEvent = async (eventData: Omit<EventType, 'id'>) => {
    try {
      await addEvent(eventData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
    }
  };

  const handleUpdateEvent = async (eventData: EventType) => {
    try {
      await updateEvent(eventData.id, eventData);
      setIsEditModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Erreur lors de la modification de l\'événement:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    
    try {
      await deleteEvent(eventToDelete.id);
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
    }
  };

  // Helper functions
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'Date non renseignée';
    
    let dateObj: Date;
    
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      return 'Date invalide';
    }
    
    // Vérifier si la date est valide
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case EventStatus.PLANNED: return 'Planifié';
      case EventStatus.ONGOING: return 'En cours';
      case EventStatus.COMPLETED: return 'Terminé';
      case EventStatus.CANCELLED: return 'Annulé';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case EventStatus.PLANNED: return 'bg-blue-100 text-blue-800 border-blue-200';
      case EventStatus.ONGOING: return 'bg-green-100 text-green-800 border-green-200';
      case EventStatus.COMPLETED: return 'bg-gray-100 text-gray-800 border-gray-200';
      case EventStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'MEETING': return 'Réunion';
      case 'SOCIAL': return 'Social';
      case 'TRAINING': return 'Formation';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MEETING': return 'bg-purple-100 text-purple-800';
      case 'SOCIAL': return 'bg-green-100 text-green-800';
      case 'TRAINING': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-900 p-0 sm:p-0 md:p-0 lg:p-0">
      {/* En-tête */}
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
            className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm sm:text-base"
            onClick={() => setIsAddModalOpen(true)}
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
      <div className="bg-white px-4 py-4 sm:px-6 lg:px-8 mb-6 mx-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <button 
            className={`bg-purple-100 rounded-lg p-3 shadow hover:bg-purple-200 transition-colors border ${
              statusFilter === 'ALL' ? 'ring-2 ring-violet-500' : ''
            }`}
            onClick={() => setStatusFilter('ALL')}
            aria-label="Afficher tous les événements"
          >
            <div className="text-lg sm:text-xl font-bold text-purple-700">{stats.total}</div>
            <div className="text-xs sm:text-sm text-gray-500">Total</div>
          </button>
          <button 
            className={`bg-blue-100 rounded-lg p-3 shadow hover:bg-blue-200 transition-colors border ${
              statusFilter === EventStatus.PLANNED ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === EventStatus.PLANNED ? 'ALL' : EventStatus.PLANNED)}
            aria-label="Filtrer les événements planifiés"
          >
            <div className="text-lg sm:text-xl font-bold text-blue-600">{stats.planned}</div>
            <div className="text-xs sm:text-sm text-blue-600">Planifiés</div>
          </button>
          <button 
            className={`bg-green-100 rounded-lg p-3 shadow hover:bg-green-200 transition-colors border ${
              statusFilter === EventStatus.ONGOING ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === EventStatus.ONGOING ? 'ALL' : EventStatus.ONGOING)}
            aria-label="Filtrer les événements en cours"
          >
            <div className="text-lg sm:text-xl font-bold text-green-600">{stats.ongoing}</div>
            <div className="text-xs sm:text-sm text-green-600">En cours</div>
          </button>
          <button 
            className={`bg-gray-100 rounded-lg p-3 shadow hover:bg-gray-200 transition-colors border ${
              statusFilter === EventStatus.COMPLETED ? 'ring-2 ring-gray-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === EventStatus.COMPLETED ? 'ALL' : EventStatus.COMPLETED)}
            aria-label="Filtrer les événements terminés"
          >
            <div className="text-lg sm:text-xl font-bold text-gray-600">{stats.completed}</div>
            <div className="text-xs sm:text-sm text-gray-600">Terminés</div>
          </button>
          <button 
            className={`bg-red-100 rounded-lg p-3 shadow hover:bg-red-200 transition-colors border ${
              statusFilter === EventStatus.CANCELLED ? 'ring-2 ring-red-500' : ''
            }`}
            onClick={() => setStatusFilter(statusFilter === EventStatus.CANCELLED ? 'ALL' : EventStatus.CANCELLED)}
            aria-label="Filtrer les événements annulés"
          >
            <div className="text-lg sm:text-xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-xs sm:text-sm text-red-600">Annulés</div>
          </button>
        </div>
      </div>

      {/* Section de recherche et filtres */}
      <div className="bg-white px-4 py-4 sm:px-6 lg:px-8 mb-6 mx-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par titre, description ou lieu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as 'all' | 'MEETING' | 'SOCIAL' | 'TRAINING')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Tous les types</option>
                  <option value="MEETING">Réunion</option>
                  <option value="SOCIAL">Social</option>
                  <option value="TRAINING">Formation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value={EventStatus.PLANNED}>Planifié</option>
                  <option value={EventStatus.ONGOING}>En cours</option>
                  <option value={EventStatus.COMPLETED}>Terminé</option>
                  <option value={EventStatus.CANCELLED}>Annulé</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des événements */}
      <div className="bg-white px-4 py-6 sm:px-6 lg:px-8 mx-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'all'
                ? "Aucun événement ne correspond à vos critères de recherche."
                : "Commencez par créer votre premier événement."}
            </p>
            {(!searchTerm && statusFilter === 'ALL' && typeFilter === 'all') && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Créer un événement
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                        {getStatusLabel(event.status)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                        <Tag className="w-3 h-3 mr-1" />
                        {getTypeLabel(event.type)}
                      </span>
                    </div>
                  </div>
                </div>

                {event.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  {event.participants && event.participants.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {event.participants.length} participant{event.participants.length > 1 ? 's' : ''}
                      {event.maxParticipants && ` / ${event.maxParticipants} max`}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleViewEvent(event)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Voir les détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions en bas de page */}
      <div className="bg-white px-4 py-4 sm:px-6 lg:px-8 mt-6 mx-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-600">
            {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} affiché{filteredEvents.length > 1 ? 's' : ''}
            {stats.total !== filteredEvents.length && ` sur ${stats.total} au total`}
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              Rapport
            </button>
          </div>
        </div>
      </div>

      {/* Modaux */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEvent}
      />

      {selectedEvent && (
        <>
          <EventDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            event={selectedEvent}
            onEdit={() => {
              setIsDetailModalOpen(false);
              setIsEditModalOpen(true);
            }}
          />

          <EditEventModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            event={selectedEvent}
            onUpdate={handleUpdateEvent}
          />
        </>
      )}

      {eventToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Supprimer l'événement"
          message={`Êtes-vous sûr de vouloir supprimer l'événement "${eventToDelete.title}" ? Cette action est irréversible.`}
        />
      )}
    </div>
  );
}
