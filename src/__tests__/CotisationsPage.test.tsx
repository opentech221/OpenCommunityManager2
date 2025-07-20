import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CotisationsPage from '../pages/CotisationsPage';
import { PaymentStatus, PaymentMethod } from '../types';

describe('CotisationsPage', () => {
  test('affiche la liste des cotisations et les statistiques', () => {
    render(<CotisationsPage />);
    expect(screen.getByTestId('cotisations-title')).toBeInTheDocument();
    expect(screen.getByTestId('stat-total-label')).toBeInTheDocument();
    expect(screen.getByTestId('stat-paid-label')).toBeInTheDocument();
    expect(screen.getByTestId('stat-pending-label')).toBeInTheDocument();
    expect(screen.getByTestId('stat-overdue-label')).toBeInTheDocument();
    expect(screen.getByTestId('stat-total-amount-label')).toBeInTheDocument();
    // Vérifie qu'au moins une cotisation est affichée
    const montantText = screen.getByTestId('stat-total-amount-value').textContent?.replace(/\s/g, '');
    expect(montantText).toMatch(/FCFA/);
  });

  test('filtre les cotisations par recherche', () => {
    render(<CotisationsPage />);
    const input = screen.getByPlaceholderText(/Rechercher une cotisation/i);
    fireEvent.change(input, { target: { value: 'Aminata' } });
    expect(screen.getByText(/Aminata Diallo/i)).toBeInTheDocument();
    expect(screen.queryByText(/Mamadou Ba/i)).not.toBeInTheDocument();
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
    expect(screen.getByTestId('modal-title-add')).toBeInTheDocument();
    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/Membre/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Montant/i), { target: { value: '20000' } });
    fireEvent.change(screen.getByLabelText(/Date de paiement/i), { target: { value: '2025-07-19' } });
    fireEvent.change(screen.getByLabelText(/Méthode/i), { target: { value: PaymentMethod.CASH } });
    fireEvent.change(screen.getByLabelText(/Statut/i), { target: { value: PaymentStatus.PAID } });
    fireEvent.change(screen.getByLabelText(/Année/i), { target: { value: '2025' } });
    fireEvent.change(screen.getByLabelText(/Notes/i), { target: { value: 'Test ajout' } });
    fireEvent.click(screen.getByRole('button', { name: /Ajouter/i }));
    await waitFor(() => expect(screen.getByText('Cotisation ajoutée avec succès')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Test ajout/i)).toBeInTheDocument());
  });

  test('supprime une cotisation et affiche le feedback', async () => {
    render(<CotisationsPage />);
    const deleteButtons = screen.getAllByText(/Supprimer/i);
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => expect(screen.getByText('Cotisation supprimée avec succès')).toBeInTheDocument());
  });

  test('modifie une cotisation et affiche le feedback', async () => {
    render(<CotisationsPage />);
    fireEvent.click(screen.getByText(/Simuler modification/i));
    expect(screen.getByText(/Modifier cotisation/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Notes/i), { target: { value: 'Note modifiée' } });
    fireEvent.click(screen.getByText(/Enregistrer/i));
    await waitFor(() => expect(screen.getByText('Cotisation modifiée avec succès')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Note modifiée/i)).toBeInTheDocument());
  });

  test('affiche le message aucune cotisation si la recherche ne correspond à rien', () => {
    render(<CotisationsPage />);
    const input = screen.getByPlaceholderText(/Rechercher une cotisation/i);
    fireEvent.change(input, { target: { value: 'inexistant' } });
    expect(screen.getByText(/Aucune cotisation trouvée/i)).toBeInTheDocument();
  });
});
