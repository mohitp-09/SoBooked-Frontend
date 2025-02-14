import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <Footer />
    </div>
  );
};

export default Home;
