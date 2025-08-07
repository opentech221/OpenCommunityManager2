import React, { useState, useEffect } from 'react';
import { X, Send, User, Mail, MessageSquare } from 'lucide-react';
import { type MessageType } from '../types';

interface ComposeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { recipientId: string; subject: string; content: string }) => void;
  isLoading?: boolean;
  replyTo?: MessageType;
  forwardMessage?: MessageType;
  defaultRecipient?: string;
}

export const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({
  isOpen,
  onClose,
  onSend,
  isLoading = false,
  replyTo,
  forwardMessage,
  defaultRecipient
}) => {
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Liste simulée des membres (à remplacer par un hook useMembers)
  const availableRecipients = [
    { id: 'marie.dupont', name: 'Marie Dupont' },
    { id: 'jean.martin', name: 'Jean Martin' },
    { id: 'pierre.dubois', name: 'Pierre Dubois' },
    { id: 'sophie.bernard', name: 'Sophie Bernard' },
    { id: 'bureau', name: 'Bureau de l\'association' },
    { id: 'tous', name: 'Tous les membres' }
  ];

  // Initialisation lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      
      // Cas de réponse
      if (replyTo) {
        setRecipientId(replyTo.senderId);
        setSubject(replyTo.subject.startsWith('Re: ') ? replyTo.subject : `Re: ${replyTo.subject}`);
        setContent(`\n\n--- Message original ---\nDe: ${replyTo.senderId}\nDate: ${replyTo.sentAt.toLocaleString()}\nSujet: ${replyTo.subject}\n\n${replyTo.content}`);
      }
      // Cas de transfert
      else if (forwardMessage) {
        setRecipientId('');
        setSubject(forwardMessage.subject.startsWith('Fwd: ') ? forwardMessage.subject : `Fwd: ${forwardMessage.subject}`);
        setContent(`\n\n--- Message transféré ---\nDe: ${forwardMessage.senderId}\nDate: ${forwardMessage.sentAt.toLocaleString()}\nSujet: ${forwardMessage.subject}\n\n${forwardMessage.content}`);
      }
      // Nouveau message
      else {
        setRecipientId(defaultRecipient || '');
        setSubject('');
        setContent('');
      }
    }
  }, [isOpen, replyTo, forwardMessage, defaultRecipient]);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!recipientId.trim()) {
      newErrors.recipientId = 'Veuillez sélectionner un destinataire';
    }

    if (!subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    } else if (subject.length > 200) {
      newErrors.subject = 'Le sujet ne peut pas dépasser 200 caractères';
    }

    if (!content.trim()) {
      newErrors.content = 'Le message ne peut pas être vide';
    } else if (content.length > 5000) {
      newErrors.content = 'Le message ne peut pas dépasser 5000 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de l'envoi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSend({
      recipientId: recipientId.trim(),
      subject: subject.trim(),
      content: content.trim()
    });
  };

  // Gestion de la fermeture
  const handleClose = () => {
    if (!isLoading) {
      setRecipientId('');
      setSubject('');
      setContent('');
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  const isReply = !!replyTo;
  const isForward = !!forwardMessage;
  
  const modalTitle = isReply ? 'Répondre au message' : isForward ? 'Transférer le message' : 'Nouveau message';

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{modalTitle}</h2>
              <p className="text-sm text-gray-500">
                {isReply && 'En réponse à un message'}
                {isForward && 'Transfert d\'un message'}
                {!isReply && !isForward && 'Composer un nouveau message'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Destinataire */}
          <div>
            <label htmlFor="recipient" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Destinataire
            </label>
            <select
              id="recipient"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              disabled={isLoading || isReply}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.recipientId ? 'border-red-300' : 'border-gray-300'
              } ${isReply ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">Sélectionner un destinataire</option>
              {availableRecipients.map((recipient) => (
                <option key={recipient.id} value={recipient.id}>
                  {recipient.name}
                </option>
              ))}
            </select>
            {errors.recipientId && (
              <p className="mt-1 text-sm text-red-600">{errors.recipientId}</p>
            )}
          </div>

          {/* Sujet */}
          <div>
            <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Sujet
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isLoading}
              placeholder="Objet du message..."
              maxLength={200}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.subject ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.subject && (
                <p className="text-sm text-red-600">{errors.subject}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">{subject.length}/200</p>
            </div>
          </div>

          {/* Message original (pour réponse/transfert) */}
          {(isReply || isForward) && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">
                {isReply && 'Message original'}
                {isForward && 'Message à transférer'}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>De:</strong> {(replyTo || forwardMessage)?.senderId}</p>
                <p><strong>Sujet:</strong> {(replyTo || forwardMessage)?.subject}</p>
                <p><strong>Date:</strong> {(replyTo || forwardMessage)?.sentAt.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Contenu */}
          <div>
            <label htmlFor="content" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4" />
              Message
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              placeholder="Écrivez votre message ici..."
              maxLength={5000}
              rows={12}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">{content.length}/5000</p>
            </div>
          </div>

          {/* Footer avec actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
