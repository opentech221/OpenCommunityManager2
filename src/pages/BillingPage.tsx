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
  const [invoices] = React.useState<Invoice[]>([
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturation</h1>
          <p className="text-gray-600">Gérez votre abonnement et consultez vos factures</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan actuel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Plan actuel</h2>
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Actif</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h3>
                    <p className="text-gray-600">Pour les associations actives</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600">
                      {formatAmount(currentPlan.price)}
                    </div>
                    <div className="text-sm text-gray-600">/{currentPlan.period}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Prochaine facturation: {formatDate(currentPlan.nextBilling)}</span>
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
                  <button className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                    Modifier le plan
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Annuler l'abonnement
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé des paiements */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé des paiements</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total payé cette année</span>
                  <span className="font-semibold text-gray-900">{formatAmount(89.97)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Factures payées</span>
                  <span className="font-semibold text-gray-900">{invoices.filter(i => i.status === 'paid').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prochaine facturation</span>
                  <span className="font-semibold text-gray-900">{formatDate(currentPlan.nextBilling)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Méthode de paiement</h3>
              
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">•••• •••• •••• 4242</div>
                  <div className="text-sm text-gray-600">Expire 12/2027</div>
                </div>
              </div>
              
              <button className="w-full mt-4 text-purple-600 hover:text-purple-700 font-medium">
                Modifier la méthode de paiement
              </button>
            </div>
          </div>
        </div>

        {/* Historique des factures */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Historique des factures</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
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
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{invoice.id}</div>
                        <div className="text-sm text-gray-500">{invoice.plan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatAmount(invoice.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(invoice.status)}
                          <span className="text-sm text-gray-600">{getStatusText(invoice.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700">
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
