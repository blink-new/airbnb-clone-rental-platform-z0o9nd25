import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Property } from '@/types'

interface PropertyCardProps {
  property: Property
  onFavorite?: (propertyId: string) => void
  isFavorited?: boolean
}

export function PropertyCard({ property, onFavorite, isFavorited = false }: PropertyCardProps) {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavorite?.(property.id)
  }

  const handleCardClick = () => {
    navigate(`/property/${property.id}`)
  }

  return (
    <div className="group cursor-pointer" onClick={handleCardClick}>
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
        {property.images.length > 0 && (
          <>
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
            
            {/* Loading skeleton */}
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {/* Navigation arrows */}
            {property.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 rounded-full p-2 h-8 w-8"
                >
                  <span className="sr-only">Previous image</span>
                  ←
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 rounded-full p-2 h-8 w-8"
                >
                  <span className="sr-only">Next image</span>
                  →
                </Button>
              </>
            )}

            {/* Image indicators */}
            {property.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 h-8 w-8 rounded-full bg-transparent hover:bg-white/10"
        >
          <Heart 
            className={`h-4 w-4 ${
              isFavorited 
                ? 'fill-red-500 text-red-500' 
                : 'text-white/80 hover:text-white'
            }`} 
          />
        </Button>

        {/* Host badge */}
        {property.hostName && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 bg-white/90 text-gray-900 text-xs"
          >
            Superhost
          </Badge>
        )}
      </div>

      {/* Property Info */}
      <div className="space-y-1">
        {/* Location and Rating */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 truncate">
            {property.location}
          </h3>
          {property.rating > 0 && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-current text-gray-900" />
              <span className="text-sm text-gray-900">
                {property.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <p className="text-gray-500 text-sm truncate">
          {property.title}
        </p>

        {/* Dates */}
        <p className="text-gray-500 text-sm">
          Available now
        </p>

        {/* Price */}
        <div className="flex items-baseline space-x-1">
          <span className="font-semibold text-gray-900">
            ${property.price}
          </span>
          <span className="text-gray-500 text-sm">
            night
          </span>
        </div>
      </div>
    </div>
  )
}