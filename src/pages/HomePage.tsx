import { useState } from 'react'
import { CategoryFilter } from '@/components/home/CategoryFilter'
import { PropertyGrid } from '@/components/home/PropertyGrid'
import { SearchFilters } from '@/types'

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null)

  return (
    <div>
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertyGrid 
          category={selectedCategory} 
          searchFilters={searchFilters}
        />
      </main>
    </div>
  )
}