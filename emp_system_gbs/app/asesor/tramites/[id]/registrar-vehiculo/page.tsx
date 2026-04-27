'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../../CSS/Asesor/RegistrarVehiculo.module.css';

export default function RegistrarVehiculoPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const idTramite = params.id as string;
  const idCliente = searchParams.get('idCliente') || '';
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vehiculo, setVehiculo] = useState({
    placa: '',
    marca: '',
    linea: '',
    modelo: '',
    clase: '',
    tipoServicio: '',
    numMotor: '',
    numChasis: '',
    color: ''
  });

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || rol !== '2') {
      router.push('/login');
      return;
    }
    
    if (!idCliente) {
      setError('Falta información del cliente');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setVehiculo({
      ...vehiculo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const vehiculoData = {
      placa: vehiculo.placa.toUpperCase(),
      idCliente: parseInt(idCliente),
      marca: vehiculo.marca,
      linea: vehiculo.linea,
      modelo: parseInt(vehiculo.modelo),
      clase: vehiculo.clase,
      tipoServicio: vehiculo.tipoServicio,
      numMotor: vehiculo.numMotor,
      numChasis: vehiculo.numChasis,
      color: vehiculo.color
    };

    console.log('Registrando vehículo:', vehiculoData);

    try {
      const response = await fetch('http://localhost:8080/api/vehiculos/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculoData)
      });

      const data = await response.json();
      console.log('Respuesta:', data);

      if (response.ok && data.status === 'OK') {
        setSuccess(`Vehículo ${vehiculo.placa} registrado exitosamente`);
        setTimeout(() => {
          router.push(`/asesor/tramites/${idTramite}`);
        }, 2000);
      } else {
        setError(data.mensaje || 'Error al registrar vehículo');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButton}>
          ← Volver al Trámite
        </Link>
        <h1>Registrar Vehículo - Matrícula</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.formCard}>
        <div className={styles.infoBox}>
          <h3>Información del Trámite</h3>
          <p><strong>ID Trámite:</strong> {idTramite}</p>
          <p><strong>ID Cliente:</strong> {idCliente}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Placa *</label>
              <input 
                type="text" 
                name="placa"
                value={vehiculo.placa} 
                onChange={handleChange}
                placeholder="Ej: ABC123"
                required
                maxLength={10}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Marca *</label>
              <input 
                type="text" 
                name="marca"
                value={vehiculo.marca} 
                onChange={handleChange}
                placeholder="Ej: Chevrolet, Renault, Mazda"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Línea *</label>
              <input 
                type="text" 
                name="linea"
                value={vehiculo.linea} 
                onChange={handleChange}
                placeholder="Ej: Spark, Logan, 3"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Modelo *</label>
              <input 
                type="number" 
                name="modelo"
                value={vehiculo.modelo} 
                onChange={handleChange}
                placeholder="Ej: 2020"
                required
                min="1900"
                max="2026"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Clase *</label>
              <select name="clase" value={vehiculo.clase} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                <option value="Automóvil">Automóvil</option>
                <option value="Camioneta">Camioneta</option>
                <option value="Motocicleta">Motocicleta</option>
                <option value="Camión">Camión</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Tipo de Servicio *</label>
              <select name="tipoServicio" value={vehiculo.tipoServicio} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                <option value="Particular">Particular</option>
                <option value="Público">Público</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Número de Motor</label>
              <input 
                type="text" 
                name="numMotor"
                value={vehiculo.numMotor} 
                onChange={handleChange}
                placeholder="Número de motor"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Número de Chasis</label>
              <input 
                type="text" 
                name="numChasis"
                value={vehiculo.numChasis} 
                onChange={handleChange}
                placeholder="Número de chasis"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Color *</label>
              <input 
                type="text" 
                name="color"
                value={vehiculo.color} 
                onChange={handleChange}
                placeholder="Ej: Rojo, Azul, Negro"
                required
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" disabled={submitting} className={styles.saveButton}>
              {submitting ? 'Registrando...' : 'Registrar Vehículo'}
            </button>
            <Link href={`/asesor/tramites/${idTramite}`} className={styles.cancelButton}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}