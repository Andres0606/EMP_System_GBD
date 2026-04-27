'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../CSS/Asesor/TramiteDetalle.module.css';

interface TramiteDetalle {
  idTramite: number;
  idCita: number;
  idCliente?: number;  // 👈 Cambia de cedulaCliente a idCliente
  cliente: string;
  telefono: string;
  correo: string;
  vehiculo: string;
  tipoTramite: string;
  valorTramite: number;
  valorOtrosConceptos: number;
  estadoTramite: string;
  fechaCreacion: string;
  fechaCita: string;
}

export default function TramiteDetallePage() {
  const router = useRouter();
  const params = useParams();
  const idTramite = params.id as string;
  
  const [tramite, setTramite] = useState<TramiteDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(false);
  const [estado, setEstado] = useState('');

  const cedulaAsesor = typeof window !== 'undefined' ? sessionStorage.getItem('userCedula') : null;

  const [puedeEditar, setPuedeEditar] = useState(false);
  const [camposAEditar, setCamposAEditar] = useState<string[]>([]);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || !cedulaAsesor || rol !== '2') {
      router.push('/login');
      return;
    }
    
    cargarDetalle();
  }, []);

const cargarDetalle = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/tramite/asesor/${cedulaAsesor}`);
    const data = await response.json();
    
    if (data.status === 'OK' && data.tramites) {
      const encontrado = data.tramites.find((t: any) => t.idTramite === parseInt(idTramite));
      
      // 👈 LOG CORRECTO - usa 'encontrado', no 'tramite'
      console.log('Trámite encontrado COMPLETO:', encontrado);
      console.log('Campos del trámite:', Object.keys(encontrado || {}));
       console.log('idCliente:', encontrado?.idCliente); // 👈 Verificar que idCliente esté presente
      
      setTramite(encontrado);
      setEstado(encontrado?.estadoTramite || 'Activo');
      console.log('Tipo de trámite recibido:', encontrado?.tipoTramite);
      
      determinarCamposEdicion(encontrado?.tipoTramite);
    }
  } catch (error) {
    console.error('Error:', error);
    setError('Error al cargar el trámite');
  } finally {
    setLoading(false);
  }
};

const determinarCamposEdicion = (tipoTramite: string) => {
  switch(tipoTramite) {
    case 'Matrícula/Registro':
      setCamposAEditar(['registrarVehiculo']);  // 👈 Nuevo caso
      setPuedeEditar(true);
      break;
    case 'Cambio de Color':
      setCamposAEditar(['color']);
      setPuedeEditar(true);
      break;
    case 'Cambio de Servicio':
      setCamposAEditar(['tipoServicio']);
      setPuedeEditar(true);
      break;
    case 'Regrabar Motor':
      setCamposAEditar(['numMotor']);
      setPuedeEditar(true);
      break;
    case 'Regrabar Chasis':
      setCamposAEditar(['numChasis']);
      setPuedeEditar(true);
      break;
    case 'Cambio de Placas':
      setCamposAEditar(['placa']);
      setPuedeEditar(true);
      break;
    case 'Traspaso':
      setCamposAEditar(['propietario']);
      setPuedeEditar(true);
      break;
    case 'Cambio de Carrocería':
      setCamposAEditar(['clase']);
      setPuedeEditar(true);
      break;
    default:
      setPuedeEditar(false);
  }
};
  const handleActualizarEstado = async (nuevoEstado: string) => {
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/api/tramite/estado', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idTramite: parseInt(idTramite),
          estado: nuevoEstado
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'OK') {
        setEstado(nuevoEstado);
        setTramite(prev => prev ? { ...prev, estadoTramite: nuevoEstado } : null);
        setSuccess('Estado actualizado exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.mensaje || 'Error al actualizar estado');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando...</p>
      </div>
    );
  }

  if (!tramite) {
    return (
      <div className={styles.container}>
        <div className={styles.errorAlert}>Trámite no encontrado</div>
        <Link href="/asesor/tramites" className={styles.backLink}>Volver a trámites</Link>
      </div>
    );
  }

  const valorTotal = tramite.valorTramite + (tramite.valorOtrosConceptos || 0);

  const getEstadoColor = (estado: string) => {
    switch(estado) {
      case 'Activo': return styles.estadoActivo;
      case 'En_Proceso': return styles.estadoEnProceso;
      case 'Finalizado': return styles.estadoFinalizado;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/asesor/tramites" className={styles.backButton}>
          ← Volver a Trámites
        </Link>
        <h1>Detalle del Trámite #{tramite.idTramite}</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.detalleCard}>
        <h2>Información del Trámite</h2>
        <div className={styles.infoGrid}>
          <div><strong>ID Trámite:</strong> {tramite.idTramite}</div>
          <div><strong>ID Cita:</strong> {tramite.idCita}</div>
          <div><strong>Estado:</strong> 
            <span className={`${styles.estadoBadge} ${getEstadoColor(estado)}`}>
              {estado}
            </span>
          </div>
          <div><strong>Fecha Creación:</strong> {new Date(tramite.fechaCreacion).toLocaleString()}</div>
          <div><strong>Fecha Cita:</strong> {new Date(tramite.fechaCita).toLocaleString()}</div>
        </div>
      </div>

      <div className={styles.detalleCard}>
        <h2>Información del Cliente</h2>
        <div className={styles.infoGrid}>
          <div><strong>Nombre:</strong> {tramite.cliente}</div>
          <div><strong>Teléfono:</strong> {tramite.telefono}</div>
          <div><strong>Correo:</strong> {tramite.correo}</div>
          <div><strong>Vehículo:</strong> {tramite.vehiculo || 'No aplica'}</div>
        </div>
      </div>

      <div className={styles.detalleCard}>
        <h2>Información del Trámite Solicitado</h2>
        <div className={styles.infoGrid}>
          <div><strong>Tipo Trámite:</strong> {tramite.tipoTramite}</div>
          <div><strong>Valor Base:</strong> ${tramite.valorTramite.toLocaleString()}</div>
          <div><strong>Otros Conceptos:</strong> ${(tramite.valorOtrosConceptos || 0).toLocaleString()}</div>
          <div><strong>Valor Total:</strong> <span className={styles.valorTotal}>${valorTotal.toLocaleString()}</span></div>
        </div>
      </div>

      {/* 👇 BOTÓN DE EDITAR VEHÍCULO (AGREGAR ESTO) */}
      {/* Botón de Editar según el tipo de trámite */}
{puedeEditar && (
  <div className={styles.detalleCard}>
    <h2>✏️ {tramite.tipoTramite === 'Traspaso' ? 'Realizar Traspaso' : 
               tramite.tipoTramite === 'Matrícula/Registro' ? 'Registrar Vehículo' : 
               'Editar Vehículo'}</h2>
    <p>Este trámite requiere: <strong>{camposAEditar.join(', ')}</strong></p>
    
    {tramite.tipoTramite === 'Traspaso' ? (
      <Link 
        href={`/asesor/tramites/${tramite.idTramite}/traspaso?placa=${tramite.vehiculo}`}
        className={styles.editarButton}
      >
        Realizar Traspaso
      </Link>
    ) : tramite.tipoTramite === 'Matrícula/Registro' ? (
      <Link 
        href={`/asesor/tramites/${tramite.idTramite}/registrar-vehiculo?idCliente=${tramite.idCliente}&idTramite=${tramite.idTramite}`}
        className={styles.editarButton}
      >
        Registrar Vehículo
      </Link>
    ) : (
      <Link 
        href={`/asesor/tramites/${tramite.idTramite}/editar-vehiculo?campos=${camposAEditar.join(',')}&placa=${tramite.vehiculo}`}
        className={styles.editarButton}
      >
        Editar Vehículo
      </Link>
    )}
  </div>
)}

      <div className={styles.detalleCard}>
        <h2>Actualizar Estado</h2>
        <div className={styles.estadoSelector}>
          <button 
            className={`${styles.estadoBtn} ${estado === 'Activo' ? styles.estadoActivo : ''}`}
            onClick={() => handleActualizarEstado('Activo')}
            disabled={updating || estado === 'Activo'}
          >
            Activo
          </button>
          <button 
            className={`${styles.estadoBtn} ${estado === 'En_Proceso' ? styles.estadoEnProceso : ''}`}
            onClick={() => handleActualizarEstado('En_Proceso')}
            disabled={updating || estado === 'En_Proceso'}
          >
            En Proceso
          </button>
          <button 
            className={`${styles.estadoBtn} ${estado === 'Finalizado' ? styles.estadoFinalizado : ''}`}
            onClick={() => handleActualizarEstado('Finalizado')}
            disabled={updating || estado === 'Finalizado'}
          >
            Finalizado
          </button>
        </div>
        <p className={styles.estadoHelper}>Cambia el estado del trámite según su progreso</p>
      </div>

      <Link href="/asesor/tramites" className={styles.backLink}>Volver a trámites</Link>
    </div>
  );
}