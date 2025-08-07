import React from 'react';

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
  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
    '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
    '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥',
    '👍', '👎', '👌', '🤏', '✌️', '🤞', '🤟', '🤘',
    '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋',
    '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍'
  ];

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 w-64">
      <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            className="text-lg hover:bg-gray-100 rounded p-1 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

interface MessageReactionsProps {
  reactions: { [emoji: string]: string[] };
  currentUserId: string;
  onReactionToggle: (emoji: string) => void;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  currentUserId,
  onReactionToggle
}) => {
  if (Object.keys(reactions).length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {Object.entries(reactions).map(([emoji, users]) => (
        <button
          key={emoji}
          onClick={() => onReactionToggle(emoji)}
          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
            users.includes(currentUserId)
              ? 'bg-orange-100 border border-orange-300 text-orange-800'
              : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
        >
          <span>{emoji}</span>
          <span className="font-medium">{users.length}</span>
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
  const quickEmojis = ['❤️', '😂', '😮', '😢', '😡', '👍'];

  if (!isVisible) return null;

  return (
    <div 
      className="absolute bg-white border border-gray-200 rounded-full shadow-lg p-2 z-50 flex space-x-1"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {quickEmojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onReaction(emoji)}
          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded-full transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
