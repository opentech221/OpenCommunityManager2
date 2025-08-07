import React, { useState } from 'react';
import {
  Search,
  Plus,
  User,
  MessageCircle,
  Archive,
  MoreVertical
} from 'lucide-react';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar?: string;
  isOnline?: boolean;
  participants: string[];
  isGroup?: boolean;
}

interface ChatListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  selectedConversationId?: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  onSelectConversation,
  onNewConversation,
  selectedConversationId
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les conversations par recherche
  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Formatage de l'heure du dernier message
  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      // Aujourd'hui - afficher l'heure
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      // Autre jour - afficher la date
      const diffTime = today.getTime() - messageDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return 'Hier';
      } else if (diffDays < 7) {
        return date.toLocaleDateString('fr-FR', { weekday: 'short' });
      } else {
        return date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit'
        });
      }
    }
  };

  // Tronquer le dernier message
  const truncateMessage = (message: string, maxLength: number = 40) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Conversations</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={onNewConversation}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Nouvelle conversation"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Barre de recherche */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? 'Essayez avec d\'autres mots-clés' 
                : 'Commencez une nouvelle conversation pour échanger avec vos membres'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={onNewConversation}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Nouvelle conversation
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
                  selectedConversationId === conversation.id ? 'bg-orange-50 border-r-4 border-orange-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      conversation.isGroup 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500'
                    }`}>
                      <User className="w-6 h-6 text-white" />
                    </div>
                    {conversation.isOnline && !conversation.isGroup && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Contenu de la conversation */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-medium ${
                        conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-900'
                      } truncate`}>
                        {conversation.name}
                        {conversation.isGroup && (
                          <span className="ml-1 text-xs text-gray-500">({conversation.participants.length})</span>
                        )}
                      </h3>
                      <span className={`text-xs ${
                        conversation.unreadCount > 0 ? 'text-orange-600 font-medium' : 'text-gray-500'
                      } flex-shrink-0`}>
                        {formatLastMessageTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    
                    <p className={`text-sm ${
                      conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                    } truncate`}>
                      {truncateMessage(conversation.lastMessage)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions en bas */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Archive className="w-4 h-4" />
            <span>Archivées</span>
          </div>
          <span>{conversations.length} conversation{conversations.length > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};
