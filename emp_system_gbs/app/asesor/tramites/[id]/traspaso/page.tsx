'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RegistrarClienteForm from '../../../../components/RegistrarClienteForm';
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
  const [mostrarFormularioRegistro, setMostrarFormularioRegistro] = useState(false);
  const [nuevoPropietario, setNuevoPropietario] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: ''
  });
  const [clienteEncontrado, setClienteEncontrado] = useState(false);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || rol !== '2') {
      router.push('/login');
      return;
    }
    
    // Si el dueño actual NO está registrado (caso Alberto), mostrar formulario de vehículo
    if (esDuenioRegistrado === 'N') {
      setMostrarFormularioVehiculo(true);
    }
  }, []);

  const buscarCliente = async () => {
    if (!busquedaCliente) {
      setError('Ingrese una cédula para buscar');
      return;
    }

    setCargandoBusqueda(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/auth/perfil/${busquedaCliente}`);
      const data = await response.json();
      
      if (response.ok && data.status === 'OK') {
        setNuevoPropietario({
          cedula: data.cedula,
          nombre: data.nombres || '',
          apellido: data.apellido || '',
          telefono: data.telefono || 'No registrado',
          correo: data.correo || 'No registrado'
        });
        setClienteEncontrado(true);
        setMostrarFormularioRegistro(false);
        setError('');
      } else {
        setMostrarFormularioRegistro(true);
        setClienteEncontrado(false);
        setError('');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setCargandoBusqueda(false);
    }
  };

  const handleRegistroExitoso = (cliente: { cedula: number; nombres: string; apellido: string; telefono: string; correo: string }) => {
    setNuevoPropietario({
      cedula: cliente.cedula.toString(),
      nombre: cliente.nombres,
      apellido: cliente.apellido,
      telefono: cliente.telefono,
      correo: cliente.correo
    });
    setClienteEncontrado(true);
    setMostrarFormularioRegistro(false);
    setSuccess('Cliente registrado exitosamente');
    setTimeout(() => setSuccess(''), 2000);
  };

  const realizarTraspaso = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/api/vehiculos/traspaso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placa: placaParam,
          cedulaAnterior: parseInt(cedulaActual),
          cedulaNueva: parseInt(nuevoPropietario.cedula),
          idTramite: parseInt(idTramite),
          esDuenioRegistrado: esDuenioRegistrado
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'OK') {
        setSuccess(`✅ Traspaso exitoso! Vehículo transferido a ${nuevoPropietario.nombre} ${nuevoPropietario.apellido}`);
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

  const getTextoPropietarioActual = () => {
    if (esDuenioRegistrado === 'S') {
      return `Cédula: ${cedulaActual} (Cliente registrado)`;
    } else {
      return `${nombreDuenioActual} ${apellidoDuenioActual} - Cédula: ${cedulaActual} (No registrado en el sistema)`;
    }
  };

  if (cargandoBusqueda) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Buscando cliente...</p>
      </div>
    );
  }

  // 👇 Caso 1: Dueño actual NO está registrado (Alberto) - Mostrar SOLO formulario de vehículo
  // 👇 Caso 1: Dueño actual NO está registrado (Alberto) - Mostrar SOLO formulario de vehículo
if (mostrarFormularioVehiculo) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButton}>
          ← Volver al Trámite
        </Link>
        <h1>Registrar Vehículo</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.formCard}>
        <div className={styles.infoBox}>
          <h3>Información del Trámite</h3>
          <p><strong>ID Trámite:</strong> {idTramite}</p>
          <p><strong>Propietario Actual (Alberto):</strong> {getTextoPropietarioActual()}</p>
          <p><strong>Nuevo Propietario (Patroclo):</strong> Cédula {cedulaClienteSolicitante}</p>
        </div>

        {/* Usar el componente RegistrarVehiculoForm */}
        <RegistrarVehiculoForm 
          idCliente={parseInt(cedulaClienteSolicitante)}
          onSuccess={async (placa) => {
            setSubmitting(true);
            try {
              // 1. Registrar el vehículo (ya lo hizo RegistrarVehiculoForm)
              
              // 2. Registrar en HISTORIAL_PROPIETARIOS
              const historialResponse = await fetch('http://localhost:8080/api/vehiculos/historial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  placa: placa,
                  cedulaAnterior: parseInt(cedulaActual),  // Alberto
                  cedulaNueva: parseInt(cedulaClienteSolicitante),  // Patroclo
                  idTramite: parseInt(idTramite)
                }),
              });

              const historialData = await historialResponse.json();

              if (historialResponse.ok && historialData.status === 'OK') {
                setSuccess(`✅ Vehículo ${placa} registrado exitosamente a nombre de Patroclo`);
                setTimeout(() => {
                  router.push(`/asesor/tramites/${idTramite}`);
                }, 2000);
              } else {
                setError(historialData.mensaje || 'Error al registrar historial');
              }
            } catch (err) {
              console.error('Error:', err);
              setError('Error de conexión con el servidor');
            } finally {
              setSubmitting(false);
            }
          }}
          onCancel={() => router.push(`/asesor/tramites/${idTramite}`)}
          buttonText="Registrar Vehículo"
        />
      </div>
    </div>
  );
}
  // 👇 Caso 2: Dueño actual SÍ está registrado (Patroclo) - Buscar nuevo propietario
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
        </div>

        <div className={styles.searchSection}>
          <div className={styles.formGroup}>
            <label>Cédula del Nuevo Propietario</label>
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
        </div>

        {mostrarFormularioRegistro && (
          <div className={styles.registroSection}>
            <h3>Registrar Nuevo Propietario</h3>
            <RegistrarClienteForm 
              cedulaInicial={busquedaCliente}
              onSuccess={handleRegistroExitoso}
              onCancel={() => {
                setMostrarFormularioRegistro(false);
                setBusquedaCliente('');
              }}
              buttonText="Registrar Nuevo Propietario"
            />
          </div>
        )}

        {clienteEncontrado && (
          <>
            <div className={styles.clienteInfo}>
              <h3>Nuevo Propietario</h3>
              <div className={styles.infoGrid}>
                <div><strong>Nombre:</strong> {nuevoPropietario.nombre} {nuevoPropietario.apellido}</div>
                <div><strong>Cédula:</strong> {nuevoPropietario.cedula}</div>
                <div><strong>Teléfono:</strong> {nuevoPropietario.telefono}</div>
                <div><strong>Correo:</strong> {nuevoPropietario.correo}</div>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button 
                onClick={realizarTraspaso}
                disabled={submitting} 
                className={styles.saveButton}
              >
                {submitting ? 'Procesando...' : 'Confirmar Traspaso'}
              </button>
              <Link href={`/asesor/tramites/${idTramite}`} className={styles.cancelButton}>
                Cancelar
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}