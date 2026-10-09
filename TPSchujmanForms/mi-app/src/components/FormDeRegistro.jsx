import React, { useState } from 'react';
import { inscribirParticipante } from '../api';

export const FormDeRegistro = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    email: '',
    celular: '',
    empresa: '',
    cargo: '',
    comprobante: null,
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valorProcesado = value;

    if (name === 'nombre' || name === 'apellido') {
      valorProcesado = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    } else if (name === 'documento') {
      valorProcesado = value.replace(/\D/g, '').slice(0, 8);
    } else if (name === 'celular') {
      valorProcesado = value.replace(/[^\d\s+-]/g, '').slice(0, 15);
    }

    setFormData((prev) => ({ ...prev, [name]: valorProcesado }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, comprobante: file }));
      if (errors.comprobante) {
        setErrors((prev) => ({ ...prev, comprobante: null }));
      }
    }
  };

  const handleValidation = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    }

    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es obligatorio.';
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!regexEmail.test(formData.email)) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido.';
    }

    if (!formData.documento.trim()) {
      nuevosErrores.documento = 'El documento es obligatorio.';
    } else if (formData.documento.length !== 8) {
      nuevosErrores.documento = 'El documento debe tener exactamente 8 números.';
    }

    const soloNumerosCelular = formData.celular.replace(/\D/g, '');
    if (!formData.celular.trim()) {
      nuevosErrores.celular = 'El celular es obligatorio.';
    } else if (soloNumerosCelular.length < 8 || soloNumerosCelular.length > 15) {
      nuevosErrores.celular = 'El celular debe tener entre 8 y 15 dígitos numéricos.';
    }

    if (!formData.empresa.trim()) {
      nuevosErrores.empresa = 'La empresa es obligatoria.';
    }

    if (!formData.cargo.trim()) {
      nuevosErrores.cargo = 'El cargo es obligatorio.';
    }

    if (!formData.comprobante) {
      nuevosErrores.comprobante = 'Debes adjuntar un comprobante.';
    } else {
      const tamanoMaximo = 5 * 1024 * 1024;
      if (formData.comprobante.size > tamanoMaximo) {
        nuevosErrores.comprobante = 'El archivo supera el límite de 5 MB.';
      }

      const extensionesPermitidas = ['application/pdf', 'image/jpeg', 'image/jpg'];
      const fileExt = formData.comprobante.name.split('.').pop().toLowerCase();
      if (!extensionesPermitidas.includes(formData.comprobante.type) && !['pdf', 'jpg', 'jpeg'].includes(fileExt)) {
        nuevosErrores.comprobante = 'Formato no permitido. Solo se admiten archivos PDF o JPG.';
      }
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!handleValidation()) return;

    setCargando(true);
    const data = new FormData();
    data.append('nombre', formData.nombre.trim());
    data.append('apellido', formData.apellido.trim());
    data.append('documento', formData.documento.trim());
    data.append('email', formData.email.trim());
    data.append('celular', formData.celular.trim());
    data.append('empresa', formData.empresa.trim());
    data.append('cargo', formData.cargo.trim());
    data.append('comprobante', formData.comprobante);

    try {
      await inscribirParticipante(data);
      setEnviado(true);
    } catch (err) {
      if (err.status === 409) {
        setGeneralError('Este documento ya se encuentra registrado en el evento.');
      } else if (err.status === 400 && err.detalles && err.detalles.errores) {
        setErrors((prev) => ({ ...prev, ...err.detalles.errores }));
      } else {
        setGeneralError('No se pudo conectar con el servidor o procesar la solicitud.');
      }
    } finally {
      setCargando(false);
    }
  };

  const cardStyle = isDarkMode
    ? 'bg-purple-950/40 border-purple-800 text-purple-100 shadow-2xl'
    : 'bg-white border-purple-200 text-purple-950 shadow-xl';

  const inputStyle = isDarkMode
    ? 'bg-purple-900/30 border-purple-700 text-purple-100 focus:border-purple-400 focus:ring-purple-400/20 placeholder-purple-400/50'
    : 'bg-purple-50/50 border-purple-300 text-purple-950 focus:border-purple-600 focus:ring-purple-600/20 placeholder-purple-400';

  return (
    <div className="w-full flex justify-center py-2 px-2 sm:px-4">
      <div className={`w-full max-w-xl rounded-2xl p-5 sm:p-8 border transition-colors duration-300 ${cardStyle}`}>
        <h2 className="mb-2 text-center text-2xl sm:text-3xl font-bold">
          Formulario de Inscripción
        </h2>
        <p className={`mb-6 text-center text-xs sm:text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
          Complete sus datos para registrarse en el evento
        </p>

        {generalError && (
          <div className="mb-4 p-3 rounded-xl text-sm bg-rose-950/50 border border-rose-500 text-rose-300 text-center">
            {generalError}
          </div>
        )}

        {enviado ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-base sm:text-lg font-medium text-emerald-500">
              ¡Inscripción y comprobante enviados con éxito!
            </p>
            <button
              onClick={() => {
                setEnviado(false);
                setErrors({});
                setGeneralError('');
                setFormData({
                  nombre: '',
                  apellido: '',
                  documento: '',
                  email: '',
                  celular: '',
                  empresa: '',
                  cargo: '',
                  comprobante: null,
                });
              }}
              className="mt-6 rounded-xl bg-purple-600 px-6 py-2.5 font-semibold text-white transition hover:bg-purple-700 cursor-pointer shadow-lg shadow-purple-600/30"
            >
              Realizar otra inscripción
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="nombre" className="text-sm font-semibold">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className={`rounded-lg border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 transition ${inputStyle} ${errors.nombre ? 'border-rose-500' : ''}`}
                />
                {errors.nombre && <span className="text-xs text-rose-400 font-medium">{errors.nombre}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="apellido" className="text-sm font-semibold">Apellido *</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                  className={`rounded-lg border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 transition ${inputStyle} ${errors.apellido ? 'border-rose-500' : ''}`}
                />
                {errors.apellido && <span className="text-xs text-rose-400 font-medium">{errors.apellido}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="documento" className="text-sm font-semibold">Documento (8 dígitos) *</label>
                <input
                  type="text"
                  id="documento"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  placeholder="00000000"
                  className={`rounded-lg border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 transition ${inputStyle} ${errors.documento ? 'border-rose-500' : ''}`}
                />
                {errors.documento && <span className="text-xs text-rose-400 font-medium">{errors.documento}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="celular" className="text-sm font-semibold">Celular *</label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  placeholder="5493410000000"
                  className={`rounded-lg border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 transition ${inputStyle} ${errors.celular ? 'border-rose-500' : ''}`}
                />
                {errors.celular && <span className="text-xs text-rose-400 font-medium">{errors.celular}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-semibold">Correo Electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="usuario@dominio.com"
                className={`rounded-lg border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 transition ${inputStyle} ${errors.email ? 'border-rose-500' : ''}`}
              />
              {errors.email && <span className="text-xs text-rose-400 font-medium">{errors.email}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="empresa" className="text-sm font-semibold">Empresa a la que representa *</label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder="Nombre de la entidad"
                  className={`rounded-lg border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 transition ${inputStyle} ${errors.empresa ? 'border-rose-500' : ''}`}
                />
                {errors.empresa && <span className="text-xs text-rose-400 font-medium">{errors.empresa}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="cargo" className="text-sm font-semibold">Cargo que desempeña *</label>
                <input
                  type="text"
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  placeholder="Ej. Coordinador"
                  className={`rounded-lg border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 transition ${inputStyle} ${errors.cargo ? 'border-rose-500' : ''}`}
                />
                {errors.cargo && <span className="text-xs text-rose-400 font-medium">{errors.cargo}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Comprobante de Pago (PDF o JPG, máx 5 MB) *</span>
              <label className={`flex flex-col items-center justify-center w-full min-h-[5.5rem] border-2 border-dashed rounded-xl cursor-pointer transition p-4 text-center ${
                errors.comprobante
                  ? 'border-rose-500 bg-rose-500/10'
                  : isDarkMode 
                    ? 'border-purple-700 bg-purple-900/20 hover:bg-purple-900/30' 
                    : 'border-purple-300 bg-purple-50/50 hover:bg-purple-100/50'
              }`}>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  {formData.comprobante ? formData.comprobante.name : 'Haz clic para seleccionar comprobante (.pdf o .jpg)'}
                </p>
                <input
                  type="file"
                  id="comprobante"
                  name="comprobante"
                  accept=".pdf, .jpg, .jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {errors.comprobante && <span className="text-xs text-rose-400 font-medium">{errors.comprobante}</span>}
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="mt-2 flex items-center justify-center rounded-xl bg-purple-600 py-3 font-semibold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 cursor-pointer"
            >
              {cargando ? 'Registrando...' : 'Inscribirse al Evento'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};