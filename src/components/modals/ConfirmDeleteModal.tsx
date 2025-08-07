import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  type?: 'danger' | 'warning';
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full animate-scaleIn">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className={`w-5 h-5 mr-2 ${type === 'danger' ? 'text-red-600' : 'text-yellow-600'}`} />
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className={`p-4 rounded-lg mb-4 ${
            type === 'danger' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start">
              <AlertTriangle className={`w-5 h-5 mt-0.5 mr-3 ${
                type === 'danger' ? 'text-red-600' : 'text-yellow-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  type === 'danger' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {message}
                </p>
                {itemName && (
                  <p className={`text-sm mt-1 font-semibold ${
                    type === 'danger' ? 'text-red-900' : 'text-yellow-900'
                  }`}>
                    "{itemName}"
                  </p>
                )}
                <p className={`text-xs mt-2 ${
                  type === 'danger' ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  Cette action est irréversible.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center space-x-2 ${
                type === 'danger' 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                  : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
