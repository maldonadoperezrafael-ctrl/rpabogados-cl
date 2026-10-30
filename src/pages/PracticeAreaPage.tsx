import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, FileText } from 'lucide-react'
import { useParams } from 'react-router'
import FaqList from '@/components/FaqList'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { areaBySlug, practiceAreas } from '@/data/areas'
import { useAnalytics } from '@/lib/analytics'
import { usePageMeta } from '@/lib/pageMeta'
import NotFound from './NotFound'

export default function PracticeAreaPage() {
  const { slug } = useParams()
  const area = areaBySlug(slug)
  const track = useAnalytics()
  usePageMeta({
    title: area ? `${area.title} | RP Abogados` : 'Área no encontrada | RP Abogados',
    description: area?.seoDescription || 'Áreas de práctica de RP Abogados.',
    path: area ? `/areas/${area.slug}` : '/404',
    noindex: !area,
  })

  useEffect(() => {
    if (area) track('service_view', area.title)
  }, [area, track])

  if (!area) return <NotFound />

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />
      <main id="contenido" className="inner-page">
        <section className="practice-hero section-dark" id="inicio">
          <div className="container practice-hero-grid">
            <div className="practice-hero-copy">
              <nav className="breadcrumbs" aria-label="Migas de pan">
                <a href="/#areas"><ArrowLeft size={14} aria-hidden="true" />Áreas de práctica</a>
                <span aria-current="page">{area.short}</span>
              </nav>
              <span className="section-kicker">Región Metropolitana · Región de O’Higgins</span>
              <h1>{area.title}</h1>
              <p>{area.lead}</p>
              <a className="button-primary" href={`/?area=${area.slug}#contacto`} onClick={() => track('cta_contact', area.title)}>
                Solicitar evaluación inicial <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
            <figure className="practice-hero-media">
              <img src={area.image} alt="" width={area.imageWidth} height={area.imageHeight} fetchPriority="high" decoding="async" />
              <figcaption>{area.matters.join(' · ')}</figcaption>
            </figure>
          </div>
        </section>

        <section className="practice-situations section-light" aria-labelledby="situations-title">
          <div className="container practice-two-column">
            <div className="inner-section-heading">
              <span className="section-kicker">Evaluación inicial</span>
              <h2 id="situations-title">Cuándo puede ser útil conversar.</h2>
            </div>
            <div className="practice-situation-list">
              {area.situations.map((item) => <p key={item}><Check size={18} aria-hidden="true" />{item}</p>)}
            </div>
          </div>
        </section>

        <section className="practice-approach section-warm" aria-labelledby="approach-title">
          <div className="container">
            <div className="inner-section-heading approach-heading">
              <span className="section-kicker">Forma de trabajo</span>
              <h2 id="approach-title">Una estrategia que parte por los antecedentes.</h2>
              <p>{area.description}</p>
            </div>
            <div className="practice-steps">
              {area.steps.map((step, index) => (
                <article key={step.title}>
                  <span>0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="practice-documents section-light" aria-labelledby="documents-title">
          <div className="container documents-layout">
            <div className="documents-intro">
              <FileText size={28} strokeWidth={1.35} aria-hidden="true" />
              <span className="section-kicker">Primera conversación</span>
              <h2 id="documents-title">Antecedentes que ayudan a ordenar el caso.</h2>
              <p>No necesitas tener todo reunido para consultar. Si falta un documento o no conoces una fecha, indícalo con claridad.</p>
            </div>
            <ol className="documents-list">
              {area.documents.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </div>
        </section>

        <section className="practice-faq section-light" aria-labelledby="practice-faq-title">
          <div className="container faq-layout">
            <div className="faq-heading">
              <span className="section-kicker">Preguntas sobre esta área</span>
              <h2 id="practice-faq-title">Antes de enviar tus antecedentes.</h2>
            </div>
            <FaqList items={area.faqs} />
          </div>
        </section>

        <section className="practice-contact section-dark" aria-labelledby="practice-contact-title">
          <div className="container practice-contact-inner">
            <div>
              <span className="section-kicker">Conversemos</span>
              <h2 id="practice-contact-title">El primer paso es comprender qué está en juego.</h2>
            </div>
            <a className="button-primary" href={`/?area=${area.slug}#contacto`} onClick={() => track('cta_contact', area.title)}>
              Consultar por {area.short.toLocaleLowerCase('es-CL')} <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <nav className="other-practices section-light" aria-label="Otras áreas de práctica">
          <div className="container">
            <span>Explora otras áreas</span>
            {practiceAreas.filter((item) => item.slug !== area.slug).map((item) => (
              <a href={`/areas/${item.slug}`} key={item.slug}>{item.short}<ArrowRight size={17} aria-hidden="true" /></a>
            ))}
          </div>
        </nav>
      </main>
      <SiteFooter />
    </>
  )
}
