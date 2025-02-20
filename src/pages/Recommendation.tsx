import React, { useState } from 'react';
import { BookOpen, ShoppingBag, XCircle, Loader2 } from 'lucide-react';
import { useBooks } from '../contexts/BookContext';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const formatPrice = (price: number) => {
  return `₹${price}`;
};

const BookCard = ({ book, handleBookClick, handleAddToCart }: { 
  book: any, 
  handleBookClick: (bookName: string) => void, 
  handleAddToCart: (e: React.MouseEvent, book: any, isRental: boolean) => void 
}) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleAction = async (e: React.MouseEvent, isRental: boolean) => {
    e.stopPropagation();
    const key = `${book.id}-${isRental ? 'rent' : 'buy'}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    await handleAddToCart(e, book, isRental);
    
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  };

  return (
    <div
      onClick={() => handleBookClick(book.name)}
      className="group relative bg-white/60 backdrop-blur-lg rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border border-white/20 cursor-pointer"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img
          src={
            book.photo
              ? book.photo.startsWith("data:image")
                ? book.photo
                : `data:image/jpeg;base64,${book.photo}`
              : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=387&auto=format&fit=crop"
          }
          alt={book.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 text-center">
        <h3 className="text-sm font-semibold line-clamp-1 hover:text-blue-600">
          {book.name}
        </h3>
        <p className="text-gray-600 text-xs mb-3">by {book.author}</p>

        <div className="flex flex-col gap-1">
          <button
            onClick={(e) => handleAction(e, false)}
            disabled={loadingStates[`${book.id}-buy`]}
            className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingStates[`${book.id}-buy`] ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ShoppingBag className="h-3 w-3" />
            )}
            Buy {formatPrice(book.buyPrice)}
          </button>

          {book.availableForRent ? (
            <button
              onClick={(e) => handleAction(e, true)}
              disabled={loadingStates[`${book.id}-rent`]}
              className="w-full px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md text-xs flex items-center justify-center gap-1 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingStates[`${book.id}-rent`] ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <BookOpen className="h-3 w-3" />
              )}
              Rent {formatPrice(book.rentalPrice)}/mo
            </button>
          ) : (
            <button
              className="w-full px-3 py-1.5 border border-gray-400 text-gray-500 rounded-md text-xs flex items-center justify-center gap-1 bg-gray-100 cursor-not-allowed"
              onClick={(e) => e.stopPropagation()}
            >
              <XCircle className="h-3 w-3" />
              Not Available for Rent
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Recommendation() {
  const { filteredBooks } = useBooks();
  const { bookName } = useParams();
  const navigate = useNavigate();
  
  const currentBook = filteredBooks.find(b => 
    b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === bookName
  );

  const recommendedBooks = filteredBooks.filter(book => 
    book.category === currentBook?.category && book.id !== currentBook?.id
  ).slice(0, 5);

  const handleBookClick = (bookName: string) => {
    const formattedName = bookName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${formattedName}`);
  };

  const handleAddToCart = async (e: React.MouseEvent, book: any, isRenting: boolean) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Login required to add items to the cart.");
      return;
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
    }
  };

  if (!currentBook || recommendedBooks.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          More {currentBook.category} Books You Might Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recommendedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              handleBookClick={handleBookClick}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>
    </div>
  );
}