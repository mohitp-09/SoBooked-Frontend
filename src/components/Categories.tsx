import React, { useState } from "react";
import { ShoppingBag, BookOpen, XCircle } from "lucide-react";
import { useBooks } from '../contexts/BookContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface Book {
  id: string | number;
  name: string;
  author: string;
  photo?: string;
  buyPrice: number;
  availableForRent?: boolean;
  rentalPrice?: number;
  category: string;
  city: string;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
    {[...Array(10)].map((_, index) => (
      <div
        key={index}
        className="group relative bg-white/60 backdrop-blur-lg rounded-lg overflow-hidden shadow-md border border-white/20 animate-pulse"
      >
        <div className="aspect-[3/4] bg-gray-200" />
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Categories = () => {
  const { filteredBooks, loading } = useBooks();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(filteredBooks.map(book => book.category));
    return [
      { id: "all", name: "All" },
      ...Array.from(uniqueCategories).map(category => ({
        id: category,
        name: category
      }))
    ];
  }, [filteredBooks]);

  const handleAddToCart = async (e: React.MouseEvent, book: Book, isRenting: boolean) => {
    e.stopPropagation();
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Login required to add items to the cart.",
        toast: true,
        position: "bottom",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#ffffff",
        iconColor: "#EF4444",
        customClass: {
          popup: "rounded-xl border-2 border-red-400",
          title: "text-gray-800 font-medium text-lg",
        },
      });
      return;
    }
  
    try {
      const response = await fetch(
        `https://online-bookstore-rrd8.onrender.com/cart/add?bookId=${book.id}&isRenting=${isRenting}`,
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
  
      alert(`${book.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };
  
  const displayBooks = filteredBooks.filter(
    (book) => activeCategory === "all" || book.category === activeCategory
  );

  const handleBookClick = (bookName: string) => {
    const slug = bookName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${slug}`);
  };

  if (!loading && !displayBooks.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No books found matching your criteria.</p>
      </div>
    );
  }

  return (
    <section className="py-10 bg-gradient-to-b from-gray-50/50 to-white/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Books</h2>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all
                ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm border border-gray-200"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book.name)}
                className="group relative bg-white/60 backdrop-blur-lg rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border border-white/20 cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden">
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
                  <p className="text-gray-600 text-xs mb-1 pb-3">by {book.author}</p>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => handleAddToCart(e, book, false)}
                      className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      Buy ₹{book.buyPrice}
                    </button>

                    {book.availableForRent ? (
                      <button
                        onClick={(e) => handleAddToCart(e, book, true)}
                        className="w-full px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md text-xs flex items-center justify-center gap-1 hover:bg-blue-50 transition-colors"
                      >
                        <BookOpen className="h-3 w-3" />
                        Rent ₹{book.rentalPrice}/mo
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;