import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Users, Star, MapPin, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Property } from '@/types'
import { blink } from '@/blink/client'

// Mock property data - in real app this would come from database
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Cozy Beachfront Villa',
    description: 'Beautiful villa with ocean views and private beach access.',
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
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Beach Access', 'Hot Tub'],
    propertyType: 'Villa',
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function BookingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [user, setUser] = useState(null)
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user) {
        setEmail(state.user.email || '')
        setFirstName(state.user.displayName?.split(' ')[0] || '')
        setLastName(state.user.displayName?.split(' ')[1] || '')
      }
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    // In real app, fetch from database
    const foundProperty = mockProperties.find(p => p.id === id)
    setProperty(foundProperty || null)
  }, [id])

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = () => {
    if (!property) return 0
    const nights = calculateNights()
    const subtotal = property.price * nights
    const cleaningFee = 50
    const serviceFee = Math.round(subtotal * 0.1)
    return subtotal + cleaningFee + serviceFee
  }

  const handleBooking = async () => {
    if (!user) {
      blink.auth.login()
      return
    }

    if (!checkInDate || !checkOutDate || !firstName || !lastName || !email) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real app, create booking in database
      const bookingData = {
        propertyId: property?.id,
        userId: user.id,
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
        guests,
        totalPrice: calculateTotal(),
        status: 'confirmed'
      }
      
      console.log('Booking created:', bookingData)
      
      // Redirect to trips page
      navigate('/trips?booking=success')
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
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

  const nights = calculateNights()
  const subtotal = property.price * nights
  const cleaningFee = 50
  const serviceFee = Math.round(subtotal * 0.1)
  const total = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/property/${id}`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to property</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm and pay</h1>
              <p className="text-gray-600">Your trip is protected by Airbnb Cover</p>
            </div>

            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your trip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Check-in</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {checkInDate ? checkInDate.toLocaleDateString() : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={checkInDate}
                          onSelect={setCheckInDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Check-out</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {checkOutDate ? checkOutDate.toLocaleDateString() : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={checkOutDate}
                          onSelect={setCheckOutDate}
                          disabled={(date) => date < (checkInDate || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Guests</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      -
                    </Button>
                    <span className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{guests} guest{guests > 1 ? 's' : ''}</span>
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
                      disabled={guests >= property.maxGuests}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guest information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card number *</Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry date *</Label>
                    <Input
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Button */}
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg"
              onClick={handleBooking}
              disabled={loading || !checkInDate || !checkOutDate}
            >
              {loading ? 'Processing...' : `Confirm and pay $${total}`}
            </Button>
          </div>

          {/* Property Summary */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardContent className="p-6">
                {/* Property Info */}
                <div className="flex space-x-4 mb-6">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {property.location}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-current text-gray-900" />
                        <span className="text-sm font-medium">{property.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({property.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Host Info */}
                <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={property.hostAvatar} />
                    <AvatarFallback>{property.hostName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">Hosted by {property.hostName}</p>
                    <p className="text-sm text-gray-600">Superhost</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Price details</h4>
                  
                  {nights > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>${property.price} x {nights} nights</span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cleaning fee</span>
                        <span>${cleaningFee}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fee</span>
                        <span>${serviceFee}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total (USD)</span>
                        <span>${total}</span>
                      </div>
                    </>
                  )}
                  
                  {nights === 0 && (
                    <p className="text-sm text-gray-500">Select dates to see pricing</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}