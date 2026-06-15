
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[150]"
        >
          <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-teal-50 shadow-teal-900/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">Privacidade & Cookies</h3>
                  <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-[10px] font-medium text-gray-500 leading-relaxed mb-4">
                  Utilizamos cookies para melhorar sua experiência e garantir a segurança dos seus dados, conforme a <Link to="/compliance" className="text-teal-600 underline">LGPD</Link>. Ao continuar, você concorda com nossa política.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={handleAccept}
                    className="flex-grow bg-teal-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all"
                  >
                    Aceitar Tudo
                  </button>
                  <Link 
                    to="/compliance"
                    className="px-4 py-3 bg-gray-50 text-gray-400 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all"
                  >
                    Configurar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
