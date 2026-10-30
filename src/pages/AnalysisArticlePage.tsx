import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useParams } from 'react-router'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { analysisArticles } from '@/data/analisis'
import { usePageMeta } from '@/lib/pageMeta'
import NotFound from './NotFound'

const longDate = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Santiago' })

export default function AnalysisArticlePage() {
  const { slug } = useParams()
  const article = analysisArticles.find((item) => item.slug === slug)
  usePageMeta({
    title: article ? `${article.title} | Análisis RP` : 'Análisis no encontrado | RP Abogados',
    description: article?.excerpt || 'Análisis jurídico de RP Abogados.',
    path: article ? `/actualidad/analisis/${article.slug}` : '/404',
    noindex: !article,
  })

  if (!article) return <NotFound />

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />
      <main id="contenido" className="inner-page analysis-article-page">
        <article>
          <header className="article-header section-dark" id="inicio">
            <div className="article-measure">
              <a className="article-back" href="/actualidad/analisis"><ArrowLeft size={15} aria-hidden="true" />Análisis RP</a>
              <span>{article.area}</span>
              <h1>{article.title}</h1>
              <p>{article.excerpt}</p>
              <div className="article-byline">
                <span>Autoría · {article.author}</span>
                <span>Revisión · {article.reviewer}</span>
                <time dateTime={article.publishedAt}>{longDate.format(new Date(article.publishedAt))}</time>
                <span>{article.readingMinutes} min de lectura</span>
              </div>
            </div>
          </header>
          <div className="article-body section-light">
            <div className="article-measure">
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
              <aside className="article-sources" aria-labelledby="article-sources-title">
                <h2 id="article-sources-title">Fuentes documentales</h2>
                {article.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}
              </aside>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
