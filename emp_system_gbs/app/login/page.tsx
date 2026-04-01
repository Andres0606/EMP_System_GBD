'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../CSS/Login/Login.module.css';

/* ── Icons ── */
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IdCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <circle cx="8" cy="12" r="2.5"/>
    <line x1="13" y1="10" x2="19" y2="10"/>
    <line x1="13" y1="14" x2="17" y2="14"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [cedula,   setCedula]   = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [visible,  setVisible]  = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!cedula.trim()) { setError('Ingresa tu número de cédula.'); return; }
    if (!password.trim()) { setError('Ingresa tu contraseña.'); return; }

    setLoading(true);
    // TODO: conectar con tu API de autenticación
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);

    // Simulación: si la cédula tiene 10 dígitos pasa, si no, error
    if (cedula.length >= 6) {
      router.push('/dashboard');
    } else {
      setError('Cédula o contraseña incorrectos. Verifica e intenta de nuevo.');
    }
  };

  return (
    <div className={styles.pg}>
      {/* ── Fondo animado ── */}
      <div className={styles.blobs} aria-hidden>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>
      <div className={styles.grid} aria-hidden />

      {/* ── Layout principal ── */}
      <div className={`${styles.layout} ${visible ? styles.layoutVisible : ''}`}>

        {/* Panel izquierdo — solo desktop ── */}
        <aside className={styles.aside}>
          <div className={styles.asideLogo}>
            <span className={styles.asideLogoMark}><CarIcon /></span>
            <span className={styles.asideLogoText}>Trans<strong>Meta</strong></span>
          </div>

          <div className={styles.asideHero}>
            <h2 className={styles.asideH2}>Gestiona tus<br /><span className={styles.asideAccent}>trámites desde<br />cualquier lugar</span></h2>
            <p className={styles.asideP}>
              Accede a tu panel personal y haz seguimiento de cada trámite en tiempo real. Sin filas, sin esperas.
            </p>
          </div>

          <ul className={styles.asideFeatures}>
            {[
              'Seguimiento en tiempo real',
              'Agente personal asignado',
              'Notificaciones automáticas',
              'Documentos digitales seguros',
            ].map(f => (
              <li key={f} className={styles.asideFeat}>
                <span className={styles.asideFeatIco}><CheckIcon /></span>
                {f}
              </li>
            ))}
          </ul>

          <div className={styles.asideTestiCard}>
            <div className={styles.asideTestiStars}>{'★★★★★'}</div>
            <p className={styles.asideTestiText}>"El traspaso de mi camioneta listo en 3 días. Excelente servicio."</p>
            <div className={styles.asideTestiAuthor}>
              <div className={styles.asideTestiAvatar}>CR</div>
              <div>
                <div className={styles.asideTestiName}>Carlos R.</div>
                <div className={styles.asideTestiCity}>Villavicencio</div>
              </div>
            </div>
          </div>

          <div className={styles.asideBadge}><ShieldIcon /> Plataforma segura · RUNT certificado</div>
        </aside>

        {/* Panel derecho — formulario ── */}
        <main className={styles.formPanel}>
          <div className={styles.formCard}>
            {/* Logo mobile */}
            <div className={styles.mobileLogo}>
              <span className={styles.mobileLogoMark}><CarIcon /></span>
              <span className={styles.mobileLogoText}>Trans<strong>Meta</strong></span>
            </div>

            <div className={styles.formHead}>
              <h1 className={styles.formH1}>¡Bienvenido de nuevo!</h1>
              <p className={styles.formSub}>Accede a tu panel de trámites</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Cédula */}
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="cedula">
                  Número de cédula
                </label>
                <div className={`${styles.fieldRow} ${error && !cedula ? styles.fieldRowError : ''}`}>
                  <span className={styles.fieldIco}><IdCardIcon /></span>
                  <input
                    id="cedula"
                    className={styles.fieldInput}
                    type="text"
                    inputMode="numeric"
                    placeholder="Ej. 1234567890"
                    maxLength={12}
                    value={cedula}
                    onChange={e => {
                      // solo dígitos
                      setCedula(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className={styles.field}>
                <div className={styles.fieldLabelRow}>
                  <label className={styles.fieldLabel} htmlFor="password">Contraseña</label>
                  <a href="/recuperar" className={styles.forgotLink}>¿Olvidaste tu contraseña?</a>
                </div>
                <div className={`${styles.fieldRow} ${error && cedula && !password ? styles.fieldRowError : ''}`}>
                  <span className={styles.fieldIco}><LockIcon /></span>
                  <input
                    id="password"
                    className={styles.fieldInput}
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPwd(v => !v)}
                    aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className={styles.errorBanner} role="alert">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`${styles.submitBtn} ${loading ? styles.submitBtnLoading : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  <>Ingresar <ArrowRightIcon /></>
                )}
              </button>
            </form>

            <div className={styles.divider}>
              <span>¿Aún no tienes cuenta?</span>
            </div>

            <Link href="/registro" className={styles.registerLink}>
              Crear cuenta gratis <ArrowRightIcon />
            </Link>

            <p className={styles.backHome}>
              <Link href="/">← Volver al inicio</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}