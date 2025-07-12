import { Link } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  FileText, 
 
  ArrowRight,
  Check,
  MessageSquare
} from 'lucide-react';
import { ROUTES } from '../constants';

const features = [
  {
    icon: Users,
    title: 'Gestion des membres',
    description: 'Ajoutez et gérez vos membres avec leurs rôles et statuts'
  },
  {
    icon: CreditCard,
    title: 'Suivi des cotisations',
    description: 'Suivez les paiements et générez des rapports automatiquement'
  },
  {
    icon: Calendar,
    title: 'Événements',
    description: 'Planifiez vos événements et gérez les inscriptions'
  },
  {
    icon: TrendingUp,
    title: 'Gestion financière',
    description: 'Enregistrez vos recettes et dépenses, suivez votre budget'
  },
  {
    icon: FileText,
    title: 'Documents',
    description: 'Archivez vos PV, rapports et documents officiels'
  },
  {
    icon: MessageSquare,
    title: 'Communication',
    description: 'Messagerie interne pour communiquer avec vos membres'
  }
];

const plans = [
  {
    name: 'Gratuit',
    price: '0',
    description: 'Parfait pour commencer',
    features: [
      'Jusqu\'à 50 membres',
      'Gestion de base des événements',
      'Suivi des cotisations',
      'Support communautaire'
    ]
  },
  {
    name: 'Premium',
    price: '15',
    description: 'Pour les associations actives',
    features: [
      'Membres illimités',
      'Gestion financière avancée',
      'Stockage illimité',
      'Rapports personnalisés',
      'Support prioritaire'
    ],
    popular: true
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-montserrat font-bold text-purple-500">
                Open Community Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={ROUTES.LOGIN}
                className="text-gray-700 hover:text-purple-500 font-medium"
              >
                Connexion
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="btn-primary"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-500 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-montserrat font-bold text-white mb-6">
            Digitalisez la gestion de votre association
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Une plateforme complète pour gérer vos membres, cotisations, événements et finances. 
            Simplifiez votre administration et concentrez-vous sur votre mission.
          </p>
          <Link
            to={ROUTES.REGISTER}
            className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            Créer mon espace association
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-montserrat font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des outils puissants et simples pour gérer votre association au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Icon className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-montserrat font-bold text-gray-900 mb-4">
              Tarifs transparents
            </h3>
            <p className="text-lg text-gray-600">
              Commencez gratuitement, évoluez selon vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`
                  card relative
                  ${plan.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Populaire
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h4>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">€/mois</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={ROUTES.REGISTER}
                  className={`
                    w-full text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200
                    ${plan.popular 
                      ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }
                  `}
                >
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h5 className="text-xl font-montserrat font-bold mb-4">
                Open Community Manager
              </h5>
              <p className="text-gray-400 mb-4">
                La solution complète pour digitaliser la gestion de votre association. 
                Développé par OpenTech221 Impact.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Fonctionnalités</h6>
              <ul className="space-y-2 text-gray-400">
                <li>Gestion des membres</li>
                <li>Suivi des cotisations</li>
                <li>Événements</li>
                <li>Finances</li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Support</h6>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Contact</li>
                <li>FAQ</li>
                <li>Communauté</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 OpenTech221 Impact. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
