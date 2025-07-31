import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MessagesPage from '../pages/MessagesPage';

jest.useFakeTimers();

describe('MessagesPage', () => {
  it('affiche la liste des conversations', () => {
    render(<MessagesPage />);
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Mamadou Diallo')).toBeInTheDocument();
    expect(screen.getByText('Fatou Camara')).toBeInTheDocument();
    expect(screen.getByText('Ibrahima Bah')).toBeInTheDocument();
  });

  it('affiche l’état vide si aucune conversation sélectionnée', () => {
    render(<MessagesPage />);
    expect(screen.getByText('Aucune conversation sélectionnée')).toBeInTheDocument();
  });

  it('sélectionne une conversation et affiche le chat', () => {
    render(<MessagesPage />);
    fireEvent.click(screen.getByText('Mamadou Diallo'));
    expect(screen.getByText('En ligne')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tapez votre message...')).toBeInTheDocument();
  });

  it('envoie un message et affiche le feedback', () => {
    render(<MessagesPage />);
    fireEvent.click(screen.getByText('Mamadou Diallo'));
    const input = screen.getByPlaceholderText('Tapez votre message...');
    fireEvent.change(input, { target: { value: 'Nouveau message' } });
    fireEvent.click(screen.getByLabelText('Envoyer le message'));
    expect(screen.getByText('Message envoyé !')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.queryByText('Message envoyé !')).not.toBeInTheDocument();
    expect(screen.getByText('Nouveau message')).toBeInTheDocument();
  });

  it('supprime un message et affiche le feedback', () => {
    render(<MessagesPage />);
    fireEvent.click(screen.getByText('Mamadou Diallo'));
    // On supprime le premier message envoyé par "Moi"
    const deleteButtons = screen.getAllByLabelText('Supprimer le message');
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText('Message supprimé.')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.queryByText('Message supprimé.')).not.toBeInTheDocument();
  });

  it('affiche tous les messages de la conversation', () => {
    render(<MessagesPage />);
    fireEvent.click(screen.getByText('Mamadou Diallo'));
    expect(screen.getByText('Bonjour, avez-vous reçu le rapport financier ?')).toBeInTheDocument();
    expect(screen.getByText('Oui, je l\'ai reçu hier. Je vais l\'examiner ce soir.')).toBeInTheDocument();
    expect(screen.getByText('Parfait, merci !')).toBeInTheDocument();
  });
});
