import React, { useState } from 'react';

export const LoginAdmin = ({ onLogin, isDarkMode }) => {
  const [grupo, setGrupo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const cardStyle = isDarkMode
    ? 'bg-purple-950/40 border-purple-800 text-purple-100 shadow-2xl'
    : 'bg-white border-purple-200 text-purple-950 shadow-xl';

  const inputStyle = isDarkMode
    ? 'bg-purple-900/30 border-purple-700 text-purple-100 focus:border-purple-400 placeholder-purple-400/50'
    : 'bg-purple-50/50 border-purple-300 text-purple-950 focus:border-purple-600 placeholder-purple-400';

  const handleSubmit = (e) => {
    e.preventDefault();

    const GRUPO_VALIDO = 'veintidos';
    const PASSWORD_VALIDA = '22_dos_02';

    if (grupo === GRUPO_VALIDO && password === PASSWORD_VALIDA) {
      setError('');
      onLogin();
    } else {
      setError('Grupo o contraseña incorrectos.');
    }
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className={`max-w-md w-full p-8 rounded-2xl border transition-colors duration-300 ${cardStyle}`}>
        <h2 className="text-2xl font-bold mb-2 text-center">Acceso Administrativo</h2>
        <p className={`text-sm mb-6 text-center ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
          Ingrese las credenciales del grupo
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm bg-rose-500/20 border border-rose-500 text-rose-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre del Grupo (Usuario):</label>
            <input
              type="text"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              placeholder="git o"
              className={`w-full p-3 rounded-xl border outline-none transition focus:ring-1 focus:ring-purple-500 ${inputStyle}`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full p-3 rounded-xl border outline-none transition focus:ring-1 focus:ring-purple-500 ${inputStyle}`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition font-semibold shadow-lg shadow-purple-600/30 cursor-pointer active:bg-purple-800"
          >
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};
