import React, { useState } from 'react';
import { X, Users, User, MessageSquare, Search } from 'lucide-react';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (data: { participantIds: string[]; name: string; firstMessage: string }) => void;
  isLoading?: boolean;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  onCreateConversation,
  isLoading = false
}) => {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [conversationName, setConversationName] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [searchMembers, setSearchMembers] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Liste simulée des membres (à remplacer par un hook useMembers)
  const availableMembers: Member[] = [
    {
      id: 'marie.dupont',
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@email.com',
      isOnline: true
    },
    {
      id: 'jean.martin',
      firstName: 'Jean',
      lastName: 'Martin',
      email: 'jean.martin@email.com',
      isOnline: false
    },
    {
      id: 'pierre.dubois',
      firstName: 'Pierre',
      lastName: 'Dubois',
      email: 'pierre.dubois@email.com',
      isOnline: true
    },
    {
      id: 'sophie.bernard',
      firstName: 'Sophie',
      lastName: 'Bernard',
      email: 'sophie.bernard@email.com',
      isOnline: false
    },
    {
      id: 'claire.moreau',
      firstName: 'Claire',
      lastName: 'Moreau',
      email: 'claire.moreau@email.com',
      isOnline: true
    }
  ];

  // Membres filtrés par recherche
  const filteredMembers = availableMembers.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchMembers.toLowerCase()) ||
    member.email.toLowerCase().includes(searchMembers.toLowerCase())
  );

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedParticipants.length === 0) {
      newErrors.participants = 'Veuillez sélectionner au moins un participant';
    }

    if (!conversationName.trim()) {
      newErrors.conversationName = 'Le nom de la conversation est requis';
    } else if (conversationName.length > 100) {
      newErrors.conversationName = 'Le nom ne peut pas dépasser 100 caractères';
    }

    if (!firstMessage.trim()) {
      newErrors.firstMessage = 'Un message initial est requis';
    } else if (firstMessage.length > 1000) {
      newErrors.firstMessage = 'Le message ne peut pas dépasser 1000 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la sélection des participants
  const toggleParticipant = (memberId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Gestion de l'envoi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onCreateConversation({
      participantIds: selectedParticipants,
      name: conversationName.trim(),
      firstMessage: firstMessage.trim()
    });
  };

  // Gestion de la fermeture
  const handleClose = () => {
    if (!isLoading) {
      setSelectedParticipants([]);
      setConversationName('');
      setFirstMessage('');
      setSearchMembers('');
      setErrors({});
      onClose();
    }
  };

  // Obtenir les participants sélectionnés
  const getSelectedMembersNames = () => {
    return availableMembers
      .filter(member => selectedParticipants.includes(member.id))
      .map(member => `${member.firstName} ${member.lastName}`)
      .join(', ');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Nouvelle conversation</h2>
              <p className="text-sm text-gray-500">Créer une nouvelle discussion de groupe</p>
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
          {/* Nom de la conversation */}
          <div>
            <label htmlFor="conversationName" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4" />
              Nom de la conversation
            </label>
            <input
              type="text"
              id="conversationName"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              disabled={isLoading}
              placeholder="Ex: Préparation événement, Bureau exécutif..."
              maxLength={100}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.conversationName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.conversationName && (
                <p className="text-sm text-red-600">{errors.conversationName}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">{conversationName.length}/100</p>
            </div>
          </div>

          {/* Sélection des participants */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4" />
              Participants ({selectedParticipants.length} sélectionnés)
            </label>
            
            {/* Participants sélectionnés */}
            {selectedParticipants.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-1">Participants sélectionnés :</div>
                <div className="text-sm text-blue-700">{getSelectedMembersNames()}</div>
              </div>
            )}

            {/* Recherche */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher des membres..."
                value={searchMembers}
                onChange={(e) => setSearchMembers(e.target.value)}
                disabled={isLoading}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Liste des membres */}
            <div className={`border rounded-lg max-h-48 overflow-y-auto ${
              errors.participants ? 'border-red-300' : 'border-gray-300'
            }`}>
              {filteredMembers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Aucun membre trouvé
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedParticipants.includes(member.id)
                          ? 'bg-orange-50 border border-orange-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleParticipant(member.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          {member.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(member.id)}
                        onChange={() => {}}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.participants && (
              <p className="mt-1 text-sm text-red-600">{errors.participants}</p>
            )}
          </div>

          {/* Message initial */}
          <div>
            <label htmlFor="firstMessage" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4" />
              Message initial
            </label>
            <textarea
              id="firstMessage"
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              disabled={isLoading}
              placeholder="Écrivez le premier message de la conversation..."
              maxLength={1000}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                errors.firstMessage ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.firstMessage && (
                <p className="text-sm text-red-600">{errors.firstMessage}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">{firstMessage.length}/1000</p>
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
                  Création...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  Créer la conversation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
