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
  SortDesc,
  X
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
  onConversationAction?: (conversationId: string, action: string) => void;
  isMobile?: boolean;
}

type SortOption = 'time' | 'name' | 'unread';
type FilterOption = 'all' | 'unread' | 'pinned' | 'groups' | 'archived';

export const ChatList: React.FC<ChatListProps> = ({
  conversations: initialConversations,
  onSelectConversation,
  selectedConversationId,
  onConversationAction,
  isMobile = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState(initialConversations);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showConversationMenu, setShowConversationMenu] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [conversationType, setConversationType] = useState<'private' | 'group' | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [conversationName, setConversationName] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  // Liste des membres disponibles pour créer une conversation
  const availableMembers = [
    { id: 'marie.dupont', name: 'Marie Dupont', avatar: null, isOnline: true },
    { id: 'jean.martin', name: 'Jean Martin', avatar: null, isOnline: true },
    { id: 'sophie.bernard', name: 'Sophie Bernard', avatar: null, isOnline: false },
    { id: 'pierre.durand', name: 'Pierre Durand', avatar: null, isOnline: false },
    { id: 'anne.petit', name: 'Anne Petit', avatar: null, isOnline: true },
    { id: 'lucas.moreau', name: 'Lucas Moreau', avatar: null, isOnline: false },
    { id: 'emma.roux', name: 'Emma Roux', avatar: null, isOnline: true },
    { id: 'theo.blanc', name: 'Théo Blanc', avatar: null, isOnline: false }
  ];

  // Filtrer les membres selon la recherche
  const filteredMembers = availableMembers.filter(member =>
    member.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Reset modal state
  const resetModalState = () => {
    setConversationType(null);
    setSelectedMembers([]);
    setConversationName('');
    setMemberSearch('');
  };

  // Gérer la sélection/désélection de membres
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Créer une nouvelle conversation
  const createNewConversation = () => {
    if (conversationType === 'private' && selectedMembers.length !== 1) {
      alert('Veuillez sélectionner exactement un membre pour une conversation privée');
      return;
    }
    if (conversationType === 'group' && selectedMembers.length < 2) {
      alert('Veuillez sélectionner au moins 2 membres pour un groupe');
      return;
    }
    if (conversationType === 'group' && !conversationName.trim()) {
      alert('Veuillez entrer un nom pour le groupe');
      return;
    }

    // Créer la nouvelle conversation
    const newConversation: Conversation = {
      id: Date.now().toString(),
      name: conversationType === 'private' 
        ? availableMembers.find(m => m.id === selectedMembers[0])?.name || 'Inconnu'
        : conversationName,
      lastMessage: 'Nouvelle conversation',
      lastMessageTime: new Date(),
      unreadCount: 0,
      isOnline: conversationType === 'private' 
        ? availableMembers.find(m => m.id === selectedMembers[0])?.isOnline || false
        : false,
      participants: [...selectedMembers, 'current-user'],
      type: conversationType as 'private' | 'group',
      isPinned: false,
      isMuted: false,
      isArchived: false,
      isStarred: false
    };

    // Ajouter à la liste des conversations
    setConversations(prev => [newConversation, ...prev]);
    
    // Fermer le modal et réinitialiser
    setShowNewConversation(false);
    resetModalState();

    console.log('Nouvelle conversation créée:', newConversation);
  };

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
    if (onConversationAction) {
      onConversationAction(conversationId, 'pin');
    } else {
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, isPinned: !conv.isPinned }
          : conv
      ));
    }
    setShowConversationMenu(null);
  };

  const handleMuteConversation = (conversationId: string) => {
    if (onConversationAction) {
      onConversationAction(conversationId, 'mute');
    } else {
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, isMuted: !conv.isMuted }
          : conv
      ));
    }
    setShowConversationMenu(null);
  };

  const handleArchiveConversation = (conversationId: string) => {
    if (onConversationAction) {
      onConversationAction(conversationId, 'archive');
    } else {
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, isArchived: !conv.isArchived }
          : conv
      ));
    }
    setShowConversationMenu(null);
  };

  const handleStarConversation = (conversationId: string) => {
    if (onConversationAction) {
      onConversationAction(conversationId, 'star');
    } else {
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, isStarred: !conv.isStarred }
          : conv
      ));
    }
    setShowConversationMenu(null);
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      if (onConversationAction) {
        onConversationAction(conversationId, 'delete');
      } else {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      }
    }
    setShowConversationMenu(null);
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
      <div className={`${
        isMobile ? 'p-2 pb-1' : 'p-4'
      } border-b border-gray-200 bg-white shadow-sm`}>
        <div className={`flex items-center justify-between ${
          isMobile ? 'mb-2' : 'mb-4'
        }`}>
          <h2 className={`${
            isMobile ? 'text-base' : 'text-xl'
          } font-bold text-gray-900`}>Messages</h2>
          <div className="flex items-center space-x-3">
            {totalUnreadCount > 0 && (
              <span className={`bg-green-500 text-white ${
                isMobile ? 'text-xs px-2.5 py-1.5' : 'text-xs px-2 py-1'
              } rounded-full font-medium shadow-sm`}>
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
            
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`${
                  isMobile ? 'p-2.5 bg-gray-50 hover:bg-gray-100' : 'p-2 hover:bg-gray-100'
                } active:bg-gray-200 rounded-full transition-colors shadow-sm`}
              >
                <MoreVertical size={isMobile ? 18 : 20} className="text-gray-600" />
              </button>
              
              {showMoreMenu && (
                <div className={`absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${
                  isMobile ? 'w-72' : 'w-64'
                }`}>
                  {mainMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.action();
                        setShowMoreMenu(false);
                      }}
                      className={`w-full ${
                        isMobile ? 'px-4 py-4' : 'px-4 py-3'
                      } text-left hover:bg-gray-50 active:bg-gray-100 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg ${
                        isMobile ? 'text-base' : 'text-sm'
                      } transition-colors`}
                    >
                      <item.icon size={isMobile ? 18 : 16} className="text-gray-500" />
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
          <Search size={isMobile ? 16 : 16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${
              isMobile ? 'pl-9 pr-4 py-2 text-sm' : 'pl-10 pr-4 py-2 text-sm'
            } border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
              isMobile ? 'shadow-sm' : ''
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={isMobile ? 18 : 16} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className={`flex items-center justify-between ${
          isMobile ? 'mt-2' : 'mt-3'
        }`}>
          <div className={`flex overflow-x-auto ${
            isMobile ? 'space-x-1' : 'space-x-2'
          } scrollbar-hide`}>
            {filterOptions.map(option => (
              <button
                key={option.key}
                onClick={() => setFilterBy(option.key as FilterOption)}
                className={`${
                  isMobile ? 'px-2 py-1 text-xs min-w-max' : 'px-4 py-2 text-sm'
                } rounded-full font-medium whitespace-nowrap transition-colors shadow-sm flex-shrink-0 ${
                  filterBy === option.key
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                {isMobile ? option.label.charAt(0) : option.label} ({option.count})
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 ml-2">
            <button
              onClick={() => setSortBy(sortBy === 'time' ? 'name' : sortBy === 'name' ? 'unread' : 'time')}
              className={`${
                isMobile ? 'p-2 bg-gray-100 hover:bg-gray-200' : 'p-1 hover:bg-gray-100'
              } rounded-full transition-colors shadow-sm flex-shrink-0`}
              title="Changer le tri"
            >
              {sortBy === 'time' && <SortDesc size={isMobile ? 18 : 16} className="text-gray-500" />}
              {sortBy === 'name' && <SortAsc size={isMobile ? 18 : 16} className="text-gray-500" />}
              {sortBy === 'unread' && <Filter size={isMobile ? 18 : 16} className="text-green-500" />}
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
          <div className={`${isMobile ? '' : 'divide-y divide-gray-100'}`}>
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`${
                  isMobile ? 'p-2 border-b border-gray-100 active:bg-gray-50' : 'p-4 hover:bg-gray-50 active:bg-gray-100'
                } cursor-pointer transition-colors relative group ${
                  selectedConversationId === conversation.id 
                    ? `${isMobile ? 'bg-green-50 border-r-4 border-green-500' : 'bg-orange-50 border-r-4 border-orange-500'}` 
                    : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className={`flex items-start ${
                  isMobile ? 'space-x-2' : 'space-x-4'
                }`}>
                  <div className="relative flex-shrink-0">
                    {conversation.avatar ? (
                      <img 
                        src={conversation.avatar} 
                        alt={conversation.name}
                        className={`${
                          isMobile ? 'w-10 h-10' : 'w-12 h-12'
                        } rounded-full object-cover`}
                      />
                    ) : (
                      <div className={`${
                        isMobile ? 'w-10 h-10' : 'w-12 h-12'
                      } rounded-full bg-gradient-to-br ${getAvatarColor(conversation.name)} flex items-center justify-center shadow-sm`}>
                        <span className={`text-white font-medium ${
                          isMobile ? 'text-sm' : 'text-sm'
                        }`}>
                          {getInitials(conversation.name)}
                        </span>
                        {conversation.type === 'group' && (
                          <div className={`absolute -bottom-1 -right-1 ${
                            isMobile ? 'w-6 h-6' : 'w-6 h-6'
                          } bg-gray-600 rounded-full flex items-center justify-center border-2 border-white`}>
                            <Users size={isMobile ? 12 : 12} className="text-white" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {conversation.isOnline && conversation.type === 'private' && (
                      <div className={`absolute -bottom-1 -right-1 ${
                        isMobile ? 'w-4 h-4' : 'w-4 h-4'
                      } bg-green-500 border-2 border-white rounded-full shadow-sm`}></div>
                    )}
                    
                    {conversation.isPinned && (
                      <div className={`absolute -top-1 -left-1 ${
                        isMobile ? 'w-6 h-6' : 'w-5 h-5'
                      } bg-yellow-500 rounded-full flex items-center justify-center shadow-sm`}>
                        <Pin size={isMobile ? 12 : 10} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex-1 min-w-0 ${isMobile ? 'max-w-[240px]' : ''}`}>
                    <div className={`flex items-center justify-between ${
                      isMobile ? 'mb-1' : 'mb-1'
                    }`}>
                      <h3 className={`font-medium truncate flex items-center ${
                        conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-800'
                      } ${
                        isMobile ? 'text-xs max-w-[150px]' : 'text-sm'
                      }`}>
                        <span className="truncate mr-1">{conversation.name}</span>
                        {!isMobile && (
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            {conversation.isMuted && (
                              <BellOff size={14} className="text-gray-400" />
                            )}
                            {conversation.isStarred && (
                              <Star size={14} className="text-yellow-500" />
                            )}
                          </div>
                        )}
                      </h3>
                      
                      <div className={`flex items-center ${
                        isMobile ? 'space-x-1.5' : 'space-x-3'
                      } flex-shrink-0`}>
                        <span className={`${
                          isMobile ? 'text-xs' : 'text-xs'
                        } text-gray-500 font-medium`}>
                          {formatLastMessageTime(conversation.lastMessageTime)}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowConversationMenu(
                              showConversationMenu === conversation.id ? null : conversation.id
                            );
                          }}
                          className={`${
                            isMobile ? 'p-1.5 opacity-100 bg-gray-50 hover:bg-gray-100' : 'p-1 opacity-0 group-hover:opacity-100 bg-orange-500 hover:bg-orange-600'
                          } rounded-full transition-all active:scale-95`}
                        >
                          <MoreVertical size={isMobile ? 12 : 14} className={`${
                            isMobile ? 'text-gray-600' : 'text-white'
                          }`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`truncate ${
                        conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                      } ${
                        isMobile ? 'text-xs max-w-[160px]' : 'text-sm flex-1 mr-2'
                      }`}>
                        {isMobile && conversation.lastMessage.length > 35 
                          ? conversation.lastMessage.substring(0, 35) + '...'
                          : conversation.lastMessage
                        }
                      </p>
                      
                      {conversation.unreadCount > 0 && (
                        <span className={`bg-green-500 text-white font-bold flex-shrink-0 rounded-full shadow-sm ml-2 ${
                          isMobile ? 'text-xs px-1.5 py-0.5 min-w-[16px] text-center' : 'text-xs px-2 py-1'
                        }`}>
                          {isMobile && conversation.unreadCount > 9 ? '9+' : conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    {/* Icônes mobile en bas */}
                    {isMobile && (conversation.isMuted || conversation.isStarred || conversation.type === 'group') && (
                      <div className="flex items-center space-x-2 mt-1">
                        {conversation.isMuted && <BellOff size={10} className="text-gray-400" />}
                        {conversation.isStarred && <Star size={10} className="text-yellow-500" />}
                        {conversation.type === 'group' && (
                          <span className="text-gray-500 text-xs flex items-center">
                            <Users size={10} className="mr-0.5" />
                            {conversation.participants.length}
                          </span>
                        )}
                      </div>
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
                        className={`w-full px-4 py-2 text-left flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg text-sm transition-colors ${
                          item.danger 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-gray-700 hover:bg-orange-50'
                        }`}
                      >
                        <item.icon size={14} className={
                          item.danger 
                            ? 'text-red-500' 
                            : item.label.includes('Épingler') || item.label.includes('Désépingler') 
                              ? 'text-yellow-500'
                              : item.label.includes('notification') || item.label.includes('Couper') || item.label.includes('Réactiver')
                              ? 'text-orange-500'
                              : item.label.includes('favoris')
                              ? 'text-purple-500'
                              : item.label.includes('Archiver') || item.label.includes('Désarchiver')
                              ? 'text-blue-500'
                              : 'text-gray-500'
                        } />
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
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Nouvelle conversation</h3>
              <button
                onClick={() => {
                  setShowNewConversation(false);
                  resetModalState();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Étape 1: Sélection du type */}
              {!conversationType && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type de conversation
                    </label>
                    <div className="space-y-3">
                      <button
                        onClick={() => setConversationType('private')}
                        className="w-full p-4 border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 flex items-center space-x-3 transition-colors"
                      >
                        <MessageSquare size={20} className="text-orange-500" />
                        <div className="text-left">
                          <div className="font-medium">Conversation privée</div>
                          <div className="text-sm text-gray-500">Discussion avec une seule personne</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setConversationType('group')}
                        className="w-full p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 flex items-center space-x-3 transition-colors"
                      >
                        <Users size={20} className="text-blue-500" />
                        <div className="text-left">
                          <div className="font-medium">Groupe</div>
                          <div className="text-sm text-gray-500">Discussion avec plusieurs personnes</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2: Configuration et sélection des membres */}
              {conversationType && (
                <div className="p-4 space-y-4">
                  {/* Nom du groupe (si applicable) */}
                  {conversationType === 'group' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du groupe
                      </label>
                      <input
                        type="text"
                        value={conversationName}
                        onChange={(e) => setConversationName(e.target.value)}
                        placeholder="Entrez le nom du groupe..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  )}

                  {/* Recherche de membres */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {conversationType === 'private' ? 'Sélectionner un membre' : 'Sélectionner les membres'}
                    </label>
                    <div className="relative mb-3">
                      <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        placeholder="Rechercher des membres..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    {/* Membres sélectionnés */}
                    {selectedMembers.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm text-gray-600 mb-2">Membres sélectionnés:</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedMembers.map(memberId => {
                            const member = availableMembers.find(m => m.id === memberId);
                            return member ? (
                              <span
                                key={memberId}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                              >
                                {member.name}
                                <button
                                  onClick={() => toggleMemberSelection(memberId)}
                                  className="ml-2 hover:text-orange-600"
                                >
                                  <X size={14} />
                                </button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Liste des membres */}
                    <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                      {filteredMembers.map(member => (
                        <div
                          key={member.id}
                          className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            selectedMembers.includes(member.id) ? 'bg-orange-50' : ''
                          }`}
                          onClick={() => {
                            if (conversationType === 'private') {
                              setSelectedMembers([member.id]);
                            } else {
                              toggleMemberSelection(member.id);
                            }
                          }}
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-violet-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className={`text-xs ${member.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                              {member.isOnline ? '● En ligne' : '○ Hors ligne'}
                            </div>
                          </div>
                          {selectedMembers.includes(member.id) && (
                            <div className="text-orange-500">
                              ✓
                            </div>
                          )}
                        </div>
                      ))}
                      {filteredMembers.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          Aucun membre trouvé
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200 flex space-x-3">
              {conversationType && (
                <button
                  onClick={() => setConversationType(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ← Retour
                </button>
              )}
              <button
                onClick={() => {
                  setShowNewConversation(false);
                  resetModalState();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              {conversationType && (
                <button
                  onClick={createNewConversation}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedMembers.length === 0}
                >
                  Créer la conversation
                </button>
              )}
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
