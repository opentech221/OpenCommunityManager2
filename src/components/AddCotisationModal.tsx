import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, DollarSign, CreditCard, FileText, User, AlertCircle } from 'lucide-react';
import { PaymentStatus, PaymentMethod, type CotisationType } from '../types';
import { formatCurrency } from '../utils';

interface AddCotisationModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>;
  onSave: (data: Omit<CotisationType, 'id'>) => void;
  isLoading?: boolean;
}

export const AddCotisationModal: React.FC<AddCotisationModalProps> = ({
  isOpen,
  onClose,
  members,
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: PaymentMethod.CASH as PaymentMethod,
    status: PaymentStatus.PENDING as PaymentStatus,
    year: new Date().getFullYear(),
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        memberId: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: PaymentMethod.CASH,
        status: PaymentStatus.PENDING,
        year: new Date().getFullYear(),
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.memberId) {
      newErrors.memberId = 'Veuillez sélectionner un membre';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Veuillez sélectionner une date de paiement';
    }

    if (formData.year < 2000 || formData.year > 2100) {
      newErrors.year = 'L\'année doit être comprise entre 2000 et 2100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newCotisation: Omit<CotisationType, 'id'> = {
        memberId: formData.memberId,
        amount: parseFloat(formData.amount),
        paymentDate: new Date(formData.paymentDate),
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        year: formData.year,
        notes: formData.notes || undefined
      };
      onSave(newCotisation);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const selectedMember = members.find(m => m.id === formData.memberId);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Nouvelle cotisation</h2>
              <p className="text-sm text-gray-500">Ajouter une nouvelle cotisation</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Sélection du membre */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Membre *
              </label>
              <select
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.memberId ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isLoading}
                required
              >
                <option value="">Sélectionner un membre...</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName} - {member.role}
                  </option>
                ))}
              </select>
              {errors.memberId && (
                <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.memberId}
                </p>
              )}
              {selectedMember && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-blue-900">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </span>
                    <span className="text-blue-600">({selectedMember.role})</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">📧 {selectedMember.email}</p>
                </div>
              )}
            </div>

            {/* Montant */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                Montant (FCFA) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="15000"
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.amount ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isLoading}
                min="0"
                step="100"
                required
              />
              {errors.amount && (
                <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.amount}
                </p>
              )}
              {formData.amount && (
                <p className="text-sm text-gray-600 mt-1">
                  Aperçu: {formatCurrency(parseFloat(formData.amount) || 0)}
                </p>
              )}
            </div>

            {/* Date de paiement */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Date de paiement *
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.paymentDate ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isLoading}
                required
              />
              {errors.paymentDate && (
                <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.paymentDate}
                </p>
              )}
            </div>

            {/* Année */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Année de cotisation *
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                placeholder="2024"
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.year ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isLoading}
                min="2000"
                max="2100"
                required
              />
              {errors.year && (
                <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.year}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Par défaut: {new Date().getFullYear()}
              </p>
            </div>

            {/* Méthode de paiement */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <CreditCard className="w-4 h-4" />
                Méthode de paiement
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(PaymentMethod).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method })}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.paymentMethod === method
                        ? 'bg-orange-50 border-orange-500 text-orange-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                    disabled={isLoading}
                  >
                    {method === PaymentMethod.CASH ? '💵 Espèces' :
                     method === PaymentMethod.BANK_TRANSFER ? '🏦 Virement' :
                     method === PaymentMethod.MOBILE_MONEY ? '📱 Mobile Money' :
                     method === PaymentMethod.CHECK ? '📋 Chèque' : method}
                  </button>
                ))}
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Statut du paiement
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(PaymentStatus).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: status })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      formData.status === status
                        ? status === PaymentStatus.PAID ? 'bg-green-100 border border-green-300 text-green-800' :
                          status === PaymentStatus.PENDING ? 'bg-yellow-100 border border-yellow-300 text-yellow-800' :
                          'bg-red-100 border border-red-300 text-red-800'
                        : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={isLoading}
                  >
                    {status === PaymentStatus.PAID ? '✓ Payée' :
                     status === PaymentStatus.PENDING ? '⏳ En attente' :
                     '⚠️ En retard'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Par défaut: En attente
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Notes (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ajouter des notes sur cette cotisation..."
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none min-h-[80px] max-h-[120px]"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Ajout...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Ajouter
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
