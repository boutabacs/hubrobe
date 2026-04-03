const products = [
  {
    id: 1,
    title: "Wild Cosmos blue hoodie",
    price: {
      min: 18.0,
      max: 23.99,
    },
    isSale: true,
    discount: null,
    images: ["/assets/product1-1.jpg", "/assets/product1-2.jpg"],
  },
  {
    id: 2,
    title: "Pink embroidered slogan hoodie",
    price: {
      old: 20.0,
      current: 18.0,
    },
    isSale: true,
    discount: 20,
    images: ["/assets/product2-1.jpg", "/assets/product2-2.jpg"],
  },
  {
    id: 3,
    title: "Nike Air Max",
    price: {
      current: 60.0,
    },
    isSale: false,
    discount: null,
    images: ["/assets/product3-1.jpg", "/assets/product3-2.jpg"],
  },
  {
    id: 4,
    title: "Wooden Bar Stool",
    price: {
      current: 60.0,
    },
    isSale: false,
    discount: null,
    images: ["/assets/product4-1.jpg", "/assets/product4-2.jpg"],
  },

  // 🔥 nouveaux produits

  {
    id: 5,
    title: "Wild Cosmos blue hoodie",
    price: {
      old: 32.0,
      current: 30.99,
    },
    isSale: true,
    discount: null,
    images: ["/assets/product5-1.jpg", "/assets/product5-2.jpg"],
  },
  {
    id: 6,
    title: "Pink embroidered slogan hoodie",
    price: {
      old: 25.0,
      current: 23.99,
    },
    isSale: true,
    discount: null,
    images: ["/assets/product6-1.jpg", "/assets/product6-2.jpg"],
  },
  {
    id: 7,
    title: "Digital Product",
    price: {
      current: 35.0,
    },
    isSale: false,
    discount: null,
    images: ["/assets/product7-1.jpg", "/assets/product7-2.jpg"],
  },
  {
    id: 8,
    title: "Affiliate Product",
    price: {
      old: 20.0,
      current: 18.0,
    },
    isSale: true,
    discount: null,
    images: ["/assets/product8-1.jpg", "/assets/product8-2.jpg"],
  },
  
];

const articles = [
  {
    id: 1,
    title: "Comfort Dressing: The nostalgic value of the high jewelry",
    description: "You want to succeed, surround yourself with the right kind of people who will support and encourage you",
    image: "/assets/news/news1.jpg",
    date: "8 years ago"
  },
  {
    id: 2,
    title: "Adidas and Allbirds are joining forces to create a new brand",
    description: "You want to succeed, surround yourself with the right kind of people who will support and encourage you",
    image: "/assets/news/news2.jpg",
    date: "8 years ago"
  },
  {
    id: 3,
    title: "10 Tips to take care of your skins while in lockdown",
    description: "Hustle and Cashflow is a blog that aims to educate millennials on personal finance. What allows to differ",
    image: "/assets/news/news3.jpg",
    date: "8 years ago"
  },
  {
    id: 4,
    title: "Combing hair 10 tips for proper hair combing",
    description: "You want to succeed, surround yourself with the right kind of people who will support and encourage you",
    image: "/assets/news/news4.jpg",
    date: "8 years ago"
  },
  {
    id: 5,
    title: "Investment trend monitor: Top trends in 2021",
    description: "Hustle and Cashflow is a blog that aims to educate millennials on personal finance. What allows to differ",
    image: "/assets/news/news5.jpg",
    date: "8 years ago"
  },
  {
    id: 6,
    title: "See the unmatched beauty of the great lakes",
    description: "You want to succeed, surround yourself with the right kind of people who will support and encourage you",
    image: "/assets/news/news6.jpg",
    date: "8 years ago"
  },
];

const faqData = [
  {
    id: "shipping",
    title: "Shipping",
    items: [
      { q: "What payment methods can I use?", a: "We accept Visa, Mastercard, American Express, and PayPal." },
      { q: "What should I do if the payment is not accepted?", a: "Please check your card details and ensure you have sufficient funds. If the problem persists, contact your bank." },
      { q: "Can I purchase from outside the US or Canada?", a: "Yes, we ship internationally to most countries." },
      { q: "Can I change the shipping address?", a: "You can change your shipping address before the order is shipped by contacting our support." }
    ]
  },
  {
    id: "return-policy",
    title: "Return Policy",
    items: [
      { q: "What is your return policy?", a: "We offer a 30-day return policy for most items in original condition." },
      { q: "How do I start a return?", a: "Log in to your account and go to 'My Orders' to initiate a return request." }
    ]
  },
  {
    id: "product-delivery",
    title: "Product Delivery",
    items: [
      { q: "How long does delivery take?", a: "Standard shipping takes 3-5 business days. Express takes 1-2 business days." },
      { q: "How can I track my order?", a: "You will receive a tracking number via email once your order has shipped." }
    ]
  },
  {
    id: "warranty",
    title: "Warranty",
    items: [
      { q: "Do products have a warranty?", a: "All our products come with a 1-year limited warranty." }
    ]
  },
  {
    id: "international-sales",
    title: "International Sales",
    items: [
      { q: "Do you offer international shipping?", a: "Yes, we ship to over 50 countries worldwide." }
    ]
  },
  {
    id: "contact-us",
    title: "Contact Us",
    items: [
      { q: "How can I reach customer support?", a: "You can reach us via email at support@hubshop.com or via WhatsApp." }
    ]
  }
];

const cartData = [
  {
    id: 7,
    title: "Digital Product",
    price: 35.00,
    quantity: 3,
    image: "/assets/product7-1.jpg"
  },
  {
    id: 1,
    title: "Wild Cosmos blue hoodie",
    price: 30.99,
    quantity: 1,
    image: "/assets/product1-1.jpg"
  }
];

export { products, articles, faqData, cartData };
export default products;
