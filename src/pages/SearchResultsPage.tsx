import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { PropertyCard } from '@/components/home/PropertyCard'
import { MapView } from '@/components/map/MapView'
import { FilterPanel } from '@/components/search/FilterPanel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Property, SearchFilters } from '@/types'
import { ArrowLeft, MapPin, Calendar, Users, Map, Grid3X3, SlidersHorizontal } from 'lucide-react'

// Mock properties data
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Cozy Beachfront Villa',
    description: 'Beautiful villa with ocean views',
    price: 250,
    location: 'Malibu, California',
    latitude: 34.0259,
    longitude: -118.7798,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    ],
    hostId: 'host1',
    hostName: 'Sarah',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 4.9,
    reviewCount: 127,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking'],
    propertyType: 'Villa',
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Modern City Apartment',
    description: 'Stylish apartment in downtown',
    price: 120,
    location: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.0060,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    ],
    hostId: 'host2',
    hostName: 'Michael',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 4.7,
    reviewCount: 89,
    amenities: ['WiFi', 'Kitchen', 'Gym', 'Doorman'],
    propertyType: 'Apartment',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Mountain Cabin Retreat',
    description: 'Peaceful cabin in the mountains',
    price: 180,
    location: 'Aspen, Colorado',
    latitude: 39.1911,
    longitude: -106.8175,
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    hostId: 'host3',
    hostName: 'Emma',
    hostAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 4.8,
    reviewCount: 156,
    amenities: ['WiFi', 'Fireplace', 'Hot Tub', 'Hiking'],
    propertyType: 'Cabin',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    propertyTypes: [] as string[],
    amenities: [] as string[],
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    instantBook: false,
    superhost: false
  })

  // Extract search parameters
  const location = searchParams.get('location') || ''
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guests = parseInt(searchParams.get('guests') || '1')

  useEffect(() => {
    const searchProperties = async () => {
      setLoading(true)
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Filter properties based on search criteria
        let filteredProperties = mockProperties
        
        if (location) {
          filteredProperties = filteredProperties.filter(property =>
            property.location.toLowerCase().includes(location.toLowerCase())
          )
        }
        
        if (guests > 1) {
          filteredProperties = filteredProperties.filter(property =>
            property.maxGuests >= guests
          )
        }
        
        setProperties(filteredProperties)
      } catch (error) {
        console.error('Error searching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    searchProperties()
  }, [location, checkIn, checkOut, guests])

  const handleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId)
      } else {
        newFavorites.add(propertyId)
      }
      return newFavorites
    })
  }

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`)
  }

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {location && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{location}</span>
                </Badge>
              )}
              {checkIn && checkOut && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{checkIn} - {checkOut}</span>
                </Badge>
              )}
              {guests > 1 && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{guests} guests</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {properties.length} stays {location && `in ${location}`}
              </h1>
              <p className="text-gray-600">
                {checkIn && checkOut ? `${checkIn} - ${checkOut}` : 'Flexible dates'} • {guests} guest{guests > 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Filters button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              
              {/* View toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center space-x-2"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span>Grid</span>
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="flex items-center space-x-2"
                >
                  <Map className="h-4 w-4" />
                  <span>Map</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <div 
                  key={property.id} 
                  onClick={() => handlePropertyClick(property.id)}
                  className="cursor-pointer"
                >
                  <PropertyCard
                    property={property}
                    onFavorite={handleFavorite}
                    isFavorited={favorites.has(property.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
              {/* Property List */}
              <div className="space-y-4 overflow-y-auto">
                {properties.map((property) => (
                  <div 
                    key={property.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedProperty?.id === property.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="flex space-x-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{property.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{property.location}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">★</span>
                            <span className="text-sm font-medium">{property.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({property.reviewCount})</span>
                        </div>
                        <div className="flex items-baseline space-x-1 mt-2">
                          <span className="font-semibold text-gray-900">${property.price}</span>
                          <span className="text-sm text-gray-600">night</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Map */}
              <div className="h-full">
                <MapView
                  properties={properties}
                  onPropertySelect={handlePropertySelect}
                  selectedProperty={selectedProperty}
                />
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all properties.
            </p>
            <Button onClick={() => navigate('/')}>
              Browse All Properties
            </Button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={setFilters}
        currentFilters={filters}
      />
    </div>
  )
}