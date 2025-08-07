import React, { useState } from 'react';
import { Smile, X } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ 
  onEmojiSelect, 
  isVisible, 
  onClose 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('smileys');
  const [searchTerm, setSearchTerm] = useState('');

  const emojiCategories = {
    smileys: {
      label: '😀 Smileys',
      emojis: [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
        '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
        '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
        '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
        '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
        '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
        '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨'
      ]
    },
    people: {
      label: '👋 Personnes',
      emojis: [
        '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏',
        '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
        '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛',
        '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',
        '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃',
        '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅'
      ]
    },
    hearts: {
      label: '❤️ Cœurs',
      emojis: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
        '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
        '💘', '💝', '💟', '♥️', '💌', '💋', '💍', '💎'
      ]
    },
    animals: {
      label: '🐶 Animaux',
      emojis: [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸',
        '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦',
        '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺'
      ]
    },
    food: {
      label: '🍎 Nourriture',
      emojis: [
        '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
        '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅',
        '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽',
        '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🍞'
      ]
    },
    activities: {
      label: '⚽ Activités',
      emojis: [
        '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
        '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
        '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿',
        '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿'
      ]
    },
    travel: {
      label: '🚗 Voyages',
      emojis: [
        '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
        '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵',
        '🚲', '🛴', '🛹', '🚁', '✈️', '🛩️', '🛫', '🛬',
        '🚀', '🛸', '🚢', '⛵', '🚤', '🛥️', '🛳️', '⛴️'
      ]
    },
    objects: {
      label: '📱 Objets',
      emojis: [
        '📱', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽',
        '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
        '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️',
        '🎛️', '🧭', '⏰', '⏲️', '⏱️', '⏳', '📡', '🔋'
      ]
    },
    symbols: {
      label: '💯 Symboles',
      emojis: [
        '💯', '🔥', '✨', '🎉', '🎊', '🎈', '🎁', '🏆',
        '🥇', '🥈', '🥉', '🏅', '🎖️', '💝', '💰', '💎',
        '💍', '👑', '🔱', '⚡', '💥', '💫', '⭐', '🌟',
        '💢', '💨', '💤', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️'
      ]
    }
  };

  const recentEmojis = ['😂', '❤️', '👍', '😍', '😊', '🎉', '🔥', '💯'];

  const filteredEmojis = searchTerm 
    ? Object.values(emojiCategories).flatMap(cat => cat.emojis).filter(emoji => 
        // Recherche basique - pourrait être améliorée avec des noms d'emojis
        emoji.includes(searchTerm)
      )
    : emojiCategories[selectedCategory as keyof typeof emojiCategories].emojis;

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-80 max-h-96 overflow-hidden">
      {/* Header avec recherche */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un emoji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Smile size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Emojis récents */}
      {!searchTerm && (
        <div className="p-3 border-b border-gray-100">
          <h4 className="text-xs font-medium text-gray-600 mb-2">Récemment utilisés</h4>
          <div className="flex flex-wrap gap-1">
            {recentEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  onEmojiSelect(emoji);
                  onClose();
                }}
                className="text-xl hover:bg-gray-100 rounded p-1 transition-colors transform hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Catégories */}
      {!searchTerm && (
        <div className="px-3 py-2 border-b border-gray-100">
          <div className="flex space-x-1 overflow-x-auto">
            {Object.entries(emojiCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === key 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grille d'emojis */}
      <div className="p-3 overflow-y-auto max-h-48">
        <div className="grid grid-cols-8 gap-1">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => {
                onEmojiSelect(emoji);
                onClose();
              }}
              className="text-xl hover:bg-gray-100 rounded p-1 transition-all transform hover:scale-125 active:scale-95"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 text-center">
        <button
          onClick={onClose}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

interface MessageReactionsProps {
  reactions: { [emoji: string]: string[] };
  currentUserId: string;
  onReactionToggle: (emoji: string) => void;
  onReactionLongPress?: (emoji: string, users: string[]) => void;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  currentUserId,
  onReactionToggle,
  onReactionLongPress
}) => {
  if (Object.keys(reactions).length === 0) return null;

  const handleReactionPress = (emoji: string, users: string[]) => {
    if (onReactionLongPress) {
      onReactionLongPress(emoji, users);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {Object.entries(reactions).map(([emoji, users]) => (
        <button
          key={emoji}
          onClick={() => onReactionToggle(emoji)}
          onDoubleClick={() => handleReactionPress(emoji, users)}
          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-all transform hover:scale-105 active:scale-95 ${
            users.includes(currentUserId)
              ? 'bg-orange-100 border border-orange-300 text-orange-800 shadow-md'
              : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'
          }`}
          title={`${users.join(', ')} ${users.length > 1 ? 'ont réagi' : 'a réagi'} avec ${emoji}`}
        >
          <span className="text-base">{emoji}</span>
          <span className="font-medium text-xs">{users.length}</span>
        </button>
      ))}
    </div>
  );
};

interface QuickReactionsProps {
  onReaction: (emoji: string) => void;
  isVisible: boolean;
  position: { x: number; y: number };
}

export const QuickReactions: React.FC<QuickReactionsProps> = ({
  onReaction,
  isVisible,
  position
}) => {
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);
  const quickEmojis = [
    { emoji: '👍', label: 'J\'aime' },
    { emoji: '❤️', label: 'J\'adore' },
    { emoji: '😂', label: 'Haha' },
    { emoji: '😮', label: 'Wow' },
    { emoji: '😢', label: 'Triste' },
    { emoji: '😡', label: 'Grr' }
  ];

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bg-white border border-gray-200 rounded-full shadow-2xl z-50 flex items-center px-2 py-2 space-x-1 animate-bounce-in"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -110%)'
      }}
    >
      {quickEmojis.map((item, index) => (
        <div key={index} className="relative">
          <button
            onClick={() => onReaction(item.emoji)}
            onMouseEnter={() => setHoveredEmoji(item.emoji)}
            onMouseLeave={() => setHoveredEmoji(null)}
            className="w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-50 rounded-full transition-all transform hover:scale-125 active:scale-95"
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'slideInUp 0.3s ease-out forwards'
            }}
          >
            {item.emoji}
          </button>
          
          {/* Tooltip */}
          {hoveredEmoji === item.emoji && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
              {item.label}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface ReactionUsersModalProps {
  isVisible: boolean;
  emoji: string;
  users: string[];
  onClose: () => void;
}

export const ReactionUsersModal: React.FC<ReactionUsersModalProps> = ({
  isVisible,
  emoji,
  users,
  onClose
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{emoji}</span>
              <h3 className="font-semibold text-gray-900">Réactions</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {users.map((user, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-gray-900">{user}</span>
                <span className="text-lg ml-auto">{emoji}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Animations CSS à ajouter
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.3);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  .animate-bounce-in {
    animation: bounce-in 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);
