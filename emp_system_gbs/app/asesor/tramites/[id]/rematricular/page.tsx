'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../../CSS/Asesor/Rematricular.module.css';

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
      placa: placa,
      idCliente: parseInt(idCliente),
      idTramite: parseInt(idTramite)
    };

    console.log('Realizando rematrícula:', rematriculaData);

    try {
      const response = await fetch('http://localhost:8080/api/vehiculos/rematricular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rematriculaData)
      });

      const data = await response.json();
      console.log('Respuesta:', data);

      if (response.ok && data.status === 'OK') {
        setSuccess(`Rematrícula del vehículo ${placa} realizada exitosamente`);
        setTimeout(() => {
          router.push(`/asesor/tramites/${idTramite}`);
        }, 2000);
      } else {
        setError(data.mensaje || 'Error al realizar rematrícula');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButton}>
          ← Volver al Trámite
        </Link>
        <h1>Rematrícula</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.formCard}>
        <div className={styles.infoBox}>
          <h3>✅ Reactivar Vehículo</h3>
          <p>Esta acción reactivará la matrícula del vehículo <strong>{placa}</strong>.</p>
          <p>El vehículo volverá a estar en estado ACTIVO y podrá realizar nuevos trámites.</p>
        </div>

        <div className={styles.vehicleInfo}>
          <h3>Información del Trámite</h3>
          <p><strong>ID Trámite:</strong> {idTramite}</p>
          <p><strong>Vehículo:</strong> {placa}</p>
          <p><strong>ID Cliente:</strong> {idCliente}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.buttonGroup}>
            <button type="submit" disabled={submitting} className={styles.reactivateButton}>
              {submitting ? 'Procesando...' : 'Confirmar Rematrícula'}
            </button>
            <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButtonForm}>
              Volver
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}