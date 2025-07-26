import { useState, useEffect } from 'react';

// Types pour l'historique
export interface HistoryActivity {
  id: string;
  type: 'member' | 'cotisation' | 'event' | 'finance' | 'document' | 'message';
  action: 'create' | 'update' | 'delete' | 'payment' | 'registration';
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  details?: Record<string, string | number | boolean | string[]>;
}

export const useHistory = () => {
  const [activities, setActivities] = useState<HistoryActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement des données d'historique
    const loadHistory = async () => {
      setIsLoading(true);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données d'exemple
      const mockActivities: HistoryActivity[] = [
        {
          id: '1',
          type: 'member',
          action: 'create',
          title: 'Nouveau membre ajouté',
          description: 'Marie Dupont a été ajoutée comme membre',
          user: 'Admin',
          timestamp: new Date('2025-07-26T10:30:00'),
          details: { memberName: 'Marie Dupont', role: 'Membre' }
        },
        {
          id: '2',
          type: 'cotisation',
          action: 'payment',
          title: 'Cotisation payée',
          description: 'Jean Martin a payé sa cotisation 2025 (50 000 CFA)',
          user: 'Trésorier',
          timestamp: new Date('2025-07-26T09:15:00'),
          details: { amount: 50000, year: 2025, memberName: 'Jean Martin' }
        },
        {
          id: '3',
          type: 'event',
          action: 'create',
          title: 'Nouvel événement créé',
          description: 'Assemblée générale annuelle programmée pour le 15 août',
          user: 'Président',
          timestamp: new Date('2025-07-25T16:45:00'),
          details: { eventName: 'Assemblée générale annuelle', date: '2025-08-15' }
        },
        {
          id: '4',
          type: 'finance',
          action: 'create',
          title: 'Nouvelle transaction',
          description: 'Achat de matériel de bureau - 75 000 CFA',
          user: 'Trésorier',
          timestamp: new Date('2025-07-25T14:20:00'),
          details: { amount: -75000, category: 'Matériel' }
        },
        {
          id: '5',
          type: 'member',
          action: 'update',
          title: 'Information membre modifiée',
          description: 'Mise à jour du profil de Paul Sène',
          user: 'Secrétaire',
          timestamp: new Date('2025-07-24T11:30:00'),
          details: { memberName: 'Paul Sène', changes: ['téléphone', 'adresse'] }
        },
        {
          id: '6',
          type: 'document',
          action: 'create',
          title: 'Document ajouté',
          description: 'Procès-verbal de la réunion du 20 juillet',
          user: 'Secrétaire',
          timestamp: new Date('2025-07-23T15:00:00'),
          details: { documentName: 'PV_reunion_20_juillet.pdf' }
        },
        {
          id: '7',
          type: 'event',
          action: 'registration',
          title: 'Inscription événement',
          description: '5 nouveaux participants pour la formation en leadership',
          user: 'Coordinateur',
          timestamp: new Date('2025-07-22T13:45:00'),
          details: { eventName: 'Formation en leadership', participants: 5 }
        },
        {
          id: '8',
          type: 'cotisation',
          action: 'create',
          title: 'Nouvelle cotisation enregistrée',
          description: 'Cotisation 2025 créée pour Fatou Diallo',
          user: 'Trésorier',
          timestamp: new Date('2025-07-21T10:15:00'),
          details: { memberName: 'Fatou Diallo', amount: 50000, year: 2025 }
        },
        {
          id: '9',
          type: 'finance',
          action: 'payment',
          title: 'Subvention reçue',
          description: 'Subvention municipale pour le projet jeunesse - 500 000 CFA',
          user: 'Président',
          timestamp: new Date('2025-07-20T14:30:00'),
          details: { amount: 500000, source: 'Municipalité', project: 'Projet Jeunesse' }
        },
        {
          id: '10',
          type: 'member',
          action: 'delete',
          title: 'Membre supprimé',
          description: 'Démission de Amadou Ba',
          user: 'Secrétaire',
          timestamp: new Date('2025-07-19T16:20:00'),
          details: { memberName: 'Amadou Ba', reason: 'Démission volontaire' }
        },
        {
          id: '11',
          type: 'document',
          action: 'update',
          title: 'Document modifié',
          description: 'Mise à jour du règlement intérieur',
          user: 'Président',
          timestamp: new Date('2025-07-18T09:45:00'),
          details: { documentName: 'Règlement_intérieur.pdf', changes: ['Article 5', 'Article 12'] }
        },
        {
          id: '12',
          type: 'event',
          action: 'update',
          title: 'Événement modifié',
          description: 'Report de la sortie éducative au 30 août',
          user: 'Coordinateur',
          timestamp: new Date('2025-07-17T11:15:00'),
          details: { eventName: 'Sortie éducative', oldDate: '2025-08-25', newDate: '2025-08-30' }
        }
      ];
      
      setActivities(mockActivities);
      setIsLoading(false);
    };

    loadHistory();
  }, []);

  // Fonction pour ajouter une nouvelle activité
  const addActivity = (activity: Omit<HistoryActivity, 'id' | 'timestamp'>) => {
    const newActivity: HistoryActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // Fonction pour obtenir les activités récentes (dernières 5)
  const getRecentActivities = (limit: number = 5) => {
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  };

  // Fonction pour obtenir les statistiques
  const getStats = () => {
    const now = new Date();
    const today = activities.filter(a => 
      a.timestamp.toDateString() === now.toDateString()
    ).length;
    
    const thisWeek = activities.filter(a => {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return a.timestamp >= weekAgo;
    }).length;
    
    const thisMonth = activities.filter(a => {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return a.timestamp >= monthAgo;
    }).length;

    return {
      total: activities.length,
      today,
      thisWeek,
      thisMonth
    };
  };

  return {
    activities,
    isLoading,
    addActivity,
    getRecentActivities,
    getStats
  };
};
