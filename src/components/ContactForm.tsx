import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { Link } from 'react-router'
import { practiceAreas } from '@/data/areas'

const regions = ['Región Metropolitana', 'Región de O’Higgins']

type ContactFormProps = { initialArea?: string }

export default function ContactForm({ initialArea = '' }: ContactFormProps) {
  const [area, setArea] = useState(initialArea)
  const [region, setRegion] = useState('')
  const [mailLink, setMailLink] = useState('')

  const prepareRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (data.get('website')) return
    const name = String(data.get('nombre') || '')
    const subject = `Solicitud de evaluación inicial — ${name}`
    const body = [
      `Nombre: ${name}`,
      `Correo: ${String(data.get('email') || '')}`,
      `Teléfono: ${String(data.get('telefono') || 'No indicado')}`,
      `Región: ${region}`,
      `Área: ${area}`,
      '',
      'Situación:',
      String(data.get('mensaje') || ''),
    ].join('\n')
    setMailLink(`mailto:contacto@rpabogados.cl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  return (
    <form className="contact-form" onSubmit={prepareRequest} data-reveal data-delay="100">
      <div className="form-heading">
        <h3>Solicitar evaluación inicial</h3>
        <span>Completa tus antecedentes y continúa en tu correo.</span>
      </div>
      <div className="form-row">
        <label>Nombre<input name="nombre" type="text" autoComplete="name" required minLength={2} maxLength={120} placeholder="Tu nombre" /></label>
        <label>Correo<input name="email" type="email" autoComplete="email" required maxLength={320} placeholder="tu@correo.cl" /></label>
      </div>
      <div className="form-row">
        <label>Teléfono <span>(opcional)</span><input name="telefono" type="tel" autoComplete="tel" maxLength={60} placeholder="+56 9 …" /></label>
        <label>Región
          <select name="region" required value={region} onChange={(event) => setRegion(event.target.value)}>
            <option value="" disabled>Seleccionar región</option>
            {regions.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <label>Área de consulta
        <select name="area" required value={area} onChange={(event) => setArea(event.target.value)}>
          <option value="" disabled>Seleccionar área</option>
          {practiceAreas.map((item) => <option value={item.title} key={item.slug}>{item.short}</option>)}
          <option value="Otra consulta">Otra consulta</option>
        </select>
      </label>
      <label>¿Qué está ocurriendo?
        <textarea name="mensaje" required minLength={20} maxLength={3000} rows={4} placeholder="Describe brevemente tu situación, la etapa en que se encuentra y la ayuda que buscas." />
      </label>
      <p className="form-care">Para esta primera consulta no incluyas datos sensibles ni antecedentes que no sean necesarios.</p>
      <label className="form-honeypot" aria-hidden="true">Sitio web<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      <label className="privacy-check">
        <input name="privacidad" type="checkbox" required />
        <span>He leído la <Link to="/privacidad">política de privacidad</Link> y acepto preparar esta consulta para continuar en mi correo.</span>
      </label>
      <button className="button-primary form-submit" type="submit">Preparar solicitud<ArrowRight size={18} aria-hidden="true" /></button>

      {mailLink && (
        <div className="form-feedback form-success" role="status">
          <Check size={21} aria-hidden="true" />
          <div>
            <strong>Tu solicitud está preparada. Todavía no se ha enviado.</strong>
            <p>Abre tu correo, revisa el mensaje y envíalo para completar el contacto con la firma.</p>
            <a href={mailLink}>Abrir mi correo y completar el envío<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      )}
    </form>
  )
}
