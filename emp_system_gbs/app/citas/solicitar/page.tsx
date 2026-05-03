'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../CSS/Citas/SolicitarCita.module.css';

interface Vehiculo {
  placa: string;
  marca: string;
  linea: string;
}

interface TipoTramite {
  id: number;
  nombre: string;
  descripcion: string;
  valorBase: number;
  requiereVehiculo: string; // 'S' o 'N'
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
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  
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
        setRequiereVehiculo(tipoSeleccionado.requiereVehiculo === 'S');
      }
    } else {
      setValorTramite(null);
      setRequiereVehiculo(false);
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
      setError('Este trámite requiere seleccionar un vehículo');
      setSubmitting(false);
      return;
    }

    const citaData = {
      idCliente: parseInt(idCliente!),
      idVehiculo: formData.idVehiculo || null,
      idTipoTramite: parseInt(formData.idTipoTramite)
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

  // Redirigir a la página de registro de vehículo
  const handleRegistrarVehiculo = () => {
    router.push('/vehiculos');
  };

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
                {vehiculos.length === 0 && (
                  <button
                    type="button"
                    onClick={handleRegistrarVehiculo}
                    className={styles.registrarVehiculoBtn}
                  >
                    + Registrar Vehículo
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
              {vehiculos.length === 0 ? (
                <small className={styles.warningText}>
                  ⚠️ Este trámite requiere un vehículo. 
                  <button 
                    type="button"
                    onClick={handleRegistrarVehiculo}
                    className={styles.warningLink}
                  >
                    Regístrelo aquí
                  </button>
                </small>
              ) : (
                <small className={styles.infoText}>
                  ¿No encuentras tu vehículo? 
                  <button 
                    type="button"
                    onClick={handleRegistrarVehiculo}
                    className={styles.infoLink}
                  >
                    Regístrate otro aquí
                  </button>
                </small>
              )}
            </div>
          )}

          <button type="submit" disabled={submitting} className={styles.submitButton}>
            {submitting ? 'Enviando...' : 'Solicitar Cita'}
          </button>
        </form>
      </div>
    </div>
  );
}