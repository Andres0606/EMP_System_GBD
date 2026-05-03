'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../../CSS/Asesor/Rematricular.module.css';

/* ── Icons ── */
const ArrowLeftIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

export default function RematricularPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const idTramite = params.id as string;
  const placa = searchParams.get('placa') || '';
  const idCliente = searchParams.get('idCliente') || '';

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');

    if (!isLoggedIn || rol !== '2') {
      router.push('/login');
      return;
    }

    if (!placa || !idCliente) {
      setError('Falta información del vehículo o cliente');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const rematriculaData = {
      placa,
      idCliente: parseInt(idCliente),
      idTramite: parseInt(idTramite),
    };

    try {
      const response = await fetch('http://localhost:8080/api/vehiculos/rematricular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rematriculaData),
      });

      const data = await response.json();

      if (response.ok && data.status === 'OK') {
        setSuccess(`Rematrícula del vehículo ${placa} realizada exitosamente`);
        setTimeout(() => {
          router.push(`/asesor/tramites/${idTramite}`);
        }, 2000);
      } else {
        setError(data.mensaje || 'Error al realizar rematrícula');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButton}>
            <ArrowLeftIcon /> Volver al Trámite
          </Link>
          <h1>Rematrícula</h1>
        </div>

        {/* Alertas */}
        {error && (
          <div className={styles.errorAlert}>
            <AlertCircleIcon /> {error}
          </div>
        )}
        {success && (
          <div className={styles.successAlert}>
            <CheckCircleIcon /> {success}
          </div>
        )}

        {/* Card principal */}
        <div className={styles.formCard}>

          {/* Info reactivación */}
          <div className={styles.infoBox}>
            <h3><CheckCircleIcon /> Reactivar Vehículo</h3>
            <p>
              Esta acción reactivará la matrícula del vehículo <strong>{placa}</strong>.
            </p>
            <p>
              El vehículo volverá a estar en estado <strong>ACTIVO</strong> y podrá realizar nuevos trámites.
            </p>
          </div>

          {/* Info del trámite */}
          <div className={styles.vehicleInfo}>
            <h3>Información del Trámite</h3>
            <p><strong>ID Trámite:</strong> #{idTramite}</p>
            <p><strong>Vehículo:</strong> {placa}</p>
            <p><strong>ID Cliente:</strong> {idCliente}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.buttonGroup}>
              <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButtonForm}>
                Cancelar
              </Link>
              <button type="submit" disabled={submitting} className={styles.reactivateButton}>
                <RefreshIcon />
                {submitting ? 'Procesando...' : 'Confirmar Rematrícula'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}