import React from 'react';
import { FileText, Scale, Shield } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

export const LegalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Section Hero */}
        <section className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">Mentions légales</h1>
          <p className="text-xl text-gray-600 font-poppins">Informations légales et RGPD</p>
        </section>
        {/* Fil d'Ariane */}
        <Breadcrumb current="Mentions légales" />
        {/* Contenu principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Éditeur du site</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p><strong>Raison sociale :</strong> OpenTech221 Impact</p>
              <p><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</p>
              <p><strong>Capital social :</strong> 50 000 € entièrement libéré</p>
              <p><strong>Siège social :</strong> Dakar, Sénégal</p>
              <p><strong>Email :</strong> contact@opentech221.com</p>
              <p><strong>Téléphone :</strong> +221 77 123 45 67</p>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Scale className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Directeur de publication</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p><strong>Nom :</strong> Equipe OpenTech221</p>
              <p><strong>Qualité :</strong> Directeur Général</p>
              <p><strong>Email :</strong> direction@opentech221.com</p>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Hébergement</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p><strong>Hébergeur :</strong> AWS (Amazon Web Services)</p>
              <p><strong>Adresse :</strong> Amazon Web Services EMEA SARL</p>
              <p><strong>Lieu :</strong> 38 Avenue John F. Kennedy, L-1855, Luxembourg</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Le site Open Community Manager et l'ensemble de son contenu (textes, images, vidéos, etc.) 
                sont protégés par le droit d'auteur et appartiennent à OpenTech221 Impact ou à ses partenaires.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie 
                des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf 
                autorisation écrite préalable.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Responsabilité</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                OpenTech221 Impact s'efforce de fournir des informations aussi précises que possible. 
                Toutefois, elle ne pourra être tenue responsable des omissions, des inexactitudes et des 
                carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires 
                qui lui fournissent ces informations.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Pour toute question concernant ces mentions légales ou le site Open Community Manager, 
                vous pouvez nous contacter :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Par email : legal@opentech221.com</li>
                <li>Par téléphone : +221 77 123 45 67</li>
                <li>Par courrier : OpenTech221 Impact, Dakar, Sénégal</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
