
import React from 'react';
import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingWhatsApp: React.FC = () => {
  return (
    <motion.a
      href="https://wa.me/558335340000"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-44 md:bottom-24 right-4 md:right-6 z-[100] bg-emerald-500 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/40 flex items-center justify-center hover:bg-emerald-600 transition-colors group"
      aria-label="Falar no WhatsApp"
    >
      <Phone size={24} />
      <span className="absolute right-full mr-4 bg-white text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-emerald-50">
        Falar no WhatsApp
      </span>
    </motion.a>
  );
};

export default FloatingWhatsApp;
