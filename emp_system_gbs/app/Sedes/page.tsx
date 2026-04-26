'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Inicio/Header';
import Footer from '../Inicio/Footer';
import styles from '../CSS//Sedes/Sedes.module.css';

/* ── Icons ── */
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.558 4.136 1.535 5.874L.057 23.215a.5.5 0 0 0 .63.63l5.34-1.478A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.95 0-3.77-.525-5.33-1.44l-.38-.226-3.938 1.09 1.09-3.938-.226-.38A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const SEDES = [
  {
    id: 'villavicencio',
    nombre: 'Villavicencio',
    tag: 'Sede Principal',
    principal: true,
    direccion: 'Calle 35 # 28-45, Barrio La Esperanza',
    telefono: '+57 310 000 0001',
    whatsapp: '573100000001',
    correo: 'villavicencio@transmeta.com.co',
    horario: 'Lun – Vie · 8:00 am – 6:00 pm · Sáb 8:00 am – 1:00 pm',
    agentes: 4,
    rating: 4.9,
    tramites: 1200,
    color: 'azul',
    municipio: 'Meta',
    mapsUrl: 'https://maps.google.com/?q=Villavicencio+Meta+Colombia',
  },
  {
    id: 'acacias',
    nombre: 'Acacias',
    tag: 'Sede Regional',
    principal: false,
    direccion: 'Carrera 15 # 12-30, Centro',
    telefono: '+57 310 000 0002',
    whatsapp: '573100000002',
    correo: 'acacias@transmeta.com.co',
    horario: 'Lun – Vie · 8:00 am – 5:00 pm',
    agentes: 2,
    rating: 4.8,
    tramites: 380,
    color: 'verde',
    municipio: 'Meta',
    mapsUrl: 'https://maps.google.com/?q=Acacias+Meta+Colombia',
  },
  {
    id: 'puerto-lopez',
    nombre: 'Puerto López',
    tag: 'Sede Regional',
    principal: false,
    direccion: 'Calle 8 # 5-20, Barrio Centro',
    telefono: '+57 310 000 0003',
    whatsapp: '573100000003',
    correo: 'plopez@transmeta.com.co',
    horario: 'Lun – Vie · 8:00 am – 5:00 pm',
    agentes: 2,
    rating: 4.7,
    tramites: 290,
    color: 'dorado',
    municipio: 'Meta',
    mapsUrl: 'https://maps.google.com/?q=Puerto+Lopez+Meta+Colombia',
  },
  {
    id: 'puerto-gaitan',
    nombre: 'Puerto Gaitán',
    tag: 'Sede Regional',
    principal: false,
    direccion: 'Carrera 4 # 7-15, Centro',
    telefono: '+57 310 000 0004',
    whatsapp: '573100000004',
    correo: 'pgaitan@transmeta.com.co',
    horario: 'Lun – Vie · 8:00 am – 5:00 pm',
    agentes: 1,
    rating: 4.8,
    tramites: 180,
    color: 'azul',
    municipio: 'Meta',
    mapsUrl: 'https://maps.google.com/?q=Puerto+Gaitan+Meta+Colombia',
  },
  {
    id: 'granada',
    nombre: 'Granada',
    tag: 'Sede Regional',
    principal: false,
    direccion: 'Calle 14 # 11-8, Barrio El Centro',
    telefono: '+57 310 000 0005',
    whatsapp: '573100000005',
    correo: 'granada@transmeta.com.co',
    horario: 'Lun – Vie · 8:00 am – 5:00 pm',
    agentes: 1,
    rating: 4.9,
    tramites: 220,
    color: 'verde',
    municipio: 'Meta',
    mapsUrl: 'https://maps.google.com/?q=Granada+Meta+Colombia',
  },
];

