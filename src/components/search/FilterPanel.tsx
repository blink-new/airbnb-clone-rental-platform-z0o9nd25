import { useState } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  onFiltersChange: (filters: SearchFilters) => void
  currentFilters: SearchFilters
}

interface SearchFilters {
  priceRange: [number, number]
  propertyTypes: string[]
  amenities: string[]
  bedrooms: number | null
  bathrooms: number | null
  instantBook: boolean
  superhost: boolean
}

const PROPERTY_TYPES = [
  'House',
  'Apartment',
  'Villa',
  'Cabin',
  'Loft',
  'Castle',
  'Condo',
  'Townhouse'
]

const AMENITIES = [
  'WiFi',
  'Kitchen',
  'Pool',
  'Parking',
  'Hot Tub',
  'Gym',
  'Beach Access',
  'Fireplace',
  'Balcony',
  'Garden',
  'BBQ',
  'Workspace'
]

export function FilterPanel({ isOpen, onClose, onFiltersChange, currentFilters }: FilterPanelProps) {
  const [filters, setFilters] = useState<SearchFilters>(currentFilters)

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] }
    setFilters(newFilters)
  }

  const handlePropertyTypeToggle = (type: string) => {
    const newTypes = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter(t => t !== type)
      : [...filters.propertyTypes, type]
    const newFilters = { ...filters, propertyTypes: newTypes }
    setFilters(newFilters)
  }

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity]
    const newFilters = { ...filters, amenities: newAmenities }
    setFilters(newFilters)
  }

  const handleBedroomChange = (bedrooms: number | null) => {
    const newFilters = { ...filters, bedrooms }
    setFilters(newFilters)
  }

  const handleBathroomChange = (bathrooms: number | null) => {
    const newFilters = { ...filters, bathrooms }
    setFilters(newFilters)
  }

  const handleInstantBookToggle = () => {
    const newFilters = { ...filters, instantBook: !filters.instantBook }
    setFilters(newFilters)
  }

  const handleSuperhostToggle = () => {
    const newFilters = { ...filters, superhost: !filters.superhost }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFiltersChange(filters)
    onClose()
  }

  const handleClearFilters = () => {
    const clearedFilters: SearchFilters = {
      priceRange: [0, 1000],
      propertyTypes: [],
      amenities: [],
      bedrooms: null,
      bathrooms: null,
      instantBook: false,
      superhost: false
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++
    if (filters.propertyTypes.length > 0) count++
    if (filters.amenities.length > 0) count++
    if (filters.bedrooms !== null) count++
    if (filters.bathrooms !== null) count++
    if (filters.instantBook) count++
    if (filters.superhost) count++
    return count
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Price range</h3>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}+</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Property Type */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Property type</h3>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.propertyTypes.includes(type)}
                    onCheckedChange={() => handlePropertyTypeToggle(type)}
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Rooms and beds */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Rooms and beds</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Bedrooms</label>
                <div className="flex space-x-2">
                  <Button
                    variant={filters.bedrooms === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleBedroomChange(null)}
                  >
                    Any
                  </Button>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      variant={filters.bedrooms === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleBedroomChange(num)}
                    >
                      {num}+
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Bathrooms</label>
                <div className="flex space-x-2">
                  <Button
                    variant={filters.bathrooms === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleBathroomChange(null)}
                  >
                    Any
                  </Button>
                  {[1, 2, 3, 4].map((num) => (
                    <Button
                      key={num}
                      variant={filters.bathrooms === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleBathroomChange(num)}
                    >
                      {num}+
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Amenities */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {AMENITIES.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <label
                    htmlFor={`amenity-${amenity}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Booking options */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Booking options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="instant-book"
                  checked={filters.instantBook}
                  onCheckedChange={handleInstantBookToggle}
                />
                <label
                  htmlFor="instant-book"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Instant Book
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="superhost"
                  checked={filters.superhost}
                  onCheckedChange={handleSuperhostToggle}
                />
                <label
                  htmlFor="superhost"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Superhost
                </label>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear all
          </Button>
          <Button onClick={handleApplyFilters} className="bg-primary hover:bg-primary/90">
            Show {/* This would show filtered count in real app */} places
          </Button>
        </div>
      </Card>
    </div>
  )
}