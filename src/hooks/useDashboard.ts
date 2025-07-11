import { useState, useEffect } from 'react';

export interface DashboardStats {
  membersActive: number;
  membersTotal: number;
  cotisationsThisMonth: number;
  cotisationsTotal: number;
  upcomingEvents: number;
  currentBalance: number;
  monthlyChange: {
    members: number;
    cotisations: number;
    events: number;
    balance: number;
  };
}

export interface Activity {
  id: string;
  type: 'member' | 'cotisation' | 'event' | 'finance' | 'document';
  message: string;
  time: string;
  icon?: string;
}

interface UseDashboardReturn {
  stats: DashboardStats;
  activities: Activity[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats>({
    membersActive: 0,
    membersTotal: 0,
    cotisationsThisMonth: 0,
    cotisationsTotal: 0,
    upcomingEvents: 0,
    currentBalance: 0,
    monthlyChange: {
      members: 0,
      cotisations: 0,
      events: 0,
      balance: 0,
    },
  });
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulation d'appel API - à remplacer par votre vraie API
      const [statsResponse, activitiesResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/activities')
      ]);

      if (statsResponse.ok && activitiesResponse.ok) {
        const statsData = await statsResponse.json();
        const activitiesData = await activitiesResponse.json();
        
        setStats(statsData);
        setActivities(activitiesData);
      } else {
        // Utiliser des données fictives en cas d'erreur
        setStats(getMockStats());
        setActivities(getMockActivities());
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      // Données fictives en cas d'erreur
      setStats(getMockStats());
      setActivities(getMockActivities());
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchDashboardData();
  };

  return {
    stats,
    activities,
    isLoading,
    refreshData,
  };
};

// Données fictives pour le développement
const getMockStats = (): DashboardStats => ({
  membersActive: 142,
  membersTotal: 156,
  cotisationsThisMonth: 85000,
  cotisationsTotal: 1250000,
  upcomingEvents: 5,
  currentBalance: 1250000,
  monthlyChange: {
    members: 12,
    cotisations: 8,
    events: 2,
    balance: 15,
  },
});

const getMockActivities = (): Activity[] => [
  {
    id: '1',
    type: 'member',
    message: 'Nouvel membre inscrit: Amadou Ba',
    time: 'Il y a 2 heures',
  },
  {
    id: '2',
    type: 'cotisation',
    message: 'Cotisation reçue de Mariam Touré (15 000 FCFA)',
    time: 'Il y a 4 heures',
  },
  {
    id: '3',
    type: 'event',
    message: 'Événement "Assemblée Générale" créé pour le 15 juillet',
    time: 'Il y a 1 jour',
  },
  {
    id: '4',
    type: 'finance',
    message: 'Dépense enregistrée: Achat matériel bureau (45 000 FCFA)',
    time: 'Il y a 2 jours',
  },
  {
    id: '5',
    type: 'document',
    message: 'Nouveau document ajouté: PV réunion juin 2025',
    time: 'Il y a 3 jours',
  },
];
