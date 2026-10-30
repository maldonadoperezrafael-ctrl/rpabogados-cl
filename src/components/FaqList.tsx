import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAnalytics } from '@/lib/analytics'

type Faq = { question: string; answer: string }

export default function FaqList({ items, initialOpen = 0 }: { items: Faq[]; initialOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(initialOpen)
  const id = useId()
  const track = useAnalytics()

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const expanded = open === index
        const panelId = `${id}-panel-${index}`
        return (
          <article className={`faq-item ${expanded ? 'is-open' : ''}`} key={item.question}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(expanded ? null : index)
                  if (!expanded) track('faq_open', item.question)
                }}
              >
                <span>{item.question}</span><ChevronDown size={20} aria-hidden="true" />
              </button>
            </h3>
            {expanded && <div className="faq-answer" id={panelId}><p>{item.answer}</p></div>}
          </article>
        )
      })}
    </div>
  )
}
