import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, CreditCard, FileText, User, AlertCircle } from 'lucide-react';
import { PaymentStatus, PaymentMethod, type CotisationType } from '../types';
import { formatCurrency } from '../utils';
import { useMembers } from '../hooks/useMembers';

interface CotisationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  cotisation?: CotisationType | null;
  onSave: (cotisation: Partial<CotisationType>) => void;
  isLoading?: boolean;
}

export const CotisationFormModal: React.FC<CotisationFormModalProps> = ({
  isOpen,
  onClose,
  cotisation,
  onSave,
  isLoading = false
}) => {
  const { members, isLoading: membersLoading } = useMembers();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    paymentDate: '',
    paymentMethod: PaymentMethod.CASH as PaymentMethod,
    status: PaymentStatus.PENDING as PaymentStatus,
    year: new Date().getFullYear(),
    notes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialiser le formulaire avec les données de la cotisation existante
  useEffect(() => {
    if (cotisation) {
      setFormData({
        memberId: cotisation.memberId,
        amount: cotisation.amount.toString(),
        paymentDate: cotisation.paymentDate.toISOString().split('T')[0],
        paymentMethod: cotisation.paymentMethod,
        status: cotisation.status,
        year: cotisation.year,
        notes: cotisation.notes || ''
      });
    } else {
      // Réinitialiser pour nouveau
      setFormData({
        memberId: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: PaymentMethod.CASH as PaymentMethod,
        status: PaymentStatus.PENDING as PaymentStatus,
        year: new Date().getFullYear(),
        notes: ''
      });
    }
    setErrors({});
  }, [cotisation, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.memberId) {
      newErrors.memberId = 'Veuillez sélectionner un membre';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'La date de paiement est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const cotisationData: Partial<CotisationType> = {
      memberId: formData.memberId,
      amount: parseFloat(formData.amount),
      paymentDate: new Date(formData.paymentDate),
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      year: formData.year,
      notes: formData.notes || undefined
    };

    onSave(cotisationData);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!cotisation;
  const selectedMember = members.find(m => m.id === formData.memberId);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center">
      {/* Modal mobile - glisse depuis le bas */}
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Modifier la cotisation' : 'Nouvelle cotisation'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Corps du formulaire */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Sélection du membre */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Membre
              </label>
              <select
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                  errors.memberId ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isLoading || membersLoading}
              >
                <option value="">Sélectionner un membre</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName}
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
                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    📧 {selectedMember.email} • 📱 {selectedMember.phone}
                  </p>
                </div>
              )}
            </div>

            {/* Montant */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                Montant (FCFA)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="15000"
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                  errors.amount ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isLoading}
                min="0"
                step="100"
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
                Date de paiement
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                  errors.paymentDate ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isLoading}
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
                Année de cotisation
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                disabled={isLoading}
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Méthode de paiement */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4" />
                Méthode de paiement
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(PaymentMethod).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method as PaymentMethod })}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.paymentMethod === method
                        ? 'bg-violet-50 border-violet-500 text-violet-700'
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
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Statut du paiement
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(PaymentStatus).map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: status as PaymentStatus })}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.status === status
                        ? status === PaymentStatus.PAID ? 'bg-green-50 border-green-500 text-green-700' :
                          status === PaymentStatus.PENDING ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
                          'bg-red-50 border-red-500 text-red-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                    disabled={isLoading}
                  >
                    {status === PaymentStatus.PAID ? '✅ Payée' :
                     status === PaymentStatus.PENDING ? '⏳ En attente' :
                     '⚠️ En retard'}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="cotisation-notes" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Notes (optionnel)
              </label>
              <textarea
                id="cotisation-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ajouter des notes sur cette cotisation..."
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
                disabled={isLoading}
              />
            </div>
          </div>
        </form>

        {/* Footer avec actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-violet-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
