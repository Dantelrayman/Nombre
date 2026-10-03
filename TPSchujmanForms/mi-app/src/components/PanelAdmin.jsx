import React, { useState, useEffect } from 'react';
import { getInscriptos, eliminarInscripto, actualizarInscripto } from '../api';

export const PanelAdmin = ({ onLogout, isDarkMode }) => {
  const [inscriptos, setInscriptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const fetchList = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await getInscriptos();
      setInscriptos(Array.isArray(data) ? data : []);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este registro?')) return;
    try {
      await eliminarInscripto(id);
      setInscriptos((prev) => prev.filter((item) => (item.id || item._id) !== id));
    } catch {
      alert('Error al intentar eliminar el registro.');
    }
  };

  const handleEditClick = (item) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const id = editingItem.id || editingItem._id;
    try {
      await actualizarInscripto(id, editingItem);
      setInscriptos((prev) =>
        prev.map((item) => ((item.id || item._id) === id ? editingItem : item))
      );
      setEditingItem(null);
    } catch {
      alert('Error al actualizar el registro.');
    }
  };

  const filteredInscriptos = inscriptos.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.apellido || '').toLowerCase().includes(term) ||
      (item.nombre || '').toLowerCase().includes(term) ||
      (item.email || '').toLowerCase().includes(term) ||
      (item.documento || '').toString().toLowerCase().includes(term) ||
      (item.empresa || '').toLowerCase().includes(term) ||
      (item.cargo || '').toLowerCase().includes(term)
    );
  });

  const cardStyle = isDarkMode
    ? 'bg-purple-950/40 border-purple-800 text-purple-100 shadow-2xl'
    : 'bg-white border-purple-200 text-purple-950 shadow-xl';

  const inputStyle = isDarkMode
    ? 'bg-purple-900/30 border-purple-700 text-purple-100 focus:border-purple-400 placeholder-purple-400/50'
    : 'bg-purple-50/50 border-purple-300 text-purple-950 focus:border-purple-600 placeholder-purple-400';

  const subCardStyle = isDarkMode
    ? 'bg-purple-900/30 border-purple-800'
    : 'bg-purple-50 border-purple-200';

  return (
    <div className={`w-full max-w-7xl mx-auto p-6 rounded-2xl border transition-colors duration-300 ${cardStyle}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Panel de Administración</h2>
          <p className={`text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
            Control y gestión de inscripciones del evento
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchList}
            disabled={cargando}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {cargando ? 'Actualizando...' : 'Actualizar Lista'}
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-xl border flex flex-col justify-center ${subCardStyle}`}>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Total Inscriptos</span>
          <span className="text-2xl font-black mt-1">{inscriptos.length}</span>
        </div>
        <div className={`p-4 rounded-xl border flex flex-col justify-center ${subCardStyle}`}>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Mostrados en Pantalla</span>
          <span className="text-2xl font-black mt-1">{filteredInscriptos.length}</span>
        </div>
        <div className="flex flex-col justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por apellido, nombre, email, DNI..."
            className={`w-full px-4 py-3 rounded-xl border outline-none transition focus:ring-1 focus:ring-purple-500 ${inputStyle}`}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl text-sm bg-rose-950/40 border border-rose-600 text-rose-300 text-center">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-purple-900/20">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className={`border-b font-semibold ${
              isDarkMode ? 'bg-purple-900/40 border-purple-800 text-purple-200' : 'bg-purple-100/70 border-purple-200 text-purple-900'
            }`}>
              <th className="p-3">Apellido y Nombre</th>
              <th className="p-3">Documento</th>
              <th className="p-3">Email</th>
              <th className="p-3">Celular</th>
              <th className="p-3">Empresa</th>
              <th className="p-3">Cargo</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-purple-900/40' : 'divide-purple-100'}`}>
            {filteredInscriptos.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-purple-400">
                  {cargando ? 'Cargando registros...' : 'No se encontraron registros coincidentes.'}
                </td>
              </tr>
            ) : (
              filteredInscriptos.map((item) => {
                const id = item.id || item._id;
                return (
                  <tr key={id} className={`transition-colors ${
                    isDarkMode ? 'hover:bg-purple-900/20' : 'hover:bg-purple-50/50'
                  }`}>
                    <td className="p-3 font-medium">{item.apellido}, {item.nombre}</td>
                    <td className="p-3">{item.documento}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.celular}</td>
                    <td className="p-3">{item.empresa}</td>
                    <td className="p-3">{item.cargo}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl border ${
            isDarkMode ? 'bg-purple-950 border-purple-800 text-purple-100' : 'bg-white border-purple-200 text-purple-900'
          }`}>
            <h3 className="text-xl font-bold mb-4">Editar Inscripto</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Apellido</label>
                  <input
                    type="text"
                    value={editingItem.apellido}
                    onChange={(e) => setEditingItem({ ...editingItem, apellido: e.target.value })}
                    required
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-1 focus:ring-purple-500 ${inputStyle}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Nombre</label>
                  <input
                    type="text"
                    value={editingItem.nombre}
                    onChange={(e) => setEditingItem({ ...editingItem, nombre: e.target.value })}
                    required
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-1 focus:ring-purple-500 ${inputStyle}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Documento</label>
                  <input
                    type="text"
                    value={editingItem.documento}
                    onChange={(e) => setEditingItem({ ...editingItem, documento: e.target.value })}
                    required
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-1 focus:ring-purple-500 ${inputStyle}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Celular</label>
                  <input
                    type="text"
                    value={editingItem.celular}
                    onChange={(e) => setEditingItem({ ...editingItem, celular: e.target.value })}
                    required
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-1 focus:ring-purple-500 ${inputStyle}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={editingItem.email}
                  onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                  required
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-1 focus:ring-purple-500 ${inputStyle}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Empresa</label>
                  <input
                    type="text"
                    value={editingItem.empresa}
                    onChange={(e) => setEditingItem({ ...editingItem, empresa: e.target.value })}
                    required
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-1 focus:ring-purple-500 ${inputStyle}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Cargo</label>
                  <input
                    type="text"
                    value={editingItem.cargo}
                    onChange={(e) => setEditingItem({ ...editingItem, cargo: e.target.value })}
                    required
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition focus:ring-1 focus:ring-purple-500 ${inputStyle}`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-purple-500/40 text-sm font-semibold hover:bg-purple-900/20 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-600/30 transition cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};