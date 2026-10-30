export type AnalysisSection = {
  heading: string
  paragraphs: string[]
}

export type AnalysisArticle = {
  slug: string
  title: string
  excerpt: string
  area: string
  author: string
  reviewer: string
  publishedAt: string
  readingMinutes: number
  sources: { label: string; url: string }[]
  sections: AnalysisSection[]
}

// Publicación manual: sólo se agregan artículos con autoría y revisión profesional verificables.
export const analysisArticles: AnalysisArticle[] = []
