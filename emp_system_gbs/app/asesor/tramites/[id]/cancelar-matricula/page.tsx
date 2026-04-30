'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../../CSS/Asesor/CancelarMatricula.module.css';

export default function CancelarMatriculaPage() {
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

    const cancelacionData = {
      placa: placa,
      idCliente: parseInt(idCliente),
      idTramite: parseInt(idTramite)
    };

    console.log('Cancelando matrícula:', cancelacionData);

    try {
      const response = await fetch('http://localhost:8080/api/vehiculos/cancelarMatricula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cancelacionData)
      });

      const data = await response.json();
      console.log('Respuesta:', data);

      if (response.ok && data.status === 'OK') {
        setSuccess(`Matrícula del vehículo ${placa} cancelada exitosamente`);
        setTimeout(() => {
          router.push(`/asesor/tramites/${idTramite}`);
        }, 2000);
      } else {
        setError(data.mensaje || 'Error al cancelar matrícula');
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
        <h1>Cancelar Matrícula</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.formCard}>
        <div className={styles.infoBox}>
          <h3>⚠️ Advertencia</h3>
          <p>Esta acción cancelará la matrícula del vehículo <strong>{placa}</strong>.</p>
          <p>El vehículo quedará marcado como CANCELADO y no podrá realizar nuevos trámites.</p>
          <p>Esta acción es irreversible.</p>
        </div>

        <div className={styles.vehicleInfo}>
          <h3>Información del Trámite</h3>
          <p><strong>ID Trámite:</strong> {idTramite}</p>
          <p><strong>Vehículo:</strong> {placa}</p>
          <p><strong>ID Cliente:</strong> {idCliente}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.buttonGroup}>
            <button type="submit" disabled={submitting} className={styles.cancelButton}>
              {submitting ? 'Procesando...' : 'Confirmar Cancelación'}
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