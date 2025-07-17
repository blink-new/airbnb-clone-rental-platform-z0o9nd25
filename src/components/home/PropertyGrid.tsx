import { useState, useEffect, useCallback } from 'react'
import { PropertyCard } from './PropertyCard'
import { Property, SearchFilters } from '@/types'
import { blink } from '@/blink/client'

interface PropertyGridProps {
  category: string
  searchFilters?: SearchFilters | null
}

export function PropertyGrid({ category }: PropertyGridProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const loadProperties = useCallback(async () => {
    setLoading(true)
    try {
      // For now, we'll use mock data. Later we'll fetch from the database
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
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop'
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
        },
        {
          id: '4',
          title: 'Luxury Downtown Loft',
          description: 'Spacious loft with city views',
          price: 300,
          location: 'San Francisco, CA',
          latitude: 37.7749,
          longitude: -122.4194,
          images: [
            'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
          ],
          hostId: 'host4',
          hostName: 'David',
          hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          rating: 4.6,
          reviewCount: 203,
          amenities: ['WiFi', 'Kitchen', 'Balcony', 'Workspace'],
          propertyType: 'Loft',
          maxGuests: 4,
          bedrooms: 2,
          bathrooms: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '5',
          title: 'Tropical Beach House',
          description: 'Paradise by the ocean',
          price: 400,
          location: 'Maui, Hawaii',
          latitude: 20.7984,
          longitude: -156.3319,
          images: [
            'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
          ],
          hostId: 'host5',
          hostName: 'Aloha',
          hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
          rating: 4.9,
          reviewCount: 312,
          amenities: ['WiFi', 'Pool', 'Beach Access', 'Snorkeling'],
          propertyType: 'House',
          maxGuests: 10,
          bedrooms: 5,
          bathrooms: 4,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '6',
          title: 'Historic Castle Stay',
          description: 'Experience medieval luxury',
          price: 500,
          location: 'Edinburgh, Scotland',
          latitude: 55.9533,
          longitude: -3.1883,
          images: [
            'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop'
          ],
          hostId: 'host6',
          hostName: 'Lord William',
          hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          rating: 4.8,
          reviewCount: 89,
          amenities: ['WiFi', 'Fireplace', 'Library', 'Garden'],
          propertyType: 'Castle',
          maxGuests: 12,
          bedrooms: 6,
          bathrooms: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]

      // Filter by category if not 'all'
      let filteredProperties = mockProperties
      if (category !== 'all') {
        filteredProperties = mockProperties.filter(property => {
          switch (category) {
            case 'beachfront':
              return property.location.toLowerCase().includes('beach') || 
                     property.location.toLowerCase().includes('malibu') ||
                     property.location.toLowerCase().includes('maui')
            case 'cabins':
              return property.propertyType.toLowerCase().includes('cabin')
            case 'city':
              return property.location.toLowerCase().includes('new york') ||
                     property.location.toLowerCase().includes('san francisco')
            case 'castles':
              return property.propertyType.toLowerCase().includes('castle')
            case 'tropical':
              return property.location.toLowerCase().includes('hawaii') ||
                     property.location.toLowerCase().includes('maui')
            default:
              return true
          }
        })
      }

      setProperties(filteredProperties)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

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

  if (loading) {
    return (
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
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onFavorite={handleFavorite}
          isFavorited={favorites.has(property.id)}
        />
      ))}
    </div>
  )
}