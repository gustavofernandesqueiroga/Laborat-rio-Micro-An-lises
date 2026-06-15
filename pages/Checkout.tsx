
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Lock, 
  Zap, 
  Shield, 
  Info, 
  ArrowRight,
  Microscope,
  Bike,
  ClipboardCheck,
  CreditCard,
  Loader2
} from 'lucide-react';
import SEO from '../components/SEO';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingFallback from '../components/LoadingFallback';

const Checkout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, firebaseUser, loading: authLoading } = useAuth();
  const [step, setStep] = useState(3); 
  const [copied, setCopied] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success'>('pending');

  useEffect(() => {
    if (searchParams.get('success')) {
      setPaymentStatus('success');
    }
  }, [searchParams]);

  const pixCode = "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865406115.005802BR5913COLETA JA LTDA6009JOAO PESSOA62070503***6304E2B1";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customerEmail: user?.email,
          items: [
            {
              name: 'Coleta Domiciliar + Exames',
              description: 'Serviço de coleta domiciliar especializada Coleta Já',
              price: 115, // R$ 115,00
            }
          ]
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Stripe error:', error);
      alert('Erro ao iniciar checkout. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <LoadingFallback />;
  
  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <SEO 
        title="Checkout Seguro - Coleta Já" 
        description="Finalize seu agendamento com segurança e agilidade. Pagamento via Pix com criptografia de ponta."
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Progress Bar with Jajá Animation */}
        <div className="mb-16 relative">
          <div className="flex justify-between items-center max-w-2xl mx-auto relative z-10">
            {[
              { id: 1, name: 'Carrinho', icon: <ClipboardCheck size={16} /> },
              { id: 2, name: 'Dados', icon: <Info size={16} /> },
              { id: 3, name: 'Pagamento', icon: <Lock size={16} /> }
            ].map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  step >= s.id ? 'bg-teal-600 text-white shadow-xl shadow-teal-500/30' : 'bg-white text-gray-300 border border-gray-100'
                }`}>
                  {step > s.id ? <CheckCircle2 size={20} /> : s.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-teal-600' : 'text-gray-300'}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Progress Line */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-full max-w-xl h-1 bg-gray-200 -z-0 rounded-full">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
              className="h-full bg-teal-600 rounded-full relative"
            >
              {/* Jajá Running Animation */}
              <motion.div 
                className="absolute -right-4 -top-6 text-orange-500"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Bike size={24} />
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Checkout Area (Zona de Foco Máximo) */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[48px] p-10 md:p-14 shadow-2xl shadow-teal-900/5 border border-teal-50 text-center relative overflow-hidden"
            >
              {/* Tuca Validation (Top Right) */}
              <div className="absolute top-8 right-8 flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-2xl border border-teal-100">
                <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center text-white">
                  <Microscope size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black text-teal-600 uppercase leading-none">Tuca Confirma</p>
                  <p className="text-[10px] font-bold text-gray-600">Sistema Seguro</p>
                </div>
              </div>

              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">Finalize sua Missão</h2>
              <p className="text-gray-500 font-medium mb-10">Escaneie o QR Code abaixo para confirmar sua coleta.</p>

              {/* Central QR Code Area */}
              <div className="max-w-xs mx-auto mb-10 p-8 bg-slate-50 rounded-[40px] border-2 border-dashed border-teal-100 relative group">
                <div className="aspect-square bg-white rounded-3xl shadow-inner flex items-center justify-center overflow-hidden border border-teal-50">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`} 
                    alt="QR Code Pix"
                    className="w-full h-full p-4"
                  />
                </div>
                
              {/* Success Overlay */}
              <AnimatePresence>
                {paymentStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-teal-600/95 backdrop-blur-md rounded-[48px] flex flex-col items-center justify-center text-white p-12 z-50"
                  >
                    <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl">
                      <CheckCircle2 size={64} className="text-white animate-bounce" />
                    </div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Pagamento Confirmado!</h3>
                    <p className="text-lg opacity-90 mb-10 max-w-md">
                      Sua missão foi confirmada. Enviamos um e-mail com as orientações para sua coleta.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                      <Link 
                        to="/resultados"
                        className="flex-1 bg-white text-teal-600 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal-50 transition-all text-center"
                      >
                        Ver Meus Exames
                      </Link>
                      <Link 
                        to="/"
                        className="flex-1 bg-teal-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal-800 transition-all text-center"
                      >
                        Voltar para Home
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                <div className="flex flex-col gap-3">
                  <button 
                    disabled={!agreed || paymentStatus === 'success' || loading}
                    onClick={handleStripeCheckout}
                    className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                    Pagar com Cartão (Stripe)
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-gray-300 bg-white px-4">Ou via Pix</div>
                  </div>

                  <button 
                    onClick={handleCopy}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl ${
                      copied ? 'bg-teal-600 text-white' : 'bg-[#00FF00] text-teal-900 hover:bg-[#00EE00]'
                    }`}
                  >
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    {copied ? 'Código Copiado!' : 'Copiar Código Pix'}
                  </button>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Vencimento em 30 minutos</p>
                </div>

                {/* LGPD Consent */}
                <div className="pt-6 border-t border-gray-50">
                  <label className="flex items-start gap-4 cursor-pointer group text-left">
                    <div className="relative mt-1">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={agreed}
                        onChange={() => setAgreed(!agreed)}
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                        agreed ? 'bg-teal-600 border-teal-600' : 'bg-white border-gray-200 group-hover:border-teal-400'
                      }`}>
                        {agreed && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] font-bold text-gray-600 leading-relaxed">
                        Aceito os <Link to="/termos" className="text-teal-600 underline">Termos de Uso</Link> e a <Link to="/privacidade" className="text-teal-600 underline">Política de Privacidade</Link> (LGPD). Autorizo o processamento dos meus dados sensíveis de saúde conforme RDC 786/2023.
                      </p>
                    </div>
                  </label>
                </div>

                <button 
                  disabled={!agreed || paymentStatus === 'success'}
                  onClick={() => setPaymentStatus('success')}
                  className="w-full mt-4 bg-gray-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-teal-600 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                >
                  Confirmar Pagamento <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar (Zona de Confiança) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Resumo do Pedido */}
            <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-teal-900/5 border border-teal-50">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8 pb-4 border-b border-gray-50 flex items-center gap-2">
                <ClipboardCheck size={16} className="text-teal-600" /> Resumo da Missão
              </h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500">Coleta Domiciliar</span>
                  <span className="text-sm font-black text-gray-900">R$ 115,00</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900 uppercase tracking-tight">Total</span>
                  <span className="text-2xl font-black text-teal-600 leading-none">R$ 115,00</span>
                </div>
              </div>

              {/* Speed Seals */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-2xl border border-teal-100">
                  <Zap size={16} className="text-teal-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">Selo Verde: Resultado em 24h</span>
                </div>
              </div>
            </div>

            {/* Lica Trust Card */}
            <div className="bg-indigo-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Shield size={24} className="text-teal-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight">Lica Garante</h4>
                    <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Transação Criptografada</p>
                  </div>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed mb-6 opacity-80">
                  Seus dados financeiros são processados via **Stripe**, o padrão ouro de segurança global. Não armazenamos seus dados de cartão.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-400">
                  <Lock size={12} /> SSL 256-bit AES
                </div>
              </div>
            </div>

            {/* LGPD Info */}
            <div className="bg-slate-100 rounded-[32px] p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={18} className="text-slate-400" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Compliance LGPD</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Você tem o direito de solicitar a exclusão dos seus dados a qualquer momento. Seus laudos são protegidos por criptografia de nível militar.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
