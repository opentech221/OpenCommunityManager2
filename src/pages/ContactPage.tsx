/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Calendar,
  Users,
  Headphones,
  CheckCircle
} from 'lucide-react';
import { ROUTES } from '../constants';
import { Breadcrumb } from '../components/Breadcrumb';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    contactReason: 'support'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi du formulaire
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Téléphone',
      description: 'Appelez-nous directement',
      value: '+221 77 123 45 67',
      color: 'bg-blue-500'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Réponse sous 24h',
      value: 'contact@opencommunitymanager.com',
      color: 'bg-green-500'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      description: 'Venez nous voir',
      value: 'Dakar, Sénégal',
      color: 'bg-purple-500'
    },
    {
      icon: Clock,
      title: 'Horaires',
      description: 'Lun-Ven',
      value: '8h - 18h GMT',
      color: 'bg-orange-500'
    }
  ];

  const supportTopics = [
    {
      icon: Headphones,
      title: 'Support technique',
      description: 'Problèmes techniques, bugs, dysfonctionnements'
    },
    {
      icon: Users,
      title: 'Formation',
      description: 'Besoin d\'aide pour utiliser la plateforme'
    },
    {
      icon: MessageSquare,
      title: 'Question générale',
      description: 'Informations sur les fonctionnalités'
    },
    {
      icon: Calendar,
      title: 'Demande de démo',
      description: 'Planifier une présentation personnalisée'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-6 text-purple-200" />
          <h1 className="text-4xl md:text-5xl text-orange-500 font-montserrat font-bold mb-4">
            Nous contacter
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Notre équipe est là pour vous accompagner. Contactez-nous pour toute question, 
            suggestion ou demande d'assistance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb current="Contact" />
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <method.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{method.description}</p>
              <p className="text-purple-600 font-medium">{method.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-montserrat font-bold text-gray-900 mb-6">
              Envoyez-nous un message
            </h2>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-800">Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de contact *
                </label>
                <select
                  id="contactReason"
                  name="contactReason"
                  value={formData.contactReason}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="support">Support technique</option>
                  <option value="sales">Informations commerciales</option>
                  <option value="demo">Demande de démo</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Résumé de votre demande"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Décrivez votre demande en détail..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <Send className="h-5 w-5 mr-2" />
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Support Topics */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-montserrat font-bold text-gray-900 mb-6">
                Comment pouvons-nous vous aider ?
              </h2>
              <div className="space-y-4">
                {supportTopics.map((topic, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <topic.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{topic.title}</h3>
                      <p className="text-gray-600 text-sm">{topic.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-montserrat font-bold text-gray-900 mb-6">
                Questions fréquentes
              </h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Combien de temps pour obtenir une réponse ?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Nous répondons généralement sous 24h en jours ouvrés. Les demandes urgentes sont traitées plus rapidement.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Puis-je programmer une démonstration ?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Oui, sélectionnez "Demande de démo" dans le formulaire et nous vous contacterons pour planifier une session.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Le support est-il inclus dans l'abonnement ?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Oui, le support par email est inclus dans tous nos plans. Le support prioritaire est disponible pour les plans Premium.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
