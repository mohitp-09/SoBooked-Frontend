import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, BookOpen, XCircle, MapPin, Phone, Tag, BookText, Loader2, Heart } from 'lucide-react';
import { useBooks } from '../contexts/BookContext';
import Recommendation from './Recommendation';
import Swal from 'sweetalert2';

const BookDetail = () => {
  const { bookName } = useParams();
  const navigate = useNavigate();
  const { filteredBooks, savedBooks, fetchSavedBooks } = useBooks();
  const token = localStorage.getItem("token");
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(false);
  const [isLoadingRent, setIsLoadingRent] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const book = filteredBooks.find(b => 
    b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === bookName
  );

  const isFavorite = book ? savedBooks.includes(book.id) : false;

  useEffect(() => {
    if (token) {
      fetchSavedBooks();
    }
  }, [token]);

  useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  if (!book) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Book not found</h2>
          <p className="mt-2 text-gray-600">The book you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (isRenting: boolean) => {
    if (!token) {
      alert("Login required to add items to the cart.");
      return;
    }

    if (isRenting) {
      setIsLoadingRent(true);
    } else {
      setIsLoadingPurchase(true);
    }
  
    try {
      const response = await fetch(
        `https://sobooked.onrender.com/cart/add?bookId=${book.id}&isRenting=${isRenting}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to add item to cart! Status: ${response.status}`);
      }
  
      Swal.fire({
        icon: "success",
        title: `📚 "${book.name}" added to cart!`,
        toast: true,
        position: "bottom",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#f9fafb",
        iconColor: "#4F46E5",
        customClass: {
          popup: "rounded-lg border border-indigo-500 shadow-md px-4 py-2 max-w-[280px] sm:max-w-[320px]", 
          title: "text-gray-900 font-medium text-sm sm:text-base tracking-wide text-center",
          timerProgressBar: "bg-indigo-500",
        },
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        icon: "error",
        title: "This book is already in your cart.",
        toast: true,
        position: "bottom",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#ffffff",
        iconColor: "#EF4444",
        customClass: {
          popup: "rounded-xl border-2 border-red-400",
          title: "text-gray-800 font-medium text-lg",
        },
      });
    } finally {
      if (isRenting) {
        setIsLoadingRent(false);
      } else {
        setIsLoadingPurchase(false);
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!token) {
      alert("Login required to add items to favorites.");
      return;
    }

    if (isTogglingFavorite) return;

    setIsTogglingFavorite(true);
    // Optimistically update the UI
    setLocalFavorite(!localFavorite);

    try {
      const response = await fetch(
        `https://sobooked.onrender.com/saved-book/${localFavorite ? 'unsave' : 'save'}?bookId=${book.id}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        // If the request fails, revert the optimistic update
        setLocalFavorite(localFavorite);
        throw new Error(`Failed to ${localFavorite ? 'unsave from' : 'add to'} favorites!`);
      }

      // Refresh the saved books list in the background
      fetchSavedBooks();
    } catch (error) {
      console.error("Error updating favorites:", error);
      // Show error message to user
      Swal.fire({
        icon: "error",
        title: "Failed to update favorites",
        toast: true,
        position: "bottom",
        timer: 2500,
        showConfirmButton: false,
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-16">
      <button
        onClick={() => navigate('/')}
        className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Catalog
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-8">
          {/* Left Column - Image */}
          <div className="md:col-span-2">
            <div className="aspect-[4/5] overflow-hidden rounded-xl bg-gray-50">
              <img
                src={
                  book.photo
                    ? book.photo.startsWith("data:image")
                      ? book.photo
                      : `data:image/jpeg;base64,${book.photo}`
                    : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=387&auto=format&fit=crop"
                }
                alt={book.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-3 flex flex-col">
            {/* Book Title, Author, and Favorite Button */}
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{book.name}</h1>
                <p className="text-xl text-gray-600">by {book.author}</p>
              </div>
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className={`p-3 rounded-full transition-all duration-300 ${
                  localFavorite 
                    ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500'
                } ${isTogglingFavorite ? 'cursor-wait' : ''}`}
              >
                <Heart 
                  className={`h-6 w-6 transition-transform duration-300 ${
                    localFavorite ? 'fill-current scale-110' : 'scale-100 hover:scale-110'
                  }`} 
                />
              </button>
            </div>

            {/* Product Information */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm">Genre: <span className="text-gray-900 font-medium">{book.category}</span></span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Availability: <span className="text-gray-900 font-medium">{book.city}</span></span>
                </div>
                {book.phoneNumber && book.phoneNumber.trim() !== "" && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Seller Contact: <span className="text-gray-900 font-medium">{book.phoneNumber}</span></span>
                  </div>
                )}
              </div>
              {book.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-3 text-gray-600">
                    <BookText className="h-4 w-4 flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-sm font-medium text-gray-900 block mb-2">Synopsis</span>
                      <p className="text-sm text-gray-700 leading-relaxed">{book.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Purchase Options */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Purchase Options</h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={isLoadingPurchase}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-between hover:bg-blue-700 transition-colors shadow-sm hover:shadow group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2">
                    {isLoadingPurchase ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ShoppingBag className="h-5 w-5" />
                    )}
                    {isLoadingPurchase ? 'Adding to Cart...' : 'Purchase'}
                  </span>
                  <span className="text-lg font-bold group-hover:scale-105 transition-transform">
                    ₹{book.buyPrice}
                  </span>
                </button>

                {book.availableForRent ? (
                  <button
                    onClick={() => handleAddToCart(true)}
                    disabled={isLoadingRent}
                    className="w-full px-6 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-medium flex items-center justify-between hover:bg-blue-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2">
                      {isLoadingRent ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                      {isLoadingRent ? 'Adding to Cart...' : 'Rent'}
                    </span>
                    <span className="text-lg font-bold group-hover:scale-105 transition-transform">
                      ₹{book.rentalPrice}/month
                    </span>
                  </button>
                ) : (
                  <button
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 text-gray-400 rounded-xl font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <XCircle className="h-5 w-5" />
                    Not Available for Rent
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Recommendation/>
    </div>
    </>
  );
};

export default BookDetail;