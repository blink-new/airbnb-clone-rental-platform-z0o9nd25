import { useState, useEffect } from 'react'
import { MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Property } from '@/types'

interface MapViewProps {
  properties: Property[]
  selectedProperty?: Property | null
  onPropertySelect?: (property: Property | null) => void
  onClose?: () => void
}

export function MapView({ properties, selectedProperty, onPropertySelect, onClose }: MapViewProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 })
  const [zoom, setZoom] = useState(10)

  // Calculate map bounds based on properties
  useEffect(() => {
    if (properties.length > 0) {
      const lats = properties.map(p => p.latitude)
      const lngs = properties.map(p => p.longitude)
      const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2
      const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2
      setMapCenter({ lat: centerLat, lng: centerLng })
    }
  }, [properties])

  const handleMarkerClick = (property: Property) => {
    onPropertySelect?.(property)
  }

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-xl overflow-hidden">
      {/* Close button */}
      {onClose && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white shadow-md"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* Map placeholder with property markers */}
      <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100">
        {/* Map background pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Property markers */}
        {properties.map((property, index) => {
          const x = 20 + (index % 5) * 150 + Math.random() * 100
          const y = 50 + Math.floor(index / 5) * 120 + Math.random() * 80
          const isSelected = selectedProperty?.id === property.id

          return (
            <div
              key={property.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
              }`}
              style={{ left: `${x}px`, top: `${y}px` }}
              onClick={() => handleMarkerClick(property)}
            >
              {/* Price marker */}
              <div
                className={`px-3 py-1 rounded-full text-sm font-semibold shadow-lg transition-colors ${
                  isSelected
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                ${property.price}
              </div>
              
              {/* Location pin */}
              <div className="flex justify-center mt-1">
                <MapPin 
                  className={`h-4 w-4 ${
                    isSelected ? 'text-gray-900' : 'text-gray-600'
                  }`} 
                />
              </div>
            </div>
          )
        })}

        {/* Selected property popup */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-4 right-4 z-30">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {selectedProperty.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedProperty.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        ${selectedProperty.price}/night
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">⭐</span>
                        <span className="text-sm font-medium">
                          {selectedProperty.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Map controls */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(zoom + 1, 18))}
            className="bg-white shadow-md w-10 h-10 p-0"
          >
            +
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(zoom - 1, 1))}
            className="bg-white shadow-md w-10 h-10 p-0"
          >
            -
          </Button>
        </div>

        {/* Map attribution */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
          Interactive Map View
        </div>
      </div>
    </div>
  )
}