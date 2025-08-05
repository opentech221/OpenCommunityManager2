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
    <div className="min-h-screen bg-gray-50 pb-0">
      {/* Feedback */}
      {feedback && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50" data-testid="billing-feedback">
          {feedback}
        </div>
      )}
      <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        {/* En-tête décoré avec couleur orange */}
        <div className="mb-4 sm:mb-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 sm:p-6 border-l-4 border-orange-500 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500" data-testid="billing-title">
                Facturation & Abonnements
              </h1>
            </div>
            <div>
              <p className="text-gray-700 font-medium text-base sm:text-lg" data-testid="billing-desc">
                Gérez votre abonnement et consultez vos factures
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <strong>Facturation automatique :</strong> Paiements sécurisés et sans interruption
                  </p>
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <strong>Historique complet :</strong> Accès à toutes vos factures et reçus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques de facturation - Mobile First avec 4 tickets */}
        <div className="bg-white px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-4 mb-4 sm:mb-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-2 sm:p-3 lg:p-4 shadow hover:shadow-md transition-all duration-200">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-blue-200">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-blue-700">Pro</div>
                  <div className="text-xs sm:text-sm text-blue-600 font-medium">Plan actuel</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-2 sm:p-3 lg:p-4 shadow hover:shadow-md transition-all duration-200">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-green-200">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-green-700">29,99€</div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">Mensuel</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-2 sm:p-3 lg:p-4 shadow hover:shadow-md transition-all duration-200">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-orange-200">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600" />
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-orange-700">01/02</div>
                  <div className="text-xs sm:text-sm text-orange-600 font-medium">Prochaine</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-2 sm:p-3 lg:p-4 shadow hover:shadow-md transition-all duration-200">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-purple-200">
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-purple-700">3</div>
                  <div className="text-xs sm:text-sm text-purple-600 font-medium">Factures</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Plan actuel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900" data-testid="current-plan-title">Plan actuel</h2>
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Actif</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-100 to-purple-100 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900" data-testid="current-plan-name">{currentPlan.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600">Pour les associations actives</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600" data-testid="current-plan-price">
                      {formatAmount(currentPlan.price)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600" data-testid="current-plan-period">/{currentPlan.period}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span data-testid="next-billing">Prochaine facturation: {formatDate(currentPlan.nextBilling)}</span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Fonctionnalités incluses:</h4>
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button className="flex-1 bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors" onClick={handleChangePlan} data-testid="change-plan-btn">
                    Modifier le plan
                  </button>
                  <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors" onClick={handleCancelSubscription} data-testid="cancel-subscription-btn">
                    Annuler l'abonnement
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé des paiements */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4" data-testid="payment-summary-title">Résumé des paiements</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600" data-testid="summary-total-label">Total payé cette année</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900" data-testid="summary-total-value">{formatAmount(89.97)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600" data-testid="summary-paid-label">Factures payées</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900" data-testid="summary-paid-value">{invoices.filter(i => i.status === 'paid').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600" data-testid="summary-next-label">Prochaine facturation</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900" data-testid="summary-next-value">{formatDate(currentPlan.nextBilling)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4" data-testid="payment-method-title">Méthode de paiement</h3>
              
              <div className="flex items-center space-x-3 p-3 sm:p-4 bg-purple-100 rounded-lg">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-sm sm:text-base font-medium text-gray-900" data-testid="card-number">•••• •••• •••• 4242</div>
                  <div className="text-xs sm:text-sm text-gray-600" data-testid="card-expiry">Expire 12/2027</div>
                </div>
              </div>
              
              <button className="w-full mt-3 sm:mt-4 text-sm sm:text-base text-purple-600 hover:text-purple-700 font-medium" data-testid="change-payment-btn">
                Modifier la méthode de paiement
              </button>
            </div>
          </div>
        </div>

        {/* Historique des factures */}
        <div className="mt-6 sm:mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900" data-testid="invoice-history-title">Historique des factures</h2>
            </div>
            
            {/* Version mobile : cartes empilées */}
            <div className="block sm:hidden divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-4 hover:bg-orange-50" data-testid={`invoice-card-${invoice.id}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900 text-sm" data-testid={`invoice-id-${invoice.id}`}>{invoice.id}</div>
                      <div className="text-xs text-gray-500" data-testid={`invoice-plan-${invoice.id}`}>{invoice.plan}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900" data-testid={`invoice-amount-${invoice.id}`}>
                        {formatAmount(invoice.amount)}
                      </div>
                      <div className="text-xs text-gray-600" data-testid={`invoice-date-${invoice.id}`}>
                        {formatDate(invoice.date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2" data-testid={`invoice-status-${invoice.id}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="text-xs text-gray-600">{getStatusText(invoice.status)}</span>
                    </div>
                    <button 
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-xs" 
                      onClick={() => handleDownloadInvoice(invoice.id)} 
                      data-testid={`download-invoice-btn-${invoice.id}`}
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Version desktop : tableau */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full" data-testid="invoice-table">
                <thead className="bg-purple-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Facture
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-orange-200" data-testid={`invoice-row-${invoice.id}`}> 
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 text-sm sm:text-base" data-testid={`invoice-id-${invoice.id}`}>{invoice.id}</div>
                        <div className="text-xs sm:text-sm text-gray-500" data-testid={`invoice-plan-${invoice.id}`}>{invoice.plan}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600" data-testid={`invoice-date-${invoice.id}`}> 
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900" data-testid={`invoice-amount-${invoice.id}`}> 
                        {formatAmount(invoice.amount)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap" data-testid={`invoice-status-${invoice.id}`}> 
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(invoice.status)}
                          <span className="text-xs sm:text-sm text-gray-600">{getStatusText(invoice.status)}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                        <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700" onClick={() => handleDownloadInvoice(invoice.id)} data-testid={`download-invoice-btn-${invoice.id}`}>
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
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
