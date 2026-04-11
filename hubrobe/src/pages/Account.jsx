import React, { useEffect, useMemo, useState } from 'react';
import AccountHero from '../components/AccountHero';
import { userRequest, publicRequest } from '../requestMethods';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiStar, FiChevronDown, FiChevronUp, FiMessageSquare } from 'react-icons/fi';

const Account = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '', productId: '' });
  const [siteReview, setSiteReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await userRequest.get(`/orders/find/${user._id}`);
        setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleProductReview = async (e, productId) => {
    e.preventDefault();
    if (!reviewData.comment) return;
    setSubmitting(true);
    try {
      await userRequest.post(`/reviews/product/${productId}`, {
        rating: reviewData.rating,
        comment: reviewData.comment,
        username: user.username,
      });
      alert("Merci pour votre avis !");
      setReviewData({ rating: 5, comment: '', productId: '' });
    } catch (err) {
      alert(err.response?.data || "Erreur lors de l'envoi de l'avis");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSiteReview = async (e) => {
    e.preventDefault();
    if (!siteReview.comment) return;
    setSubmitting(true);
    try {
      await userRequest.post(`/reviews/site`, {
        rating: siteReview.rating,
        comment: siteReview.comment,
        username: user.username,
      });
      alert("Merci pour votre avis sur notre service !");
      setSiteReview({ rating: 5, comment: '' });
    } catch (err) {
      alert(err.response?.data || "Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiPackage className="text-orange-500" />;
      case 'processing': return <FiTruck className="text-blue-500" />;
      case 'delivered': return <FiCheckCircle className="text-green-500" />;
      case 'cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiPackage />;
    }
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] font-sofia-pro">
      <h2 className="text-2xl font-bold mb-4">Veuillez vous connecter</h2>
      <a href="/login" className="px-8 py-3 bg-black text-white uppercase tracking-widest font-bold text-sm">Login</a>
    </div>
  );

  return (
    <div className="flex flex-col w-full bg-white pb-20">
      <AccountHero />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Colonne de gauche : Historique et Tracking */}
          <div className="lg:col-span-2">
            <h2 className="text-[32px] font-bold text-black mb-10 font-gt-walsheim">Historique de vos commandes</h2>
            
            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>
            ) : orders.length === 0 ? (
              <p className="text-black/40 font-sofia-pro">Vous n'avez pas encore passé de commande.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-100 rounded-sm overflow-hidden bg-[#FCFCFC]">
                    <div 
                      className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{getStatusIcon(order.status)}</div>
                        <div>
                          <p className="text-[14px] font-bold text-black font-sofia-pro">Commande #{order._id.slice(-6)}</p>
                          <p className="text-[12px] text-black/40 font-sofia-pro">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="hidden md:block">
                          <p className="text-[11px] uppercase tracking-widest text-black/40 font-bold font-sofia-pro">Statut</p>
                          <p className={`text-[13px] font-bold font-sofia-pro uppercase ${
                            order.status === 'delivered' ? 'text-green-600' : 
                            order.status === 'pending' ? 'text-orange-600' : 'text-blue-600'
                          }`}>{order.status}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-black/40 font-bold font-sofia-pro">Total</p>
                          <p className="text-[14px] font-bold text-black font-gt-walsheim">${order.amount.toFixed(2)}</p>
                        </div>
                        {expandedOrder === order._id ? <FiChevronUp /> : <FiChevronDown />}
                      </div>
                    </div>

                    {expandedOrder === order._id && (
                      <div className="p-6 bg-white border-t border-gray-100 animate-fadeIn">
                        <h4 className="text-[13px] font-bold uppercase tracking-widest text-black mb-4 font-sofia-pro">Produits commandés</h4>
                        <div className="flex flex-col gap-4">
                          {order.products.map((p, idx) => (
                            <div key={idx} className="flex flex-col gap-4 pb-4 border-b border-gray-50 last:border-none">
                              <div className="flex justify-between items-center">
                                <span className="text-[14px] font-sofia-pro text-black/60">ID Produit: {p.productId} <span className="text-black font-bold">× {p.quantity}</span></span>
                                {order.status === 'delivered' && (
                                  <button 
                                    onClick={() => setReviewData({ ...reviewData, productId: p.productId })}
                                    className="flex items-center gap-2 text-[12px] font-bold text-black uppercase tracking-widest hover:underline font-sofia-pro"
                                  >
                                    <FiStar /> Laisser un avis
                                  </button>
                                )}
                              </div>
                              
                              {/* Formulaire d'avis produit */}
                              {reviewData.productId === p.productId && (
                                <form onSubmit={(e) => handleProductReview(e, p.productId)} className="bg-gray-50 p-6 rounded-sm mt-2">
                                  <div className="flex items-center gap-4 mb-4">
                                    <span className="text-[12px] font-bold uppercase font-sofia-pro">Note :</span>
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <FiStar 
                                          key={star}
                                          className={`cursor-pointer ${star <= reviewData.rating ? 'fill-black text-black' : 'text-black/20'}`}
                                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <textarea 
                                    placeholder="Votre avis sur ce produit..."
                                    className="w-full p-4 border border-gray-200 outline-none focus:border-black text-[14px] font-sofia-pro mb-4 h-24"
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                  />
                                  <div className="flex gap-4">
                                    <button 
                                      type="submit" 
                                      disabled={submitting}
                                      className="px-6 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-widest disabled:opacity-50"
                                    >
                                      Publier l'avis
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => setReviewData({ rating: 5, comment: '', productId: '' })}
                                      className="text-[11px] font-bold uppercase tracking-widest text-black/40"
                                    >
                                      Annuler
                                    </button>
                                  </div>
                                </form>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Colonne de droite : Avis sur le site */}
          <div className="bg-[#FCFCFC] p-8 border border-gray-50 rounded-sm self-start">
            <h3 className="text-[24px] font-bold text-black mb-6 font-gt-walsheim">Votre avis compte</h3>
            <p className="text-[14px] text-black/60 font-sofia-pro mb-8 leading-relaxed">
              Comment s'est passée votre expérience sur Hubrobe ? Donnez-nous votre avis sur notre site et nos services.
            </p>
            
            <form onSubmit={handleSiteReview} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black font-sofia-pro">Note globale</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar 
                      key={star}
                      className={`text-xl cursor-pointer ${star <= siteReview.rating ? 'fill-black text-black' : 'text-black/20'}`}
                      onClick={() => setSiteReview({ ...siteReview, rating: star })}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-black font-sofia-pro">Commentaire</label>
                <textarea 
                  placeholder="Qu'avez-vous pensé de notre service ?"
                  className="w-full p-4 border border-gray-100 bg-white outline-none focus:border-black text-[14px] font-sofia-pro h-32"
                  value={siteReview.comment}
                  onChange={(e) => setSiteReview({ ...siteReview, comment: e.target.value })}
                />
              </div>
              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-black text-white text-[12px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all flex items-center justify-center gap-2 font-sofia-pro disabled:opacity-50"
              >
                <FiMessageSquare /> Envoyer mon avis
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Account;
