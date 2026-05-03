'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../../CSS/Asesor/GestionarPrenda.module.css';

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

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const UnlockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
  </svg>
);

export default function GestionarPrendaPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const idTramite = params.id as string;
  const placa = searchParams.get('placa') || '';
  const tipo = searchParams.get('tipo') || ''; // 'inscribir' o 'levantar'

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

    if (!placa) {
      setError('Falta información del vehículo');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const endpoint =
      tipo === 'inscribir'
        ? 'http://localhost:8080/api/vehiculos/inscribirPrenda'
        : 'http://localhost:8080/api/vehiculos/levantarPrenda';

    const data = {
      placa,
      idTramite: parseInt(idTramite),
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.status === 'OK') {
        const mensaje =
          tipo === 'inscribir'
            ? `Prenda inscrita exitosamente para el vehículo ${placa}`
            : `Prenda levantada exitosamente para el vehículo ${placa}`;
        setSuccess(mensaje);
        setTimeout(() => {
          router.push(`/asesor/tramites/${idTramite}`);
        }, 2000);
      } else {
        setError(result.mensaje || 'Error al procesar la prenda');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const esInscripcion = tipo === 'inscribir';
  const titulo = esInscripcion ? 'Inscripción de Prenda' : 'Levantamiento de Prenda';
  const accion = esInscripcion ? 'Inscribir Prenda' : 'Levantar Prenda';
  const colorBoton = esInscripcion ? styles.inscribirButton : styles.levantarButton;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButton}>
            <ArrowLeftIcon /> Volver al Trámite
          </Link>
          <h1>{titulo}</h1>
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

          <div className={styles.infoBox}>
            <h3>
              {esInscripcion ? <LockIcon /> : <UnlockIcon />}
              {esInscripcion ? 'Inscripción de Prenda' : 'Levantamiento de Prenda'}
            </h3>
            <p><strong>Vehículo:</strong> {placa}</p>
            <p><strong>ID Trámite:</strong> #{idTramite}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.buttonGroup}>
              <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButtonForm}>
                Cancelar
              </Link>
              <button type="submit" disabled={submitting} className={colorBoton}>
                {esInscripcion ? <LockIcon /> : <UnlockIcon />}
                {submitting ? 'Procesando...' : accion}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}