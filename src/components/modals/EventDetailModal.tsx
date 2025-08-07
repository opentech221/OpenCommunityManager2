import React from 'react';
import { X, Calendar, MapPin, Users, Clock, Tag, FileText } from 'lucide-react';
import type { EventType } from '../../types';
import { EventStatus } from '../../types';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: EventType) => void;
  event: EventType | null;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ isOpen, onClose, onEdit, event }) => {
  if (!isOpen || !event) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
              Détails de l'événement
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Titre et statut */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                  {getStatusLabel(event.status)}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(event.type)}`}>
                  <Tag className="w-3 h-3 mr-1" />
                  {getTypeLabel(event.type)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-gray-600" />
                Description
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Informations principales */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-600" />
              Informations principales
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date et heure</p>
                  <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lieu</p>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>
                </div>
              )}

              {event.participants && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium text-gray-900">{event.participants.length} participant{event.participants.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}

              {event.maxParticipants && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Limite de participants</p>
                    <p className="font-medium text-gray-900">{event.maxParticipants}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Liste des participants */}
          {event.participants && event.participants.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-600" />
                Participants ({event.participants.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {event.participants.map((participant, index) => (
                  <div key={index} className="flex items-center p-2 bg-white rounded border">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-gray-600">
                        {participant.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{participant}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informations système */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-gray-600" />
              Informations système
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID de l'événement</p>
                <p className="font-mono text-sm text-gray-600">{event.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date de création</p>
                <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              if (onEdit) {
                onEdit(event);
              }
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
