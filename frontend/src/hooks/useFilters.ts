import { useFilterStore } from '@/store/filterStore'
import type { Vulnerability } from '@/types/report'

export function useFilters() {
  const store = useFilterStore()
  return store
}

export function applyFilters(items: Vulnerability[], searchTerm: string, severity: string[], status: string): Vulnerability[] {
  return items.filter((v) => {
    if (searchTerm && !v.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (severity.length > 0 && !severity.includes(v.severity)) return false
    if (status !== 'all' && v.status !== status) return false
    return true
  })
}
