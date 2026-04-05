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

export default function AsesorCitasPage() {
  const router = useRouter();
  const [citas, setCitas] = useState<CitaPendiente[]>([]);
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
    
    // Verificar que sea asesor
    if (rol !== '2') {
      router.push('/dashboard');
      return;
    }
    
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/citas/pendientes/${cedulaAsesor}`);
      const data = await response.json();
      
      if (response.ok && data.status === 'OK') {
        setCitas(data.citas || []);
      } else {
        setError(data.mensaje || 'Error al cargar citas');
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

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>{citas.length}</h3>
          <p>Citas pendientes</p>
        </div>
        <div className={styles.statCard}>
          <h3>{citas.filter(c => c.esSuEspecialidad === 1).length}</h3>
          <p>De tu especialidad</p>
        </div>
      </div>

      {citas.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay citas pendientes</p>
        </div>
      ) : (
        <div className={styles.citasGrid}>
          {citas.map((cita) => (
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
    </div>
  );
}