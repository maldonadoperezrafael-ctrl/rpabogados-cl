import { useEffect } from 'react'

const SITE_URL = 'https://www.rpabogados.cl'
const DEFAULT_IMAGE = `${SITE_URL}/og-rpabogados.png`

type PageMeta = {
  title: string
  description: string
  path: string
  noindex?: boolean
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export function usePageMeta({ title, description, path, noindex = false }: PageMeta) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path}`
    document.title = title

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    setMeta('meta[property="og:image"]', 'property', 'og:image', DEFAULT_IMAGE)
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', 'RP Abogados. Estrategia legal. Defensa con propósito.')
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', DEFAULT_IMAGE)
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
  }, [description, noindex, path, title])
}
