import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { HomePage } from '@/pages/HomePage'
import { PropertyDetailsPage } from '@/pages/PropertyDetailsPage'
import { SearchResultsPage } from '@/pages/SearchResultsPage'
import { BookingPage } from '@/pages/BookingPage'
import { TripsPage } from '@/pages/TripsPage'
import { WishlistPage } from '@/pages/WishlistPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App