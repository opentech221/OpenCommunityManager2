import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Smile,
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
  Ban,
  Flag,
  Copy,
  Forward,
  Reply,
  Edit3,
  X,
  Mic
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
  isSent?: boolean;
  reactions?: { [emoji: string]: string[] };
  attachments?: File[];
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
  onSendMessage: (content: string, attachments?: File[]) => void;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  conversation,
  currentUserId,
  onBack,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMessageMenu, setShowMessageMenu] = useState<string | null>(null);
  const [showQuickReactions, setShowQuickReactions] = useState<{
    messageId: string;
    position: { x: number; y: number };
  } | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'user2',
      senderName: 'Marie Dupont',
      content: 'Salut ! Comment ça va ?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true,
      reactions: { '👍': ['user1'], '❤️': ['user1', 'user3'] }
    },
    {
      id: '2',
      senderId: currentUserId,
      senderName: 'Moi',
      content: 'Ça va bien, merci ! Et toi ?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isRead: true,
      isSent: true
    },
    {
      id: '3',
      senderId: 'user2',
      senderName: 'Marie Dupont',
      content: 'Parfait ! Je voulais te parler du prochain événement de l\'association.',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      isRead: true
    },
    {
      id: '4',
      senderId: currentUserId,
      senderName: 'Moi',
      content: 'Excellente idée ! Je suis tout ouïe 👂',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isRead: true,
      isSent: true,
      reactions: { '😄': ['user2'] }
    }
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Hier";
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long'
    }).format(messageDate);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() || attachedFiles.length > 0) {
      const messageContent = newMessage.trim();
      
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: 'Moi',
        content: messageContent || `${attachedFiles.length} fichier(s) envoyé(s)`,
        timestamp: new Date(),
        isRead: false,
        isSent: true,
        attachments: attachedFiles.length > 0 ? attachedFiles : undefined
      };

      setMessages(prev => [...prev, newMsg]);
      onSendMessage(messageContent, attachedFiles);
      setNewMessage('');
      setAttachedFiles([]);
      setReplyToMessage(null);
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const handleFileSelect = (files: File[]) => {
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMessageReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        if (reactions[emoji]) {
          const userIndex = reactions[emoji].indexOf(currentUserId);
          if (userIndex > -1) {
            reactions[emoji].splice(userIndex, 1);
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          } else {
            reactions[emoji].push(currentUserId);
          }
        } else {
          reactions[emoji] = [currentUserId];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const handleMessageLongPress = (messageId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setShowQuickReactions({
      messageId,
      position: { x: rect.left + rect.width / 2, y: rect.top }
    });
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    setShowMessageMenu(null);
    alert('Message copié !');
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setShowMessageMenu(null);
  };

  const handleReplyToMessage = (message: ChatMessage) => {
    setReplyToMessage(message);
    setShowMessageMenu(null);
    inputRef.current?.focus();
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Ici implémenter l'enregistrement vocal
    if (!isRecording) {
      alert('Enregistrement vocal démarré...');
    } else {
      alert('Enregistrement vocal arrêté !');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const moreMenuItems = [
    { icon: Search, label: 'Rechercher', action: () => setShowSearch(true) },
    { icon: isMuted ? Volume2 : VolumeX, label: isMuted ? 'Réactiver' : 'Couper le son', action: () => setIsMuted(!isMuted) },
    { icon: UserPlus, label: 'Ajouter participant', action: () => alert('Ajouter un participant') },
    { icon: isStarred ? Star : Star, label: isStarred ? 'Retirer des favoris' : 'Ajouter aux favoris', action: () => setIsStarred(!isStarred) },
    { icon: Archive, label: isArchived ? 'Désarchiver' : 'Archiver', action: () => setIsArchived(!isArchived) },
    { icon: Ban, label: 'Bloquer', action: () => alert('Bloquer cette conversation ?') },
    { icon: Flag, label: 'Signaler', action: () => alert('Signaler cette conversation') },
    { icon: Trash2, label: 'Supprimer conversation', action: () => alert('Supprimer la conversation ?') }
  ];

  const messageMenuItems = (message: ChatMessage) => [
    { icon: Reply, label: 'Répondre', action: () => handleReplyToMessage(message) },
    { icon: Copy, label: 'Copier', action: () => handleCopyMessage(message.content) },
    { icon: Forward, label: 'Transférer', action: () => alert('Transférer le message') },
    { icon: Star, label: 'Marquer', action: () => alert('Message marqué') },
    ...(message.senderId === currentUserId ? [
      { icon: Edit3, label: 'Modifier', action: () => alert('Modifier le message') },
      { icon: Trash2, label: 'Supprimer', action: () => handleDeleteMessage(message.id) }
    ] : []),
    { icon: Flag, label: 'Signaler', action: () => alert('Message signalé') }
  ];

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              {conversation.avatar ? (
                <img 
                  src={conversation.avatar} 
                  alt={conversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {getInitials(conversation.name)}
                  </span>
                </div>
              )}
              {conversation.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">{conversation.name}</h3>
              <p className="text-sm text-gray-500">
                {conversation.isOnline ? 'En ligne' : 'Hors ligne'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video size={20} className="text-gray-600" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical size={20} className="text-gray-600" />
            </button>
            
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {moreMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <item.icon size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      {showSearch && (
        <MessageSearch
          messages={messages}
          onMessageSelect={(messageId) => {
            // Scroll vers le message
            document.getElementById(`message-${messageId}`)?.scrollIntoView({ behavior: 'smooth' });
          }}
          isVisible={showSearch}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Groupement des messages par date */}
        {messages.reduce((acc: React.ReactNode[], message, index) => {
          const messageDate = formatDate(message.timestamp);
          const prevMessageDate = index > 0 ? formatDate(messages[index - 1].timestamp) : null;
          
          if (messageDate !== prevMessageDate) {
            acc.push(
              <div key={`date-${messageDate}`} className="flex justify-center my-4">
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {messageDate}
                </span>
              </div>
            );
          }
          
          const isFromCurrentUser = message.senderId === currentUserId;
          const showAvatar = !isFromCurrentUser && (
            index === messages.length - 1 || 
            messages[index + 1]?.senderId !== message.senderId
          );
          
          acc.push(
            <div
              key={message.id}
              id={`message-${message.id}`}
              className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              {!isFromCurrentUser && (
                <div className="mr-2 flex-shrink-0">
                  {showAvatar ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {getInitials(message.senderName)}
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8"></div>
                  )}
                </div>
              )}
              
              <div className="relative max-w-xs md:max-w-md">
                <div 
                  className={`p-3 rounded-2xl ${
                    isFromCurrentUser
                      ? 'bg-orange-500 text-white ml-auto rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleMessageLongPress(message.id, e);
                  }}
                  onDoubleClick={(e) => handleMessageLongPress(message.id, e)}
                >
                  {/* Message de réponse */}
                  {message.id === '4' && (
                    <div className="mb-2 p-2 bg-black bg-opacity-10 rounded border-l-4 border-white border-opacity-50">
                      <p className="text-xs opacity-75">Réponse à Marie Dupont</p>
                      <p className="text-sm">Parfait ! Je voulais te parler du prochain événement...</p>
                    </div>
                  )}
                  
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Fichiers attachés */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((file, index) => (
                        <AttachedFileDisplay
                          key={index}
                          file={file}
                          onPreview={() => setPreviewFile(file)}
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className={`flex items-center justify-end mt-2 space-x-1 ${
                    isFromCurrentUser ? 'text-white text-opacity-70' : 'text-gray-500'
                  }`}>
                    <span className="text-xs">{formatTime(message.timestamp)}</span>
                    {isFromCurrentUser && (
                      <div className="ml-1">
                        {message.isRead ? (
                          <CheckCheck size={16} className="text-blue-200" />
                        ) : (
                          <Check size={16} />
                        )}
                      </div>
                    )}
                    
                    {/* Menu contextuel du message */}
                    <button
                      onClick={() => setShowMessageMenu(showMessageMenu === message.id ? null : message.id)}
                      className={`ml-2 p-1 rounded hover:bg-black hover:bg-opacity-10 ${
                        showMessageMenu === message.id ? 'bg-black bg-opacity-10' : ''
                      }`}
                    >
                      <MoreVertical size={12} />
                    </button>
                  </div>
                </div>
                
                {/* Réactions sur le message */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                  <MessageReactions
                    reactions={message.reactions}
                    currentUserId={currentUserId}
                    onReactionToggle={(emoji) => handleMessageReaction(message.id, emoji)}
                  />
                )}
                
                {/* Menu contextuel du message */}
                {showMessageMenu === message.id && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {messageMenuItems(message).map((item, index) => (
                      <button
                        key={index}
                        onClick={item.action}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg text-sm"
                      >
                        <item.icon size={14} className="text-gray-500" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
          
          return acc;
        }, [])}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reactions */}
      {showQuickReactions && (
        <QuickReactions
          onReaction={(emoji) => {
            handleMessageReaction(showQuickReactions.messageId, emoji);
            setShowQuickReactions(null);
          }}
          isVisible={true}
          position={showQuickReactions.position}
        />
      )}

      {/* Zone de réponse */}
      {replyToMessage && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between bg-white rounded-lg p-3 border-l-4 border-orange-500">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Réponse à {replyToMessage.senderName}</p>
              <p className="text-sm text-gray-800 truncate">{replyToMessage.content}</p>
            </div>
            <button
              onClick={() => setReplyToMessage(null)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Fichiers attachés */}
      {attachedFiles.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="space-y-2">
            {attachedFiles.map((file, index) => (
              <AttachedFileDisplay
                key={index}
                file={file}
                onRemove={() => handleRemoveFile(index)}
                onPreview={() => setPreviewFile(file)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <FileAttachment
              onFileSelect={handleFileSelect}
              maxFiles={5}
              maxSizeMB={10}
            />
          </div>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
            />
            
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 text-gray-500 hover:text-orange-600 transition-colors"
              >
                <Smile size={20} />
              </button>
            </div>
            
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              isVisible={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
          
          {newMessage.trim() || attachedFiles.length > 0 ? (
            <button
              onClick={handleSendMessage}
              className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              <Send size={20} />
            </button>
          ) : (
            <button
              onClick={handleVoiceRecord}
              className={`p-3 rounded-full transition-colors ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Modal de prévisualisation des fichiers */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          isOpen={true}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {/* Overlay pour fermer les menus */}
      {(showMoreMenu || showMessageMenu || showEmojiPicker) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowMoreMenu(false);
            setShowMessageMenu(null);
            setShowEmojiPicker(false);
          }}
        />
      )}
    </div>
  );
};
