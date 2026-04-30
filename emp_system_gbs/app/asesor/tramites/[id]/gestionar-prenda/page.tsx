'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../../CSS/Asesor/GestionarPrenda.module.css';

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

    const endpoint = tipo === 'inscribir' 
      ? 'http://localhost:8080/api/vehiculos/inscribirPrenda'
      : 'http://localhost:8080/api/vehiculos/levantarPrenda';

    const data = {
      placa: placa,
      idTramite: parseInt(idTramite)
    };

    console.log(`${tipo === 'inscribir' ? 'Inscribiendo' : 'Levantando'} prenda:`, data);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('Respuesta:', result);

      if (response.ok && result.status === 'OK') {
        const mensaje = tipo === 'inscribir' 
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
      console.error('Error:', err);
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
      <div className={styles.header}>
        <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButton}>
          ← Volver al Trámite
        </Link>
        <h1>{titulo}</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.formCard}>
        <div className={styles.infoBox}>
          <h3>{esInscripcion ? '🔒 Inscripción de Prenda' : '🔓 Levantamiento de Prenda'}</h3>
          <p><strong>Vehículo:</strong> {placa}</p>
          <p><strong>ID Trámite:</strong> {idTramite}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.buttonGroup}>
            <button type="submit" disabled={submitting} className={colorBoton}>
              {submitting ? 'Procesando...' : accion}
            </button>
            <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButtonForm}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}