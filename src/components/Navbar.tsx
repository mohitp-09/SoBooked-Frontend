import React, { useState, useEffect } from "react";
import { Book, Search, Menu, X, BookOpenCheck } from "lucide-react";
import AuthModal from "./AuthModal";
import { Link } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";

interface NavbarProps {
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin }) => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { searchQuery, setSearchQuery, selectedCity, setSelectedCity, cities } =
      useBooks();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  const handleSwitchToSignIn = () => {
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  };

  const handleSwitchToSignUp = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(true);
  };

  const handleSuccessfulAuth = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
    onLogin();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
      <a href="/" className="group flex items-center transition-all duration-300 hover:scale-105">
        <div className="relative">
          <BookOpenCheck 
            className="h-8 w-8 text-blue-600 transition-all duration-300 group-hover:text-blue-700" 
            style={{
              filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.2))'
            }}
          />
          <div className="absolute -inset-1 animate-pulse rounded-full bg-blue-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        </div>
        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-900 [display:none]:max-[430px]:ml-2 hidden min-[470px]:inline">
          SoBooked
        </span>
      </a>
    </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-1 max-w-lg mx-8"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 
                         text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-600 focus:border-transparent"
                placeholder="Search books..."
              />
            </div>
          </form>

          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsSignInOpen(true)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUpOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
          >
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-2 border-t border-gray-100">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 
                         text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-600 focus:border-transparent"
                placeholder="Search books..."
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsSignInOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-all text-left"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsSignUpOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all text-left"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        mode="signup"
        onSwitchMode={handleSwitchToSignIn}
        onSuccess={handleSuccessfulAuth}
      />
      <AuthModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        mode="login"
        onSwitchMode={handleSwitchToSignUp}
        onSuccess={handleSuccessfulAuth}
      />
    </nav>
  );
};

export default Navbar;
