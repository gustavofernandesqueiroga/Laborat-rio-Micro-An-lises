
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Puzzle, 
  Heart, 
  Headphones, 
  Clock, 
  MapPin, 
  Sparkles, 
  UserCheck, 
  Calendar, 
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const TeaSupport: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-[#fcfdfd] min-h-screen">
      <SEO 
        title="Atendimento TEA e Neurodivergente - Coleta Já" 
        description="Coleta especializada para autistas e neurodivergentes em Uiraúna e região. Unidade adaptada com realidade virtual e equipe treinada para acolhimento sensorial no Sertão."
        keywords="coleta autismo Uiraúna, laboratório TEA Sertão, atendimento neurodivergente PB, Coleta Já Uiraúna"
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Hero Section - Atmospheric & Immersive */}
        <section className="relative rounded-[60px] bg-[#0a0502] overflow-hidden mb-24 min-h-[70vh] flex items-center shadow-2xl group">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#3a1510_0%,transparent_60%),radial-gradient(circle_at_10%_80%,#ff4e00_0%,transparent_50%)] opacity-40 blur-[60px]"></div>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="relative z-10 px-8 md:px-20 py-20 flex flex-col lg:flex-row items-center gap-16 w-full">
            <div className="lg:w-3/5">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8"
              >
                <Heart className="text-orange-400" size={16} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Protocolo Acolher & Cuidar</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.85] uppercase"
              >
                Onde o silêncio <br/><span className="text-orange-500 italic font-serif lowercase">encontra</span> o cuidado.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/60 text-lg leading-relaxed mb-12 max-w-xl font-medium"
              >
                Criamos um santuário sensorial para neurodivergentes. Na Unidade Micro TEA em Uiraúna, cada luz, som e toque é planejado para respeitar o tempo de quem vê o mundo de forma única.
              </motion.p>
              <div className="flex flex-wrap gap-6">
                <Link 
                  to="/agendamento"
                  className="inline-flex bg-orange-500 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-orange-900/40 hover:bg-orange-600 transition-all items-center gap-3 group"
                >
                  Agendar Coleta Especializada 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-12 py-6 rounded-[2rem] border border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
                  Conhecer a Unidade
                </button>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:w-2/5 relative"
            >
               <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[50px] shadow-2xl relative z-10">
                  <div className="w-24 h-24 bg-orange-500 text-white rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-orange-500/20 rotate-3">
                    <Sparkles size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Realidade Virtual Lúdica</h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Utilizamos tecnologia imersiva para transformar a coleta em uma jornada espacial ou submarina, reduzindo drasticamente a sobrecarga sensorial.
                  </p>
               </div>
               <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -z-0"></div>
            </motion.div>
          </div>
        </section>

        {/* Features - Warm Organic */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">Nossa Metodologia</h2>
              <h3 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                Design focado na <span className="text-orange-500 italic font-serif lowercase">calma</span>.
              </h3>
            </div>
            <p className="text-gray-400 font-medium max-w-xs text-sm">
              Cada detalhe foi validado por especialistas em neuroarquitetura e psicopedagogia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Headphones />, title: "Isolamento Acústico", desc: "Paredes com tratamento sonoro e fones canceladores de ruído de última geração.", color: "bg-orange-50 text-orange-600" },
              { icon: <UserCheck />, title: "Manejo Afetivo", desc: "Equipe treinada em ABA e comunicação por troca de figuras (PECS) para acolhimento total.", color: "bg-teal-50 text-teal-600" },
              { icon: <Clock />, title: "Slot Estendido", desc: "Agendamentos de 40 minutos (o dobro do padrão) para garantir que ninguém se sinta apressado.", color: "bg-indigo-50 text-indigo-600" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col items-start"
              >
                <div className={`w-16 h-16 ${item.color} rounded-3xl flex items-center justify-center mb-8 shadow-inner`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { size: 32 })}
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase">{item.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Location - Split Layout Luxury */}
        <section className="bg-[#f5f2ed] rounded-[60px] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[80vh]">
          <div className="lg:w-1/2 p-12 md:p-24 flex flex-col justify-center">
             <div className="inline-flex items-center gap-2 bg-black/5 text-gray-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-black/10">
               <MapPin size={14} /> Unidade Referência Uiraúna
             </div>
             <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 uppercase tracking-tighter leading-none">
               Onde a <span className="italic font-serif lowercase">tecnologia</span> <br/>abraça o Sertão.
             </h2>
             <p className="text-gray-500 text-lg mb-12 leading-relaxed font-medium">
               Localizada no coração de Uiraúna, nossa unidade foi projetada para ser um ambiente neutro, com iluminação dimerizada e cores que promovem a regulação emocional.
             </p>
             
             <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Endereço</p>
                  <p className="text-gray-900 font-bold">Av. José de Alencar, 45</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Facilidades</p>
                  <p className="text-gray-900 font-bold">Estacionamento & Acessibilidade</p>
                </div>
             </div>

             <div className="flex gap-4">
               <a 
                 href="https://www.google.com/maps/search/?api=1&query=Av.+José+de+Alencar,+45+-+Uiraúna" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 transition-all shadow-xl"
               >
                 Ver no Google Maps
               </a>
             </div>
          </div>
          
          <div className="lg:w-1/2 relative min-h-[400px]">
             <img 
               src="https://images.unsplash.com/photo-1632053001391-9e7634f24255?auto=format&fit=crop&q=80&w=1200" 
               alt="Ambiente Sensorial" 
               className="absolute inset-0 w-full h-full object-cover"
             />
          </div>
        </section>
        
      </div>
    </div>
  );
};

// Componente auxiliar para estrelas
const Star = ({size, fill, className}: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={fill} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default TeaSupport;
