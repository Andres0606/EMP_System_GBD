'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../CSS/Citas/SolicitarCita.module.css';

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
  requiereVehiculo: string; // 'S', 'N', o 'M' (Mixto)
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
  const [tipoTramiteSeleccionado, setTipoTramiteSeleccionado] = useState<string>('');
  
  // 👇 Estados para traspaso
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

  const handleTipoTramiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idTipo = e.target.value;
    setFormData(prev => ({ ...prev, idTipoTramite: idTipo, idVehiculo: '' }));
    
    if (idTipo) {
      const tipoSeleccionado = tiposTramite.find(t => t.id.toString() === idTipo);
      if (tipoSeleccionado) {
        setValorTramite(tipoSeleccionado.valorBase);
        setTipoTramiteSeleccionado(tipoSeleccionado.nombre);
        
        if (tipoSeleccionado.requiereVehiculo === 'S') {
          setRequiereVehiculo(true);
        } else {
          setRequiereVehiculo(false);
        }
      }
    } else {
      setValorTramite(null);
      setRequiereVehiculo(false);
      setTipoTramiteSeleccionado('');
    }
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

    // 👇 Validar datos del dueño para traspaso cuando NO es dueño
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
      esDuenioRegistrado: tipoTramiteSeleccionado === 'Traspaso' ? (esDuenioRegistrado ? 'S' : 'N') : null,
      cedulaDuenioActual: tipoTramiteSeleccionado === 'Traspaso' && !esDuenioRegistrado ? parseInt(duenioActual.cedula) : null,
      nombreDuenioActual: tipoTramiteSeleccionado === 'Traspaso' && !esDuenioRegistrado ? duenioActual.nombres : null,
      apellidoDuenioActual: tipoTramiteSeleccionado === 'Traspaso' && !esDuenioRegistrado ? duenioActual.apellido : null,
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
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
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

  // Lógica de filtrado de vehículos para Levantar Prenda y Cancelación Matrícula
  const tipoSeleccionado = tiposTramite.find(
    t => t.id.toString() === formData.idTipoTramite
  );

  const esLevantarPrenda =
    tipoSeleccionado?.nombre.toLowerCase().includes('levantar') &&
    tipoSeleccionado?.nombre.toLowerCase().includes('prenda');

  const vehiculosDisponibles = esLevantarPrenda
    ? vehiculos.filter(v => v.prendado === 'S')
    : vehiculos;

  const nombreTramite = tipoSeleccionado?.nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') || '';

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
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Volver al Dashboard
        </Link>
        <h1>Solicitar Cita</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Tipo de Trámite *</label>
            <select 
              name="idTipoTramite" 
              value={formData.idTipoTramite} 
              onChange={handleTipoTramiteChange}
              required
            >
              <option value="">Seleccione un trámite</option>
              {tiposTramite.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre} - ${tipo.valorBase.toLocaleString()}
                  {tipo.requiereVehiculo === 'S' && ' 🚗'}
                </option>
              ))}
            </select>
            {valorTramite && (
              <div className={styles.valorAviso}>
                <p>💰 Valor base: ${valorTramite.toLocaleString()}</p>
                <small>⚠️ El valor puede variar según conceptos adicionales</small>
              </div>
            )}
          </div>

          {/* Campo de vehículo - solo se muestra si el trámite lo requiere */}
          {requiereVehiculo && (
            <div className={styles.formGroup}>
              <div className={styles.vehiculoHeader}>
                <label>Vehículo *</label>
                {vehiculosDisponibles.length === 0 && (
                  <Link href="/vehiculos" className={styles.registrarVehiculoBtn}>
                    Regístralo aquí
                  </Link>
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
                      {vehiculo.placa} - {vehiculo.marca} {vehiculo.linea}
                      {vehiculo.prendado === 'S' ? ' - Prendado' : ''}
                    </option>
                  ))
                )}
              </select>

              {mostrarAdvertenciaPrenda && (
                <small className={styles.warningText}>
                  ⚠️ Este vehículo tiene prenda activa. Puedes solicitar la cita, pero primero debe completarse el levantamiento de prenda antes de cancelar la matrícula.
                </small>
              )}

              {vehiculosDisponibles.length === 0 ? (
                <small className={styles.warningText}>
                  {esLevantarPrenda
                    ? '⚠️ No tienes vehículos prendados. Si no aparece, '
                    : '⚠️ Este trámite requiere un vehículo. '}
                  <Link href="/vehiculos" className={styles.warningLink}>
                    Regístralo aquí
                  </Link>
                </small>
              ) : (
                <small className={styles.infoText}>
                  {esLevantarPrenda
                    ? 'Solo aparecen vehículos con prenda activa. ¿No encuentras tu vehículo? '
                    : '¿No encuentras tu vehículo? '}
                  <Link href="/vehiculos" className={styles.infoLink}>
                    Regístralo aquí
                  </Link>
                </small>
              )}
            </div>
          )}

          {/* 👇 Campos específicos para Traspaso (M - Mixto) */}
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

              {/* Si es dueño, mostrar selector de vehículos */}
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
                          {vehiculo.placa} - {vehiculo.marca} {vehiculo.linea}
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

              {/* Si no es dueño, mostrar campos para ingresar datos del dueño actual */}
              {!esDuenioRegistrado && (
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Cédula del dueño actual *</label>
                    <input
                      type="text"
                      value={duenioActual.cedula}
                      onChange={(e) => setDuenioActual(prev => ({ ...prev, cedula: e.target.value }))}
                      placeholder="Número de cédula"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nombres del dueño actual *</label>
                    <input
                      type="text"
                      value={duenioActual.nombres}
                      onChange={(e) => setDuenioActual(prev => ({ ...prev, nombres: e.target.value }))}
                      placeholder="Nombres completos"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Apellidos del dueño actual *</label>
                    <input
                      type="text"
                      value={duenioActual.apellido}
                      onChange={(e) => setDuenioActual(prev => ({ ...prev, apellido: e.target.value }))}
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
  );
}