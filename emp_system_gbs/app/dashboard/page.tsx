'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../CSS/dashboard/Dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState({ cedula: '', correo: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const cedula = sessionStorage.getItem('userCedula');
    const correo = sessionStorage.getItem('userCorreo');

    if (!isLoggedIn || !cedula) {
      // Si no está autenticado, redirigir al login
      router.push('/login');
      return;
    }

    setUserData({
      cedula: cedula,
      correo: correo || ''
    });
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userCedula');
    sessionStorage.removeItem('userCorreo');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Cerrar sesión
        </button>
      </div>

      <div className={styles.welcomeCard}>
        <h2>¡Bienvenido!</h2>
        <p>Has iniciado sesión correctamente</p>
        <div className={styles.userInfo}>
          <p><strong>Cédula:</strong> {userData.cedula}</p>
          <p><strong>Correo:</strong> {userData.correo}</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Aquí irán los módulos de tu sistema */}
        <div className={styles.card}>
          <h3>Trámites</h3>
          <p>Gestiona tus trámites activos</p>
          <button>Ver trámites →</button>
        </div>

        <div className={styles.card}>
          <h3>Perfil</h3>
          <p>Actualiza tu información personal</p>
          <button>Editar perfil →</button>
        </div>

        <div className={styles.card}>
          <h3>Notificaciones</h3>
          <p>Revisa tus notificaciones</p>
          <button>Ver todo →</button>
        </div>
      </div>
    </div>
  );
}