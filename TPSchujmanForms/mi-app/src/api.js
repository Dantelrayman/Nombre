export const API_BASE_URL = 'http://200.3.127.46:8002/~veintidos/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginAdmin = async (usuario, clave) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usuario, clave }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Credenciales incorrectas');
  }

  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const getInscriptos = async (filtro = '') => {
  const url = filtro
    ? `${API_BASE_URL}/?q=${encodeURIComponent(filtro)}`
    : `${API_BASE_URL}/`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Sesión expirada o no autorizada');
    }
    throw new Error('Error al obtener la lista de inscriptos');
  }

  return await response.json();
};

export const inscribirParticipante = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/inscribir`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error('Error al registrar participante');
    error.status = response.status;
    error.detalles = data;
    throw error;
  }

  return data;
};

export const actualizarInscripto = async (id, datosActualizados) => {
  const esFormData = datosActualizados instanceof FormData;
  const headers = { ...getAuthHeaders() };

  if (!esFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}/actualizar/${id}`, {
    method: 'PUT',
    headers,
    body: esFormData ? datosActualizados : JSON.stringify(datosActualizados),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Sesión expirada o no autorizada');
    }
    const dataError = await response.json().catch(() => ({}));
    throw new Error(dataError.mensaje || 'Error al actualizar el inscripto');
  }

  return await response.json();
};

export const eliminarInscripto = async (id) => {
  const response = await fetch(`${API_BASE_URL}/eliminar/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Sesión expirada o no autorizada');
    }
    throw new Error('Error al eliminar el inscripto');
  }

  return await response.json();
};

export const getComprobanteUrl = (id) => {
  const token = localStorage.getItem('token');
  return `${API_BASE_URL}/comprobante/${id}?token=${encodeURIComponent(token || '')}`;
};