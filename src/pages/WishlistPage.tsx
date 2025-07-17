import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PropertyCard } from '@/components/home/PropertyCard'
import { Property } from '@/types'
import { blink } from '@/blink/client'

// Mock wishlist data
const mockWishlistProperties: Property[] = [
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
  }
]

export function WishlistPage() {
  const [user, setUser] = useState(null)
  const [wishlistProperties, setWishlistProperties] = useState<Property[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.user) {
        navigate('/')
      }
    })
    return unsubscribe
  }, [navigate])

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true)
      try {
        // In a real app, fetch wishlist from database
        await new Promise(resolve => setTimeout(resolve, 500))
        setWishlistProperties(mockWishlistProperties)
        setFavorites(new Set(mockWishlistProperties.map(p => p.id)))
      } catch (error) {
        console.error('Error loading wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadWishlist()
    }
  }, [user])

  const handleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId)
        // Remove from wishlist
        setWishlistProperties(current => current.filter(p => p.id !== propertyId))
      } else {
        newFavorites.add(propertyId)
      }
      return newFavorites
    })
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wishlists</h1>
          <p className="text-gray-600">Your saved properties and favorites</p>
        </div>

        {wishlistProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorite={handleFavorite}
                isFavorited={favorites.has(property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Create your first wishlist
              </h3>
              <p className="text-gray-600 mb-8">
                As you search, tap the heart icon to save your favorite places to stay or things to do to a wishlist.
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-primary hover:bg-primary/90"
              >
                Start exploring
              </Button>
            </div>
          </div>
        )}

        {/* Create New Wishlist Card */}
        {wishlistProperties.length > 0 && (
          <Card className="mt-8 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create a new wishlist</h3>
              <p className="text-gray-600 text-center">
                Organize your favorites into different collections
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}