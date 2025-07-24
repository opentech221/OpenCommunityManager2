import { useState, useEffect } from 'react';
import { apiUrl } from '../utils';
import type { EventType, EventTypeEnum, EventStatus, EventParticipant } from '../types';

interface EventFilters {
  search?: string;
  type?: 'all' | 'MEETING' | 'SOCIAL' | 'TRAINING';
  status?: 'all' | 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  dateRange?: 'all' | 'upcoming' | 'past' | 'thisWeek' | 'thisMonth' | 'thisYear';
  startDate?: Date;
  endDate?: Date;
}

interface UseEventsReturn {
  events: EventType[];
  isLoading: boolean;
  addEvent: (event: Omit<EventType, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<EventType>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => EventType | undefined;
  getUpcomingEvents: () => EventType[];
  getPastEvents: () => EventType[];
  filterEvents: (filters: EventFilters) => EventType[];
  searchEvents: (query: string) => EventType[];
  getEventsByType: (type: string) => EventType[];
  getEventsByStatus: (status: string) => EventType[];
  getEventsByDateRange: (startDate: Date, endDate: Date) => EventType[];
  // Gestion des participants
  addParticipant: (eventId: string, memberId: string) => Promise<void>;
  removeParticipant: (eventId: string, memberId: string) => Promise<void>;
  markAttendance: (eventId: string, memberId: string, attended: boolean) => Promise<void>;
  getEventParticipants: (eventId: string) => Array<{
    memberId: string;
    registrationDate: Date;
    attended: boolean;
  }>;
}

// Utilitaire pour convertir camelCase en snake_case
function toSnakeCase(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    Object.keys(obj as Record<string, unknown>).forEach(key => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = toSnakeCase((obj as Record<string, unknown>)[key]);
    });
    return result;
  }
  return obj;
}

// Utilitaire pour normaliser les données reçues de l'API (snake_case vers camelCase et dates en objets Date)
function normalizeEventFromAPI(eventData: Record<string, unknown>): EventType {
  return {
    id: String(eventData.id),
    title: String(eventData.title),
    description: String(eventData.description || ''),
    startDate: new Date(String(eventData.start_date)),
    endDate: eventData.end_date ? new Date(String(eventData.end_date)) : undefined,
    location: String(eventData.location),
    type: String(eventData.event_type || eventData.type) as EventTypeEnum,
    status: String(eventData.status) as EventStatus,
    maxParticipants: eventData.max_participants ? Number(eventData.max_participants) : undefined,
    associationId: String(eventData.association_id),
    createdBy: eventData.created_by ? String(eventData.created_by) : undefined,
    participants: Array.isArray(eventData.participants) ? eventData.participants as EventParticipant[] : [],
    createdAt: new Date(String(eventData.created_at)),
    updatedAt: new Date(String(eventData.updated_at))
  };
}

