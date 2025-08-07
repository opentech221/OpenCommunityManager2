import React, { useState } from 'react';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount: number;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'other';
  senderName?: string;
}

export const MessagesDemo: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Association des Parents',
      lastMessage: 'Réunion demain à 19h',
      timestamp: '14:23',
      avatar: '/avatars/parents.jpg',
      unreadCount: 3
    },
    {
      id: '2',
      name: 'Club de Sport',
      lastMessage: 'Photos de la sortie vélo',
      timestamp: '12:15',
      avatar: '/avatars/sport.jpg',
      unreadCount: 0
    },
    {
      id: '3',
      name: 'Marie Dubois',
      lastMessage: 'Merci pour les documents !',
      timestamp: '10:30',
      avatar: '/avatars/marie.jpg',
      unreadCount: 0
    }
  ];

  const messagesByConversation: Record<string, Message[]> = {
    '1': [
      {
        id: '1-1',
        text: 'Bonjour ! Comment allez-vous ?',
        timestamp: '14:20',
        sender: 'other',
        senderName: 'Association des Parents'
      },
      {
        id: '1-2',
        text: 'Très bien merci ! Et vous ?',
        timestamp: '14:21',
        sender: 'user'
      },
      {
        id: '1-3',
        text: 'La réunion de demain est maintenue à 19h 👋',
        timestamp: '14:23',
        sender: 'other',
        senderName: 'Association des Parents'
      }
    ],
    '2': [
      {
        id: '2-1',
        text: 'Salut ! On se retrouve pour la sortie vélo demain ?',
        timestamp: '12:10',
        sender: 'other',
        senderName: 'Club de Sport'
      },
      {
        id: '2-2',
        text: 'Oui bien sûr ! À quelle heure ?',
        timestamp: '12:12',
        sender: 'user'
      },
      {
        id: '2-3',
        text: 'Photos de la sortie vélo 📸',
        timestamp: '12:15',
        sender: 'other',
        senderName: 'Club de Sport'
      }
    ],
    '3': [
      {
        id: '3-1',
        text: 'Bonjour Marie ! J\'espère que vous allez bien.',
        timestamp: '10:25',
        sender: 'user'
      },
      {
        id: '3-2',
        text: 'Bonjour ! Oui très bien merci 😊',
        timestamp: '10:28',
        sender: 'other',
        senderName: 'Marie Dubois'
      },
      {
        id: '3-3',
        text: 'Merci pour les documents !',
        timestamp: '10:30',
        sender: 'other',
        senderName: 'Marie Dubois'
      }
    ]
  };

  const messages = selectedConversation ? (messagesByConversation[selectedConversation] || []) : [];
  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Liste des conversations */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 bg-green-600 text-white">
          <h1 className="text-xl font-bold">Messages Demo</h1>
          <p className="text-sm opacity-75">Testez le changement de contenu</p>
        </div>
        
        <div className="overflow-y-auto">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                selectedConversation === conversation.id ? 'bg-green-50 border-l-4 border-l-green-600' : ''
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                {conversation.name[0]}
              </div>
              
              <div className="flex-1 ml-3 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {conversation.timestamp}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
                  
                  {conversation.unreadCount > 0 && (
                    <div className="bg-green-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && selectedConv ? (
          <>
            {/* Header */}
            <div className="bg-green-600 text-white p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {selectedConv.name[0]}
                </div>
                <div>
                  <h2 className="font-semibold">{selectedConv.name}</h2>
                  <p className="text-sm opacity-75">En ligne</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="text-center">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs inline-block mb-4">
                  Conversation avec {selectedConv.name} - {messages.length} messages
                </div>
              </div>
              
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    {message.senderName && message.sender === 'other' && (
                      <p className="text-xs font-semibold mb-1 text-green-600">
                        {message.senderName}
                      </p>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de saisie */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Tapez votre message à ${selectedConv.name}...`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
                  Envoyer
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-xl mb-2">💬</p>
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
