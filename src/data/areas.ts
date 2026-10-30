export type PracticeArea = {
  slug: string
  title: string
  short: string
  description: string
  matters: string[]
  image: string
  imageWidth: number
  imageHeight: number
  lead: string
  situations: string[]
  documents: string[]
  steps: { title: string; text: string }[]
  faqs: { question: string; answer: string }[]
  seoDescription: string
}

export const practiceAreas: PracticeArea[] = [
  {
    slug: 'danos-litigacion-civil',
    title: 'Derecho de daños y litigación civil',
    short: 'Daños y civil',
    description: 'Estrategia y representación en conflictos donde la evidencia, la cuantificación del daño y la lectura del riesgo exigen una preparación rigurosa.',
    matters: ['Responsabilidad civil', 'Indemnización de daños', 'Litigación de alta complejidad'],
    image: '/fotos/area-civil.svg',
    imageWidth: 1400,
    imageHeight: 935,
    lead: 'Cuando un daño ya ocurrió, la primera tarea es ordenar los hechos, identificar a los involucrados y comprender qué debe repararse.',
    situations: [
      'Lesiones, fallecimiento o daños derivados de un accidente.',
      'Perjuicios patrimoniales cuya cuantificación requiere respaldo documental.',
      'Conflictos de responsabilidad civil con varios involucrados.',
      'Discusiones sobre la existencia, extensión o acreditación de un daño.',
    ],
    documents: [
      'Una cronología breve de los hechos y de las personas involucradas.',
      'Antecedentes médicos, denuncias, fotografías o informes disponibles.',
      'Comprobantes de gastos, ingresos y otras pérdidas que se busca acreditar.',
      'Comunicaciones relevantes con contrapartes, aseguradoras o terceros.',
    ],
    steps: [
      { title: 'Delimitar el conflicto', text: 'Revisamos qué ocurrió, qué se reclama y qué antecedentes permiten sostener cada parte del relato.' },
      { title: 'Ordenar daño y prueba', text: 'Distinguimos los perjuicios alegados de aquellos que pueden acreditarse y cuantificarse con respaldo.' },
      { title: 'Elegir la vía de respuesta', text: 'Evaluamos alternativas de solución y litigación según el riesgo, la evidencia y los objetivos del caso.' },
    ],
    faqs: [
      { question: '¿Necesito tener calculada la indemnización antes de consultar?', answer: 'No. Puedes llegar con los antecedentes disponibles. La evaluación inicial sirve precisamente para identificar qué daños se alegan y qué respaldo sería necesario revisar.' },
      { question: '¿Qué documentos son más útiles al inicio?', answer: 'Una cronología, los documentos vinculados al hecho y los respaldos de gastos o pérdidas. Si falta alguno, conviene señalarlo en vez de reconstruirlo de memoria.' },
      { question: '¿Todos los conflictos terminan en un juicio?', answer: 'No necesariamente. La vía adecuada depende de los hechos, la prueba, las partes y las posibilidades reales de solución. No se puede anticipar un resultado sin revisar el caso.' },
    ],
    seoDescription: 'Evaluación y representación en responsabilidad civil, indemnización de daños y litigación civil compleja en la Región Metropolitana y O’Higgins.',
  },
  {
    slug: 'penal-economico',
    title: 'Penal económico',
    short: 'Penal económico',
    description: 'Defensa y representación en materias penales de relevancia económica, con una estrategia construida desde los antecedentes y el contexto de cada caso.',
    matters: ['Defensa penal', 'Querellas', 'Asesoría a empresas'],
    image: '/fotos/area-penal.webp',
    imageWidth: 600,
    imageHeight: 439,
    lead: 'En una investigación de relevancia económica, cada decisión temprana importa: qué antecedentes existen, qué etapa atraviesa el caso y qué comunicaciones conviene resguardar.',
    situations: [
      'Personas citadas, formalizadas o investigadas por delitos de relevancia económica.',
      'Personas o empresas que evalúan deducir querella.',
      'Organizaciones que necesitan ordenar antecedentes frente a una contingencia penal.',
      'Conflictos donde documentos comerciales, contables y comunicaciones deben analizarse en conjunto.',
    ],
    documents: [
      'Citaciones, resoluciones, requerimientos y antecedentes de la investigación disponibles.',
      'Contratos, registros contables y documentos comerciales relacionados.',
      'Una identificación clara de las personas y entidades involucradas.',
      'Comunicaciones pertinentes, preservadas en su formato original y sin alteraciones.',
    ],
    steps: [
      { title: 'Precisar la situación procesal', text: 'Identificamos la etapa, los actores y las decisiones que tienen plazos o consecuencias inmediatas.' },
      { title: 'Contrastar los antecedentes', text: 'Leemos los documentos en su contexto y separamos hechos acreditados, inferencias y puntos que aún requieren verificación.' },
      { title: 'Construir la estrategia', text: 'Definimos una respuesta acorde con la defensa o representación requerida, sin prometer resultados anticipados.' },
    ],
    faqs: [
      { question: '¿Qué hago si recibí una citación?', answer: 'Conserva el documento y revisa de inmediato la fecha, el tribunal y la actuación requerida. Evita improvisar declaraciones o modificar antecedentes antes de obtener orientación.' },
      { question: '¿Puedo consultar aunque todavía no exista una formalización?', answer: 'Sí. La consulta puede ocurrir antes de esa etapa. Para orientar la revisión es importante explicar con precisión qué antecedentes o actuaciones conoces.' },
      { question: '¿Debo ordenar o editar los documentos antes de enviarlos?', answer: 'Conviene preservarlos tal como están. Puedes preparar un índice o una cronología separada, pero no alterar, completar o eliminar documentos originales.' },
    ],
    seoDescription: 'Defensa y representación en penal económico, querellas y contingencias penales de empresas en la Región Metropolitana y O’Higgins.',
  },
  {
    slug: 'derecho-publico',
    title: 'Derecho público',
    short: 'Derecho público',
    description: 'Litigación y asesoría frente a actuaciones de la Administración, con especial atención a la estrategia procesal y a los derechos involucrados.',
    matters: ['Contencioso-administrativo', 'Actuaciones administrativas', 'Litigación pública'],
    image: '/fotos/area-publico.webp',
    imageWidth: 720,
    imageHeight: 420,
    lead: 'Frente a una actuación de la Administración, es esencial identificar el acto cuestionado, sus efectos y las vías de impugnación disponibles antes de elegir una estrategia.',
    situations: [
      'Actos administrativos que afectan derechos, intereses o la continuidad de una actividad.',
      'Sanciones, requerimientos o decisiones cuya legalidad se busca revisar.',
      'Conflictos que exigen coordinar actuaciones administrativas y judiciales.',
      'Necesidad de ordenar antecedentes antes de presentar una impugnación o acción judicial.',
    ],
    documents: [
      'El acto, resolución, sanción o requerimiento que se busca revisar.',
      'La historia de expedientes, solicitudes y respuestas administrativas.',
      'Plazos, notificaciones y comprobantes de recepción disponibles.',
      'Antecedentes técnicos que expliquen el impacto de la actuación.',
    ],
    steps: [
      { title: 'Identificar acto y efectos', text: 'Determinamos qué decisión está en discusión, a quién afecta y qué antecedentes administrativos existen.' },
      { title: 'Revisar vías y plazos', text: 'Examinamos las alternativas de impugnación y las exigencias procesales que deben considerarse.' },
      { title: 'Integrar la litigación', text: 'Coordinamos argumentos, prueba y actuaciones para mantener una estrategia coherente entre las distintas sedes.' },
    ],
    faqs: [
      { question: '¿Qué debo llevar si quiero impugnar una decisión administrativa?', answer: 'La decisión completa, sus notificaciones y los antecedentes del expediente. También es útil explicar qué efecto concreto produce y qué actuaciones ya intentaste.' },
      { question: '¿Por qué importan tanto las fechas de notificación?', answer: 'Porque permiten revisar plazos y oportunidad de las actuaciones. Conviene conservar los comprobantes y no estimar fechas de memoria.' },
      { question: '¿Siempre corresponde acudir directamente a un tribunal?', answer: 'No. La vía depende del acto y del régimen aplicable. Primero debe revisarse si existen recursos o etapas administrativas que incidan en la estrategia.' },
    ],
    seoDescription: 'Litigación y asesoría frente a actuaciones administrativas, sanciones y conflictos de derecho público en la Región Metropolitana y O’Higgins.',
  },
  {
    slug: 'litigacion-laboral',
    title: 'Litigación laboral',
    short: 'Litigación laboral',
    description: 'Representación en conflictos laborales que requieren combinar conocimiento técnico, preparación probatoria y una mirada práctica del conflicto.',
    matters: ['Litigios laborales', 'Estrategia probatoria', 'Asesoría en conflictos'],
    image: '/fotos/area-laboral.webp',
    imageWidth: 900,
    imageHeight: 592,
    lead: 'Un conflicto laboral no se comprende sólo por la controversia formal: también importan la relación previa, las comunicaciones y la prueba que cada parte puede aportar.',
    situations: [
      'Conflictos derivados del término de una relación laboral.',
      'Demandas, reclamos o controversias que requieren representación judicial.',
      'Discusiones sobre obligaciones, pagos o incumplimientos alegados por alguna de las partes.',
      'Casos que necesitan una preparación coordinada de documentos, testigos y antecedentes.',
    ],
    documents: [
      'Contrato, anexos, finiquitos, liquidaciones y otros documentos de la relación laboral.',
      'Cartas, correos y comunicaciones vinculadas con el conflicto.',
      'Comprobantes de pagos y registros relacionados con las sumas discutidas.',
      'Una cronología de los hechos y una lista de posibles testigos, sin preparar sus declaraciones.',
    ],
    steps: [
      { title: 'Reconstruir la relación', text: 'Ordenamos los hitos de la relación laboral y el origen concreto del conflicto.' },
      { title: 'Preparar la prueba', text: 'Revisamos documentos y demás antecedentes disponibles, distinguiendo lo que falta acreditar.' },
      { title: 'Definir la respuesta', text: 'Evaluamos la estrategia de litigación y las alternativas de solución según el contexto del caso.' },
    ],
    faqs: [
      { question: '¿Qué antecedentes laborales conviene reunir?', answer: 'Contrato, anexos, liquidaciones, finiquito si existe, comprobantes de pago y comunicaciones relevantes. No es necesario tener todo para realizar una primera consulta.' },
      { question: '¿Puedo consultar si aún no hay una demanda?', answer: 'Sí. Una conversación temprana puede ayudar a ordenar antecedentes y comprender alternativas antes de adoptar una decisión.' },
      { question: '¿La existencia de documentos garantiza el resultado?', answer: 'No. Los documentos deben evaluarse junto con los hechos, las reglas aplicables y el resto de la prueba. Ningún resultado judicial puede garantizarse.' },
    ],
    seoDescription: 'Representación y estrategia probatoria en litigación laboral en la Región Metropolitana y la Región de O’Higgins.',
  },
]

export const areaBySlug = (slug?: string) => practiceAreas.find((area) => area.slug === slug)
