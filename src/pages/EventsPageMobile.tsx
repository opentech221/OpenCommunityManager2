import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, MapPin, Users, Clock, MoreVertical } from 'lucide-react';
import type { EventType } from '../types';
import { formatDate } from '../utils';

interface EventCardProps {
  event: EventType;
  onEdit: (event: EventType) => void;
  onDelete: (id: string) => void;
  onView: (event: EventType) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ONGOING':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return '📅';
      case 'ONGOING':
        return '🔄';
      case 'COMPLETED':
        return '✅';
      case 'CANCELLED':
        return '❌';
      default:
        return '❓';
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'MEETING':
        return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'TRAINING':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SOCIAL':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'FUNDRAISING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'MEETING': return 'Réunion';
      case 'TRAINING': return 'Formation';
      case 'SOCIAL': return 'Social';
      case 'FUNDRAISING': return 'Collecte';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PLANNED': return 'Planifié';
      case 'ONGOING': return 'En cours';
      case 'COMPLETED': return 'Terminé';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 relative">
      {/* Header avec titre et menu */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900 text-sm">
              {event.title}
            </span>
          </div>
          <div className="text-sm text-gray-600 line-clamp-2">{event.description}</div>
        </div>
        
        {/* Menu actions */}
        <div className="relative">
          <button 
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Actions"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
          
          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowActions(false)}
              ></div>
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[150px]">
                <button 
                  onClick={() => {
                    onView(event);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Voir
                </button>
                <button 
                  onClick={() => {
                    onEdit(event);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button 
                  onClick={() => {
                    onDelete(event.id);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Badges de statut et type */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(event.status)}`}>
          <span>{getStatusIcon(event.status)}</span>
          {getStatusLabel(event.status)}
        </span>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeStyle(event.type)}`}>
          {getTypeLabel(event.type)}
        </span>
      </div>

      {/* Informations détaillées */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{formatDate(event.startDate)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{event.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4 text-gray-400" />
          <span>
            {event.participants?.length || 0} / {event.maxParticipants} participants
          </span>
        </div>
      </div>

      {/* Indicator ID pour debug */}
      <div className="absolute top-2 right-12 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
        #{event.id}
      </div>
    </div>
  );
};

export default function EventsPageMobile() {
  // États locaux pour l'interface
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Données de démonstration pour les événements
  const events: EventType[] = [
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
    },
    {
      id: '4',
      title: 'Réunion mensuelle du bureau',
      description: 'Réunion mensuelle du bureau exécutif pour faire le point sur les activités.',
      startDate: new Date('2025-02-20T18:00:00'),
      location: 'Siège de l\'association',
      type: 'MEETING',
      status: 'PLANNED',
      maxParticipants: 15,
      associationId: 'assoc-1',
      createdBy: 'user-1',
      participants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      title: 'Journée porte ouverte',
      description: 'Présentation des activités de l\'association aux nouveaux membres potentiels.',
      startDate: new Date('2025-05-10T10:00:00'),
      location: 'Espace public - Plateau',
      type: 'SOCIAL',
      status: 'PLANNED',
      maxParticipants: 200,
      associationId: 'assoc-1',
      createdBy: 'user-1',
      participants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Stats basées sur les données
  const total = events.length;
  const planned = events.filter(e => e.status === 'PLANNED').length;
  const ongoing = events.filter(e => e.status === 'ONGOING').length;
  const completed = events.filter(e => e.status === 'COMPLETED').length;

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                         event.description.toLowerCase().includes(search.toLowerCase()) ||
                         event.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || event.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleEdit = (event: EventType) => {
    console.log('Modifier événement:', event);
    // TODO: Ouvrir modal d'édition
  };

  const handleDelete = (id: string) => {
    console.log('Supprimer événement:', id);
    // TODO: Ouvrir modal de confirmation
  };

  const handleView = (event: EventType) => {
    console.log('Voir événement:', event);
    // TODO: Ouvrir modal de détails
  };

  const handleAddNew = () => {
    console.log('Ajouter nouvel événement');
    // TODO: Ouvrir modal d'ajout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête décoré avec couleur orange */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-orange-500">
            Événements
          </h1>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Statistiques résumé */}
        <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
          <p className="text-gray-700 font-medium">
            {total} événement{total > 1 ? 's' : ''} • {planned} planifié{planned > 1 ? 's' : ''}
          </p>
        </div>
        {/* Stats en grille compacte - Mobile First */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => setStatusFilter('ALL')}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all hover:bg-gray-50 ${
              statusFilter === 'ALL' ? 'ring-2 ring-orange-500' : ''
            }`}
            aria-label="Afficher tous les événements"
          >
            <div className="text-xs text-gray-500 mb-1">Total</div>
            <div className="text-xl font-bold text-gray-900">{total}</div>
          </button>
          
          <button 
            onClick={() => setStatusFilter(statusFilter === 'PLANNED' ? 'ALL' : 'PLANNED')}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
              statusFilter === 'PLANNED' ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="text-xs text-blue-600 mb-1">📅 Planifiés</div>
            <div className="text-xl font-bold text-blue-700">{planned}</div>
          </button>
          
          <button 
            onClick={() => setStatusFilter(statusFilter === 'ONGOING' ? 'ALL' : 'ONGOING')}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
              statusFilter === 'ONGOING' ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div className="text-xs text-green-600 mb-1">🔄 En cours</div>
            <div className="text-xl font-bold text-green-700">{ongoing}</div>
          </button>
          
          <button 
            onClick={() => setStatusFilter(statusFilter === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
              statusFilter === 'COMPLETED' ? 'ring-2 ring-gray-500' : ''
            }`}
          >
            <div className="text-xs text-gray-600 mb-1">✅ Terminés</div>
            <div className="text-xl font-bold text-gray-700">{completed}</div>
          </button>
        </div>

        {/* Répartition par types - Design moderne mobile */}
        <div className="bg-gradient-to-r from-violet-600 to-orange-600 rounded-xl p-4 mb-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Répartition par types</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Réunions: {events.filter(e => e.type === 'MEETING').length}</div>
            <div>Social: {events.filter(e => e.type === 'SOCIAL').length}</div>
            <div>Formations: {events.filter(e => e.type === 'TRAINING').length}</div>
            <div>Collectes: {events.filter(e => e.type === 'FUNDRAISING').length}</div>
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl transition-all ${
              showFilters ? 'bg-orange-100 text-orange-700' : 'bg-white text-gray-600'
            } border border-gray-200`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Liste des événements */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun événement</h3>
            <p className="text-gray-600 mb-6">Commencez par planifier votre premier événement</p>
            <button 
              onClick={handleAddNew}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-medium"
            >
              Créer un événement
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
            <p className="text-gray-600 mb-4">
              Aucun événement ne correspond à vos critères
            </p>
            <button 
              onClick={() => { setSearch(''); setStatusFilter('ALL'); setTypeFilter('ALL'); }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        )}
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