export const useEvents = (): UseEventsReturn => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(apiUrl('/api/events/'), {
        headers,
      });
      if (response.ok) {
        const data = await response.json();
        // Normaliser les données reçues
        const normalizedEvents = data.map((event: Record<string, unknown>) => normalizeEventFromAPI(event));
        setEvents(normalizedEvents);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (eventData: Omit<EventType, 'id'>) => {
    try {
      const token = localStorage.getItem('auth_token');
      // Retirer explicitement le champ id s'il existe (par précaution)
      const eventDataWithoutId = { ...eventData };
      delete (eventDataWithoutId as Record<string, unknown>).id;
      
      // Convertir les dates en ISO string pour l'API
      const eventForAPI = {
        ...eventDataWithoutId,
        startDate: eventDataWithoutId.startDate.toISOString(),
        endDate: eventDataWithoutId.endDate ? eventDataWithoutId.endDate.toISOString() : null,
        createdAt: eventDataWithoutId.createdAt.toISOString(),
        updatedAt: eventDataWithoutId.updatedAt.toISOString()
      };
      
      const response = await fetch(apiUrl('/api/events/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(toSnakeCase(eventForAPI)),
      });

      if (response.ok) {
        const newEvent = await response.json();
        // Normaliser les données reçues et les ajouter aux événements
        const normalizedEvent = normalizeEventFromAPI(newEvent);
        setEvents(prev => [...prev, normalizedEvent]);
      } else {
        let errorMsg = 'Erreur lors de l\'ajout de l\'événement.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
          console.error('Erreur API:', errorData);
        } catch {
          const errorText = await response.text();
          if (errorText) errorMsg = errorText;
          console.error('Erreur texte:', errorText);
        }
        console.error('Données envoyées:', toSnakeCase(eventForAPI));
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
      alert(error instanceof Error ? error.message : String(error));
    }
  };

  const updateEvent = async (id: string, updates: Partial<EventType>) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(apiUrl(`/api/events/${id}/`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(toSnakeCase(updates)),
      });

      if (response.ok) {
        setEvents(prev =>
          prev.map(event =>
            event.id === id ? { ...event, ...updates } : event
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(apiUrl(`/api/events/${id}/`), {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        setEvents(prev => prev.filter(event => event.id !== id));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
    }
  };

  const getEventById = (id: string): EventType | undefined => {
    return events.find(event => event.id === id);
  };

  const getUpcomingEvents = (): EventType[] => {
    const now = new Date();
    return events
      .filter(event => new Date(event.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  };

  const getPastEvents = (): EventType[] => {
    const now = new Date();
    return events
      .filter(event => new Date(event.endDate || event.startDate) < now)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  };

  // Nouvelles fonctions de filtrage
  const searchEvents = (query: string): EventType[] => {
    if (!query.trim()) return events;
    
    const lowercaseQuery = query.toLowerCase();
    return events.filter(event =>
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery) ||
      event.location.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getEventsByType = (type: string): EventType[] => {
    if (type === 'all') return events;
    return events.filter(event => event.type === type);
  };

  const getEventsByStatus = (status: string): EventType[] => {
    if (status === 'all') return events;
    return events.filter(event => event.status === status);
  };

  const getEventsByDateRange = (startDate: Date, endDate: Date): EventType[] => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= startDate && eventDate <= endDate;
    });
  };

  const filterEvents = (filters: EventFilters): EventType[] => {
    let filteredEvents = events;

    // Filtrage par recherche textuelle
    if (filters.search) {
      filteredEvents = searchEvents(filters.search);
    }

    // Filtrage par type
    if (filters.type && filters.type !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.type === filters.type);
    }

    // Filtrage par statut
    if (filters.status && filters.status !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.status === filters.status);
    }

    // Filtrage par plage de dates
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      switch (filters.dateRange) {
        case 'upcoming':
          filteredEvents = filteredEvents.filter(event => new Date(event.startDate) > now);
          break;
        case 'past':
          filteredEvents = filteredEvents.filter(event => new Date(event.endDate || event.startDate) < now);
          break;
        case 'thisWeek': {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          filteredEvents = getEventsByDateRange(startOfWeek, endOfWeek);
          break;
        }
        case 'thisMonth': {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          filteredEvents = getEventsByDateRange(startOfMonth, endOfMonth);
          break;
        }
        case 'thisYear': {
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          const endOfYear = new Date(now.getFullYear(), 11, 31);
          filteredEvents = getEventsByDateRange(startOfYear, endOfYear);
          break;
        }
      }
    }

    // Filtrage par dates personnalisées
    if (filters.startDate && filters.endDate) {
      filteredEvents = getEventsByDateRange(filters.startDate, filters.endDate);
    }

    return filteredEvents;
  };

  // Gestion des participants
  const addParticipant = async (eventId: string, memberId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(apiUrl(`/api/events/${eventId}/participants/`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(toSnakeCase({ member_id: memberId })),
      });

      if (response.ok) {
        // Mettre à jour l'événement local avec le nouveau participant
        const updatedParticipant = await response.json();
        setEvents(prev =>
          prev.map(event =>
            event.id === eventId
              ? {
                  ...event,
                  participants: [...(event.participants || []), updatedParticipant]
                }
              : event
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du participant:', error);
    }
  };

  const removeParticipant = async (eventId: string, memberId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(apiUrl(`/api/events/${eventId}/participants/${memberId}/`), {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        // Mettre à jour l'événement local en supprimant le participant
        setEvents(prev =>
          prev.map(event =>
            event.id === eventId
              ? {
                  ...event,
                  participants: (event.participants || []).filter(p => p.memberId !== memberId)
                }
              : event
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du participant:', error);
    }
  };

  const markAttendance = async (eventId: string, memberId: string, attended: boolean) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(apiUrl(`/api/events/${eventId}/participants/${memberId}/attendance/`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(toSnakeCase({ attended })),
      });

      if (response.ok) {
        // Mettre à jour l'état de présence du participant
        setEvents(prev =>
          prev.map(event =>
            event.id === eventId
              ? {
                  ...event,
                  participants: (event.participants || []).map(p =>
                    p.memberId === memberId ? { ...p, attended } : p
                  )
                }
              : event
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence:', error);
    }
  };

  const getEventParticipants = (eventId: string) => {
    const event = getEventById(eventId);
    return event?.participants || [];
  };

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getUpcomingEvents,
    getPastEvents,
    filterEvents,
    searchEvents,
    getEventsByType,
    getEventsByStatus,
    getEventsByDateRange,
    // Gestion des participants
    addParticipant,
    removeParticipant,
    markAttendance,
    getEventParticipants,
  };
};
