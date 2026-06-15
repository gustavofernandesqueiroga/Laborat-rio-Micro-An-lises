
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Microscope, ExternalLink, LayoutDashboard, ChevronDown, UserCircle, LogOut, ShieldCheck, Calendar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAccessibleTheme } from '../context/AccessibleThemeContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { fontSize, setFontSize } = useAccessibleTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleFontSizeCycle = () => {
    if (fontSize === 'small') setFontSize('medium');
    else if (fontSize === 'medium') setFontSize('large');
    else setFontSize('small');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Exames', path: '/servicos' },
    { name: 'Unidades', path: '/unidades' },
    { name: 'Guepardo', path: '/guepardo' },
    { name: 'Infantil', path: '/infantil' },
    { name: 'Resultados', path: '/resultados' },
  ];

  if (location.pathname === '/dashboard') return null;

  return (
    <header className={`hidden md:block fixed w-full top-0 z-[120] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="hidden md:block max-w-7xl mx-auto px-6">
        <div className={`glass-header rounded-[2rem] px-6 py-3 flex items-center justify-between shadow-2xl shadow-teal-900/5 border border-white/40`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-teal-600/20">
              <Microscope className="text-white" size={20} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black text-gray-900 tracking-tighter">COLETA JÁ</span>
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-orange-500">Diagnóstico Inteligente</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-teal-600 ${
                  location.pathname === link.path ? 'text-teal-600 scale-105' : 'text-gray-500'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Acesso Dinâmico baseado em Role */}
            {isAuthenticated && (
              <div className="h-4 w-px bg-gray-100"></div>
            )}

            {user?.role === 'ADMIN' && (
              <Link to="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600">
                <ShieldCheck size={14} /> War Room
              </Link>
            )}
            {(user?.role === 'GUEPARDO' || user?.role === 'ADMIN') && (
              <Link to="/dashboard-mats" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-600">
                <LayoutDashboard size={14} /> Estoque MATs
              </Link>
            )}
            {(user?.role === 'PARTNER' || user?.role === 'ADMIN') && (
              <Link to="/dashboard-rh" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500">
                <UserCircle size={14} /> Painel RH
              </Link>
            )}
          </nav>

          {/* Action Buttons / User Profile */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              to="/agendamento"
              className="bg-teal-600 text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-2xl shadow-lg shadow-teal-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Calendar size={14} /> Agendar Exame
            </Link>
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-inner">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-gray-900 leading-none uppercase">{user?.name.split(' ')[0]}</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{user?.role}</p>
                  </div>
                  <ChevronDown size={14} className={`text-gray-300 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-teal-50 p-4 overflow-hidden"
                    >
                      <Link to="/resultados" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-gray-600 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-all">
                        <UserCircle size={16} /> Meu Perfil
                      </Link>
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <LogOut size={16} /> Encerrar Sessão
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-orange-accent text-white font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                Acessar Portal
              </Link>
            )}
          </div>

          <div className="flex items-center gap-1.5 lg:hidden">
            <button 
              onClick={handleFontSizeCycle}
              className="p-2 bg-teal-50/80 backdrop-blur-md text-teal-700 rounded-xl hover:bg-teal-100/90 transition-colors flex items-center gap-1 font-extrabold text-xs shrink-0 active:scale-95"
              title="Ajustar tamanho da fonte (Acessibilidade)"
            >
              <span className="font-extrabold text-teal-700">Aa</span>
              <span className="text-[8px] font-extrabold uppercase text-orange-500">({fontSize === 'small' ? 'P' : fontSize === 'medium' ? 'M' : 'G'})</span>
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-gray-100 text-teal-600' : 'text-gray-900'}`}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white shadow-2xl z-[130] p-10 flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center mb-12">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Menu Portal</span>
               <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-50 rounded-lg"><X size={20}/></button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="text-2xl font-black text-gray-900" onClick={() => setIsOpen(false)}>{link.name}</Link>
              ))}
              <div className="h-px bg-gray-100 w-full my-4"></div>
              <Link 
                to="/agendamento" 
                className="bg-teal-600 text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Calendar size={16} /> Agendar Exame
              </Link>
              {isAuthenticated ? (
                <button onClick={logout} className="text-red-500 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                  <LogOut size={16} /> Sair da Conta
                </button>
              ) : (
                <Link to="/login" className="bg-teal-600 text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Entrar no Portal</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
