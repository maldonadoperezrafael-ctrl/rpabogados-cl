import { readFile, writeFile } from 'node:fs/promises'
import { load } from 'cheerio'

const OUTPUT = new URL('../src/data/actualidad.json', import.meta.url)
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const PJUD_INDEX = 'https://www.pjud.cl/prensa-y-comunicaciones/noticias-del-poder-judicial'
const PRESS_SITEMAP = 'https://www.elmostrador.cl/sitemap.xml'
const ALLOWED_HOSTS = ['www.pjud.cl', 'www.elmostrador.cl']
const PRESS_INDEXES = [
  'https://www.elmostrador.cl/search/judicial/',
  'https://www.elmostrador.cl/search/corte/',
  'https://www.elmostrador.cl/noticias/pais/',
  'https://www.elmostrador.cl/claves/poder-judicial/',
]
const legalPattern = /corte|tribunal|judicial|jurisprudencia|fallo|suprema|constitucional|fiscal[ií]a|condena|sentencia/i
const decisionPattern = /condena|absuelve|acoge|acogi[oó]|rechaza|rechaz[oó]|confirma|confirm[oó]|revoca|revoc[oó]|ordena|orden[oó]|declara|declar[oó]|resuelve|resolvi[oó]|anula|anul[oó]|admite|admiti[oó]|remueve|removi[oó]|ratifica|modifica|sobresee|reduce|rebaja|aumenta|fija|establece/i
const pressPattern = /corte|tribunal|poder judicial|jurisprudencia|fallo|suprema|constitucional|acusaci[oó]n constitucional|sentencia|demanda colectiva|indemnizaci[oó]n|delitos? econ[oó]micos?|contralor[ií]a|superintendencia/i
const excludedPattern = /torneo|seminario|reuni[oó]n|se re[uú]ne|ceremonia|convenio|capacitaci[oó]n|visita|lanza|inaugura|conmemora|premio|beca|curso|jornada|concurso|entrega|participa|recibe|expone|^causas |deportes|f[úu]tbol/i
const excludedPressPattern = /deportes|f[úu]tbol|selecci[oó]n chilena|entretenci[oó]n|espect[aá]culos|hor[oó]scopo|loter[ií]a|secuestro/i

const clean = (value = '') => value.replace(/\s+/g, ' ').trim()
const truncate = (value, max = 360) => {
  const text = clean(value)
  if (text.length <= max) return text
  const shortened = text.slice(0, max + 1)
  const boundary = shortened.lastIndexOf(' ')
  return `${shortened.slice(0, boundary > max * 0.72 ? boundary : max).replace(/[,:;\s]+$/, '')}…`
}

function allowedUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && ALLOWED_HOSTS.includes(url.hostname)
  } catch {
    return false
  }
}

function canonicalUrl(value, base) {
  const url = new URL(value, base)
  url.hash = ''
  url.search = ''
  return url.href
}

async function fetchHtml(url, attempts = 3) {
  let lastError
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml' },
        redirect: 'follow',
        signal: AbortSignal.timeout(40000),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const html = await response.text()
      if (html.length < 5000 || !/<html/i.test(html)) throw new Error('Respuesta HTML incompleta')
      return html
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

async function fetchXml(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'application/xml,text/xml' },
    signal: AbortSignal.timeout(40000),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const xml = await response.text()
  if (!/<urlset|<sitemapindex/i.test(xml)) throw new Error('Sitemap XML incompleto')
  return xml
}

function isoDate(day, month, year) {
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12))
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function recentEnough(date, days) {
  const timestamp = Date.parse(date || '')
  if (!Number.isFinite(timestamp)) return false
  const age = Date.now() - timestamp
  return age >= -86400000 && age <= days * 86400000
}

function validItem(item) {
  if (!item || !item.id || !item.title || !item.text || !item.url || !item.publishedAt) return false
  if (!['Fallos', 'Prensa'].includes(item.category)) return false
  if (item.title.length < 20 || item.text.length < 70) return false
  return [item.url, item.rulingUrl].filter(Boolean).every(allowedUrl)
}

function courtFrom(title) {
  if (/Corte Suprema/i.test(title)) return 'Corte Suprema'
  const court = title.match(/Corte de [A-ZÁÉÍÓÚÑ][\p{L} ]*?(?= organiza| rechaza| acoge| ordena| condena| confirma| revoca| admite| declara|$)/iu)
  if (court) return clean(court[0])
  const trial = title.match(/(?:[A-ZÁÉÍÓÚÑ][\p{L}]+ )?Juzgado [^,]+?(?= acoge| rechaza| condena| ordena|$)/iu)
  return trial ? clean(trial[0]) : 'Poder Judicial'
}

