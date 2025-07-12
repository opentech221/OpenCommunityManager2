/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { ROUTES } from '../constants';

const APP_NAME = 'Open Community Manager';

export const PublicHeader: React.FC = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-montserrat font-bold text-gray-900">
              {APP_NAME}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to={ROUTES.HOME} className="text-gray-700 hover:text-purple-600 transition-colors">
              Accueil
            </Link>
            <Link to={ROUTES.DEMO} className="text-gray-700 hover:text-purple-600 transition-colors">
              Démo
            </Link>
            <Link to={ROUTES.DOCUMENTATION} className="text-gray-700 hover:text-purple-600 transition-colors">
              Documentation
            </Link>
            <Link to={ROUTES.TRAINING} className="text-gray-700 hover:text-purple-600 transition-colors">
              Formation
            </Link>
            <Link to={ROUTES.HELP} className="text-gray-700 hover:text-purple-600 transition-colors">
              Support
            </Link>
            <Link to={ROUTES.CONTACT} className="text-gray-700 hover:text-purple-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link 
              to={ROUTES.LOGIN} 
              className="text-gray-700 hover:text-purple-600 transition-colors flex items-center"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Connexion
            </Link>
            <Link 
              to={ROUTES.REGISTER} 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Inscription
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

interface PublicBreadcrumbProps {
  currentPage: string;
  showBackButton?: boolean;
  backTo?: string;
}

export const PublicBreadcrumb: React.FC<PublicBreadcrumbProps> = ({ 
  currentPage, 
  showBackButton = false, 
  backTo = ROUTES.HOME 
}) => {
  if (!showBackButton) return null;
  
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Link 
          to={backTo} 
          className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};
