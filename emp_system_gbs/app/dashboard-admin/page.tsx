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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1rem',
    background: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    margin: 0,
    color: '#333',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  welcomeCard: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
    cursor: 'pointer',
    textAlign: 'center' as const,
  },
  cardTitle: {
    color: '#667eea',
    marginBottom: '1rem',
    fontSize: '1.5rem',
  },
  cardDescription: {
    color: '#666',
    marginBottom: '1rem',
  },
  button: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
  },
};

export default function DashboardAdminPage() {
  const router = useRouter();
  const [userData, setUserData] = useState({ cedula: '', correo: '', rol: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const cedula = sessionStorage.getItem('userCedula');
    const correo = sessionStorage.getItem('userCorreo');
    const rol = sessionStorage.getItem('userRol');

    if (!isLoggedIn || !cedula) {
      router.push('/login');
      return;
    }

    // Verificar que sea administrador (rol 3)
    if (rol !== '3') {
      router.push('/dashboard');
      return;
    }

    setUserData({
      cedula: cedula,
      correo: correo || '',
      rol: rol === '3' ? 'Administrador' : 'Usuario'
    });
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userCedula');
    sessionStorage.removeItem('userCorreo');
    sessionStorage.removeItem('userRol');
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Panel de Administrador</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Cerrar sesión
        </button>
      </div>

      <div style={styles.welcomeCard}>
        <h2>¡Bienvenido, Administrador!</h2>
        <p>Has iniciado sesión correctamente</p>
        <div>
          <p><strong>Cédula:</strong> {userData.cedula}</p>
          <p><strong>Correo:</strong> {userData.correo}</p>
          <p><strong>Rol:</strong> {userData.rol}</p>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>👥 Crear Asesor</h3>
          <p style={styles.cardDescription}>Registra nuevos asesores en el sistema</p>
          <Link href="/crear-asesor">
            <button style={styles.button}>Crear Asesor →</button>
          </Link>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📊 Ver Asesores</h3>
          <p style={styles.cardDescription}>Lista de todos los asesores registrados</p>
          <Link href="/listar-asesores">
            <button style={styles.button}>Ver Asesores →</button>
          </Link>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📋 Reportes</h3>
          <p style={styles.cardDescription}>Genera reportes del sistema</p>
          <button style={styles.button}>Ver Reportes →</button>
        </div>
      </div>
    </div>
  );
}