import React from 'react';

const Features = () => {
  const featureList = [
    {
      icon: '/assets/téléchargement (3).svg',
      title: 'Fast Delivery',
      description: 'Free Shipping for orders over £130',
    },
    {
      icon: '/assets/téléchargement.svg',
      title: 'Secure SSL',
      description: '256-Bit Payment Protection',
    },
    {
      icon: '/assets/téléchargement (1).svg',
      title: 'Paypal or ApplePay',
      description: 'Pay with Multiple Credit Cards',
    },
    {
      icon: '/assets/téléchargement (2).svg',
      title: 'Get Discounts',
      description: 'Join the sale campaign',
    },
  ];

  return (
    <section className="w-full bg-white py-12 px-6 md:px-12 border-b border-gray-100">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {featureList.map((feature, index) => (
          <div key={index} className="flex items-center gap-5 group cursor-default">
            {/* Icon Container */}
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <img 
                src={feature.icon} 
                alt={feature.title} 
                className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col">
              <h3 className="font-sofia-pro text-[15px] font-bold text-black leading-tight mb-1">
                {feature.title}
              </h3>
              <p className="font-sofia-pro text-[13px] font-normal text-gray-500 leading-tight">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
