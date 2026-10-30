import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router'
import editorialData from '@/data/actualidad.json'
import { analysisArticles } from '@/data/analisis'
import { useAnalytics } from '@/lib/analytics'

type Insight = {
  id: string
  category: 'Fallos' | 'Análisis' | 'Prensa'
  title: string
  text: string
  meta: string
  source: string
  url: string
  rulingUrl: string
  publishedAt: string
  internalUrl?: string
}

const automatedItems = (editorialData as { items: Insight[] }).items.filter((item) => item.category !== 'Análisis')
const curatedItems: Insight[] = analysisArticles.map((article) => ({
  id: article.slug,
  category: 'Análisis',
  title: article.title,
  text: article.excerpt,
  meta: `${article.area} · ${article.readingMinutes} min de lectura`,
  source: article.reviewer,
  url: '',
  rulingUrl: '',
  publishedAt: article.publishedAt,
  internalUrl: `/actualidad/analisis/${article.slug}`,
}))
const insights = [...curatedItems, ...automatedItems]
const filters = ['Todos', 'Fallos', 'Análisis', 'Prensa'] as const
const shortDate = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Santiago',
})
const reviewDate = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Santiago',
})

const definitions = [
  { name: 'Fallos', question: '¿Qué decidió el tribunal?', detail: 'Resumen objetivo y acceso a la fuente oficial.' },
  { name: 'Análisis RP', question: '¿Por qué importa?', detail: 'Interpretación con autoría y revisión profesional.' },
  { name: 'Prensa', question: '¿Qué informa un medio?', detail: 'Cobertura externa seleccionada por relevancia temática.' },
]

export default function EditorialList({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('Todos')
  const [expanded, setExpanded] = useState(false)
  const track = useAnalytics()
  const filtered = useMemo(() => insights.filter((item) => filter === 'Todos' || item.category === filter), [filter])
  const visible = compact && filter === 'Todos' && !expanded ? filtered.slice(0, 3) : filtered

  return (
    <>
      <div className="editorial-definitions" aria-label="Diferencias entre los contenidos">
        {definitions.map((item) => (
          <article key={item.name}>
            <strong>{item.name}</strong>
            <span>{item.question}</span>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
      <div className="insights-toolbar">
        <div className="insight-filters" aria-label="Filtrar contenidos">
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={filter === item}
              onClick={() => {
                setFilter(item)
                setExpanded(false)
                track('editorial_filter', item)
              }}
            >{item}</button>
          ))}
        </div>
        <div className="insights-status">
          <span><i aria-hidden="true" />Fallos y Prensa · revisión automática diaria</span>
          <span>Última revisión · <time dateTime={editorialData.generatedAt}>{reviewDate.format(new Date(editorialData.generatedAt))}</time></span>
        </div>
      </div>
      <div id="insights-list" key={filter} className="insight-list is-visible" aria-live="polite">
        {visible.map((item, index) => (
          <article className="insight-row" key={item.id} style={{ '--insight-index': index } as CSSProperties}>
            <div className="insight-label">
              <span className="insight-category">{item.category === 'Análisis' ? 'Análisis RP' : item.category}</span>
              <time className="insight-date" dateTime={item.publishedAt}>{shortDate.format(new Date(item.publishedAt))}</time>
            </div>
            <div className="insight-content">
              <h3>
                {item.internalUrl ? (
                  <Link to={item.internalUrl} onClick={() => track('editorial_open', item.title)}>{item.title}<ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" /></Link>
                ) : (
                  <a href={item.url} target="_blank" rel="noreferrer" onClick={() => track('editorial_open', item.title)}>
                    {item.title}<ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                )}
              </h3>
              <p>{item.text}</p>
              <div className="insight-detail">
                <span>{item.category === 'Prensa' ? `${item.source} · ${item.meta}` : `${item.meta} · ${item.source}`}</span>
                {item.rulingUrl && (
                  <a href={item.rulingUrl} target="_blank" rel="noreferrer">Texto de la sentencia<ArrowUpRight size={13} aria-hidden="true" /></a>
                )}
              </div>
            </div>
          </article>
        ))}
        {!visible.length && filter === 'Análisis' && (
          <div className="analysis-empty">
            <span>Publicación con revisión profesional</span>
            <h3>La interpretación jurídica no se automatiza.</h3>
            <p>Aún no hay análisis publicados. Esta categoría abrirá artículos dentro del sitio cuando exista un texto con autoría, revisión y fuentes verificables.</p>
            <Link className="text-link" to="/actualidad/analisis">Conocer los criterios editoriales <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        )}
        {!visible.length && filter !== 'Análisis' && (
          <p className="insight-empty">No hay contenidos disponibles en esta categoría. Revisa otra selección.</p>
        )}
      </div>
      <div className="insights-actions">
        {compact && filter === 'Todos' && filtered.length > 3 && (
          <button type="button" className={`insights-more ${expanded ? 'is-expanded' : ''}`} aria-expanded={expanded} aria-controls="insights-list" onClick={() => setExpanded((value) => !value)}>
            {expanded ? 'Mostrar menos' : 'Ver toda la actualidad'}<ChevronDown size={15} strokeWidth={1.6} aria-hidden="true" />
          </button>
        )}
        {compact && <Link className="insights-archive" to="/actualidad">Abrir Actualidad <ArrowRight size={15} aria-hidden="true" /></Link>}
      </div>
    </>
  )
}
