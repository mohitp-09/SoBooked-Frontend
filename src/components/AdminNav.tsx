import React, { useState, useEffect } from "react";
import {
  BookOpenCheck,
  LogOut,
  Search,
  MapPin,
  PlusCircle,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";
import { Link } from "react-router-dom";

interface AdminNavProps {
  onLogout: () => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, selectedCity, setSelectedCity, cities } =
    useBooks();
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
      <Link
        to="/" // Replace href with "to"
        className="group flex items-center transition-all duration-300 hover:scale-105"
      >
        <div className="relative">
          <BookOpenCheck
            className="h-8 w-8 text-blue-600 transition-all duration-300 group-hover:text-blue-700"
            style={{
              filter: "drop-shadow(0 0 8px rgba(37, 99, 235, 0.2))",
            }}
          />
          <div className="absolute -inset-1 animate-pulse rounded-full bg-blue-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        </div>
        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-900 hidden min-[470px]:inline">
          SoBooked Admin
        </span>
      </Link>
    </div>

          {/* Search and City Selection Group */}
          <div className="flex flex-1 items-center justify-center max-w-2xl mx-4 ml-[210px] max-[1050px]:m-[0px_8px_0px_16px]">
            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
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
                    placeholder="Search books, orders..."
                  />
                </div>
              </form>
            </div>

            {/* City Selector */}
            <div className="relative ml-2">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
              >
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium hidden sm:inline">
                  {selectedCity}
                </span>
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
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Orders Management Button */}
            <button
              onClick={() => navigate("/admin/orders")}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ClipboardList className="h-5 w-5" />
              <span className="text-sm font-medium">Orders</span>
            </button>

            {/* Add Book Button */}
            <button
              onClick={() => navigate("/admin/addbook")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Add Book</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
              aria-label="Log Out"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Orders Management Link */}
              <button
                onClick={() => {
                  navigate("/admin/orders");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <ClipboardList className="h-5 w-5" />
                <span className="text-sm font-medium">Orders</span>
              </button>

              {/* Add Book Link */}
              <button
                onClick={() => {
                  navigate("/admin/addbook");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Add Book</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNav;