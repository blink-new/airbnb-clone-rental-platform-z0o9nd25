import { useState, useEffect } from 'react'
import { Property } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star } from 'lucide-react'

interface MapViewProps {
  properties: Property[]
  onPropertySelect: (property: Property) => void
  selectedProperty?: Property | null
}

export function MapView({ properties, onPropertySelect, selectedProperty }: MapViewProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })

  useEffect(() => {
    if (properties.length > 0) {
      // Calculate center based on properties
      const avgLat = properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length
      const avgLng = properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length
      setMapCenter({ lat: avgLat, lng: avgLng })
    }
  }, [properties])

  return (
    <div className="relative h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Map Pins */}
      <div className="absolute inset-0">
        {properties.map((property, index) => {
          // Simple positioning based on lat/lng (mock positioning)
          const x = ((property.longitude + 180) / 360) * 100
          const y = ((90 - property.latitude) / 180) * 100
          
          const isSelected = selectedProperty?.id === property.id
          
          return (
            <div
              key={property.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${Math.max(10, Math.min(90, x))}%`,
                top: `${Math.max(10, Math.min(90, y))}%`
              }}
              onClick={() => onPropertySelect(property)}
            >
              {/* Price Pin */}
              <div className={`
                relative px-3 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-110
                ${isSelected 
                  ? 'bg-gray-900 text-white scale-110' 
                  : 'bg-white text-gray-900 hover:shadow-xl'
                }
              `}>
                ${property.price}
                
                {/* Pin Point */}
                <div className={`
                  absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 
                  border-l-4 border-r-4 border-transparent
                  ${isSelected ? 'border-t-gray-900' : 'border-t-white'}
                `} />
              </div>

              {/* Property Card on Hover/Select */}
              {isSelected && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10">
                  <Card className="w-64 shadow-xl">
                    <CardContent className="p-0">
                      <div className="aspect-video relative">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center space-x-1 bg-white/90 rounded px-2 py-1">
                            <Star className="h-3 w-3 fill-current text-gray-900" />
                            <span className="text-xs font-medium">{property.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                          {property.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 truncate">
                          {property.location}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline space-x-1">
                            <span className="font-semibold text-gray-900 text-sm">
                              ${property.price}
                            </span>
                            <span className="text-xs text-gray-600">night</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Navigate to property details
                              window.location.href = `/property/${property.id}`
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-white shadow-md"
          onClick={() => {
            // Zoom in functionality
            console.log('Zoom in')
          }}
        >
          +
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white shadow-md"
          onClick={() => {
            // Zoom out functionality
            console.log('Zoom out')
          }}
        >
          -
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin className="h-3 w-3" />
            <span>{properties.length} properties</span>
          </div>
        </div>
      </div>
    </div>
  )
}