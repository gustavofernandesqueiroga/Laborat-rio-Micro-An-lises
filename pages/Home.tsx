
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Zap, ShieldCheck, Bike, ClipboardCheck, ArrowRight, X, Heart, Star, CheckCircle2 } from 'lucide-react';
import { EXAM_PREPS, UNITS, CHECKUPS } from '../constants';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { UnitType } from '../types';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrep, setShowPrep] = useState<any>(null);
  const navigate = useNavigate();

  const filteredExams = searchTerm.length > 1 
    ? EXAM_PREPS.filter(e => 
        e.exam.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="pt-6 md:pt-20">
      <SEO 
        title="Coleta Já - Diagnóstico Laboratorial, Médico e Veterinário" 
        description="Rede laboratorial focada em revolucionar o diagnóstico na Paraíba. Oferecemos consultoria e serviços para hospitais e clínicas em João Pessoa e região."
        keywords="laboratório João Pessoa, Coleta Já, diagnóstico veterinário, exames laboratoriais PB, consultoria laboratorial"
        schema={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Coleta Já",
          "image": "https://www.coletaja.com.br/og-image.jpg",
          "@id": "https://www.coletaja.com.br",
          "url": "https://www.coletaja.com.br",
          "telephone": "+558330221000",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Av. Epitácio Pessoa, 2500",
            "addressLocality": "João Pessoa",
            "addressRegion": "PB",
            "postalCode": "58040-000",
            "addressCountry": "BR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": -7.1195,
            "longitude": -34.8550
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "06:00",
            "closes": "18:00"
          }
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-teal-50 rounded-l-[100px] hidden lg:block -z-10"></div>
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center pt-6 sm:pt-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-6 leading-none">
              Excelência em Diagnóstico
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 sm:mb-8 uppercase tracking-tighter">
              Revolucionando o <br className="hidden sm:block"/> <span className="text-teal-600">Diagnóstico na Paraíba.</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-lg mb-8 font-medium max-w-lg leading-relaxed">
              Diagnóstico laboratorial, médico e veterinário com tecnologia de ponta em João Pessoa e região.
            </p>
            
            {/* Search Input */}
            <div className="relative w-full max-w-lg mb-8">
              <div className="flex items-center bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl shadow-teal-900/10 border border-teal-50 p-1.5 sm:p-2">
                <Search className="ml-4 text-teal-600 shrink-0" size={18} />
                <input 
                  type="text" 
                  placeholder="Busque por exame..."
                  className="w-full px-3 py-2 sm:py-3 outline-none font-medium text-gray-700 bg-transparent text-sm sm:text-base placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Dropdown Resultados */}
              <AnimatePresence>
                {filteredExams.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute w-full mt-4 bg-white rounded-3xl shadow-2xl border border-teal-50 p-4 z-50 overflow-hidden"
                  >
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Resultados Encontrados</p>
                    {filteredExams.map(exam => (
                      <button 
                        key={exam.id}
                        onClick={() => setShowPrep(exam)}
                        className="w-full text-left p-4 hover:bg-teal-50 rounded-2xl transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <span className="text-[9px] font-black text-teal-600 uppercase block leading-none mb-1">Cód: {exam.id}</span>
                          <span className="font-bold text-gray-700">{exam.exam}</span>
                        </div>
                        <ArrowRight size={16} className="text-teal-600 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center w-full">
              <Link 
                to="/agendamento"
                className="w-full sm:w-auto bg-orange-accent text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all text-center"
              >
                Chamar Guepardo
              </Link>
              <Link 
                to="/tea"
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
              >
                <Heart size={14} fill="currentColor" /> Atendimento TEA
              </Link>
              <Link 
                to="/resultados"
                className="w-full sm:w-auto bg-white text-teal-600 border-2 border-teal-600 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/5 hover:bg-teal-50 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
              >
                <Search size={14} /> Resultados
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Combos (Strategy from PDF) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-orange-500 font-bold uppercase tracking-widest text-[10px] sm:text-sm mb-4">Portfólio Estratégico</h2>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight">Combos de Saúde Premium</h3>
              <p className="text-gray-500 mt-4 text-sm sm:text-base">Preços exclusivos para João Pessoa</p>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
             {CHECKUPS.map((combo, idx) => (
                <div key={combo.id} className="bg-gray-50 rounded-[2.5rem] sm:rounded-[40px] p-6 sm:p-8 border border-gray-100 hover:border-teal-200 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col h-full">
                   <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Star size={64} className="text-teal-600" />
                   </div>
                   <div className="mb-6">
                     <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                       Economize até 25%
                     </span>
                     <h4 className="text-xl font-black text-gray-900 mb-2 uppercase leading-none tracking-tight">{combo.name}</h4>
                     <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-relaxed">{combo.description}</p>
                   </div>
                   
                   <div className="space-y-2 mb-8 flex-1">
                      {combo.exams.slice(0, 5).map(ex => (
                         <div key={ex} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                            <CheckCircle2 size={14} className="text-teal-500" /> {ex}
                         </div>
                      ))}
                      {combo.exams.length > 5 && (
                        <p className="text-[9px] font-bold text-teal-600 uppercase ml-6">+ {combo.exams.length - 5} exames inclusos</p>
                      )}
                   </div>

                   <div className="mb-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                     <div>
                       <p className="text-[10px] font-bold text-gray-400 line-through tracking-widest">{combo.oldPrice}</p>
                       <p className="text-3xl font-black text-gray-900 leading-none">{combo.price}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Oferta por</p>
                       <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Tempo Limitado</p>
                     </div>
                   </div>

                   <Link to="/agendamento" className="block w-full py-5 bg-teal-600 text-white text-center rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all transform hover:-translate-y-1">
                      Agendar agora
                   </Link>
                </div>
             ))}
           </div>
        </div>
      </section>

      {/* Conversion Funnel Section */}
      <section className="py-20 sm:py-32 bg-gray-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="grid grid-cols-6 sm:grid-cols-12 h-full gap-4">
            {[...Array(30)].map((_, i) => <Zap key={i} size={40} className="text-white" />)}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 sm:space-y-8 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 text-teal-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-500/20">
                <Zap size={14} className="animate-pulse" /> Velocidade Máxima Coleta Já
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] uppercase tracking-tighter">
                Por que esperar <br className="hidden sm:block"/><span className="text-teal-400 italic">Se você pode ter hoje?</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                Combinamos a logística ultra-rápida do **Guepardo** com o selo **Jajá 24h**. 
                Seu exame é coletado em casa até as 09h e o resultado sai no mesmo dia.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 w-full">
                <div className="p-6 sm:p-8 bg-white/5 rounded-[2.5rem] sm:rounded-[40px] border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/20">
                    <Bike size={24} className="sm:size-28" />
                  </div>
                  <h4 className="text-white font-black uppercase tracking-tight text-base sm:text-lg mb-2 leading-none">Coleta em Casa</h4>
                  <p className="text-gray-500 text-[10px] sm:text-[11px] font-medium leading-relaxed">O laboratório vai até você com horário marcado. Conforto total.</p>
                </div>
                <div className="p-6 sm:p-8 bg-white/5 rounded-[2.5rem] sm:rounded-[40px] border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                    <Zap size={24} className="sm:size-28" />
                  </div>
                  <h4 className="text-white font-black uppercase tracking-tight text-base sm:text-lg mb-2 leading-none">Selo Jajá 24h</h4>
                  <p className="text-gray-500 text-[10px] sm:text-[11px] font-medium leading-relaxed">Resultados entregues digitalmente em tempo recorde.</p>
                </div>
              </div>

              <div className="pt-6 sm:pt-8 w-full">
                <Link 
                  to="/agendamento"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-teal-500 text-gray-900 px-10 py-5 sm:py-6 rounded-[2rem] sm:rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-teal-400 transition-all shadow-2xl shadow-teal-500/20 active:scale-95 text-xs sm:text-sm"
                >
                  Agendar Coleta Agora <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
              <div className="absolute -inset-4 bg-teal-500/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="bg-gray-800 rounded-[3rem] sm:rounded-[60px] p-6 sm:p-12 border border-white/10 relative shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-transparent pointer-events-none"></div>
                <div className="space-y-6 sm:space-y-8 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-6 sm:pb-8 gap-4">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-xl shrink-0"><ClipboardCheck size={24}/></div>
                      <div className="text-left">
                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status do Pedido</p>
                        <p className="text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-none">Check-up Completo</p>
                      </div>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-teal-400 bg-teal-400/10 px-4 py-2 rounded-full border border-teal-400/20">Acelerado</span>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-teal-500 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.6)]"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-gray-500">
                      <span>Coleta OK</span>
                      <span className="text-teal-400">Processando</span>
                      <span>Liberado</span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 bg-gray-900/50 rounded-[2rem] sm:rounded-[32px] border border-white/5 mt-6 sm:mt-8 space-y-3 sm:space-y-4 group-hover:bg-gray-900/80 transition-all text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-teal-500 animate-ping"></div>
                      <p className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest">Tempo Estimado: 4h 12min</p>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium leading-relaxed">
                      Sua amostra foi captada às 10:15h. Entrada no processamento às 10:45h. Previsão: 15h hoje.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[50px] shadow-2xl hidden sm:block transform hover:scale-110 transition-transform">
                <p className="text-2xl sm:text-4xl font-black text-gray-900 leading-none mb-1 sm:mb-2 tracking-tighter text-left">99.8%</p>
                <p className="text-[8px] sm:text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none text-left">Confiabilidade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guepardo / Coleta Já Section */}
      <section className="py-24 bg-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 h-full w-full">
            {[...Array(24)].map((_, i) => <Bike key={i} className="text-white m-4" />)}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
              <Bike className="text-white" size={32} />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 sm:mb-8 leading-tight">
              Guepardo na Paraíba: <br className="hidden sm:block"/>
              <span className="text-orange-400">Logística de Elite.</span>
            </h2>
            <p className="text-teal-50 text-base sm:text-xl leading-relaxed mb-6 sm:mb-8 opacity-90 font-medium">
              A Coleta Já possui uma infraestrutura logística robusta, com frota de caminhões elétricos e refrigerados, garantindo a integridade total do material biológico de João Pessoa ao Sertão.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-center text-white font-bold">
                <ShieldCheck className="mr-3 text-orange-400" />
                Segurança WorkLab
              </div>
              <div className="flex items-center text-white font-bold">
                <ClipboardCheck className="mr-3 text-orange-400" />
                Pontos Logísticos no Interior
              </div>
            </div>
            <Link 
              to="/guepardo"
              className="inline-block bg-white text-teal-600 px-12 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-1"
            >
              Conhecer o Serviço
            </Link>
          </div>
          <div className="lg:w-1/2 bg-white/10 backdrop-blur-xl p-4 rounded-[60px]">
             <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
              className="rounded-[50px] shadow-inner"
              alt="Interface Coleta Já"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Unidades & Expansão Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">Plano de Ocupação Territorial</h2>
            <h3 className="text-4xl font-black text-gray-900">Rede em Expansão na Paraíba e RN</h3>
            <p className="text-gray-500 mt-4">Mais de 25 unidades entre Smart Units e Pontos Logísticos estratégicos</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {UNITS.filter(u => u.type === UnitType.CLASSIC).slice(0, 6).map(unit => (
              <div key={unit.id} className="group bg-gray-50 p-8 rounded-[40px] hover:bg-teal-50 transition-all border border-transparent hover:border-teal-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-lg transition-all">
                  <MapPin className="text-teal-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{unit.name}</h4>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{unit.address}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-teal-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    {unit.city}
                  </span>
                  <Link to={`/unidades/${unit.id}`} className="text-orange-500 hover:translate-x-1 transition-transform">
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              to="/unidades"
              className="inline-flex items-center gap-2 text-teal-600 font-black uppercase tracking-widest text-xs hover:text-orange-500 transition-colors"
            >
              Ver todas as unidades <ArrowRight size={16} />
            </Link>
          </div>

          <div id="empresas" className="mt-16 bg-indigo-900 rounded-[50px] p-12 relative overflow-hidden scroll-mt-32">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div>
                <h4 className="text-3xl font-black text-white mb-4">Cuidado Especializado TEA</h4>
                <p className="text-indigo-200 text-lg max-w-xl">
                   Conheça nossa unidade em João Pessoa com sala sensorial, realidade virtual e equipe treinada para atendimento neurodivergente na Paraíba.
                </p>
              </div>
              <Link 
                to="/tea"
                className="bg-white text-indigo-600 px-12 py-5 rounded-3xl font-black uppercase tracking-widest whitespace-nowrap text-center transform hover:scale-105 transition-all shadow-xl"
              >
                Conhecer Unidade TEA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Preparo */}
      <AnimatePresence>
        {showPrep && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[40px] max-w-xl w-full p-10 relative"
            >
              <button 
                onClick={() => setShowPrep(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"
              >
                <X />
              </button>
              <div className="w-16 h-16 bg-teal-100 rounded-3xl flex items-center justify-center mb-8">
                <ClipboardCheck className="text-teal-600" size={32} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">{showPrep.exam}</h3>
              <div className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest mb-8">
                Jejum: {showPrep.fasting || 'Não necessário'}
              </div>
              
              <ul className="space-y-4">
                {showPrep.instructions.map((inst: string, i: number) => (
                  <li key={i} className="flex items-start text-gray-600 leading-relaxed font-medium">
                    <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 text-[10px] flex items-center justify-center font-black mr-4 shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    {inst}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => setShowPrep(null)}
                className="w-full mt-10 bg-gray-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-teal-600 transition-colors"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
