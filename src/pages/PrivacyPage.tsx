import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Globe } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Section Hero */}
        <section className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">Politique de confidentialité</h1>
          <p className="text-xl text-gray-600 font-poppins">Comment vos données sont protégées</p>
        </section>
        {/* Fil d'Ariane */}
        <Breadcrumb current="Confidentialité" />
        {/* Contenu principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Introduction</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Chez OpenTech221 Impact, nous nous engageons à protéger votre vie privée et à 
                assurer la sécurité de vos données personnelles. Cette politique de confidentialité 
                explique comment nous collectons, utilisons, stockons et protégeons vos informations 
                lorsque vous utilisez Open Community Manager.
              </p>
              <p>
                En utilisant notre service, vous acceptez les pratiques décrites dans cette politique.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Données collectées</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-semibold">Informations que vous nous fournissez :</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Informations sur votre association</li>
                <li>Documents et fichiers que vous téléchargez</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">Informations collectées automatiquement :</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Adresse IP</li>
                <li>Type de navigateur et appareil</li>
                <li>Pages visitées et temps passé</li>
                <li>Logs de connexion et d'activité</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Utilisation des données</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Nous utilisons vos données personnelles pour :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Fournir et améliorer nos services</li>
                <li>Gérer votre compte et authentification</li>
                <li>Communiquer avec vous (support, mises à jour)</li>
                <li>Assurer la sécurité de la plateforme</li>
                <li>Analyser l'utilisation pour améliorer l'expérience</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Lock className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Protection des données</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Nous mettons en place des mesures de sécurité appropriées :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Chiffrement des données en transit (HTTPS/TLS)</li>
                <li>Chiffrement des données sensibles en base</li>
                <li>Authentification à deux facteurs</li>
                <li>Surveillance continue des accès</li>
                <li>Sauvegardes sécurisées et régulières</li>
                <li>Formation du personnel sur la sécurité</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Globe className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Partage des données</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos 
                informations uniquement dans les cas suivants :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Avec votre consentement explicite</li>
                <li>Pour des obligations légales</li>
                <li>Avec nos prestataires de services (sous contrat strict)</li>
                <li>En cas de fusion ou acquisition (avec notification préalable)</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Vos droits</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
                <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
                <li><strong>Droit d'effacement</strong> : supprimer vos données</li>
                <li><strong>Droit à la portabilité</strong> : récupérer vos données</li>
                <li><strong>Droit d'opposition</strong> : vous opposer au traitement</li>
                <li><strong>Droit de limitation</strong> : limiter le traitement</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à : privacy@opentech221.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies 
                d'analyse pour améliorer votre expérience. Vous pouvez gérer vos préférences de 
                cookies dans les paramètres de votre navigateur.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Conservation des données</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour 
                fournir nos services et respecter nos obligations légales. Les données de compte 
                sont supprimées dans les 30 jours suivant la fermeture du compte.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Modifications</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Cette politique peut être mise à jour périodiquement. Nous vous notifierons 
                des changements importants par email ou via la plateforme.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Pour toute question sur cette politique de confidentialité :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Email : privacy@opentech221.com</li>
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
