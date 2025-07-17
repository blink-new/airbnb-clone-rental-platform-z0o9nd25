import { useState } from 'react'
import { 
  Home, 
  Mountain, 
  Waves, 
  TreePine, 
  Building, 
  Tent,
  Castle,
  Palmtree,
  Snowflake,
  Car
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const categories = [
  { id: 'all', name: 'All', icon: Home },
  { id: 'beachfront', name: 'Beachfront', icon: Waves },
  { id: 'cabins', name: 'Cabins', icon: TreePine },
  { id: 'trending', name: 'Trending', icon: Mountain },
  { id: 'city', name: 'City', icon: Building },
  { id: 'camping', name: 'Camping', icon: Tent },
  { id: 'castles', name: 'Castles', icon: Castle },
  { id: 'tropical', name: 'Tropical', icon: Palmtree },
  { id: 'skiing', name: 'Skiing', icon: Snowflake },
  { id: 'road-trips', name: 'Road trips', icon: Car },
]

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          <div className="flex space-x-8 py-4">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.id
              
              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  onClick={() => onCategoryChange(category.id)}
                  className={`flex flex-col items-center space-y-2 min-w-[80px] h-auto py-3 px-4 rounded-lg transition-colors ${
                    isSelected 
                      ? 'text-gray-900 border-b-2 border-gray-900 bg-transparent hover:bg-gray-50' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}