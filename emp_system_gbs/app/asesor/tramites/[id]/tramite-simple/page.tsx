'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../../CSS/Asesor/TramiteSimple.module.css';

export default function TramiteSimplePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const idTramite = params.id as string;
  const tipo = searchParams.get('tipo') || '';
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Solo para Transformación
  const [tipoTransformacion, setTipoTransformacion] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const rol = sessionStorage.getItem('userRol');
    
    if (!isLoggedIn || rol !== '2') {
      router.push('/login');
      return;
    }
  }, []);

  const getTitulo = () => {
    switch(tipo) {
      case 'Cambio de Carrocería':
        return 'Cambio de Carrocería';
      case 'Duplicado de Placas':
        return 'Duplicado de Placas';
      case 'Transformación':
        return 'Transformación del Vehículo';
      case 'Duplicado de Licencia':
        return 'Duplicado de Licencia de Conducción';
      case 'Otros':
        return 'Otros Trámites';
      default:
        return 'Realizar Trámite';
    }
  };

  const getDescripcion = () => {
    switch(tipo) {
      case 'Cambio de Carrocería':
        return 'Registrar el cambio de tipo de carrocería del vehículo.';
      case 'Duplicado de Placas':
        return 'Generar un duplicado de las placas por pérdida, robo o deterioro.';
      case 'Transformación':
        return 'Registrar modificaciones importantes en el vehículo.';
      case 'Duplicado de Licencia':
        return 'Generar un duplicado de la licencia de conducción.';
      case 'Otros':
        return 'Realizar un trámite no especificado en las categorías anteriores.';
      default:
        return 'Realizar trámite';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Solo actualizar el estado del trámite a Finalizado
    try {
      const response = await fetch('http://localhost:8080/api/tramite/estado', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idTramite: parseInt(idTramite),
          estado: 'Finalizado'
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'OK') {
        let mensaje = '';
        switch(tipo) {
          case 'Cambio de Carrocería':
            mensaje = '✅ Cambio de Carrocería registrado exitosamente';
            break;
          case 'Duplicado de Placas':
            mensaje = '✅ Duplicado de Placas realizado exitosamente';
            break;
          case 'Transformación':
            mensaje = `✅ Transformación registrada: ${tipoTransformacion}`;
            break;
          case 'Duplicado de Licencia':
            mensaje = '✅ Duplicado de Licencia realizado exitosamente';
            break;
          case 'Otros':
            mensaje = '✅ Trámite realizado exitosamente';
            break;
          default:
            mensaje = '✅ Trámite realizado exitosamente';
        }
        setSuccess(mensaje);
        setTimeout(() => {
          router.push(`/asesor/tramites/${idTramite}`);
        }, 2000);
      } else {
        setError(data.mensaje || 'Error al realizar el trámite');
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
        <h1>{getTitulo()}</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.formCard}>
        <div className={styles.infoBox}>
          <h3>📋 Información del Trámite</h3>
          <p><strong>ID Trámite:</strong> {idTramite}</p>
          <p><strong>Tipo:</strong> {tipo}</p>
          <p>{getDescripcion()}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Campos específicos para Transformación */}
          {tipo === 'Transformación' && (
            <>
              <div className={styles.formGroup}>
                <label>Tipo de Transformación *</label>
                <select 
                  value={tipoTransformacion} 
                  onChange={(e) => setTipoTransformacion(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Cambio de Motor">Cambio de Motor</option>
                  <option value="Conversión a Gas">Conversión a Gas Natural Vehicular</option>
                  <option value="Cambio de Carrocería a Blindaje">Cambio de Carrocería a Blindaje</option>
                  <option value="Cambio de Número de Ejes">Cambio de Número de Ejes</option>
                  <option value="Ampliación de Capacidad">Ampliación de Capacidad de Carga</option>
                  <option value="Reducción de Capacidad">Reducción de Capacidad de Carga</option>
                  <option value="Cambio de Color Corporativo">Cambio de Color Corporativo</option>
                  <option value="Instalación de Equipos Especiales">Instalación de Equipos Especiales</option>
                  <option value="Otro">Otro tipo de transformación</option>
                </select>
              </div>

              {tipoTransformacion === 'Otro' && (
                <div className={styles.formGroup}>
                  <label>Especifique la transformación *</label>
                  <input 
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ej: Modificación de sistema eléctrico"
                    required
                  />
                </div>
              )}
            </>
          )}

          {/* Campos específicos para Cambio de Carrocería */}
          {tipo === 'Cambio de Carrocería' && (
            <div className={styles.formGroup}>
              <label>Nueva Carrocería *</label>
              <select required>
                <option value="">Seleccionar</option>
                <option value="Sedán">Sedán</option>
                <option value="Hatchback">Hatchback</option>
                <option value="SUV">SUV</option>
                <option value="Pickup">Pickup</option>
                <option value="Furgón">Furgón</option>
                <option value="Bus">Bus</option>
                <option value="Camión">Camión</option>
              </select>
            </div>
          )}

          {/* Campos específicos para Duplicado de Placas */}
          {tipo === 'Duplicado de Placas' && (
            <div className={styles.formGroup}>
              <label>Motivo *</label>
              <select required>
                <option value="">Seleccionar</option>
                <option value="Pérdida">Pérdida</option>
                <option value="Robo">Robo</option>
                <option value="Deterioro">Deterioro</option>
                <option value="Daño">Daño</option>
              </select>
            </div>
          )}

          {/* Campos específicos para Duplicado de Licencia */}
          {tipo === 'Duplicado de Licencia' && (
            <div className={styles.formGroup}>
              <label>Motivo *</label>
              <select required>
                <option value="">Seleccionar</option>
                <option value="Pérdida">Pérdida</option>
                <option value="Robo">Robo</option>
                <option value="Deterioro">Deterioro</option>
                <option value="Cambio de Datos">Cambio de Datos Personales</option>
              </select>
            </div>
          )}

          {/* Campos específicos para Otros */}
          {tipo === 'Otros' && (
            <div className={styles.formGroup}>
              <label>Descripción del Trámite *</label>
              <textarea
                rows={4}
                placeholder="Describa el trámite a realizar..."
                required
              />
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button type="submit" disabled={submitting} className={styles.realizarButton}>
              {submitting ? 'Procesando...' : 'Realizar Trámite'}
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