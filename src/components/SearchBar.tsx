
'use client'
import { useEffect, useMemo, useState, useRef } from 'react'
import { liveSearch } from '@/lib/search'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import SearchSuggestions from './SearchSuggestions'
import { useProductStore } from '@/lib/productStore'

export default function SearchBar(){
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [apiSuggestions, setApiSuggestions] = useState<any[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const router = useRouter()
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { products } = useProductStore();

  // Combine local search with API suggestions
  const localItems = useMemo(() => liveSearch(q, products).map(p => ({ id: p.id, slug:p.slug, name: p.name, image: p.image, price: p.price.discounted ?? p.price.original })), [q, products])
  
  // Fetch API suggestions when user types
  useEffect(() => {
    if (!q.trim() || q.length < 2) {
      setApiSuggestions([])
      return
    }
    
    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true)
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(q)}&limit=5`)
        if (response.ok) {
          const data = await response.json()
          const suggestions = (data.data || data || [])
            .filter((p: any) => 
              p.category !== 'Ayurvedic' && 
              p.subcategory !== 'Ayurvedic' &&
              !p.name?.toLowerCase().includes('ayurvedic')
            )
            .map((p: any) => ({
              id: p.id || p._id,
              slug: p.slug,
              name: p.name,
              image: p.image,
              price: p.price?.discounted ?? p.price?.original ?? 0
            }))
          setApiSuggestions(suggestions)
        }
      } catch (error) {
        console.error('Error fetching search suggestions:', error)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }
    
    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [q])
  
  // Combine local and API suggestions, remove duplicates
  const items = useMemo(() => {
    const combined = [...localItems, ...apiSuggestions]
    const unique = combined.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    )
    return unique.slice(0, 8) // Limit to 8 suggestions
  }, [localItems, apiSuggestions])

  useEffect(() => { 
    setOpen(!!q && (items.length > 0 || isLoadingSuggestions)) 
  }, [q, items, isLoadingSuggestions])
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const go = (e?: React.FormEvent) => { 
    e?.preventDefault(); 
    if (!q.trim()) return;
    router.push(`/search?query=${encodeURIComponent(q)}`); 
    setOpen(false); 
  }

  return (
    <div className="relative" ref={searchContainerRef}>
      <form onSubmit={go} className="flex w-full items-center rounded-full border bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/50 transition-all">
        <label htmlFor="search-input" className="pl-3">
          <Search className="text-gray-500 h-5 w-5"/>
        </label>
        <input 
          id="search-input"
          value={q} 
          onFocus={() => setOpen(!!q && items.length > 0)}
          onChange={e => setQ(e.target.value)} 
          placeholder="Search for mobiles, kurta, ashwagandha..." 
          className="w-full bg-transparent px-3 py-2 outline-none" 
        />
        {q && (
          <button type="button" onClick={() => setQ('')} className="pr-3 text-gray-500">
            <X className="h-5 w-5" />
          </button>
        )}
      </form>
      {open && <SearchSuggestions items={items} onPick={() => setOpen(false)} />}
    </div>
  )
}
