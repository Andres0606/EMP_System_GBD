'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../CSS/Asesor/Citas.module.css';

interface CitaPendiente {
  idCita: number;
  cliente: string;
  telefono: string;
  correo: string;
  vehiculo: string;
  tipoTramite: string;
  valorBase: number;
  fechaSolicitud: string;
  esSuEspecialidad: number;
}

interface CitaAgendada {
  idCita: number;
  cliente: string;
  telefono: string;
  vehiculo: string;
  tipoTramite: string;
  fechaProgramada: string;
}

export default function AsesorCitasPage() {
  const router = useRouter();
  const [citasPendientes, setCitasPendientes] = useState<CitaPendiente[]>([]);
  const [citasAgendadas, setCitasAgendadas] = useState<CitaAgendada[]>([]);
  const [tab, setTab] = useState<'pendientes' | 'agendadas'>('pendientes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cedulaAsesor = typeof window !== 'undefined' ? sessionStorage.getItem('userCedula') : null;

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || !cedulaAsesor) {
      router.push('/login');
      return;
    }
    
    if (rol !== '2') {
      router.push('/dashboard');
      return;
    }
    
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      setLoading(true);
      
      // Cargar citas pendientes
      const responsePendientes = await fetch(`http://localhost:8080/api/citas/pendientes/${cedulaAsesor}`);
      const dataPendientes = await responsePendientes.json();
      
      if (dataPendientes.status === 'OK') {
        setCitasPendientes(dataPendientes.citas || []);
      }
      
      // Cargar citas agendadas por este asesor
      const responseAgendadas = await fetch(`http://localhost:8080/api/citas/agendadas/${cedulaAsesor}`);
      const dataAgendadas = await responseAgendadas.json();
      
      if (dataAgendadas.status === 'OK') {
        setCitasAgendadas(dataAgendadas.citas || []);
      }
      
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleAtenderCita = (idCita: number) => {
    router.push(`/asesor/citas/${idCita}/atender`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando citas...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/dashboard-asesor" className={styles.backButton}>
          ← Volver al Dashboard
        </Link>
        <h1>Gestión de Citas</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${tab === 'pendientes' ? styles.tabActive : ''}`}
          onClick={() => setTab('pendientes')}
        >
          Pendientes ({citasPendientes.length})
        </button>
        <button 
          className={`${styles.tab} ${tab === 'agendadas' ? styles.tabActive : ''}`}
          onClick={() => setTab('agendadas')}
        >
          Mis Citas Agendadas ({citasAgendadas.length})
        </button>
      </div>

      {/* Citas Pendientes */}
      {tab === 'pendientes' && (
        <>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <h3>{citasPendientes.length}</h3>
              <p>Citas pendientes</p>
            </div>
            <div className={styles.statCard}>
              <h3>{citasPendientes.filter(c => c.esSuEspecialidad === 1).length}</h3>
              <p>De tu especialidad</p>
            </div>
          </div>

          {citasPendientes.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No hay citas pendientes</p>
            </div>
          ) : (
            <div className={styles.citasGrid}>
              {citasPendientes.map((cita) => (
                <div 
                  key={cita.idCita} 
                  className={`${styles.citaCard} ${cita.esSuEspecialidad === 1 ? styles.miEspecialidad : ''}`}
                >
                  <div className={styles.citaHeader}>
                    <span className={styles.tipoTramite}>{cita.tipoTramite}</span>
                    {cita.esSuEspecialidad === 1 && (
                      <span className={styles.badgeEspecialidad}>Mi especialidad</span>
                    )}
                  </div>
                  
                  <div className={styles.citaBody}>
                    <p><strong>Cliente:</strong> {cita.cliente}</p>
                    <p><strong>Teléfono:</strong> {cita.telefono}</p>
                    <p><strong>Correo:</strong> {cita.correo}</p>
                    <p><strong>Vehículo:</strong> {cita.vehiculo || 'No aplica'}</p>
                    <p><strong>Valor base:</strong> ${cita.valorBase?.toLocaleString()}</p>
                    <p><strong>Solicitada:</strong> {new Date(cita.fechaSolicitud).toLocaleString()}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleAtenderCita(cita.idCita)}
                    className={styles.atenderButton}
                  >
                    Atender cita
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Citas Agendadas */}
      {tab === 'agendadas' && (
        <>
          {citasAgendadas.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No tienes citas agendadas</p>
            </div>
          ) : (
            <div className={styles.citasGrid}>
              {citasAgendadas.map((cita) => (
                <div key={cita.idCita} className={styles.citaCard}>
                  <div className={styles.citaHeader}>
                    <span className={styles.tipoTramite}>{cita.tipoTramite}</span>
                  </div>
                  
                  <div className={styles.citaBody}>
                    <p><strong>Cliente:</strong> {cita.cliente}</p>
                    <p><strong>Teléfono:</strong> {cita.telefono}</p>
                    <p><strong>Vehículo:</strong> {cita.vehiculo || 'No aplica'}</p>
                    <p><strong>Fecha Programada:</strong> {new Date(cita.fechaProgramada).toLocaleString()}</p>
                  </div>
                  
                  <button 
                    onClick={() => router.push(`/asesor/citas/${cita.idCita}/completar`)}
                    className={styles.completarButton}
                  >
                    Completar cita y crear trámite
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}