import { useState, useMemo } from 'react'

export function useSearch<T extends Record<string, unknown>>(items: T[], keys: (keyof T)[]) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter((item) =>
      keys.some((k) => String(item[k] ?? '').toLowerCase().includes(q)),
    )
  }, [items, keys, query])

  return { query, setQuery, results }
}
