import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FinancesPage from '../pages/FinancesPage';

describe('FinancesPage', () => {
  it('affiche le titre et les totaux', () => {
    render(<FinancesPage />);
    expect(screen.getByTestId('finances-title')).toHaveTextContent('Gestion Financière');
    const balanceText = screen.getByTestId('finances-balance').textContent?.replace(/\s/g, '');
    expect(balanceText).toMatch(/(3050€|3050FCFA|3 050€|3 050FCFA)/);
    const incomeText = screen.getByTestId('finances-income').textContent?.replace(/\s/g, '');
    expect(incomeText).toMatch(/(5000€|5000FCFA|5 000€|5 000FCFA)/);
    const expensesText = screen.getByTestId('finances-expenses').textContent?.replace(/\s/g, '');
    expect(expensesText).toMatch(/(1950€|1950FCFA|1 950€|1 950FCFA)/);
  });

  it.skip('affiche le feedback après ajout', async () => {
    render(<FinancesPage />);
    fireEvent.click(screen.getByTestId('add-transaction-btn'));
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Test ajout' } });
    fireEvent.change(screen.getByPlaceholderText('Montant'), { target: { value: '1000' } });
    fireEvent.change(screen.getByDisplayValue('Type'), { target: { value: 'INCOME' } });
    fireEvent.change(screen.getByDisplayValue('Catégorie'), { target: { value: 'Cotisations' } });
    fireEvent.click(screen.getByText('Ajouter'));
    await waitFor(() => expect(screen.getByTestId('finances-feedback')).toHaveTextContent(/ajoutée avec succès/i));
    await waitFor(() => expect(screen.queryByTestId('finances-feedback')).not.toBeInTheDocument(), { timeout: 2500 });
  });

  it('affiche le feedback après suppression', async () => {
    render(<FinancesPage />);
    fireEvent.click(screen.getByTestId('delete-transaction-btn-1'));
    await waitFor(() => expect(screen.getByTestId('finances-feedback')).toHaveTextContent(/supprimée avec succès/i));
    await waitFor(() => expect(screen.queryByTestId('finances-feedback')).not.toBeInTheDocument(), { timeout: 2500 });
  });
});
