'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../CSS/dashboard/Dashboard.module.css';

/* ── Icons ── */
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IdIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <circle cx="8" cy="12" r="2.5"/>
    <line x1="13" y1="10" x2="19" y2="10"/>
    <line x1="13" y1="14" x2="17" y2="14"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState({ cedula: '', correo: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const cedula = sessionStorage.getItem('userCedula');
    const correo = sessionStorage.getItem('userCorreo');

    if (!isLoggedIn || !cedula) {
      router.push('/login');
      return;
    }

    setUserData({ cedula, correo: correo || '' });
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
        <div className={styles.spinner} />
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Fondo decorativo */}
      <div className={styles.grid_bg} aria-hidden />
      <div className={styles.particles} aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.particle} />
        ))}
      </div>

      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.logoMark}><CarIcon /></span>
            <span className={styles.logoText}>Trans<strong>Meta</strong></span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.headerBadge}>Panel de usuario</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogoutIcon />
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Bienvenida */}
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeTop}>
            <div className={styles.welcomeText}>
              <h2>¡<span>Bienvenido</span> de nuevo!</h2>
              <p>Has iniciado sesión correctamente</p>
            </div>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.infoChip}>
              <IdIcon />
              <strong>Cédula:</strong> {userData.cedula}
            </span>
            {userData.correo && (
              <span className={styles.infoChip}>
                <MailIcon />
                <strong>Correo:</strong> {userData.correo}
              </span>
            )}
          </div>
        </div>

        {/* Tarjetas */}
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}><FileIcon /></div>
            <h3>Trámites</h3>
            <p>Gestiona tus trámites activos</p>
            <button>Ver trámites <ArrowIcon /></button>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}><UserIcon /></div>
            <h3>Perfil</h3>
            <p>Actualiza tu información personal</p>
            <button>Editar perfil <ArrowIcon /></button>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}><BellIcon /></div>
            <h3>Notificaciones</h3>
            <p>Revisa tus notificaciones</p>
            <button>Ver todo <ArrowIcon /></button>
          </div>
        </div>

      </div>
    </div>
  );
}