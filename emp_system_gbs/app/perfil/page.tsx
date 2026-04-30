'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../CSS/Perfil/Perfil.module.css';

/* ── Icons ── */
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ── Helpers ── */
function getInitials(nombres: string, apellido: string): string {
  const a = nombres?.charAt(0)?.toUpperCase() ?? '';
  const b = apellido?.charAt(0)?.toUpperCase() ?? '';
  return (a + b) || 'U';
}

function getNombreCompleto(nombres: string, apellido: string): string {
  return `${nombres || ''} ${apellido || ''}`.trim() || 'Usuario';
}

function getRolLabel(rol: number): string {
  switch (rol) {
    case 1: return 'Cliente';
    case 2: return 'Asesor';
    case 3: return 'Administrador';
    default: return 'Usuario';
  }
}

function getRedirectPath(rol: number): string {
  switch (rol) {
    case 1: return '/dashboard';
    case 2: return '/dashboard-asesor';
    case 3: return '/dashboard-admin';
    default: return '/dashboard';
  }
}

export default function PerfilPage() {
  const router = useRouter();
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [userRol, setUserRol]   = useState<number>(1);

  /* Toggle licencia */
  const [tieneLicencia, setTieneLicencia] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellido: '',
    fechaNacimiento: '',
    telefono: '',
    correo: '',
    licenciaConduccion: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  /* ── Carga inicial ── */
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const cedula     = sessionStorage.getItem('userCedula');
    const rol        = sessionStorage.getItem('userRol');

    if (!isLoggedIn || !cedula) { router.push('/login'); return; }

    const rolNum = rol ? parseInt(rol) : 1;
    setUserRol(rolNum);
    cargarPerfil(cedula);
  }, []);

  const cargarPerfil = async (cedula: string) => {
    try {
      setLoading(true);
      const res  = await fetch(`http://localhost:8080/api/auth/perfil/${cedula}`);
      const data = await res.json();

      if (res.ok && data.status === 'OK') {
        const licencia = data.licenciaConduccion || '';
        setFormData({
          cedula:              data.cedula             || '',
          nombres:             data.nombres            || '',
          apellido:            data.apellido           || '',
          fechaNacimiento:     data.fechaNacimiento    || '',
          telefono:            data.telefono           || '',
          correo:              data.correo             || '',
          licenciaConduccion:  licencia,
          contrasena:          '',
          confirmarContrasena: '',
        });
        /* Si ya tenía licencia guardada, marcamos "Sí" por defecto */
        if (licencia) setTieneLicencia(true);
      } else {
        setError(data.mensaje || 'Error al cargar perfil');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setSaving(false);
      return;
    }
    if (formData.contrasena && formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setSaving(false);
      return;
    }

    const updateData: Record<string, unknown> = {
      cedula:   parseInt(formData.cedula),
      nombres:  formData.nombres,
      apellido: formData.apellido,
      correo:   formData.correo,
      /* Solo se envía licencia si el rol es cliente */
      licenciaConduccion:
        userRol === 1
          ? tieneLicencia
            ? formData.licenciaConduccion || null
            : null
          : undefined,
    };

    if (formData.fechaNacimiento) updateData.fechaNacimiento = formData.fechaNacimiento;
    if (formData.telefono)        updateData.telefono        = parseInt(formData.telefono);
    if (formData.contrasena)      updateData.contrasena      = formData.contrasena;

    try {
      const res  = await fetch('http://localhost:8080/api/auth/perfil', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(updateData),
      });
      const data = await res.json();

      if (res.ok && data.status === 'OK') {
        setSuccess('Perfil actualizado exitosamente');
        sessionStorage.setItem('userNombres', formData.nombres);
        sessionStorage.setItem('userApellido', formData.apellido);
        sessionStorage.setItem('userCorreo', formData.correo);
        setFormData(prev => ({ ...prev, contrasena: '', confirmarContrasena: '' }));
        setTimeout(() => router.push(getRedirectPath(userRol)), 2000);
      } else {
        setError(data.mensaje || 'Error al actualizar perfil');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  const nombreCompleto = getNombreCompleto(formData.nombres, formData.apellido);
  const iniciales      = getInitials(formData.nombres, formData.apellido);
  const backPath       = getRedirectPath(userRol);

  return (
    <div className={styles.container}>
      <div className={styles.gridBg} aria-hidden />

      <div className={styles.inner}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logoMark}><CarIcon /></div>
            <span className={styles.logoText}>Trans<strong>Meta</strong></span>
          </div>

          <span className={styles.pageTitle}>Mi Perfil</span>

          <Link href={backPath} className={styles.backButton}>
            <ArrowLeftIcon />
            <span>Volver al Dashboard</span>
          </Link>
        </div>

        {/* ── Alertas ── */}
        {error   && (
          <div className={styles.errorAlert}>
            <AlertIcon />{error}
          </div>
        )}
        {success && (
          <div className={styles.successAlert}>
            <CheckIcon />{success}
          </div>
        )}

        {/* ── Card ── */}
        <div className={styles.perfilCard}>
          <div className={styles.cardBanner} />

          <div className={styles.cardBody}>
            {/* Avatar + badge */}
            <div className={styles.avatarRow}>
              <div className={styles.avatar}>{iniciales}</div>
              <div className={styles.roleBadge}>
                <span className={styles.roleDot} />
                {getRolLabel(userRol)}
              </div>
            </div>

            <p className={styles.userName}>
              Bienvenido, <span>{nombreCompleto}</span>
            </p>
            <p className={styles.userSub}>Actualiza tu información personal</p>

            <div className={styles.divider} />

            {/* ── Formulario ── */}
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.sectionLabel}>Datos personales</p>

              <div className={styles.formGrid}>
                {/* Cédula */}
                <div className={styles.field}>
                  <label>Cédula</label>
                  <div className={`${styles.fieldWrap} ${styles.disabledInput}`}>
                    <input type="text" value={formData.cedula} disabled />
                  </div>
                </div>

                {/* Nombres */}
                <div className={styles.field}>
                  <label>Nombres *</label>
                  <div className={styles.fieldWrap}>
                    <input
                      type="text" name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      placeholder="Nombres"
                      required
                    />
                  </div>
                </div>

                {/* Apellidos */}
                <div className={styles.field}>
                  <label>Apellidos *</label>
                  <div className={styles.fieldWrap}>
                    <input
                      type="text" name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      placeholder="Apellidos"
                      required
                    />
                  </div>
                </div>

                {/* Fecha nacimiento */}
                <div className={styles.field}>
                  <label>Fecha de nacimiento</label>
                  <div className={styles.fieldWrap}>
                    <input
                      type="date" name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div className={styles.field}>
                  <label>Teléfono</label>
                  <div className={styles.fieldWrap}>
                    <input
                      type="tel" name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Número de teléfono"
                    />
                  </div>
                </div>

                {/* Correo */}
                <div className={styles.field}>
                  <label>Correo electrónico *</label>
                  <div className={styles.fieldWrap}>
                    <input
                      type="email" name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                {/* ── Licencia de conducción (solo clientes) ── */}
                {userRol === 1 && (
                  <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                    <label>¿Tienes licencia de conducción?</label>

                    {/* Toggle Si / No */}
                    <div className={styles.toggleRow}>
                      <button
                        type="button"
                        className={`${styles.toggleBtn} ${tieneLicencia === true ? styles.toggleBtnActive : ''}`}
                        onClick={() => {
                          setTieneLicencia(true);
                          setError(''); setSuccess('');
                        }}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        className={`${styles.toggleBtn} ${tieneLicencia === false ? styles.toggleBtnActive : ''}`}
                        onClick={() => {
                          setTieneLicencia(false);
                          setFormData(prev => ({ ...prev, licenciaConduccion: '' }));
                          setError(''); setSuccess('');
                        }}
                      >
                        No
                      </button>
                    </div>

                    {/* Campo número de licencia, aparece solo si eligió Sí */}
                    {tieneLicencia === true && (
                      <div className={`${styles.fieldWrap} ${styles.licenciaInput}`}>
                        <input
                          type="text"
                          name="licenciaConduccion"
                          value={formData.licenciaConduccion}
                          onChange={handleChange}
                          placeholder="Número de licencia (ej. B1-20345678)"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Sección contraseña ── */}
              <div style={{ marginTop: '1.4rem' }}>
                <div className={styles.divider} />
                <p className={styles.sectionLabel}>
                  Cambiar contraseña{' '}
                  <span className={styles.sectionLabelOptional}>(opcional)</span>
                </p>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label>Nueva contraseña</label>
                    <div className={styles.fieldWrap}>
                      <input
                        type="password" name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Confirmar contraseña</label>
                    <div className={styles.fieldWrap}>
                      <input
                        type="password" name="confirmarContrasena"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        placeholder="Repite tu contraseña"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={saving} className={styles.saveButton}>
                <SaveIcon />
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}