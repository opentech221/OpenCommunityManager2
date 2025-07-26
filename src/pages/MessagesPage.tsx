import React, { useState } from 'react';
import { 
  Send, 
  Search,
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip,
  Smile,
  Send as SendIcon
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

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([ // dynamique
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

  // Données fictives
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Mamadou Diallo',
      lastMessage: 'Bonjour, avez-vous reçu le rapport ?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      unreadCount: 2,
      avatar: 'MD',
      isOnline: true
    },
    {
      id: '2',
      name: 'Fatou Camara',
      lastMessage: 'La réunion est confirmée pour demain',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
      unreadCount: 0,
      avatar: 'FC',
      isOnline: false
    },
    {
      id: '3',
      name: 'Ibrahima Bah',
      lastMessage: 'Merci pour les informations',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 1,
      avatar: 'IB',
      isOnline: true
    }
  ];

  // messages est maintenant dynamique

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
    <div className="min-h-screen bg-gray-50">
      {/* En-tête décoré avec couleur orange */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 shadow-sm p-6 mb-0">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Send className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-500">
                Messagerie Instantanée
              </h1>
            </div>
            <div>
              <p className="text-gray-700 font-medium text-lg">
                Communication fluide et collaboration renforcée avec votre équipe
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="text-sm text-gray-600 space-y-1">
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
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Feedback */}
        {feedback && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50">
          {feedback}
        </div>
      )}
      {/* Liste des conversations */}
      <div className="w-full md:w-80 bg-white border-b md:border-r border-gray-200 flex-shrink-0">
        {/* En-tête */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        {/* Liste des conversations */}
        <div className="max-h-64 md:max-h-none overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-orange-50 border-orange-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {conversation.avatar}
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{conversation.lastMessage}</p>
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
      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* En-tête du chat */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedConv?.avatar}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedConv?.name}</h2>
                    <p className="text-xs text-gray-500">
                      {selectedConv?.isOnline ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`relative max-w-[80vw] md:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'me'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === 'me' ? 'text-purple-100' : 'text-gray-500'
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
            {/* Zone de saisie */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Tapez votre message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  aria-label="Envoyer le message"
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // État vide
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation sélectionnée</h3>
              <p className="text-gray-500">Sélectionnez une conversation pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
