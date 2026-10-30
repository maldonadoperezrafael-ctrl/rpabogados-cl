import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'
import { useLocation } from 'react-router'
import ContactForm from '@/components/ContactForm'
import EditorialList from '@/components/EditorialList'
import FaqList from '@/components/FaqList'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { practiceAreas } from '@/data/areas'
import { useAnalytics } from '@/lib/analytics'
import { usePageMeta } from '@/lib/pageMeta'
import '../App.css'
import './Home.overrides.css'

const areas = practiceAreas

const method = [
  {
    title: 'Escuchar antes de concluir',
    text: 'Partimos por comprender los hechos, el contexto y aquello que realmente está en juego para ti o tu empresa.',
  },
  {
    title: 'Leer el riesgo',
    text: 'Revisamos antecedentes, escenarios y puntos críticos para tomar decisiones con información, no por impulso.',
  },
  {
    title: 'Diseñar la respuesta',
    text: 'Construimos una estrategia jurídica proporcional al conflicto, con objetivos y prioridades claramente definidos.',
  },
  {
    title: 'Sostener el seguimiento',
    text: 'Comunicamos los hitos relevantes y mantenemos una lectura activa del caso durante su desarrollo.',
  },
]

const brandLogo = '/marca/rp-abogados-logo-claro.svg'
const regions = ['Región Metropolitana', 'Región de O’Higgins']
const whatsappFor = (region: string) =>
  `https://wa.me/56985497497?text=${encodeURIComponent(`Hola RP Abogados, quisiera solicitar una evaluación inicial en la ${region}.`)}`

const generalFaqs = [
  { question: '¿Solicitar una evaluación significa contratar al estudio?', answer: 'No. El primer contacto permite comprender la situación y determinar si la firma puede ayudarte. El alcance del trabajo y sus condiciones se conversan posteriormente.' },
  { question: '¿Qué conviene contar en el primer mensaje?', answer: 'Una cronología breve, la etapa del conflicto, las partes involucradas y cualquier fecha o actuación próxima. No es necesario enviar todos los documentos en el primer contacto.' },
  { question: '¿La atención es presencial o telemática?', answer: 'Ambas modalidades están disponibles. La coordinación depende de la naturaleza del caso y de la región desde la que consultas.' },
  { question: '¿Dónde atiende RP Abogados?', answer: 'La cobertura informada en este sitio comprende la Región Metropolitana y la Región de O’Higgins, con atención para personas y empresas.' },
  { question: '¿Se pueden anticipar honorarios o resultados desde el formulario?', answer: 'No. Los honorarios y el alcance requieren una revisión previa del asunto. Tampoco es posible garantizar el resultado de una gestión o de un juicio.' },
]

