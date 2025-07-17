import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Share, Star, MapPin, Users, Bed, Bath, Wifi, Car, Utensils, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Property } from '@/types'
import { blink } from '@/blink/client'

// Mock property data - in real app this would come from database
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Cozy Beachfront Villa',
    description: 'Beautiful villa with ocean views and private beach access. Perfect for families and groups looking for a relaxing getaway. The villa features modern amenities, spacious rooms, and stunning sunset views from the terrace.',
    price: 250,
    location: 'Malibu, California',
    latitude: 34.0259,
    longitude: -118.7798,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520637736862-4d197d17c93a?w=800&h=600&fit=crop'
    ],
    hostId: 'host1',
    hostName: 'Sarah',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 4.9,
    reviewCount: 127,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Beach Access', 'Hot Tub'],
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
    description: 'Stylish apartment in downtown with city views and modern amenities. Walking distance to restaurants, shops, and public transportation.',
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
  }
]

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Pool': Waves,
  'Kitchen': Utensils,
  'Parking': Car,
  'Beach Access': Waves,
  'Hot Tub': Waves,
  'Gym': Users,
  'Doorman': Users
}

export function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    // In real app, fetch from database
    const foundProperty = mockProperties.find(p => p.id === id)
    setProperty(foundProperty || null)
  }, [id])

  const handleBookNow = () => {
    if (!user) {
      blink.auth.login()
      return
    }
    navigate(`/book/${id}`)
  }

  const handleFavorite = () => {
    if (!user) {
      blink.auth.login()
      return
    }
    setIsFavorited(!isFavorited)
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    )
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
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleFavorite}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-current text-gray-900" />
              <span className="font-medium text-gray-900">{property.rating}</span>
              <span>({property.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{property.location}</span>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 rounded-xl overflow-hidden">
          <div className="aspect-square md:aspect-[4/3]">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setCurrentImageIndex((currentImageIndex + 1) % property.images.length)}
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2">
            {property.images.slice(1, 5).map((image, index) => (
              <div key={index} className="aspect-square">
                <img
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setCurrentImageIndex(index + 1)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {property.propertyType} hosted by {property.hostName}
                </h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span>{property.maxGuests} guests</span>
                  <span>•</span>
                  <span>{property.bedrooms} bedrooms</span>
                  <span>•</span>
                  <span>{property.bathrooms} bathrooms</span>
                </div>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarImage src={property.hostAvatar} />
                <AvatarFallback>{property.hostName[0]}</AvatarFallback>
              </Avatar>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What this place offers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Wifi
                  return (
                    <div key={amenity} className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">${property.price}</span>
                  <span className="text-gray-600">night</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-gray-300 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                        Check-in
                      </label>
                      <div className="text-sm text-gray-900 mt-1">Add date</div>
                    </div>
                    <div className="border border-gray-300 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                        Check-out
                      </label>
                      <div className="text-sm text-gray-900 mt-1">Add date</div>
                    </div>
                  </div>

                  <div className="border border-gray-300 rounded-lg p-3">
                    <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      Guests
                    </label>
                    <div className="text-sm text-gray-900 mt-1">1 guest</div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3"
                    onClick={handleBookNow}
                  >
                    Reserve
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    You won't be charged yet
                  </p>

                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">${property.price} x 5 nights</span>
                      <span className="text-gray-900">${property.price * 5}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cleaning fee</span>
                      <span className="text-gray-900">$50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service fee</span>
                      <span className="text-gray-900">$75</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>${property.price * 5 + 50 + 75}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}