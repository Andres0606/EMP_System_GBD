'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Inicio/Header';
import Footer from '../Inicio/Footer';
import styles from '../CSS//Nosotros/Nosotros.module.css';

/* ── Icons ── */
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
  </svg>
);
const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const VALORES = [
  { icon: <ShieldIcon />, color: 'azul', title: 'Transparencia', desc: 'Precios claros antes de comenzar, sin cobros ocultos ni sorpresas al final del proceso.' },
  { icon: <ZapIcon />,   color: 'verde', title: 'Eficiencia', desc: 'Optimizamos cada trámite para que obtengas tu resultado en el menor tiempo posible.' },
  { icon: <HeartIcon />, color: 'dorado', title: 'Compromiso', desc: 'Tu trámite es nuestra prioridad. Un agente personal asignado de inicio a fin.' },
  { icon: <TargetIcon />, color: 'azul', title: 'Precisión', desc: 'Cero errores en la documentación. Verificamos cada detalle antes de radicar.' },
];

const TIMELINE = [
  { year: '2018', title: 'Fundación en Villavicencio', desc: 'TransMeta nace con un equipo de 3 personas y una visión: simplificar los trámites de tránsito en el llano.' },
  { year: '2019', title: 'Expansión a Acacias y Granada', desc: 'Abrimos nuestras primeras sedes regionales, atendiendo a más ciudadanos del Meta.' },
  { year: '2021', title: 'Plataforma digital', desc: 'Lanzamos nuestro sistema de seguimiento en tiempo real, permitiendo que los clientes vean el estado de su trámite desde el celular.' },
  { year: '2022', title: 'Sedes en Puerto López y Puerto Gaitán', desc: 'Completamos nuestra presencia en los 5 municipios clave del departamento.' },
  { year: '2024', title: '2.800+ trámites realizados', desc: 'Superamos los 2.800 trámites exitosos y un 98% de satisfacción de nuestros clientes.' },
];

const AGENTES = [
  { nombre: 'Carlos Medina', cargo: 'Asesor Principal · Villavicencio', exp: '6 años', tramites: '1.200+', rating: 4.9, iniciales: 'CM' },
  { nombre: 'Laura Gómez', cargo: 'Asesora · Acacias', exp: '4 años', tramites: '380+', rating: 4.8, iniciales: 'LG' },
  { nombre: 'Jorge Salcedo', cargo: 'Asesor · Puerto López', exp: '3 años', tramites: '290+', rating: 4.7, iniciales: 'JS' },
  { nombre: 'María Torres', cargo: 'Asesora · Granada', exp: '3 años', tramites: '220+', rating: 4.9, iniciales: 'MT' },
  { nombre: 'Andrés Ruiz', cargo: 'Asesor · Puerto Gaitán', exp: '2 años', tramites: '180+', rating: 4.8, iniciales: 'AR' },
];

const FAQS = [
  { q: '¿Cuánto cuesta usar TransMeta?', a: 'Nuestros honorarios dependen del tipo de trámite. Siempre te informamos el costo total antes de empezar. No hay cobros ocultos ni sorpresas.' },
  { q: '¿Tengo que ir personalmente a las oficinas de tránsito?', a: 'No. En la mayoría de los casos, nuestro agente gestiona todo por ti. Solo necesitas enviarnos los documentos requeridos.' },
  { q: '¿Cómo puedo hacer seguimiento a mi trámite?', a: 'Una vez creada tu cuenta, puedes ver el estado de tu trámite en tiempo real desde cualquier dispositivo.' },
  { q: '¿Qué pasa si me rechazan el trámite?', a: 'No cobramos si el trámite no es exitoso por causas a nuestro cargo. En caso de documentos faltantes, te avisamos antes de radicar.' },
  { q: '¿Atienden municipios fuera del Meta?', a: 'Por ahora operamos exclusivamente en el departamento del Meta. Estamos en expansión y pronto llegaremos a nuevas regiones.' },
  { q: '¿Los agentes están certificados?', a: 'Sí. Todos nuestros agentes están certificados y registrados ante el RUNT (Registro Único Nacional de Tránsito).' },
];