export default function SedesPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [activeSede, setActiveSede] = useState(SEDES[0].id);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const sede = SEDES.find(s => s.id === activeSede)!;

  return (
    <div className={styles.pg}>
      <Header />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.blobs} aria-hidden>
          <div className={`${styles.blob} ${styles.blob1}`} />
          <div className={`${styles.blob} ${styles.blob2}`} />
          <div className={`${styles.blob} ${styles.blob3}`} />
        </div>
        <div className={styles.grid} aria-hidden />
        <div className={`${styles.heroInner} ${visible ? styles.heroVisible : ''}`}>
          <span className={styles.eyebrow}>Dónde estamos</span>
          <h1 className={styles.h1}>5 sedes en el<br /><span className={styles.h1Grad}>departamento del Meta</span></h1>
          <p className={styles.heroP}>Estamos presentes en los municipios más importantes del departamento para atenderte cerca de donde vives o trabajas.</p>
        </div>
        <div className={styles.wave} aria-hidden>
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
            <path d="M0,35 C240,70 480,0 720,35 C960,70 1200,0 1440,35 L1440,70 L0,70 Z" fill="#F4F8FF" />
          </svg>
        </div>
      </section>

      {/* ── SELECTOR + DETALLE ── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          {/* Tabs */}
          <div className={styles.tabs}>
            {SEDES.map(s => (
              <button
                key={s.id}
                className={`${styles.tab} ${activeSede === s.id ? styles.tabActive : ''} ${styles[`tc_${s.color}`]}`}
                onClick={() => setActiveSede(s.id)}
              >
                <MapPinIcon />
                <span>{s.nombre}</span>
                {s.principal && <span className={styles.tabBadge}>Principal</span>}
              </button>
            ))}
          </div>

          {/* Detalle de sede */}
          <div className={styles.detail} key={sede.id}>
            <div className={styles.detailLeft}>
              <div className={styles.detailHeader}>
                <div>
                  <span className={`${styles.detailTag} ${styles[`dt_${sede.color}`]}`}>{sede.tag}</span>
                  <h2 className={styles.detailName}>{sede.nombre}</h2>
                  <p className={styles.detailMunicipio}>{sede.municipio}, Colombia</p>
                </div>
                <div className={styles.detailRating}>
                  <StarIcon />
                  <span>{sede.rating}</span>
                </div>
              </div>

              <ul className={styles.detailInfo}>
                <li>
                  <span className={styles.infoIco}><MapPinIcon /></span>
                  <div>
                    <span className={styles.infoLabel}>Dirección</span>
                    <span className={styles.infoVal}>{sede.direccion}</span>
                  </div>
                </li>
                <li>
                  <span className={styles.infoIco}><PhoneIcon /></span>
                  <div>
                    <span className={styles.infoLabel}>Teléfono</span>
                    <a href={`tel:${sede.telefono}`} className={styles.infoVal}>{sede.telefono}</a>
                  </div>
                </li>
                <li>
                  <span className={styles.infoIco}><MailIcon /></span>
                  <div>
                    <span className={styles.infoLabel}>Correo</span>
                    <a href={`mailto:${sede.correo}`} className={styles.infoVal}>{sede.correo}</a>
                  </div>
                </li>
                <li>
                  <span className={styles.infoIco}><ClockIcon /></span>
                  <div>
                    <span className={styles.infoLabel}>Horario de atención</span>
                    <span className={styles.infoVal}>{sede.horario}</span>
                  </div>
                </li>
              </ul>

              <div className={styles.detailStats}>
                <div className={styles.dStat}>
                  <strong>{sede.agentes}</strong>
                  <span>Agente{sede.agentes > 1 ? 's' : ''} certificado{sede.agentes > 1 ? 's' : ''}</span>
                </div>
                <div className={styles.dStat}>
                  <strong>{sede.tramites}+</strong>
                  <span>Trámites realizados</span>
                </div>
                <div className={styles.dStat}>
                  <strong>{sede.rating} ★</strong>
                  <span>Calificación</span>
                </div>
              </div>

              <div className={styles.detailActions}>
                <a
                  href={`https://wa.me/${sede.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnWa}
                >
                  <WhatsappIcon /> Escribir por WhatsApp
                </a>
                <a
                  href={sede.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnMaps}
                >
                  <MapPinIcon /> Ver en Maps
                </a>
              </div>
            </div>

            {/* Mapa placeholder */}
            <div className={styles.detailMap}>
              <div className={styles.mapPlaceholder}>
                <div className={styles.mapPin}><MapPinIcon /></div>
                <p className={styles.mapName}>{sede.nombre}</p>
                <p className={styles.mapAddr}>{sede.direccion}</p>
                <a
                  href={sede.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  Abrir en Google Maps <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TODAS LAS SEDES GRID ── */}
      <section className={styles.allSection}>
        <div className={styles.inner}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionH2}>Todas nuestras sedes</h2>
            <p className={styles.sectionDesc}>Elige la sede más cercana a tu municipio.</p>
          </div>
          <div className={styles.sedesGrid}>
            {SEDES.map((s, i) => (
              <button
                key={s.id}
                className={`${styles.sedeCard} ${styles[`sc_${s.color}`]} ${activeSede === s.id ? styles.sedeCardActive : ''}`}
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => { setActiveSede(s.id); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              >
                <div className={styles.sedeCardIco}><MapPinIcon /></div>
                <h3 className={styles.sedeCardName}>{s.nombre}</h3>
                <p className={styles.sedeCardAddr}>{s.direccion}</p>
                <div className={styles.sedeCardMeta}>
                  <span><ClockIcon /> Lun–Vie</span>
                  <span>★ {s.rating}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className={styles.cta}>
        <div className={styles.ctaGfx} aria-hidden>
          <div className={`${styles.ctaBlob} ${styles.ctaBlob1}`} />
          <div className={`${styles.ctaBlob} ${styles.ctaBlob2}`} />
        </div>
        <div className={styles.ctaText}>
          <h2>¿Listo para empezar tu trámite?</h2>
          <p>Crea tu cuenta y un agente de tu municipio te contactará hoy.</p>
        </div>
        <div className={styles.ctaBtns}>
          <button className={styles.btnWhite} onClick={() => router.push('/registro')}>
            Crear cuenta gratis <ArrowIcon />
          </button>
          <a href="tel:+573100000000" className={styles.btnGhostW}>
            <PhoneIcon /> Llamar ahora
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}