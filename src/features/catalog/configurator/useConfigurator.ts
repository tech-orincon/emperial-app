import { useCallback, useEffect, useRef, useState } from 'react'
import { getServiceConfig, quoteService } from '../../../services/service-config.service'
import { applyPick, visibleGroups } from '../../../lib/configuratorSelection'
import type { ConfigGroup, Quote, RangeSelection } from '../../../types/service-config.types'

/**
 * Estado del configurador de la vitrina. El precio lo calcula siempre el
 * backend: lo que se muestre aquí es exactamente lo que se cobrará.
 */
export function useConfigurator(serviceId: number | undefined) {
  const [groups, setGroups] = useState<ConfigGroup[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [ranges, setRanges] = useState<RangeSelection[]>([])
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isQuoting, setIsQuoting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (serviceId === undefined) return
    let alive = true
    setIsLoading(true)
    getServiceConfig(serviceId)
      .then((c) => {
        if (!alive) return
        setGroups(c.groups)
        setSelected(c.defaultSelection)
        setRanges(c.defaultRanges)
        setQuote(c.defaultQuote)
        setError(null)
      })
      .catch(() => alive && setGroups([]))
      .finally(() => alive && setIsLoading(false))
    return () => {
      alive = false
      if (timer.current) clearTimeout(timer.current)
    }
  }, [serviceId])

  /** Debounce: arrastrar un deslizador no dispara una petición por píxel */
  const requote = useCallback(
    (ids: number[], rs: RangeSelection[]) => {
      if (timer.current) clearTimeout(timer.current)
      setIsQuoting(true)
      timer.current = setTimeout(async () => {
        try {
          setQuote(await quoteService(serviceId as number, ids, rs))
          setError(null)
        } catch {
          setError('No se pudo calcular el precio')
        } finally {
          setIsQuoting(false)
        }
      }, 250)
    },
    [serviceId],
  )

  const pick = useCallback(
    (group: ConfigGroup, optionId: number) => {
      const next = applyPick(groups, selected, group, optionId)
      setSelected(next)
      // Un grupo de escala que se oculta deja de aportar su tramo
      const live = new Set(visibleGroups(groups, next).map((g) => g.id))
      const nextRanges = ranges.filter((r) => live.has(r.groupId))
      setRanges(nextRanges)
      requote(next, nextRanges)
    },
    [groups, selected, ranges, requote],
  )

  const setRange = useCallback(
    (next: RangeSelection) => {
      const merged = [...ranges.filter((r) => r.groupId !== next.groupId), next]
      setRanges(merged)
      requote(selected, merged)
    },
    [ranges, selected, requote],
  )

  // Se deriva de la selección local, no del quote: así los grupos aparecen al
  // instante y no esperan al viaje de red.
  const shown = visibleGroups(groups, selected)

  return {
    /** true si el servicio se vende con configurador */
    hasConfigurator: groups.length > 0,
    groups: shown,
    selected,
    ranges,
    quote,
    isLoading,
    isQuoting,
    error,
    pick,
    setRange,
  }
}
