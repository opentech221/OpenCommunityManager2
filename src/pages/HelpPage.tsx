import React, { useState } from 'react';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText,
  Users,
  CreditCard,
  Calendar,
  Settings,
  ChevronRight,
  Search
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

export const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    { id: 'all', name: 'Tout', icon: HelpCircle },
    { id: 'getting-started', name: 'Premiers pas', icon: Book },
    { id: 'members', name: 'Gestion des membres', icon: Users },
    { id: 'finances', name: 'Finances', icon: CreditCard },
    { id: 'events', name: 'Événements', icon: Calendar },
    { id: 'settings', name: 'Paramètres', icon: Settings },
  ];

  const faqItems = [
    {
      category: 'getting-started',
      question: 'Comment créer mon premier compte association ?',
      answer: 'Pour créer votre compte, cliquez sur "Commencer gratuitement" sur la page d\'accueil. Remplissez le formulaire avec les informations de votre association (nom, email, téléphone). Un email de confirmation vous sera envoyé.'
    },
    {
      category: 'members',
      question: 'Comment ajouter des membres à mon association ?',
      answer: 'Rendez-vous dans la section "Membres" de votre tableau de bord. Cliquez sur "Ajouter un membre" et remplissez les informations requises. Vous pouvez aussi inviter des membres par email.'
    },
    {
      category: 'members',
      question: 'Comment gérer les rôles et permissions ?',
      answer: 'Dans la gestion des membres, vous pouvez assigner des rôles (Président, Trésorier, Secrétaire, Membre). Chaque rôle a des permissions spécifiques que vous pouvez personnaliser.'
    },
    {
      category: 'finances',
      question: 'Comment suivre les cotisations ?',
      answer: 'La section "Cotisations" vous permet de définir les montants, échéances et suivre les paiements. Vous pouvez générer des rappels automatiques et des reçus.'
    },
    {
      category: 'events',
      question: 'Comment organiser un événement ?',
      answer: 'Dans "Événements", cliquez sur "Nouvel événement". Définissez la date, lieu, description et nombre de places. Les membres peuvent s\'inscrire directement via la plateforme.'
    },
    {
      category: 'settings',
      question: 'Comment personnaliser mon profil d\'association ?',
      answer: 'Allez dans "Paramètres" puis "Profil de l\'association". Vous pouvez modifier le logo, la description, les informations de contact et créer une page publique.'
    }
  ];

  const filteredFAQ = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header + Hero */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Section Hero améliorée */}
        <section className="mb-8 rounded-xl bg-gradient-to-br from-purple-700 via-purple-600 to-orange-400 p-8 text-white shadow-lg">
          <h1 className="text-4xl md:text-7xl font-bold mb-4 text-orange-500 font-montserrat drop-shadow">Centre d'aide</h1>
          <p className="text-xl font-poppins opacity-90">Trouvez rapidement les réponses à vos questions</p>
        </section>
        {/* Fil d'Ariane */}
        <Breadcrumb current="Support" />
        {/* Barre de recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar des catégories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
              <nav className="space-y-2">
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-50 text-purple-600 border border-purple-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span>{category.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Contact rapide */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Besoin d'aide ?</h3>
              <div className="space-y-3">
                <a
                  href="mailto:support@opentech221.com"
                  className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>support@opentech221.com</span>
                </a>
                <a
                  href="tel:+221771234567"
                  className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+221 77 123 45 67</span>
                </a>
                <button className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat en direct</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Questions fréquentes
              </h2>
              
              {filteredFAQ.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun résultat trouvé pour votre recherche.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQ.map((item, index) => (
                    <details
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 [&[open]]:bg-purple-50"
                    >
                      <summary className="flex items-center justify-between cursor-pointer font-medium text-gray-900 hover:text-purple-600">
                        <span>{item.question}</span>
                        <ChevronRight className="w-5 h-5 transition-transform [details[open]>&]:rotate-90" />
                      </summary>
                      <div className="mt-4 text-gray-600 leading-relaxed">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>

            {/* Ressources supplémentaires */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Ressources utiles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <Book className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Guide de démarrage</h3>
                    <p className="text-sm text-gray-600">Guide complet pour débuter</p>
                  </div>
                </a>
                
                <a
                  href="#"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <FileText className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Documentation API</h3>
                    <p className="text-sm text-gray-600">Pour les développeurs</p>
                  </div>
                </a>
                
                <a
                  href="#"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <Users className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Communauté</h3>
                    <p className="text-sm text-gray-600">Échanger avec d'autres utilisateurs</p>
                  </div>
                </a>
                
                <a
                  href="#"
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Formations</h3>
                    <p className="text-sm text-gray-600">Webinaires et tutoriels</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
