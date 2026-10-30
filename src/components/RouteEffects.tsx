import { useEffect } from 'react'
import { useLocation } from 'react-router'

export default function RouteEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    }, 0)
    return () => window.clearTimeout(timer)
  }, [hash, pathname])

  return null
}
