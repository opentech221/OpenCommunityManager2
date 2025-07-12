/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Menu } from 'lucide-react';
import { ROUTES } from '../constants';

const APP_NAME = 'Open Community Manager';

export const PublicHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
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

          {/* Navigation desktop */}
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

          {/* Actions desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to={ROUTES.LOGIN} className="text-gray-700 hover:text-purple-600 transition-colors flex items-center">
              <LogIn className="h-4 w-4 mr-2" />
              Connexion
            </Link>
            <Link to={ROUTES.REGISTER} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Inscription
            </Link>
          </div>

          {/* Menu mobile */}
          <button
            className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-6 h-6 text-purple-700" />
          </button>
        </div>
      </div>
      {/* Menu déroulant mobile */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 shadow-lg absolute w-full left-0 z-40 animate-slide-down">
          <div className="flex flex-col px-4 py-2 gap-2">
            <Link to={ROUTES.HOME} className="py-2 text-gray-700 hover:text-purple-600 font-poppins" onClick={() => setMenuOpen(false)}>
              Accueil
            </Link>
            <Link to={ROUTES.DEMO} className="py-2 text-gray-700 hover:text-purple-600 font-poppins" onClick={() => setMenuOpen(false)}>
              Démo
            </Link>
            <Link to={ROUTES.DOCUMENTATION} className="py-2 text-gray-700 hover:text-purple-600 font-poppins" onClick={() => setMenuOpen(false)}>
              Documentation
            </Link>
            <Link to={ROUTES.TRAINING} className="py-2 text-gray-700 hover:text-purple-600 font-poppins" onClick={() => setMenuOpen(false)}>
              Formation
            </Link>
            <Link to={ROUTES.HELP} className="py-2 text-gray-700 hover:text-purple-600 font-poppins" onClick={() => setMenuOpen(false)}>
              Support
            </Link>
            <Link to={ROUTES.CONTACT} className="py-2 text-gray-700 hover:text-purple-600 font-poppins" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <Link to={ROUTES.LOGIN} className="py-2 text-gray-700 hover:text-purple-600 font-poppins flex items-center" onClick={() => setMenuOpen(false)}>
              <LogIn className="h-4 w-4 mr-2" />
              Connexion
            </Link>
            <Link to={ROUTES.REGISTER} className="py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-poppins flex items-center justify-center" onClick={() => setMenuOpen(false)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Inscription
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};
