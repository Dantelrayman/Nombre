import React, { useState } from 'react';
import { FormDeRegistro } from './components/FormDeRegistro';
import { LoginAdmin } from './components/LoginAdmin';
import { PanelAdmin } from './components/PanelAdmin';

export default function App() {
  const [view, setView] = useState('register');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-purple-950 text-purple-50' 
        : 'bg-purple-50/50 text-purple-950'
    }`}>
      <header className={`border-b backdrop-blur-md sticky top-0 z-40 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-purple-950/90 border-purple-900' 
          : 'bg-white/90 border-purple-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <div className="w-14 h-8 shrink-0 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md text-xs">
              AADD
            </div>
            <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight line-clamp-1">
              Inscripción fiesta en la isla de Schujman
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <nav className="flex items-center bg-purple-900/30 p-1 rounded-xl border border-purple-800/40">
              <button
                onClick={() => setView('register')}
                className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  view === 'register'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : isDarkMode ? 'text-purple-300 hover:text-white' : 'text-purple-700 hover:text-purple-950'
                }`}
              >
                Inscripción
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  view === 'admin'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : isDarkMode ? 'text-purple-300 hover:text-white' : 'text-purple-700 hover:text-purple-950'
                }`}
              >
                Administrador
              </button>
            </nav>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-1.5 sm:p-2 rounded-xl border transition-colors ${
                isDarkMode 
                  ? 'bg-purple-900/40 border-purple-700 text-purple-200 hover:bg-purple-800/50' 
                  : 'bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200'
              }`}
              title="Alternar modo claro/oscuro"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {view === 'register' && <FormDeRegistro isDarkMode={isDarkMode} />}
        {view === 'admin' && (
          isAdminLoggedIn ? (
            <PanelAdmin onLogout={() => setIsAdminLoggedIn(false)} isDarkMode={isDarkMode} />
          ) : (
            <LoginAdmin onLogin={() => setIsAdminLoggedIn(true)} isDarkMode={isDarkMode} />
          )
        )}
      </main>
    </div>
  );
}