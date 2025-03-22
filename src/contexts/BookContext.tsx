import React, { createContext, useContext, useState, useEffect } from 'react';

const tokenString = localStorage.getItem("token");
const tokenObj = tokenString ? JSON.parse(tokenString) : null;
const jwt = tokenObj?.jwt;

interface Book {
  id: number;
  name: string;
  author: string;
  category: string;
  description: string;
  buyPrice: number;
  rentalPrice: number;
  availableForRent: boolean;
  city: string;
  phoneNumber: string;
  photo?: string;
}

interface SavedBookDTO {
  id: number;
  bookId: number;
  userId: number;
}

interface BookContextType {
  books: Book[];
  filteredBooks: Book[];
  selectedCity: string;
  searchQuery: string;
  setSelectedCity: (city: string) => void;
  setSearchQuery: (query: string) => void;
  cities: string[];
  loading: boolean;
  savedBooks: number[];
  setSavedBooks: (books: number[]) => void;
  fetchSavedBooks: () => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cities, setCities] = useState<string[]>(['All Cities']);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedBooks, setSavedBooks] = useState<number[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://sobooked.onrender.com/api/getBooks');
        if (!response.ok) throw new Error('Failed to fetch books');
        const data = await response.json();
        console.log("Fetched data", data);
        const booksData: Book[] = Array.isArray(data) ? (data as Book[]) : (data.books as Book[]) || [];
        setBooks(booksData);

        const uniqueCities: string[] = ['All Cities', ...new Set(booksData.map((book: Book) => book.city))];
        setCities(uniqueCities);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const fetchSavedBooks = async () => {
    if (!jwt) {
      console.log('No JWT token found, skipping saved books fetch');
      return;
    }

    try {
      const response = await fetch(
        "https://sobooked.onrender.com/saved-books",
        {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${jwt}`,
            "Content-Type": "application/json"
          },
        }
      );

      console.log('Saved books response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch saved books: ${response.status} ${errorText}`);
      }

      const savedBooksData: SavedBookDTO[] = await response.json();
      console.log('Saved books data:', savedBooksData);
      
      const bookIds = savedBooksData.map(savedBook => savedBook.bookId);
      setSavedBooks(bookIds);
    } catch (error) {
      console.error("Error fetching saved books:", error);
    }
  };

  useEffect(() => {
    if (jwt) {
      console.log('JWT token found, fetching saved books');
      fetchSavedBooks();
    }
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesCity = selectedCity === 'All Cities' || book.city === selectedCity;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      book.name.toLowerCase().includes(searchLower) ||
      book.description.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.city.toLowerCase().includes(searchLower);
    return matchesCity && matchesSearch;
  });

  return (
    <BookContext.Provider value={{
      books,
      filteredBooks,
      selectedCity,
      searchQuery,
      setSelectedCity,
      setSearchQuery,
      cities,
      loading,
      savedBooks,
      setSavedBooks,
      fetchSavedBooks
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

export default useBooks