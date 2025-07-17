import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar, MapPin, Users, Star, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Booking, Property } from '@/types'
import { blink } from '@/blink/client'

// Mock bookings data
const mockBookings: (Booking & { property: Property })[] = [
  {
    id: 'booking_1',
    propertyId: 'prop_1',
    userId: 'user_1',
    checkIn: '2024-02-15',
    checkOut: '2024-02-20',
    guests: 4,
    totalPrice: 1375,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    property: {
      id: 'prop_1',
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
    }
  },
  {
    id: 'booking_2',
    propertyId: 'prop_2',
    userId: 'user_1',
    checkIn: '2024-01-10',
    checkOut: '2024-01-15',
    guests: 2,
    totalPrice: 725,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    property: {
      id: 'prop_2',
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
    }
  }
]

export function TripsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState<(Booking & { property: Property })[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')

  const showSuccessAlert = searchParams.get('booking') === 'success'

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.user && !state.isLoading) {
        navigate('/')
      }
    })
    return unsubscribe
  }, [navigate])

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return
      
      setLoading(true)
      try {
        // In real app, fetch from database filtered by user_id
        // const userBookings = await blink.db.bookings.list({
        //   where: { userId: user.id },
        //   orderBy: { createdAt: 'desc' }
        // })
        
        // For now, use mock data
        setBookings(mockBookings)
      } catch (error) {
        console.error('Error loading bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [user])

  const getBookingStatus = (booking: Booking & { property: Property }) => {
    const today = new Date()
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)

    if (booking.status === 'cancelled') return 'cancelled'
    if (today < checkIn) return 'upcoming'
    if (today >= checkIn && today <= checkOut) return 'current'
    return 'past'
  }

  const filteredBookings = bookings.filter(booking => {
    const status = getBookingStatus(booking)
    if (activeTab === 'upcoming') return status === 'upcoming' || status === 'current'
    if (activeTab === 'past') return status === 'past'
    return true
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleContactHost = (hostName: string) => {
    // In real app, this would open messaging system
    alert(`Contacting ${hostName}...`)
  }

  const handleCancelBooking = (bookingId: string) => {
    // In real app, this would update booking status
    if (confirm('Are you sure you want to cancel this booking?')) {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      )
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to view your trips.</p>
          <Button onClick={() => blink.auth.login()}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Alert */}
        {showSuccessAlert && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              🎉 Booking confirmed! Your trip has been successfully booked.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trips</h1>
          <p className="text-gray-600">Manage your bookings and travel plans</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <div className="w-32 h-24 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredBookings.length > 0 ? (
              <div className="space-y-6">
                {filteredBookings.map((booking) => {
                  const status = getBookingStatus(booking)
                  const nights = calculateNights(booking.checkIn, booking.checkOut)
                  
                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Property Image */}
                          <div className="md:w-48 h-48 md:h-auto">
                            <img
                              src={booking.property.images[0]}
                              alt={booking.property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Booking Details */}
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="text-xl font-semibold text-gray-900">
                                    {booking.property.title}
                                  </h3>
                                  <Badge 
                                    variant={status === 'current' ? 'default' : 'secondary'}
                                    className={
                                      status === 'current' ? 'bg-green-100 text-green-800' :
                                      status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                    }
                                  >
                                    {status === 'current' ? 'Current' : 'Upcoming'}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 flex items-center mb-2">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.property.location}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                                  </div>
                                  <span>{nights} night{nights > 1 ? 's' : ''}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                  ${booking.totalPrice}
                                </p>
                                <p className="text-sm text-gray-600">total</p>
                              </div>
                            </div>

                            {/* Host Info */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={booking.property.hostAvatar} />
                                  <AvatarFallback>{booking.property.hostName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Hosted by {booking.property.hostName}
                                  </p>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 fill-current text-gray-900" />
                                    <span className="text-xs text-gray-600">
                                      {booking.property.rating} ({booking.property.reviewCount})
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleContactHost(booking.property.hostName)}
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  Contact host
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/property/${booking.propertyId}`)}
                                >
                                  View property
                                </Button>
                                {status === 'upcoming' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h3>
                <p className="text-gray-600 mb-4">
                  Time to dust off your bags and start planning your next adventure
                </p>
                <Button onClick={() => navigate('/')}>
                  Start searching
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {filteredBookings.length > 0 ? (
              <div className="space-y-6">
                {filteredBookings.map((booking) => {
                  const nights = calculateNights(booking.checkIn, booking.checkOut)
                  
                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-48 h-48 md:h-auto">
                            <img
                              src={booking.property.images[0]}
                              alt={booking.property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                  {booking.property.title}
                                </h3>
                                <p className="text-gray-600 flex items-center mb-2">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.property.location}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                  </div>
                                  <span>{nights} night{nights > 1 ? 's' : ''}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                  ${booking.totalPrice}
                                </p>
                                <p className="text-sm text-gray-600">total</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={booking.property.hostAvatar} />
                                  <AvatarFallback>{booking.property.hostName[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600">
                                  Hosted by {booking.property.hostName}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/property/${booking.propertyId}`)}
                                >
                                  View property
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/property/${booking.propertyId}#reviews`)}
                                >
                                  Write review
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/book/${booking.propertyId}`)}
                                >
                                  Book again
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No past trips</h3>
                <p className="text-gray-600 mb-4">
                  Your completed trips will appear here
                </p>
                <Button onClick={() => navigate('/')}>
                  Start searching
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}