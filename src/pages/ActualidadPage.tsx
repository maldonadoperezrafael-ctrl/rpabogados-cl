import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import EditorialList from '@/components/EditorialList'
import { usePageMeta } from '@/lib/pageMeta'

export default function ActualidadPage() {
  usePageMeta({
    title: 'Actualidad jurídica | Fallos, Análisis y Prensa | RP Abogados',
    description: 'Fallos con fuentes oficiales, análisis con revisión profesional y prensa jurídica relevante, diferenciados con claridad por RP Abogados.',
    path: '/actualidad',
  })

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />
      <main id="contenido" className="inner-page">
        <section className="editorial-hero section-dark" id="inicio">
          <div className="container editorial-hero-grid">
            <div>
              <span className="section-kicker">Actualidad jurídica</span>
              <h1>Informar sin mezclar los planos.</h1>
            </div>
            <p>Fallos para saber qué decidió un tribunal. Análisis para comprender por qué importa. Prensa para saber qué está informando un medio externo.</p>
          </div>
        </section>
        <section className="editorial-archive section-light" aria-label="Archivo de actualidad jurídica">
          <div className="container">
            <EditorialList />
            <p className="editorial-disclaimer">Los contenidos son informativos y no constituyen asesoría legal. Los enlaces externos y documentos oficiales permiten contrastar la fuente original.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
