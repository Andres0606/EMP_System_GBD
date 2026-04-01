'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../CSS/Registro/Registro.module.css';

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellido: '',
    fechaNacimiento: '',
    telefono: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.contrasena) {
      setError('La contraseña es requerida');
      return;
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
    // Convertir la fecha al formato DD/MM/YYYY
    let fechaFormateada = '';
    if (formData.fechaNacimiento) {
      const fecha = new Date(formData.fechaNacimiento);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const anio = fecha.getFullYear();
      fechaFormateada = `${dia}/${mes}/${anio}`;
    }
    
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cedula: parseInt(formData.cedula),
        nombres: formData.nombres,
        apellido: formData.apellido,
        fechaNacimiento: fechaFormateada, // Enviar en formato DD/MM/YYYY
        telefono: formData.telefono ? parseInt(formData.telefono) : null,
        correo: formData.correo,
        contrasena: formData.contrasena
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || 'Error en el registro');
    }

    if (data.status === 'OK') {
      setSuccess('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      throw new Error(data.mensaje || 'Error en el registro');
    }

  } catch (err: any) {
    console.error('Error en registro:', err);
    setError(err.message || 'Error de conexión con el servidor');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Crear cuenta</h1>
        <p className={styles.subtitle}>Regístrate para acceder al sistema</p>

        {error && (
          <div className={styles.errorAlert} role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successAlert} role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Cédula *</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="Número de cédula"
                maxLength={12}
              />
            </div>

            <div className={styles.field}>
              <label>Nombres *</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Tus nombres"
              />
            </div>

            <div className={styles.field}>
              <label>Apellidos *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Tus apellidos"
              />
            </div>

            <div className={styles.field}>
              <label>Fecha de nacimiento *</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Número de teléfono"
              />
            </div>

            <div className={styles.field}>
              <label>Correo electrónico *</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className={styles.field}>
              <label>Contraseña *</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className={styles.field}>
              <label>Confirmar contraseña *</label>
              <input
                type="password"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className={styles.loginLink}>
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
}