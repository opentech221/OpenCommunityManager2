/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { CreditCard, Calendar, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  plan: string;
  downloadUrl: string;
}

const BillingPage: React.FC = () => {
  const [invoices, setInvoices] = React.useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      amount: 29.99,
      status: 'paid',
      plan: 'Plan Pro',
      downloadUrl: '/invoices/INV-2024-001.pdf'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-01',
      amount: 29.99,
      status: 'paid',
      plan: 'Plan Pro',
      downloadUrl: '/invoices/INV-2023-012.pdf'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-01',
      amount: 29.99,
      status: 'paid',
      plan: 'Plan Pro',
      downloadUrl: '/invoices/INV-2023-011.pdf'
    }
  ]);
  const [feedback, setFeedback] = React.useState<string>('');
  // Handlers
  const handleChangePlan = () => {
    setFeedback('Votre plan a été modifié avec succès.');
    setTimeout(() => setFeedback(''), 2500);
  };

  const handleCancelSubscription = () => {
    setFeedback("Votre abonnement a été annulé.");
    setTimeout(() => setFeedback(''), 2500);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    setFeedback(`Facture ${invoiceId} téléchargée.`);
    setTimeout(() => setFeedback(''), 2000);
  };

  const currentPlan = {
    name: 'Plan Pro',
    price: 29.99,
    currency: 'EUR',
    period: 'mois',
    nextBilling: '2024-02-01',
    features: [
      'Membres illimités',
      'Événements illimités',
      'Rapports avancés',
      'Support prioritaire',
      'Intégrations personnalisées'
    ]
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'Payée';
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
      default:
        return 'Inconnu';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Feedback */}
      {feedback && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50" data-testid="billing-feedback">
          {feedback}
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="billing-title">Facturation</h1>
          <p className="text-gray-600" data-testid="billing-desc">Gérez votre abonnement et consultez vos factures</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan actuel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900" data-testid="current-plan-title">Plan actuel</h2>
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Actif</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900" data-testid="current-plan-name">{currentPlan.name}</h3>
                    <p className="text-gray-600">Pour les associations actives</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600" data-testid="current-plan-price">
                      {formatAmount(currentPlan.price)}
                    </div>
                    <div className="text-sm text-gray-600" data-testid="current-plan-period">/{currentPlan.period}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span data-testid="next-billing">Prochaine facturation: {formatDate(currentPlan.nextBilling)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Fonctionnalités incluses:</h4>
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <button className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors" onClick={handleChangePlan} data-testid="change-plan-btn">
                    Modifier le plan
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors" onClick={handleCancelSubscription} data-testid="cancel-subscription-btn">
                    Annuler l'abonnement
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé des paiements */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="payment-summary-title">Résumé des paiements</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600" data-testid="summary-total-label">Total payé cette année</span>
                  <span className="font-semibold text-gray-900" data-testid="summary-total-value">{formatAmount(89.97)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600" data-testid="summary-paid-label">Factures payées</span>
                  <span className="font-semibold text-gray-900" data-testid="summary-paid-value">{invoices.filter(i => i.status === 'paid').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600" data-testid="summary-next-label">Prochaine facturation</span>
                  <span className="font-semibold text-gray-900" data-testid="summary-next-value">{formatDate(currentPlan.nextBilling)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="payment-method-title">Méthode de paiement</h3>
              
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900" data-testid="card-number">•••• •••• •••• 4242</div>
                  <div className="text-sm text-gray-600" data-testid="card-expiry">Expire 12/2027</div>
                </div>
              </div>
              
              <button className="w-full mt-4 text-purple-600 hover:text-purple-700 font-medium" data-testid="change-payment-btn">
                Modifier la méthode de paiement
              </button>
            </div>
          </div>
        </div>

        {/* Historique des factures */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900" data-testid="invoice-history-title">Historique des factures</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="invoice-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facture
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50" data-testid={`invoice-row-${invoice.id}`}> 
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900" data-testid={`invoice-id-${invoice.id}`}>{invoice.id}</div>
                        <div className="text-sm text-gray-500" data-testid={`invoice-plan-${invoice.id}`}>{invoice.plan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" data-testid={`invoice-date-${invoice.id}`}> 
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" data-testid={`invoice-amount-${invoice.id}`}> 
                        {formatAmount(invoice.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-testid={`invoice-status-${invoice.id}`}> 
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(invoice.status)}
                          <span className="text-sm text-gray-600">{getStatusText(invoice.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700" onClick={() => handleDownloadInvoice(invoice.id)} data-testid={`download-invoice-btn-${invoice.id}`}>
                          <Download className="w-4 h-4" />
                          <span>Télécharger</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
