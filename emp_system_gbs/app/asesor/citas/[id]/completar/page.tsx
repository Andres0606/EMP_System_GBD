'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../../CSS/Asesor/CompletarCita.module.css';

interface CitaInfo {
  idCita: number;
  cliente: string;
  telefono: string;
  vehiculo: string;
  tipoTramite: string;
  valorBase: number;
  fechaProgramada: string;
}

export default function CompletarCitaPage() {
  const router = useRouter();
  const params = useParams();
  const idCita = params.id as string;
  
  const [cita, setCita] = useState<CitaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [valorOtrosConceptos, setValorOtrosConceptos] = useState<number>(0);
  const [valorTotal, setValorTotal] = useState<number>(0);

  const cedulaAsesor = typeof window !== 'undefined' ? sessionStorage.getItem('userCedula') : null;

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || !cedulaAsesor || rol !== '2') {
      router.push('/login');
      return;
    }
    
    cargarCita();
  }, []);

  const cargarCita = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/citas/agendadas/${cedulaAsesor}`);
      const data = await response.json();
      
      console.log('Respuesta completa:', data); // 👈 Depuración
      
      if (data.status === 'OK' && data.citas) {
        const citaEncontrada = data.citas.find((c: any) => c.idCita === parseInt(idCita));
        console.log('Cita encontrada:', citaEncontrada); // 👈 Depuración
        console.log('Valor base:', citaEncontrada?.valorBase); // 👈 Depuración
        
        setCita(citaEncontrada);
        
        // Asegurar que valorBase tenga un valor por defecto
        const base = citaEncontrada?.valorBase || 0;
        setValorTotal(base);
      } else {
        setError('No se pudo cargar la información de la cita');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleOtrosConceptosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseFloat(e.target.value) || 0;
    setValorOtrosConceptos(valor);
    const base = cita?.valorBase || 0;
    setValorTotal(base + valor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const base = cita?.valorBase || 0;
    const total = base + valorOtrosConceptos;

    try {
      // 1. Completar cita
      const responseCita = await fetch('http://localhost:8080/api/citas/completar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idCita: parseInt(idCita) })
      });
      
      const dataCita = await responseCita.json();
      
      if (!responseCita.ok || dataCita.status !== 'OK') {
        throw new Error(dataCita.mensaje || 'Error al completar la cita');
      }
      
      // 2. Crear trámite
      const responseTramite = await fetch('http://localhost:8080/api/tramite/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idCita: parseInt(idCita),
          valorTramite: total,
          valorOtrosConceptos: valorOtrosConceptos
        })
      });
      
      const dataTramite = await responseTramite.json();
      
      if (responseTramite.ok && dataTramite.status === 'OK') {
        setSuccess(`✅ ¡Trámite #${dataTramite.idTramite} creado exitosamente! Valor total: $${total.toLocaleString()}`);
        setTimeout(() => {
          router.push('/asesor/citas');
        }, 2000);
      } else {
        throw new Error(dataTramite.mensaje || 'Error al crear el trámite');
      }
      
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando información de la cita...</p>
      </div>
    );
  }

  if (!cita) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/asesor/citas" className={styles.backButton}>
            ← Volver a Citas
          </Link>
          <h1>Completar Cita</h1>
        </div>
        <div className={styles.errorAlert}>Cita no encontrada</div>
        <Link href="/asesor/citas" className={styles.backLink}>Volver a citas</Link>
      </div>
    );
  }

  const valorBaseMostrar = cita.valorBase || 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/asesor/citas" className={styles.backButton}>
          ← Volver a Citas
        </Link>
        <h1>Completar Cita y Crear Trámite</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.citaCard}>
        <h2>📋 Información de la Cita</h2>
        <div className={styles.infoGrid}>
          <div><strong>ID Cita:</strong> {cita.idCita}</div>
          <div><strong>Cliente:</strong> {cita.cliente}</div>
          <div><strong>Teléfono:</strong> {cita.telefono}</div>
          <div><strong>Vehículo:</strong> {cita.vehiculo || 'No aplica'}</div>
          <div><strong>Trámite:</strong> {cita.tipoTramite}</div>
          <div><strong>Valor base:</strong> ${valorBaseMostrar.toLocaleString()}</div>
          <div><strong>Fecha Programada:</strong> {new Date(cita.fechaProgramada).toLocaleString()}</div>
        </div>
      </div>

      <div className={styles.formCard}>
        <h2>💰 Valor del Trámite</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Valor Base</label>
            <input
              type="text"
              value={`$${valorBaseMostrar.toLocaleString()}`}
              disabled
              className={styles.disabledInput}
            />
            <small className={styles.helperText}>Valor base del trámite (no editable)</small>
          </div>

          <div className={styles.formGroup}>
            <label>Valor Otros Conceptos</label>
            <input
              type="number"
              value={valorOtrosConceptos}
              onChange={handleOtrosConceptosChange}
              placeholder="Ej: 50000"
              className={styles.input}
            />
            <small className={styles.helperText}>Costos adicionales como impuestos, certificados, etc.</small>
          </div>

          <div className={styles.totalCard}>
            <span className={styles.totalLabel}>💰 Valor Total:</span>
            <span className={styles.totalValue}>${(valorBaseMostrar + valorOtrosConceptos).toLocaleString()}</span>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="submit"
              disabled={submitting} 
              className={styles.confirmButton}
            >
              {submitting ? 'Procesando...' : '✓ Sí, completar trámite'}
            </button>
            <Link href="/asesor/citas" className={styles.cancelButton}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}