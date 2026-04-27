'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../CSS/Asesor/Tramites.module.css';

interface Tramite {
  idTramite: number;
  idCita: number;
  idCliente?: number;  // 👈 Agregado
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

export default function AsesorTramitesPage() {
  const router = useRouter();
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('todos');

  const cedulaAsesor = typeof window !== 'undefined' ? sessionStorage.getItem('userCedula') : null;

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || !cedulaAsesor || rol !== '2') {
      router.push('/login');
      return;
    }
    
    cargarTramites();
  }, []);

  const cargarTramites = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/tramite/asesor/${cedulaAsesor}`);
      const data = await response.json();
      
      console.log('📦 Respuesta de trámites:', data); // 👈 Log para verificar
      
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
        <p>Cargando trámites...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/dashboard-asesor" className={styles.backButton}>
          ← Volver al Dashboard
        </Link>
        <h1>Gestión de Trámites</h1>
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
          <p>No hay trámites {filter === 'todos' ? '' : filter.toLowerCase()}</p>
        </div>
      ) : (
        <div className={styles.tramitesTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Trámite</th>
                <th>Vehículo</th>
                <th>Valor Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramitesFiltrados.map((tramite) => (
                <tr key={tramite.idTramite}>
                  <td>#{tramite.idTramite}</td>
                  <td>
                    <div className={styles.clienteInfo}>
                      <strong>{tramite.cliente}</strong>
                      <small>{tramite.telefono}</small>
                    </div>
                  </td>
                  <td>{tramite.tipoTramite}</td>
                  <td>{tramite.vehiculo}</td>
                  <td className={styles.valorTotal}>
                    ${(tramite.valorTramite + tramite.valorOtrosConceptos).toLocaleString()}
                  </td>
                  <td>
                    <span className={`${styles.estadoBadge} ${getEstadoColor(tramite.estadoTramite)}`}>
                      {getEstadoTexto(tramite.estadoTramite)}
                    </span>
                  </td>
                  <td>{new Date(tramite.fechaCreacion).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/asesor/tramites/${tramite.idTramite}`} className={styles.viewButton}>
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}