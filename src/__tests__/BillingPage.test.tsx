import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BillingPage from '../pages/BillingPage';

describe('BillingPage', () => {
  it('affiche le titre et la description', () => {
    render(<BillingPage />);
    expect(screen.getByTestId('billing-title')).toHaveTextContent('Facturation');
    expect(screen.getByTestId('billing-desc')).toHaveTextContent('Gérez votre abonnement et consultez vos factures');
  });

  it('affiche le plan actuel et le prix', () => {
    render(<BillingPage />);
    expect(screen.getByTestId('current-plan-title')).toHaveTextContent('Plan actuel');
    expect(screen.getByTestId('current-plan-name')).toHaveTextContent('Plan Pro');
    const priceText = screen.getByTestId('current-plan-price').textContent?.replace(/\s/g, '');
    expect(priceText).toMatch(/(29,99€|€29,99|29999FCFA|FCFA29999|29 999FCFA|FCFA29 999)/);
    expect(screen.getByTestId('current-plan-period')).toHaveTextContent('/mois');
  });

  it('affiche le résumé des paiements', () => {
    render(<BillingPage />);
    expect(screen.getByTestId('payment-summary-title')).toHaveTextContent('Résumé des paiements');
    expect(screen.getByTestId('summary-total-label')).toHaveTextContent('Total payé cette année');
    const totalText = screen.getByTestId('summary-total-value').textContent?.replace(/\s/g, '');
    expect(totalText).toMatch(/(89,97€|€89,97|89997FCFA|FCFA89997|89 997FCFA|FCFA89 997)/);
    expect(screen.getByTestId('summary-paid-label')).toHaveTextContent('Factures payées');
    expect(screen.getByTestId('summary-paid-value')).toHaveTextContent('3');
    expect(screen.getByTestId('summary-next-label')).toHaveTextContent('Prochaine facturation');
    expect(screen.getByTestId('summary-next-value')).toHaveTextContent('1 février 2024');
  });

  it('affiche la méthode de paiement', () => {
    render(<BillingPage />);
    expect(screen.getByTestId('payment-method-title')).toHaveTextContent('Méthode de paiement');
    expect(screen.getByTestId('card-number')).toHaveTextContent('•••• •••• •••• 4242');
    expect(screen.getByTestId('card-expiry')).toHaveTextContent('Expire 12/2027');
  });

  it("affiche l'historique des factures", () => {
    render(<BillingPage />);
    expect(screen.getByTestId('invoice-history-title')).toHaveTextContent('Historique des factures');
    expect(screen.getByTestId('invoice-table')).toBeInTheDocument();
    expect(screen.getByTestId('invoice-row-INV-2024-001')).toBeInTheDocument();
    expect(screen.getByTestId('invoice-id-INV-2024-001')).toHaveTextContent('INV-2024-001');
    expect(screen.getByTestId('invoice-plan-INV-2024-001')).toHaveTextContent('Plan Pro');
    expect(screen.getByTestId('invoice-date-INV-2024-001')).toHaveTextContent('1 janvier 2024');
    const invoiceText = screen.getByTestId('invoice-amount-INV-2024-001').textContent?.replace(/\s/g, '');
    expect(invoiceText).toMatch(/(29,99€|€29,99|29999FCFA|FCFA29999|29 999FCFA|FCFA29 999)/);
    expect(screen.getByTestId('invoice-status-INV-2024-001')).toHaveTextContent('Payée');
    expect(screen.getByTestId('download-invoice-btn-INV-2024-001')).toBeInTheDocument();
  });

  it('affiche le feedback lors du changement de plan', async () => {
    render(<BillingPage />);
    fireEvent.click(screen.getByTestId('change-plan-btn'));
    expect(screen.getByTestId('billing-feedback')).toHaveTextContent('Votre plan a été modifié avec succès.');
    await waitFor(() => {
      expect(screen.queryByTestId('billing-feedback')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("affiche le feedback lors de l'annulation de l'abonnement", async () => {
    render(<BillingPage />);
    fireEvent.click(screen.getByTestId('cancel-subscription-btn'));
    expect(screen.getByTestId('billing-feedback')).toHaveTextContent('Votre abonnement a été annulé.');
    await waitFor(() => {
      expect(screen.queryByTestId('billing-feedback')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('affiche le feedback lors du téléchargement de facture', async () => {
    render(<BillingPage />);
    fireEvent.click(screen.getByTestId('download-invoice-btn-INV-2024-001'));
    expect(screen.getByTestId('billing-feedback')).toHaveTextContent('Facture INV-2024-001 téléchargée.');
    await waitFor(() => {
      expect(screen.queryByTestId('billing-feedback')).not.toBeInTheDocument();
    }, { timeout: 2500 });
  });
});
