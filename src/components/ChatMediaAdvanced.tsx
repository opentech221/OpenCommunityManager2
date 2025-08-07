import React, { useState, useRef } from 'react';
import { 
  Paperclip, 
  Image, 
  FileText, 
  Video, 
  Music, 
  X,
  Download,
  Eye,
  Play,
  Camera,
  MapPin,
  Calendar,
  User,
  Trash2,
  Edit3,
  Copy,
  Share2
} from 'lucide-react';

interface AttachmentType {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
  preview?: string;
  duration?: number; // Pour vidéos/audio
  dimensions?: { width: number; height: number }; // Pour images/vidéos
}

interface MediaAttachmentProps {
  onFileSelect: (files: AttachmentType[]) => void;
  onContactShare?: () => void;
  onLocationShare?: () => void;
  onEventShare?: () => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const MediaAttachment: React.FC<MediaAttachmentProps> = ({
  onFileSelect,
  onContactShare,
  onLocationShare,
  onEventShare,
  maxFiles = 10,
  maxSizeMB = 16
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const attachmentOptions = [
    { 
      icon: Camera, 
      label: 'Appareil photo', 
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      action: () => cameraInputRef.current?.click()
    },
    { 
      icon: Image, 
      label: 'Galerie', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: () => {
        if (fileInputRef.current) {
          fileInputRef.current.accept = 'image/*';
          fileInputRef.current.click();
        }
      }
    },
    { 
      icon: Video, 
      label: 'Vidéo', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      action: () => {
        if (fileInputRef.current) {
          fileInputRef.current.accept = 'video/*';
          fileInputRef.current.click();
        }
      }
    },
    { 
      icon: Music, 
      label: 'Audio', 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      action: () => {
        if (fileInputRef.current) {
          fileInputRef.current.accept = 'audio/*';
          fileInputRef.current.click();
        }
      }
    },
    { 
      icon: FileText, 
      label: 'Document', 
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      action: () => {
        if (fileInputRef.current) {
          fileInputRef.current.accept = '.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx';
          fileInputRef.current.click();
        }
      }
    },
    { 
      icon: User, 
      label: 'Contact', 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      action: onContactShare || (() => alert('Partage de contact'))
    },
    { 
      icon: MapPin, 
      label: 'Position', 
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      action: onLocationShare || (() => handleLocationShare())
    },
    { 
      icon: Calendar, 
      label: 'Événement', 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      action: onEventShare || (() => alert('Partage d\'événement'))
    }
  ];

  const handleLocationShare = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const locationAttachment: AttachmentType = {
          id: Date.now().toString(),
          name: `Position (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
          size: 0,
          type: 'location',
          url: `https://maps.google.com/?q=${latitude},${longitude}`
        };
        onFileSelect([locationAttachment]);
        setShowAttachMenu(false);
      }, () => {
        alert('Impossible d\'accéder à votre position');
      });
    } else {
      alert('Géolocalisation non supportée');
    }
  };

  const handleFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const processedFiles = await Promise.all(files.map(processFile));
    const validFiles = processedFiles.filter(Boolean) as AttachmentType[];
    
    if (validFiles.length > 0) {
      onFileSelect(validFiles);
      setShowAttachMenu(false);
    }
    
    // Reset input
    event.target.value = '';
  };

  const processFile = (file: File): Promise<AttachmentType | null> => {
    return new Promise((resolve) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Le fichier ${file.name} est trop volumineux (max ${maxSizeMB}MB)`);
        resolve(null);
        return;
      }

      const attachment: AttachmentType = {
        id: Date.now() + Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      };

      // Générer un aperçu pour les images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new window.Image();
          img.onload = () => {
            attachment.dimensions = { width: img.width, height: img.height };
            attachment.preview = e.target?.result as string;
            resolve(attachment);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        // Pour les vidéos, on pourrait extraire une miniature
        attachment.preview = 'video-placeholder';
        resolve(attachment);
      } else {
        resolve(attachment);
      }
    });
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const processedFiles = await Promise.all(files.map(processFile));
    const validFiles = processedFiles.filter(Boolean) as AttachmentType[];
    
    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowAttachMenu(!showAttachMenu)}
        className="p-2 text-gray-500 hover:text-orange-600 transition-colors hover:bg-orange-50 rounded-full"
      >
        <Paperclip size={20} />
      </button>

      {showAttachMenu && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-80 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Joindre un fichier</h3>
            <button
              onClick={() => setShowAttachMenu(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>

          {/* Zone de glisser-déposer */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition-all ${
              isDragOver 
                ? 'border-orange-400 bg-orange-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <Paperclip className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-sm text-gray-600 mb-1">
              Glissez vos fichiers ici
            </p>
            <p className="text-xs text-gray-500">
              Maximum {maxFiles} fichiers de {maxSizeMB}MB chacun
            </p>
          </div>

          {/* Options d'attachement */}
          <div className="grid grid-cols-4 gap-3">
            {attachmentOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className={`flex flex-col items-center p-3 rounded-xl transition-all hover:scale-105 ${option.bgColor}`}
              >
                <option.icon size={24} className={`mb-2 ${option.color}`} />
                <span className="text-xs font-medium text-gray-700">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Inputs cachés */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {/* Overlay pour fermer le menu */}
      {showAttachMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowAttachMenu(false)}
        />
      )}
    </div>
  );
};

interface MediaPreviewProps {
  attachments: AttachmentType[];
  onRemove: (id: string) => void;
  onPreview: (attachment: AttachmentType) => void;
  onEdit?: (id: string) => void;
  showActions?: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  attachments,
  onRemove,
  onPreview,
  onEdit,
  showActions = true
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string, size: number = 20) => {
    if (type.startsWith('image/')) return <Image size={size} className="text-green-600" />;
    if (type.startsWith('video/')) return <Video size={size} className="text-blue-600" />;
    if (type.startsWith('audio/')) return <Music size={size} className="text-purple-600" />;
    if (type === 'location') return <MapPin size={size} className="text-green-600" />;
    return <FileText size={size} className="text-red-600" />;
  };

  if (attachments.length === 0) return null;

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => (
        <div key={attachment.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Aperçu média */}
          {attachment.type.startsWith('image/') && attachment.preview && (
            <div className="relative group">
              <img
                src={attachment.preview}
                alt={attachment.name}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => onPreview(attachment)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
              <button
                onClick={() => onPreview(attachment)}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye size={16} />
              </button>
              {attachment.dimensions && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                  {attachment.dimensions.width} × {attachment.dimensions.height}
                </div>
              )}
            </div>
          )}

          {attachment.type.startsWith('video/') && (
            <div className="relative h-48 bg-gray-900 flex items-center justify-center cursor-pointer group"
                 onClick={() => onPreview(attachment)}>
              <Play size={48} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                {attachment.duration ? `${Math.floor(attachment.duration / 60)}:${String(attachment.duration % 60).padStart(2, '0')}` : 'Vidéo'}
              </div>
            </div>
          )}

          {/* Informations du fichier */}
          <div className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                {!attachment.type.startsWith('image/') && !attachment.type.startsWith('video/') && (
                  <div className="flex-shrink-0 mt-1">
                    {getFileIcon(attachment.type)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{attachment.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">{formatFileSize(attachment.size)}</span>
                    {attachment.type.startsWith('image/') && attachment.dimensions && (
                      <span className="text-sm text-gray-500">
                        • {attachment.dimensions.width} × {attachment.dimensions.height}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center space-x-1 ml-2">
                  {onEdit && attachment.type.startsWith('image/') && (
                    <button
                      onClick={() => onEdit(attachment.id)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                      title="Modifier l'image"
                    >
                      <Edit3 size={16} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onPreview(attachment)}
                    className="p-1 text-gray-400 hover:text-green-600 rounded transition-colors"
                    title="Prévisualiser"
                  >
                    <Eye size={16} />
                  </button>
                  
                  <button
                    onClick={() => onRemove(attachment.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                    title="Supprimer"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Actions spécifiques au type de location */}
            {attachment.type === 'location' && attachment.url && (
              <div className="mt-3 flex space-x-2">
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Ouvrir dans Maps
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(attachment.url!)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copier le lien"
                >
                  <Copy size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

interface MediaPreviewModalProps {
  attachment: AttachmentType | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (attachment: AttachmentType) => void;
  onShare?: (attachment: AttachmentType) => void;
  onDelete?: (attachment: AttachmentType) => void;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  attachment,
  isOpen,
  onClose,
  onDownload,
  onShare,
  onDelete
}) => {
  if (!isOpen || !attachment) return null;

  const handleDownload = () => {
    if (attachment.file) {
      const url = URL.createObjectURL(attachment.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (attachment.url) {
      window.open(attachment.url, '_blank');
    }
    onDownload?.(attachment);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative max-w-6xl max-h-full w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-50 text-white">
          <div>
            <h3 className="font-medium truncate max-w-md">{attachment.name}</h3>
            <p className="text-sm opacity-75">
              {attachment.type} • {(attachment.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {onDownload && (
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                title="Télécharger"
              >
                <Download size={20} />
              </button>
            )}
            
            {onShare && (
              <button
                onClick={() => onShare(attachment)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                title="Partager"
              >
                <Share2 size={20} />
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(attachment)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors text-red-400"
                title="Supprimer"
              >
                <Trash2 size={20} />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 flex items-center justify-center p-4">
          {attachment.type.startsWith('image/') && attachment.preview && (
            <img
              src={attachment.preview}
              alt={attachment.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          )}
          
          {attachment.type.startsWith('video/') && attachment.file && (
            <video
              src={URL.createObjectURL(attachment.file)}
              controls
              className="max-w-full max-h-full rounded-lg"
            >
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          )}
          
          {attachment.type.startsWith('audio/') && attachment.file && (
            <div className="bg-white rounded-lg p-8 text-center">
              <Music size={64} className="mx-auto mb-4 text-purple-600" />
              <h3 className="font-medium text-gray-900 mb-4">{attachment.name}</h3>
              <audio
                src={URL.createObjectURL(attachment.file)}
                controls
                className="mx-auto"
              >
                Votre navigateur ne supporte pas la lecture audio.
              </audio>
            </div>
          )}
          
          {attachment.type === 'location' && (
            <div className="bg-white rounded-lg p-8 text-center max-w-md">
              <MapPin size={64} className="mx-auto mb-4 text-green-600" />
              <h3 className="font-medium text-gray-900 mb-2">Position partagée</h3>
              <p className="text-gray-600 mb-4">{attachment.name}</p>
              {attachment.url && (
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ouvrir dans Maps
                </a>
              )}
            </div>
          )}
          
          {!attachment.type.startsWith('image/') && 
           !attachment.type.startsWith('video/') && 
           !attachment.type.startsWith('audio/') && 
           attachment.type !== 'location' && (
            <div className="bg-white rounded-lg p-8 text-center max-w-md">
              <FileText size={64} className="mx-auto mb-4 text-red-600" />
              <h3 className="font-medium text-gray-900 mb-2">{attachment.name}</h3>
              <p className="text-gray-600 mb-4">
                {attachment.type} • {(attachment.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Télécharger
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
