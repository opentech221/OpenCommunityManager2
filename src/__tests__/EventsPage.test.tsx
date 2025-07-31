 
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventsPage from '../pages/EventsPage';

// Mock window.confirm pour éviter les erreurs JSDOM
Object.defineProperty(window, 'confirm', {
  value: jest.fn(() => true),
  writable: true,
});

describe('EventsPage feedback UX', () => {
  beforeEach(() => {
    // Mock window.confirm pour les tests de suppression
    Object.defineProperty(window, 'confirm', {
      value: jest.fn(() => true),
      writable: true
    });
  });

  test('affiche le feedback après ajout', async () => {
    render(<EventsPage />);
    // Simule l'ouverture du modal d'ajout
    // Ouvre le modal d'ajout
    fireEvent.click(screen.getByLabelText('ouvrir modal ajout événement'));
    // Remplit le formulaire
    fireEvent.change(screen.getByLabelText('titre'), { target: { value: 'Nouvel événement test' } });
    fireEvent.change(screen.getByLabelText('description'), { target: { value: 'Description test' } });
        fireEvent.change(screen.getByLabelText('date de début'), { target: { value: '2025-07-19T10:00' } });
    fireEvent.change(screen.getByLabelText('lieu'), { target: { value: 'Test lieu' } });
    fireEvent.change(screen.getByLabelText('type'), { target: { value: 'MEETING' } });
    fireEvent.change(screen.getByLabelText('participants'), { target: { value: '10' } });
    // Soumet le formulaire
    fireEvent.click(screen.getByLabelText('Ajouter un événement'));
    await waitFor(() => expect(screen.getByText(/événement ajouté avec succès/i)).toBeInTheDocument());
  });

  test('affiche le feedback après suppression', async () => {
    render(<EventsPage />);
    // Sélectionne le filtre 'Total' pour afficher tous les événements
    fireEvent.click(screen.getByLabelText('Afficher tous les événements'));
    // Simule la suppression du premier événement
    fireEvent.click(screen.getAllByLabelText("supprimer l'événement")[0]);
    await waitFor(() => expect(screen.getByText(/événement supprimé avec succès/i)).toBeInTheDocument());
  });

  test('affiche le feedback après modification', async () => {
    render(<EventsPage />);
    // Sélectionne le filtre 'Total' pour afficher tous les événements
    fireEvent.click(screen.getByLabelText('Afficher tous les événements'));
    // Simule la modification du premier événement
    fireEvent.click(screen.getAllByLabelText("modifier l'événement")[0]);
    // Remplir le formulaire (titre modifié)
    fireEvent.change(screen.getByLabelText('titre'), { target: { value: 'Titre modifié' } });
    // Soumettre le formulaire
    fireEvent.click(screen.getByLabelText("Modifier l'événement"));
    await waitFor(() => expect(screen.getByText(/événement modifié avec succès/i)).toBeInTheDocument());
  });
});
