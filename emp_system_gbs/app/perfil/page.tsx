'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../CSS/Perfil/Perfil.module.css';

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

export default function PerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRol, setUserRol] = useState<number>(1); // 👈 NUEVO: guardar el rol
  
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellido: '',
    fechaNacimiento: '',
    telefono: '',
    correo: '',
    licenciaConduccion: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const cedula = sessionStorage.getItem('userCedula');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || !cedula) {
      router.push('/login');
      return;
    }
    
    setUserRol(rol ? parseInt(rol) : 1); // 👈 Guardar el rol
    cargarPerfil(cedula);
  }, []);

  const cargarPerfil = async (cedula: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/auth/perfil/${cedula}`);
      const data = await response.json();
      
      if (response.ok && data.status === 'OK') {
        setFormData({
          cedula: data.cedula || '',
          nombres: data.nombres || '',
          apellido: data.apellido || '',
          fechaNacimiento: data.fechaNacimiento || '',
          telefono: data.telefono || '',
          correo: data.correo || '',
          licenciaConduccion: data.licenciaConduccion || '',
          contrasena: '',
          confirmarContrasena: ''
        });
      } else {
        setError(data.mensaje || 'Error al cargar perfil');
      }
    } catch (err) {
      console.error('Error:', err);
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

  // 👈 NUEVA FUNCIÓN: obtener la ruta de redirección según el rol
  const getRedirectPath = () => {
    switch(userRol) {
      case 1: return '/dashboard';
      case 2: return '/dashboard-asesor';
      case 3: return '/dashboard-admin';
      default: return '/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Validar contraseñas si se quiere cambiar
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

    const updateData: any = {
      cedula: parseInt(formData.cedula),
      nombres: formData.nombres,
      apellido: formData.apellido,
      correo: formData.correo,
      licenciaConduccion: formData.licenciaConduccion || null
    };

    if (formData.fechaNacimiento) {
      updateData.fechaNacimiento = formData.fechaNacimiento;
    }

    if (formData.telefono) {
      updateData.telefono = parseInt(formData.telefono);
    }

    if (formData.contrasena) {
      updateData.contrasena = formData.contrasena;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok && data.status === 'OK') {
        setSuccess('Perfil actualizado exitosamente');
        
        // Actualizar sessionStorage
        sessionStorage.setItem('userNombres', formData.nombres);
        sessionStorage.setItem('userApellido', formData.apellido);
        sessionStorage.setItem('userCorreo', formData.correo);
        
        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          contrasena: '',
          confirmarContrasena: ''
        }));
        
        // 👈 REDIRIGIR SEGÚN EL ROL
        setTimeout(() => {
          router.push(getRedirectPath());
        }, 2000);
      } else {
        setError(data.mensaje || 'Error al actualizar perfil');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setSaving(false);
    }
  };

  // 👈 NUEVO: botón de volver según el rol
  const getBackButtonPath = () => {
    switch(userRol) {
      case 1: return '/dashboard';
      case 2: return '/dashboard-asesor';
      case 3: return '/dashboard-admin';
      default: return '/dashboard';
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={getBackButtonPath()} className={styles.backButton}>
          <ArrowLeftIcon /> Volver al Dashboard
        </Link>
        <h1>Mi Perfil</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.perfilCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Cédula</label>
              <input type="text" value={formData.cedula} disabled className={styles.disabledInput} />
            </div>

            <div className={styles.field}>
              <label>Nombres *</label>
              <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
            </div>

            <div className={styles.field}>
              <label>Apellidos *</label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
            </div>

            <div className={styles.field}>
              <label>Fecha de Nacimiento</label>
              <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
            </div>

            <div className={styles.field}>
              <label>Teléfono</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Número de teléfono" />
            </div>

            <div className={styles.field}>
              <label>Correo electrónico *</label>
              <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
            </div>

            {/* Mostrar campo de licencia solo si es cliente (rol 1) */}
            {userRol === 1 && (
              <div className={styles.field}>
                <label>Licencia de Conducción</label>
                <input type="text" name="licenciaConduccion" value={formData.licenciaConduccion} onChange={handleChange} placeholder="Número de licencia" />
              </div>
            )}

            <div className={styles.field}>
              <label>Nueva Contraseña (opcional)</label>
              <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
            </div>

            <div className={styles.field}>
              <label>Confirmar Nueva Contraseña</label>
              <input type="password" name="confirmarContrasena" value={formData.confirmarContrasena} onChange={handleChange} placeholder="Repite tu contraseña" />
            </div>
          </div>

          <button type="submit" disabled={saving} className={styles.saveButton}>
            <SaveIcon /> {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}