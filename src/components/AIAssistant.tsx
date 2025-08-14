import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, Loader2, MessageSquare, Lightbulb, ExternalLink, HelpCircle } from 'lucide-react';
import { guidanceAPI } from '../services/guidanceAPI';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  relatedResources?: string[];
  followUpQuestions?: string[];
  confidence?: number;
}

interface AIAssistantProps {
  context?: {
    currentPage: string;
    userRole: string;
    maturityLevel: number;
  };
  className?: string;
  position?: 'fixed' | 'inline';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark' | 'auto';
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  context = { currentPage: 'dashboard', userRole: 'membre', maturityLevel: 2 }, 
  className = '',
  position = 'fixed',
  size = 'medium',
  theme = 'light'
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration des tailles
  const sizeConfig = {
    small: { width: 'w-72', height: 'h-80', headerHeight: 'h-12', padding: 'p-3' },
    medium: { width: 'w-80', height: 'h-96', headerHeight: 'h-14', padding: 'p-4' },
    large: { width: 'w-96', height: 'h-[32rem]', headerHeight: 'h-16', padding: 'p-5' }
  };

  const currentSize = sizeConfig[size];

  // Configuration des thèmes
  const themeConfig = {
    light: {
      container: 'bg-white border-gray-200 shadow-lg',
      header: 'bg-gradient-to-r from-violet-50 to-orange-50 border-gray-200',
      userMessage: 'bg-blue-600 text-white',
      assistantMessage: 'bg-gray-100 text-gray-900 border-gray-200',
      input: 'border-gray-300 focus:ring-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    dark: {
      container: 'bg-gray-800 border-gray-600 shadow-xl',
      header: 'bg-gradient-to-r from-violet-900 to-orange-900 border-gray-600',
      userMessage: 'bg-blue-500 text-white',
      assistantMessage: 'bg-gray-700 text-gray-100 border-gray-600',
      input: 'border-gray-600 focus:ring-blue-400 bg-gray-700 text-white',
      button: 'bg-blue-500 hover:bg-blue-600'
    },
    auto: {
      container: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-lg',
      header: 'bg-gradient-to-r from-violet-50 to-orange-50 dark:from-violet-900 dark:to-orange-900 border-gray-200 dark:border-gray-600',
      userMessage: 'bg-blue-600 dark:bg-blue-500 text-white',
      assistantMessage: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600',
      input: 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white',
      button: 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
    }
  };

  const currentTheme = themeConfig[theme];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Message d'accueil contextuel
  useEffect(() => {
    const welcomeMessage: AIMessage = {
      id: 'welcome',
      type: 'assistant',
      content: `Bonjour ! Je suis votre assistant IA spécialisé en gouvernance associative. Je peux vous aider avec l'organisation, la conformité, les finances et bien plus encore. Comment puis-je vous accompagner aujourd'hui ?`,
      timestamp: new Date(),
      suggestions: [
        "Comment améliorer notre gouvernance ?",
        "Quelles sont nos obligations légales ?",
        "Comment optimiser notre gestion financière ?"
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await guidanceAPI.queryAI(query, context);
      
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response,
        timestamp: new Date(),
        suggestions: response.suggestions,
        relatedResources: response.related_resources,
        followUpQuestions: response.follow_up_questions,
        confidence: response.confidence
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard ou consulter notre documentation.",
        timestamp: new Date(),
        suggestions: ["Consulter la documentation", "Contacter le support"],
        confidence: 0.1
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    handleSubmit(action);
  };

  const formatConfidence = (confidence?: number) => {
    if (!confidence) return '';
    const percentage = Math.round(confidence * 100);
    const color = confidence > 0.8 ? 'text-green-600' : confidence > 0.6 ? 'text-yellow-600' : 'text-red-600';
    return `${color}`;
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-orange-500 rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Assistant IA Organisationnel</h3>
            <p className="text-sm text-gray-500">Votre guide intelligent</p>
          </div>
        </div>
        <MessageSquare className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>

      {/* Chat Interface */}
      {isExpanded && (
        <div className="flex flex-col h-96">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900 border border-gray-200'
                }`}>
                  <div className="text-sm">{message.content}</div>
                  
                  {/* Confidence Score */}
                  {message.type === 'assistant' && message.confidence && (
                    <div className={`text-xs mt-1 ${formatConfidence(message.confidence)}`}>
                      Confiance: {Math.round(message.confidence * 100)}%
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-xs text-gray-600 font-medium">
                        <Lightbulb className="h-3 w-3 mr-1" />
                        Suggestions:
                      </div>
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(suggestion)}
                          className="block w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded transition-colors"
                        >
                          • {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Related Resources */}
                  {message.relatedResources && message.relatedResources.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-xs text-gray-600 font-medium">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ressources:
                      </div>
                      {message.relatedResources.map((resource, index) => (
                        <div key={index} className="text-xs text-gray-600 px-2">
                          • {resource}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Follow-up Questions */}
                  {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-xs text-gray-600 font-medium">
                        <HelpCircle className="h-3 w-3 mr-1" />
                        Questions de suivi:
                      </div>
                      {message.followUpQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(question)}
                          className="block w-full text-left text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded transition-colors"
                        >
                          • {question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm">L'assistant réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(inputValue);
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question sur la gouvernance associative..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
