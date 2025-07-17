import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Users, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('location')
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  const popularDestinations = [
    'New York, NY',
    'Los Angeles, CA',
    'Miami, FL',
    'San Francisco, CA',
    'Chicago, IL',
    'Las Vegas, NV',
    'Seattle, WA',
    'Boston, MA'
  ]

  const handleSearch = () => {
    const searchParams = new URLSearchParams()
    
    if (location) searchParams.set('location', location)
    if (checkIn) searchParams.set('checkIn', checkIn)
    if (checkOut) searchParams.set('checkOut', checkOut)
    
    const totalGuests = adults + children
    if (totalGuests > 1) searchParams.set('guests', totalGuests.toString())
    
    navigate(`/search?${searchParams.toString()}`)
    onClose()
  }

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation)
    setActiveTab('dates')
  }

  const incrementGuests = (type: 'adults' | 'children' | 'infants') => {
    switch (type) {
      case 'adults':
        setAdults(prev => prev + 1)
        break
      case 'children':
        setChildren(prev => prev + 1)
        break
      case 'infants':
        setInfants(prev => prev + 1)
        break
    }
  }

  const decrementGuests = (type: 'adults' | 'children' | 'infants') => {
    switch (type) {
      case 'adults':
        setAdults(prev => Math.max(1, prev - 1))
        break
      case 'children':
        setChildren(prev => Math.max(0, prev - 1))
        break
      case 'infants':
        setInfants(prev => Math.max(0, prev - 1))
        break
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search for stays</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="location" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Where</span>
            </TabsTrigger>
            <TabsTrigger value="dates" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>When</span>
            </TabsTrigger>
            <TabsTrigger value="guests" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Who</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="space-y-4">
            <div>
              <Label htmlFor="location">Where are you going?</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  placeholder="Search destinations"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Popular destinations</h4>
              <div className="grid grid-cols-2 gap-2">
                {popularDestinations.map((destination) => (
                  <Button
                    key={destination}
                    variant="outline"
                    onClick={() => handleLocationSelect(destination)}
                    className="justify-start text-left h-auto py-3"
                  >
                    <div>
                      <div className="font-medium">{destination}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dates" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn">Check-in</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Flexible dates?</h4>
              <p className="text-sm text-gray-600">
                Exact dates don't work? Try searching with flexible dates to find the best deals.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="guests" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">Adults</div>
                  <div className="text-sm text-gray-600">Ages 13 or above</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => decrementGuests('adults')}
                    disabled={adults <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{adults}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => incrementGuests('adults')}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">Children</div>
                  <div className="text-sm text-gray-600">Ages 2-12</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => decrementGuests('children')}
                    disabled={children <= 0}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{children}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => incrementGuests('children')}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">Infants</div>
                  <div className="text-sm text-gray-600">Under 2</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => decrementGuests('infants')}
                    disabled={infants <= 0}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{infants}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => incrementGuests('infants')}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-white flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}