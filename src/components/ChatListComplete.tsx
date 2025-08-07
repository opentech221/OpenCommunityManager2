import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  Archive, 
  Star, 
  Users, 
  MessageSquare,
  Settings,
  Bell,
  BellOff,
  Pin,
  PinOff,
  Trash2,
  UserPlus,
  Filter,
  SortAsc,
  SortDesc
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
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  isStarred?: boolean;
  type: 'private' | 'group';
}

interface ChatListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
  currentUserId: string;
}

type SortOption = 'time' | 'name' | 'unread';
type FilterOption = 'all' | 'unread' | 'pinned' | 'groups' | 'archived';

export const ChatList: React.FC<ChatListProps> = ({
  conversations: initialConversations,
  onSelectConversation,
  selectedConversationId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState(initialConversations);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showConversationMenu, setShowConversationMenu] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showNewConversation, setShowNewConversation] = useState(false);

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (messageDate.getTime() === yesterday.getTime()) {
      return 'Hier';
    }
    
    const daysDiff = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 7) {
      return new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date);
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-red-400 to-red-600',
      'from-blue-400 to-blue-600', 
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-orange-400 to-orange-600'
    ];
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const handlePinConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isPinned: !conv.isPinned }
        : conv
    ));
    setShowConversationMenu(null);
  };

  const handleMuteConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isMuted: !conv.isMuted }
        : conv
    ));
    setShowConversationMenu(null);
  };

  const handleArchiveConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isArchived: !conv.isArchived }
        : conv
    ));
    setShowConversationMenu(null);
  };

  const handleStarConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isStarred: !conv.isStarred }
        : conv
    ));
    setShowConversationMenu(null);
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      setShowConversationMenu(null);
    }
  };

  const sortConversations = (conversations: Conversation[]) => {
    return [...conversations].sort((a, b) => {
      // Les épinglées en premier
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'unread':
          return b.unreadCount - a.unreadCount;
        case 'time':
        default:
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
      }
    });
  };

  const filterConversations = (conversations: Conversation[]) => {
    return conversations.filter(conv => {
      switch (filterBy) {
        case 'unread':
          return conv.unreadCount > 0;
        case 'pinned':
          return conv.isPinned;
        case 'groups':
          return conv.type === 'group';
        case 'archived':
          return conv.isArchived;
        case 'all':
        default:
          return !conv.isArchived; // Par défaut, ne pas montrer les archivées
      }
    });
  };

  const filteredConversations = sortConversations(
    filterConversations(
      conversations.filter(conversation =>
        conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const mainMenuItems = [
    { icon: Users, label: 'Nouvelle conversation de groupe', action: () => setShowNewConversation(true) },
    { icon: UserPlus, label: 'Inviter des contacts', action: () => alert('Inviter des contacts') },
    { icon: Archive, label: `Conversations archivées (${conversations.filter(c => c.isArchived).length})`, action: () => setFilterBy('archived') },
    { icon: Star, label: 'Messages favoris', action: () => alert('Messages favoris') },
    { icon: Settings, label: 'Paramètres', action: () => alert('Paramètres') }
  ];

  const conversationMenuItems = (conversation: Conversation) => [
    { 
      icon: conversation.isPinned ? PinOff : Pin, 
      label: conversation.isPinned ? 'Désépingler' : 'Épingler', 
      action: () => handlePinConversation(conversation.id) 
    },
    { 
      icon: conversation.isMuted ? Bell : BellOff, 
      label: conversation.isMuted ? 'Réactiver les notifications' : 'Couper les notifications', 
      action: () => handleMuteConversation(conversation.id) 
    },
    { 
      icon: Star, 
      label: conversation.isStarred ? 'Retirer des favoris' : 'Ajouter aux favoris', 
      action: () => handleStarConversation(conversation.id) 
    },
    { 
      icon: Archive, 
      label: conversation.isArchived ? 'Désarchiver' : 'Archiver', 
      action: () => handleArchiveConversation(conversation.id) 
    },
    { 
      icon: Trash2, 
      label: 'Supprimer conversation', 
      action: () => handleDeleteConversation(conversation.id),
      danger: true
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'Toutes', count: conversations.filter(c => !c.isArchived).length },
    { key: 'unread', label: 'Non lues', count: conversations.filter(c => c.unreadCount > 0).length },
    { key: 'pinned', label: 'Épinglées', count: conversations.filter(c => c.isPinned).length },
    { key: 'groups', label: 'Groupes', count: conversations.filter(c => c.type === 'group').length },
    { key: 'archived', label: 'Archivées', count: conversations.filter(c => c.isArchived).length }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <div className="flex items-center space-x-2">
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {totalUnreadCount > 0 ? totalUnreadCount : '0'}
            </span>
            
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>
              
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {mainMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.action();
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg text-sm"
                    >
                      <item.icon size={16} className="text-gray-500" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filtres */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex space-x-1 overflow-x-auto">
            {filterOptions.map(option => (
              <button
                key={option.key}
                onClick={() => setFilterBy(option.key as FilterOption)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filterBy === option.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSortBy(sortBy === 'time' ? 'name' : sortBy === 'name' ? 'unread' : 'time')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Changer le tri"
            >
              {sortBy === 'time' && <SortDesc size={16} className="text-gray-500" />}
              {sortBy === 'name' && <SortAsc size={16} className="text-gray-500" />}
              {sortBy === 'unread' && <Filter size={16} className="text-orange-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageSquare size={48} className="mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? 'Aucune conversation trouvée' : 'Aucune conversation'}
            </h3>
            <p className="text-sm text-center max-w-xs">
              {searchTerm 
                ? `Aucune conversation ne correspond à "${searchTerm}"`
                : 'Commencez une nouvelle conversation pour voir vos messages ici'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowNewConversation(true)}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
              >
                Nouvelle conversation
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative ${
                  selectedConversationId === conversation.id ? 'bg-orange-50 border-r-4 border-orange-500' : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    {conversation.avatar ? (
                      <img 
                        src={conversation.avatar} 
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(conversation.name)} flex items-center justify-center`}>
                        <span className="text-white font-medium text-sm">
                          {getInitials(conversation.name)}
                        </span>
                        {conversation.type === 'group' && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                            <Users size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {conversation.isOnline && conversation.type === 'private' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    
                    {conversation.isPinned && (
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Pin size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium truncate flex items-center space-x-2 ${
                        conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-800'
                      }`}>
                        <span>{conversation.name}</span>
                        {conversation.isMuted && (
                          <BellOff size={14} className="text-gray-400 flex-shrink-0" />
                        )}
                        {conversation.isStarred && (
                          <Star size={14} className="text-yellow-500 flex-shrink-0" />
                        )}
                      </h3>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatLastMessageTime(conversation.lastMessageTime)}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowConversationMenu(
                              showConversationMenu === conversation.id ? null : conversation.id
                            );
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-all"
                        >
                          <MoreVertical size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${
                        conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage}
                      </p>
                      
                      {conversation.unreadCount > 0 && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    {/* Informations supplémentaires */}
                    {conversation.type === 'group' && (
                      <p className="text-xs text-gray-500 mt-1">
                        {conversation.participants.length} participants
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Menu contextuel */}
                {showConversationMenu === conversation.id && (
                  <div className="absolute right-4 top-16 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {conversationMenuItems(conversation).map((item, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          item.action();
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg text-sm ${
                          item.danger ? 'text-red-600 hover:bg-red-50' : ''
                        }`}
                      >
                        <item.icon size={14} className={item.danger ? 'text-red-500' : 'text-gray-500'} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Nouvelle Conversation */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Nouvelle conversation</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de conversation
                </label>
                <div className="space-y-2">
                  <button className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                    <MessageSquare size={20} className="text-gray-500" />
                    <span>Conversation privée</span>
                  </button>
                  <button className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                    <Users size={20} className="text-gray-500" />
                    <span>Groupe</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex space-x-2 justify-end">
              <button
                onClick={() => setShowNewConversation(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowNewConversation(false);
                  alert('Fonctionnalité à implémenter');
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour fermer les menus */}
      {(showMoreMenu || showConversationMenu) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowMoreMenu(false);
            setShowConversationMenu(null);
          }}
        />
      )}
    </div>
  );
};
