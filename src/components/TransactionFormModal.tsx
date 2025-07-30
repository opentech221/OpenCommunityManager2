import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, FileText, Tag, Calendar, AlertCircle } from 'lucide-react';
import { TransactionType, type Transaction } from '../types';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  onSave: (transaction: Partial<Transaction>) => void;
  isLoading?: boolean;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onSave,
  isLoading = false
}) => {
  // États du formulaire
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: TransactionType.EXPENSE as TransactionType,
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialiser le formulaire avec les données de la transaction existante
  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date.toISOString().split('T')[0]
      });
    } else {
      // Réinitialiser pour nouveau
      setFormData({
        description: '',
        amount: '',
        type: TransactionType.EXPENSE,
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [transaction, isOpen]);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isLoading) return;

    const transactionData: Partial<Transaction> = {
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category.trim(),
      date: new Date(formData.date)
    };

    onSave(transactionData);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!transaction;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center">
      {/* Modal mobile - glisse depuis le bas */}
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Modifier la transaction' : 'Nouvelle transaction'}
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
            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Description de la transaction"
                disabled={isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Montant */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                Montant
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                  errors.amount ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="0.00"
                disabled={isLoading}
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Type de transaction */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4" />
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: TransactionType.INCOME })}
                  className={`p-3 border rounded-xl transition-all ${
                    formData.type === TransactionType.INCOME
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  ↗️ Recette
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: TransactionType.EXPENSE })}
                  className={`p-3 border rounded-xl transition-all ${
                    formData.type === TransactionType.EXPENSE
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  ↘️ Dépense
                </button>
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4" />
                Catégorie
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Ex: Cotisations, Fournitures, etc."
                disabled={isLoading}
              />
              {errors.category && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                  errors.date ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isLoading}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.date}
                </p>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditing ? 'Modification...' : 'Ajout...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? 'Modifier' : 'Ajouter'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
