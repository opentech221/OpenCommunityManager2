import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Calendar,
  FileText,
  MessageSquare,
  Globe,
  ArrowRight,
  Check,
  Shield,
  Zap,
  Award,
  Star,
  Quote,
  ChevronRight,
  TrendingUp,
  Heart,
} from 'lucide-react';
import { ROUTES } from '../constants';
import { Breadcrumb } from '../components/Breadcrumb';

export const LandingPage: React.FC = () => {

  const features = [
    {
      icon: Users,
      title: 'Gestion des membres',
      description: 'Administrez facilement vos membres, leurs rôles et permissions avec un système intuitif',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: CreditCard,
      title: 'Suivi des cotisations',
      description: 'Automatisez la gestion des paiements et générez des rapports financiers détaillés',
      gradient: 'from-green-500 to-green-600',
    },
    {
      icon: Calendar,
      title: 'Événements',
      description: 'Planifiez, organisez et gérez vos activités avec un système de réservation intégré',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: FileText,
      title: 'Documents',
      description: 'Centralisez et partagez vos documents importants en toute sécurité',
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Facilitez les échanges entre membres avec des outils de communication modernes',
      gradient: 'from-pink-500 to-pink-600',
    },
    {
      icon: Globe,
      title: 'Visibilité publique',
      description: 'Créez une vitrine professionnelle pour promouvoir votre association',
      gradient: 'from-indigo-500 to-indigo-600',
    },
  ];

  const stats = [
    { number: '500+', label: 'Associations actives', icon: Users },
    { number: '15K+', label: 'Membres gérés', icon: Heart },
    { number: '99.9%', label: 'Temps de disponibilité', icon: Shield },
    { number: '4.9/5', label: 'Satisfaction client', icon: Star },
  ];

  const testimonials = [
    {
      name: 'Aminata Koné',
      role: 'Présidente, Association des Femmes Entrepreneures',
      content: 'OpenCommunity Manager a révolutionné notre gestion associative. Nous avons gagné 80% de temps administratif !',
      avatar: '👩🏾‍💼',
      rating: 5,
    },
    {
      name: 'Ibrahim Traoré',
      role: 'Trésorier, Club Sportif Dakar',
      content: 'La gestion des cotisations est devenue un jeu d\'enfant. Les rapports automatiques nous font gagner des heures.',
      avatar: '👨🏾‍💻',
      rating: 5,
    },
    {
      name: 'Mariama Diallo',
      role: 'Secrétaire, Association Culturelle Sénégal',
      content: 'Interface intuitive et support client exceptionnel. Je recommande vivement cette solution !',
      avatar: '👩🏾‍🎓',
      rating: 5,
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Gain de temps',
      description: 'Automatisez 80% de vos tâches administratives',
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      icon: Shield,
      title: 'Sécurité maximale',
      description: 'Vos données sont protégées selon les standards RGPD',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: TrendingUp,
      title: 'Croissance facilitée',
      description: 'Évoluez sans limites avec nos outils scalables',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Award,
      title: 'Excellence reconnue',
      description: 'Plateforme primée et recommandée par 95% de nos clients',
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  const plans = [
    {
      name: 'Gratuit',
      price: '0',
      features: [
        'Jusqu\'à 50 membres',
        'Gestion basique des cotisations',
        'Événements illimités',
        'Support communautaire',
      ],
    },
    {
      name: 'Premium',
      price: '15',
      popular: true,
      features: [
        'Membres illimités',
        'Gestion financière avancée',
        'Stockage illimité',
        'Communication avancée',
        'Support prioritaire',
        'Personnalisation',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section moderne */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-purple-100 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Nouveau : Tableau de bord IA pour associations
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6 leading-tight">
              La révolution digitale
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                pour vos associations
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-purple-100 max-w-4xl mx-auto leading-relaxed">
              Transformez la gestion de votre association avec une plateforme tout-en-un. 
              Gagnez du temps, optimisez vos processus et développez votre impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to={ROUTES.REGISTER}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-1"
              >
                Démarrer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center">
                <Calendar className="mr-2 h-5 w-5" />
                Réserver une démo
              </button>
            </div>
            
            {/* Stats section dans le hero */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-8 w-8 text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-purple-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Fil d'Ariane */}
      <Breadcrumb current="Accueil" />

      {/* Section Avantages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 mb-4">
              Pourquoi choisir OpenCommunity Manager ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les avantages qui font de notre plateforme le choix préféré des associations modernes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section améliorée */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 mb-4">
              Fonctionnalités complètes et intuitives
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tous les outils dont votre association a besoin, réunis dans une interface moderne et facile à utiliser
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-4 text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                  En savoir plus <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Plus de 500 associations nous font confiance pour transformer leur gestion
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-purple-300 mb-4" />
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section améliorée */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 mb-4">
              Tarifs transparents et abordables
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choisissez la formule qui correspond à vos besoins
            </p>
            <div className="inline-flex items-center bg-gray-100 rounded-xl p-1">
              <button className="px-6 py-2 bg-white text-gray-900 rounded-lg shadow-sm font-medium">
                Mensuel
              </button>
              <button className="px-6 py-2 text-gray-600 font-medium">
                Annuel <span className="text-green-600 text-sm ml-1">(-20%)</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'border-2 border-purple-500 scale-105' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Plus populaire
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-montserrat font-bold text-gray-900 mb-2">
                    Formule {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}€
                    </span>
                    <span className="text-gray-600 ml-2">/mois</span>
                  </div>
                  <p className="text-gray-600">
                    {plan.name === 'Gratuit' ? 'Idéal pour débuter' : 'Pour les associations en croissance'}
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600'
                  }`}
                >
                  {plan.name === 'Gratuit' ? 'Commencer gratuitement' : 'Choisir Premium'}
                </button>
              </div>
            ))}
          </div>
          
          {/* Section garantie */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center bg-green-50 text-green-800 px-6 py-3 rounded-full font-medium">
              <Shield className="h-5 w-5 mr-2" />
              Garantie satisfait ou remboursé 30 jours
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-white mb-6">
            Prêt à transformer votre association ?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les 500+ associations qui ont déjà fait le choix de l'innovation. 
            Commencez gratuitement dès aujourd'hui !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.REGISTER}
              className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              Créer mon compte gratuit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
              Planifier une démo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
