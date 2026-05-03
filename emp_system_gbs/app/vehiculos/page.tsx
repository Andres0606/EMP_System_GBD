'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../CSS/Vehiculos/Vehiculos.module.css';

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
  </svg>
);

interface Vehiculo {
  placa: string;
  marca: string;
  linea: string;
  modelo: number;
  clase: string;
  tipoServicio: string;
  numMotor: string;
  numChasis: string;
  color?: string;
  estado?: string;
  prendado?: string;
}

export default function VehiculosPage() {
  const router = useRouter();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const idCliente = typeof window !== 'undefined' ? sessionStorage.getItem('userCedula') : null;

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn || !idCliente) {
      router.push('/login');
      return;
    }
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      console.log("Cargando vehículos para cliente:", idCliente);
      
      const response = await fetch(`http://localhost:8080/api/vehiculos/cliente/${idCliente}`);
      const data = await response.json();
      console.log("Data recibida:", data);
      
      if (data.vehiculos && Array.isArray(data.vehiculos)) {
        setVehiculos(data.vehiculos);
      } else {
        setVehiculos([]);
      }
      
    } catch (err) {
      console.error('Error detallado:', err);
      setError('Error al cargar los vehículos');
      setVehiculos([]);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado?: string) => {
    if (estado === 'CANCELADO') return styles.estadoCancelado;
    return styles.estadoActivo;
  };

  const getEstadoTexto = (estado?: string) => {
    if (estado === 'CANCELADO') return 'Matrícula Cancelada';
    return 'Activo';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando vehículos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          <ArrowLeftIcon /> Volver al Dashboard
        </Link>
        <h1>Mis Vehículos</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {vehiculos.length === 0 ? (
        <div className={styles.emptyState}>
          <CarIcon />
          <h3>No tienes vehículos registrados</h3>
          <p>Para registrar un vehículo, agenda una cita con el trámite "Matrícula/Registro"</p>
          <Link href="/asesor/citas" className={styles.emptyButton}>
            Agendar Cita
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {vehiculos.map((vehiculo) => (
            <div key={vehiculo.placa} className={`${styles.card} ${vehiculo.estado === 'CANCELADO' ? styles.cardCancelado : ''}`}>
              <div className={styles.cardHeader}>
                <CarIcon />
                <h3>{vehiculo.marca} {vehiculo.linea}</h3>
                <div className={styles.badgesGroup}>
                  <span className={`${styles.estadoBadge} ${getEstadoColor(vehiculo.estado)}`}>
                    {getEstadoTexto(vehiculo.estado)}
                  </span>

                  {vehiculo.prendado === 'S' && (
                    <span className={styles.prendaBadge}>
                      Prendado
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.cardContent}>
                <p><strong>Placa:</strong> {vehiculo.placa}</p>
                <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                <p><strong>Clase:</strong> {vehiculo.clase}</p>
                <p><strong>Tipo Servicio:</strong> {vehiculo.tipoServicio}</p>
                {vehiculo.color && <p><strong>Color:</strong> {vehiculo.color}</p>}
                <p><strong>Núm. Motor:</strong> {vehiculo.numMotor || 'No registrado'}</p>
                <p><strong>Núm. Chasis:</strong> {vehiculo.numChasis || 'No registrado'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}