import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import Lenis from 'lenis'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, Mail, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react'
import '../App.css'

const navItems = [
  { label: 'Filosofía', href: '#filosofia' },
  { label: 'Áreas', href: '#areas' },
  { label: 'Método', href: '#metodo' },
  { label: 'Socios', href: '#socios' },
  { label: 'Actualidad', href: '#actualidad' },
]

const areas = [
  { title: 'Derecho de daños y litigación civil', short: 'Daños y civil', description: 'Estrategia y representación en conflictos donde la evidencia, la cuantificación del daño y la lectura del riesgo exigen una preparación rigurosa.', matters: ['Responsabilidad civil', 'Indemnización de daños', 'Litigación de alta complejidad'], image: '/fotos/area-civil.webp' },
  { title: 'Penal económico', short: 'Penal económico', description: 'Defensa y representación en materias penales de relevancia económica, con una estrategia construida desde los antecedentes y el contexto de cada caso.', matters: ['Defensa penal', 'Querellas', 'Asesoría a empresas'], image: '/fotos/area-penal.webp' },
  { title: 'Derecho público', short: 'Derecho público', description: 'Litigación y asesoría frente a actuaciones de la Administración, con especial atención a la estrategia procesal y a los derechos involucrados.', matters: ['Contencioso-administrativo', 'Actuaciones administrativas', 'Litigación pública'], image: '/fotos/area-publico.webp' },
  { title: 'Litigación laboral', short: 'Litigación laboral', description: 'Representación en conflictos laborales que requieren combinar conocimiento técnico, preparación probatoria y una mirada práctica del conflicto.', matters: ['Litigios laborales', 'Estrategia probatoria', 'Asesoría en conflictos'], image: '/fotos/area-laboral.webp' },
]

const method = [
  { title: 'Escuchar antes de concluir', text: 'Partimos por comprender los hechos, el contexto y aquello que realmente está en juego para ti o tu empresa.' },
  { title: 'Leer el riesgo', text: 'Revisamos antecedentes, escenarios y puntos críticos para tomar decisiones con información, no por impulso.' },
  { title: 'Diseñar la respuesta', text: 'Construimos una estrategia jurídica proporcional al conflicto, con objetivos y prioridades claramente definidos.' },
  { title: 'Sostener el seguimiento', text: 'Comunicamos los hitos relevantes y mantenemos una lectura activa del caso durante su desarrollo.' },
]