export default function NosotrosPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

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
          <span className={styles.eyebrow}>Quiénes somos</span>
          <h1 className={styles.h1}>Nacimos en el Meta<br /><span className={styles.h1Grad}>para servir al Meta</span></h1>
          <p className={styles.heroP}>
            TransMeta es una empresa de gestión de trámites vehiculares fundada en Villavicencio en 2018. Nuestra misión: que ningún ciudadano del llano pierda un día en filas.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPrimary} onClick={() => router.push('/registro')}>
              Crear cuenta gratis <ArrowIcon />
            </button>
          </div>
        </div>
        <div className={styles.wave} aria-hidden>
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
            <path d="M0,35 C240,70 480,0 720,35 C960,70 1200,0 1440,35 L1440,70 L0,70 Z" fill="#F4F8FF" />
          </svg>
        </div>
      </section>

      {/* ── VALORES ── */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow2}>Nuestros valores</span>
            <h2 className={styles.sectionH2}>Lo que nos guía<br /><span className={styles.sectionGrad}>cada día</span></h2>
          </div>
          <div className={styles.valoresGrid}>
            {VALORES.map((v, i) => (
              <div key={v.title} className={`${styles.valorCard} ${styles[`vc_${v.color}`]}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.valorIco}>{v.icon}</div>
                <h3 className={styles.valorTitle}>{v.title}</h3>
                <p className={styles.valorDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HISTORIA / TIMELINE ── */}
      <section className={styles.timelineSection}>
        <div className={styles.timelineBg} aria-hidden />
        <div className={styles.inner}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow2}>Nuestra historia</span>
            <h2 className={styles.sectionH2}>6 años<br /><span className={styles.sectionGrad}>transformando trámites</span></h2>
          </div>
          <div className={styles.timeline}>
            {TIMELINE.map((item, i) => (
              <div key={item.year} className={`${styles.tlItem} ${i % 2 === 0 ? styles.tlLeft : styles.tlRight}`}>
                <div className={styles.tlCard}>
                  <span className={styles.tlYear}>{item.year}</span>
                  <h3 className={styles.tlTitle}>{item.title}</h3>
                  <p className={styles.tlDesc}>{item.desc}</p>
                </div>
                <div className={styles.tlDot} />
              </div>
            ))}
            <div className={styles.tlLine} />
          </div>
        </div>
      </section>

      {/* ── AGENTES ── */}
      <section id="agentes" className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow2}>Nuestro equipo</span>
            <h2 className={styles.sectionH2}>Los agentes que<br /><span className={styles.sectionGrad}>hacen posible todo</span></h2>
            <p className={styles.sectionDesc}>10 agentes certificados RUNT distribuidos en 5 municipios del Meta.</p>
          </div>
          <div className={styles.agentesGrid}>
            {AGENTES.map((a, i) => (
              <div key={a.nombre} className={styles.agenteCard} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={styles.agenteAvatar}>{a.iniciales}</div>
                <div className={styles.agenteRating}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <StarIcon key={j} />
                  ))}
                  <span>{a.rating}</span>
                </div>
                <h3 className={styles.agenteNombre}>{a.nombre}</h3>
                <p className={styles.agenteCargo}>{a.cargo}</p>
                <div className={styles.agenteMeta}>
                  <div className={styles.agenteMetaItem}><strong>{a.exp}</strong><span>Experiencia</span></div>
                  <div className={styles.agenteMetaItem}><strong>{a.tramites}</strong><span>Trámites</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className={styles.faqSection}>
        <div className={styles.faqBg} aria-hidden />
        <div className={styles.inner}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow2}>FAQ</span>
            <h2 className={styles.sectionH2}>Preguntas<br /><span className={styles.sectionGrad}>frecuentes</span></h2>
          </div>
          <div className={styles.faqList}>
            {FAQS.map((faq, i) => (
              <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}>
                <button className={styles.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className={`${styles.faqChevron} ${openFaq === i ? styles.faqChevronOpen : ''}`}>
                    <ChevronIcon />
                  </span>
                </button>
                {openFaq === i && (
                  <div className={styles.faqA}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
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
          <h2>¿Listo para gestionar tu trámite?</h2>
          <p>Crea tu cuenta gratis y un agente de tu municipio te atiende hoy.</p>
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