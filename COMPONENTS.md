# React Components Code

This file contains all the React component code for Shiva's Hub frontend.
Copy each component to its respective file as indicated.

## File: src/components/Navbar.jsx

```jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SH</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Shiva's Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="block py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="py-2 text-gray-700">Hi, {user.name}</div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```

## File: src/components/Footer.jsx

```jsx
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Shiva's Hub</h3>
            <p className="text-sm">
              Premium box cricket turf booking platform in Kalol. Book your slot, play your game!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@shivashub.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Kalol, Gujarat</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Operating Hours</h3>
            <p className="text-sm">Monday - Sunday</p>
            <p className="text-sm">6:00 AM - 11:00 PM</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Shiva's Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

## File: src/components/TurfCard.jsx

```jsx
import { Link } from 'react-router-dom';
import { MapPin, Star, IndianRupee } from 'lucide-react';

const TurfCard = ({ turf }) => {
  return (
    <div className="card group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={turf.images[0]?.url || 'https://via.placeholder.com/400x300'}
          alt={turf.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="badge badge-success">
            {turf.isActive ? 'Available' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{turf.name}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{turf.location.address}, {turf.location.city}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {turf.description}
        </p>

        {/* Rating & Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="font-semibold">{turf.rating}</span>
            <span className="text-gray-500 text-sm">({turf.totalReviews})</span>
          </div>
          <div className="flex items-center text-primary-600 font-bold text-lg">
            <IndianRupee size={18} />
            <span>{turf.pricePerHour}/hr</span>
          </div>
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {turf.facilities.slice(0, 3).map((facility, index) => (
            <span key={index} className="badge badge-info text-xs">
              {facility}
            </span>
          ))}
          {turf.facilities.length > 3 && (
            <span className="badge badge-info text-xs">
              +{turf.facilities.length - 3} more
            </span>
          )}
        </div>

        {/* Book Now Button */}
        <Link to={`/turf/${turf._id}`} className="btn-primary w-full text-center">
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default TurfCard;
```

## File: src/components/SlotGrid.jsx

```jsx
import { useState } from 'react';
import { Clock, Lock } from 'lucide-react';
import { format } from 'date-fns';

const SlotGrid = ({ slots, onSlotSelect, selectedSlot, lockedSlots = [] }) => {
  const getSlotStatus = (slot) => {
    if (slot.status === 'booked') return 'booked';
    if (slot.status === 'locked') return 'locked';
    if (lockedSlots.includes(slot._id)) return 'locked';
    return 'available';
  };

  const getSlotClass = (slot) => {
    const status = getSlotStatus(slot);
    const isSelected = selectedSlot?._id === slot._id;

    if (isSelected) {
      return 'bg-primary-600 text-white border-primary-600 cursor-pointer';
    }

    switch (status) {
      case 'booked':
        return 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300';
      case 'locked':
        return 'bg-yellow-100 text-yellow-700 cursor-not-allowed border-yellow-300';
      default:
        return 'bg-white text-gray-700 hover:bg-primary-50 hover:border-primary-500 cursor-pointer border-gray-300';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {slots.map((slot) => {
        const status = getSlotStatus(slot);
        const isDisabled = status === 'booked' || status === 'locked';

        return (
          <button
            key={slot._id}
            onClick={() => !isDisabled && onSlotSelect(slot)}
            disabled={isDisabled}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${getSlotClass(slot)}`}
          >
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock size={16} />
              <span className="font-semibold">{slot.startTime}</span>
            </div>
            <div className="text-sm opacity-75">
              to {slot.endTime}
            </div>
            {status === 'locked' && (
              <div className="flex items-center justify-center mt-2">
                <Lock size={14} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SlotGrid;
```

---

**Note:** Create each component in its respective file path as shown above. All components use Tailwind CSS classes and Lucide React icons.
