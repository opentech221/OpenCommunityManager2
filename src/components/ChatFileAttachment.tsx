import React, { useState } from 'react';
import { 
  Paperclip, 
  Image, 
  FileText, 
  Video, 
  Music, 
  X,
  Download,
  Eye,
  Play
} from 'lucide-react';

interface FileAttachmentProps {
  onFileSelect: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export const FileAttachment: React.FC<FileAttachmentProps> = ({
  onFileSelect,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx', '.txt']
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Le fichier ${file.name} est trop volumineux (max ${maxSizeMB}MB)`);
        return false;
      }
      return true;
    }).slice(0, maxFiles);

    onFileSelect(validFiles);
    setShowPicker(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="p-2 text-gray-500 hover:text-orange-600 transition-colors"
      >
        <Paperclip size={20} />
      </button>

      {showPicker && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-72">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-gray-800">Joindre un fichier</span>
            <button
              onClick={() => setShowPicker(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              isDragOver 
                ? 'border-orange-400 bg-orange-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrag={handleDrag}
            onDragStart={handleDrag}
            onDragEnd={handleDrag}
            onDragOver={handleDrag}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-2">
                <Paperclip className="text-gray-400" size={24} />
                <p className="text-sm text-gray-600">
                  Glissez-déposez ou cliquez pour sélectionner
                </p>
                <p className="text-xs text-gray-500">
                  Max {maxFiles} fichiers, {maxSizeMB}MB chacun
                </p>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3">
            <button className="flex flex-col items-center p-2 rounded hover:bg-gray-50">
              <Image size={20} className="text-green-600 mb-1" />
              <span className="text-xs">Images</span>
            </button>
            <button className="flex flex-col items-center p-2 rounded hover:bg-gray-50">
              <Video size={20} className="text-blue-600 mb-1" />
              <span className="text-xs">Vidéos</span>
            </button>
            <button className="flex flex-col items-center p-2 rounded hover:bg-gray-50">
              <Music size={20} className="text-purple-600 mb-1" />
              <span className="text-xs">Audio</span>
            </button>
            <button className="flex flex-col items-center p-2 rounded hover:bg-gray-50">
              <FileText size={20} className="text-red-600 mb-1" />
              <span className="text-xs">Docs</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface AttachedFileDisplayProps {
  file: File | {
    name: string;
    size: number;
    type: string;
    url?: string;
  };
  onRemove?: () => void;
  onPreview?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const AttachedFileDisplay: React.FC<AttachedFileDisplayProps> = ({
  file,
  onRemove,
  onPreview,
  isUploading,
  uploadProgress
}) => {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={16} className="text-green-600" />;
    if (type.startsWith('video/')) return <Video size={16} className="text-blue-600" />;
    if (type.startsWith('audio/')) return <Music size={16} className="text-purple-600" />;
    return <FileText size={16} className="text-red-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
      <div className="flex-shrink-0">
        {getFileIcon(file.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size)}
        </p>
        
        {isUploading && (
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-1">
              <div 
                className="bg-orange-600 h-1 rounded-full transition-all"
                style={{ width: `${uploadProgress || 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {(isImage || isVideo) && onPreview && (
          <button
            onClick={onPreview}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            {isImage ? <Eye size={16} /> : <Play size={16} />}
          </button>
        )}
        
        {'url' in file && file.url && (
          <a
            href={file.url}
            download={file.name}
            title={`Télécharger ${file.name}`}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
          >
            <Download size={16} />
          </a>
        )}
        
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

interface FilePreviewModalProps {
  file: File | { name: string; url: string; type: string };
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const fileUrl = 'url' in file ? file.url : URL.createObjectURL(file);
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-4xl max-h-full p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
        >
          <X size={20} />
        </button>
        
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium text-gray-900">{file.name}</h3>
          </div>
          
          <div className="p-4">
            {isImage && (
              <img
                src={fileUrl}
                alt={file.name}
                className="max-w-full max-h-96 object-contain mx-auto"
              />
            )}
            
            {isVideo && (
              <video
                src={fileUrl}
                controls
                className="max-w-full max-h-96 mx-auto"
              >
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
