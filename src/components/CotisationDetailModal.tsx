import React from 'react';
import { X, Calendar, DollarSign, User, CreditCard, FileText, Clock, Check, AlertCircle } from 'lucide-react';
import { PaymentStatus, PaymentMethod, type CotisationType } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface CotisationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cotisation: CotisationType | null;
  member?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  } | null;
}

export const CotisationDetailModal: React.FC<CotisationDetailModalProps> = ({
  isOpen,
  onClose,
  cotisation,
  member
}) => {
  if (!isOpen || !cotisation) return null;

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return <Check className="w-4 h-4 text-green-600" />;
      case PaymentStatus.PENDING:
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case PaymentStatus.OVERDUE:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusStyle = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-green-100 border-green-200 text-green-800';
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case PaymentStatus.OVERDUE:
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getStatusLabel = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'Payée';
      case PaymentStatus.PENDING:
        return 'En attente';
      case PaymentStatus.OVERDUE:
        return 'En retard';
      default:
        return 'Inconnu';
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CASH:
        return '💵 Espèces';
      case PaymentMethod.BANK_TRANSFER:
        return '🏦 Virement bancaire';
      case PaymentMethod.MOBILE_MONEY:
        return '📱 Mobile Money';
      case PaymentMethod.CHECK:
        return '📋 Chèque';
      default:
        return method;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header avec statut */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Détails de la cotisation</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(cotisation.status)}`}>
                  {getStatusIcon(cotisation.status)}
                  {getStatusLabel(cotisation.status)}
                </span>
                <span className="text-sm text-gray-500">#{cotisation.id}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Contenu principal */}
        <div className="p-6 space-y-6">
          {/* Informations du membre */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Informations du membre</h3>
            </div>
            {member ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700 font-medium">{member.firstName} {member.lastName}</span>
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{member.role}</span>
                </div>
                <div className="text-sm space-y-1">
                  <p className="text-blue-600">📧 {member.email}</p>
                  <p className="text-blue-600">📞 {member.phone}</p>
                </div>
              </div>
            ) : (
              <p className="text-blue-600">Membre introuvable</p>
            )}
          </div>

          {/* Détails de la cotisation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Montant */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Montant</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(cotisation.amount)}</p>
            </div>

            {/* Année */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Année de cotisation</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{cotisation.year}</p>
            </div>
          </div>

          {/* Informations de paiement */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-600" />
              Informations de paiement
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Date de paiement</span>
                </div>
                <p className="font-medium text-gray-900">{formatDate(cotisation.paymentDate)}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Méthode de paiement</span>
                </div>
                <p className="font-medium text-gray-900">{getPaymentMethodLabel(cotisation.paymentMethod)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {cotisation.notes && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Notes</span>
              </div>
              <p className="text-yellow-900 whitespace-pre-wrap">{cotisation.notes}</p>
            </div>
          )}

          {/* Informations système */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Informations système</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">ID de la cotisation:</span>
                <p className="font-mono text-gray-700">{cotisation.id}</p>
              </div>
              <div>
                <span className="text-gray-500">ID du membre:</span>
                <p className="font-mono text-gray-700">{cotisation.memberId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
