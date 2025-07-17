import { useState, useEffect } from 'react';
import { apiUrl } from '../utils';
import type { EventType } from '../types';
import { EventTypeEnum, EventStatus } from '../types';

interface UseEventsReturn {
  events: EventType[];
  isLoading: boolean;
  addEvent: (event: Omit<EventType, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<EventType>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => EventType | undefined;
  getUpcomingEvents: () => EventType[];
  getPastEvents: () => EventType[];
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
      const response = await fetch(apiUrl('/api/events'));
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      setEvents(getMockEvents());
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (eventData: Omit<EventType, 'id'>) => {
    try {
      const response = await fetch(apiUrl('/api/events'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const newEvent = await response.json();
        setEvents(prev => [...prev, newEvent]);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      const newEvent: EventType = {
        ...eventData,
        id: Date.now().toString(),
      };
      setEvents(prev => [...prev, newEvent]);
    }
  };

  const updateEvent = async (id: string, updates: Partial<EventType>) => {
    try {
      const response = await fetch(apiUrl(`/api/events/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(updates),
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
      const response = await fetch(apiUrl(`/api/events/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getUpcomingEvents,
    getPastEvents,
  };
};

// Données fictives pour le développement
const getMockEvents = (): EventType[] => [
  {
    id: '1',
    title: 'Assemblée Générale Annuelle',
    description: 'Réunion annuelle pour faire le bilan de l\'année et élire le nouveau bureau',
    startDate: new Date('2025-07-15T14:00:00'),
    endDate: new Date('2025-07-15T17:00:00'),
    location: 'Salle communautaire de Kaloum',
    type: EventTypeEnum.MEETING,
    status: EventStatus.PLANNED,
    maxParticipants: 50,
    participants: [],
    associationId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Formation en gestion financière',
    description: 'Atelier de formation pour les trésoriers des associations membres',
    startDate: new Date('2025-07-22T09:00:00'),
    endDate: new Date('2025-07-22T16:00:00'),
    location: 'Centre de formation OpenTech221',
    type: EventTypeEnum.TRAINING,
    status: EventStatus.PLANNED,
    maxParticipants: 25,
    participants: [],
    associationId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Journée de solidarité communautaire',
    description: 'Activité de nettoyage et de sensibilisation dans le quartier',
    startDate: new Date('2025-08-05T08:00:00'),
    endDate: new Date('2025-08-05T12:00:00'),
    location: 'Quartier Madina',
    type: EventTypeEnum.SOCIAL,
    status: EventStatus.PLANNED,
    maxParticipants: 100,
    participants: [],
    associationId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
