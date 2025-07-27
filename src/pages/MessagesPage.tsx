import React, { useState } from 'react';
import { 
  Send, 
  Search,
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip,
  Smile,
  Send as SendIcon,
  Plus,
  X,
  Check
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  isOnline: boolean;
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewDiscussionModal, setShowNewDiscussionModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchMembers, setSearchMembers] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'Mamadou Diallo',
      content: 'Bonjour, avez-vous reçu le rapport financier ?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'Moi',
      content: 'Oui, je l\'ai reçu hier. Je vais l\'examiner ce soir.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isRead: true
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'Mamadou Diallo',
      content: 'Parfait, merci !',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      isRead: false
    }
  ]);
  const [feedback, setFeedback] = useState<string>('');

  // Données des membres disponibles pour les discussions
  const members: Member[] = [
    {
      id: '1',
      firstName: 'Mamadou',
      lastName: 'Diallo',
      email: 'mamadou.diallo@email.com',
      avatar: 'MD',
      isOnline: true
    },
    {
      id: '2',
      firstName: 'Fatou',
      lastName: 'Camara',
      email: 'fatou.camara@email.com',
      avatar: 'FC',
      isOnline: false
    },
    {
      id: '3',
      firstName: 'Ibrahima',
      lastName: 'Bah',
      email: 'ibrahima.bah@email.com',
      avatar: 'IB',
      isOnline: true
    },
    {
      id: '4',
      firstName: 'Aïssatou',
      lastName: 'Sow',
      email: 'aissatou.sow@email.com',
      avatar: 'AS',
      isOnline: true
    },
    {
      id: '5',
      firstName: 'Ousmane',
      lastName: 'Traoré',
      email: 'ousmane.traore@email.com',
      avatar: 'OT',
      isOnline: false
    },
    {
      id: '6',
      firstName: 'Mariama',
      lastName: 'Barry',
      email: 'mariama.barry@email.com',
      avatar: 'MB',
      isOnline: true
    }
  ];

  // Données des conversations initiales
  React.useEffect(() => {
    setConversations([
      {
        id: '1',
        name: 'Mamadou Diallo',
        lastMessage: 'Bonjour, avez-vous reçu le rapport ?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
        unreadCount: 2,
        avatar: 'MD',
        isOnline: true
      },
      {
        id: '2',
        name: 'Fatou Camara',
        lastMessage: 'La réunion est confirmée pour demain',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unreadCount: 0,
        avatar: 'FC',
        isOnline: false
      },
      {
        id: '3',
        name: 'Ibrahima Bah',
        lastMessage: 'Merci pour les informations',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
        unreadCount: 1,
        avatar: 'IB',
        isOnline: true
      }
    ]);
  }, []);

  // Fonctions pour la nouvelle discussion
  const filteredMembers = members.filter(member => 
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchMembers.toLowerCase()) ||
    member.email.toLowerCase().includes(searchMembers.toLowerCase())
  );

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleStartNewDiscussion = () => {
    if (selectedMembers.length === 0) {
      setFeedback('Veuillez sélectionner au moins un membre');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    const selectedMemberDetails = members.filter(m => selectedMembers.includes(m.id));
    const conversationName = selectedMemberDetails.length === 1 
      ? `${selectedMemberDetails[0].firstName} ${selectedMemberDetails[0].lastName}`
      : `Discussion (${selectedMemberDetails.length} membres)`;

    const newConversation: Conversation = {
      id: Date.now().toString(),
      name: conversationName,
      lastMessage: 'Nouvelle conversation',
      lastMessageTime: new Date(),
      unreadCount: 0,
      avatar: selectedMemberDetails[0]?.avatar || 'GR',
      isOnline: selectedMemberDetails.some(m => m.isOnline)
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation.id);
    setShowNewDiscussionModal(false);
    setSelectedMembers([]);
    setSearchMembers('');
    setFeedback('Nouvelle discussion créée !');
    setTimeout(() => setFeedback(''), 2000);
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const msg: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: 'Moi',
        content: newMessage,
        timestamp: new Date(),
        isRead: true
      };
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
      setFeedback('Message envoyé !');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    setFeedback('Message supprimé.');
    setTimeout(() => setFeedback(''), 2000);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* En-tête décoré avec couleur orange - Fixe */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 shadow-sm p-4 md:p-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Send className="h-4 w-4 md:h-6 md:w-6 text-white" />
                </div>
              </div>
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-orange-500">
                Messages
              </h1>
            </div>
            <button
              className="bg-orange-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
              onClick={() => setShowNewDiscussionModal(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Nouvelle discussion</span>
              <span className="md:hidden">Nouveau</span>
            </button>
          </div>
          <div className="mt-2 md:mt-4 hidden md:block">
            <p className="text-gray-700 font-medium text-sm md:text-lg">
              Communication fluide et collaboration renforcée avec votre équipe
            </p>
            <div className="text-xs md:text-sm text-gray-600 space-y-1 mt-2">
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <strong>Messages en temps réel :</strong> Échangez instantanément avec les membres
              </p>
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <strong>Historique complet :</strong> Retrouvez facilement vos conversations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Container principal avec hauteur fixe - Layout mobile/desktop */}
      <div className="flex flex-1 overflow-hidden">
        {/* Liste des conversations - Mobile: pleine largeur si pas de conversation sélectionnée, sinon cachée */}
        <div className={`${
          selectedConversation ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 bg-white border-b md:border-r border-gray-200 flex-shrink-0 flex-col`}>
          {/* En-tête de recherche - Fixe */}
          <div className="p-3 md:p-4 border-b border-gray-200 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          {/* Liste des conversations - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-orange-50 border-orange-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
                      {conversation.avatar}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 md:bottom-0 md:right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm md:text-base font-medium text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{conversation.unreadCount}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de chat principale - Mobile: pleine largeur si conversation sélectionnée */}
        <div className={`${
          selectedConversation ? 'flex' : 'hidden md:flex'
        } flex-1 flex-col bg-white`}>
          {selectedConversation ? (
            <>
              {/* En-tête du chat - Fixe avec bouton retour mobile */}
              <div className="bg-white border-b border-gray-200 p-3 md:p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Bouton retour visible uniquement sur mobile */}
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
                      {selectedConv?.avatar}
                    </div>
                    <div>
                      <h2 className="text-base md:text-lg font-semibold text-gray-900">{selectedConv?.name}</h2>
                      <p className="text-xs text-gray-500">
                        {selectedConv?.isOnline ? 'En ligne' : 'Hors ligne'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <button className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Zone des messages - Scrollable uniquement ici */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`relative max-w-[85%] md:max-w-[80%] lg:max-w-md px-3 py-2 md:px-4 md:py-2 rounded-lg ${
                        message.senderId === 'me'
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-900 shadow-sm border'
                      }`}
                    >
                      <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === 'me' ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {message.senderId === 'me' && (
                        <button
                          className="absolute top-2 right-2 text-red-300 hover:text-red-500"
                          title="Supprimer le message"
                          aria-label="Supprimer le message"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Zone de saisie - Fixe en bas */}
              <div className="bg-white border-t border-gray-200 p-3 md:p-4 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Tapez votre message..."
                      className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors hidden md:block">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    aria-label="Envoyer le message"
                  >
                    <SendIcon className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // État vide - Adapté mobile
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                </div>
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                  Aucune conversation sélectionnée
                </h3>
                <p className="text-sm md:text-base text-gray-500 text-center">
                  Sélectionnez une conversation pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour nouvelle discussion - Adapté mobile */}
      {showNewDiscussionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md mx-auto max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold">Nouvelle discussion</h3>
              <button
                onClick={() => setShowNewDiscussionModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Barre de recherche */}
            <div className="mb-4 flex-shrink-0">
              <input
                type="text"
                placeholder="Rechercher un membre..."
                value={searchMembers}
                onChange={(e) => setSearchMembers(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
              />
            </div>

            {/* Liste des membres - Scrollable */}
            <div className="flex-1 overflow-y-auto mb-4 min-h-0">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center p-3 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => toggleMemberSelection(member.id)}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="relative">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-medium text-sm">
                          {member.avatar}
                        </span>
                      </div>
                      {member.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm md:text-base truncate">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    {selectedMembers.includes(member.id) ? (
                      <Check className="w-5 h-5 text-orange-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                    )}
                  </div>
                </div>
              ))}
              {filteredMembers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun membre trouvé
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 flex-shrink-0">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                {selectedMembers.length} membre(s) sélectionné(s)
              </p>
              <div className="flex space-x-2 justify-center sm:justify-end">
                <button
                  onClick={() => setShowNewDiscussionModal(false)}
                  className="flex-1 sm:flex-none px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleStartNewDiscussion}
                  disabled={selectedMembers.length === 0}
                  className="flex-1 sm:flex-none px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message de feedback - Adapté mobile */}
      {feedback && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto bg-green-500 text-white px-4 py-3 rounded-md shadow-lg z-50 text-center md:text-left text-sm">
          {feedback}
        </div>
      )}
    </div>
  );
}
