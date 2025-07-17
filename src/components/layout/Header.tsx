import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, User, Globe, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { blink } from '@/blink/client'

export function Header() {
  const [user, setUser] = useState(null)
  const [searchLocation, setSearchLocation] = useState('')
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [guests, setGuests] = useState(1)
  const [showSearchDialog, setShowSearchDialog] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchLocation) params.set('location', searchLocation)
    if (checkInDate) params.set('checkIn', checkInDate.toISOString().split('T')[0])
    if (checkOutDate) params.set('checkOut', checkOutDate.toISOString().split('T')[0])
    if (guests > 1) params.set('guests', guests.toString())
    
    navigate(`/search?${params.toString()}`)
    setShowSearchDialog(false)
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleMenuItemClick = (path: string) => {
    if (!user && (path === '/trips' || path === '/wishlist' || path === '/messages' || path === '/profile')) {
      blink.auth.login()
      return
    }
    navigate(path)
  }

  const formatDateRange = () => {
    if (checkInDate && checkOutDate) {
      return `${checkInDate.toLocaleDateString()} - ${checkOutDate.toLocaleDateString()}`
    }
    return 'Any week'
  }

  const formatGuests = () => {
    return guests === 1 ? 'Add guests' : `${guests} guests`
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              airbnb
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex">
            <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
              <DialogTrigger asChild>
                <button className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 max-w-md">
                  <div className="flex items-center px-6 py-2">
                    <div className="text-sm font-medium text-gray-900 border-r border-gray-300 pr-4 min-w-[80px] text-left">
                      {searchLocation || 'Anywhere'}
                    </div>
                    <div className="text-sm font-medium text-gray-900 border-r border-gray-300 px-4 min-w-[100px] text-left">
                      {formatDateRange()}
                    </div>
                    <div className="text-sm text-gray-500 pl-4 pr-2 min-w-[80px] text-left">
                      {formatGuests()}
                    </div>
                    <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 p-2">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Search for places to stay</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Where
                    </label>
                    <Input
                      placeholder="Search destinations"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check in
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {checkInDate ? checkInDate.toLocaleDateString() : "Add date"}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check out
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {checkOutDate ? checkOutDate.toLocaleDateString() : "Add date"}
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

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Who
                    </label>
                    <div className="flex items-center space-x-4">
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
                        onClick={() => setGuests(guests + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Search Button */}
                  <Button onClick={handleSearch} className="w-full bg-primary hover:bg-primary/90">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="hidden md:flex text-sm font-medium"
              onClick={() => handleMenuItemClick('/host')}
            >
              Airbnb your home
            </Button>
            
            <Button variant="ghost" size="sm" className="p-2">
              <Globe className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 rounded-full border-gray-300 hover:shadow-md transition-shadow">
                  <Menu className="h-4 w-4" />
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuItem onClick={() => handleMenuItemClick('/messages')}>
                      Messages
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMenuItemClick('/trips')}>
                      Trips
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMenuItemClick('/wishlist')}>
                      Wishlists
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleMenuItemClick('/host')}>
                      Manage listings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMenuItemClick('/host/experience')}>
                      Host an experience
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMenuItemClick('/profile')}>
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleMenuItemClick('/help')}>
                      Help
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => blink.auth.logout()}>
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => blink.auth.login()}>
                      Log in
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => blink.auth.login()}>
                      Sign up
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleMenuItemClick('/host')}>
                      Airbnb your home
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMenuItemClick('/help')}>
                      Help
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
            <DialogTrigger asChild>
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 cursor-pointer">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">
                  {searchLocation || 'Where are you going?'}
                </span>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Where are you going?"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
                <Button onClick={handleSearch} className="w-full bg-primary hover:bg-primary/90">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}