import React from 'react';
import AboutHero from '../components/AboutHero';
import AboutContent from '../components/AboutContent';
import AboutFeatures from '../components/AboutFeatures';
import AboutQuote from '../components/AboutQuote';

const About = () => {
  return (
    <div className="flex flex-col w-full bg-white">
      <AboutHero />
      <AboutContent />
      <AboutFeatures />
      <AboutQuote />
    </div>
  );
};

export default About;
