import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Users,
  Eye,
  Trash2,
  Reply,
  Forward,
  User,
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';
import { type MessageType } from '../types';
import { formatDate } from '../utils';
import {
  MessageDetailModal,
  ComposeMessageModal,
  NewConversationModal
} from '../components';

const MessagesPage: React.FC = () => {
  // États locaux
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'unread'>('all');
  const [feedback, setFeedback] = useState('');
  
  // États pour les modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  const [composeMode, setComposeMode] = useState<'new' | 'reply' | 'forward'>('new');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  // Données de démonstration (à remplacer par un hook useMessages)
  const [localMessages, setLocalMessages] = useState<MessageType[]>([
    {
      id: '1',
      senderId: 'marie.dupont',
      recipientId: 'bureau',
      subject: 'Préparation Assemblée Générale 2024',
      content: 'Bonjour à tous,\n\nJe vous écris pour commencer l\'organisation de notre prochaine assemblée générale prévue pour le mois prochain.\n\nPouvez-vous me faire savoir vos disponibilités pour les dates suivantes :\n- Samedi 15 juin à 14h\n- Dimanche 16 juin à 10h\n- Samedi 22 juin à 14h\n\nMerci de votre retour.\n\nCordialement,\nMarie',
      sentAt: new Date('2024-05-20T10:30:00'),
      isRead: false,
      associationId: 'assoc1'
    },
    {
      id: '2',
      senderId: 'jean.martin',
      recipientId: 'tous',
      subject: 'Rapport financier - Mai 2024',
      content: 'Chers membres,\n\nVeuillez trouver ci-joint le rapport financier pour le mois de mai 2024.\n\nPoints importants :\n- Recettes : 2,450€\n- Dépenses : 1,890€\n- Solde positif : 560€\n\nN\'hésitez pas si vous avez des questions.\n\nBien cordialement,\nJean Martin, Trésorier',
      sentAt: new Date('2024-05-18T15:45:00'),
      isRead: true,
      associationId: 'assoc1'
    },
    {
      id: '3',
      senderId: 'sophie.bernard',
      recipientId: 'marie.dupont',
      subject: 'Demande de congé bénévolat',
      content: 'Bonjour Marie,\n\nJe vous contacte pour vous informer que je serai absente les weekends du 1er et 8 juin pour des raisons personnelles.\n\nJe ne pourrai donc pas participer aux activités prévues ces jours-là.\n\nMerci de votre compréhension.\n\nSophie',
      sentAt: new Date('2024-05-17T09:15:00'),
      isRead: false,
      associationId: 'assoc1'
    },
    {
      id: '4',
      senderId: 'pierre.dubois',
      recipientId: 'bureau',
      subject: 'Proposition nouvel événement',
      content: 'Salut l\'équipe,\n\nJ\'ai une idée pour un nouvel événement : un tournoi de pétanque inter-associations pour cet été.\n\nJe pense qu\'on pourrait :\n- Organiser ça début juillet\n- Inviter 3-4 associations partenaires\n- Prévoir un barbecue après\n\nQu\'est-ce que vous en pensez ?\n\nPierre',
      sentAt: new Date('2024-05-15T18:20:00'),
      isRead: true,
      associationId: 'assoc1'
    }
  ]);

  // Gestion du clic extérieur pour fermer le menu flottant
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.floating-menu-container')) {
        setShowFloatingMenu(false);
      }
    };

    if (showFloatingMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFloatingMenu]);

  // Statistiques
  const totalMessages = localMessages.length;
  const unreadCount = localMessages.filter(m => !m.isRead).length;
  const readCount = localMessages.filter(m => m.isRead).length;

  // Messages filtrés
  const filteredMessages = localMessages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(search.toLowerCase()) || 
                         message.content.toLowerCase().includes(search.toLowerCase()) ||
                         message.senderId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'read' && message.isRead) ||
                         (filterStatus === 'unread' && !message.isRead);
    return matchesSearch && matchesFilter;
  });

  // Utilitaires
  const getSenderName = (senderId: string) => {
    // Mapping des IDs vers les noms (à remplacer par une vraie fonction)
    const senderNames: Record<string, string> = {
      'marie.dupont': 'Marie Dupont',
      'jean.martin': 'Jean Martin',
      'sophie.bernard': 'Sophie Bernard',
      'pierre.dubois': 'Pierre Dubois'
    };
    return senderNames[senderId] || senderId;
  };

  const getRecipientName = (recipientId: string | undefined) => {
    if (!recipientId) return 'Non spécifié';
    const recipientNames: Record<string, string> = {
      'bureau': 'Bureau',
      'tous': 'Tous les membres',
      'marie.dupont': 'Marie Dupont',
      'jean.martin': 'Jean Martin',
      'sophie.bernard': 'Sophie Bernard',
      'pierre.dubois': 'Pierre Dubois'
    };
    return recipientNames[recipientId] || recipientId;
  };

  // Handlers
  const handleSendMessage = (data: { recipientId: string; subject: string; content: string }) => {
    try {
      const newMessage: MessageType = {
        id: (Date.now() + Math.random()).toString(),
        senderId: 'utilisateur.actuel', // ID de l'utilisateur actuel
        recipientId: data.recipientId,
        subject: data.subject,
        content: data.content,
        sentAt: new Date(),
        isRead: false,
        associationId: "assoc1",
      };

      setLocalMessages(prev => [newMessage, ...prev]);
      setShowComposeModal(false);
      setSelectedMessage(null);
      setComposeMode('new');
      setFeedback('Message envoyé avec succès');
      setTimeout(() => setFeedback(''), 3000);
    } catch {
      setFeedback('Erreur lors de l\'envoi du message');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        setLocalMessages(prev => prev.filter(message => message.id !== id));
        setFeedback('Message supprimé avec succès');
        setTimeout(() => setFeedback(''), 3000);
      } catch {
        setFeedback('Erreur lors de la suppression du message');
        setTimeout(() => setFeedback(''), 3000);
      }
    }
  };

  const handleMarkAsRead = (id: string) => {
    try {
      setLocalMessages(prev =>
        prev.map(message =>
          message.id === id ? { ...message, isRead: true } : message
        )
      );
    } catch {
      setFeedback('Erreur lors de la mise à jour du statut');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleCreateConversation = (data: { participantIds: string[]; name: string; firstMessage: string }) => {
    try {
      // Créer le premier message de la conversation
      const newMessage: MessageType = {
        id: (Date.now() + Math.random()).toString(),
        senderId: 'utilisateur.actuel',
        recipientId: data.participantIds.join(','), // Simulation d'un groupe
        subject: `${data.name} - Nouveau sujet`,
        content: data.firstMessage,
        sentAt: new Date(),
        isRead: false,
        associationId: "assoc1",
      };

      setLocalMessages(prev => [newMessage, ...prev]);
      setShowNewConversationModal(false);
      setFeedback('Conversation créée avec succès');
      setTimeout(() => setFeedback(''), 3000);
    } catch {
      setFeedback('Erreur lors de la création de la conversation');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  // Modal handlers
  const openComposeModal = (mode: 'new' | 'reply' | 'forward' = 'new', message?: MessageType) => {
    setComposeMode(mode);
    setSelectedMessage(message || null);
    setShowComposeModal(true);
    setShowFloatingMenu(false);
  };

  const openDetailModal = (message: MessageType) => {
    setSelectedMessage(message);
    setShowDetailModal(true);
    // Marquer comme lu si pas encore lu
    if (!message.isRead) {
      handleMarkAsRead(message.id);
    }
  };

  const openNewConversationModal = () => {
    setShowNewConversationModal(true);
    setShowFloatingMenu(false);
  };

  const closeModals = () => {
    setShowDetailModal(false);
    setShowComposeModal(false);
    setShowNewConversationModal(false);
    setSelectedMessage(null);
    setComposeMode('new');
  };

  return (
    <div className="min-h-screen bg-purple-900 p-0">
      {/* Header décoré avec couleur orange */}
      <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-500 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-orange-500">
              Messagerie
            </h1>
          </div>
          <button 
            onClick={() => openComposeModal('new')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Nouveau message</span>
          </button>
        </div>
        <div className="mt-4">
          <p className="text-gray-700 font-medium">
            Communiquez efficacement avec tous les membres de votre association
          </p>
          <div className="text-sm text-gray-600 space-y-1 mt-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Communication centralisée :</strong> Tous vos messages en un seul endroit
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              <strong>Discussions de groupe :</strong> Organisez vos échanges par thème
            </p>
          </div>
        </div>
      </div>

      {/* Message de feedback */}
      {feedback && (
        <div className={`mb-4 p-3 rounded-lg ${
          feedback.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback}
        </div>
      )}

      {/* Tableau de bord des statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <button 
          className={`bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow border ${
            filterStatus === 'all' ? 'ring-2 ring-purple-500 ring-offset-2' : ''
          }`} 
          onClick={() => setFilterStatus('all')} 
          aria-label="Afficher tous les messages"
        >
          <div className="text-2xl font-bold text-purple-600">{totalMessages}</div>
          <div className="text-sm text-purple-600">Total</div>
        </button>
        
        <button 
          className={`bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow border ${
            filterStatus === 'unread' ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }`} 
          onClick={() => setFilterStatus(filterStatus === 'unread' ? 'all' : 'unread')}
        >
          <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          <div className="text-sm text-blue-600">Non lus</div>
        </button>
        
        <button 
          className={`bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow border ${
            filterStatus === 'read' ? 'ring-2 ring-green-500 ring-offset-2' : ''
          }`} 
          onClick={() => setFilterStatus(filterStatus === 'read' ? 'all' : 'read')}
        >
          <div className="text-2xl font-bold text-green-600">{readCount}</div>
          <div className="text-sm text-green-600">Lus</div>
        </button>
      </div>

      {/* Liste des messages */}
      <div className="bg-white rounded-lg shadow p-4">
        {/* Barre de recherche */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher dans les messages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="block flex-1 w-full pl-10 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {localMessages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <MessageSquare className="w-16 h-16 mx-auto mb-4" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Aucun message</p>
            <p className="text-gray-500 mb-4">Commencez par envoyer votre premier message</p>
            <button 
              onClick={() => openComposeModal('new')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Nouveau message
            </button>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun message trouvé pour votre recherche</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-700">Statut</th>
                  <th className="text-left p-3 font-medium text-gray-700">Sujet</th>
                  <th className="text-left p-3 font-medium text-gray-700">Expéditeur</th>
                  <th className="text-left p-3 font-medium text-gray-700">Destinataire</th>
                  <th className="text-left p-3 font-medium text-gray-700">Date</th>
                  <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message, index) => (
                  <tr key={message.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="p-3">
                      <div className="flex items-center">
                        {message.isRead ? (
                          <CheckCircle className="w-5 h-5 text-green-500" aria-label="Message lu" />
                        ) : (
                          <Circle className="w-5 h-5 text-blue-500" aria-label="Message non lu" />
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`font-medium ${!message.isRead ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                        {message.subject}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {message.content.substring(0, 100)}...
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm text-gray-900">{getSenderName(message.senderId)}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-900">{getRecipientName(message.recipientId)}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(message.sentAt)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-1">
                        <button 
                          className="inline-flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors" 
                          onClick={() => openDetailModal(message)} 
                          aria-label="Voir détails"
                          title="Voir les détails"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="inline-flex items-center justify-center w-8 h-8 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors" 
                          onClick={() => openComposeModal('reply', message)} 
                          aria-label="Répondre"
                          title="Répondre à ce message"
                        >
                          <Reply size={14} />
                        </button>
                        <button 
                          className="inline-flex items-center justify-center w-8 h-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-full transition-colors" 
                          onClick={() => openComposeModal('forward', message)} 
                          aria-label="Transférer"
                          title="Transférer ce message"
                        >
                          <Forward size={14} />
                        </button>
                        <button 
                          className="inline-flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors" 
                          onClick={() => handleDeleteMessage(message.id)} 
                          aria-label="Supprimer"
                          title="Supprimer ce message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Résumé en bas de page */}
      {localMessages.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <div className="text-sm text-gray-600">
            Affichage de {filteredMessages.length} message{filteredMessages.length > 1 ? 's' : ''} sur {totalMessages} au total
            {filteredMessages.length !== totalMessages && (
              <span className="ml-2 text-blue-600">
                • Filtres actifs
              </span>
            )}
            {unreadCount > 0 && (
              <span className="ml-2 text-red-600">
                • {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <MessageDetailModal
        isOpen={showDetailModal}
        onClose={closeModals}
        message={selectedMessage}
        onReply={(message: MessageType) => openComposeModal('reply', message)}
        onForward={(message: MessageType) => openComposeModal('forward', message)}
        onDelete={handleDeleteMessage}
      />

      <ComposeMessageModal
        isOpen={showComposeModal}
        onClose={closeModals}
        onSend={handleSendMessage}
        isLoading={false}
        replyTo={composeMode === 'reply' ? selectedMessage! : undefined}
        forwardMessage={composeMode === 'forward' ? selectedMessage! : undefined}
      />

      <NewConversationModal
        isOpen={showNewConversationModal}
        onClose={closeModals}
        onCreateConversation={handleCreateConversation}
        isLoading={false}
      />

      {/* Bouton flottant avec menu d'actions */}
      <div className="fixed bottom-6 right-6 z-50 floating-menu-container">
        {/* Menu d'actions (visible quand showFloatingMenu est true) */}
        {showFloatingMenu && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[220px] animate-fadeIn">
            <button
              onClick={() => openComposeModal('new')}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Send className="h-4 w-4 text-orange-600" />
              <span>Nouveau message</span>
            </button>
            
            <button
              onClick={openNewConversationModal}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Users className="h-4 w-4 text-purple-600" />
              <span>Nouvelle conversation</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => {
                setFilterStatus('unread');
                setShowFloatingMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm"
            >
              <Circle className="h-4 w-4 text-blue-600" />
              <span>Messages non lus ({unreadCount})</span>
            </button>
          </div>
        )}

        {/* Bouton principal flottant */}
        <button
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            showFloatingMenu 
              ? 'bg-gray-600 hover:bg-gray-700 transform rotate-45' 
              : 'bg-orange-500 hover:bg-orange-600 hover:scale-110'
          }`}
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;
