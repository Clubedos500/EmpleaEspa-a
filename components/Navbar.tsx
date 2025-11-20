import React, { useState } from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.location.hash = ''}>
              <span className="text-2xl font-bold text-brand-600">Emplea</span>
              <span className="text-2xl font-light text-gray-800">España</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="#/" className="border-brand-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Buscar Empleo
              </a>
              <a href="#/companies" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Empresas
              </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">Hola, <strong>{user.name}</strong></span>
                <button
                  onClick={onLogout}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Acceso / Registro
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <a href="#/" className="bg-brand-50 border-brand-500 text-brand-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Buscar Empleo
            </a>
            {user ? (
               <button onClick={onLogout} className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700 text-base font-medium">
                 Cerrar Sesión
               </button>
            ) : (
              <button onClick={onLoginClick} className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700 text-base font-medium">
                Acceso
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};