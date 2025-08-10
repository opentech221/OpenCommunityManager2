import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MessageCircle, 
  Search, 
  Plus, 
  MoreVertical, 
  Phone, 
  Video,
  VolumeX,
  Pin,
  Archive,
  Trash2,
  X,
  Reply,
  Share,
  Copy,
  Edit
} from 'lucide-react';
import { ChatList } from '../components';

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

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'other';
  senderName?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  type?: 'text' | 'sticker' | 'file';
  sticker?: {
    emoji: string;
    name: string;
    category: string;
  };
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

// Composant MessageInput séparé pour éviter les conflits DOM
interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  onSendSticker?: (sticker: { emoji: string; name: string; category: string; }) => void;
  isMobile?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onSendSticker, isMobile = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showStickers, setShowStickers] = useState(false);

  // Stickers disponibles
  const stickers = [
    { emoji: '😊', name: 'Smiley', category: 'emotions' },
    { emoji: '😂', name: 'Rire', category: 'emotions' },
    { emoji: '❤️', name: 'Cœur', category: 'emotions' },
    { emoji: '👍', name: 'Pouce levé', category: 'gestures' },
    { emoji: '👌', name: 'Parfait', category: 'gestures' },
    { emoji: '🙏', name: 'Merci', category: 'gestures' },
    { emoji: '🎉', name: 'Fête', category: 'events' },
    { emoji: '🔥', name: 'Feu', category: 'objects' },
    { emoji: '💪', name: 'Force', category: 'gestures' },
    { emoji: '✨', name: 'Étoiles', category: 'objects' },
    { emoji: '🚀', name: 'Fusée', category: 'objects' },
    { emoji: '💡', name: 'Idée', category: 'objects' }
  ];

  const handleSend = () => {
    if (inputRef.current && inputRef.current.value.trim()) {
      onSendMessage(inputRef.current.value.trim());
      inputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputRef.current && inputRef.current.value.trim()) {
      onSendMessage(inputRef.current.value.trim());
      inputRef.current.value = '';
    }
  };

  const handleStickerClick = (sticker: { emoji: string; name: string; category: string; }) => {
    if (onSendSticker) {
      onSendSticker(sticker);
    }
    setShowStickers(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      // Pour l'instant, on envoie juste le nom des fichiers comme message
      const fileNames = filesArray.map(f => f.name).join(', ');
      onSendMessage(`📎 Fichier(s): ${fileNames}`, filesArray);
      
      // Réinitialiser l'input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      {/* Input fichier masqué */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Panneau de stickers */}
      {showStickers && (
        <div className={`absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mb-1 max-h-24 overflow-y-auto z-10 ${
          isMobile ? 'p-1' : 'p-4'
        }`}>
          <div className={`grid ${
            isMobile ? 'grid-cols-10 gap-0.5' : 'grid-cols-6 gap-2'
          }`}>
            {stickers.map((sticker, idx) => (
              <button
                key={idx}
                onClick={() => handleStickerClick(sticker)}
                className={`${
                  isMobile ? 'p-1 text-sm' : 'p-3 text-2xl'
                } rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors active:scale-95`}
                title={sticker.name}
              >
                {sticker.emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Zone de saisie style WhatsApp */}
      <div className={`flex items-end ${
        isMobile ? 'space-x-1 p-1' : 'space-x-2 p-2'
      }`}>
        {/* Bouton fichiers */}
        <button
          onClick={openFileDialog}
          className={`flex-shrink-0 ${
            isMobile ? 'w-7 h-7 text-xs' : 'w-10 h-10 text-lg'
          } bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-full flex items-center justify-center transition-colors shadow-sm active:scale-95`}
          title="Joindre un fichier"
        >
          📎
        </button>

        {/* Container de l'input avec sticker */}
        <div className={`flex-1 bg-white rounded-full border border-gray-300 shadow-sm flex items-center ${
          isMobile ? 'min-h-[32px] px-2 py-1' : 'min-h-[40px] px-3 py-2'
        }`}>
          <button
            onClick={() => setShowStickers(!showStickers)}
            className={`flex-shrink-0 mr-1 hover:scale-110 transition-transform ${
              isMobile ? 'text-sm' : 'text-lg'
            } ${showStickers ? 'scale-110' : ''}`}
            title="Stickers"
          >
            😊
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder={isMobile ? "Message..." : "Tapez votre message..."}
            className={`flex-1 outline-none bg-transparent ${
              isMobile ? 'text-xs placeholder-gray-500' : 'text-sm placeholder-gray-500'
            }`}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Bouton d'envoi style WhatsApp */}
        <button 
          onClick={handleSend}
          className={`flex-shrink-0 ${
            isMobile ? 'w-7 h-7 text-xs' : 'w-10 h-10 text-lg'
          } bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-full flex items-center justify-center transition-colors text-white shadow-sm active:scale-95`}
          title="Envoyer"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

const MessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const [showConversationMenu, setShowConversationMenu] = useState(false);
  const [showMessageMenu, setShowMessageMenu] = useState<string | null>(null);
  
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

  // Messages par conversation - SOLUTION pour le changement de contenu
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1-1',
        text: 'Bonjour Marie ! J\'espère que vous allez bien.',
        timestamp: '14:20',
        sender: 'user',
        status: 'read'
      },
      {
        id: '1-2',
        text: 'Bonjour ! Oui très bien merci 😊',
        timestamp: '14:22',
        sender: 'other',
        senderName: 'Marie Dupont',
        status: 'read'
      },
      {
        id: '1-3',
        text: 'Parfait ! Je voulais te parler du prochain événement de l\'association.',
        timestamp: '15:19',
        sender: 'other',
        senderName: 'Marie Dupont',
        status: 'delivered'
      },
      {
        id: '1-4',
        text: 'Excellente idée ! Je suis tout ouïe 👂',
        timestamp: '15:24',
        sender: 'user',
        status: 'read',
        reactions: [
          { emoji: '😄', users: ['Marie Dupont'] }
        ],
        replyTo: {
          id: '1-3',
          text: 'Parfait ! Je voulais te parler du prochain événement...',
          sender: 'Marie Dupont'
        }
      },
      {
        id: '1-5',
        text: '',
        timestamp: '15:25',
        sender: 'other',
        senderName: 'Marie Dupont',
        status: 'delivered',
        type: 'sticker',
        sticker: {
          emoji: '🎉',
          name: 'Celebration',
          category: 'events'
        }
      },
      {
        id: '1-6',
        text: '📎 Document: planning-événement.pdf',
        timestamp: '15:30',
        sender: 'user',
        status: 'delivered',
        type: 'file',
        attachments: [
          {
            id: 'att-3',
            name: 'planning-événement.pdf',
            type: 'application/pdf',
            url: '/documents/planning.pdf',
            size: 1024000
          }
        ]
      }
    ],
    '2': [
      {
        id: '2-1',
        text: '👋 Salut l\'équipe ! Prêts pour la réunion de demain ?',
        timestamp: '09:30',
        sender: 'other',
        senderName: 'Jean Martin',
        status: 'read'
      },
      {
        id: '2-2',
        text: 'Oui, j\'ai préparé tous les documents !',
        timestamp: '09:35',
        sender: 'user',
        status: 'read'
      },
      {
        id: '2-3',
        text: 'Parfait ! Sophie, tu as les chiffres ?',
        timestamp: '09:40',
        sender: 'other',
        senderName: 'Jean Martin',
        status: 'read'
      },
      {
        id: '2-4',
        text: 'Oui, tout est prêt de mon côté aussi 📊',
        timestamp: '09:45',
        sender: 'other',
        senderName: 'Sophie Bernard',
        status: 'read'
      },
      {
        id: '2-5',
        text: 'N\'oubliez pas la réunion de demain à 14h',
        timestamp: '13:00',
        sender: 'other',
        senderName: 'Marie Dupont',
        status: 'delivered',
        reactions: [
          { emoji: '👍', users: ['Vous', 'Jean Martin'] },
          { emoji: '✅', users: ['Sophie Bernard'] }
        ]
      },
      {
        id: '2-6',
        text: '',
        timestamp: '13:05',
        sender: 'user',
        status: 'delivered',
        type: 'sticker',
        sticker: {
          emoji: '👌',
          name: 'Perfect',
          category: 'gestures'
        }
      },
      {
        id: '2-7',
        text: '📎 Image: photo-équipe.jpg',
        timestamp: '13:10',
        sender: 'other',
        senderName: 'Sophie Bernard',
        status: 'delivered',
        type: 'file',
        attachments: [
          {
            id: 'att-4',
            name: 'photo-équipe.jpg',
            type: 'image/jpeg',
            url: '/images/photo-equipe.jpg',
            size: 2048000
          }
        ]
      }
    ],
    '3': [
      {
        id: '3-1',
        text: 'Salut Jean ! As-tu reçu les documents que j\'ai envoyés ?',
        timestamp: '11:15',
        sender: 'user',
        status: 'read'
      },
      {
        id: '3-2',
        text: 'Oui, je les ai bien reçus ! 📄',
        timestamp: '11:20',
        sender: 'other',
        senderName: 'Jean Martin',
        status: 'read'
      },
      {
        id: '3-3',
        text: 'Merci pour les documents !',
        timestamp: '11:25',
        sender: 'other',
        senderName: 'Jean Martin',
        status: 'delivered',
        reactions: [
          { emoji: '👍', users: ['Vous'] }
        ]
      }
    ],
    '4': [
      {
        id: '4-1',
        text: 'Bonjour Sophie ! Comment se passe la préparation ?',
        timestamp: '08:30',
        sender: 'user',
        status: 'read'
      },
      {
        id: '4-2',
        text: 'Ça avance bien ! J\'ai presque terminé les slides.',
        timestamp: '08:45',
        sender: 'other',
        senderName: 'Sophie Bernard',
        status: 'read'
      },
      {
        id: '4-3',
        text: 'À bientôt pour la présentation',
        timestamp: '12:30',
        sender: 'other',
        senderName: 'Sophie Bernard',
        status: 'delivered'
      }
    ],
    '5': [
      {
        id: '5-1',
        text: '💰 Voici le rapport financier du trimestre',
        timestamp: 'Hier 14:00',
        sender: 'other',
        senderName: 'Pierre Durand',
        status: 'read',
        attachments: [
          {
            id: 'att-1',
            name: 'rapport-financier-q3.pdf',
            type: 'application/pdf',
            url: '/documents/rapport-q3.pdf',
            size: 2048000
          }
        ]
      },
      {
        id: '5-2',
        text: 'Merci Pierre ! Les chiffres sont excellents 📈',
        timestamp: 'Hier 14:30',
        sender: 'user',
        status: 'read'
      },
      {
        id: '5-3',
        text: 'Budget approuvé ✅',
        timestamp: 'Hier 15:00',
        sender: 'other',
        senderName: 'Anne Petit',
        status: 'delivered',
        reactions: [
          { emoji: '🎉', users: ['Vous', 'Pierre Durand'] },
          { emoji: '👏', users: ['Marie Dupont'] }
        ]
      },
      {
        id: '5-4',
        text: '',
        timestamp: 'Hier 15:30',
        sender: 'user',
        status: 'delivered',
        type: 'sticker',
        sticker: {
          emoji: '💪',
          name: 'Strong',
          category: 'gestures'
        }
      }
    ],
    '6': [
      {
        id: '6-1',
        text: 'Salut ! Comment s\'est passé l\'événement ?',
        timestamp: 'Avant-hier 16:00',
        sender: 'user',
        status: 'read'
      },
      {
        id: '6-2',
        text: 'C\'était fantastique ! Beaucoup de monde.',
        timestamp: 'Avant-hier 16:30',
        sender: 'other',
        senderName: 'Pierre Durand',
        status: 'read'
      },
      {
        id: '6-3',
        text: 'Photo de l\'événement en pièce jointe 📸',
        timestamp: 'Avant-hier 17:00',
        sender: 'other',
        senderName: 'Pierre Durand',
        status: 'delivered',
        attachments: [
          {
            id: 'att-2',
            name: 'evenement-photo.jpg',
            type: 'image/jpeg',
            url: '/images/evenement.jpg',
            size: 1536000
          }
        ]
      }
    ]
  });

  // Messages de la conversation courante - CETTE ligne résout le problème !
  const currentMessages = selectedConversation ? (messagesByConversation[selectedConversation.id] || []) : [];

  // Nettoyer les états lors du changement de conversation
  useEffect(() => {
    // Forcer le re-render des messages lorsque la conversation change
    if (selectedConversation) {
      const conversationContainer = document.getElementById(`messages-${selectedConversation.id}`);
      if (conversationContainer) {
        conversationContainer.scrollTop = conversationContainer.scrollHeight;
      }
    }
  }, [selectedConversation]);

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

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-menu') && !target.closest('button')) {
        setShowConversationMenu(false);
        setShowMessageMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    // Vider les états précédents pour éviter les conflits DOM
    if (selectedConversation?.id !== conversation.id) {
      // D'abord désélectionner la conversation actuelle
      setSelectedConversation(null);
      
      // Puis sélectionner la nouvelle conversation après un court délai
      requestAnimationFrame(() => {
        setSelectedConversation(conversation);
      });
    } else {
      setSelectedConversation(conversation);
    }
    
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
      // Créer le nouveau message
      const newMessage: Message = {
        id: `${selectedConversation.id}-${Date.now()}`,
        text: content,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
        status: 'sending',
        type: attachments && attachments.length > 0 ? 'file' : 'text',
        attachments: attachments ? attachments.map((file, idx) => ({
          id: `att-${Date.now()}-${idx}`,
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
          size: file.size
        })) : undefined
      };

      // Ajouter le message à la conversation appropriée
      setMessagesByConversation(prev => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
      }));

      // Mettre à jour la conversation avec le nouveau message
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            lastMessage: attachments && attachments.length > 0 
              ? `📎 ${attachments.length} fichier(s)`
              : content,
            lastMessageTime: new Date(),
            unreadCount: 0 // Réinitialiser car c'est nous qui envoyons
          };
        }
        return conv;
      }));

      // Simuler l'envoi (changer le statut après un délai)
      setTimeout(() => {
        setMessagesByConversation(prev => ({
          ...prev,
          [selectedConversation.id]: prev[selectedConversation.id]?.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          ) || []
        }));
      }, 1000);
      
      console.log('Message envoyé:', { content, attachments });
    }
  };

  const handleSendSticker = (sticker: { emoji: string; name: string; category: string; }) => {
    if (selectedConversation) {
      // Créer le nouveau message sticker
      const newMessage: Message = {
        id: `${selectedConversation.id}-${Date.now()}`,
        text: '',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
        status: 'sending',
        type: 'sticker',
        sticker: sticker
      };

      // Ajouter le message à la conversation appropriée
      setMessagesByConversation(prev => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
      }));

      // Mettre à jour la conversation avec le nouveau message
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            lastMessage: `Sticker: ${sticker.name}`,
            lastMessageTime: new Date(),
            unreadCount: 0
          };
        }
        return conv;
      }));

      // Simuler l'envoi
      setTimeout(() => {
        setMessagesByConversation(prev => ({
          ...prev,
          [selectedConversation.id]: prev[selectedConversation.id]?.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          ) || []
        }));
      }, 1000);
      
      console.log('Sticker envoyé:', sticker);
    }
  };

  const handleMessageReaction = (messageId: string, emoji: string) => {
    if (selectedConversation) {
      setMessagesByConversation(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id]?.map(msg => {
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
    }
  };

  // Fonctions pour les menus trois-points
  const handleConversationListAction = (conversationId: string, action: string) => {
    switch (action) {
      case 'mute':
        setConversations(prev => prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, isMuted: !conv.isMuted }
            : conv
        ));
        console.log(`Conversation ${conversationId} ${conversations.find(c => c.id === conversationId)?.isMuted ? 'démutée' : 'mutée'}`);
        break;
      case 'pin':
        setConversations(prev => prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, isPinned: !conv.isPinned }
            : conv
        ));
        console.log(`Conversation ${conversationId} ${conversations.find(c => c.id === conversationId)?.isPinned ? 'désépinglée' : 'épinglée'}`);
        break;
      case 'archive':
        setConversations(prev => prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, isArchived: !conv.isArchived }
            : conv
        ));
        console.log(`Conversation ${conversationId} ${conversations.find(c => c.id === conversationId)?.isArchived ? 'désarchivée' : 'archivée'}`);
        break;
      case 'star':
        setConversations(prev => prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, isStarred: !conv.isStarred }
            : conv
        ));
        console.log(`Conversation ${conversationId} ${conversations.find(c => c.id === conversationId)?.isStarred ? 'retirée des favoris' : 'ajoutée aux favoris'}`);
        break;
      case 'delete':
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(null);
        }
        console.log(`Conversation ${conversationId} supprimée`);
        break;
    }
  };

  const handleConversationAction = (action: string) => {
    if (!selectedConversation) return;
    
    switch (action) {
      case 'mute':
        setConversations(prev => prev.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, isMuted: !conv.isMuted }
            : conv
        ));
        console.log(`Conversation ${selectedConversation.isMuted ? 'démutée' : 'mutée'}`);
        break;
      case 'pin':
        setConversations(prev => prev.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, isPinned: !conv.isPinned }
            : conv
        ));
        console.log(`Conversation ${selectedConversation.isPinned ? 'désépinglée' : 'épinglée'}`);
        break;
      case 'archive':
        setConversations(prev => prev.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, isArchived: !conv.isArchived }
            : conv
        ));
        console.log(`Conversation ${selectedConversation.isArchived ? 'désarchivée' : 'archivée'}`);
        break;
      case 'delete':
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
          setConversations(prev => prev.filter(conv => conv.id !== selectedConversation.id));
          setSelectedConversation(null);
          console.log('Conversation supprimée');
        }
        break;
      case 'clear':
        if (window.confirm('Êtes-vous sûr de vouloir vider cette conversation ?')) {
          setMessagesByConversation(prev => ({
            ...prev,
            [selectedConversation.id]: []
          }));
          console.log('Conversation vidée');
        }
        break;
    }
    setShowConversationMenu(false);
  };

  const handleMessageAction = (messageId: string, action: string) => {
    if (!selectedConversation) return;
    
    switch (action) {
      case 'reply':
        console.log('Répondre au message:', messageId);
        break;
      case 'forward':
        console.log('Transférer le message:', messageId);
        break;
      case 'copy': {
        const message = currentMessages.find(m => m.id === messageId);
        if (message && message.text) {
          navigator.clipboard.writeText(message.text);
          console.log('Message copié');
        }
        break;
      }
      case 'edit':
        console.log('Modifier le message:', messageId);
        break;
      case 'delete':
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
          setMessagesByConversation(prev => ({
            ...prev,
            [selectedConversation.id]: prev[selectedConversation.id]?.filter(msg => msg.id !== messageId) || []
          }));
          console.log('Message supprimé');
        }
        break;
    }
    setShowMessageMenu(null);
  };

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const totalConversations = conversations.filter(c => !c.isArchived).length;
  const activeMembers = conversations.filter(c => c.isOnline && c.type === 'private').length;

  return (
  <div className="messages-page-container h-screen max-h-screen bg-white flex flex-col overflow-hidden" style={{ height: '100dvh', maxHeight: '100dvh' }}>
      {/* Header principal (mobile uniquement) */}
      {isMobile && showConversationList && (
        <div className="bg-green-600 p-2 flex-shrink-0 shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-white">Messages</h1>
            <div className="flex items-center space-x-0.5">
              <button className="p-1.5 hover:bg-green-700 rounded-full text-white transition-colors">
                <Search size={16} />
              </button>
              <button className="p-1.5 hover:bg-green-700 rounded-full text-white transition-colors">
                <Plus size={16} />
              </button>
              <button className="p-1.5 hover:bg-green-700 rounded-full text-white transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Liste des conversations */}
        {(showConversationList || !isMobile) && (
          <div className={`bg-white border-r border-gray-300 flex flex-col ${
            isMobile ? 'w-full' : 'w-1/3 min-w-[300px] max-w-[400px]'
          }`}>
            <ChatList
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?.id}
              onConversationAction={handleConversationListAction}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* Zone de conversation */}
        {selectedConversation ? (
          <div 
            key={`conversation-${selectedConversation.id}`}
            className={`messages-chat-area flex-1 flex flex-col min-h-0 ${isMobile && !showConversationList ? 'w-full' : ''}`}
          >
            {/* Header de conversation */}
            <div className={`bg-green-600 flex-shrink-0 shadow-sm ${
              isMobile ? 'p-1' : 'p-1 sm:p-2 lg:p-3'
            }`}>
              <div className="flex items-center">
                {isMobile && (
                  <button 
                    onClick={handleBackToList}
                    className={`${
                      isMobile ? 'mr-1 p-1' : 'mr-3 p-2'
                    } hover:bg-green-700 rounded-full text-white transition-colors active:bg-green-800`}
                    style={{ fontSize: isMobile ? '14px' : '16px' }}
                  >
                    ←
                  </button>
                )}
                <div className={`bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold overflow-hidden ${
                  isMobile ? 'w-7 h-7 mr-2' : 'w-10 h-10 mr-3'
                }`}>
                  {selectedConversation.avatar ? (
                    <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className={`${isMobile ? 'text-xs' : 'text-base'}`}>
                      {selectedConversation.name[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`font-semibold text-white truncate ${
                    isMobile ? 'text-sm' : 'text-lg'
                  }`}>{selectedConversation.name}</h2>
                  <p className={`text-green-100 truncate ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    {selectedConversation.isOnline ? 'en ligne' : 'hors ligne'}
                    {selectedConversation.type === 'group' && ` • ${selectedConversation.participants.length} participants`}
                  </p>
                </div>
                {/* Boutons d'action WhatsApp style */}
                <div className={`flex items-center ${
                  isMobile ? 'space-x-1' : 'space-x-2'
                }`}>
                  {!isMobile && (
                    <>
                      <button className="p-2 hover:bg-green-700 rounded-full text-white transition-colors">
                        <Video size={20} />
                      </button>
                      <button className="p-2 hover:bg-green-700 rounded-full text-white transition-colors">
                        <Phone size={20} />
                      </button>
                    </>
                  )}
                  <div className="relative">
                    <button 
                      onClick={() => setShowConversationMenu(!showConversationMenu)}
                      className="p-2 rounded-full text-white transition-colors bg-green-700 hover:bg-green-800 shadow-sm"
                    >
                      <MoreVertical size={20} className="text-white" />
                    </button>
                    
                    {/* Menu déroulant de conversation */}
                    {showConversationMenu && (
                      <div className={`dropdown-menu absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${
                        isMobile ? 'w-52' : 'w-48'
                      }`}>
                        <div className="py-1">
                          <button
                            onClick={() => handleConversationAction('mute')}
                            className={`flex items-center px-4 ${
                              isMobile ? 'py-3' : 'py-2'
                            } text-gray-700 hover:bg-orange-50 w-full text-left transition-colors ${
                              isMobile ? 'text-base' : 'text-sm'
                            }`}
                          >
                            <VolumeX size={isMobile ? 18 : 16} className="mr-3 text-orange-500" />
                            {selectedConversation.isMuted ? 'Réactiver' : 'Muet'}
                          </button>
                          <button
                            onClick={() => handleConversationAction('pin')}
                            className={`flex items-center px-4 ${
                              isMobile ? 'py-3' : 'py-2'
                            } text-gray-700 hover:bg-yellow-50 w-full text-left transition-colors ${
                              isMobile ? 'text-base' : 'text-sm'
                            }`}
                          >
                            <Pin size={isMobile ? 18 : 16} className="mr-3 text-yellow-500" />
                            {selectedConversation.isPinned ? 'Désépingler' : 'Épingler'}
                          </button>
                          <button
                            onClick={() => handleConversationAction('archive')}
                            className={`flex items-center px-4 ${
                              isMobile ? 'py-3' : 'py-2'
                            } text-gray-700 hover:bg-blue-50 w-full text-left transition-colors ${
                              isMobile ? 'text-base' : 'text-sm'
                            }`}
                          >
                            <Archive size={isMobile ? 18 : 16} className="mr-3 text-blue-500" />
                            {selectedConversation.isArchived ? 'Désarchiver' : 'Archiver'}
                          </button>
                          <button
                            onClick={() => handleConversationAction('clear')}
                            className={`flex items-center px-4 ${
                              isMobile ? 'py-3' : 'py-2'
                            } text-gray-700 hover:bg-purple-50 w-full text-left transition-colors ${
                              isMobile ? 'text-base' : 'text-sm'
                            }`}
                          >
                            <Trash2 size={isMobile ? 18 : 16} className="mr-3 text-purple-500" />
                            Vider la conversation
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => handleConversationAction('delete')}
                            className={`flex items-center px-4 ${
                              isMobile ? 'py-3' : 'py-2'
                            } text-red-600 hover:bg-red-50 w-full text-left transition-colors ${
                              isMobile ? 'text-base' : 'text-sm'
                            }`}
                          >
                            <X size={isMobile ? 18 : 16} className="mr-3 text-red-600" />
                            Supprimer conversation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages - AFFICHAGE DYNAMIQUE selon la conversation */}
            <div 
              id={`messages-${selectedConversation.id}`}
              key={`messages-${selectedConversation.id}`}
              className={`flex-1 overflow-y-auto scrollbar-hide ${
                isMobile ? 'p-0' : 'p-4'
              } bg-gradient-to-b from-green-50 to-green-100 min-h-0`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23d1fae5' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='2'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`
              }}
            >
              <div className={`${isMobile ? 'space-y-0.5 h-full px-1' : 'space-y-3 h-full'}`}>
                {/* Liste des messages */}
                {currentMessages.map((message) => (
                  <div
                    key={`${selectedConversation.id}-${message.id}`}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} ${
                      isMobile ? 'mb-1' : 'mb-2'
                    } group`}
                  >
                    <div className={`relative ${
                      isMobile ? 'max-w-[260px]' : 'max-w-xs lg:max-w-md'
                    } ${
                      isMobile ? 'px-2 py-1 pr-4' : 'px-3 py-2 pr-6 lg:px-4 lg:pr-8'
                    } rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? message.type === 'sticker' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-green-500 text-white'
                        : message.type === 'sticker'
                          ? 'bg-white text-gray-800'
                          : 'bg-white text-gray-800'
                    }`}
                    style={{
                      borderBottomRightRadius: message.sender === 'user' ? '6px' : '16px',
                      borderBottomLeftRadius: message.sender === 'user' ? '16px' : '6px'
                    }}
                    >
                      {/* Bouton menu trois-points dans le message */}
                      <div className={`absolute top-0.5 ${
                        isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      } transition-opacity z-10 ${
                        message.sender === 'user' ? 'right-1' : 'left-1'
                      }`}>
                        <button
                          onClick={() => setShowMessageMenu(showMessageMenu === message.id ? null : message.id)}
                          className={`${
                            isMobile ? 'p-1 bg-gray-200 hover:bg-gray-300' : 'p-1 bg-orange-500 hover:bg-orange-600'
                          } rounded-full transition-colors shadow-sm`}
                        >
                          <MoreVertical size={isMobile ? 12 : 12} className={`${
                            isMobile ? 'text-gray-600' : 'text-white'
                          }`} />
                        </button>
                        
                        {/* Menu déroulant du message */}
                        {showMessageMenu === message.id && (
                          <div className={`dropdown-menu absolute top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${
                            isMobile ? 'w-40' : 'w-44'
                          } ${
                            message.sender === 'user' ? 'right-0' : 'left-0'
                          }`}>
                            <div className="py-1">
                              <button
                                onClick={() => handleMessageAction(message.id, 'reply')}
                                className={`flex items-center px-3 ${
                                  isMobile ? 'py-2' : 'py-2'
                                } text-gray-700 hover:bg-green-50 w-full text-left transition-colors ${
                                  isMobile ? 'text-sm' : 'text-sm'
                                }`}
                              >
                                <Reply size={isMobile ? 14 : 14} className="mr-2 text-green-500" />
                                Répondre
                              </button>
                              <button
                                onClick={() => handleMessageAction(message.id, 'forward')}
                                className={`flex items-center px-3 ${
                                  isMobile ? 'py-2' : 'py-2'
                                } text-gray-700 hover:bg-blue-50 w-full text-left transition-colors ${
                                  isMobile ? 'text-sm' : 'text-sm'
                                }`}
                              >
                                <Share size={isMobile ? 14 : 14} className="mr-2 text-blue-500" />
                                Transférer
                              </button>
                              {message.text && (
                                <button
                                  onClick={() => handleMessageAction(message.id, 'copy')}
                                  className={`flex items-center px-3 ${
                                    isMobile ? 'py-3' : 'py-2'
                                  } text-gray-700 hover:bg-purple-50 w-full text-left transition-colors ${
                                    isMobile ? 'text-base' : 'text-sm'
                                  }`}
                                >
                                  <Copy size={isMobile ? 16 : 14} className="mr-3 text-purple-500" />
                                  Copier
                                </button>
                              )}
                              {message.sender === 'user' && message.text && (
                                <button
                                  onClick={() => handleMessageAction(message.id, 'edit')}
                                  className={`flex items-center px-3 ${
                                    isMobile ? 'py-3' : 'py-2'
                                  } text-gray-700 hover:bg-yellow-50 w-full text-left transition-colors ${
                                    isMobile ? 'text-base' : 'text-sm'
                                  }`}
                                >
                                  <Edit size={isMobile ? 16 : 14} className="mr-3 text-yellow-500" />
                                  Modifier
                                </button>
                              )}
                              <hr className="my-1" />
                              <button
                                onClick={() => handleMessageAction(message.id, 'delete')}
                                className={`flex items-center px-3 ${
                                  isMobile ? 'py-3' : 'py-2'
                                } text-red-600 hover:bg-red-50 w-full text-left transition-colors ${
                                  isMobile ? 'text-base' : 'text-sm'
                                }`}
                              >
                                <Trash2 size={isMobile ? 16 : 14} className="mr-3 text-red-600" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Nom de l'expéditeur pour les messages des autres - plus compact sur mobile */}
                      {message.senderName && message.sender === 'other' && !isMobile && (
                        <p className="text-xs font-semibold mb-1 text-orange-600">
                          {message.senderName}
                        </p>
                      )}

                      {/* Réponse à un message */}
                      {message.replyTo && (
                        <div className={`text-xs mb-2 rounded ${
                          isMobile ? 'p-1.5' : 'p-2'
                        } ${
                          message.sender === 'user' 
                            ? 'bg-orange-600 bg-opacity-50' 
                            : 'bg-gray-100'
                        }`}>
                          <p className="font-semibold text-xs">Réponse à {message.replyTo.sender}</p>
                          <p className="truncate opacity-75 text-xs">{message.replyTo.text}</p>
                        </div>
                      )}

                      {/* Contenu du message */}
                      {message.type === 'sticker' && message.sticker ? (
                        <div className="flex flex-col items-center py-1">
                          <div className={`${isMobile ? 'text-2xl' : 'text-4xl'} mb-0.5`}>{message.sticker.emoji}</div>
                          <div className="text-xs opacity-75">{message.sticker.name}</div>
                        </div>
                      ) : message.type === 'file' && message.attachments ? (
                        <div className="space-y-1">
                          {message.text && <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{message.text}</p>}
                          {message.attachments.map(attachment => (
                            <div key={`${message.id}-${attachment.id}`} className={`bg-black bg-opacity-10 rounded-lg ${
                              isMobile ? 'p-1.5' : 'p-3'
                            } flex items-center space-x-2`}>
                              <div className={`flex-shrink-0 ${
                                isMobile ? 'w-6 h-6' : 'w-10 h-10'
                              } bg-blue-100 rounded-lg flex items-center justify-center`}
                              style={{ fontSize: isMobile ? '12px' : '16px' }}
                              >
                                {attachment.type.startsWith('image/') ? '🖼️' : 
                                 attachment.type.startsWith('video/') ? '🎬' :
                                 attachment.type.startsWith('audio/') ? '🎵' :
                                 attachment.type === 'application/pdf' ? '📄' : '📎'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`${
                                  isMobile ? 'text-xs' : 'text-sm'
                                } font-medium truncate`}>{attachment.name}</p>
                                <p className="text-xs opacity-70">
                                  {(attachment.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                              </div>
                              <button className={`flex-shrink-0 ${
                                isMobile ? 'p-1' : 'p-2'
                              } hover:bg-black hover:bg-opacity-10 rounded-full`}
                              style={{ fontSize: isMobile ? '12px' : '16px' }}
                              >
                                ⬇️
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={`${isMobile ? 'text-sm' : 'text-sm'}`}>{message.text}</p>
                      )}

                      {/* Pièces jointes (pour les messages texte avec fichiers) */}
                      {message.type !== 'file' && message.attachments && message.attachments.map(attachment => (
                        <div key={`${message.id}-${attachment.id}`} className={`mt-1 p-1.5 bg-black bg-opacity-10 rounded text-xs`}>
                          📎 {isMobile && attachment.name.length > 20 
                            ? attachment.name.substring(0, 20) + '...' 
                            : attachment.name
                          }
                        </div>
                      ))}

                      {/* Timestamp et statut */}
                      <div className={`flex items-center justify-between ${isMobile ? 'mt-1' : 'mt-1'}`}>
                        <p className={`${
                          isMobile ? 'text-xs' : 'text-xs'
                        } ${
                          message.sender === 'user' 
                            ? message.type === 'sticker' 
                              ? 'text-green-600' 
                              : 'text-green-100' 
                            : 'text-gray-500'
                        }`}>
                          {isMobile 
                            ? new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })
                            : message.timestamp
                          }
                          {message.type === 'sticker' && (
                            <span className={`ml-1 ${
                              isMobile ? 'text-xs' : 'text-xs'
                            } opacity-75`}>• Sticker</span>
                          )}
                        </p>
                        {message.sender === 'user' && message.status && (
                          <span className={`${
                            isMobile ? 'text-xs' : 'text-xs'
                          } ml-1 ${
                            message.type === 'sticker' ? 'text-green-600' : 'text-green-200'
                          }`} style={{ fontSize: '10px' }}>
                            {message.status === 'sending' && '🕐'}
                            {message.status === 'sent' && '✓'}
                            {message.status === 'delivered' && '✓✓'}
                            {message.status === 'read' && <span style={{color: '#4ade80'}}>✓✓</span>}
                          </span>
                        )}
                      </div>

                      {/* Réactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className={`flex flex-wrap gap-1 ${isMobile ? 'mt-3' : 'mt-2'}`}>
                          {message.reactions.map((reaction, idx) => (
                            <button
                              key={`${message.id}-reaction-${idx}-${reaction.emoji}`}
                              onClick={() => handleMessageReaction(message.id, reaction.emoji)}
                              className={`bg-white bg-opacity-90 shadow-sm rounded-full ${
                                isMobile ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs'
                              } flex items-center space-x-1 hover:bg-opacity-100 border border-gray-200 active:scale-95 transition-transform`}
                            >
                              <span className={isMobile ? 'text-base' : 'text-sm'}>{reaction.emoji}</span>
                              <span className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-xs'}`}>{reaction.users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone de saisie */}
            <div 
              key={`input-${selectedConversation.id}`}
              className={`messages-input-fixed bg-white border-t border-gray-200 flex-shrink-0 ${
                isMobile ? 'px-1 py-1 shadow-lg' : 'px-4 py-3'
              }`}
            >
              <MessageInput 
                onSendMessage={handleSendMessage}
                onSendSticker={handleSendSticker}
                isMobile={isMobile}
              />
            </div>
          </div>
        ) : !isMobile && (
          // Écran de bienvenue (desktop uniquement)
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-violet-50 p-1 min-h-0 overflow-hidden sm:p-2 lg:p-8">
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
                <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-100 sm:p-2 lg:p-4">
                  <div className="flex flex-col items-center">
                    <MessageCircle size={24} className="text-orange-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-900">{totalConversations}</span>
                    <span className="text-sm text-gray-600">Conversations</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-100 sm:p-2 lg:p-4">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-xs">{totalUnreadCount}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{totalUnreadCount}</span>
                    <span className="text-sm text-gray-600">Non lus</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-100 sm:p-2 lg:p-4">
                  <div className="flex flex-col items-center">
                    <Users size={24} className="text-green-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-900">{activeMembers}</span>
                    <span className="text-sm text-gray-600">En ligne</span>
                  </div>
                </div>
              </div>

              {/* Guide d'utilisation */}
              <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-100 text-left sm:p-2 lg:p-6">
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

      {/* Barre de statut (mobile uniquement) */}
      {isMobile && !selectedConversation && (
        <div className="bg-green-600 p-1 flex-shrink-0 sm:p-2 lg:p-4">
          <div className="flex justify-center items-center space-x-4 text-sm text-green-100">
            <span>{totalConversations} discussions</span>
            <span>•</span>
            <span>{totalUnreadCount} non lus</span>
            <span>•</span>
            <span>{activeMembers} en ligne</span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MessagesPage;
