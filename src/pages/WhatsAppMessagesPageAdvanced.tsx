import React, { useState } from 'react';
import { 
  MessageSquare,
  Search,
  MoreVertical,
  Settings,
  Archive,
  Star,
  UserPlus,
  Pin,
  BellOff,
  Users
} from 'lucide-react';
import { ChatConversation } from '../components/ChatConversation';
import { NewConversationModal } from '../components/NewConversationModal';
import { StatusList, StatusViewer, StatusCreator } from '../components/StatusStories';
import { MediaPreviewModal } from '../components/ChatMediaAdvanced';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount: number;
  isOnline?: boolean;
  isTyping?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  type: 'individual' | 'group';
  participants?: string[];
  lastSeen?: string;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'other';
  senderName?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: {
    id: string;
    text: string;
    sender: string;
  };
  reactions?: Array<{
    emoji: string;
    users: string[];
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }>;
}

interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: number;
  content: {
    type: 'image' | 'video' | 'text';
    url?: string;
    text?: string;
    backgroundColor?: string;
    textColor?: string;
    font?: string;
  };
  views: Array<{
    userId: string;
    userName: string;
    timestamp: number;
  }>;
  reactions: Array<{
    userId: string;
    userName: string;
    emoji: string;
    timestamp: number;
  }>;
  isViewed?: boolean;
  duration?: number;
}

