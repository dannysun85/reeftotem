import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ProductShowcase from '@/components/home/ProductShowcase';
import CompanyIntro from '@/components/home/CompanyIntro';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProductShowcase />
      <CompanyIntro />
    </div>
  );
};

export default Home;
