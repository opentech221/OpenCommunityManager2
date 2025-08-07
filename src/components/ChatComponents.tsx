import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';

interface MessageStatusProps {
  status: 'sending' | 'sent' | 'delivered' | 'read';
  className?: string;
}

export const MessageStatus: React.FC<MessageStatusProps> = ({ status, className = '' }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className={`w-3 h-3 text-gray-400 animate-pulse ${className}`} />;
      case 'sent':
        return <Check className={`w-3 h-3 text-gray-400 ${className}`} />;
      case 'delivered':
        return <CheckCheck className={`w-3 h-3 text-gray-400 ${className}`} />;
      case 'read':
        return <CheckCheck className={`w-3 h-3 text-orange-400 ${className}`} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center">
      {getStatusIcon()}
    </div>
  );
};

interface TypingIndicatorProps {
  names: string[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ names }) => {
  if (names.length === 0) return null;

  const displayText = names.length === 1 
    ? `${names[0]} est en train d'écrire...`
    : names.length === 2
    ? `${names[0]} et ${names[1]} sont en train d'écrire...`
    : `${names.length} personnes sont en train d'écrire...`;

  return (
    <div className="flex items-center space-x-2 p-3 text-sm text-gray-600">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="italic">{displayText}</span>
    </div>
  );
};

interface OnlineStatusProps {
  isOnline: boolean;
  lastSeen?: Date;
  className?: string;
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({ isOnline, lastSeen, className = '' }) => {
  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'à l\'instant';
    if (diffMins < 60) return `il y a ${diffMins} min`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    if (diffDays < 7) return `il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
      <span className="text-xs text-gray-500">
        {isOnline ? 'En ligne' : lastSeen ? `Vu ${formatLastSeen(lastSeen)}` : 'Hors ligne'}
      </span>
    </div>
  );
};