const insights = [
  { category: 'Fallos', title: 'Responsabilidad civil: una mirada al caso de Pichilemu', text: 'Tribunal, contexto y relevancia de una resolución informada por la firma.', meta: 'Reseña de fallo' },
  { category: 'Análisis', title: 'Cómo se discute la cuantía de una indemnización', text: 'Los antecedentes que importan al momento de analizar el daño y su acreditación.', meta: 'Lectura editorial' },
  { category: 'Prensa', title: 'La Ley sin Letra Chica en Radio Corporación', text: 'Conversación jurídica para acercar temas complejos a la comunidad regional.', meta: '97.7 FM · 11:30 h' },
]
const filters = ['Todos', 'Fallos', 'Análisis', 'Prensa']

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeArea, setActiveArea] = useState(0)
  const [filter, setFilter] = useState('Todos')
  const [formArea, setFormArea] = useState('')
  const [mailLink, setMailLink] = useState('')
  const [introVisible, setIntroVisible] = useState(() => {
    try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !sessionStorage.getItem('rp-brand-intro') } catch { return false }
  })
  const [introLeaving, setIntroLeaving] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const visibleInsights = useMemo(() => insights.filter((item) => filter === 'Todos' || item.category === filter), [filter])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | undefined
    let frame = 0
    if (!reducedMotion) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true })
      const raf = (time: number) => { lenis?.raf(time); frame = requestAnimationFrame(raf) }
      frame = requestAnimationFrame(raf)
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 28)
      if (!reducedMotion) {
        const shift = Math.min(window.scrollY * 0.075, 72)
        document.documentElement.style.setProperty('--hero-shift', `${shift}px`)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); lenis?.destroy(); if (frame) cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const element = entry.target as HTMLElement
        const delay = Number(element.dataset.delay || 0)
        element.animate([
          { opacity: 0, transform: 'translateY(26px) scale(0.985)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ], { duration: 680, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' })
        observer.unobserve(element)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' })
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!introVisible) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    try { sessionStorage.setItem('rp-brand-intro', 'seen') } catch { /* La presentación puede repetirse si el navegador bloquea el almacenamiento. */ }
    const leaveTimer = window.setTimeout(() => setIntroLeaving(true), 950)
    const closeTimer = window.setTimeout(() => setIntroVisible(false), 1250)
    return () => { document.body.style.overflow = previousOverflow; window.clearTimeout(leaveTimer); window.clearTimeout(closeTimer) }
  }, [introVisible])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); return }
      if (event.key !== 'Tab' || !menuRef.current) return
      const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown) }
  }, [menuOpen])

  const prepareRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('nombre') || '')
    const email = String(data.get('email') || '')
    const phone = String(data.get('telefono') || 'No indicado')
    const message = String(data.get('mensaje') || '')
    const subject = `Solicitud de evaluación inicial — ${name}`
    const body = [`Nombre: ${name}`, `Correo: ${email}`, `Teléfono: ${phone}`, `Área: ${formArea || 'Por definir'}`, '', 'Situación:', message].join('\n')
    setMailLink(`mailto:contacto@rpabogados.cl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      {introVisible && (
        <div className={`brand-intro ${introLeaving ? 'is-leaving' : ''}`} role="region" aria-label="Presentación de RP Abogados">
          <div className="intro-brand" aria-label="RP Abogados">
            <img className="intro-logo" src="/favicon.svg" alt="RP" />
            <span className="intro-wordmark">RP Abogados<small>Ayudamos a la gente</small></span>
          </div>
          <div className="intro-rule" aria-hidden="true" />
          <button type="button" onClick={() => setIntroVisible(false)}>Saltar presentación</button>
        </div>
      )}
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="header-inner">
          <a className="brand" href="#inicio" aria-label="RP Abogados, volver al inicio">
            <img className="brand-logo" src="/favicon.svg" alt="" />
            <span className="brand-name">RP Abogados<small>Ayudamos a la gente</small></span>
          </a>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {navItems.map((item) => <a className="nav-link" href={item.href} key={item.href}>{item.label}</a>)}
          </nav>
          <a className="header-cta" href="#contacto">Evaluación inicial <ArrowUpRight size={16} aria-hidden="true" /></a>
          <button className="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={25} aria-hidden="true" /></button>
        </div>
      </header>
      {menuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)}>
          <div ref={menuRef} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú de navegación" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-menu-top">
              <img className="brand-logo" src="/favicon.svg" alt="" />
              <button autoFocus type="button" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}><X size={26} aria-hidden="true" /></button>
            </div>
            <nav aria-label="Navegación móvil">
              {navItems.map((item) => <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowDownRight size={22} aria-hidden="true" /></a>)}
              <a href="#presencia" onClick={() => setMenuOpen(false)}>Presencia regional<ArrowDownRight size={22} aria-hidden="true" /></a>
            </nav>
            <a className="button-primary mobile-menu-cta" href="#contacto" onClick={() => setMenuOpen(false)}>Solicitar evaluación inicial <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
      )}
      <main id="contenido">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true"><img src="/fotos/fondo-hormigon.webp" alt="" /></div>
          <div className="hero-monogram" aria-hidden="true">RP</div>
          <div className="container hero-inner">
            <div className="hero-kicker hero-enter">Litigación estratégica · Santiago / O’Higgins</div>
            <h1 id="hero-title" className="hero-enter hero-enter-delay-1"><span>Estrategia legal.</span><span className="hero-title-shift">Defensa con <em>propósito.</em></span></h1>
            <div className="hero-bottom hero-enter hero-enter-delay-2">
              <p className="hero-intro">Litigación de alta complejidad para personas y empresas que necesitan una respuesta rigurosa, clara y comprometida.</p>
              <div className="hero-actions">
                <a className="button-primary" href="#contacto">Solicitar evaluación inicial <ArrowRight size={19} aria-hidden="true" /></a>
                <a className="text-link text-link-light" href="#areas">Explorar áreas de práctica <ArrowDownRight size={18} aria-hidden="true" /></a>
              </div>
            </div>
            <div className="hero-practices hero-enter hero-enter-delay-3" aria-label="Áreas de práctica"><span>Daños y civil</span><span>Penal económico</span><span>Derecho público</span><span>Litigación laboral</span></div>
          </div>
        </section>
        <section className="philosophy section-light" id="filosofia">
          <div className="container philosophy-grid">
            <h2 data-reveal>No se trata solo de responder.<br /><em>Se trata de entender qué está en juego.</em></h2>
            <div className="philosophy-copy" data-reveal data-delay="120">
              <p>Cada conflicto exige una lectura propia. Por eso combinamos análisis jurídico, estrategia y seguimiento cercano, sin fórmulas automáticas ni promesas fáciles.</p>
              <p>Nuestro trabajo comienza antes de presentar una acción: comprender el problema, ordenar los antecedentes y tomar decisiones con criterio.</p>
              <a className="text-link" href="#metodo">Conocer nuestra forma de trabajo <ArrowDownRight size={18} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
        <section className="media-interlude" aria-labelledby="media-title">
          <div className="media-grid" aria-hidden="true">
            <div className="media-shot media-shot-main"><img src="/fotos/area-publico.webp" alt="" /></div>
            <div className="media-shot media-shot-top"><img src="/fotos/area-civil.webp" alt="" /></div>
            <div className="media-shot media-shot-bottom"><img src="/fotos/area-laboral.webp" alt="" /></div>
          </div>
          <div className="media-statement" data-reveal><span>El trabajo detrás de cada estrategia</span><h2 id="media-title">Leer. Contrastar. Decidir.</h2></div>
        </section>
        <section className="areas-section" id="areas" aria-labelledby="areas-title">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div><span className="section-kicker">Áreas de práctica</span><h2 id="areas-title">Especialización que se explica con claridad.</h2></div>
              <p>Cuatro ámbitos de litigación. Una misma exigencia: comprender antes de actuar.</p>
            </div>
            <div className="areas-layout">
              <div className="area-visual" data-reveal>
                <img key={areas[activeArea].image} src={areas[activeArea].image} alt={`Imagen editorial del área de ${areas[activeArea].short}`} />
                <div className="area-visual-caption"><span>0{activeArea + 1}</span><strong>{areas[activeArea].short}</strong></div>
              </div>
              <div className="area-list" data-reveal data-delay="100">
                {areas.map((area, index) => {
                  const isActive = activeArea === index
                  return (
                    <article className={`area-item ${isActive ? 'is-active' : ''}`} key={area.title}>
                      <h3><button type="button" aria-expanded={isActive} aria-controls={`area-panel-${index}`} onClick={() => setActiveArea(index)}><span>{area.title}</span><ChevronDown size={23} aria-hidden="true" /></button></h3>
                      {isActive && (
                        <div className="area-panel" id={`area-panel-${index}`}>
                          <p>{area.description}</p>
                          <ul>{area.matters.map((matter) => <li key={matter}><Check size={16} aria-hidden="true" />{matter}</li>)}</ul>
                          <a className="text-link" href="#contacto" onClick={() => setFormArea(area.title)}>Consultar por esta área <ArrowRight size={17} aria-hidden="true" /></a>
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
            <div className="method-intro" data-reveal><span className="section-kicker">Método</span><h2 id="method-title">Una estrategia se construye antes de entrar al tribunal.</h2><p>Claridad sobre el problema, el riesgo y los próximos pasos.</p></div>
            <div className="method-grid">
              {method.map((step, index) => <article key={step.title} data-reveal data-delay={index * 80}><span className="method-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}
            </div>
          </div>
        </section>
        <section className="case-section section-light" aria-labelledby="case-title">
          <div className="container case-grid">
            <div className="case-figure" data-reveal><span>Caso destacado · Responsabilidad civil</span><strong>$299.622.440</strong><small>Monto de indemnización informado por la firma.</small></div>
            <div className="case-copy" data-reveal data-delay="120">
              <h2 id="case-title">La experiencia importa cuando puede contarse con precisión.</h2>
              <p>Un caso dirigido por RP Abogados ante el Juzgado de Letras de Pichilemu, con cobertura de Diario El Marino y Expreso de la Costa.</p>
              <p className="case-note">La experiencia en casos anteriores no garantiza resultados futuros.</p>
            </div>
          </div>
        </section>
        <section className="partners-section" id="socios" aria-labelledby="partners-title">
          <div className="container">
            <div className="partners-heading" data-reveal><span className="section-kicker">Socios</span><h2 id="partners-title">Criterio profesional.<br />Trato directo.</h2></div>
            <div className="partners-grid">
              <article className="partner" data-reveal><div className="partner-photo"><img src="/fotos/foto_gerente.webp" alt="Rafael Pérez Maldonado" /></div><div className="partner-meta"><h3>Rafael Pérez Maldonado</h3><span>Socio</span></div></article>
              <article className="partner partner-offset" data-reveal data-delay="120"><div className="partner-photo"><img src="/fotos/yerko-scheihing.webp" alt="Yerko Scheihing Sepúlveda" /></div><div className="partner-meta"><h3>Yerko Scheihing Sepúlveda</h3><span>Socio</span></div></article>
            </div>
          </div>
        </section>
        <section className="regional-section section-dark" id="presencia" aria-labelledby="regional-title">
          <div className="regional-ring" aria-hidden="true" />
          <div className="container regional-grid">
            <div data-reveal>
              <span className="section-kicker">Presencia regional</span>
              <h2 id="regional-title">Santiago.<br /><em>O’Higgins.</em></h2>
              <p className="regional-lead">Experiencia en litigación compleja, con presencia y conocimiento directo de la realidad regional.</p>
              <div className="region-places" aria-label="Zonas de atención"><span>Región Metropolitana</span><span>Región de O’Higgins</span></div>
            </div>
            <aside className="radio-feature" data-reveal data-delay="140">
              <span className="radio-live">Al aire · Miércoles y viernes</span>
              <h3>La Ley sin<br />Letra Chica</h3>
              <p>Un espacio para conversar de derecho con lenguaje claro y mirada práctica.</p>
              <div className="radio-station"><strong>97.7 FM</strong><span>Radio Corporación<br />11:30 horas</span></div>
              <a className="text-link text-link-light" href="#contacto">Consultar por tu zona <ArrowRight size={17} aria-hidden="true" /></a>
            </aside>
          </div>
        </section>
        <section className="insights-section section-light" id="actualidad" aria-labelledby="insights-title">
          <div className="container">
            <div className="insights-top" data-reveal>
              <div><span className="section-kicker">Actualidad</span><h2 id="insights-title">Contenido con criterio jurídico.</h2></div>
              <div className="insight-filters" aria-label="Filtrar contenidos">{filters.map((item) => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
            </div>
            <p className="prototype-note">Contenidos de muestra para visualizar la arquitectura editorial propuesta.</p>
            <div className="insight-list" aria-live="polite">
              {visibleInsights.map((item) => <article className="insight-row" key={item.title}><span className="insight-category">{item.category}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><span className="insight-meta">{item.meta}</span></article>)}
            </div>
          </div>
        </section>
        <section className="contact-section section-dark" id="contacto" aria-labelledby="contact-title">
          <div className="container contact-grid">
            <div className="contact-copy" data-reveal>
              <span className="section-kicker">Contacto</span>
              <h2 id="contact-title">Conversemos sobre tu caso.</h2>
              <p>Cuéntanos lo esencial. El primer paso es comprender tu situación y determinar cómo podemos ayudarte.</p>
              <div className="direct-contact">
                <a href="mailto:contacto@rpabogados.cl"><Mail size={19} aria-hidden="true" />contacto@rpabogados.cl</a>
                <a href="tel:+56985497497"><Phone size={19} aria-hidden="true" />+56 9 8549 7497</a>
                <span><MapPin size={19} aria-hidden="true" />Providencia, Santiago · Atención regional</span>
              </div>
              <a className="whatsapp-link" href="https://wa.me/56985497497?text=Hola%20RP%20Abogados%2C%20quisiera%20solicitar%20una%20evaluaci%C3%B3n%20inicial." target="_blank" rel="noreferrer"><MessageCircle size={20} aria-hidden="true" />Conversar por WhatsApp<ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <form className="contact-form" onSubmit={prepareRequest} data-reveal data-delay="100">
              <div className="form-heading"><h3>Solicitar evaluación inicial</h3><span>Maqueta: no envía datos automáticamente.</span></div>
              <div className="form-row">
                <label>Nombre<input name="nombre" type="text" autoComplete="name" required placeholder="Tu nombre" /></label>
                <label>Correo<input name="email" type="email" autoComplete="email" required placeholder="tu@correo.cl" /></label>
              </div>
              <div className="form-row">
                <label>Teléfono <span>(opcional)</span><input name="telefono" type="tel" autoComplete="tel" placeholder="+56 9 …" /></label>
                <label>Área de consulta
                  <select value={formArea} onChange={(event) => setFormArea(event.target.value)}>
                    <option value="">Seleccionar área</option>
                    {areas.map((area) => <option value={area.title} key={area.title}>{area.short}</option>)}
                    <option value="Otra consulta">Otra consulta</option>
                  </select>
                </label>
              </div>
              <label>¿Qué está ocurriendo?<textarea name="mensaje" required rows={4} placeholder="Describe brevemente tu situación y la ayuda que buscas." /></label>
              <label className="privacy-check"><input type="checkbox" required /><span>He leído la <a href="https://rpabogados.cl/privacidad" target="_blank" rel="noreferrer">política de privacidad</a> y acepto preparar esta consulta.</span></label>
              <button className="button-primary form-submit" type="submit">Preparar solicitud <ArrowRight size={18} aria-hidden="true" /></button>
              {mailLink && (
                <div className="form-success" role="status">
                  <Check size={21} aria-hidden="true" />
                  <div><strong>Tu solicitud está preparada. Todavía no se ha enviado.</strong><p>Para completar el contacto, ábrela en tu correo y revisa el mensaje antes de enviarlo.</p><a href={mailLink}>Abrir mi correo <ArrowUpRight size={16} aria-hidden="true" /></a></div>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-top">
          <a className="brand" href="#inicio" aria-label="RP Abogados, volver al inicio"><img className="brand-logo" src="/favicon.svg" alt="" /><span className="brand-name">RP Abogados<small>Ayudamos a la gente</small></span></a>
          <p>Litigación estratégica en la Región Metropolitana y la Región de O’Higgins.</p>
          <a className="back-top" href="#inicio">Volver arriba <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <div className="container footer-bottom"><span>© 2026 RP Abogados</span><a href="https://rpabogados.cl/privacidad" target="_blank" rel="noreferrer">Privacidad</a><span>Propuesta editorial dinámica</span></div>
      </footer>
    </>
  )
}
