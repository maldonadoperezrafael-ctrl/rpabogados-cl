import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <a className="brand" href="/#inicio" aria-label="RP Abogados, volver al inicio">
          <img className="brand-logo" src="/marca/rp-abogados-logo-claro.svg" alt="" width="1600" height="237" />
        </a>
        <p>Litigación estratégica en la Región Metropolitana y la Región de O’Higgins.</p>
        <a className="back-top" href="/#inicio">Volver arriba <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 RP Abogados</span>
        <Link to="/privacidad">Privacidad</Link>
        <Link to="/actualidad">Actualidad jurídica</Link>
      </div>
    </footer>
  )
}
