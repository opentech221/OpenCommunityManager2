import React from 'react';

interface BreadcrumbProps {
  current: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ current }) => (
  <nav className="bg-gray-50 border-b border-gray-200" aria-label="Fil d'Ariane">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <a href="/" className="hover:text-purple-600 font-poppins">Accueil</a>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        <li className="text-gray-700 font-semibold font-poppins">{current}</li>
      </ol>
    </div>
  </nav>
);
