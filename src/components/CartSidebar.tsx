import React, { useEffect, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  X,
  Trash2,
  ImageOff,
  BookOpen,
  ShoppingCart,
  Heart,
  Share2,
  Loader2,
} from "lucide-react";
import PaymentForm from './PaymentForm';

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51PuacPFId8GxoslMJxzl4TjLM44cp5Fy7h4Nprv0QMs2DyGZfgfsjxutOPhffYO47jYLgH3sZkvWE35iAp7q1ZvW008VVCn2GP");

interface CartItem {
  id: number;
  bookName: string;
  author: string;
  buyPrice: number;
  rentalPrice: number;
  renting: boolean;
  photo: string;
  bookId: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [showPayment, setShowPayment] = useState(false);
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());

  const fetchCartItems = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://sobooked.onrender.com/cart/getBooks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const books = data.books || data.cartItems || data || [];
      if (!Array.isArray(books)) {
        throw new Error("Unexpected response format from server.");
      }

      const processedBooks = books.map((book) => ({
        ...book,
        photo: book.photo ? `data:image/jpeg;base64,${book.photo}` : "",
      }));

      setCartItems(processedBooks);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load cart items."
      );
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCartItems([]);
      setError(null);
      setImageErrors(new Set());
      return;
    }

    fetchCartItems();
  }, [isOpen]);

  const handleDelete = async (bookId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      return;
    }

    setRemovingItems(prev => new Set(prev).add(bookId));

    try {
      const response = await fetch(
        "https://sobooked.onrender.com/cart/delete",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
          },
          body: new URLSearchParams({ bookId: bookId.toString() }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to delete item from cart");
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.bookId !== bookId)
      );
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Failed to remove item");
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  const handleImageError = (itemId: number) => {
    setImageErrors((prev) => new Set(prev).add(itemId));
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setCartItems([]);
    onClose();
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = 'Payment successful! Your order has been placed.';
    document.body.appendChild(successMessage);
    setTimeout(() => successMessage.remove(), 5000);
  };

  const totalItems = cartItems.length;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.renting ? item.rentalPrice : item.buyPrice),
    0
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-all duration-500 ease-out z-50 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-[480px] h-full bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)] z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Shopping Cart
                </h2>
                {totalItems > 0 && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {totalItems} {totalItems === 1 ? "item" : "items"} in cart
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-blue-600/20 border-b-blue-600"></div>
                </div>
              ) : error ? (
                <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-center text-red-600 font-medium">{error}</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-50">
                    <BookOpen className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-gray-900 text-lg font-semibold mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Looks like you haven't added any books to your cart yet.
                    Start exploring our collection!
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        <div className="w-[104px] h-[144px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                          {imageErrors.has(item.id) || !item.photo ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageOff className="w-8 h-8 text-gray-300" />
                            </div>
                          ) : (
                            <img
                              src={item.photo}
                              alt={item.bookName}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                              onError={() => handleImageError(item.id)}
                              loading="lazy"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h3 className="font-medium text-gray-900 leading-snug line-clamp-2">
                                  {item.bookName}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  by {item.author}
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-lg font-semibold text-gray-900">
                                  ₹
                                  {(item.renting
                                    ? item.rentalPrice
                                    : item.buyPrice
                                  ).toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {item.renting
                                    ? "Rental Price"
                                    : "Purchase Price"}
                                </span>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  item.renting
                                    ? "bg-blue-50 text-blue-700 border border-blue-100/50"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                                }`}
                              >
                                {item.renting ? "Rental" : "Purchase"}
                              </span>
                              {!item.renting && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100/50">
                                  Free Delivery
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleDelete(item.bookId)}
                                disabled={removingItems.has(item.bookId)}
                                className={`text-gray-400 hover:text-red-500 flex items-center gap-1.5 text-sm ${
                                  removingItems.has(item.bookId) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                aria-label="Remove from cart"
                              >
                                {removingItems.has(item.bookId) ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                                <span>Remove</span>
                              </button>

                              <div className="w-px h-4 bg-gray-200" />
                              <button
                                className="text-gray-400 hover:text-gray-600 flex items-center gap-1.5 text-sm group/save"
                                aria-label="Save for later"
                              >
                                <Heart className="w-4 h-4 transition-colors duration-200" />
                                <span>Save</span>
                              </button>
                              <div className="w-px h-4 bg-gray-200" />
                              <button
                                className="text-gray-400 hover:text-gray-600 flex items-center gap-1.5 text-sm"
                                aria-label="Share book"
                              >
                                <Share2 className="w-4 h-4" />
                                <span>Share</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Checkout Section */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 bg-white/90 backdrop-blur-md">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Subtotal ({totalItems} items)
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-0.5">
                      ₹{subtotal.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPayment(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium 
                             hover:bg-blue-700 active:bg-blue-800 transform 
                             hover:-translate-y-0.5 active:translate-y-0 
                             transition-all duration-200 focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                             shadow-lg shadow-blue-600/25"
                  >
                    Proceed to Checkout
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Prices include all applicable taxes and shipping charges
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            amount={subtotal}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPayment(false)}
          />
        </Elements>
      )}
    </>
  );
};

export default CartSidebar;