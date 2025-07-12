/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { 
  GraduationCap, 
  Play, 
  BookOpen, 
  Users, 
  Calendar,
  Clock,
  CheckCircle,
  Star,
  Award,
  Video,
  FileText,
  Download
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

export const TrainingPage: React.FC = () => {
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);

  const trainingPrograms = [
    {
      id: 'beginner',
      title: 'Formation débutant',
      duration: '2 heures',
      level: 'Débutant',
      participants: '1-10 personnes',
      price: 'Gratuit',
      description: 'Apprenez les bases d\'Open Community Manager',
      topics: [
        'Présentation générale de la plateforme',
        'Création et configuration de votre association',
        'Gestion basique des membres',
        'Première utilisation des fonctionnalités',
        'Questions & réponses'
      ],
      color: 'bg-green-500'
    },
    {
      id: 'intermediate',
      title: 'Formation intermédiaire',
      duration: '4 heures',
      level: 'Intermédiaire',
      participants: '1-15 personnes',
      price: '150€',
      description: 'Maîtrisez les fonctionnalités avancées',
      topics: [
        'Gestion avancée des membres et rôles',
        'Configuration des cotisations et paiements',
        'Planification et gestion d\'événements',
        'Outils de communication et messagerie',
        'Rapports et analyses',
        'Bonnes pratiques et optimisation'
      ],
      color: 'bg-blue-500'
    },
    {
      id: 'advanced',
      title: 'Formation expert',
      duration: '6 heures',
      level: 'Avancé',
      participants: '1-20 personnes',
      price: '250€',
      description: 'Devenez un expert de la plateforme',
      topics: [
        'Personnalisation avancée de l\'interface',
        'Intégrations et API',
        'Gestion multi-associations',
        'Automatisations et workflows',
        'Sécurité et administration',
        'Formation d\'administrateurs',
        'Support et maintenance'
      ],
      color: 'bg-purple-500'
    }
  ];

  const trainingFormats = [
    {
      icon: Video,
      title: 'Formation en ligne',
      description: 'Session interactive via visioconférence',
      features: ['Écran partagé', 'Enregistrement fourni', 'Support chat']
    },
    {
      icon: Users,
      title: 'Formation sur site',
      description: 'Déplacement dans vos locaux',
      features: ['Formation personnalisée', 'Équipement fourni', 'Support direct']
    },
    {
      icon: GraduationCap,
      title: 'Formation hybride',
      description: 'Combinaison présentiel et distanciel',
      features: ['Flexibilité maximale', 'Suivi personnalisé', 'Ressources mixtes']
    }
  ];

  const upcomingTrainings = [
    {
      date: '15 Juillet 2025',
      time: '14h00 - 16h00',
      title: 'Formation débutant',
      type: 'En ligne',
      spots: '8 places restantes'
    },
    {
      date: '22 Juillet 2025',
      time: '9h00 - 13h00',
      title: 'Formation intermédiaire',
      type: 'En ligne',
      spots: '12 places restantes'
    },
    {
      date: '29 Juillet 2025',
      time: '9h00 - 15h00',
      title: 'Formation expert',
      type: 'Sur site - Dakar',
      spots: '5 places restantes'
    }
  ];

  const testimonials = [
    {
      name: 'Fatou Sall',
      role: 'Présidente, Association Femmes Actives',
      comment: 'Formation très complète et formatrice excellente. Nous maîtrisons maintenant parfaitement la plateforme.',
      rating: 5
    },
    {
      name: 'Mamadou Diop',
      role: 'Trésorier, Club Sportif Liberté',
      comment: 'La formation m\'a permis de configurer efficacement la gestion des cotisations. Très pratique !',
      rating: 5
    }
  ];

  const resources = [
    {
      icon: FileText,
      title: 'Guide utilisateur PDF',
      description: 'Manuel complet de 50 pages',
      size: '2.3 MB'
    },
    {
      icon: Video,
      title: 'Vidéos tutorielles',
      description: 'Série de 15 vidéos explicatives',
      size: '250 MB'
    },
    {
      icon: Download,
      title: 'Modèles et modèles',
      description: 'Fichiers prêts à l\'emploi',
      size: '1,8 Mo',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 text-purple-200" />
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
            Formation & Accompagnement
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Maîtrisez Open Community Manager avec nos formations personnalisées. 
            De débutant à expert, nous vous accompagnons dans votre montée en compétences.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Fil d'Ariane */}
        <Breadcrumb current="Formations" />
        {/* Contenu principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          {/* Training Programs */}
          <div className="mb-12">
            <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-8 text-center">
              Programmes de formation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trainingPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 ${program.color} rounded-xl flex items-center justify-center mb-4`}>
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-montserrat font-bold text-gray-900 mb-2">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {program.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {program.participants}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      Niveau {program.level}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Programme :</h4>
                    <ul className="space-y-1">
                      {program.topics.slice(0, 3).map((topic, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          {topic}
                        </li>
                      ))}
                      {program.topics.length > 3 && (
                        <li className="text-sm text-gray-500">
                          + {program.topics.length - 3} autres sujets
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-purple-600">
                      {program.price}
                    </div>
                    <button 
                      onClick={() => setSelectedTraining(program.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Formats */}
          <div className="mb-12">
            <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-8 text-center">
              Formats de formation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trainingFormats.map((format, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <format.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-montserrat font-bold text-gray-900 mb-2">
                    {format.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{format.description}</p>
                  <ul className="space-y-2">
                    {format.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Trainings */}
          <div className="mb-12">
            <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-8 text-center">
              Prochaines sessions
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                {upcomingTrainings.map((training, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <Calendar className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{training.title}</h3>
                        <p className="text-sm text-gray-600">{training.date} • {training.time}</p>
                        <p className="text-sm text-gray-500">{training.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600 font-medium">{training.spots}</p>
                      <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                        S'inscrire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-8 text-center">
              Témoignages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="mb-12">
            <h2 className="text-3xl font-montserrat font-bold text-gray-900 mb-8 text-center">
              Ressources gratuites
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {resources.map((resource, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <resource.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-montserrat font-bold text-gray-900 mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{resource.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{resource.size}</p>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
