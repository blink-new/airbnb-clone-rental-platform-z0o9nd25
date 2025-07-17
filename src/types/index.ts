export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  latitude: number
  longitude: number
  images: string[]
  hostId: string
  hostName: string
  hostAvatar: string
  rating: number
  reviewCount: number
  amenities: string[]
  propertyType: string
  maxGuests: number
  bedrooms: number
  bathrooms: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  displayName: string
  avatar?: string
  isHost: boolean
  createdAt: string
}

export interface Booking {
  id: string
  propertyId: string
  userId: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface Review {
  id: string
  propertyId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  createdAt: string
}

export interface SearchFilters {
  location: string
  checkIn: string
  checkOut: string
  guests: number
  priceMin?: number
  priceMax?: number
  propertyType?: string
  amenities?: string[]
}