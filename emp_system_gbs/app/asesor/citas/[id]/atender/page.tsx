'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function AtenderCitaPage() {
  const router = useRouter();
  const params = useParams();
  const idCita = params.id as string;
  
  const [cita, setCita] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fechaProgramada, setFechaProgramada] = useState('');

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
      const response = await fetch(`http://localhost:8080/api/citas/pendientes/${cedulaAsesor}`);
      const data = await response.json();
      
      if (data.status === 'OK' && data.citas) {
        const citaEncontrada = data.citas.find((c: any) => c.idCita === parseInt(idCita));
        setCita(citaEncontrada);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar la cita');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!fechaProgramada) {
      setError('Seleccione una fecha y hora');
      setSubmitting(false);
      return;
    }

    console.log("Enviando:", {
      idCita: parseInt(idCita),
      idAsesor: parseInt(cedulaAsesor!),
      fechaProgramada: fechaProgramada
    });

    try {
      const response = await fetch('http://localhost:8080/api/citas/atender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idCita: parseInt(idCita),
          idAsesor: parseInt(cedulaAsesor!),
          fechaProgramada: fechaProgramada
        }),
      });

      const data = await response.json();
      console.log("Respuesta:", data);

      if (response.ok && data.status === 'OK') {
        setSuccess('¡Cita agendada exitosamente!');
        setTimeout(() => {
          router.push('/asesor/citas');
        }, 2000);
      } else {
        setError(data.mensaje || 'Error al agendar la cita');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!cita) return <div>Cita no encontrada</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <Link href="/asesor/citas">← Volver</Link>
      <h1>Atender Cita</h1>
      
      <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <p><strong>Cliente:</strong> {cita.cliente}</p>
        <p><strong>Teléfono:</strong> {cita.telefono}</p>
        <p><strong>Trámite:</strong> {cita.tipoTramite}</p>
        <p><strong>Vehículo:</strong> {cita.vehiculo}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Fecha y Hora Programada:</label>
        <input
          type="datetime-local"
          value={fechaProgramada}
          onChange={(e) => setFechaProgramada(e.target.value)}
          required
          style={{ display: 'block', margin: '1rem 0', padding: '0.5rem' }}
        />
        
        <button type="submit" disabled={submitting} style={{ padding: '0.5rem 1rem' }}>
          {submitting ? 'Agendando...' : 'Agendar Cita'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}