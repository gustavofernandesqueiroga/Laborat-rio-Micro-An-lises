
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  TrendingDown, 
  ShieldCheck, 
  ChevronRight, 
  Briefcase, 
  Clock, 
  BarChart3, 
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Phone,
  Mail,
  Target,
  LayoutDashboard,
  Zap,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Corporate: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const solutions = [
    {
      icon: <Building2 size={32} />,
      title: "Apoio a Laboratórios",
      desc: "Ofertamos consultoria técnica e processamento de exames para laboratórios parceiros, elevando o padrão diagnóstico regional.",
      color: "teal"
    },
    {
      icon: <Target size={32} />,
      title: "Licitações & Governo",
      desc: "Parcerias estratégicas com prefeituras e estados para fornecimento de exames a hospitais regionais e UBS.",
      color: "orange"
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Diagnóstico Veterinário",
      desc: "Serviços especializados para clínicas veterinárias e produtores rurais, com foco na sanidade animal do Sertão.",
      color: "blue"
    }
  ];

  const consultSteps = [
    { 
      step: "01", 
      title: "Mapeamento", 
      desc: "Analisamos o perfil epidemiológico da sua empresa e identificamos os principais riscos à saúde do time." 
    },
    { 
      step: "02", 
      title: "Customização", 
      desc: "Criamos pacotes de exames e fluxos de coleta (Unidade ou Domiciliar) ajustados à sua jornada de trabalho." 
    },
    { 
      step: "03", 
      title: "Monitoramento", 
      desc: "Entrega de dashboards em tempo real para o RH e suporte contínuo na gestão de absenteísmo." 
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const scrollToForm = () => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-32 pb-24 bg-[#fcfdfd] min-h-screen">
      <SEO 
        title="Coleta Já Corporate - Soluções para Empresas e Governo" 
        description="Consultoria diagnóstica, serviços para laboratórios parceiros e parcerias governamentais. Revolucionando a saúde no Sertão Paraibano."
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Hero Section */}
        <section className="relative rounded-[60px] bg-slate-900 overflow-hidden mb-24 min-h-[50vh] flex items-center shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-6 h-full w-full">
              {[...Array(12)].map((_, i) => <div key={i} className="border-r border-b border-white/10"></div>)}
            </div>
          </div>
          <div className="relative z-10 px-8 md:px-20 py-20 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-3/5">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-teal-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-teal-500/20 mb-8"
              >
                <Briefcase className="text-teal-400" size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">Coleta Já Corporate & Gov</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none uppercase"
              >
                Diagnóstico de Elite <br/><span className="text-teal-500">para o Setor Público e Privado.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl font-medium"
              >
                Consultoria para laboratórios parceiros, licitações municipais e apoio a hospitais regionais. A excelência da Coleta Já a serviço da saúde.
              </motion.p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={scrollToForm}
                  className="bg-teal-600 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center gap-2"
                >
                  Solicitar Consultoria <ChevronRight size={16} />
                </button>
                <div className="flex items-center gap-3 text-white/60 text-xs font-bold px-4">
                  <CheckCircle2 className="text-teal-500" size={18} /> +200 Empresas Atendidas
                </div>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:w-2/5 hidden lg:block"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Zap className="text-orange-500 animate-pulse" size={24} />
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white">
                    <TrendingDown size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase text-xs tracking-widest leading-none mb-1">Impacto Direto</h4>
                    <p className="text-teal-400 font-bold text-sm">-15% Absenteísmo</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-teal-500" />
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-orange-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Consultancy Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Metodologia</h2>
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Consultoria em 3 Passos</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {consultSteps.map((s) => (
              <div key={s.step} className="bg-white p-10 rounded-[48px] border border-gray-50 shadow-xl shadow-teal-900/5 relative">
                <span className="absolute -top-6 left-10 w-12 h-12 bg-gray-900 text-white flex items-center justify-center rounded-2xl font-black">{s.step}</span>
                <h4 className="text-xl font-black text-gray-900 mb-4 mt-4">{s.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HR Dashboard Promise & Demo */}
        <section className="mb-32 bg-teal-50 rounded-[60px] p-12 md:p-20 flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600 mb-4">Gestão de Saúde</h2>
            <h3 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter leading-tight">Painel de controle total para o seu RH</h3>
            <div className="space-y-8 mb-10">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm shrink-0">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Métricas em Tempo Real</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Acompanhe o status dos exames admissionais e periódicos através de um portal exclusivo.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm shrink-0">
                  <Lock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Conformidade LGPD</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Segurança total dos dados clínicos sensíveis, em conformidade com as normas vigentes.</p>
                </div>
              </div>
            </div>
            <Link 
              to="/dashboard-rh"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-teal-600 transition-colors shadow-xl"
            >
              Ver Demo do Painel <LayoutDashboard size={14} />
            </Link>
          </div>
          <div className="lg:w-1/2 bg-white p-4 rounded-[50px] shadow-2xl relative group">
            <div className="absolute inset-0 bg-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[50px] flex items-center justify-center z-10">
               <Link to="/dashboard-rh" className="bg-white text-teal-600 p-6 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform">
                  <ArrowRight size={32} />
               </Link>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
              className="rounded-[40px]"
              alt="Dashboard de Gestão Corporate"
            />
          </div>
        </section>

        {/* Lead Form Section */}
        <section id="contato" className="max-w-5xl mx-auto scroll-mt-32">
          <div className="bg-white rounded-[60px] p-10 md:p-20 shadow-2xl shadow-teal-900/10 border border-teal-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Solicite sua <br/><span className="text-orange-500 text-italic">Consultoria</span></h2>
                    <p className="text-gray-500 font-medium max-w-xl mx-auto">Preencha os dados abaixo para receber uma proposta personalizada de consultoria em saúde diagnóstica para o seu time.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nome da Empresa</label>
                      <input required type="text" placeholder="Razão Social ou Nome Fantasia" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">CNPJ</label>
                      <input required type="text" placeholder="00.000.000/0001-00" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">E-mail Corporativo</label>
                      <input required type="email" placeholder="rh@empresa.com.br" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Telefone de Contato</label>
                      <input required type="tel" placeholder="(83) 90000-0000" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold" />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Qual sua principal necessidade?</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {['Saúde Ocupacional', 'Check-ups Executivos', 'Coleta in Company'].map(opt => (
                          <button key={opt} type="button" className="py-4 bg-gray-50 border-2 border-transparent hover:border-teal-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-teal-600 transition-all">
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2 pt-6">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-orange-accent text-white py-6 rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-orange-500/30 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                      >
                        {isSubmitting ? <><Loader2 className="animate-spin" /> Processando...</> : <>Enviar Solicitação <ArrowRight size={20} /></>}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-inner">
                    <MessageSquare size={48} className="animate-bounce" />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Recebemos sua mensagem!</h2>
                  <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto mb-12">
                    Nossa equipe comercial entrará em contato em até 24h úteis para agendar uma reunião de consultoria.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="text-teal-600 font-black uppercase text-xs border-b-2 border-teal-600 pb-1">Enviar outra solicitação</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Support Section */}
        <section className="mt-32 text-center">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Precisa de Ajuda Imediata?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <a href="tel:8335340000" className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-teal-50 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0"><Phone size={24}/></div>
              <div className="text-left">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ligue para nossa Central</p>
                <p className="text-lg font-black text-gray-900">(83) 3534-0000</p>
              </div>
            </a>
            <a href="mailto:corporate@laboratoriomicroanalises.com.br" className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-teal-50 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0"><Mail size={24}/></div>
              <div className="text-left">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">E-mail B2B</p>
                <p className="text-lg font-black text-gray-900">corporate@micro.com</p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Corporate;
