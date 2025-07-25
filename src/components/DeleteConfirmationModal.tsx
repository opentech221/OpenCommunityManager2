import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { type CotisationType } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cotisation: CotisationType | null;
  memberName?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  cotisation,
  memberName,
  onConfirm,
  isLoading = false
}) => {
  if (!isOpen || !cotisation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      {/* Modal mobile optimisé */}
      <div className="bg-white rounded-2xl w-full max-w-sm mx-auto overflow-hidden">
        {/* Header avec icône d'alerte */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Supprimer la cotisation
          </h2>
          
          <p className="text-sm text-gray-600 mb-4">
            Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette cotisation ?
          </p>
        </div>

        {/* Détails de la cotisation */}
        <div className="mx-6 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Membre:</span>
              <span className="font-medium text-gray-900">
                {memberName || `Membre #${cotisation.memberId}`}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Montant:</span>
              <span className="font-bold text-red-600">
                {formatCurrency(cotisation.amount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Date:</span>
              <span className="font-medium text-gray-900">
                {formatDate(cotisation.paymentDate)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Année:</span>
              <span className="font-medium text-gray-900">
                {cotisation.year}
              </span>
            </div>
            
            {cotisation.notes && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">Notes:</span>
                <p className="text-sm text-gray-900 mt-1">
                  {cotisation.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Annuler
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
