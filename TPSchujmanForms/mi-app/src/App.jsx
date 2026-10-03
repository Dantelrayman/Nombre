import React, { useState } from 'react';
import { FormDeRegistro } from './components/FormDeRegistro';
import { LoginAdmin } from './components/LoginAdmin';
import { PanelAdmin } from './components/PanelAdmin';

export default function App() {
  const [view, setView] = useState('register');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-purple-950 text-purple-50' 
        : 'bg-purple-50/50 text-purple-950'
    }`}>
      <header className={`border-b backdrop-blur-md sticky top-0 z-40 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-purple-950/80 border-purple-900' 
          : 'bg-white/80 border-purple-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              AADD
            </div>
            <span className="text-xl font-bold tracking-tight">Inscripcion fiesta en la isla de Schujman</span>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="flex items-center bg-purple-900/20 p-1 rounded-xl border border-purple-800/30">
              <button
                onClick={() => setView('register')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  view === 'register'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : isDarkMode ? 'text-purple-300 hover:text-white' : 'text-purple-700 hover:text-purple-950'
                }`}
              >
                Inscripción
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
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
              className={`p-2 rounded-xl border transition-colors ${
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

      <main className="max-w-7xl mx-auto px-4 py-8">
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