import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddBook from './components/AddBook';
import BookDetail from './pages/BookDetail';
import { BookProvider } from './contexts/BookContext';
import { MainLayout } from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <BookProvider>
        <div className="min-h-screen bg-gray-50">
          <MainLayout />
          <main className="pt-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/addbook" element={<AddBook />} />
              <Route path="/:bookName" element={<BookDetail />} />
            </Routes>
          </main>
        </div>
      </BookProvider>
    </Router>
  );
}

export default App;