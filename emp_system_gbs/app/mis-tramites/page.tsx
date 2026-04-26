'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../CSS/Cliente/MisTramites.module.css';

interface Tramite {
  idTramite: number;
  idCita: number;
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
  asesor: string;
}

export default function MisTramitesPage() {
  const router = useRouter();
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('todos');

  const cedulaCliente = typeof window !== 'undefined' ? sessionStorage.getItem('userCedula') : null;

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || !cedulaCliente) {
      router.push('/login');
      return;
    }
    
    // Verificar que sea cliente (rol 1) o permitir también a otros roles ver sus trámites
    // if (rol !== '1') {
    //   router.push('/dashboard');
    //   return;
    // }
    
    cargarTramites();
  }, []);

  const cargarTramites = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/tramite/cliente/${cedulaCliente}`);
      const data = await response.json();
      
      if (response.ok && data.status === 'OK') {
        setTramites(data.tramites || []);
      } else {
        setError(data.mensaje || 'Error al cargar trámites');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch(estado) {
      case 'Activo': return styles.estadoActivo;
      case 'En_Proceso': return styles.estadoEnProceso;
      case 'Finalizado': return styles.estadoFinalizado;
      default: return styles.estadoDefault;
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch(estado) {
      case 'Activo': return 'Activo';
      case 'En_Proceso': return 'En Proceso';
      case 'Finalizado': return 'Finalizado';
      default: return estado;
    }
  };

  const tramitesFiltrados = tramites.filter(t => {
    if (filter === 'todos') return true;
    return t.estadoTramite === filter;
  });

  const stats = {
    total: tramites.length,
    activos: tramites.filter(t => t.estadoTramite === 'Activo').length,
    enProceso: tramites.filter(t => t.estadoTramite === 'En_Proceso').length,
    finalizados: tramites.filter(t => t.estadoTramite === 'Finalizado').length
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando tus trámites...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Volver al Dashboard
        </Link>
        <h1>Mis Trámites</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>{stats.total}</h3>
          <p>Total Trámites</p>
        </div>
        <div className={styles.statCard}>
          <h3>{stats.activos}</h3>
          <p>Activos</p>
        </div>
        <div className={styles.statCard}>
          <h3>{stats.enProceso}</h3>
          <p>En Proceso</p>
        </div>
        <div className={styles.statCard}>
          <h3>{stats.finalizados}</h3>
          <p>Finalizados</p>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <button 
          className={`${styles.filterBtn} ${filter === 'todos' ? styles.filterActive : ''}`}
          onClick={() => setFilter('todos')}
        >
          Todos ({stats.total})
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'Activo' ? styles.filterActive : ''}`}
          onClick={() => setFilter('Activo')}
        >
          Activos ({stats.activos})
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'En_Proceso' ? styles.filterActive : ''}`}
          onClick={() => setFilter('En_Proceso')}
        >
          En Proceso ({stats.enProceso})
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'Finalizado' ? styles.filterActive : ''}`}
          onClick={() => setFilter('Finalizado')}
        >
          Finalizados ({stats.finalizados})
        </button>
      </div>

      {/* Lista de trámites */}
      {tramitesFiltrados.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h3>No tienes trámites</h3>
          <p>Cuando solicites una cita y sea completada, tus trámites aparecerán aquí</p>
          <Link href="/citas/solicitar" className={styles.solicitarButton}>
            Solicitar una cita
          </Link>
        </div>
      ) : (
        <div className={styles.tramitesGrid}>
          {tramitesFiltrados.map((tramite) => (
            <div key={tramite.idTramite} className={styles.tramiteCard}>
              <div className={styles.cardHeader}>
                <span className={styles.tramiteId}>#{tramite.idTramite}</span>
                <span className={`${styles.estadoBadge} ${getEstadoColor(tramite.estadoTramite)}`}>
                  {getEstadoTexto(tramite.estadoTramite)}
                </span>
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Trámite:</span>
                  <span className={styles.infoValue}>{tramite.tipoTramite}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Vehículo:</span>
                  <span className={styles.infoValue}>{tramite.vehiculo || 'No aplica'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Valor Total:</span>
                  <span className={styles.valorTotal}>
                    ${(tramite.valorTramite + (tramite.valorOtrosConceptos || 0)).toLocaleString()}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Asesor:</span>
                  <span className={styles.infoValue}>{tramite.asesor || 'Por asignar'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Fecha Cita:</span>
                  <span className={styles.infoValue}>
                    {tramite.fechaCita ? new Date(tramite.fechaCita).toLocaleDateString() : 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}