'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../CSS/citas/SolicitarCita.module.css';

/* ── Icons ── */
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

interface Vehiculo {
  placa: string;
  marca: string;
  linea: string;
  prendado?: string;
}

interface TipoTramite {
  id: number;
  nombre: string;
  descripcion: string;
  valorBase: number;
  requiereVehiculo: string; // 'S', 'N' o 'M'
}

export default function SolicitarCitaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [tiposTramite, setTiposTramite] = useState<TipoTramite[]>([]);
  const [valorTramite, setValorTramite] = useState<number | null>(null);
  const [requiereVehiculo, setRequiereVehiculo] = useState<boolean>(false);
  const [tipoDropdownOpen, setTipoDropdownOpen] = useState(false);
  const tipoDropdownRef = useRef<HTMLDivElement>(null);

  const [tipoTramiteSeleccionado, setTipoTramiteSeleccionado] = useState<string>('');

    const [esDuenioRegistrado, setEsDuenioRegistrado] = useState<boolean>(true);

    const [duenioActual, setDuenioActual] = useState({
      cedula: '',
      nombres: '',
      apellido: ''
    });
  
  const [formData, setFormData] = useState({
    idVehiculo: '',
    idTipoTramite: ''
  });

  const idCliente = typeof window !== 'undefined' ? sessionStorage.getItem('userCedula') : null;

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn || !idCliente) {
      router.push('/login');
      return;
    }
    cargarVehiculos();
    cargarTiposTramite();
  }, []);

  useEffect(() => {
  const cerrarDropdown = (e: MouseEvent) => {
    if (
      tipoDropdownRef.current &&
      !tipoDropdownRef.current.contains(e.target as Node)
    ) {
      setTipoDropdownOpen(false);
    }
  };

  document.addEventListener('mousedown', cerrarDropdown);

  return () => {
    document.removeEventListener('mousedown', cerrarDropdown);
  };
}, []);

  const cargarVehiculos = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/vehiculos/cliente/${idCliente}`);
      const data = await response.json();
      if (data.status === 'OK' && data.vehiculos) {
        setVehiculos(data.vehiculos);
      }
    } catch (error) {
      console.error('Error cargando vehículos:', error);
    }
  };

  const cargarTiposTramite = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tipo-tramite/list');
      const data = await response.json();
      if (data.status === 'OK' && data.tiposTramite) {
        setTiposTramite(data.tiposTramite);
      }
    } catch (error) {
      console.error('Error cargando tipos de trámite:', error);
    } finally {
      setLoading(false);
    }
  };

const seleccionarTipoTramite = (tipo: TipoTramite) => {
  const idTipo = tipo.id.toString();

  setFormData(prev => ({
    ...prev,
    idTipoTramite: idTipo,
    idVehiculo: ''
  }));

  setValorTramite(tipo.valorBase);
  setTipoTramiteSeleccionado(tipo.nombre);
setRequiereVehiculo(
  tipo.requiereVehiculo === 'S' && tipo.nombre !== 'Traspaso'
);
  setEsDuenioRegistrado(true);
  setDuenioActual({
    cedula: '',
    nombres: '',
    apellido: ''
  });

  setTipoDropdownOpen(false);
  setError('');
};

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!formData.idTipoTramite) {
      setError('Seleccione un tipo de trámite');
      setSubmitting(false);
      return;
    }

if (requiereVehiculo && !formData.idVehiculo) {
  const tipoActual = tiposTramite.find(
    t => t.id.toString() === formData.idTipoTramite
  );

  const esLevantarPrendaSubmit =
    tipoActual?.nombre.toLowerCase().includes('levantar') &&
    tipoActual?.nombre.toLowerCase().includes('prenda');

  setError(
    esLevantarPrendaSubmit
      ? 'No puedes solicitar levantamiento de prenda porque no seleccionaste un vehículo prendado'
      : 'Este trámite requiere seleccionar un vehículo'
  );

  setSubmitting(false);
  return;
}

if (tipoTramiteSeleccionado === 'Traspaso' && esDuenioRegistrado && !formData.idVehiculo) {
  setError('Debe seleccionar el vehículo para realizar el traspaso');
  setSubmitting(false);
  return;
}

if (tipoTramiteSeleccionado === 'Traspaso' && !esDuenioRegistrado) {
  if (!duenioActual.cedula) {
    setError('La cédula del dueño actual es requerida');
    setSubmitting(false);
    return;
  }

  if (!duenioActual.nombres) {
    setError('Los nombres del dueño actual son requeridos');
    setSubmitting(false);
    return;
  }

  if (!duenioActual.apellido) {
    setError('Los apellidos del dueño actual son requeridos');
    setSubmitting(false);
    return;
  }
}

const citaData: any = {
  idCliente: parseInt(idCliente!),
  idVehiculo: formData.idVehiculo || null,
  idTipoTramite: parseInt(formData.idTipoTramite),

  esDuenioRegistrado:
    tipoTramiteSeleccionado === 'Traspaso'
      ? esDuenioRegistrado ? 'S' : 'N'
      : null,

  cedulaDuenioActual:
    tipoTramiteSeleccionado === 'Traspaso' && !esDuenioRegistrado
      ? parseInt(duenioActual.cedula)
      : null,

  nombreDuenioActual:
    tipoTramiteSeleccionado === 'Traspaso' && !esDuenioRegistrado
      ? duenioActual.nombres
      : null,

  apellidoDuenioActual:
    tipoTramiteSeleccionado === 'Traspaso' && !esDuenioRegistrado
      ? duenioActual.apellido
      : null
};

    try {
      const response = await fetch('http://localhost:8080/api/citas/solicitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citaData),
      });

      const data = await response.json();

      if (response.ok && data.status === 'OK') {
        setSuccess('¡Cita solicitada exitosamente! Redirigiendo...');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(data.mensaje || 'Error al solicitar cita');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegistrarVehiculo = () => router.push('/vehiculos');
const tipoSeleccionado = tiposTramite.find(
  tipo => tipo.id.toString() === formData.idTipoTramite
);

const nombreTramite = tipoSeleccionado?.nombre
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '') || '';

const esLevantarPrenda =
  nombreTramite.includes('levantar') &&
  nombreTramite.includes('prenda');

const vehiculosDisponibles = esLevantarPrenda
  ? vehiculos.filter(v => v.prendado === 'S')
  : vehiculos;

const esCancelacionMatricula =
  nombreTramite.includes('cancel') &&
  nombreTramite.includes('matricula');

const vehiculoSeleccionado = vehiculos.find(
  v => v.placa === formData.idVehiculo
);

const mostrarAdvertenciaPrenda =
  esCancelacionMatricula && vehiculoSeleccionado?.prendado === 'S';

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.logoMark}><CarIcon /></span>
            <span className={styles.logoText}>Trans<strong>Meta</strong></span>
          </div>
          <Link href="/dashboard" className={styles.backButton}>
            <ArrowLeftIcon />
            Volver al Dashboard
          </Link>
        </div>

        {/* ── Page title ── */}
        <div className={styles.pageTitleRow}>
          <div className={styles.pageIcon}><CalendarIcon /></div>
          <div>
            <h1 className={styles.pageTitle}>Solicitar Cita</h1>
            <p className={styles.pageSub}>Elige el trámite y el vehículo para agendar tu cita</p>
          </div>
        </div>

        {/* ── Alerts ── */}
        {error   && <div className={styles.errorAlert}>{error}</div>}
        {success && <div className={styles.successAlert}>{success}</div>}

        {/* ── Form card ── */}
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>

            {/* Tipo de trámite */}
            <div className={styles.formGroup}>
              <label>Tipo de Trámite *</label>
                <div className={styles.customSelect} ref={tipoDropdownRef}>
  <button
    type="button"
    className={styles.customSelectButton}
    onClick={() => setTipoDropdownOpen(prev => !prev)}
  >
    <span>
      {tipoSeleccionado
        ? `${tipoSeleccionado.nombre} — $${tipoSeleccionado.valorBase.toLocaleString()}`
        : 'Seleccione un trámite'}
    </span>

    <span className={`${styles.selectArrow} ${tipoDropdownOpen ? styles.selectArrowOpen : ''}`}>
      ▼
    </span>
  </button>

  {tipoDropdownOpen && (
    <div className={styles.customSelectMenu}>
      {tiposTramite.map((tipo) => (
        <button
          key={tipo.id}
          type="button"
          className={styles.customSelectOption}
          onClick={() => seleccionarTipoTramite(tipo)}
        >
          <span>
          {tipo.nombre}
          {tipo.requiereVehiculo === 'S' && ' 🚗'}
        </span>
        <strong>${tipo.valorBase.toLocaleString()}</strong>
        </button>
      ))}
    </div>
  )}
</div>
              {valorTramite && (
                <div className={styles.valorAviso}>
                  <p> Valor base: ${valorTramite.toLocaleString()}</p>
                  <small> El valor puede variar según conceptos adicionales</small>
                </div>
              )}
            </div>

            {/* Vehículo — solo si aplica */}

            {/* Vehículo — solo si aplica */}
            {/* Vehículo — solo si aplica */}
            {requiereVehiculo && (
              <div className={styles.formGroup}>
                <div className={styles.vehiculoHeader}>
                  <label>Vehículo *</label>

                  {vehiculosDisponibles.length === 0 && (
                    <button
                      type="button"
                      onClick={handleRegistrarVehiculo}
                      className={styles.registrarVehiculoBtn}
                    >
                      Regístralo aquí
                    </button>
                  )}
                </div>

                <select
                  name="idVehiculo"
                  value={formData.idVehiculo}
                  onChange={handleChange}
                  required={requiereVehiculo}
                >
                  <option value="">Seleccione un vehículo</option>

                  {vehiculosDisponibles.length === 0 ? (
                    <option value="" disabled>
                      {esLevantarPrenda
                        ? 'No tienes vehículos prendados'
                        : 'No tiene vehículos registrados'}
                    </option>
                  ) : (
                    vehiculosDisponibles.map((vehiculo) => (
                      <option key={vehiculo.placa} value={vehiculo.placa}>
                        {vehiculo.placa} — {vehiculo.marca} {vehiculo.linea}
                        {vehiculo.prendado === 'S' ? ' — Prendado' : ''}
                      </option>
                    ))
                  )}
                </select>

                {mostrarAdvertenciaPrenda && (
                  <small className={styles.warningText}>
                    Este vehículo tiene prenda activa. Puedes solicitar la cita, pero primero debe completarse el levantamiento de prenda antes de cancelar la matrícula.
                  </small>
                )}

                {vehiculosDisponibles.length === 0 ? (
                  <small className={styles.warningText}>
                    {esLevantarPrenda
                      ? 'No tienes vehículos prendados. Si no aparece, '
                      : 'Este trámite requiere un vehículo. '}
                    <button
                      type="button"
                      onClick={handleRegistrarVehiculo}
                      className={styles.warningLink}
                    >
                      Regístralo aquí
                    </button>
                  </small>
                ) : (
                  <small className={styles.infoText}>
                    {esLevantarPrenda
                      ? 'Solo aparecen vehículos con prenda activa. ¿No encuentras tu vehículo? '
                      : '¿No encuentras tu vehículo? '}
                    <button
                      type="button"
                      onClick={handleRegistrarVehiculo}
                      className={styles.infoLink}
                    >
                      Regístralo aquí
                    </button>
                  </small>
                )}
              </div>
            )}

            {/* Campos específicos para Traspaso */}
{tipoTramiteSeleccionado === 'Traspaso' && (
  <>
    <div className={styles.formGroup}>
      <label>¿Es usted el dueño actual del vehículo?</label>

      <div className={styles.toggleGroup}>
        <button
          type="button"
          className={`${styles.toggleBtn} ${esDuenioRegistrado ? styles.toggleActive : ''}`}
          onClick={() => {
            setEsDuenioRegistrado(true);
            setFormData(prev => ({ ...prev, idVehiculo: '' }));
          }}
        >
          Sí, soy el dueño
        </button>

        <button
          type="button"
          className={`${styles.toggleBtn} ${!esDuenioRegistrado ? styles.toggleActive : ''}`}
          onClick={() => {
            setEsDuenioRegistrado(false);
            setFormData(prev => ({ ...prev, idVehiculo: '' }));
          }}
        >
          No, el dueño es otra persona
        </button>
      </div>
    </div>

    {esDuenioRegistrado && (
      <div className={styles.formGroup}>
        <label>Seleccione su vehículo *</label>

        <select
          name="idVehiculo"
          value={formData.idVehiculo}
          onChange={handleChange}
          required={esDuenioRegistrado}
        >
          <option value="">Seleccione un vehículo</option>

          {vehiculos.length === 0 ? (
            <option value="" disabled>No tiene vehículos registrados</option>
          ) : (
            vehiculos.map((vehiculo) => (
              <option key={vehiculo.placa} value={vehiculo.placa}>
                {vehiculo.placa} — {vehiculo.marca} {vehiculo.linea}
              </option>
            ))
          )}
        </select>

        {vehiculos.length === 0 && (
          <small className={styles.warningText}>
            No tiene vehículos registrados. Debe registrar un vehículo primero.
          </small>
        )}
      </div>
    )}

    {!esDuenioRegistrado && (
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Cédula del dueño actual *</label>
          <input
            type="text"
            value={duenioActual.cedula}
            onChange={(e) =>
              setDuenioActual(prev => ({
                ...prev,
                cedula: e.target.value
              }))
            }
            placeholder="Número de cédula"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Nombres del dueño actual *</label>
          <input
            type="text"
            value={duenioActual.nombres}
            onChange={(e) =>
              setDuenioActual(prev => ({
                ...prev,
                nombres: e.target.value
              }))
            }
            placeholder="Nombres completos"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Apellidos del dueño actual *</label>
          <input
            type="text"
            value={duenioActual.apellido}
            onChange={(e) =>
              setDuenioActual(prev => ({
                ...prev,
                apellido: e.target.value
              }))
            }
            placeholder="Apellidos completos"
            required
          />
        </div>
      </div>
    )}
  </>
)}


            <button type="submit" disabled={submitting} className={styles.submitButton}>
              {submitting ? 'Enviando...' : 'Solicitar Cita'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}