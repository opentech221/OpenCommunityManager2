// Mock global pour l'input file
Object.defineProperty(global, 'File', {
  writable: true,
  value: class MockFile {
    name: string;
    size: number;
    type: string;
    constructor(parts: string[], name: string, options: { type: string }) {
      this.name = name;
      this.size = parts.join('').length;
      this.type = options.type;
    }
  }
});
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
jest.useFakeTimers();
import DocumentsPage from '../pages/DocumentsPage';

// Mock global pour URL.createObjectURL (JSDOM)
beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'mocked-url');
});

describe('DocumentsPage feedback UX', () => {
  it('affiche le feedback après ajout (simulation handler)', async () => {
    render(<DocumentsPage />);
    // Ouvre le modal
    fireEvent.click(screen.getByText('Télécharger un document'));
    // Remplit les champs
    fireEvent.change(screen.getByLabelText('Nom du document'), { target: { value: 'PV réunion' } });
    fireEvent.change(screen.getByLabelText('Type de document'), { target: { value: 'PV' } });
    // Simule la sélection d'un fichier
    const fileInput = screen.getByLabelText('Sélectionner un fichier');
    const mockFile = new File(['dummy content'], 'pv_reunion.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    // Simule le handler d'ajout directement
    const ajouterBtn = screen.getByText('Télécharger');
    const form = ajouterBtn.closest('form');
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }
    // Vérifie le feedback
    expect(await screen.findByText('Document ajouté avec succès.')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    // Vérifie la disparition du feedback
    expect(screen.queryByText('Document ajouté avec succès.')).not.toBeInTheDocument();
  });
  });

  test('affiche le feedback après suppression', async () => {
    render(<DocumentsPage />);
    fireEvent.click(screen.getAllByLabelText('Supprimer le document')[0]);
    expect(await screen.findByText('Document supprimé avec succès.')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    expect(screen.queryByText('Document supprimé avec succès.')).not.toBeInTheDocument();
  });

  // La modification n'est pas implémentée dans la page Documents
