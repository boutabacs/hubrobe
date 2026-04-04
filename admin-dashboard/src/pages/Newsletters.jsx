import React, { useEffect, useState } from 'react';
import { FiMail, FiSearch, FiSend, FiUsers } from 'react-icons/fi';
import { userRequest } from '../requestMethods';
import Header from '../components/Header';

const Newsletters = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const getSubscribers = async () => {
      try {
        const res = await userRequest.get("/newsletter");
        setSubscribers(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getSubscribers();
  }, []);

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    if (!subject || !content) return;
    setIsSending(true);
    try {
      await userRequest.post("/newsletter/send", { subject, content });
      alert("Newsletter sent successfully!");
      setShowSendModal(false);
      setSubject("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Failed to send newsletter.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F9FAFB]">
      <Header title="Newsletters" setSidebarOpen={() => {}} />
      <main className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-white p-4 rounded-sm border border-gray-100 flex items-center gap-3">
              <FiUsers className="text-black/40" />
              <div>
                <p className="text-[12px] text-black/40 font-sofia-pro uppercase tracking-widest font-bold">Total Subscribers</p>
                <p className="text-[20px] font-bold font-sofia-pro">{subscribers.length}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowSendModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-sm text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-black/80 transition-all"
          >
            <FiSend /> Send Newsletter
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Email Address</th>
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-widest text-black/40 font-sofia-pro">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mx-auto"></div>
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-12 text-center text-black/40 font-sofia-pro text-[14px]">
                      No subscribers found.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-[14px] font-medium text-black font-sofia-pro">{sub.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-black/50 font-sofia-pro">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Send Newsletter Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[18px] font-bold uppercase tracking-widest font-sofia-pro">Compose Newsletter</h2>
              <button onClick={() => setShowSendModal(false)} className="text-black/40 hover:text-black">✕</button>
            </div>
            <form onSubmit={handleSendNewsletter} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-widest text-black/40 mb-2 font-sofia-pro">Subject</label>
                <input 
                  required
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Newsletter Subject"
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-sm text-[14px] font-sofia-pro focus:bg-white focus:border-black outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-widest text-black/40 mb-2 font-sofia-pro">Content (HTML supported)</label>
                <textarea 
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your newsletter content here..."
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-sm text-[14px] font-sofia-pro focus:bg-white focus:border-black outline-none transition-all h-64 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="px-6 py-3 text-[13px] font-bold uppercase tracking-widest font-sofia-pro text-black/40 hover:text-black"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSending}
                  className="bg-black text-white px-8 py-3 rounded-sm text-[13px] font-bold uppercase tracking-widest font-sofia-pro hover:bg-black/80 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend /> Send Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletters;
