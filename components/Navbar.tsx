
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Microscope, Instagram, Facebook, X, Menu, Phone, MapPin, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloqueia o scroll do body quando o menu mobile está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Fecha o menu se a rota mudar externamente
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Exames & Combos', path: '/servicos' },
    { name: 'Guepardo', path: '/guepardo' },
    { name: 'Infantil', path: '/infantil' },
    { name: 'Triagem IA', path: '/triagem' },
    { name: 'Unidades JP', path: '/unidades' },
    { name: 'Contato', path: '/contato' },
    { name: 'Resultados', path: '/resultados' },
  ];

  const handleMobileNav = (path: string) => {
    setIsOpen(false);
    
    // Lógica para Links com Hash (#) ou rotas normais
    if (path.includes('#')) {
      const [pathname, hash] = path.split('#');
      
      // Se estivermos na mesma página, scroll manual
      if (location.pathname === pathname || (pathname === '/' && location.pathname === '/')) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100); // Pequeno delay para garantir que o menu feche visualmente antes
      } else {
        navigate(path);
      }
    } else {
      // Rota normal: garante scroll para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const SocialIcons = () => (
    <div className="flex gap-4">
      <a href="https://www.instagram.com/lab.microanalisesuna/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors p-2" title="Instagram">
        <Instagram size={18} />
      </a>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors p-2" title="Facebook">
        <Facebook size={18} />
      </a>
    </div>
  );

  return (
    <div className="fixed w-full z-[100] transition-all duration-300">
      {/* Top Bar */}
      <div className={`bg-teal-900 text-white text-[10px] font-bold uppercase tracking-widest hidden md:block transition-all duration-500 overflow-hidden ${scrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-10 py-2 opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex space-x-6 items-center">
            <span className="flex items-center gap-2"><Phone size={12} className="opacity-70" /> (83) 3534-0000</span>
            <span className="flex items-center gap-2"><MapPin size={12} className="opacity-70" /> João Pessoa - PB</span>
          </div>
          <div className="scale-75 origin-right">
             <SocialIcons />
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`${scrolled ? 'bg-white/95 backdrop-blur-md shadow-xl py-3' : 'bg-white py-4 md:py-5'} transition-all duration-300 border-b border-teal-50 relative z-[101]`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative z-[102]" onClick={() => window.scrollTo(0,0)}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-teal-600/20 shrink-0">
                <Microscope className="text-white" size={18} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base sm:text-lg md:text-xl font-black text-gray-900 tracking-tighter">COLETA JÁ</span>
                <span className="text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-[0.15em] text-orange-500 underline decoration-2 underline-offset-2">João Pessoa</span>
              </div>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                    location.pathname === link.path ? 'text-teal-600' : 'text-gray-500 hover:text-teal-600'
                  } ${link.path === '/tea' ? 'text-indigo-600 font-extrabold flex items-center gap-1' : ''}`}
                  onClick={() => {
                    if(!link.path.includes('#')) window.scrollTo(0,0);
                  }}
                >
                  {link.path === '/tea' && <Heart size={12} fill="currentColor" />}
                  {link.name}
                </Link>
              ))}
              <Link to="/agendamento" onClick={() => window.scrollTo(0,0)} className="bg-orange-accent text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-1">
                Agendamento
              </Link>
            </div>

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden text-teal-900 p-2 focus:outline-none z-[102] bg-gray-50 rounded-xl active:scale-95 transition-transform"
              aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-teal-900/60 backdrop-blur-sm lg:hidden z-[90]"
                style={{ top: scrolled ? '64px' : '88px' }} // Ajuste dinâmico baseado na altura do header
              />
              
              {/* Dropdown Menu */}
              <motion.div 
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.5 }}
                className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-teal-50 shadow-2xl z-[100] overflow-hidden rounded-b-[40px] max-h-[85vh] overflow-y-auto"
              >
                <div className="flex flex-col p-6 space-y-2">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link 
                        to={link.path} 
                        className={`block p-4 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all ${
                          location.pathname === link.path && location.hash === (link.path.includes('#') ? link.path.split('#')[1] : '')
                            ? 'bg-teal-50 text-teal-600 pl-6' 
                            : 'text-gray-600 hover:bg-gray-50 hover:pl-6'
                        } ${link.path === '/tea' ? 'text-indigo-600' : ''}`}
                        onClick={() => handleMobileNav(link.path)}
                      >
                         {link.path === '/tea' && '💙 '}
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    className="pt-6 pb-4"
                  >
                    <Link 
                      to="/agendamento" 
                      className="flex items-center justify-center w-full bg-orange-accent text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-500/20 active:scale-95 transition-transform" 
                      onClick={() => handleMobileNav('/agendamento')}
                    >
                      Agendar Online
                    </Link>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (navLinks.length + 1) * 0.05 }}
                    className="flex justify-center gap-8 pt-4 pb-2 border-t border-gray-100 text-teal-600"
                  >
                    <SocialIcons />
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
