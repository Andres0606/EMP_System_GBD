'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../CSS/Vehiculos/Vehiculos.module.css';

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
  </svg>
);

interface Vehiculo {
  placa: string;
  marca: string;
  linea: string;
  modelo: number;
  clase: string;
  tipoServicio: string;
  numMotor: string;
  numChasis: string;
}

export default function VehiculosPage() {
  const router = useRouter();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    linea: '',
    modelo: '',
    clase: '',
    tipoServicio: '',
    numMotor: '',
    numChasis: ''
  });

  const idCliente = typeof window !== 'undefined' ? sessionStorage.getItem('userCedula') : null;

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn || !idCliente) {
      router.push('/login');
      return;
    }
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      console.log("Cargando vehículos para cliente:", idCliente);
      
      const response = await fetch(`http://localhost:8080/api/vehiculos/cliente/${idCliente}`);
      const data = await response.json();
      console.log("Data recibida:", data);
      
      // Siempre mostrar vehículos si vienen en la respuesta
      if (data.vehiculos && Array.isArray(data.vehiculos)) {
        setVehiculos(data.vehiculos);
      } else {
        setVehiculos([]);
      }
      
    } catch (err) {
      console.error('Error detallado:', err);
      setVehiculos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!formData.placa.trim()) {
      setError('La placa es requerida');
      setSubmitting(false);
      return;
    }

    const vehiculoData = {
      placa: formData.placa.toUpperCase(),
      idCliente: parseInt(idCliente!),
      marca: formData.marca,
      linea: formData.linea,
      modelo: formData.modelo ? parseInt(formData.modelo) : null,
      clase: formData.clase,
      tipoServicio: formData.tipoServicio,
      numMotor: formData.numMotor,
      numChasis: formData.numChasis
    };

    try {
      const response = await fetch('http://localhost:8080/api/vehiculos/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiculoData),
      });

      const data = await response.json();

      if (response.ok && data.status === 'OK') {
        setSuccess('¡Vehículo registrado exitosamente!');
        setFormData({
          placa: '', marca: '', linea: '', modelo: '',
          clase: '', tipoServicio: '', numMotor: '', numChasis: ''
        });
        setShowModal(false);
        cargarVehiculos(); // Recargar la lista
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.mensaje || 'Error al registrar vehículo');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión: ' + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando vehículos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          <ArrowLeftIcon /> Volver al Dashboard
        </Link>
        <h1>Mis Vehículos</h1>
        <button onClick={() => setShowModal(true)} className={styles.addButton}>
          <PlusIcon /> Registrar Vehículo
        </button>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      {vehiculos.length === 0 ? (
        <div className={styles.emptyState}>
          <CarIcon />
          <h3>No tienes vehículos registrados</h3>
          <p>Registra tu primer vehículo para comenzar</p>
          <button onClick={() => setShowModal(true)} className={styles.emptyButton}>
            Registrar Vehículo
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {vehiculos.map((vehiculo) => (
            <div key={vehiculo.placa} className={styles.card}>
              <div className={styles.cardHeader}>
                <CarIcon />
                <h3>{vehiculo.marca} {vehiculo.linea}</h3>
              </div>
              <div className={styles.cardContent}>
                <p><strong>Placa:</strong> {vehiculo.placa}</p>
                <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                <p><strong>Clase:</strong> {vehiculo.clase}</p>
                <p><strong>Tipo Servicio:</strong> {vehiculo.tipoServicio}</p>
                <p><strong>Núm. Motor:</strong> {vehiculo.numMotor}</p>
                <p><strong>Núm. Chasis:</strong> {vehiculo.numChasis}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Registrar Vehículo</h2>
              <button onClick={() => setShowModal(false)} className={styles.closeButton}>×</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Placa *</label>
                  <input type="text" name="placa" value={formData.placa} onChange={handleChange} placeholder="ABC123" required />
                </div>
                <div className={styles.field}>
                  <label>Marca</label>
                  <input type="text" name="marca" value={formData.marca} onChange={handleChange} placeholder="Toyota" />
                </div>
                <div className={styles.field}>
                  <label>Línea</label>
                  <input type="text" name="linea" value={formData.linea} onChange={handleChange} placeholder="Corolla" />
                </div>
                <div className={styles.field}>
                  <label>Modelo</label>
                  <input type="number" name="modelo" value={formData.modelo} onChange={handleChange} placeholder="2020" />
                </div>
                <div className={styles.field}>
                  <label>Clase</label>
                  <select name="clase" value={formData.clase} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    <option value="Automóvil">Automóvil</option>
                    <option value="Camioneta">Camioneta</option>
                    <option value="Motocicleta">Motocicleta</option>
                    <option value="Camión">Camión</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Tipo Servicio</label>
                  <select name="tipoServicio" value={formData.tipoServicio} onChange={handleChange}>
                    <option value="">Seleccionar</option>
                    <option value="Particular">Particular</option>
                    <option value="Público">Público</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Núm. Motor</label>
                  <input type="text" name="numMotor" value={formData.numMotor} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                  <label>Núm. Chasis</label>
                  <input type="text" name="numChasis" value={formData.numChasis} onChange={handleChange} />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelButton}>Cancelar</button>
                <button type="submit" disabled={submitting} className={styles.submitButton}>
                  {submitting ? 'Registrando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}