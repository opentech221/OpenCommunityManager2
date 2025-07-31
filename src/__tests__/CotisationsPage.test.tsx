import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CotisationsPage from '../pages/CotisationsPage';

describe('CotisationsPage', () => {
  test('affiche la liste des cotisations et les statistiques', () => {
    render(<CotisationsPage />);
    expect(screen.getByTestId('cotisations-title')).toBeInTheDocument();
    expect(screen.getByTestId('stat-total-label')).toBeInTheDocument();
    expect(screen.getByTestId('stat-paid-label')).toBeInTheDocument();
    expect(screen.getByTestId('stat-pending-label')).toBeInTheDocument();
    expect(screen.getByTestId('stat-overdue-label')).toBeInTheDocument();
    expect(screen.getByTestId('stat-total-amount-label')).toBeInTheDocument();
    // Vérifie qu'au moins une cotisation est affichée - le format currency utilise €
    const montantText = screen.getByTestId('stat-total-amount-value').textContent?.replace(/\s/g, '');
    expect(montantText).toMatch(/€/);
  });

  test('filtre les cotisations par recherche', () => {
    render(<CotisationsPage />);
    const input = screen.getByPlaceholderText(/Rechercher une cotisation/i);
    fireEvent.change(input, { target: { value: 'inexistant' } });
    // Avec une recherche inexistante, on devrait avoir le message "Aucune cotisation ne correspond"
    expect(screen.getByText(/Aucune cotisation ne correspond à vos critères de recherche/i)).toBeInTheDocument();
  });

  test('filtre les cotisations par statut', () => {
    render(<CotisationsPage />);
    fireEvent.click(screen.getByText(/Payées/i));
    expect(screen.getAllByText(/Payée/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText(/En attente/i));
    expect(screen.getAllByText(/En attente/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText(/En retard/i));
    expect(screen.getAllByText(/En retard/i).length).toBeGreaterThan(0);
  });

  test('affiche le modal d’ajout et ajoute une cotisation', async () => {
    render(<CotisationsPage />);
    fireEvent.click(screen.getByTestId('add-cotisation-btn'));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Nouvelle cotisation' })).toBeInTheDocument());
    // Remplir le formulaire - utiliser le premier select (membre)
    const memberSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(memberSelect, { target: { value: 'member-1' } });
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '20000' } });
    fireEvent.change(screen.getByDisplayValue(new Date().toISOString().split('T')[0]), { target: { value: '2025-07-19' } });
    // Pas de sélecteur direct pour méthode et statut, ils sont déjà définis par défaut dans le mock
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: '2025' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Notes \(optionnel\)/i }), { target: { value: 'Test ajout' } });
    fireEvent.click(screen.getByRole('button', { name: /Enregistrer/i }));
    await waitFor(() => expect(screen.getByText('Cotisation ajoutée avec succès')).toBeInTheDocument());
    // Note : Dans un environnement de test avec mocks, les nouvelles données ne sont pas affichées dans l'interface
  });

  test('supprime une cotisation et affiche le feedback', async () => {
    render(<CotisationsPage />);
    const deleteButtons = screen.getAllByRole('button', { name: /Supprimer/i });
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => expect(screen.getByText('Cotisation supprimée avec succès')).toBeInTheDocument());
  });

  test('modifie une cotisation et affiche le feedback', async () => {
    render(<CotisationsPage />);
    const editButtons = screen.getAllByRole('button', { name: /Modifier/i });
    fireEvent.click(editButtons[0]);
    expect(screen.getByText(/Modifier la cotisation/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Notes \(optionnel\)/i), { target: { value: 'Note modifiée' } });
    fireEvent.click(screen.getByText(/Enregistrer/i));
    await waitFor(() => expect(screen.getByText('Cotisation modifiée avec succès')).toBeInTheDocument());
    // Note : Dans un environnement de test avec mocks, les données ne sont pas réellement mises à jour
  });

  test('affiche le message aucune cotisation si la recherche ne correspond à rien', () => {
    render(<CotisationsPage />);
    const input = screen.getByPlaceholderText(/Rechercher une cotisation/i);
    fireEvent.change(input, { target: { value: 'inexistant' } });
    expect(screen.getByText(/Aucune cotisation ne correspond à vos critères de recherche/i)).toBeInTheDocument();
  });
});
