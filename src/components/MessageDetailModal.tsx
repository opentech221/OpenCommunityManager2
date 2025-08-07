import React from 'react';
import { X, MessageSquare, User, Calendar, Mail, Reply, Forward, Trash2 } from 'lucide-react';
import { type MessageType } from '../types';
import { formatDate } from '../utils';

interface MessageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: MessageType | null;
  onReply?: (message: MessageType) => void;
  onForward?: (message: MessageType) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  isOpen,
  onClose,
  message,
  onReply,
  onForward,
  onDelete
}) => {
  if (!isOpen || !message) return null;

  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
    onClose();
  };

  const handleForward = () => {
    if (onForward) {
      onForward(message);
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      if (onDelete) {
        onDelete(message.id);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Détails du message</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${
                  message.isRead 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {message.isRead ? 'Lu' : 'Non lu'}
                </span>
                <span className="text-sm text-gray-500">#{message.id}</span>
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
          {/* Sujet du message */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Sujet</h3>
            </div>
            <p className="text-blue-800 font-medium text-lg">{message.subject}</p>
          </div>

          {/* Informations du message */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Expéditeur */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Expéditeur</span>
              </div>
              <p className="text-lg font-bold text-purple-900">{message.senderId}</p>
            </div>

            {/* Date d'envoi */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Date d'envoi</span>
              </div>
              <p className="text-lg font-bold text-green-900">{formatDate(message.sentAt)}</p>
            </div>
          </div>

          {/* Destinataire (si spécifié) */}
          {message.recipientId && (
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Destinataire</span>
              </div>
              <p className="text-lg font-bold text-orange-900">{message.recipientId}</p>
            </div>
          )}

          {/* Contenu du message */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              Contenu du message
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          </div>

          {/* Actions sur le message */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleReply}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Reply className="w-4 h-4" />
                Répondre
              </button>
              <button
                onClick={handleForward}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Forward className="w-4 h-4" />
                Transférer
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>

          {/* Informations système */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Informations système</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">ID du message:</span>
                <p className="font-mono text-gray-700">{message.id}</p>
              </div>
              <div>
                <span className="text-gray-500">Association ID:</span>
                <p className="font-mono text-gray-700">{message.associationId}</p>
              </div>
              <div>
                <span className="text-gray-500">Statut de lecture:</span>
                <p className="font-mono text-gray-700">{message.isRead ? 'Lu' : 'Non lu'}</p>
              </div>
              <div>
                <span className="text-gray-500">Date de création:</span>
                <p className="font-mono text-gray-700">{formatDate(message.sentAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex gap-3">
            <button
              onClick={handleReply}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Répondre
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