export const WhatsAppMessagesPageAdvanced: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusViewer, setShowStatusViewer] = useState(false);
  const [selectedStatusIndex, setSelectedStatusIndex] = useState(0);
  const [selectedStatusStories, setSelectedStatusStories] = useState<StatusStory[]>([]);
  const [showStatusCreator, setShowStatusCreator] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<{
    id: string;
    name: string;
    type: string;
    url?: string;
    file?: File;
    preview?: string;
  } | null>(null);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [currentView, setCurrentView] = useState<'chats' | 'status' | 'calls' | 'settings'>('chats');
  
  // Données de test pour les conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Association des Parents',
      lastMessage: '👋 Réunion demain à 19h',
      timestamp: '14:23',
      avatar: '/avatars/parents.jpg',
      unreadCount: 3,
      isOnline: true,
      isPinned: true,
      type: 'group',
      participants: ['Jean', 'Marie', 'Pierre', 'Sophie']
    },
    {
      id: '2', 
      name: 'Club de Sport',
      lastMessage: 'Photos de la sortie vélo 📸',
      timestamp: '12:15',
      avatar: '/avatars/sport.jpg',
      unreadCount: 0,
      isOnline: false,
      type: 'group',
      lastSeen: 'hier'
    },
    {
      id: '3',
      name: 'Marie Dubois',
      lastMessage: 'Merci pour les documents !',
      timestamp: '10:30',
      avatar: '/avatars/marie.jpg',
      unreadCount: 0,
      isOnline: true,
      isTyping: true,
      type: 'individual'
    },
    {
      id: '4',
      name: 'Comité de Quartier',
      lastMessage: '📋 Ordre du jour envoyé',
      timestamp: 'Hier',
      avatar: '/avatars/quartier.jpg',
      unreadCount: 1,
      isOnline: false,
      isMuted: true,
      type: 'group',
      participants: ['Admin', 'Secrétaire', 'Trésorier']
    }
  ]);

  // Données de test pour les statuts/stories
  const [statusStories, setStatusStories] = useState<StatusStory[]>([
    {
      id: '1',
      userId: 'current',
      userName: 'Vous',
      userAvatar: '/avatars/user.jpg',
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // Il y a 2h
      content: {
        type: 'text',
        text: 'Belle journée pour l\'association ! 🌟',
        backgroundColor: 'from-blue-400 to-purple-500',
        textColor: 'text-white',
        font: 'font-bold'
      },
      views: [
        { userId: '2', userName: 'Marie', timestamp: Date.now() - 1 * 60 * 60 * 1000 },
        { userId: '3', userName: 'Pierre', timestamp: Date.now() - 30 * 60 * 1000 }
      ],
      reactions: [
        { userId: '2', userName: 'Marie', emoji: '❤️', timestamp: Date.now() - 1 * 60 * 60 * 1000 }
      ],
      isViewed: true
    },
    {
      id: '2',
      userId: '2',
      userName: 'Marie Dubois',
      userAvatar: '/avatars/marie.jpg',
      timestamp: Date.now() - 4 * 60 * 60 * 1000, // Il y a 4h
      content: {
        type: 'image',
        url: '/images/event-photo.jpg'
      },
      views: [],
      reactions: [],
      isViewed: false
    },
    {
      id: '3',
      userId: '3',
      userName: 'Club de Sport',
      userAvatar: '/avatars/sport.jpg',
      timestamp: Date.now() - 6 * 60 * 60 * 1000, // Il y a 6h
      content: {
        type: 'video',
        url: '/videos/training.mp4'
      },
      views: [],
      reactions: [],
      isViewed: false,
      duration: 15
    }
  ]);

  // Messages par conversation
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1-1',
        text: 'Bonjour ! Comment allez-vous ?',
        timestamp: '14:20',
        sender: 'other',
        senderName: 'Association des Parents',
        status: 'read'
      },
      {
        id: '1-2',
        text: 'Très bien merci ! Et vous ?',
        timestamp: '14:21',
        sender: 'user',
        status: 'read'
      },
      {
        id: '1-3',
        text: 'La réunion de demain est maintenue à 19h 👋',
        timestamp: '14:23',
        sender: 'other',
        senderName: 'Association des Parents',
        status: 'delivered',
        reactions: [
          { emoji: '👍', users: ['Vous', 'Marie'] },
          { emoji: '❤️', users: ['Pierre'] }
        ]
      }
    ],
    '2': [
      {
        id: '2-1',
        text: 'Salut ! On se retrouve pour la sortie vélo demain ?',
        timestamp: '12:10',
        sender: 'other',
        senderName: 'Club de Sport',
        status: 'read'
      },
      {
        id: '2-2',
        text: 'Oui bien sûr ! À quelle heure ?',
        timestamp: '12:12',
        sender: 'user',
        status: 'read'
      },
      {
        id: '2-3',
        text: 'Photos de la sortie vélo 📸',
        timestamp: '12:15',
        sender: 'other',
        senderName: 'Club de Sport',
        status: 'delivered',
        attachments: [
          {
            id: 'att-1',
            name: 'sortie-velo.jpg',
            type: 'image/jpeg',
            url: '/images/sortie-velo.jpg',
            size: 2048000
          }
        ]
      }
    ],
    '3': [
      {
        id: '3-1',
        text: 'Bonjour Marie ! J\'espère que vous allez bien.',
        timestamp: '10:25',
        sender: 'user',
        status: 'read'
      },
      {
        id: '3-2',
        text: 'Bonjour ! Oui très bien merci 😊',
        timestamp: '10:28',
        sender: 'other',
        senderName: 'Marie Dubois',
        status: 'read'
      },
      {
        id: '3-3',
        text: 'Merci pour les documents !',
        timestamp: '10:30',
        sender: 'other',
        senderName: 'Marie Dubois',
        status: 'delivered',
        reactions: [
          { emoji: '👍', users: ['Vous'] }
        ]
      }
    ],
    '4': [
      {
        id: '4-1',
        text: '📋 Ordre du jour de la prochaine réunion',
        timestamp: 'Hier',
        sender: 'other',
        senderName: 'Comité de Quartier',
        status: 'read',
        attachments: [
          {
            id: 'att-2',
            name: 'ordre-du-jour.pdf',
            type: 'application/pdf',
            url: '/documents/ordre-du-jour.pdf',
            size: 1024000
          }
        ]
      },
      {
        id: '4-2',
        text: 'Merci pour le partage !',
        timestamp: 'Hier',
        sender: 'user',
        status: 'read'
      }
    ]
  });

  // Messages de la conversation courante
  const messages = selectedConversation ? (messagesByConversation[selectedConversation] || []) : [];

  const currentUserId = 'current';
  const currentUserName = 'Vous';
  const currentUserAvatar = '/avatars/user.jpg';

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleSendMessage = (text: string, replyTo?: { id: string; text: string; sender: string }) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: `${selectedConversation}-${Date.now()}`,
      text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
      status: 'sending',
      replyTo
    };

    setMessagesByConversation(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage]
    }));

    // Simuler l'envoi
    setTimeout(() => {
      setMessagesByConversation(prev => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation]?.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        ) || []
      }));
    }, 1000);

    setTimeout(() => {
      setMessagesByConversation(prev => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation]?.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        ) || []
      }));
    }, 2000);
  };

  const handleMessageReaction = (messageId: string, emoji: string) => {
    if (!selectedConversation) return;

    setMessagesByConversation(prev => ({
      ...prev,
      [selectedConversation]: prev[selectedConversation]?.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            if (existingReaction.users.includes('Vous')) {
              // Retirer la réaction
              existingReaction.users = existingReaction.users.filter(u => u !== 'Vous');
              if (existingReaction.users.length === 0) {
                return { ...msg, reactions: reactions.filter(r => r.emoji !== emoji) };
              }
            } else {
              // Ajouter la réaction
              existingReaction.users.push('Vous');
            }
          } else {
            // Nouvelle réaction
            reactions.push({ emoji, users: ['Vous'] });
          }
          
          return { ...msg, reactions };
        }
        return msg;
      }) || []
    }));
  };

  const handleStatusClick = (status: StatusStory, index: number) => {
    // Grouper les statuts par utilisateur
    const userStories = statusStories.filter(s => s.userId === status.userId);
    setSelectedStatusStories(userStories);
    setSelectedStatusIndex(userStories.findIndex(s => s.id === status.id));
    setShowStatusViewer(true);
  };

  const handleStatusReaction = (storyId: string, emoji: string) => {
    setStatusStories(prev => prev.map(story => {
      if (story.id === storyId) {
        const reactions = story.reactions || [];
        const existingReaction = reactions.find(r => r.userId === currentUserId);
        
        if (existingReaction) {
          existingReaction.emoji = emoji;
          existingReaction.timestamp = Date.now();
        } else {
          reactions.push({
            userId: currentUserId,
            userName: currentUserName,
            emoji,
            timestamp: Date.now()
          });
        }
        
        return { ...story, reactions };
      }
      return story;
    }));
  };

  const handleStatusReply = (storyId: string, message: string) => {
    // Créer une nouvelle conversation ou utiliser existante
    alert(`Réponse à la story : "${message}"`);
  };

  const handleCreateStatus = (status: Omit<StatusStory, 'id' | 'timestamp' | 'views' | 'reactions'>) => {
    const newStatus: StatusStory = {
      ...status,
      id: Date.now().toString(),
      timestamp: Date.now(),
      views: [],
      reactions: []
    };
    
    setStatusStories(prev => [newStatus, ...prev]);
  };

  const mainMenuOptions = [
    { icon: Settings, label: 'Paramètres', action: () => setCurrentView('settings') },
    { icon: Archive, label: 'Conversations archivées', action: () => {} },
    { icon: Star, label: 'Messages favoris', action: () => {} },
    { icon: UserPlus, label: 'Inviter des amis', action: () => {} }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Liste des conversations */}
      <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header avec navigation */}
        <div className="bg-green-600 text-white">
          {/* Navigation tabs */}
          <div className="flex border-b border-green-500">
            <button
              onClick={() => setCurrentView('chats')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                currentView === 'chats' ? 'bg-white text-green-600' : 'hover:bg-green-500'
              }`}
            >
              <MessageSquare className="inline mr-2" size={16} />
              Chats
            </button>
            <button
              onClick={() => setCurrentView('status')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                currentView === 'status' ? 'bg-white text-green-600' : 'hover:bg-green-500'
              }`}
            >
              📱 Statuts
            </button>
            <button
              onClick={() => setCurrentView('calls')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                currentView === 'calls' ? 'bg-white text-green-600' : 'hover:bg-green-500'
              }`}
            >
              📞 Appels
            </button>
          </div>

          {/* Header avec titre et actions */}
          <div className="p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">
              {currentView === 'chats' && 'WhatsApp Business'}
              {currentView === 'status' && 'Statuts'}
              {currentView === 'calls' && 'Appels'}
            </h1>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-green-500 rounded-full transition-colors">
                <Search size={20} />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowMainMenu(!showMainMenu)}
                  className="p-2 hover:bg-green-500 rounded-full transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
                
                {showMainMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-200 z-50">
                    {mainMenuOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          option.action();
                          setShowMainMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        <option.icon size={18} className="mr-3 text-gray-600" />
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Barre de recherche */}
          {currentView === 'chats' && (
            <div className="p-4 pt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher ou commencer une nouvelle conversation"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Contenu selon la vue sélectionnée */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'chats' && (
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation.id)}
                  className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                    selectedConversation === conversation.id ? 'bg-green-50 border-l-4 border-l-green-600' : ''
                  }`}
                >
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full ${
                      conversation.isPinned ? 'ring-2 ring-orange-400' : ''
                    } ${conversation.unreadCount > 0 && !conversation.isMuted ? 'ring-2 ring-green-500' : ''}`}>
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.name)}&background=6600cc&color=ffffff`;
                        }}
                      />
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 ml-3 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate flex items-center">
                        {conversation.name}
                        {conversation.isPinned && <Pin size={14} className="ml-1 text-orange-500" />}
                        {conversation.isMuted && <BellOff size={14} className="ml-1 text-gray-400" />}
                        {conversation.type === 'group' && <Users size={14} className="ml-1 text-blue-500" />}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {conversation.timestamp}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {conversation.isTyping ? (
                          <span className="text-green-600 italic">En train d'écrire...</span>
                        ) : (
                          conversation.lastMessage
                        )}
                      </p>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        {conversation.unreadCount > 0 && !conversation.isMuted && (
                          <div className="bg-green-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </div>
                        )}
                        {conversation.unreadCount > 0 && conversation.isMuted && (
                          <div className="bg-gray-400 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentView === 'status' && (
            <div className="h-full overflow-y-auto">
              <StatusList
                statuses={statusStories}
                currentUserId={currentUserId}
                onStatusClick={handleStatusClick}
                onCreateStatus={() => setShowStatusCreator(true)}
              />
              
              {/* Liste des statuts récents */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Mises à jour récentes</h3>
                {statusStories.filter(s => s.userId !== currentUserId).map(status => (
                  <div key={status.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                       onClick={() => handleStatusClick(status, 0)}>
                    <div className={`w-12 h-12 rounded-full p-0.5 ${
                      !status.isViewed ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gray-300'
                    }`}>
                      <img
                        src={status.userAvatar}
                        alt={status.userName}
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{status.userName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(status.timestamp).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'calls' && (
            <div className="p-4 text-center text-gray-500">
              <p>Aucun appel récent</p>
            </div>
          )}
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="hidden md:flex flex-1">
        {selectedConversation && selectedConv ? (
          <ChatConversation
            conversation={selectedConv as any}
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedConversation(null)}
            onMessageReaction={handleMessageReaction}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">WhatsApp Business</h2>
              <p>Sélectionnez une conversation pour commencer à chatter</p>
            </div>
          </div>
        )}
      </div>

      {/* Vue mobile - Conversation sélectionnée */}
      {selectedConversation && selectedConv && (
        <div className="md:hidden fixed inset-0 z-40 bg-white">
          <ChatConversation
            conversation={selectedConv as any}
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedConversation(null)}
            onMessageReaction={handleMessageReaction}
          />
        </div>
      )}

      {/* Modals */}
      <NewConversationModal
        isOpen={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onCreateConversation={(name, participants) => {
          const newConv: Conversation = {
            id: Date.now().toString(),
            name,
            lastMessage: '',
            timestamp: 'Maintenant',
            avatar: '/avatars/default.jpg',
            unreadCount: 0,
            type: participants.length > 1 ? 'group' : 'individual',
            participants
          };
          setConversations(prev => [newConv, ...prev]);
          setSelectedConversation(newConv.id);
          setShowNewConversation(false);
        }}
      />

      <StatusViewer
        stories={selectedStatusStories}
        initialIndex={selectedStatusIndex}
        isOpen={showStatusViewer}
        onClose={() => setShowStatusViewer(false)}
        currentUserId={currentUserId}
        onReaction={handleStatusReaction}
        onReply={handleStatusReply}
      />

      <StatusCreator
        isOpen={showStatusCreator}
        onClose={() => setShowStatusCreator(false)}
        onCreateStatus={handleCreateStatus}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        currentUserAvatar={currentUserAvatar}
      />

      <MediaPreviewModal
        attachment={mediaPreview}
        isOpen={!!mediaPreview}
        onClose={() => setMediaPreview(null)}
        onDownload={(attachment) => console.log('Télécharger:', attachment)}
        onShare={(attachment) => console.log('Partager:', attachment)}
        onDelete={(attachment) => setMediaPreview(null)}
      />

      {/* Overlay pour fermer les menus */}
      {showMainMenu && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowMainMenu(false)}
        />
      )}
    </div>
  );
};
