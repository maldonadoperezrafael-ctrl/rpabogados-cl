import { ArrowRight } from 'lucide-react'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { analysisArticles } from '@/data/analisis'
import { usePageMeta } from '@/lib/pageMeta'

export default function AnalysisIndexPage() {
  usePageMeta({
    title: 'Análisis RP | Criterios de publicación | RP Abogados',
    description: 'Criterios de autoría, revisión profesional y respaldo documental de los análisis jurídicos publicados por RP Abogados.',
    path: '/actualidad/analisis',
  })

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />
      <main id="contenido" className="inner-page">
        <section className="analysis-index-hero section-dark" id="inicio">
          <div className="container analysis-index-grid">
            <div>
              <span className="section-kicker">Análisis RP</span>
              <h1>Interpretar exige nombre, fuentes y revisión.</h1>
            </div>
            <p>Un extracto puede acercar una resolución. Un análisis debe explicar su alcance, identificar a quién afecta y hacerse responsable de cada conclusión.</p>
          </div>
        </section>

        <section className="analysis-principles section-light" aria-labelledby="principles-title">
          <div className="container">
            <div className="inner-section-heading analysis-principles-heading">
              <span className="section-kicker">Criterio editorial</span>
              <h2 id="principles-title">Qué debe cumplir cada artículo.</h2>
            </div>
            <div className="analysis-principle-grid">
              <article><strong>01</strong><h3>Lectura original</h3><p>Una interpretación propia que responde por qué importa la resolución o el tema, sin repetir el comunicado ni presentar un extracto como análisis.</p></article>
              <article><strong>02</strong><h3>Responsabilidad visible</h3><p>Autoría, revisor profesional, área, fecha y tiempo de lectura identificados antes de la publicación.</p></article>
              <article><strong>03</strong><h3>Fuentes contrastables</h3><p>Enlaces a sentencias, normas u otros documentos que permitan revisar el respaldo de las afirmaciones.</p></article>
            </div>
          </div>
        </section>

        <section className="analysis-publications section-warm" aria-labelledby="publications-title">
          <div className="container">
            <div className="analysis-publications-heading">
              <span className="section-kicker">Publicaciones</span>
              <h2 id="publications-title">Análisis disponibles.</h2>
            </div>
            {analysisArticles.length ? (
              <div className="analysis-article-list">
                {analysisArticles.map((article) => (
                  <article key={article.slug}>
                    <span>{article.area} · {article.readingMinutes} min</span>
                    <h3><a href={`/actualidad/analisis/${article.slug}`}>{article.title}<ArrowRight size={18} aria-hidden="true" /></a></h3>
                    <p>{article.excerpt}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="analysis-empty-state">
                <h3>Aún no hay artículos publicados.</h3>
                <p>La automatización puede detectar resoluciones candidatas, pero no publica conclusiones jurídicas por sí sola. Esta sección se incorporará cuando exista contenido revisado por RP Abogados.</p>
                <a className="text-link" href="/actualidad">Ver Fallos y Prensa <ArrowRight size={17} aria-hidden="true" /></a>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
