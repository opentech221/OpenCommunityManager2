import { useState } from 'react';
import { Plus, Search, Calendar, MapPin, Users, Eye, Edit, Trash2 } from 'lucide-react';
import type { EventType } from '../types';

// Données de démonstration pour les événements
const mockEvents: EventType[] = [
  {
    id: '1',
    title: 'Assemblée Générale Ordinaire 2025',
    description: 'Présentation du bilan financier et moral de l\'association, élection du nouveau bureau.',
    startDate: new Date('2025-03-15T14:00:00'),
    location: 'Salle polyvalente - Dakar',
    type: 'MEETING',
    status: 'PLANNED',
    maxParticipants: 100,
    associationId: 'assoc-1',
    createdBy: 'user-1',
    participants: [
      {
        memberId: '1',
        registrationDate: new Date('2025-02-10'),
        attended: false
      },
      {
        memberId: '2',
        registrationDate: new Date('2025-02-12'),
        attended: false
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Journée de sensibilisation sur l\'environnement',
    description: 'Campagne de sensibilisation et de nettoyage dans le quartier.',
    startDate: new Date('2025-04-22T09:00:00'),
    location: 'Place publique - Quartier Médina',
    type: 'SOCIAL',
    status: 'PLANNED',
    maxParticipants: 50,
    associationId: 'assoc-1',
    createdBy: 'user-1',
    participants: [
      {
        memberId: '1',
        registrationDate: new Date('2025-03-01'),
        attended: false
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Formation en informatique',
    description: 'Session de formation en informatique de base pour les membres.',
    startDate: new Date('2025-02-28T10:00:00'),
    location: 'Centre de formation - Rufisque',
    type: 'TRAINING',
    status: 'COMPLETED',
    maxParticipants: 25,
    associationId: 'assoc-1',
    createdBy: 'user-1',
    participants: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function EventsPage() {
  const [events] = useState<EventType[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [showAddModal, setShowAddModal] = useState(false);

  const now = new Date();
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter === 'upcoming') {
      matchesDate = event.startDate > now;
    } else if (dateFilter === 'past') {
      matchesDate = event.startDate < now;
    }
    
    return matchesSearch && matchesDate;
  });

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

  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Statistiques
  const upcomingEvents = events.filter(e => e.startDate > now).length;
  const totalParticipants = events.reduce((sum, e) => sum + e.participants.length, 0);
  const averageParticipants = events.length > 0 ? Math.round(totalParticipants / events.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-montserrat font-bold text-gray-900 mb-2">
          Gestion des événements
        </h1>
        <p className="text-gray-600">
          Planifiez et organisez les activités de votre association
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Événements à venir</h3>
          <p className="text-3xl font-bold text-blue-600">{upcomingEvents}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total événements</h3>
          <p className="text-3xl font-bold text-gray-900">{events.length}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Participants inscrits</h3>
          <p className="text-3xl font-bold text-green-600">{totalParticipants}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Moyenne par événement</h3>
          <p className="text-3xl font-bold text-purple-600">{averageParticipants}</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
              />
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as 'upcoming' | 'past' | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                title="Filtrer par date"
                aria-label="Filtrer par date"
              >
                <option value="upcoming">Événements à venir</option>
                <option value="past">Événements passés</option>
                <option value="all">Tous les événements</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel événement
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const eventStatus = getEventStatus(event.startDate);
          
          return (
            <div key={event.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${eventStatus.className}`}>
                    {eventStatus.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    title="Voir les détails"
                    aria-label="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Modifier"
                    aria-label="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    title="Supprimer"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {event.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatEventDate(event.startDate)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {event.participants.length} / {event.maxParticipants} participants
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ 
                    width: `${(event.participants.length / event.maxParticipants) * 100}%` 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun événement trouvé</p>
        </div>
      )}

      {/* Add Event Modal - TODO: Implement */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Créer un événement</h3>
            <p className="text-gray-600 mb-4">Fonctionnalité à implémenter...</p>
            <button
              onClick={() => setShowAddModal(false)}
              className="btn-primary"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}