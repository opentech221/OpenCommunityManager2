import React from 'react';
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb current="Conditions d'utilisation" />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Conditions Générales d'Utilisation</h1>
          <p className="text-xl text-gray-600">
            Conditions d'utilisation de la plateforme Open Community Manager
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dernière mise à jour : 11 juillet 2025
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Acceptation des conditions</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                En accédant et en utilisant Open Community Manager ("le Service"), vous acceptez 
                d'être lié par ces Conditions Générales d'Utilisation ("CGU"). Si vous n'acceptez 
                pas ces conditions, veuillez ne pas utiliser le Service.
              </p>
              <p>
                Ces CGU s'appliquent à tous les utilisateurs du Service, y compris les visiteurs, 
                les utilisateurs enregistrés et les administrateurs d'association.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Description du service</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Open Community Manager est une plateforme SaaS (Software as a Service) qui permet 
                aux associations de gérer leurs activités, membres, événements, finances et communications.
              </p>
              <p>Le Service comprend notamment :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Gestion des membres et des rôles</li>
                <li>Suivi des cotisations et des finances</li>
                <li>Organisation d'événements</li>
                <li>Stockage et partage de documents</li>
                <li>Outils de communication interne</li>
                <li>Création de profils publics</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Obligations de l'utilisateur</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-semibold">Vous vous engagez à :</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Fournir des informations exactes et à jour</li>
                <li>Maintenir la confidentialité de vos identifiants</li>
                <li>Utiliser le Service conformément aux lois applicables</li>
                <li>Respecter les droits d'autrui</li>
                <li>Ne pas porter atteinte à la sécurité du Service</li>
                <li>Signaler tout usage abusif ou dysfonctionnement</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">Il est interdit de :</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Publier du contenu illégal, offensant ou diffamatoire</li>
                <li>Violer les droits de propriété intellectuelle</li>
                <li>Tenter d'accéder à des données non autorisées</li>
                <li>Perturber le fonctionnement du Service</li>
                <li>Utiliser des robots ou scripts automatisés</li>
                <li>Revendre ou redistribuer le Service</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Propriété intellectuelle</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Le Service et tous ses composants (logiciels, design, contenu, marques) sont 
                protégés par les droits de propriété intellectuelle d'OpenTech221 Impact.
              </p>
              <p>
                Vous conservez la propriété de vos données et contenus. En utilisant le Service, 
                vous nous accordez une licence limitée pour traiter vos données dans le cadre 
                de la fourniture du Service.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Limitation de responsabilité</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Le Service est fourni "en l'état" sans garantie d'aucune sorte. Dans les limites 
                autorisées par la loi, OpenTech221 Impact décline toute responsabilité pour :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Les dommages indirects ou consécutifs</li>
                <li>La perte de données ou d'opportunités commerciales</li>
                <li>Les interruptions de service</li>
                <li>Les actes de tiers ou force majeure</li>
              </ul>
              <p>
                Notre responsabilité totale ne peut excéder le montant payé par l'utilisateur 
                au cours des 12 derniers mois.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tarification et paiement</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Certaines fonctionnalités du Service peuvent être payantes. Les tarifs sont 
                disponibles sur notre site web et peuvent être modifiés avec un préavis de 30 jours.
              </p>
              <p>
                Les paiements sont dus d'avance. En cas de retard de paiement, l'accès au Service 
                peut être suspendu après notification.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Résiliation</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Vous pouvez résilier votre compte à tout moment depuis les paramètres. 
                Nous pouvons suspendre ou résilier votre accès en cas de violation des CGU.
              </p>
              <p>
                Après résiliation, vos données seront supprimées dans un délai de 30 jours, 
                sauf obligation légale de conservation.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Modifications des CGU</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications 
                importantes vous seront notifiées par email ou via la plateforme.
              </p>
              <p>
                La poursuite de l'utilisation du Service après notification vaut acceptation 
                des nouvelles conditions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Droit applicable</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Ces CGU sont régies par le droit sénégalais. Tout litige sera de la compétence 
                exclusive des tribunaux de Dakar.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Pour toute question concernant ces CGU :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Email : legal@opentech221.com</li>
                <li>Téléphone : +221 77 123 45 67</li>
                <li>Adresse : OpenTech221 Impact, Dakar, Sénégal</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
