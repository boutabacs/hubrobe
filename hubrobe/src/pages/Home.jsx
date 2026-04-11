import React, { useEffect } from "react";
import HeroSlider from "../components/HeroSlider";
import Features from "../components/Features";
import CategoryGrid from "../components/CategoryGrid";
import ProductSlider from "../components/ProductSlider";
import Lookbook from "../components/Lookbook";
import CustomerReviews from "../components/CustomerReviews";
import BrandSlider from "../components/BrandSlider";
import NewArrivalsMarquee from "../components/NewArrivalsMarquee";
import Magazine from "../components/Magazine";
import Newsletter from "../components/Newsletter";

const Home = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  return (
    <main className="flex-1">
      <HeroSlider />
      <Features />
      <CategoryGrid />
      <ProductSlider />
      <Lookbook />
      <CustomerReviews />
      <BrandSlider />
      <NewArrivalsMarquee />
      <Features />
      <Magazine />
      <Newsletter />
    </main>
  );
};

export default Home;
