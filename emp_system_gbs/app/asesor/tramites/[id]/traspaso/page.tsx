'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../../CSS/Asesor/Traspaso.module.css';

export default function TraspasoPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const idTramite = params.id as string;
  const placa = searchParams.get('placa') || '';
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [cedulaActual, setCedulaActual] = useState<string>('');
  const [cargandoPropietario, setCargandoPropietario] = useState(true);
  const [nuevoPropietario, setNuevoPropietario] = useState({
    cedula: '',
    nombre: '',
    telefono: '',
    correo: ''
  });
  const [clienteEncontrado, setClienteEncontrado] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || rol !== '2') {
      router.push('/login');
      return;
    }
    
    if (!placa) {
      setError('Falta información del vehículo');
      setCargandoPropietario(false);
      return;
    }
    
    // Siempre obtener la cédula del backend
    obtenerPropietarioVehiculo();
  }, []);

  const obtenerPropietarioVehiculo = async () => {
    setCargandoPropietario(true);
    try {
      console.log('🔍 Obteniendo propietario para placa:', placa);
      const response = await fetch(`http://localhost:8080/api/vehiculos/${placa}/propietario`);
      const data = await response.json();
      console.log('📦 Respuesta completa:', data);
      
      if (response.ok && data.status === 'OK') {
        const cedula = data.cedula.toString();
        console.log('✅ Cédula del propietario actual:', cedula);
        setCedulaActual(cedula);
        setError('');
      } else {
        console.error('❌ Error:', data.mensaje);
        setError(data.mensaje || 'No se pudo obtener el propietario actual del vehículo');
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setError('Error de conexión al obtener propietario');
    } finally {
      setCargandoPropietario(false);
    }
  };

  const buscarCliente = async () => {
    if (!busquedaCliente) {
      setError('Ingrese una cédula para buscar');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/auth/perfil/${busquedaCliente}`);
      const data = await response.json();
      
      if (response.ok && data.status === 'OK') {
        setNuevoPropietario({
          cedula: data.cedula,
          nombre: `${data.nombres || ''} ${data.apellido || ''}`.trim(),
          telefono: data.telefono || 'No registrado',
          correo: data.correo || 'No registrado'
        });
        setClienteEncontrado(true);
        setError('');
      } else {
        setError(data.mensaje || 'Cliente no encontrado');
        setClienteEncontrado(false);
        setNuevoPropietario({ cedula: '', nombre: '', telefono: '', correo: '' });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
      setClienteEncontrado(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!cedulaActual) {
      setError('No se pudo identificar el propietario actual');
      setSubmitting(false);
      return;
    }

    if (!nuevoPropietario.cedula) {
      setError('Debe buscar y seleccionar un nuevo propietario');
      setSubmitting(false);
      return;
    }

    const traspasoData = {
      placa: placa,
      cedulaAnterior: parseInt(cedulaActual),
      cedulaNueva: parseInt(nuevoPropietario.cedula),
      idTramite: parseInt(idTramite)
    };

    console.log('Enviando traspaso:', traspasoData);

    try {
      const response = await fetch('http://localhost:8080/api/vehiculos/traspaso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(traspasoData)
      });

      const data = await response.json();
      console.log('Respuesta:', data);

      if (response.ok && data.status === 'OK') {
        setSuccess(`Traspaso exitoso: ${nuevoPropietario.nombre} es el nuevo propietario`);
        setTimeout(() => {
          router.push(`/asesor/tramites/${idTramite}`);
        }, 2000);
      } else {
        setError(data.mensaje || 'Error al realizar traspaso');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  if (cargandoPropietario) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Obteniendo información del vehículo...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButton}>
          ← Volver al Trámite
        </Link>
        <h1>Realizar Traspaso</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.formCard}>
        <div className={styles.infoBox}>
          <h3>Información del Trámite</h3>
          <p><strong>ID Trámite:</strong> {idTramite}</p>
          <p><strong>Vehículo:</strong> {placa}</p>
          <p><strong>Propietario Actual:</strong> Cédula {cedulaActual}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Buscar Nuevo Propietario por Cédula</label>
            <div className={styles.searchBox}>
              <input 
                type="number" 
                value={busquedaCliente} 
                onChange={(e) => setBusquedaCliente(e.target.value)}
                placeholder="Ingrese la cédula"
              />
              <button type="button" onClick={buscarCliente} className={styles.searchButton}>
                Buscar
              </button>
            </div>
          </div>

          {clienteEncontrado && (
            <div className={styles.clienteInfo}>
              <h3>Nuevo Propietario</h3>
              <div className={styles.infoGrid}>
                <div><strong>Nombre:</strong> {nuevoPropietario.nombre}</div>
                <div><strong>Cédula:</strong> {nuevoPropietario.cedula}</div>
                <div><strong>Teléfono:</strong> {nuevoPropietario.telefono}</div>
                <div><strong>Correo:</strong> {nuevoPropietario.correo}</div>
              </div>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              disabled={submitting || !clienteEncontrado} 
              className={styles.saveButton}
            >
              {submitting ? 'Procesando...' : 'Confirmar Traspaso'}
            </button>
            <Link href={`/asesor/tramites/${idTramite}`} className={styles.cancelButton}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}