import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Camera, 
  Type, 
  Send, 
  X, 
  Eye, 
  Heart, 
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

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
  duration?: number; // Pour les vidéos
}

interface StatusListProps {
  statuses: StatusStory[];
  currentUserId: string;
  onStatusClick: (status: StatusStory, index: number) => void;
  onCreateStatus: () => void;
}

export const StatusList: React.FC<StatusListProps> = ({
  statuses,
  currentUserId,
  onStatusClick,
  onCreateStatus
}) => {
  // Grouper les statuts par utilisateur
  const groupedStatuses = statuses.reduce((acc, status) => {
    if (!acc[status.userId]) {
      acc[status.userId] = [];
    }
    acc[status.userId].push(status);
    return acc;
  }, {} as Record<string, StatusStory[]>);

  const userStatuses = Object.values(groupedStatuses).map(userStories => {
    const user = userStories[0];
    const hasUnviewed = userStories.some(story => !story.isViewed && story.userId !== currentUserId);
    const isCurrentUser = user.userId === currentUserId;
    
    return {
      userId: user.userId,
      userName: user.userName,
      userAvatar: user.userAvatar,
      stories: userStories.sort((a, b) => a.timestamp - b.timestamp),
      hasUnviewed,
      isCurrentUser,
      latestTimestamp: Math.max(...userStories.map(s => s.timestamp))
    };
  }).sort((a, b) => {
    // Utilisateur actuel en premier, puis par ordre de nouveauté
    if (a.isCurrentUser) return -1;
    if (b.isCurrentUser) return 1;
    return b.latestTimestamp - a.latestTimestamp;
  });

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center p-4 space-x-1 overflow-x-auto">
        {/* Bouton d'ajout de statut */}
        <div className="flex-shrink-0 text-center">
          <button
            onClick={onCreateStatus}
            className="relative w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors group"
          >
            <Camera size={24} className="text-gray-600 group-hover:text-gray-800" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <Plus size={12} className="text-white" />
            </div>
          </button>
          <p className="text-xs text-gray-600 mt-2 font-medium">Votre statut</p>
        </div>

        {/* Liste des statuts utilisateurs */}
        {userStatuses.map(user => (
          <div key={user.userId} className="flex-shrink-0 text-center mx-2">
            <button
              onClick={() => onStatusClick(user.stories[0], 0)}
              className="relative group"
            >
              {/* Avatar avec indicateur de nouveauté */}
              <div className={`w-16 h-16 rounded-full p-0.5 ${
                user.hasUnviewed 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : user.isCurrentUser 
                    ? 'bg-gradient-to-br from-green-500 to-blue-500'
                    : 'bg-gray-300'
              }`}>
                <img
                  src={user.userAvatar}
                  alt={user.userName}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              
              {/* Compteur de stories */}
              {user.stories.length > 1 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs font-bold">{user.stories.length}</span>
                </div>
              )}
              
              {/* Overlay hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-full transition-all"></div>
            </button>
            <p className="text-xs text-gray-600 mt-2 font-medium truncate max-w-16">
              {user.isCurrentUser ? 'Vous' : user.userName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface StatusViewerProps {
  stories: StatusStory[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onReaction: (storyId: string, emoji: string) => void;
  onReply: (storyId: string, message: string) => void;
}

export const StatusViewer: React.FC<StatusViewerProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
  currentUserId,
  onReaction,
  onReply
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showViews, setShowViews] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const currentStory = stories[currentIndex];
  const isOwner = currentStory?.userId === currentUserId;
  const storyDuration = currentStory?.content.type === 'video' 
    ? (currentStory.duration || 10) * 1000 
    : 5000; // 5 secondes pour images/texte

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  useEffect(() => {
    if (!isOpen || isPaused) return;

    setProgress(0);
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / storyDuration) * 100;
      
      if (newProgress >= 100) {
        handleNext();
      } else {
        setProgress(newProgress);
        progressRef.current = setTimeout(updateProgress, 50);
      }
    };
    
    progressRef.current = setTimeout(updateProgress, 50);
    
    return () => {
      if (progressRef.current) {
        clearTimeout(progressRef.current);
      }
    };
  }, [currentIndex, isOpen, isPaused, storyDuration, handleNext]);

  useEffect(() => {
    if (currentStory?.content.type === 'video' && videoRef.current) {
      const video = videoRef.current;
      
      const handlePlay = () => {};
      const handlePause = () => {};
      const handleEnded = () => handleNext();
      
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);
      
      if (!isPaused) {
        video.play();
      }
      
      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentIndex, isPaused, currentStory?.content.type, handleNext]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    
    if (currentStory?.content.type === 'video' && videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleReaction = (emoji: string) => {
    onReaction(currentStory.id, emoji);
    setShowReactions(false);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(currentStory.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}j`;
    }
  };

  if (!isOpen || !currentStory) return null;

  const quickReactions = ['❤️', '😍', '😂', '😮', '😢', '👏'];
  const backgroundColors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-purple-500',
    'from-green-400 to-blue-500',
    'from-yellow-400 to-red-500',
    'from-pink-400 to-yellow-400',
    'from-indigo-400 to-purple-500'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Barre de progression */}
      <div className="flex space-x-1 p-2">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-white transition-all duration-100 ${
                index < currentIndex ? 'w-full' : 
                index === currentIndex ? `w-[${progress}%]` : 'w-0'
              }`}
              style={index === currentIndex ? { width: `${progress}%` } : {}}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center space-x-3">
          <img
            src={currentStory.userAvatar}
            alt={currentStory.userName}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <h3 className="font-semibold">{currentStory.userName}</h3>
            <p className="text-sm opacity-75">{formatTime(currentStory.timestamp)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentStory.content.type === 'video' && (
            <>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button
                onClick={handlePauseToggle}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
              </button>
            </>
          )}
          
          {isOwner && (
            <button
              onClick={() => setShowViews(true)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
            >
              <Eye size={20} />
            </button>
          )}
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Zone cliquable pour navigation */}
        <button
          onClick={handlePrevious}
          className="absolute left-0 top-0 w-1/3 h-full z-10"
          disabled={currentIndex === 0}
        />
        
        <button
          onClick={handleNext}
          className="absolute right-0 top-0 w-1/3 h-full z-10"
        />
        
        <button
          onClick={handlePauseToggle}
          className="absolute left-1/3 top-0 w-1/3 h-full z-10"
        />

        {/* Contenu de la story */}
        {currentStory.content.type === 'image' && (
          <img
            src={currentStory.content.url}
            alt="Story"
            className="max-w-full max-h-full object-contain"
          />
        )}
        
        {currentStory.content.type === 'video' && (
          <video
            ref={videoRef}
            src={currentStory.content.url}
            className="max-w-full max-h-full object-contain"
            muted={isMuted}
            playsInline
          />
        )}
        
        {currentStory.content.type === 'text' && (
          <div
            className={`w-full h-full flex items-center justify-center p-8 bg-gradient-to-br ${
              currentStory.content.backgroundColor || backgroundColors[currentIndex % backgroundColors.length]
            }`}
          >
            <p
              className={`text-center text-2xl md:text-4xl font-bold ${
                currentStory.content.textColor || 'text-white'
              } ${currentStory.content.font || 'font-sans'}`}
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              {currentStory.content.text}
            </p>
          </div>
        )}

        {/* Réactions rapides */}
        {showReactions && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-white bg-opacity-90 px-6 py-3 rounded-full">
            {quickReactions.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions du bas */}
      <div className="p-4 text-white">
        {!isOwner && (
          <div className="flex items-center space-x-3">
            {!showReplyInput ? (
              <>
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-3 hover:bg-white hover:bg-opacity-20 rounded-full"
                >
                  <Heart size={24} />
                </button>
                
                <button
                  onClick={() => setShowReplyInput(true)}
                  className="flex-1 text-left px-4 py-3 bg-white bg-opacity-20 rounded-full"
                >
                  Répondre à {currentStory.userName}...
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3 w-full">
                <button
                  onClick={() => setShowReplyInput(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                >
                  <X size={20} />
                </button>
                
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Répondre à ${currentStory.userName}...`}
                  className="flex-1 px-4 py-3 bg-white bg-opacity-20 rounded-full text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:bg-opacity-30"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                />
                
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="p-3 hover:bg-white hover:bg-opacity-20 rounded-full disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal des vues (pour le propriétaire) */}
      {showViews && isOwner && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  {currentStory.views.length} vues
                </h3>
                <button
                  onClick={() => setShowViews(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-80">
              {currentStory.views.map(view => (
                <div key={view.userId} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {view.userName[0].toUpperCase()}
                    </div>
                    <span className="font-medium">{view.userName}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTime(view.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatusCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStatus: (status: Omit<StatusStory, 'id' | 'timestamp' | 'views' | 'reactions'>) => void;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
}

export const StatusCreator: React.FC<StatusCreatorProps> = ({
  isOpen,
  onClose,
  onCreateStatus,
  currentUserId,
  currentUserName,
  currentUserAvatar
}) => {
  const [mode, setMode] = useState<'image' | 'text'>('image');
  const [textContent, setTextContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [backgroundColor, setBackgroundColor] = useState('from-purple-400 to-pink-400');
  const [textColor, setTextColor] = useState('text-white');
  const [font, setFont] = useState('font-sans');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const backgroundOptions = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-purple-500',
    'from-green-400 to-blue-500',
    'from-yellow-400 to-red-500',
    'from-pink-400 to-yellow-400',
    'from-indigo-400 to-purple-500',
    'from-red-400 to-pink-500',
    'from-teal-400 to-blue-500'
  ];
  
  const textColorOptions = [
    { class: 'text-white', label: 'Blanc' },
    { class: 'text-black', label: 'Noir' },
    { class: 'text-yellow-300', label: 'Jaune' },
    { class: 'text-red-400', label: 'Rouge' },
    { class: 'text-blue-400', label: 'Bleu' },
    { class: 'text-green-400', label: 'Vert' }
  ];
  
  const fontOptions = [
    { class: 'font-sans', label: 'Sans-serif' },
    { class: 'font-serif', label: 'Serif' },
    { class: 'font-mono', label: 'Mono' },
    { class: 'font-bold', label: 'Gras' }
  ];

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedImage]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Le fichier est trop volumineux (max 10MB)');
        return;
      }
      setSelectedImage(file);
      setMode('image');
    }
  };

  const handleSubmit = () => {
    if (mode === 'text' && !textContent.trim()) {
      alert('Veuillez saisir du texte');
      return;
    }
    
    if (mode === 'image' && !selectedImage) {
      alert('Veuillez sélectionner une image');
      return;
    }

    const status: Omit<StatusStory, 'id' | 'timestamp' | 'views' | 'reactions'> = {
      userId: currentUserId,
      userName: currentUserName,
      userAvatar: currentUserAvatar,
      content: mode === 'text' 
        ? {
            type: 'text',
            text: textContent,
            backgroundColor,
            textColor,
            font
          }
        : {
            type: 'image',
            url: previewUrl
          }
    };

    onCreateStatus(status);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setTextContent('');
    setSelectedImage(null);
    setPreviewUrl('');
    setMode('image');
    setBackgroundColor('from-purple-400 to-pink-400');
    setTextColor('text-white');
    setFont('font-sans');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white bg-black bg-opacity-50">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
        >
          <X size={24} />
        </button>
        
        <h2 className="font-semibold text-lg">Nouveau statut</h2>
        
        <button
          onClick={handleSubmit}
          disabled={(mode === 'text' && !textContent.trim()) || (mode === 'image' && !selectedImage)}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 rounded-full font-medium"
        >
          Publier
        </button>
      </div>

      {/* Mode selector */}
      <div className="flex bg-gray-900 text-white">
        <button
          onClick={() => setMode('image')}
          className={`flex-1 py-3 text-center font-medium ${
            mode === 'image' ? 'bg-white text-black' : 'hover:bg-gray-800'
          }`}
        >
          <Camera className="inline mr-2" size={20} />
          Image
        </button>
        <button
          onClick={() => setMode('text')}
          className={`flex-1 py-3 text-center font-medium ${
            mode === 'text' ? 'bg-white text-black' : 'hover:bg-gray-800'
          }`}
        >
          <Type className="inline mr-2" size={20} />
          Texte
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 relative">
        {mode === 'image' ? (
          <div className="h-full flex items-center justify-center">
            {selectedImage ? (
              <div className="relative max-w-full max-h-full">
                <img
                  src={previewUrl}
                  alt="Aperçu"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl('');
                  }}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="text-center text-white">
                <Camera size={64} className="mx-auto mb-4 opacity-50" />
                <p className="mb-4 text-lg">Sélectionnez une image</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium"
                >
                  Choisir une image
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={`h-full flex items-center justify-center bg-gradient-to-br ${backgroundColor}`}>
            <div className="w-full max-w-md px-8">
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Écrivez quelque chose..."
                className={`w-full h-32 bg-transparent text-center text-2xl md:text-4xl font-bold ${textColor} ${font} placeholder-white placeholder-opacity-50 resize-none focus:outline-none`}
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                maxLength={200}
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black bg-opacity-90 text-white p-4">
        {mode === 'text' && (
          <div className="space-y-4">
            {/* Background colors */}
            <div>
              <p className="text-sm mb-2 opacity-75">Couleur de fond</p>
              <div className="flex space-x-2 overflow-x-auto">
                {backgroundOptions.map(bg => (
                  <button
                    key={bg}
                    onClick={() => setBackgroundColor(bg)}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${bg} border-2 ${
                      backgroundColor === bg ? 'border-white' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Text colors */}
            <div>
              <p className="text-sm mb-2 opacity-75">Couleur du texte</p>
              <div className="flex space-x-2">
                {textColorOptions.map(color => (
                  <button
                    key={color.class}
                    onClick={() => setTextColor(color.class)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      textColor === color.class ? 'bg-white text-black' : 'bg-gray-800'
                    }`}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fonts */}
            <div>
              <p className="text-sm mb-2 opacity-75">Police</p>
              <div className="flex space-x-2">
                {fontOptions.map(fontOption => (
                  <button
                    key={fontOption.class}
                    onClick={() => setFont(fontOption.class)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      font === fontOption.class ? 'bg-white text-black' : 'bg-gray-800'
                    }`}
                  >
                    {fontOption.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center text-xs opacity-50">
              {textContent.length}/200 caractères
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
    </div>
  );
};
