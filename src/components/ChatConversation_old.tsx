import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  User,
  ArrowLeft,
  Check,
  CheckCheck,
  Search,
  Archive,
  Star,
  Trash2,
  UserPlus,
  Volume2,
  VolumeX,
  Block,
  Flag,
  Copy,
  Forward,
  Reply,
  Edit3,
  X
} from 'lucide-react';

// Import des composants fonctionnels
import { EmojiPicker } from './ChatEmojis';
import { FileAttachment, AttachedFileDisplay, FilePreviewModal } from './ChatFileAttachment';
import { MessageSearch } from './ChatSearch';
import { MessageReactions, QuickReactions } from './ChatEmojis';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isSent?: boolean; // Pour les messages envoyés par l'utilisateur actuel
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar?: string;
  isOnline?: boolean;
  participants: string[];
}

interface ChatConversationProps {
  conversation: Conversation;
  currentUserId: string;
  onBack: () => void;
  onSendMessage: (content: string) => void;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  conversation,
  currentUserId,
  onBack,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'marie.dupont',
      senderName: 'Marie Dupont',
      content: 'Bonjour ! Comment ça va aujourd\'hui ?',
      timestamp: new Date('2024-08-07T10:30:00'),
      isRead: true,
      isSent: false
    },
    {
      id: '2',
      senderId: currentUserId,
      senderName: 'Moi',
      content: 'Salut Marie ! Ça va très bien merci. Et toi ?',
      timestamp: new Date('2024-08-07T10:32:00'),
      isRead: true,
      isSent: true
    },
    {
      id: '3',
      senderId: 'marie.dupont',
      senderName: 'Marie Dupont',
      content: 'Super ! Au fait, on a reçu les nouvelles de la mairie pour notre projet.',
      timestamp: new Date('2024-08-07T10:35:00'),
      isRead: true,
      isSent: false
    },
    {
      id: '4',
      senderId: 'marie.dupont',
      senderName: 'Marie Dupont',
      content: 'Ils sont d\'accord pour nous allouer le budget ! 🎉',
      timestamp: new Date('2024-08-07T10:36:00'),
      isRead: false,
      isSent: false
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gestion de l'envoi de message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: (Date.now() + Math.random()).toString(),
      senderId: currentUserId,
      senderName: 'Moi',
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: false,
      isSent: true
    };

    setMessages(prev => [...prev, message]);
    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  // Formatage de l'heure
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatage de la date pour les séparateurs
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  // Grouper les messages par date
  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const dateKey = message.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header de la conversation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors md:hidden"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            {conversation.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div>
            <h2 className="font-semibold text-gray-900">{conversation.name}</h2>
            <p className="text-sm text-gray-500">
              {conversation.isOnline ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
        {Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
          <div key={dateKey} className="mb-6">
            {/* Séparateur de date */}
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full px-3 py-1 shadow-sm border">
                <span className="text-xs text-gray-600 font-medium">
                  {formatDate(new Date(dateKey))}
                </span>
              </div>
            </div>
            
            {/* Messages du jour */}
            <div className="space-y-3">
              {dateMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isSent
                        ? 'bg-orange-500 text-white rounded-br-md'
                        : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {/* Nom de l'expéditeur (seulement pour les conversations de groupe et messages reçus) */}
                    {!message.isSent && conversation.participants.length > 2 && (
                      <div className="text-xs text-orange-600 font-medium mb-1">
                        {message.senderName}
                      </div>
                    )}
                    
                    {/* Contenu du message */}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    
                    {/* Heure et statut de lecture */}
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span className={`text-xs ${
                        message.isSent ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </span>
                      
                      {message.isSent && (
                        <div className="flex">
                          {message.isRead ? (
                            <CheckCheck className="w-3 h-3 text-orange-200" />
                          ) : (
                            <Check className="w-3 h-3 text-orange-200" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Référence pour l'auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Tapez votre message..."
              rows={1}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none max-h-32"
              style={{ minHeight: '40px' }}
            />
            <button
              type="button"
              className="absolute right-3 bottom-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Smile className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
