import React, { useState, useEffect } from 'react';
import { 
  MessageSquare,
  Users
} from 'lucide-react';
import { ChatList } from '../components/ChatList';
import { ChatConversation } from '../components/ChatConversation';
import { NewConversationModal } from '../components/NewConversationModal';

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

const WhatsAppMessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const currentUserId = 'utilisateur.actuel';

  // Données de démonstration
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Marie Dupont',
      lastMessage: 'Ils sont d\'accord pour nous allouer le budget ! 🎉',
      lastMessageTime: new Date('2024-08-07T10:36:00'),
      unreadCount: 2,
      isOnline: true,
      participants: [currentUserId, 'marie.dupont'],
      isGroup: false
    },
    {
      id: '2',
      name: 'Bureau Exécutif',
      lastMessage: 'Jean: Parfait, on se retrouve demain à 14h',
      lastMessageTime: new Date('2024-08-07T09:15:00'),
      unreadCount: 0,
      isOnline: false,
      participants: [currentUserId, 'marie.dupont', 'jean.martin', 'pierre.dubois'],
      isGroup: true
    },
    {
      id: '3',
      name: 'Jean Martin',
      lastMessage: 'Les comptes sont à jour, tout est OK',
      lastMessageTime: new Date('2024-08-06T16:30:00'),
      unreadCount: 0,
      isOnline: false,
      participants: [currentUserId, 'jean.martin'],
      isGroup: false
    },
    {
      id: '4',
      name: 'Équipe Événements',
      lastMessage: 'Sophie: Les décorations sont prêtes !',
      lastMessageTime: new Date('2024-08-06T14:20:00'),
      unreadCount: 5,
      isOnline: true,
      participants: [currentUserId, 'sophie.bernard', 'claire.moreau', 'pierre.dubois'],
      isGroup: true
    },
    {
      id: '5',
      name: 'Pierre Dubois',
      lastMessage: 'Merci pour ton aide avec les réservations',
      lastMessageTime: new Date('2024-08-05T18:45:00'),
      unreadCount: 0,
      isOnline: true,
      participants: [currentUserId, 'pierre.dubois'],
      isGroup: false
    }
  ]);

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Marquer comme lu
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    // Mettre à jour la liste des conversations avec le nouveau message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: content,
              lastMessageTime: new Date()
            }
          : conv
      )
    );
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const handleCreateConversation = (data: { participantIds: string[]; name: string; firstMessage: string }) => {
    const newConversation: Conversation = {
      id: (Date.now() + Math.random()).toString(),
      name: data.name,
      lastMessage: data.firstMessage,
      lastMessageTime: new Date(),
      unreadCount: 0,
      isOnline: Math.random() > 0.5,
      participants: [currentUserId, ...data.participantIds],
      isGroup: data.participantIds.length > 1
    };

    setConversations(prev => [newConversation, ...prev]);
    setShowNewConversationModal(false);
    setSelectedConversation(newConversation);
  };

  // Calcul des statistiques
  const totalConversations = conversations.length;
  const unreadConversations = conversations.filter(c => c.unreadCount > 0).length;
  const totalUnreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="min-h-screen bg-purple-900 p-0">
      {/* Header décoré seulement visible sur desktop ou quand aucune conversation n'est sélectionnée */}
      {(!isMobile || !selectedConversation) && (
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-500 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-orange-500">
                  Messagerie
                </h1>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span>{totalConversations} conversation{totalConversations > 1 ? 's' : ''}</span>
                  {unreadConversations > 0 && (
                    <span className="text-orange-600 font-medium">
                      {unreadConversations} non lu{unreadConversations > 1 ? 'es' : 'e'} • {totalUnreadMessages} message{totalUnreadMessages > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowNewConversationModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span className="hidden sm:inline">Nouvelle conversation</span>
            </button>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 font-medium">
              Interface de messagerie moderne pour une communication fluide
            </p>
            <div className="text-sm text-gray-600 space-y-1 mt-2">
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <strong>Temps réel :</strong> Messages instantanés et notifications
              </p>
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <strong>Conversations de groupe :</strong> Organisez vos équipes efficacement
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interface de messagerie principale */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex h-[600px]">
          {/* Liste des conversations - Masquée sur mobile quand une conversation est sélectionnée */}
          <div className={`${
            isMobile && selectedConversation 
              ? 'hidden' 
              : 'w-full md:w-1/3 lg:w-80'
          } border-r border-gray-200`}>
            <ChatList
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              onNewConversation={() => setShowNewConversationModal(true)}
              selectedConversationId={selectedConversation?.id}
            />
          </div>

          {/* Zone de conversation */}
          <div className={`${
            isMobile && !selectedConversation 
              ? 'hidden' 
              : 'flex-1'
          }`}>
            {selectedConversation ? (
              <ChatConversation
                conversation={selectedConversation}
                currentUserId={currentUserId}
                onBack={handleBackToList}
                onSendMessage={handleSendMessage}
              />
            ) : (
              /* Écran de bienvenue sur desktop */
              <div className="hidden md:flex flex-col items-center justify-center h-full bg-gray-50 p-8 text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-12 h-12 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bienvenue dans la messagerie
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Sélectionnez une conversation dans la liste de gauche ou créez une nouvelle conversation pour commencer à échanger.
                </p>
                <button
                  onClick={() => setShowNewConversationModal(true)}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Nouvelle conversation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de nouvelle conversation */}
      <NewConversationModal
        isOpen={showNewConversationModal}
        onClose={() => setShowNewConversationModal(false)}
        onCreateConversation={handleCreateConversation}
        isLoading={false}
      />
    </div>
  );
};

export default WhatsAppMessagesPage;
