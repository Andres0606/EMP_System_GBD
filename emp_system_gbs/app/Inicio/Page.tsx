'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import styles from '../CSS/Inicio/Inicio.module.css';

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
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
  </svg>
);
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h12l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
  </svg>
);
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
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
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ThumbsUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);

/* ── Animated counter ── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref  = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let v = 0;
        const step = Math.ceil(to / 60);
        const t = setInterval(() => {
          v = Math.min(v + step, to);
          setVal(v);
          if (v >= to) clearInterval(t);
        }, 24);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ── Data ── */
const STATS = [
  { n: 2800, s: '+', l: 'Trámites realizados' },
  { n: 5,    s: '',  l: 'Municipios' },
  { n: 10,   s: '',  l: 'Agentes certificados' },
  { n: 98,   s: '%', l: 'Satisfacción' },
] as const;

const CHIPS = ['Sin filas', 'Precio claro', 'Seguimiento en tiempo real'];

const SERVICES = [
  {
    icon: <FileIcon />,
    color: 'azul',
    title: 'Matrícula & Registro',
    desc: 'Registra tu vehículo nuevo o usado con toda la documentación correcta. Te guiamos en cada paso.',
    time: '1–2 días hábiles',
    href: '/servicios#matricula',
  },
  {
    icon: <RefreshIcon />,
    color: 'verde',
    title: 'Traspaso de Vehículo',
    desc: 'Cambio de propietario sin complicaciones. Verificamos el estado del vehículo antes de tramitar.',
    time: '2–3 días hábiles',
    href: '/servicios#traspaso',
  },
  {
    icon: <CarIcon />,
    color: 'dorado',
    title: 'Traslado de Matrícula',
    desc: 'Mudaste al Meta? Traslada tu matrícula a Villavicencio u otro municipio del departamento.',
    time: '1–2 días hábiles',
    href: '/servicios#traslado',
  },
  {
    icon: <CopyIcon />,
    color: 'azul',
    title: 'Duplicado de Placas',
    desc: 'Pérdida, robo o deterioro. Obtenemos tus nuevas placas con el mínimo de trámites posible.',
    time: '1 día hábil',
    href: '/servicios#duplicado',
  },
] as const;

const WHY_ITEMS = [
  {
    icon: <MapPinIcon />,
    title: '5 sedes en el Meta',
    desc: 'Presentes en Villavicencio, Acacias, Puerto López, Puerto Gaitán y Granada para atenderte cerca.',
  },
  {
    icon: <ClockIcon />,
    title: 'Respuesta el mismo día',
    desc: 'Recibe confirmación de tu trámite el mismo día. Sin esperas innecesarias ni citas eternas.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Agentes certificados RUNT',
    desc: 'Todos nuestros agentes están certificados y verificados ante el Registro Único Nacional de Tránsito.',
  },
  {
    icon: <ThumbsUpIcon />,
    title: 'Precio claro, sin sorpresas',
    desc: 'Te decimos exactamente cuánto vale tu trámite antes de comenzar. Sin cobros ocultos.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Carlos Rodríguez',
    city: 'Villavicencio',
    stars: 5,
    text: 'Hice el traspaso de mi camioneta en menos de 3 días. El agente me explicó todo con calma y no tuve que ir a ninguna oficina de tránsito. Excelente servicio.',
    tramite: 'Traspaso de vehículo',
    initials: 'CR',
  },
  {
    name: 'Luisa Martínez',
    city: 'Acacias',
    stars: 5,
    text: 'Llevaba meses con el problema de mis placas deterioradas. TransMeta lo resolvió en un día. El seguimiento en tiempo real es increíble, siempre supe en qué paso iba.',
    tramite: 'Duplicado de placas',
    initials: 'LM',
  },
  {
    name: 'Jorge Peña',
    city: 'Puerto López',
    stars: 5,
    text: 'Me ayudaron con la matrícula de mi moto nueva. Precio justo, sin cobros raros. Lo recomiendo a todos los del llano que no quieran perder el día en tránsito.',
    tramite: 'Matrícula nueva',
    initials: 'JP',
  },
];

