import React from 'react';

const AboutFeatures = () => {
  const features = [
    {
      title: 'Original Products',
      description: 'Hub offers a range of skincare products that are feminine, delicate and long-lasting with vitamins and nutritions to improve your skin condition.',
    },
    {
      title: 'Limited Time Offers',
      description: 'Hub offers a range of skincare products that are feminine, delicate and long-lasting with vitamins and nutritions to improve your skin condition.',
    },
    {
      title: 'Free Shipping',
      description: 'Hub offers a range of skincare products that are feminine, delicate and long-lasting with vitamins and nutritions to improve your skin condition.',
    },
  ];

  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-start text-left border-t border-black/10 pt-8">
            <div className="w-4 h-4 rounded-full border border-black mb-8"></div>
            <h3 className="text-[18px] md:text-[20px] font-sofia-pro font-bold text-black mb-6">
              {feature.title}
            </h3>
            <p className="text-[14px] font-sofia-pro text-black/60 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutFeatures;
