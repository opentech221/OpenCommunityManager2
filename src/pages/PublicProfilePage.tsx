import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Users, 
  Award,
  Edit,
  Share2,
  Download,
  Eye
} from 'lucide-react';

export default function PublicProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // Données fictives de l'association
  const association = {
    name: "Association Communautaire de Conakry",
    sigle: "ACC",
    description: "Nous œuvrons pour le développement communautaire et l'autonomisation des jeunes dans la région de Conakry.",
    address: "Conakry, Guinée",
    phone: "+224 123 456 789",
    email: "contact@acc-guinee.org",
    website: "www.acc-guinee.org",
    foundedDate: "2018",
    membersCount: 45,
    achievements: [
      "Formation de 200 jeunes en entrepreneuriat",
      "Création de 15 micro-entreprises",
      "Organisation de 25 événements communautaires",
      "Sensibilisation de 1000 personnes sur l'hygiène"
    ],
    projects: [
      {
        title: "Projet Jeunesse et Emploi",
        description: "Formation et accompagnement des jeunes vers l'emploi",
        status: "En cours",
        participants: 50
      },
      {
        title: "Sensibilisation Santé",
        description: "Campagne de sensibilisation sur la santé communautaire",
        status: "Terminé",
        participants: 200
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête décoré avec couleur orange */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 shadow-sm p-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-500">
                Profil Public
              </h1>
            </div>
            <div>
              <p className="text-gray-700 font-medium text-lg">
                Vitrine digitale et visibilité maximale pour votre association
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <strong>Présence en ligne :</strong> Renforcez votre image et votre crédibilité
                  </p>
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    <strong>Engagement communautaire :</strong> Attirez nouveaux membres et partenaires
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* En-tête avec photo de couverture */}
      <div className="relative h-64 bg-gradient-to-r from-purple-500 to-purple-700">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{association.name}</h1>
            <p className="text-xl opacity-90">{association.sigle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* À propos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">À propos</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-gray-500 hover:text-purple-500 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed">{association.description}</p>
            </div>

            {/* Projets récents */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Projets récents</h2>
              <div className="space-y-4">
                {association.projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        project.status === 'En cours' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {project.participants} participants
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Réalisations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Nos réalisations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {association.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations de contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{association.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{association.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{association.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{association.website}</span>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Créée en</span>
                  </div>
                  <span className="font-semibold text-gray-900">{association.foundedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Membres</span>
                  </div>
                  <span className="font-semibold text-gray-900">{association.membersCount}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Demander à rejoindre</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Partager</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Télécharger le profil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 