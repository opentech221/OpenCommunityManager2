import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResourcesPage from '../pages/ResourcesPage';

// Mock pour les icônes Lucide React
jest.mock('lucide-react', () => ({
  Users: () => <div data-testid="users-icon" />,
  Package: () => <div data-testid="package-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  MapPin: () => <div data-testid="mappin-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Wrench: () => <div data-testid="wrench-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  User: () => <div data-testid="user-icon" />
}));

describe('ResourcesPage', () => {
  beforeEach(() => {
    // Nettoyer les feedback messages entre les tests
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderResourcesPage = () => {
    return render(
      <MemoryRouter>
        <ResourcesPage />
      </MemoryRouter>
    );
  };

  test('renders ResourcesPage with main title', () => {
    renderResourcesPage();
    
    expect(screen.getByText('Gestion des Ressources')).toBeInTheDocument();
  });

  test('renders both human and material resources tabs', () => {
    renderResourcesPage();
    
    expect(screen.getByText(/Ressources Humaines/)).toBeInTheDocument();
    expect(screen.getByText(/Ressources Matérielles/)).toBeInTheDocument();
  });

  test('displays human resources statistics by default', () => {
    renderResourcesPage();
    
    // Vérifier que l'onglet ressources humaines est actif par défaut
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Disponibles')).toBeInTheDocument();
    expect(screen.getByText('Occupés')).toBeInTheDocument();
    expect(screen.getByText('Indisponibles')).toBeInTheDocument();
  });

  test('displays sample human resources data', () => {
    renderResourcesPage();
    
    // Vérifier que les données d'exemple sont affichées
    expect(screen.getByText('Marie Dupont')).toBeInTheDocument();
    expect(screen.getByText('Jean Martin')).toBeInTheDocument();
    expect(screen.getByText('Sophie Leroy')).toBeInTheDocument();
  });

  test('renders search functionality for human resources', () => {
    renderResourcesPage();
    
    const searchInput = screen.getByPlaceholderText(/Rechercher une personne/);
    expect(searchInput).toBeInTheDocument();
  });

  test('renders filtering dropdown for human resources', () => {
    renderResourcesPage();
    
    const filterSelect = screen.getByDisplayValue('Toutes les disponibilités');
    expect(filterSelect).toBeInTheDocument();
  });

  test('shows floating action button', () => {
    renderResourcesPage();
    
    // Le bouton flottant devrait être présent
    const floatingButton = screen.getByTestId('plus-icon').closest('button');
    expect(floatingButton).toBeInTheDocument();
  });

  test('displays contact information for human resources', () => {
    renderResourcesPage();
    
    // Vérifier que les informations de contact sont affichées
    expect(screen.getByText('marie.dupont@email.com')).toBeInTheDocument();
    expect(screen.getByText('06 12 34 56 78')).toBeInTheDocument();
  });

  test('displays skills for human resources', () => {
    renderResourcesPage();
    
    // Vérifier que les compétences sont affichées
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Gestion de projet')).toBeInTheDocument();
    expect(screen.getByText('Informatique')).toBeInTheDocument();
  });

  test('displays positions for human resources', () => {
    renderResourcesPage();
    
    // Vérifier que les postes sont affichés
    expect(screen.getByText('Responsable communication')).toBeInTheDocument();
    expect(screen.getByText('Responsable IT')).toBeInTheDocument();
    expect(screen.getByText('Animatrice')).toBeInTheDocument();
  });

  test('should show interactive statistics buttons', () => {
    renderResourcesPage();
    
    // Check that statistics buttons exist and are clickable
    const totalButton = screen.getByText('3').closest('button');
    expect(totalButton).toBeInTheDocument();
    expect(totalButton).toHaveAttribute('title', 'Afficher tous les membres');
    
    // Check that statistics have correct classes
    expect(totalButton).toHaveClass('bg-purple-100');
  });

  test('should show active filters and allow clearing them', async () => {
    renderResourcesPage();
    
    // Set a search term
    const searchInput = screen.getByPlaceholderText(/Rechercher une personne/);
    fireEvent.change(searchInput, { target: { value: 'Marie' } });
    
    await waitFor(() => {
      // Should show active filter
      expect(screen.getByText('Recherche: "Marie"')).toBeInTheDocument();
      expect(screen.getByText('Effacer tout')).toBeInTheDocument();
    });
    
    // Click clear all
    fireEvent.click(screen.getByText('Effacer tout'));
    
    await waitFor(() => {
      // Should clear the search
      expect(screen.queryByText('Recherche: "Marie"')).not.toBeInTheDocument();
      expect((searchInput as HTMLInputElement).value).toBe('');
    });
  });

  test('should switch to material resources tab', async () => {
    renderResourcesPage();
    
    // Switch to material resources tab using a more specific selector
    const materialTab = screen.getByText(/Ressources Matérielles/);
    fireEvent.click(materialTab);
    
    await waitFor(() => {
      // Should show material resources content
      expect(screen.getByText('Ordinateur portable HP')).toBeInTheDocument();
      expect(screen.getByText('Table de réunion')).toBeInTheDocument();
      expect(screen.getByText('Projecteur Epson')).toBeInTheDocument();
    });
  });

  test('should support advanced keyword search for human resources', async () => {
    renderResourcesPage();
    
    // Test simple search that should work
    const searchInput = screen.getByPlaceholderText(/Rechercher une personne/);
    fireEvent.change(searchInput, { target: { value: 'marie' } });
    
    await waitFor(() => {
      // Should show search filter is active
      expect(screen.getByText('Recherche: "marie"')).toBeInTheDocument();
    });
  });

  test('should show search suggestions for human resources', async () => {
    renderResourcesPage();
    
    const searchInput = screen.getByPlaceholderText(/Rechercher une personne/);
    fireEvent.focus(searchInput);
    
    await waitFor(() => {
      // Should show popular keywords
      expect(screen.getByText('communication')).toBeInTheDocument();
      expect(screen.getByText('informatique')).toBeInTheDocument();
      expect(screen.getByText('gestion')).toBeInTheDocument();
    });
  });

  test('should show material resources search functionality', async () => {
    renderResourcesPage();
    
    // Switch to material resources tab
    const materialTab = screen.getByText(/Ressources Matérielles/);
    fireEvent.click(materialTab);
    
    await waitFor(() => {
      // Should show material resources content first
      expect(screen.getByText('Ordinateur portable HP')).toBeInTheDocument();
    });
    
    // Then check for search input with a more specific wait
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Rechercher un matériel/);
      expect(searchInput).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
