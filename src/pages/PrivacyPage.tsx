import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { usePageMeta } from '@/lib/pageMeta'

export default function PrivacyPage() {
  usePageMeta({
    title: 'Privacidad y tratamiento de datos | RP Abogados',
    description: 'Información sobre los datos que RP Abogados recibe mediante correo electrónico, su finalidad y las alternativas para ejercer derechos de privacidad.',
    path: '/privacidad',
  })

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />
      <main id="contenido" className="inner-page">
        <header className="article-header section-dark" id="inicio">
          <div className="article-measure">
            <span>Privacidad</span>
            <h1>Datos claros. Uso limitado.</h1>
            <p>Esta política explica qué información se recibe mediante el sitio y para qué se utiliza.</p>
            <div className="article-byline">
              <span>Responsable: RP Abogados</span>
              <time dateTime="2026-10-30">Actualizada el 30 de octubre de 2026</time>
            </div>
          </div>
        </header>

        <article className="article-body section-light">
          <div className="article-measure">
            <section>
              <h2>Qué datos recibimos</h2>
              <p>Cuando preparas una consulta en el sitio y la envías desde tu correo, recibimos tu nombre, correo electrónico, región, área de consulta y el mensaje que decides compartir. El teléfono es opcional. El mensaje queda fechado en el buzón de la firma.</p>
              <p>Para la primera consulta no es necesario incluir datos sensibles, documentos completos ni antecedentes que no sean pertinentes para comprender tu situación.</p>
            </section>
            <section>
              <h2>Para qué los utilizamos</h2>
              <p>Los datos recibidos por correo se utilizan para gestionar tu consulta, revisar preliminarmente los antecedentes y responder por los medios de contacto que hayas proporcionado. No los utilizamos para enviar publicidad sin una autorización separada.</p>
            </section>
            <section>
              <h2>Consentimiento y conservación</h2>
              <p>La preparación de la consulta requiere que aceptes expresamente el tratamiento de los datos para responderla; el sitio no la envía automáticamente y debes completar ese paso desde tu correo. La información se conserva durante el tiempo necesario para gestionarla, realizar el seguimiento correspondiente y cumplir las obligaciones legales que resulten aplicables.</p>
            </section>
            <section>
              <h2>Quién puede acceder</h2>
              <p>El acceso se limita a la gestión de RP Abogados y a la infraestructura de correo necesaria para recibir y procesar la solicitud. No vendemos los datos recibidos ni los cedemos para campañas publicitarias de terceros.</p>
            </section>
            <section>
              <h2>Funcionamiento del sitio</h2>
              <p>La edición pública no envía eventos de navegación ni datos del formulario a una base de datos propia. La información sólo se prepara en tu navegador hasta que decides abrir y enviar el correo.</p>
              <p>El mapa de Google sólo se carga cuando decides activarlo.</p>
            </section>
            <section>
              <h2>Tus alternativas</h2>
              <p>Puedes solicitar acceso, rectificación o eliminación de los datos enviados, y plantear consultas u objeciones sobre su tratamiento. Escribe a <a className="text-link" href="mailto:contacto@rpabogados.cl">contacto@rpabogados.cl</a> indicando el correo utilizado en tu solicitud para poder localizarla.</p>
            </section>
            <section>
              <h2>Protección de la información</h2>
              <p>Aplicamos validación de campos y medidas contra preparaciones automatizadas para resguardar el canal de contacto. Como ocurre con cualquier sistema conectado a internet, no es posible prometer seguridad absoluta; por eso recomendamos compartir sólo los antecedentes necesarios en esta primera etapa.</p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
