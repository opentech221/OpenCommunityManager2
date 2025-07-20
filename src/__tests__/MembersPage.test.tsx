import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MembersPage from '../pages/MembersPage';

import * as useMembersModule from '../hooks/useMembers';

jest.mock('../hooks/useMembers');

const mockMembers = [
  {
    id: '1',
    firstName: 'Mamadou',
    lastName: 'Diallo',
    email: 'mamadou.diallo@email.com',
    phone: '+224 123 456 789',
    role: 'PRESIDENT',
    status: 'ACTIVE',
    joinDate: new Date('2023-01-15'),
    associationId: '1',
  },
];

const mockUseMembers = {
  members: mockMembers,
  isLoading: false,
  addMember: jest.fn(),
  updateMember: jest.fn(),
  deleteMember: jest.fn(),
  filterMembers: jest.fn(() => mockMembers),
};

// @ts-expect-error: Jest mock du hook useMembers pour tests
useMembersModule.useMembers.mockReturnValue(mockUseMembers);

describe('MembersPage', () => {
  it('affiche la liste des membres', () => {
    render(<MembersPage />);
    expect(screen.getByText(/Mamadou Diallo/i)).toBeInTheDocument();
    expect(screen.getByText(/Président/i)).toBeInTheDocument();
  });

  it('ouvre le formulaire d’ajout', async () => {
    render(<MembersPage />);
    fireEvent.click(screen.getByText(/Nouveau membre/i));
    expect(await screen.findByText(/Ajouter un membre/i)).toBeInTheDocument();
  });

  it('affiche le feedback après ajout', async () => {
    mockUseMembers.addMember.mockImplementationOnce(() => Promise.resolve());
    render(<MembersPage />);
    fireEvent.click(screen.getByText(/Nouveau membre/i));
    fireEvent.change(screen.getByPlaceholderText(/Entrez le prénom/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText(/Entrez le nom/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByPlaceholderText(/exemple@email.com/i), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByPlaceholderText(/\+224 XXX XXX XXX/i), { target: { value: '+224 000 000 000' } });
    fireEvent.click(screen.getByText(/Sauvegarder/i));
    await waitFor(() => expect(screen.getByText(/Membre ajouté avec succès/i)).toBeInTheDocument());
  });

  it('supprime un membre', async () => {
    mockUseMembers.deleteMember.mockImplementationOnce(() => Promise.resolve());
    // Mock window.confirm pour simuler la confirmation
    window.confirm = jest.fn(() => true);
    render(<MembersPage />);
    fireEvent.click(screen.getByText(/Supprimer/i));
    await waitFor(() => expect(screen.getByText(/Membre supprimé avec succès/i)).toBeInTheDocument());
  });
});
