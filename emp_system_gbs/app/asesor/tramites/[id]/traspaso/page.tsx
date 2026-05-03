'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RegistrarVehiculoForm from '../../../../components/RegistrarVehiculoForm';
import styles from '../../../../CSS/Asesor/Traspaso.module.css';

export default function TraspasoPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const idTramite = params.id as string;
  const placaParam = searchParams.get('placa') || '';
  const cedulaActual = searchParams.get('cedulaActual') || '';
  const esDuenioRegistrado = searchParams.get('esDuenioRegistrado') || 'S';
  const nombreDuenioActual = searchParams.get('nombreDuenioActual') || '';
  const apellidoDuenioActual = searchParams.get('apellidoDuenioActual') || '';
  const cedulaClienteSolicitante = searchParams.get('idCliente') || '';
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [mostrarFormularioVehiculo, setMostrarFormularioVehiculo] = useState(false);
  const [nuevoPropietario, setNuevoPropietario] = useState({
    cedula: '',
    nombre: '',
    telefono: '',
    correo: ''
  });
  const [clienteEncontrado, setClienteEncontrado] = useState(false);
  const [cargandoAutoBusqueda, setCargandoAutoBusqueda] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || rol !== '2') {
      router.push('/login');
      return;
    }
    
    if (esDuenioRegistrado === 'N') {
      setMostrarFormularioVehiculo(true);
    }
    
    if (cedulaClienteSolicitante) {
      setBusquedaCliente(cedulaClienteSolicitante);
      buscarClienteAutomaticamente(cedulaClienteSolicitante);
    }
  }, []);

  const buscarClienteAutomaticamente = async (cedula: string) => {
    setCargandoAutoBusqueda(true);
    try {
      const response = await fetch(`http://localhost:8080/api/auth/perfil/${cedula}`);
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
        setError(data.mensaje || 'Cliente solicitante no encontrado');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al buscar el cliente solicitante');
    } finally {
      setCargandoAutoBusqueda(false);
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

  const realizarRegistroYHistorial = async (placa: string) => {
  setSubmitting(true);
  
  try {
    // Registrar historial (cedulaAnterior puede ser null)
    const historialResponse = await fetch('http://localhost:8080/api/vehiculos/historial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placa: placa,
        cedulaAnterior: cedulaActual ? parseInt(cedulaActual) : null,
        cedulaNueva: parseInt(nuevoPropietario.cedula),
        idTramite: parseInt(idTramite)
      }),
    });

    const historialData = await historialResponse.json();

    if (historialResponse.ok && historialData.status === 'OK') {
      setSuccess(`✅ Vehículo ${placa} registrado exitosamente a nombre de ${nuevoPropietario.nombre}`);
      setTimeout(() => {
        router.push(`/asesor/tramites/${idTramite}`);
      }, 2000);
    } else {
      setError(historialData.mensaje || 'Error al registrar historial');
    }
  } catch (err) {
    setError('Error de conexión con el servidor');
  } finally {
    setSubmitting(false);
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

    if (parseInt(cedulaActual) === parseInt(nuevoPropietario.cedula)) {
      setError('❌ El nuevo propietario debe ser diferente al propietario actual');
      setSubmitting(false);
      return;
    }

    const traspasoData = {
      placa: placaParam,
      cedulaAnterior: parseInt(cedulaActual),
      cedulaNueva: parseInt(nuevoPropietario.cedula),
      idTramite: parseInt(idTramite),
      esDuenioRegistrado: esDuenioRegistrado
    };

    try {
      const response = await fetch('http://localhost:8080/api/vehiculos/traspaso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(traspasoData)
      });

      const data = await response.json();

      if (response.ok && data.status === 'OK') {
        setSuccess(`Traspaso exitoso: ${nuevoPropietario.nombre} es el nuevo propietario`);
        setTimeout(() => {
          router.push(`/asesor/tramites/${idTramite}`);
        }, 2000);
      } else {
        setError(data.mensaje || 'Error al realizar traspaso');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const getTextoPropietarioActual = () => {
    if (esDuenioRegistrado === 'S') {
      return `Cédula: ${cedulaActual} (Cliente registrado)`;
    } else {
      return `${nombreDuenioActual} ${apellidoDuenioActual} - Cédula: ${cedulaActual} (No registrado en el sistema)`;
    }
  };

  if (cargandoAutoBusqueda) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando información...</p>
      </div>
    );
  }

  // 👇 USANDO EL COMPONENTE RegistrarVehiculoForm
  if (mostrarFormularioVehiculo) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButton}>
            ← Volver al Trámite
          </Link>
          <h1>Registrar Vehículo y Realizar Traspaso</h1>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}
        {success && <div className={styles.successAlert}>{success}</div>}

        <div className={styles.formCard}>
          <div className={styles.infoBox}>
            <h3>Información del Trámite</h3>
            <p><strong>ID Trámite:</strong> {idTramite}</p>
            <p><strong>Propietario Actual:</strong> {getTextoPropietarioActual()}</p>
            <p><strong>Nuevo Propietario:</strong> {nuevoPropietario.nombre || 'Cargando...'}</p>
          </div>

          {/* 👇 COMPONENTE RegistrarVehiculoForm */}
          {/* 👇 COMPONENTE RegistrarVehiculoForm */}
          <RegistrarVehiculoForm 
            idCliente={parseInt(nuevoPropietario.cedula || cedulaClienteSolicitante)}
            onSuccess={(placa) => realizarRegistroYHistorial(placa)}
            onCancel={() => router.push(`/asesor/tramites/${idTramite}`)}
            buttonText="Registrar Vehículo"
          />
        </div>
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
          <p><strong>Vehículo:</strong> {placaParam || 'No especificado'}</p>
          <p><strong>Propietario Actual:</strong> {getTextoPropietarioActual()}</p>
          {cedulaClienteSolicitante && (
            <p className={styles.suggestionText}>
              ✨ Nuevo propietario sugerido: Cédula {cedulaClienteSolicitante}
            </p>
          )}
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
              {cedulaClienteSolicitante === nuevoPropietario.cedula && (
                <div className={styles.matchBadge}>
                  ✅ Coincide con el cliente que solicitó el trámite
                </div>
              )}
              {cedulaActual && parseInt(cedulaActual) === parseInt(nuevoPropietario.cedula) && (
                <div className={styles.warningBadge}>
                  ⚠️ Este cliente ya es el propietario actual del vehículo
                </div>
              )}
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