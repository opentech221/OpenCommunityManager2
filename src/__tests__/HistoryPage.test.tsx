import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HistoryPage from '../pages/HistoryPage';

// Mock du hook useHistory
jest.mock('../hooks/useHistory', () => ({
  useHistory: () => ({
    activities: [
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
        description: 'Jean Martin a payé sa cotisation 2025',
        user: 'Trésorier',
        timestamp: new Date('2025-07-26T09:15:00'),
        details: { amount: 50000, year: 2025, memberName: 'Jean Martin' }
      }
    ],
    isLoading: false,
    getStats: () => ({
      total: 12,
      today: 2,
      thisWeek: 8,
      thisMonth: 12
    })
  })
}));

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('HistoryPage', () => {
  const renderHistoryPage = () => {
    return render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le titre de la page', () => {
    renderHistoryPage();
    expect(screen.getByText('Historique des activités')).toBeInTheDocument();
    expect(screen.getByText('Consultez toutes les actions effectuées dans votre association')).toBeInTheDocument();
  });

  test('affiche les statistiques', () => {
    renderHistoryPage();
    
    // Vérifier les statistiques
    expect(screen.getByText('Total activités')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText("Aujourd'hui")).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Cette semaine')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Ce mois')).toBeInTheDocument();
  });

  test('affiche la liste des activités', () => {
    renderHistoryPage();
    
    // Vérifier que les activités sont affichées
    expect(screen.getByText('Nouveau membre ajouté')).toBeInTheDocument();
    expect(screen.getByText('Marie Dupont a été ajoutée comme membre')).toBeInTheDocument();
    expect(screen.getByText('Cotisation payée')).toBeInTheDocument();
    expect(screen.getByText('Jean Martin a payé sa cotisation 2025')).toBeInTheDocument();
  });

  test('filtre les activités par recherche', () => {
    renderHistoryPage();
    
    const searchInput = screen.getByPlaceholderText('Rechercher dans l\'historique...');
    fireEvent.change(searchInput, { target: { value: 'Marie' } });
    
    // Vérifier que seule l'activité de Marie est visible
    expect(screen.getByText('Nouveau membre ajouté')).toBeInTheDocument();
    expect(screen.queryByText('Cotisation payée')).not.toBeInTheDocument();
  });

  test('filtre les activités par type', () => {
    renderHistoryPage();
    
    const typeSelect = screen.getByDisplayValue('Tous les types');
    fireEvent.change(typeSelect, { target: { value: 'member' } });
    
    // Vérifier que seules les activités de type "member" sont visibles
    expect(screen.getByText('Nouveau membre ajouté')).toBeInTheDocument();
    expect(screen.queryByText('Cotisation payée')).not.toBeInTheDocument();
  });

  test('permet de réinitialiser les filtres', () => {
    renderHistoryPage();
    
    // Appliquer des filtres
    const searchInput = screen.getByPlaceholderText('Rechercher dans l\'historique...');
    fireEvent.change(searchInput, { target: { value: 'Marie' } });
    
    const typeSelect = screen.getByDisplayValue('Tous les types');
    fireEvent.change(typeSelect, { target: { value: 'member' } });
    
    // Réinitialiser
    const resetButton = screen.getByText('Réinitialiser');
    fireEvent.click(resetButton);
    
    // Vérifier que les filtres sont réinitialisés
    expect(searchInput).toHaveValue('');
    expect(typeSelect).toHaveValue('ALL');
  });

  test('bouton retour navigue vers le dashboard', () => {
    renderHistoryPage();
    
    const backButton = screen.getByLabelText('Retour au dashboard');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('affiche le résumé du nombre d\'activités', () => {
    renderHistoryPage();
    
    expect(screen.getByText(/Affichage de \d+ activité/)).toBeInTheDocument();
  });

  test('affiche les badges de type d\'activité', () => {
    renderHistoryPage();
    
    // Vérifier que les badges de type sont affichés
    expect(screen.getByText('Membres')).toBeInTheDocument();
    expect(screen.getByText('Cotisations')).toBeInTheDocument();
  });

  test('affiche les informations temporelles relatives', () => {
    renderHistoryPage();
    
    // Vérifier que les timestamps relatifs sont affichés
    expect(screen.getByText(/Il y a/)).toBeInTheDocument();
  });
});
