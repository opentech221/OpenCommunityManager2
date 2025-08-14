import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, Loader2, MessageSquare, Lightbulb, ExternalLink, HelpCircle, Minimize2 } from 'lucide-react';
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
  defaultExpanded?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  context = { currentPage: 'dashboard', userRole: 'membre', maturityLevel: 2 }, 
  className = '',
  position = 'fixed',
  size = 'medium',
  theme = 'auto',
  defaultExpanded = false
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration responsive des tailles
  const sizeConfig = {
    small: { 
      width: 'w-72 sm:w-80', 
      height: 'h-80 sm:h-96', 
      maxHeight: 'max-h-[50vh]',
      headerHeight: 'h-12', 
      padding: 'p-3',
      text: 'text-sm'
    },
    medium: { 
      width: 'w-80 sm:w-96', 
      height: 'h-96 sm:h-[28rem]', 
      maxHeight: 'max-h-[60vh]',
      headerHeight: 'h-14', 
      padding: 'p-4',
      text: 'text-sm'
    },
    large: { 
      width: 'w-96 sm:w-[26rem]', 
      height: 'h-[32rem] sm:h-[36rem]', 
      maxHeight: 'max-h-[70vh]',
      headerHeight: 'h-16', 
      padding: 'p-5',
      text: 'text-base'
    }
  };

  const currentSize = sizeConfig[size];

  // Configuration harmonisée avec la palette OpenCommunityManager2
  const themeConfig = {
    light: {
      container: 'bg-white border-orange-200 shadow-xl backdrop-blur-sm ring-1 ring-orange-100',
      header: 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300',
      headerText: 'text-orange-700 font-semibold',
      userMessage: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm',
      assistantMessage: 'bg-orange-50 text-gray-800 border border-orange-200 shadow-sm',
      input: 'border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white',
      button: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm',
      suggestionButton: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200',
      resourceText: 'text-orange-600'
    },
    dark: {
      container: 'bg-purple-900 border-orange-700 shadow-2xl backdrop-blur-sm ring-1 ring-orange-800',
      header: 'bg-gradient-to-r from-purple-800 to-purple-900 border-orange-700',
      headerText: 'text-orange-300 font-semibold',
      userMessage: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm',
      assistantMessage: 'bg-purple-800/50 text-orange-100 border border-orange-700/50 shadow-sm',
      input: 'border-orange-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-purple-800/50 text-orange-100',
      button: 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-sm',
      suggestionButton: 'bg-orange-900/50 hover:bg-orange-800/50 text-orange-300 border border-orange-700',
      resourceText: 'text-orange-400'
    },
    auto: {
      container: 'bg-white dark:bg-purple-900 border-orange-200 dark:border-orange-700 shadow-xl backdrop-blur-sm ring-1 ring-orange-100 dark:ring-orange-800',
      header: 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-purple-800 dark:to-purple-900 border-orange-300 dark:border-orange-700',
      headerText: 'text-orange-700 dark:text-orange-300 font-semibold',
      userMessage: 'bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 text-white shadow-sm',
      assistantMessage: 'bg-orange-50 dark:bg-purple-800/50 text-gray-800 dark:text-orange-100 border border-orange-200 dark:border-orange-700/50 shadow-sm',
      input: 'border-orange-300 dark:border-orange-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-purple-800/50 dark:text-orange-100',
      button: 'bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white shadow-sm',
      suggestionButton: 'bg-orange-50 dark:bg-orange-900/50 hover:bg-orange-100 dark:hover:bg-orange-800/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700',
      resourceText: 'text-orange-600 dark:text-orange-400'
    }
  };

  const currentTheme = themeConfig[theme];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Message d'accueil contextuel et intelligent
  useEffect(() => {
    const getWelcomeMessage = () => {
      const pageContext = context.currentPage.toLowerCase();
      let welcomeText = "Bonjour ! Je suis votre assistant IA spécialisé en gouvernance associative. ";
      let contextualSuggestions: string[] = [];

      if (pageContext.includes('dashboard') || pageContext === 'home') {
        welcomeText += "Je vois que vous consultez le tableau de bord. Comment puis-je vous aider à optimiser votre gestion associative ?";
        contextualSuggestions = [
          "Analyser les performances de notre association",
          "Suggérer des améliorations prioritaires",
          "Expliquer les indicateurs clés"
        ];
      } else if (pageContext.includes('finance')) {
        welcomeText += "Vous travaillez sur les finances. Je peux vous accompagner dans la gestion budgétaire et comptable.";
        contextualSuggestions = [
          "Optimiser notre budget",
          "Analyser nos ratios financiers",
          "Préparer le rapport financier"
        ];
      } else if (pageContext.includes('member')) {
        welcomeText += "Vous gérez les membres. Je peux vous conseiller sur l'engagement et la fidélisation.";
        contextualSuggestions = [
          "Améliorer l'engagement des membres",
          "Optimiser les cotisations",
          "Organiser des activités attractives"
        ];
      } else if (pageContext.includes('event')) {
        welcomeText += "Vous planifiez des événements. Je peux vous aider à optimiser leur organisation.";
        contextualSuggestions = [
          "Planifier un événement efficacement",
          "Maximiser la participation",
          "Gérer la logistique"
        ];
      } else if (pageContext.includes('guidance')) {
        welcomeText += "Excellent choix ! Je suis là pour vous guider dans l'excellence organisationnelle.";
        contextualSuggestions = [
          "Évaluer notre maturité organisationnelle",
          "Identifier nos axes d'amélioration",
          "Planifier notre développement"
        ];
      } else {
        welcomeText += "Je peux vous aider avec l'organisation, la conformité, les finances et bien plus encore.";
        contextualSuggestions = [
          "Comment améliorer notre gouvernance ?",
          "Quelles sont nos obligations légales ?",
          "Comment optimiser notre fonctionnement ?"
        ];
      }

      return { welcomeText, contextualSuggestions };
    };

    const { welcomeText, contextualSuggestions } = getWelcomeMessage();
    
    const welcomeMessage: AIMessage = {
      id: 'welcome',
      type: 'assistant',
      content: welcomeText,
      timestamp: new Date(),
      suggestions: contextualSuggestions
    };
    setMessages([welcomeMessage]);
  }, [context.currentPage]);

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
        content: response.response || "Je traite votre demande...",
        timestamp: new Date(),
        suggestions: response.suggestions || [],
        relatedResources: response.related_resources || [],
        followUpQuestions: response.follow_up_questions || [],
        confidence: response.confidence || 0.8
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Je rencontre temporairement des difficultés. Veuillez réessayer dans un moment ou consulter notre documentation pour une aide immédiate.",
        timestamp: new Date(),
        suggestions: ["Consulter la documentation", "Réessayer plus tard", "Contacter le support"],
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
    // Utilisation de la palette harmonisée : vert pour succès, orange pour moyen, rouge pour faible
    const color = confidence > 0.8 ? 'text-green-600' : confidence > 0.6 ? 'text-orange-600' : 'text-red-600';
    return color;
  };

  const containerClasses = position === 'fixed' 
    ? `fixed bottom-4 left-4 z-50 ${currentSize.width} ${currentSize.maxHeight} ${className}`
    : `relative ${currentSize.width} ${className}`;

  if (isMinimized) {
    return (
      <div className={`${position === 'fixed' ? 'fixed bottom-4 left-4 z-50' : 'relative'} ${className}`}>
        <button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          aria-label="Ouvrir l'assistant IA"
        >
          <Brain className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.container} rounded-xl border transition-all duration-300 ${containerClasses}`}>
      {/* Header */}
      <div 
        className={`flex items-center justify-between ${currentSize.padding} ${currentSize.headerHeight} ${currentTheme.header} border-b rounded-t-xl cursor-pointer hover:opacity-90 transition-opacity`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${currentTheme.headerText} ${currentSize.text}`}>Assistant IA</h3>
            <p className={`text-xs ${currentTheme.resourceText}`}>Votre guide intelligent</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className={`p-1 rounded hover:bg-black/10 transition-colors ${currentTheme.headerText}`}
            aria-label="Minimiser"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <MessageSquare className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''} ${currentTheme.headerText}`} />
        </div>
      </div>

      {/* Chat Interface */}
      {isExpanded && (
        <div className={`flex flex-col ${currentSize.height}`}>
          {/* Messages */}
          <div className={`flex-1 overflow-y-auto ${currentSize.padding} space-y-4 scrollbar-thin scrollbar-thumb-gray-300`}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl ${currentSize.padding} ${currentSize.text} transition-all hover:shadow-sm ${
                  message.type === 'user' 
                    ? currentTheme.userMessage
                    : currentTheme.assistantMessage
                }`}>
                  <div className="leading-relaxed">{message.content}</div>
                  
                  {/* Confidence Score */}
                  {message.type === 'assistant' && message.confidence && (
                    <div className={`text-xs mt-2 ${formatConfidence(message.confidence)}`}>
                      Confiance: {Math.round(message.confidence * 100)}%
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className={`flex items-center text-xs font-medium ${currentTheme.resourceText}`}>
                        <Lightbulb className="h-3 w-3 mr-1" />
                        Suggestions:
                      </div>
                      <div className="space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickAction(suggestion)}
                            className={`block w-full text-left text-xs ${currentTheme.suggestionButton} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}
                          >
                            • {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Resources */}
                  {message.relatedResources && message.relatedResources.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className={`flex items-center text-xs font-medium ${currentTheme.resourceText}`}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ressources:
                      </div>
                      {message.relatedResources.map((resource, index) => (
                        <div key={index} className={`text-xs ${currentTheme.resourceText} px-2 py-1`}>
                          • {resource}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Follow-up Questions */}
                  {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className={`flex items-center text-xs font-medium ${currentTheme.resourceText}`}>
                        <HelpCircle className="h-3 w-3 mr-1" />
                        Questions de suivi:
                      </div>
                      <div className="space-y-2">
                        {message.followUpQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickAction(question)}
                            className="block w-full text-left text-xs bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-800/30 text-green-700 dark:text-green-300 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 border border-green-200 dark:border-green-700"
                          >
                            • {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className={`${currentTheme.assistantMessage} rounded-xl ${currentSize.padding}`}>
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className={`${currentSize.text} animate-pulse`}>L'assistant réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`${currentSize.padding} border-t border-orange-200 dark:border-orange-700 bg-orange-50/50 dark:bg-purple-800/50 rounded-b-xl`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(inputValue);
              }}
              className="flex space-x-3"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question sur la gouvernance associative..."
                className={`flex-1 px-4 py-2 ${currentTheme.input} rounded-lg transition-all duration-200 ${currentSize.text} placeholder-orange-500 dark:placeholder-orange-400`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`px-4 py-2 ${currentTheme.button} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md disabled:hover:shadow-none`}
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
