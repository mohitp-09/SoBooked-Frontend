import React from 'react';
import { BookOpen, ShoppingBag, XCircle, Crown } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  buyPrice: number;
  rentalPrice: number;
  imageUrl: string;
  availableForRent: boolean;
}

const books: Book[] = [
  {
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    buyPrice: 4499,
    rentalPrice: 799,
    imageUrl: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=300&h=400",
    availableForRent: true
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    buyPrice: 3999,
    rentalPrice: 699,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300&h=400",
    availableForRent: true
  },
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    buyPrice: 3499,
    rentalPrice: 599,
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300&h=400",
    availableForRent: false
  },
  {
    id: 4,
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    buyPrice: 2999,
    rentalPrice: 499,
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300&h=400",
    availableForRent: true
  },
  {
    id: 5,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    buyPrice: 3299,
    rentalPrice: 599,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300&h=400",
    availableForRent: true
  }
];

const formatPrice = (price: number) => {
  return `₹${(price/100).toFixed(2)}`;
};

const BookCard = ({ book, handleBookClick, handleAddToCart }: { 
  book: Book, 
  handleBookClick: (title: string) => void, 
  handleAddToCart: (e: React.MouseEvent, book: Book, isRental: boolean) => void 
}) => (
  <div
    onClick={() => handleBookClick(book.title)}
    className="group relative bg-white/60 backdrop-blur-lg rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border border-white/20 cursor-pointer"
  >
    <div className="aspect-[3/4] overflow-hidden relative">
      <img
        src={book.imageUrl}
        alt={book.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>

    <div className="p-4 text-center">
      <h3 className="text-sm font-semibold line-clamp-1 hover:text-blue-600">
        {book.title}
      </h3>
      <p className="text-gray-600 text-xs mb-3">by {book.author}</p>

      <div className="flex flex-col gap-1">
        <button
          onClick={(e) => handleAddToCart(e, book, false)}
          className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors"
        >
          <ShoppingBag className="h-3 w-3" />
          Buy {formatPrice(book.buyPrice)}
        </button>

        {book.availableForRent ? (
          <button
            onClick={(e) => handleAddToCart(e, book, true)}
            className="w-full px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md text-xs flex items-center justify-center gap-1 hover:bg-blue-50 transition-colors"
          >
            <BookOpen className="h-3 w-3" />
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

export default function Recommendation() {
  const handleBookClick = (title: string) => {
    console.log(`Book clicked: ${title}`);
  };

  const handleAddToCart = (e: React.MouseEvent, book: Book, isRental: boolean) => {
    e.stopPropagation();
    console.log(`Added to cart: ${book.title} (${isRental ? 'Rental' : 'Purchase'})`);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Recommendations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              handleBookClick={handleBookClick}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Best Sellers</h2>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm">
            <Crown className="w-3.5 h-3.5" />
            Top Picks
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {books.map((book) => (
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