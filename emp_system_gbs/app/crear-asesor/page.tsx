'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CrearAsesorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellido: '',
    fechaNacimiento: '',
    telefono: '',
    correo: '',
    contrasena: '',
    especialidadTramite: '',
    sueldo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.cedula.trim()) {
      setError('La cédula es requerida');
      return;
    }
    if (!formData.nombres.trim()) {
      setError('Los nombres son requeridos');
      return;
    }
    if (!formData.apellido.trim()) {
      setError('Los apellidos son requeridos');
      return;
    }
    if (!formData.fechaNacimiento) {
      setError('La fecha de nacimiento es requerida');
      return;
    }
    if (!formData.correo.trim()) {
      setError('El correo es requerido');
      return;
    }
    if (!formData.contrasena.trim()) {
      setError('La contraseña es requerida');
      return;
    }
    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!formData.especialidadTramite) {
      setError('La especialidad es requerida');
      return;
    }
    if (!formData.sueldo.trim()) {
      setError('El sueldo es requerido');
      return;
    }

    setLoading(true);

    try {
      // Formatear fecha a DD/MM/YYYY
      const fecha = new Date(formData.fechaNacimiento);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const anio = fecha.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${anio}`;

      const response = await fetch('http://localhost:8080/api/auth/asesor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cedula: parseInt(formData.cedula),
          nombres: formData.nombres,
          apellido: formData.apellido,
          fechaNacimiento: fechaFormateada,
          telefono: formData.telefono ? parseInt(formData.telefono) : null,
          correo: formData.correo,
          contrasena: formData.contrasena,
          especialidadTramite: formData.especialidadTramite,
          sueldo: parseFloat(formData.sueldo)
        }),
      });

      const data = await response.json();

      if (data.status === 'OK') {
        setSuccess('¡Asesor registrado exitosamente!');
        setFormData({
          cedula: '',
          nombres: '',
          apellido: '',
          fechaNacimiento: '',
          telefono: '',
          correo: '',
          contrasena: '',
          especialidadTramite: '',
          sueldo: ''
        });
        setTimeout(() => {
          router.push('/dashboard-admin');
        }, 2000);
      } else {
        throw new Error(data.mensaje || 'Error al registrar asesor');
      }

    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Registrar Nuevo Asesor</h1>
        <p style={styles.subtitle}>Complete todos los datos del nuevo asesor</p>

        {error && (
          <div style={styles.errorAlert} role="alert">
            {error}
          </div>
        )}

        {success && (
          <div style={styles.successAlert} role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Cédula *</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="Número de cédula"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Nombres *</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Nombres completos"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Apellidos *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellidos completos"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Fecha de Nacimiento *</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Número de teléfono"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Correo Electrónico *</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Contraseña *</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Especialidad *</label>
              <select
                name="especialidadTramite"
                value={formData.especialidadTramite}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Seleccione una especialidad</option>
                <option value="Licencias">Licencias de Conducir</option>
                <option value="Matriculas">Matrículas Vehiculares</option>
                <option value="Impuestos">Impuestos Vehiculares</option>
                <option value="Transferencias">Transferencias de Propiedad</option>
                <option value="Revisiones">Revisiones Técnicas</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Sueldo *</label>
              <input
                type="number"
                name="sueldo"
                value={formData.sueldo}
                onChange={handleChange}
                placeholder="Sueldo mensual"
                step="0.01"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Asesor'}
            </button>
            <Link href="/dashboard-admin" style={styles.cancelBtn}>
              Cancelar
            </Link>
          </div>
        </form>

        <Link href="/dashboard-admin" style={styles.backLink}>
          ← Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}

// Estilos (mantén los mismos que tenías)
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
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  title: {
    color: '#333',
    marginBottom: '0.5rem',
    textAlign: 'center' as const,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  // ✅ AGREGAR ESTA PROPIEDAD
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#333',
    marginBottom: '0.5rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '0.5rem',
    fontSize: '1rem',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    backgroundColor: 'white',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  submitBtn: {
    flex: 1,
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.75rem',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center' as const,
    textDecoration: 'none',
    display: 'inline-block',
  },
  errorAlert: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    borderLeft: '4px solid #dc2626',
  },
  successAlert: {
    backgroundColor: '#d1fae5',
    color: '#059669',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    borderLeft: '4px solid #059669',
  },
  backLink: {
    display: 'block',
    textAlign: 'center' as const,
    marginTop: '1rem',
    color: '#667eea',
    textDecoration: 'none',
  }
};