
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, X, CheckCircle2, Loader2 } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  guepardoId?: string;
  guepardoName?: string;
  serviceType?: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  isOpen, 
  onClose, 
  guepardoId = 'default_guepardo', 
  guepardoName = 'Guepardo Coleta Já',
  serviceType = 'Coleta Domiciliar'
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'form' | 'sending' | 'success'>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setStatus('sending');
    try {
      await addDoc(collection(db, 'feedback'), {
        guepardoId,
        guepardoName,
        serviceType,
        customerId: auth.currentUser?.uid || 'anonymous',
        customerName: auth.currentUser?.displayName || 'Paciente',
        rating,
        comment,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setTimeout(() => {
        onClose();
        // Reset state after closing
        setTimeout(() => {
          setStatus('form');
          setRating(0);
          setComment('');
        }, 500);
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setStatus('form');
      alert("Erro ao enviar avaliação. Tente novamente.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
            
            {status !== 'success' && (
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            )}

            <div className="p-12">
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">Obrigado pelo Feedback!</h2>
                  <p className="text-gray-500 font-bold text-sm leading-relaxed">
                    Sua avaliação é fundamental para mantermos a excelência no atendimento dos nossos Guepardos.
                  </p>
                </div>
              ) : status === 'sending' ? (
                <div className="text-center py-20">
                  <Loader2 className="animate-spin mx-auto text-teal-600 mb-6" size={48} />
                  <p className="text-gray-900 font-black uppercase tracking-widest text-sm">Registrando no Sistema...</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                      <Heart size={14} /> Avaliação da Coleta
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">Como foi sua experiência?</h2>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Avalie o atendimento de <span className="text-teal-600">{guepardoName}</span></p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-center gap-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          layout
                          initial={false}
                          animate={{
                            scale: rating === star ? [1, 1.3, 1.1] : 1,
                            backgroundColor: (hover || rating) >= star ? '#f97316' : '#f8fafc',
                            color: (hover || rating) >= star ? '#ffffff' : '#cbd5e1'
                          }}
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(0)}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                            (hover || rating) >= star 
                              ? 'shadow-[0_10px_25px_-5px_rgba(249,115,22,0.5)] ring-4 ring-orange-100' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <Heart 
                            size={28} 
                            fill={(hover || rating) >= star ? 'currentColor' : 'none'} 
                            className="transition-transform duration-300"
                          />
                        </motion.button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Conte-nos mais (Opcional)</label>
                      <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Elogios, sugestões ou observações sobre a coleta..."
                        className="w-full px-6 py-5 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold text-gray-800 text-sm min-h-[120px] resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={rating === 0}
                      className="w-full bg-gray-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                    >
                      Enviar Avaliação <Send size={18} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
