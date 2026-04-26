'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../../CSS/Asesor/EditarVehiculo.module.css';

interface Vehiculo {
  placa: string;
  marca: string;
  linea: string;
  modelo: number;
  clase: string;
  tipoServicio: string;
  numMotor: string;
  numChasis: string;
  color: string;
}

export default function EditarVehiculoPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const idTramite = params.id as string;
  const camposParam = searchParams.get('campos') || '';
  const placaOriginal = searchParams.get('placa') || '';
  
  const [campos, setCampos] = useState<string[]>([]);
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Valores editables según los campos permitidos
  const [nuevoColor, setNuevoColor] = useState('');
  const [nuevoTipoServicio, setNuevoTipoServicio] = useState('');
  const [nuevoNumMotor, setNuevoNumMotor] = useState('');
  const [nuevoNumChasis, setNuevoNumChasis] = useState('');
  const [nuevaPlaca, setNuevaPlaca] = useState('');
  const [nuevaClase, setNuevaClase] = useState('');
  const [nuevoPropietario, setNuevoPropietario] = useState('');

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || rol !== '2') {
      router.push('/login');
      return;
    }
    
    // Parsear campos a editar
    const camposArray = camposParam.split(',');
    setCampos(camposArray);
    
    cargarVehiculo();
  }, []);

  const cargarVehiculo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/vehiculos/${placaOriginal}`);
      const data = await response.json();
      
      if (response.ok && data.status === 'OK') {
        setVehiculo(data.vehiculo);
        
        // Inicializar valores actuales
        if (data.vehiculo.color) setNuevoColor(data.vehiculo.color);
        if (data.vehiculo.tipoServicio) setNuevoTipoServicio(data.vehiculo.tipoServicio);
        if (data.vehiculo.numMotor) setNuevoNumMotor(data.vehiculo.numMotor);
        if (data.vehiculo.numChasis) setNuevoNumChasis(data.vehiculo.numChasis);
        if (data.vehiculo.placa) setNuevaPlaca(data.vehiculo.placa);
        if (data.vehiculo.clase) setNuevaClase(data.vehiculo.clase);
      }
    } catch (error) {
      setError('Error al cargar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const updateData: any = {};
    
    if (campos.includes('color')) updateData.color = nuevoColor;
    if (campos.includes('tipoServicio')) updateData.tipoServicio = nuevoTipoServicio;
    if (campos.includes('numMotor')) updateData.numMotor = nuevoNumMotor;
    if (campos.includes('numChasis')) updateData.numChasis = nuevoNumChasis;
    if (campos.includes('placa')) updateData.placa = nuevaPlaca;
    if (campos.includes('clase')) updateData.clase = nuevaClase;
    if (campos.includes('propietario')) updateData.propietario = nuevoPropietario;

    try {
      const response = await fetch(`http://localhost:8080/api/vehiculos/${placaOriginal}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok && data.status === 'OK') {
        setSuccess('Vehículo actualizado exitosamente');
        setTimeout(() => {
          router.push(`/asesor/tramites/${idTramite}`);
        }, 1500);
      } else {
        setError(data.mensaje || 'Error al actualizar');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loadingContainer}>Cargando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={`/asesor/tramites/${idTramite}`} className={styles.backButton}>
          ← Volver al Trámite
        </Link>
        <h1>Editar Vehículo</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.formCard}>
        <h2>Vehículo: {vehiculo?.placa}</h2>
        
        <form onSubmit={handleSubmit}>
          {campos.includes('color') && (
            <div className={styles.formGroup}>
              <label>Color</label>
              <input 
                type="text" 
                value={nuevoColor} 
                onChange={(e) => setNuevoColor(e.target.value)}
                placeholder="Ej: Rojo"
                required
              />
              <small>Valor actual: {vehiculo?.color || 'No definido'}</small>
            </div>
          )}

          {campos.includes('tipoServicio') && (
            <div className={styles.formGroup}>
              <label>Tipo de Servicio</label>
              <select value={nuevoTipoServicio} onChange={(e) => setNuevoTipoServicio(e.target.value)} required>
                <option value="">Seleccionar</option>
                <option value="Particular">Particular</option>
                <option value="Público">Público</option>
              </select>
              <small>Valor actual: {vehiculo?.tipoServicio || 'No definido'}</small>
            </div>
          )}

          {campos.includes('numMotor') && (
            <div className={styles.formGroup}>
              <label>Número de Motor</label>
              <input 
                type="text" 
                value={nuevoNumMotor} 
                onChange={(e) => setNuevoNumMotor(e.target.value.toUpperCase())}
                required
              />
              <small>Valor actual: {vehiculo?.numMotor || 'No definido'}</small>
            </div>
          )}

          {campos.includes('numChasis') && (
            <div className={styles.formGroup}>
              <label>Número de Chasis</label>
              <input 
                type="text" 
                value={nuevoNumChasis} 
                onChange={(e) => setNuevoNumChasis(e.target.value.toUpperCase())}
                required
              />
              <small>Valor actual: {vehiculo?.numChasis || 'No definido'}</small>
            </div>
          )}

          {campos.includes('placa') && (
            <div className={styles.formGroup}>
              <label>Nueva Placa</label>
              <input 
                type="text" 
                value={nuevaPlaca} 
                onChange={(e) => setNuevaPlaca(e.target.value.toUpperCase())}
                placeholder="Ej: ABC123"
                required
              />
              <small>Placa actual: {vehiculo?.placa}</small>
            </div>
          )}

          {campos.includes('clase') && (
            <div className={styles.formGroup}>
              <label>Clase/Carrocería</label>
              <select value={nuevaClase} onChange={(e) => setNuevaClase(e.target.value)} required>
                <option value="">Seleccionar</option>
                <option value="Automóvil">Automóvil</option>
                <option value="Camioneta">Camioneta</option>
                <option value="Motocicleta">Motocicleta</option>
                <option value="Camión">Camión</option>
              </select>
              <small>Valor actual: {vehiculo?.clase || 'No definido'}</small>
            </div>
          )}

          {campos.includes('propietario') && (
            <div className={styles.formGroup}>
              <label>Nuevo Propietario (Cédula)</label>
              <input 
                type="number" 
                value={nuevoPropietario} 
                onChange={(e) => setNuevoPropietario(e.target.value)}
                placeholder="Cédula del nuevo propietario"
                required
              />
              <small>⚠️ Este cambio actualizará el dueño del vehículo</small>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button type="submit" disabled={submitting} className={styles.saveButton}>
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
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