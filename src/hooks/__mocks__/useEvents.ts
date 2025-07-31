/**
 * Mock du hook useEvents pour les tests
 */

export const useEvents = jest.fn(() => ({
  events: [
    {
      id: '1',
      title: 'Assemblée Générale 2024',
      description: 'Assemblée générale annuelle',
      startDate: new Date('2025-02-15T14:00:00Z'),
      endDate: new Date('2025-02-15T16:00:00Z'),
      location: 'Salle municipale',
      type: 'MEETING',
      status: 'PLANNED',
      maxParticipants: 50,
      participants: [],
      associationId: 'assoc-1',
      createdBy: 'user-1',
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z')
    },
    {
      id: '2',
      title: 'Formation bureautique',
      description: 'Formation aux outils numériques',
      startDate: new Date('2024-12-01T09:00:00Z'),
      endDate: new Date('2024-12-01T17:00:00Z'),
      location: 'Centre associatif',
      type: 'TRAINING',
      status: 'COMPLETED',
      maxParticipants: 20,
      participants: [],
      associationId: 'assoc-1',
      createdBy: 'user-1',
      createdAt: new Date('2024-01-20T14:30:00Z'),
      updatedAt: new Date('2024-01-20T14:30:00Z')
    }
  ],
  isLoading: false,
  error: null,
  addEvent: jest.fn(),
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),
  refreshEvents: jest.fn()
}));
