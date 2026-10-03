import React, { useState } from 'react';

export const LoginAdmin = ({ onLogin, isDarkMode }) => {
    const [grupo, setGrupo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900';
    const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const inputClass = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';

    const handleSubmit = (e) => {
        e.preventDefault();

        const GRUPO_VALIDO = "veintidos";
        const PASSWORD_VALIDA = "22_dos_02";

        if (grupo === GRUPO_VALIDO && password === PASSWORD_VALIDA) {
            setError('');
            onLogin(true); 
        } else {
            setError('Grupo o contraseña incorrectos.');
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${bgClass}`}>
            <div className={`max-w-md w-full p-8 rounded-xl shadow-lg border ${cardClass}`}>
                
                <h2 className="text-2xl font-bold mb-6 text-center">Panel de Administración</h2>
                <p className="text-sm mb-6 text-center opacity-80">
                    Ingrese los datos para el inicio de sesion
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre del Grupo (Usuario):</label>
                        <input 
                            type="text"
                            value={grupo}
                            onChange={(e) => setGrupo(e.target.value)}
                            placeholder="Ej: elPayasoPlinPlin"
                            className={`w-full p-3 rounded-lg border outline-none transition ${inputClass}`}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Contraseña:</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full p-3 rounded-lg border outline-none transition ${inputClass}`}
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md cursor-pointer"
                    >
                        Ingresar al Sistema
                    </button>
                </form>
            </div>
        </div>
    );
};
