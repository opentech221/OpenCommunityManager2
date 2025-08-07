import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Search, Settings, Plus } from 'lucide-react';
import { ChatList, ChatConversation } from '../components';

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

const MessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  
  // Simuler un utilisateur actuel
  const currentUserId = 'current-user';

  // Données de test plus riches
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Marie Dupont',
      lastMessage: 'Parfait ! Je voulais te parler du prochain événement...',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
      unreadCount: 2,
      isOnline: true,
      participants: ['marie.dupont', currentUserId],
      isPinned: true,
      type: 'private'
    },
    {
      id: '2', 
      name: 'Équipe Organisation',
      lastMessage: 'N\'oubliez pas la réunion de demain à 14h',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
      unreadCount: 5,
      isOnline: false,
      participants: ['marie.dupont', 'jean.martin', 'sophie.bernard', currentUserId],
      type: 'group',
      isStarred: true
    },
    {
      id: '3',
      name: 'Jean Martin',
      lastMessage: 'Merci pour les documents !',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 0,
      isOnline: true,
      participants: ['jean.martin', currentUserId],
      type: 'private'
    },
    {
      id: '4',
      name: 'Sophie Bernard',
      lastMessage: 'À bientôt pour la présentation',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 4),
      unreadCount: 1,
      isOnline: false,
      participants: ['sophie.bernard', currentUserId],
      type: 'private',
      isMuted: true
    },
    {
      id: '5',
      name: 'Groupe Finances',
      lastMessage: 'Budget approuvé ✅',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      unreadCount: 0,
      isOnline: false,
      participants: ['marie.dupont', 'pierre.durand', 'anne.petit', currentUserId],
      type: 'group',
      isArchived: true
    },
    {
      id: '6',
      name: 'Pierre Durand',
      lastMessage: 'Photo de l\'événement en pièce jointe 📸',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
      unreadCount: 0,
      isOnline: false,
      participants: ['pierre.durand', currentUserId],
      type: 'private'
    }
  ]);

  // Détecter la taille d'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowConversationList(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Sur mobile, masquer la liste des conversations
    if (isMobile) {
      setShowConversationList(false);
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      setShowConversationList(true);
      setSelectedConversation(null);
    }
  };

  const handleSendMessage = (content: string, attachments?: File[]) => {
    if (selectedConversation) {
      // Mettre à jour la conversation avec le nouveau message
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            lastMessage: content || `${attachments?.length || 0} fichier(s) envoyé(s)`,
            lastMessageTime: new Date(),
            unreadCount: 0 // Réinitialiser car c'est nous qui envoyons
          };
        }
        return conv;
      }));
      
      console.log('Message envoyé:', { content, attachments });
    }
  };

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const totalConversations = conversations.filter(c => !c.isArchived).length;
  const activeMembers = conversations.filter(c => c.isOnline && c.type === 'private').length;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header principal (mobile uniquement) */}
      {isMobile && showConversationList && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Search size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Plus size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex">
        {/* Liste des conversations */}
        {(showConversationList || !isMobile) && (
          <div className={`bg-white border-r border-gray-200 ${
            isMobile ? 'w-full' : 'w-1/3 min-w-[300px] max-w-[400px]'
          }`}>
            <ChatList
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?.id}
            />
          </div>
        )}

        {/* Zone de conversation */}
        {selectedConversation ? (
          <div className={`flex-1 ${isMobile && !showConversationList ? 'w-full' : ''}`}>
            <ChatConversation
              conversation={selectedConversation}
              currentUserId={currentUserId}
              onBack={handleBackToList}
              onSendMessage={handleSendMessage}
            />
          </div>
        ) : !isMobile && (
          // Écran de bienvenue (desktop uniquement)
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-violet-50 p-8">
            <div className="text-center max-w-md">
              {/* Icône principale */}
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-orange-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle size={48} className="text-white" />
              </div>

              {/* Titre et description */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Messagerie OpenTech221
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Restez connecté avec votre équipe et gérez vos conversations en temps réel.
              </p>

              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex flex-col items-center">
                    <MessageCircle size={24} className="text-orange-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-900">{totalConversations}</span>
                    <span className="text-sm text-gray-600">Conversations</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-xs">{totalUnreadCount}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{totalUnreadCount}</span>
                    <span className="text-sm text-gray-600">Non lus</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex flex-col items-center">
                    <Users size={24} className="text-green-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-900">{activeMembers}</span>
                    <span className="text-sm text-gray-600">En ligne</span>
                  </div>
                </div>
              </div>

              {/* Guide d'utilisation */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">✨ Fonctionnalités disponibles</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Messages en temps réel avec accusés de lecture</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                    <span>Partage de fichiers et médias</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Réactions avec emojis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Recherche dans les conversations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Épinglage et archivage des conversations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barre de statut (mobile uniquement) */}
      {isMobile && !selectedConversation && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
            <span>{totalConversations} conversations</span>
            <span>•</span>
            <span>{totalUnreadCount} non lus</span>
            <span>•</span>
            <span>{activeMembers} en ligne</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