export default function Home() {
  const { search } = useLocation()
  const track = useAnalytics()
  const requestedArea = new URLSearchParams(search).get('area')
  const initialArea = areas.find((area) => area.slug === requestedArea || area.title === requestedArea)?.title || ''
  const [activeArea, setActiveArea] = useState(0)
  const [mapVisible, setMapVisible] = useState(false)
  usePageMeta({
    title: 'RP Abogados | Litigación estratégica en Santiago y O’Higgins',
    description: 'Litigación estratégica de alta complejidad en materias civiles, penales económicas, públicas y laborales en la Región Metropolitana y O’Higgins.',
    path: '/',
  })
  const [introVisible, setIntroVisible] = useState(() => {
    try {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !sessionStorage.getItem('rp-brand-intro')
    } catch {
      return false
    }
  })
  const [introLeaving, setIntroLeaving] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | undefined
    let frame = 0

    if (!reducedMotion) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true })
      const raf = (time: number) => {
        lenis?.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
    }

    return () => {
      lenis?.destroy()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const element = entry.target as HTMLElement
          const delay = Number(element.dataset.delay || 0)
          element.animate(
            [
              { opacity: 0, transform: 'translateY(26px) scale(0.985)' },
              { opacity: 1, transform: 'translateY(0) scale(1)' },
            ],
            { duration: 680, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' },
          )
          observer.unobserve(element)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    )

    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!introVisible) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    try {
      sessionStorage.setItem('rp-brand-intro', 'seen')
    } catch {
      // La presentación puede repetirse si el navegador bloquea el almacenamiento de sesión.
    }
    const leaveTimer = window.setTimeout(() => setIntroLeaving(true), 950)
    const closeTimer = window.setTimeout(() => setIntroVisible(false), 1250)
    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(leaveTimer)
      window.clearTimeout(closeTimer)
    }
  }, [introVisible])

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>

      {introVisible && (
        <div className={`brand-intro ${introLeaving ? 'is-leaving' : ''}`} role="region" aria-label="Presentación de RP Abogados">
          <div className="intro-brand">
            <img
              className="intro-logo"
              src={brandLogo}
              alt="RP Abogados — Ayudamos a la gente"
              width="1600"
              height="237"
            />
          </div>
          <div className="intro-rule" aria-hidden="true" />
          <button type="button" onClick={() => setIntroVisible(false)}>Saltar presentación</button>
        </div>
      )}

      <SiteHeader />

      <main id="contenido">
        <section className="hero hero-concept" id="inicio" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <img src="/fotos/fondo-hormigon.webp" alt="" width="1920" height="1282" fetchPriority="high" decoding="async" />
          </div>
          <div className="container hero-inner">
            <div className="hero-kicker hero-enter">Litigación de alta complejidad</div>
            <h1 id="hero-title" className="hero-title">
              <span>Estrategia legal.</span>
              <span className="hero-title-shift">Defensa con <em>propósito.</em></span>
            </h1>
            <div className="hero-bottom hero-enter hero-enter-delay-2">
              <p className="hero-intro">
                Litigación de alta complejidad para personas y empresas que necesitan una respuesta rigurosa, clara y comprometida.
              </p>
              <div className="hero-actions">
                <a className="text-link text-link-light" href="#areas">
                  Explorar áreas de práctica <ArrowDownRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="hero-practices hero-enter hero-enter-delay-3" aria-label="Áreas de práctica">
              <span>Derecho civil y de daños</span><span>Representación penal</span><span>Derecho público</span><span>Litigación laboral</span>
            </div>
          </div>
        </section>

        <section className="philosophy section-light" id="filosofia">
          <div className="container philosophy-grid">
            <h2 data-reveal>
              No se trata solo de responder.<br />
              <em>Se trata de entender qué está en juego.</em>
            </h2>
            <div className="philosophy-copy" data-reveal data-delay="120">
              <p>
                Cada conflicto exige una lectura propia. Por eso combinamos análisis jurídico, estrategia y seguimiento cercano, sin fórmulas automáticas ni promesas fáciles.
              </p>
              <p>
                Nuestro trabajo comienza antes de presentar una acción: comprender el problema, ordenar los antecedentes y tomar decisiones con criterio.
              </p>
              <a className="text-link" href="#metodo">Conocer nuestra forma de trabajo <ArrowDownRight size={18} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="media-interlude" aria-labelledby="media-title">
          <div className="media-grid" aria-hidden="true">
            <div className="media-shot media-shot-main"><img src="/fotos/area-publico.webp" alt="" width="720" height="420" loading="lazy" decoding="async" /></div>
            <div className="media-shot media-shot-top"><img src="/fotos/area-civil.svg" alt="" width="1400" height="935" loading="lazy" decoding="async" /></div>
            <div className="media-shot media-shot-bottom"><img src="/fotos/area-laboral.webp" alt="" width="900" height="592" loading="lazy" decoding="async" /></div>
          </div>
          <div className="media-statement" data-reveal>
            <span>El trabajo detrás de cada estrategia</span>
            <h2 id="media-title">Leer. Contrastar. Decidir.</h2>
          </div>
        </section>

        <section className="areas-section" id="areas" aria-labelledby="areas-title">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <span className="section-kicker">Áreas de práctica</span>
                <h2 id="areas-title">Especialización que se explica con claridad.</h2>
              </div>
              <p>Cuatro ámbitos de litigación. Una misma exigencia: comprender antes de actuar.</p>
            </div>

            <div className="areas-layout">
              <div className="area-visual" data-reveal>
                <img
                  key={areas[activeArea].image}
                  src={areas[activeArea].image}
                  alt={`Imagen editorial del área de ${areas[activeArea].short}`}
                  width={areas[activeArea].imageWidth}
                  height={areas[activeArea].imageHeight}
                  loading="lazy"
                  decoding="async"
                />
                <div className="area-visual-caption">
                  <span>0{activeArea + 1}</span>
                  <strong>{areas[activeArea].short}</strong>
                </div>
              </div>

              <div className="area-list" data-reveal data-delay="100">
                {areas.map((area, index) => {
                  const isActive = activeArea === index
                  return (
                    <article className={`area-item ${isActive ? 'is-active' : ''}`} key={area.title}>
                      <h3>
                        <button
                          type="button"
                          aria-expanded={isActive}
                          aria-controls={`area-panel-${index}`}
                          onClick={() => setActiveArea(index)}
                        >
                          <span>{area.title}</span>
                          <ChevronDown size={23} aria-hidden="true" />
                        </button>
                      </h3>
                      {isActive && (
                        <div className="area-panel" id={`area-panel-${index}`}>
                          <p>{area.description}</p>
                          <ul>
                            {area.matters.map((matter) => (
                              <li key={matter}><Check size={16} aria-hidden="true" />{matter}</li>
                            ))}
                          </ul>
                          <div className="area-panel-actions">
                            <a className="text-link" href={`/areas/${area.slug}`}>
                              Conocer esta área <ArrowRight size={17} aria-hidden="true" />
                            </a>
                            <a className="area-consult-link" href={`/?area=${area.slug}#contacto`} onClick={() => track('cta_contact', area.short)}>
                              Consultar por esta área
                            </a>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="method-section section-dark" id="metodo" aria-labelledby="method-title">
          <div className="container">
            <div className="method-intro" data-reveal>
              <span className="section-kicker">Método</span>
              <h2 id="method-title">Una estrategia se construye antes de entrar al tribunal.</h2>
              <p>Claridad sobre el problema, el riesgo y los próximos pasos.</p>
            </div>
            <div className="method-grid">
              {method.map((step, index) => (
                <article key={step.title} data-reveal data-delay={index * 80}>
                  <span className="method-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="case-section section-light" aria-labelledby="case-title">
          <div className="container case-grid">
            <article className="case-copy" data-reveal>
              <span className="case-kicker">Caso destacado · Responsabilidad civil</span>
              <h2 id="case-title">Sentencia de reparación civil en Pichilemu.</h2>
              <p>
                El Juzgado de Letras de Pichilemu declaró la responsabilidad solidaria del conductor y del propietario de un vehículo por un atropello ocurrido en abril de 2023. La resolución ordenó reparar los daños derivados del fallecimiento de una mujer y de las lesiones sufridas por su hijo.
              </p>
              <div className="case-context" aria-label="Antecedentes de la resolución">
                <span>Sentencia · 8 de octubre de 2026</span>
                <span>Representación · RP Abogados</span>
              </div>
              <figure className="case-reference">
                <div className="case-reference-media">
                  <img
                    src="/fotos/juzgado-pichilemu.svg"
                    alt="Fachada del Juzgado de Letras y Garantía de Pichilemu"
                    width="1024"
                    height="768"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption>
                  Juzgado de Letras y Garantía de Pichilemu.
                  <a
                    href="https://www.elrancaguino.cl/2024/05/15/juzgado-de-letras-y-garantia-de-pichilemu-incorpora-plataforma-de-atencion-de-publico-virtual/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Ver la fuente de la fotografía en El Rancagüino (se abre en una pestaña nueva)"
                  >
                    Imagen: El Rancagüino <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </figcaption>
              </figure>
              <div className="case-sources" aria-label="Fuentes periodísticas">
                <span>Fuentes</span>
                <a
                  href="https://www.expresodelacosta.cl/noticia/justicia-por-fatal-atropello-en-pichilemu-condenan-a-conductor-y-dueno-de-camioneta-a-pagar-mas-de-299-millones"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Leer la nota en Expreso de la Costa (se abre en una pestaña nueva)"
                >
                  Expreso de la Costa <ArrowUpRight size={15} aria-hidden="true" />
                </a>
                <a
                  href="https://www.diarioelmarino.cl/2026/10/16/juzgado-de-pichilemu-condena-a-conductor-y-propietario-de-camioneta-a-pagar-casi-300-millones-por-atropello-fatal/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Leer la nota en Diario El Marino (se abre en una pestaña nueva)"
                >
                  Diario El Marino <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="partners-section" id="socios" aria-labelledby="partners-title">
          <div className="container">
            <div className="partners-heading" data-reveal>
              <span className="section-kicker">Socios</span>
              <h2 id="partners-title">Criterio profesional<br />Trato directo</h2>
            </div>
            <div className="partners-grid">
              <article className="partner" data-reveal>
                <div className="partner-photo"><img src="/fotos/foto_gerente.webp" alt="Rafael Pérez Maldonado" width="716" height="718" loading="lazy" decoding="async" /></div>
                <div className="partner-meta"><h3>Rafael Pérez Maldonado</h3><span>Socio</span></div>
              </article>
              <article className="partner partner-offset" data-reveal data-delay="120">
                <div className="partner-photo"><img src="/fotos/yerko-scheihing.svg" alt="Yerko Scheihing Sepúlveda" width="640" height="640" loading="lazy" decoding="async" /></div>
                <div className="partner-meta"><h3>Yerko Scheihing Sepúlveda</h3><span>Socio</span></div>
              </article>
            </div>
          </div>
        </section>

        <section className="regional-section regional-compact section-dark" id="presencia" aria-labelledby="regional-title">
          <div className="container regional-grid">
            <div className="regional-copy" data-reveal>
              <span className="section-kicker">Cobertura y atención</span>
              <h2 id="regional-title">Donde está<br /><em>tu causa.</em></h2>
              <p className="regional-lead">Atención presencial y telemática para personas y empresas, con coordinación directa de la firma.</p>
              <div className="region-places" aria-label="Consultar por zona de atención">
                {regions.map((region) => (
                  <a
                    key={region}
                    href={whatsappFor(region)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Consultar por WhatsApp en la ${region} (se abre en una pestaña nueva)`}
                    onClick={() => track('contact_whatsapp', region)}
                  >
                    {region}<ArrowUpRight size={14} strokeWidth={1.6} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
            <aside className="radio-feature" data-reveal data-delay="140">
              <span className="radio-live">Al aire · Miércoles y viernes</span>
              <h3>La Ley sin<br />Letra Chica</h3>
              <p>Un espacio para conversar de derecho con lenguaje claro y mirada práctica.</p>
              <div className="radio-station"><strong>97.7 FM</strong><span>Radio Corporación<br />11:30 horas</span></div>
              <a className="text-link text-link-light" href="#contacto">Consultar por tu zona <ArrowRight size={17} aria-hidden="true" /></a>
              <div className="radio-socials" aria-label="Radio Corporación en redes sociales">
                <a
                  href="https://www.youtube.com/@RadioCorpPichilemu"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Ver el canal de YouTube de Radio Corporación (se abre en una pestaña nueva)"
                >
                  <img className="social-brand-icon" src="/marca/youtube-color.svg" alt="" width="20" height="20" loading="lazy" decoding="async" aria-hidden="true" />
                  YouTube
                </a>
                <a
                  href="https://www.facebook.com/RadioCorporacionDePichilemu/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visitar la página de Facebook de Radio Corporación (se abre en una pestaña nueva)"
                >
                  <img className="social-brand-icon" src="/marca/facebook-color.svg" alt="" width="20" height="20" loading="lazy" decoding="async" aria-hidden="true" />
                  Facebook
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section className="insights-section section-light" id="actualidad" aria-labelledby="insights-title">
          <div className="container">
            <div className="insights-top" data-reveal>
              <div>
                <span className="section-kicker">Actualidad</span>
                <h2 id="insights-title">Contenido con criterio jurídico.</h2>
              </div>
              <p className="insights-intro">Tres formatos distintos para informar sin confundir una resolución, una interpretación y una noticia.</p>
            </div>
            <EditorialList compact />
          </div>
        </section>

        <section className="faq-section section-light" aria-labelledby="faq-title">
          <div className="container faq-layout">
            <div className="faq-heading" data-reveal>
              <span className="section-kicker">Antes de consultar</span>
              <h2 id="faq-title">Respuestas claras desde el primer contacto.</h2>
              <p>Información general sobre la evaluación inicial, la cobertura y los antecedentes útiles.</p>
            </div>
            <FaqList items={generalFaqs} />
          </div>
        </section>

        <section className="contact-section section-dark" id="contacto" aria-labelledby="contact-title">
          <div className="container contact-grid">
            <div className="contact-copy" data-reveal>
              <span className="section-kicker">Contacto</span>
              <h2 id="contact-title">Conversemos sobre tu caso.</h2>
              <p>Cuéntanos lo esencial. El primer paso es comprender tu situación y determinar cómo podemos ayudarte.</p>
              <div className="direct-contact">
                <a href="mailto:contacto@rpabogados.cl" onClick={() => track('contact_email', 'contacto')}><Mail size={19} aria-hidden="true" />contacto@rpabogados.cl</a>
                <a href="tel:+56985497497" onClick={() => track('contact_phone', 'contacto')}><Phone size={19} aria-hidden="true" />+56 9 8549 7497</a>
                <a
                  className="office-address-link"
                  href="https://www.google.com/maps/search/?api=1&query=Eliodoro%20Y%C3%A1%C3%B1ez%202084%2C%20Providencia%2C%20Santiago%2C%20Chile"
                  target="_blank"
                  rel="noreferrer"
                ><MapPin size={19} aria-hidden="true" />Eliodoro Yáñez 2084, oficina 41, Providencia, Santiago</a>
              </div>
              <a
                className="whatsapp-link"
                href="https://wa.me/56985497497?text=Hola%20RP%20Abogados%2C%20quisiera%20solicitar%20una%20evaluaci%C3%B3n%20inicial."
                target="_blank"
                rel="noreferrer"
                onClick={() => track('contact_whatsapp', 'contacto')}
              >
                <MessageCircle size={20} aria-hidden="true" />Conversar por WhatsApp<ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>

            <ContactForm key={initialArea} initialArea={initialArea} />

            <div className="office-location" data-reveal>
              <div className="office-details">
                <span className="section-kicker">Oficina</span>
                <h3>Providencia, Santiago.</h3>
                <address>
                  Eliodoro Yáñez 2084, oficina 41<br />
                  Providencia, Santiago, Chile.
                </address>
                <p>Atención presencial y telemática.</p>
                <a
                  className="office-map-link"
                  href="https://www.google.com/maps/search/?api=1&query=Eliodoro%20Y%C3%A1%C3%B1ez%202084%2C%20Providencia%2C%20Santiago%2C%20Chile"
                  target="_blank"
                  rel="noreferrer"
                >Abrir en Google Maps<ArrowUpRight size={17} aria-hidden="true" /></a>
              </div>

              <div className="map-frame">
                {mapVisible ? (
                  <iframe
                    title="Mapa de RP Abogados en Providencia"
                    src="https://www.google.com/maps?q=Eliodoro%20Y%C3%A1%C3%B1ez%202084%2C%20Providencia%2C%20Santiago%2C%20Chile&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <button
                    className="map-consent"
                    type="button"
                    onClick={() => setMapVisible(true)}
                    aria-label="Ver mapa de Google de la oficina de RP Abogados"
                  >
                    <MapPin size={30} strokeWidth={1.35} aria-hidden="true" />
                    <strong>Ver mapa</strong>
                    <span>Al abrir el mapa, Google puede usar cookies.</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
