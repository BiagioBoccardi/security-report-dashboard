import React from 'react'
import { Search } from 'lucide-react'
import { useFilterStore } from '@/store/filterStore'

export const SearchBar: React.FC = () => {
  const { searchTerm, setSearch } = useFilterStore()

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7a90b8' }} />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Cerca severity...'
        style={{
          backgroundColor: '#1c2f5a',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#f0f4ff',
        }}
        className="pl-9 pr-4 py-2 w-52 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-[#7a90b8]"
      />
    </div>
  )
}
