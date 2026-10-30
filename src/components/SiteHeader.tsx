import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowRight, Menu, X } from 'lucide-react'
import { useLocation } from 'react-router'
import { useAnalytics } from '@/lib/analytics'

const brandLogo = '/marca/rp-abogados-logo-claro.svg'
const navItems = [
  { label: 'Filosofía', href: '#filosofia' },
  { label: 'Áreas', href: '#areas' },
  { label: 'Método', href: '#metodo' },
  { label: 'Socios', href: '#socios' },
  { label: 'Actualidad', href: '#actualidad' },
  { label: 'Contacto', href: '#contacto' },
]

export default function SiteHeader() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const track = useAnalytics()
  const prefix = pathname === '/' ? '' : '/'
  const solid = scrolled || pathname !== '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        return
      }
      if (event.key !== 'Tab' || !menuRef.current) return
      const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <>
      <header className={`site-header ${solid ? 'is-scrolled' : ''}`}>
        <div className="header-inner">
          <a className="brand" href="/#inicio" aria-label="RP Abogados, volver al inicio">
            <img className="brand-logo" src={brandLogo} alt="" width="1600" height="237" />
          </a>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {navItems.map((item) => (
              <a className={`nav-link ${item.href === '#contacto' ? 'contact-nav-link' : ''}`} href={`${prefix}${item.href}`} key={item.href}>{item.label}</a>
            ))}
          </nav>
          <button className="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <Menu size={25} aria-hidden="true" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)}>
          <div
            ref={menuRef}
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-menu-top">
              <img className="brand-logo mobile-menu-logo" src={brandLogo} alt="RP Abogados" width="1600" height="237" />
              <button autoFocus type="button" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}>
                <X size={26} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Navegación móvil">
              {navItems.map((item) => (
                <a className={item.href === '#contacto' ? 'contact-nav-link' : ''} href={`${prefix}${item.href}`} key={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}<ArrowDownRight size={22} aria-hidden="true" />
                </a>
              ))}
              <a href="/#presencia" onClick={() => setMenuOpen(false)}>
                Presencia regional<ArrowDownRight size={22} aria-hidden="true" />
              </a>
            </nav>
            <a
              className="button-primary mobile-menu-cta"
              href="/#contacto"
              onClick={() => {
                setMenuOpen(false)
                track('cta_contact', 'menu')
              }}
            >
              Solicitar evaluación inicial <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
