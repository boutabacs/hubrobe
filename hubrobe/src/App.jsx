import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import News from './pages/News';
import Faq from './pages/Faq';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderReceived from './pages/OrderReceived';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import SingleProduct from './pages/SingleProduct';
import SingleArticle from './pages/SingleArticle';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Toaster } from 'react-hot-toast';

const stripePromise = loadStripe("pk_test_51TL6xBGuVuKRLUR1luHNAcOiNbYaAhX67WxQSInSjDjoJkwMDkZYIufvc8nLkB5HGK7itUjhjt9L8BxndxRlHkfX006Ww1hxNJ");

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#000',
            color: '#fff',
            borderRadius: '0px',
            fontSize: '14px',
            fontFamily: 'Sofia Pro, sans-serif',
            padding: '16px 24px',
            maxWidth: '500px',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#000',
            },
          },
          error: {
            iconTheme: {
              primary: '#fff',
              secondary: '#000',
            },
          },
        }}
      />
      <div className="min-h-screen bg-white flex flex-col">
        <TopBar />
        <Navbar />
        <div className="overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/news/:id" element={<SingleArticle />} />
            <Route path="/checkout" element={
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            } />
            <Route path="/order-received" element={<OrderReceived />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
