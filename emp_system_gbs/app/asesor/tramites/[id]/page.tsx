'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../CSS/Asesor/TramiteDetalle.module.css';

interface TramiteDetalle {
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
}

export default function TramiteDetallePage() {
  const router = useRouter();
  const params = useParams();
  const idTramite = params.id as string;
  
  const [tramite, setTramite] = useState<TramiteDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cedulaAsesor = typeof window !== 'undefined' ? sessionStorage.getItem('userCedula') : null;

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
        setTramite(encontrado);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar el trámite');
    } finally {
      setLoading(false);
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/asesor/tramites" className={styles.backButton}>
          ← Volver a Trámites
        </Link>
        <h1>Detalle del Trámite #{tramite.idTramite}</h1>
      </div>

      <div className={styles.detalleCard}>
        <h2>Información del Trámite</h2>
        <div className={styles.infoGrid}>
          <div><strong>ID Trámite:</strong> {tramite.idTramite}</div>
          <div><strong>ID Cita:</strong> {tramite.idCita}</div>
          <div><strong>Estado:</strong> {tramite.estadoTramite}</div>
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
          <div><strong>Vehículo:</strong> {tramite.vehiculo}</div>
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

      <Link href="/asesor/tramites" className={styles.backLink}>Volver a trámites</Link>
    </div>
  );
}