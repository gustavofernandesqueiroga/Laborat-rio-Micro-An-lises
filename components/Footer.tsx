
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Microscope, Instagram, Facebook, Linkedin, ArrowUp, ShieldCheck, Globe, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white pt-24 pb-12 border-t border-teal-50 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-16">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
             <Link to="/" className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Microscope className="text-white" size={20} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tighter">COLETA JÁ</span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-teal-600">Diagnóstico Inteligente</span>
              </div>
            </Link>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
              Rede laboratorial focada em revolucionar o diagnóstico laboratorial, médico e veterinário na Paraíba e RN.
            </p>
            
            {/* Domain Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-full text-[9px] font-black uppercase tracking-wider border border-teal-100">
                <ShieldCheck size={12} /> Site Oficial
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-full text-[9px] font-black uppercase tracking-wider border border-gray-100">
                <Lock size={12} /> SSL Seguro
              </div>
            </div>

            <div className="flex gap-4">
              <a href="https://www.instagram.com/lab.microanalisesuna/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm" title="Instagram"><Instagram size={20}/></a>
              <a href="#" className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm" title="Facebook"><Facebook size={20}/></a>
              <a href="#" className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm" title="LinkedIn"><Linkedin size={20}/></a>
            </div>
          </div>
          
          <div>
            <h5 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-8">Serviços Tech</h5>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link to="/agendamento" className="hover:text-teal-600 transition">Agendamento Online</Link></li>
              <li><Link to="/guepardo" className="hover:text-teal-600 transition">Coleta Domiciliar (Guepardo)</Link></li>
              <li><Link to="/triagem" className="hover:text-teal-600 transition">Triagem Inteligente (IA)</Link></li>
              <li><Link to="/tea" className="hover:text-indigo-600 transition">Atendimento TEA</Link></li>
              <li><Link to="/unidades" className="hover:text-teal-600 transition">Unidades Smart</Link></li>
              <li><Link to="/convenios" className="hover:text-teal-600 transition">Convênios</Link></li>
              <li><Link to="/empresas" className="hover:text-teal-600 transition">Para Empresas</Link></li>
              <li><Link to="/resultados" className="hover:text-teal-600 transition">Resultados Online</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-8">Institucional</h5>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link to="/sobre" className="hover:text-teal-600 transition">Sobre Nós</Link></li>
              <li><Link to="/contato" className="hover:text-teal-600 transition">Contato</Link></li>
              <li><Link to="/trabalhe-conosco" className="hover:text-teal-600 transition">Trabalhe Conosco</Link></li>
              <li><Link to="/compliance" className="hover:text-teal-600 transition">Compliance</Link></li>
              <li><Link to="/admin" className="hover:text-teal-600 transition">Portal Administrativo</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-8">Central de Apoio</h5>
            <p className="text-sm font-bold text-gray-500 mb-4">João Pessoa, Cajazeiras, Sousa e Pau dos Ferros</p>
            <p className="text-xl font-black text-teal-600 mb-2">(83) 3022-1000</p>
            <p className="text-sm text-gray-400 font-bold flex items-center gap-2">
              <Globe size={14} className="text-teal-600" /> coletaja.com.br
            </p>
          </div>
        </div>
        
        <div className="pt-12 border-t border-teal-50 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 gap-4 text-center md:text-left">
          <p>© {new Date().getFullYear()} Coleta Já. Todos os direitos reservados.</p>
          <div className="flex flex-wrap justify-center gap-8">
            <span>Responsável Técnico: Dr. Marcos Aurélio</span>
            <Link to="/compliance" className="hover:text-orange-500">Privacidade</Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.3, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: 50 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 bg-white text-teal-600 p-4 rounded-full shadow-2xl hover:bg-teal-600 hover:text-white transition-all z-[85] group border border-teal-50"
            aria-label="Voltar ao topo"
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
