import React, { useState, useEffect } from "react";
import {
  Book,
  ShoppingCart,
  LogOut,
  Search,
  MapPin,
  PlusCircle,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";
import CartSidebar from "./CartSidebar";

interface AuthenticatedNavProps {
  onLogout: () => void;
}

interface CartItem {
  id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  cover: string;
}

const AuthenticatedNav: React.FC<AuthenticatedNavProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, selectedCity, setSelectedCity, cities } =
    useBooks();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    onLogout(); // Call the logout function
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      if (isCityDropdownOpen) {
        setIsCityDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen, isCityDropdownOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Book className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  BookHaven
                </span>
              </Link>
            </div>

            {/* Center Search - Hidden on mobile */}
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 
                             text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 
                             focus:ring-blue-600 focus:border-transparent text-sm"
                    placeholder="Search books..."
                  />
                </div>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* City Selector */}
              <div className="relative">
                {" "}
                {/* This should be separate */}
                <button
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">{selectedCity}</span>
                </button>
                {isCityDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsCityDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Book Button */}
              <button
                onClick={() => navigate("/addbook")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Add Book</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all relative"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                aria-label="Log Out"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar Component */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default AuthenticatedNav;
