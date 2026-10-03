export const API_BASE_URL = 'http://localhost:3000'; //schujman subi las cosas bien xfa

export const getInscriptos = async () => {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) throw new Error('Error al obtener inscriptos');
  return await response.json();
};

export const inscribirParticipante = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/inscribir`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Error al registrar participante');
  return await response.json();
};

export const actualizarInscripto = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/actualizar/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar inscripto');
  return await response.json();
};

export const eliminarInscripto = async (id) => {
  const response = await fetch(`${API_BASE_URL}/eliminar/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar inscripto');
  return await response.json();
};