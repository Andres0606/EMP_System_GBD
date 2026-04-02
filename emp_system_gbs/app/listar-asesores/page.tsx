'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
  },
  card: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  title: {
    color: '#333',
    margin: 0,
  },
  backBtn: {
    padding: '0.5rem 1rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    overflowX: 'auto' as const,
    display: 'block' as const,
  },
  th: {
    padding: '0.75rem',
    textAlign: 'left' as const,
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f3f4f6',
    fontWeight: 600,
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #ddd',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '2rem',
  },
  errorAlert: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    borderLeft: '4px solid #dc2626',
  },
  emptyMessage: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#666',
  },
  especialidadBadge: {
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    display: 'inline-block',
  },
  rolBadge: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    display: 'inline-block',
  }
};

interface Asesor {
  cedula: number;
  nombres: string;
  apellido: string;
  correo: string;
  especialidad: string;
  sueldo: number;
  tipoUsuario: number;
}

export default function ListarAsesoresPage() {
  const router = useRouter();
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRol = sessionStorage.getItem('userRol');

    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (userRol !== '3') {
      router.push('/dashboard');
      return;
    }

    cargarAsesores();
  }, [router]);

  const cargarAsesores = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/asesores');
      const data = await response.json();
      
      if (response.ok && data.status === 'OK') {
        setAsesores(data.asesores || []);
      } else {
        throw new Error(data.mensaje || 'Error al cargar asesores');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error de conexión con el servidor');
      setAsesores([]);
    } finally {
      setLoading(false);
    }
  };

  const formatearSueldo = (sueldo: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(sueldo);
  };

  const getRolTexto = (tipoUsuario: number) => {
    return tipoUsuario === 2 ? 'Asesor' : 'Otro';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loading}>
            <div>Cargando lista de asesores...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Lista de Asesores</h1>
          <Link href="/dashboard-admin" style={styles.backBtn}>
            ← Volver al Dashboard
          </Link>
        </div>

        {error && (
          <div style={styles.errorAlert} role="alert">
            {error}
          </div>
        )}

        {asesores.length === 0 && !error ? (
          <div style={styles.emptyMessage}>
            <p>No hay asesores registrados en el sistema.</p>
            <p>
              <Link href="/crear-asesor" style={{ color: '#667eea' }}>
                Haz clic aquí para registrar un asesor
              </Link>
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Cédula</th>
                  <th style={styles.th}>Nombre Completo</th>
                  <th style={styles.th}>Correo</th>
                  <th style={styles.th}>Especialidad</th>
                  <th style={styles.th}>Sueldo</th>
                  <th style={styles.th}>Rol</th>
                </tr>
              </thead>
              <tbody>
                {asesores.map((asesor, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{asesor.cedula}</td>
                    <td style={styles.td}>
                      {asesor.nombres} {asesor.apellido}
                    </td>
                    <td style={styles.td}>{asesor.correo}</td>
                    <td style={styles.td}>
                      <span style={styles.especialidadBadge}>
                        {asesor.especialidad}
                      </span>
                    </td>
                    <td style={styles.td}>{formatearSueldo(asesor.sueldo)}</td>
                    <td style={styles.td}>
                      <span style={styles.rolBadge}>
                        {getRolTexto(asesor.tipoUsuario)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}