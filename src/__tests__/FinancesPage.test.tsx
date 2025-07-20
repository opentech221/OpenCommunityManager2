import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FinancesPage from '../pages/FinancesPage';

describe('FinancesPage', () => {
  it('affiche le titre et les totaux', () => {
    render(<FinancesPage />);
    expect(screen.getByTestId('finances-title')).toHaveTextContent('Gestion des finances');
    const balanceText = screen.getByTestId('finances-balance').textContent?.replace(/\s/g, '');
    expect(balanceText).toMatch(/(3850€|3850FCFA|3 850€|3 850FCFA)/);
    const incomeText = screen.getByTestId('finances-income').textContent?.replace(/\s/g, '');
    expect(incomeText).toMatch(/(5800€|5800FCFA|5 800€|5 800FCFA)/);
    const expensesText = screen.getByTestId('finances-expenses').textContent?.replace(/\s/g, '');
    expect(expensesText).toMatch(/(1950€|1950FCFA|1 950€|1 950FCFA)/);
  });

  it('affiche le tableau des transactions', () => {
    render(<FinancesPage />);
    expect(screen.getByTestId('finances-table-block')).toBeInTheDocument();
    expect(screen.getByTestId('finances-table-title')).toHaveTextContent('Transactions');
    expect(screen.getByTestId('finances-table')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-desc-1')).toHaveTextContent('Cotisations annuelles');
    const amountText = screen.getByTestId('transaction-amount-1').textContent?.replace(/\s/g, '');
    expect(amountText).toMatch(/(5000€|5000FCFA|5 000€|5 000FCFA)/);
    expect(screen.getByTestId('transaction-type-1')).toHaveTextContent('Entrée');
    expect(screen.getByTestId('transaction-category-1')).toHaveTextContent('Cotisations');
    expect(screen.getByTestId('transaction-date-1')).toBeInTheDocument();
    expect(screen.getByTestId('delete-transaction-btn-1')).toBeInTheDocument();
  });

  it('affiche le feedback après ajout', async () => {
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
