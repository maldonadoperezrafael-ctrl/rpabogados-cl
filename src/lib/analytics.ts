import { useCallback } from 'react'

// La edición pública estática no envía analítica a una base de datos.
export function useAnalytics() {
  return useCallback((_eventName: string, _subject?: string) => undefined, [])
}