async function collectPjud() {
  const html = await fetchHtml(PJUD_INDEX)
  const $ = load(html)
  const candidates = []
  const seen = new Set()

  $('a[href*="/prensa-y-comunicaciones/noticias-del-poder-judicial/"]').each((_, element) => {
    const href = $(element).attr('href') || ''
    if (!/\/\d+(?:[?#].*)?$/.test(href)) return
    const url = canonicalUrl(href, PJUD_INDEX)
    if (seen.has(url)) return
    seen.add(url)
    const raw = clean($(element).text())
    const title = clean(raw.replace(/\s*\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}\s*$/, ''))
    const dateMatch = raw.match(/(\d{2})-(\d{2})-(\d{4})/)
    if (!title || !dateMatch || !legalPattern.test(title) || !decisionPattern.test(title) || excludedPattern.test(title)) return
    candidates.push({ url, title, publishedAt: isoDate(dateMatch[1], dateMatch[2], dateMatch[3]) })
  })

  const items = []
  for (const candidate of candidates.slice(0, 12)) {
    try {
      if (!recentEnough(candidate.publishedAt, 45)) continue
      const detailHtml = await fetchHtml(candidate.url)
      const $detail = load(detailHtml)
      const container = $detail('.jt-post').first()
      const fullText = clean(container.text())
      const role = fullText.match(/rol\s*(?:n[°º.]*)?\s*([\d.]+-\d{4})/i)?.[1] || ''
      const rulingUrl = container.find('a[href*="getRulingNew/"]').first().attr('href') || ''
      const paragraphs = []
      container.find('p').each((_, paragraph) => {
        const text = clean($detail(paragraph).text())
        if (text.length >= 80 && !paragraphs.includes(text)) paragraphs.push(text)
      })
      const summary = paragraphs.find((text) => !/^En la sentencia/i.test(text) && !/^[“"]/.test(text))
      if (!summary) continue
      items.push({
        id: `pjud-fallo-${candidate.url.match(/\/(\d+)$/)?.[1]}`,
        category: 'Fallos',
        title: candidate.title,
        text: truncate(summary, 330),
        meta: `${courtFrom(candidate.title)}${role ? ` · Rol ${role}` : ''}`,
        source: 'Poder Judicial',
        url: candidate.url,
        rulingUrl: rulingUrl ? canonicalUrl(rulingUrl, candidate.url) : '',
        publishedAt: candidate.publishedAt,
      })
      if (items.length >= 4) break
    } catch (error) {
      console.warn(`PJUD descartado ${candidate.url}: ${error.message}`)
    }
  }
  return { items, count: candidates.length }
}

async function collectPress() {
  const candidates = new Map()
  const addCandidate = (value, title, publishedAt, base = PRESS_SITEMAP) => {
    if (!pressPattern.test(title) || excludedPressPattern.test(title)) return
    try {
      const url = canonicalUrl(value, base)
      if (!allowedUrl(url) || !url.includes('www.elmostrador.cl/')) return
      const previous = candidates.get(url)
      if (!previous || (title.length < previous.title.length && title.length > 30)) {
        candidates.set(url, { url, title: clean(title), publishedAt })
      }
    } catch {
      // Un enlace mal formado no interrumpe la revisión del resto del índice.
    }
  }

  try {
    const xml = await fetchXml(PRESS_SITEMAP)
    const $sitemap = load(xml, { xmlMode: true })
    $sitemap('url').each((_, element) => {
      const url = clean($sitemap(element).find('loc').first().text())
      const match = url.match(/\/noticias\/pais\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)/)
      if (!match) return
      addCandidate(url, match[4].replace(/-/g, ' '), isoDate(match[3], match[2], match[1]))
    })
  } catch (error) {
    console.warn(`Sitemap de prensa no disponible: ${error.message}`)
  }

  for (const indexUrl of PRESS_INDEXES) {
    try {
      const html = await fetchHtml(indexUrl, 2)
      const $ = load(html)
      $('a[href*="/noticias/"]').each((_, element) => {
        const href = $(element).attr('href') || ''
        const match = href.match(/\/noticias\/pais\/(\d{4})\/(\d{2})\/(\d{2})\/[^?#]+/)
        if (!match) return
        addCandidate(href, clean($(element).text()), isoDate(match[3], match[2], match[1]), indexUrl)
      })
    } catch (error) {
      console.warn(`Índice de prensa no disponible ${indexUrl}: ${error.message}`)
    }
  }

  const items = []
  const ordered = [...candidates.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  for (const candidate of ordered.slice(0, 14)) {
    try {
      if (!recentEnough(candidate.publishedAt, 45)) continue
      const detailHtml = await fetchHtml(candidate.url, 2)
      const $detail = load(detailHtml)
      const title = clean($detail('h1').first().text()) || candidate.title
      const bodyDescription = clean($detail('.d-the-single-wrapper__text p').first().text())
      const description = bodyDescription || clean($detail('meta[name="description"]').attr('content'))
      if (!pressPattern.test(title) || excludedPressPattern.test(`${title} ${description}`) || description.length < 70) continue
      items.push({
        id: `prensa-${candidate.url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)/)?.slice(1).join('-')}`,
        category: 'Prensa',
        title,
        text: truncate(description, 380),
        meta: 'Actualidad jurídica · medio externo',
        source: 'El Mostrador',
        url: candidate.url,
        rulingUrl: '',
        publishedAt: candidate.publishedAt,
      })
      if (items.length >= 4) break
    } catch (error) {
      console.warn(`Prensa descartada ${candidate.url}: ${error.message}`)
    }
  }
  return items
}

function mergeItems(fresh, previous, limit = 4) {
  const merged = [...fresh, ...previous].filter(validItem)
  return [...new Map(merged.map((item) => [item.url, item])).values()]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, limit)
}

let previous = { items: [] }
try {
  previous = JSON.parse(await readFile(OUTPUT, 'utf8'))
} catch {
  // La primera ejecución crea el archivo editorial.
}

const sourceStatus = []
let freshFallos = []
let freshPrensa = []
try {
  const pjud = await collectPjud()
  freshFallos = pjud.items
  sourceStatus.push({ source: 'Poder Judicial', status: 'ok', reviewedAt: new Date().toISOString() })
} catch (error) {
  sourceStatus.push({ source: 'Poder Judicial', status: 'error', message: error.message, reviewedAt: new Date().toISOString() })
  console.error(`Fuente PJUD no disponible: ${error.message}`)
}
try {
  freshPrensa = await collectPress()
  sourceStatus.push({ source: 'El Mostrador', status: 'ok', reviewedAt: new Date().toISOString() })
} catch (error) {
  sourceStatus.push({ source: 'El Mostrador', status: 'error', message: error.message, reviewedAt: new Date().toISOString() })
  console.error(`Fuente de prensa no disponible: ${error.message}`)
}

const previousFor = (category) => (previous.items || []).filter((item) => {
  if (item.category !== category || !validItem(item)) return false
  const content = `${item.title} ${item.text}`
  if (category === 'Fallos') return decisionPattern.test(content) && !excludedPattern.test(content)
  return pressPattern.test(item.title) && !excludedPressPattern.test(content)
})
const fallos = mergeItems(freshFallos, previousFor('Fallos'))
const prensa = mergeItems(freshPrensa, previousFor('Prensa'))
const interleaved = []
for (let index = 0; index < 4; index += 1) {
  for (const group of [fallos, prensa]) {
    if (group[index]) interleaved.push(group[index])
  }
}
const items = [...new Map(interleaved.map((item) => [item.url, item])).values()]

if (!items.length) throw new Error('No fue posible construir un archivo editorial válido con Fallos o Prensa.')

const output = {
  generatedAt: new Date().toISOString(),
  editorialMethod: 'Actualización automatizada de Fallos y Prensa. Los fallos resumen objetivamente información del Poder Judicial y enlazan a sus fuentes oficiales; la prensa reproduce una bajada informativa del medio enlazado, seleccionada por relevancia jurídica. Análisis RP no se genera automáticamente: requiere autoría, revisión profesional y fuentes verificables.',
  sources: sourceStatus,
  items,
}
await writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`)
console.log(`Actualidad generada: ${items.length} contenidos (${fallos.length} fallos, ${prensa.length} prensa, 0 análisis automáticos).`)
for (const item of items) console.log(`- ${item.category}: ${item.title} | ${item.source}`)