/* ── Page ── */
export default function HomePage() {
  const router  = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className={styles.pg}>
      {/* Header recibe la navegación — ya no abre modal */}
      <Header onLoginClick={() => router.push('/login')} />

      {/* ── HERO ── */}
      <section id="inicio" className={styles.hero}>
        <div className={styles.blobs} aria-hidden>
          <div className={`${styles.blob} ${styles.blob1}`} />
          <div className={`${styles.blob} ${styles.blob2}`} />
          <div className={`${styles.blob} ${styles.blob3}`} />
          <div className={`${styles.blob} ${styles.blob4}`} />
        </div>
        <div className={styles.grid} aria-hidden />

        <div className={`${styles.heroInner} ${visible ? styles.heroVisible : ''}`}>
          <div className={styles.heroCopy}>
            <div className={styles.pill}>
              <span className={styles.pillDot} />
              Especialistas en trámites · Meta, Colombia
            </div>
            <h1 className={styles.h1}>
              Tus trámites<br />
              de tránsito,<br />
              <span className={styles.h1Gradient}>sin complicaciones.</span>
            </h1>
            <p className={styles.heroP}>
              10 agentes certificados en 5 municipios del Meta. Matrícula,
              traspasos, duplicados y más — rápido, claro y sin filas.
            </p>
            <div className={styles.heroBtns}>
              <button className={styles.btnPrimary} onClick={() => scrollTo('servicios')}>
                Ver servicios <ArrowIcon />
              </button>
              {/* ← Redirige a /registro */}
              <button className={styles.btnGhost} onClick={() => router.push('/registro')}>
                Crear cuenta gratis
              </button>
            </div>
            <div className={styles.chips}>
              {CHIPS.map(c => (
                <span key={c} className={styles.chip}><CheckIcon />{c}</span>
              ))}
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.hcard}>
              <div className={styles.hcardHead}>
                <div className={styles.hcardIco}><FileIcon /></div>
                <div>
                  <div className={styles.hcardName}>Traspaso de vehículo</div>
                  <div className={styles.hcardMeta}>Villav. · Carlos Rodríguez</div>
                </div>
                <span className={styles.hcardStatus}>En curso</span>
              </div>
              <div className={styles.hcardSteps}>
                {['Recibido', 'Radicado', 'Aprobación', 'Listo'].map((s, i) => (
                  <div key={s} className={`${styles.hcardStep} ${i < 2 ? styles.stepDone : i === 2 ? styles.stepCur : ''}`}>
                    <div className={styles.stepDot} />
                    {i < 3 && <div className={styles.stepLine} />}
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              <div className={styles.progRow}><span>Progreso</span><span>68%</span></div>
              <div className={styles.progBar}><div className={styles.progFill} /></div>
            </div>
            <div className={`${styles.fpill} ${styles.fpillA}`}><ZapIcon /><span>Rápido</span></div>
            <div className={`${styles.fpill} ${styles.fpillB}`}><StarIcon /><span>4.9 ★</span></div>
            <div className={`${styles.fpill} ${styles.fpillC}`}>
              <span className={styles.fpillNum}>500+</span>
              <span>trámites/mes</span>
            </div>
          </div>
        </div>

        <div className={styles.wave} aria-hidden>
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
            <path d="M0,35 C240,70 480,0 720,35 C960,70 1200,0 1440,35 L1440,70 L0,70 Z" fill="#F4F8FF" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className={styles.statsBar}>
        {STATS.map(({ n, s, l }) => (
          <div key={l} className={styles.statItem}>
            <strong><Counter to={n} suffix={s} /></strong>
            <span>{l}</span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
          SERVICIOS
      ══════════════════════════════════════ */}
      <section id="servicios" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Lo que hacemos</span>
            <h2 className={styles.sectionH2}>Trámites vehiculares<br /><span className={styles.sectionH2Accent}>sin filas ni papeleos</span></h2>
            <p className={styles.sectionDesc}>
              Gestionamos todos tus trámites de tránsito en el departamento del Meta. Un agente certificado te atiende desde la primera consulta hasta la entrega.
            </p>
          </div>

          <div className={styles.servGrid}>
            {SERVICES.map((s) => (
              <a key={s.title} href={s.href} className={`${styles.servCard} ${styles[`servCard_${s.color}`]}`}>
                <div className={styles.servCardIco}>{s.icon}</div>
                <h3 className={styles.servCardTitle}>{s.title}</h3>
                <p className={styles.servCardDesc}>{s.desc}</p>
                <div className={styles.servCardFooter}>
                  <span className={styles.servCardTime}><ClockIcon />{s.time}</span>
                  <span className={styles.servCardArrow}><ArrowIcon /></span>
                </div>
              </a>
            ))}
          </div>

          <div className={styles.servCta}>
            <p>¿No encuentras tu trámite?</p>
            <a href="/servicios" className={styles.servCtaLink}>Ver todos los servicios <ArrowIcon /></a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          POR QUÉ NOSOTROS
      ══════════════════════════════════════ */}
      <section className={styles.whySection}>
        <div className={styles.whyBg} aria-hidden />
        <div className={styles.sectionInner}>
          <div className={styles.whyGrid}>
            <div className={styles.whyLeft}>
              <span className={styles.sectionEyebrow}>¿Por qué TransMeta?</span>
              <h2 className={styles.sectionH2}>La forma más fácil<br /><span className={styles.sectionH2Accent}>de tramitar en el Meta</span></h2>
              <p className={styles.sectionDesc}>
                Nacimos en Villavicencio para resolver el problema que todos conocemos: horas perdidas en filas, papeles equivocados y costos opacos. Hoy somos el aliado de confianza de miles de ciudadanos del llano.
              </p>
              <ul className={styles.whyList}>
                <li><span className={styles.whyCheck}><CheckIcon /></span>Sin desplazarte a oficinas de tránsito</li>
                <li><span className={styles.whyCheck}><CheckIcon /></span>Seguimiento en tiempo real desde tu celular</li>
                <li><span className={styles.whyCheck}><CheckIcon /></span>Agente personal asignado a tu caso</li>
                <li><span className={styles.whyCheck}><CheckIcon /></span>Factura oficial con todos los cobros detallados</li>
              </ul>
              {/* ← Redirige a /registro */}
              <button className={styles.btnPrimary} onClick={() => router.push('/registro')}>
                Empezar ahora <ArrowIcon />
              </button>
            </div>

            <div className={styles.whyRight}>
              {WHY_ITEMS.map((item, i) => (
                <div key={item.title} className={styles.whyCard} style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className={styles.whyCardIco}>{item.icon}</span>
                  <div>
                    <h4 className={styles.whyCardTitle}>{item.title}</h4>
                    <p className={styles.whyCardDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIOS
      ══════════════════════════════════════ */}
      <section className={styles.testiSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Testimonios</span>
            <h2 className={styles.sectionH2}>Lo que dicen<br /><span className={styles.sectionH2Accent}>nuestros clientes</span></h2>
          </div>

          <div className={styles.testiGrid}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className={styles.testiCard}>
                <div className={styles.testiStars}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p className={styles.testiText}>"{t.text}"</p>
                <div className={styles.testiFooter}>
                  <div className={styles.testiAvatar}>{t.initials}</div>
                  <div>
                    <div className={styles.testiName}>{t.name}</div>
                    <div className={styles.testiMeta}>{t.city} · {t.tramite}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
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
          {/* ← Redirige a /registro */}
          <button className={styles.btnWhite} onClick={() => router.push('/registro')}>
            Crear cuenta gratis <ArrowIcon />
          </button>
          <button className={styles.btnGhostW}>
            <PhoneIcon /> Llamar ahora
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}