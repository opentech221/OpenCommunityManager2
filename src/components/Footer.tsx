import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageSquare, Users } from 'lucide-react';
import { ROUTES } from '../constants';

const APP_NAME = 'Open Community Manager';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-2xl font-montserrat font-bold">
                {APP_NAME}
              </span>
            </div>
            <p className="text-gray-400 text-lg mb-6 max-w-md">
              La solution digitale de référence pour moderniser et optimiser 
              la gestion de votre association.
            </p>
            <div className="flex space-x-4">
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <Globe className="h-5 w-5" />
              </div>
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-6">Produit</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Tarifs
                </a>
              </li>
              <li>
                <Link to={ROUTES.DEMO} className="hover:text-white transition-colors">
                  Démo en ligne
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DOCUMENTATION} className="hover:text-white transition-colors">
                  API & Intégrations
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to={ROUTES.HELP} className="hover:text-white transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DOCUMENTATION} className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT} className="hover:text-white transition-colors">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link to={ROUTES.TRAINING} className="hover:text-white transition-colors">
                  Formation
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2025 OpenTech221 Impact. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <Link to={ROUTES.LEGAL} className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link to={ROUTES.PRIVACY} className="hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link to={ROUTES.TERMS} className="hover:text-white transition-colors">
                CGU
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
