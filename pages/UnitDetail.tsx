
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UNITS } from '../constants';
import { UnitType } from '../types';
import SEO from '../components/SEO';
import { Clock, MapPin, Phone, Globe, ChevronLeft, Info, Calendar, ShieldCheck, Zap, Navigation, Share2 } from 'lucide-react';

const UnitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const publicUnits = UNITS.filter(u => u.type !== UnitType.AUTONOMOUS);
  const unit = UNITS.find(u => u.id === id);
  const currentIndex = publicUnits.findIndex(u => u.id === id);
  const nextUnit = publicUnits[(currentIndex + 1) % publicUnits.length];
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  // Helper function to check if unit is open based on hours string
  const checkStatus = (hours: string) => {
    if (hours.toLowerCase().includes('24h')) return true;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Regex to match "HH:mm - HH:mm"
    const match = hours.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
    if (!match) return false;
    
    const startMinutes = parseInt(match[1]) * 60 + parseInt(match[2]);
    const endMinutes = parseInt(match[3]) * 60 + parseInt(match[4]);
    
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!unit || unit.type === UnitType.AUTONOMOUS) {
      navigate('/unidades');
      return;
    }
    setIsOpen(checkStatus(unit.hours));

    // Update status every minute
    const interval = setInterval(() => {
      setIsOpen(checkStatus(unit.hours));
    }, 60000);

    return () => clearInterval(interval);
  }, [unit, navigate]);

  const handleShare = async () => {
    if (!unit) return;
    
    const shareData = {
      title: `Coleta Já - ${unit.name}`,
      text: `Confira a unidade ${unit.name} da Coleta Já em ${unit.city}.\n\n📍 Endereço: ${unit.address}\n📞 Telefone: ${unit.phone}\n`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Compartilhamento cancelado pelo usuário');
      }
    } else {
      // Fallback para WhatsApp Web
      const text = encodeURIComponent(`${shareData.text}\n${shareData.url}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  if (!unit) return null;

  return (
    <div className="pt-24 pb-24 bg-gray-50 min-h-screen">
      <SEO 
        title={`${unit.name} - ${unit.city}`} 
        description={`Detalhes da unidade ${unit.name} da Coleta Já em ${unit.city}. Endereço, telefone, horário de funcionamento e mapa.`}
      />

      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[55vh] overflow-hidden">
        <img 
          src={`https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1920&seed=${unit.id}`} 
          alt={unit.name}
          className="w-full h-full object-cover scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
          <Link to="/unidades" className="inline-flex items-center text-white/70 hover:text-white mb-8 text-[10px] font-black uppercase tracking-[0.2em] transition-all group">
            <ChevronLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Voltar para Unidades
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/10 ${
                  unit.type === UnitType.AUTONOMOUS ? 'bg-orange-500 text-white' : 
                  unit.type === UnitType.PROCESSING ? 'bg-gray-800 text-white' : 'bg-teal-600 text-white'
                }`}>
                  {unit.type}
                </span>
                
                {isOpen !== null && (
                  <div className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl border border-white/10 ${
                    isOpen ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                  }`}>
                    <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white ${isOpen ? 'animate-pulse' : ''}`}></span>
                    {isOpen ? 'Aberto Agora' : 'Fechado'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl md:text-7xl font-black text-white leading-none tracking-tighter">
                  {unit.name}
                </h1>
                
                {/* Mobile Quick Info - Visible only on small screens */}
                <div className="flex flex-col gap-1 md:hidden text-white/80 font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-teal-400 shrink-0" />
                    <span className="truncate">{unit.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-teal-400 shrink-0" />
                    <span>{unit.phone}</span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-3 text-teal-300 font-bold text-lg">
                  <MapPin size={20} />
                  <span>{unit.city} — Paraíba</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href={`tel:${unit.phone.replace(/\D/g, '')}`} className="md:hidden flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl">
                <Phone size={16} /> Ligar
              </a>
              <button 
                onClick={handleShare}
                className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 md:px-6 py-4 rounded-2xl text-white hover:bg-white hover:text-teal-600 transition-all shadow-xl"
              >
                <div className="text-right hidden md:block">
                  <span className="block text-[10px] font-black uppercase tracking-widest opacity-70 group-hover:opacity-100">Compartilhar</span>
                  <span className="block text-sm font-bold leading-none">Enviar para Amigo</span>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Share2 size={20} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Details */}
        <div className="lg:col-span-8 space-y-12">
          <section className="bg-white rounded-[48px] p-10 md:p-14 shadow-2xl shadow-teal-900/5 border border-teal-50">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-1.5 h-8 bg-teal-600 rounded-full"></div>
              <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Informações Estruturais</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="group">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-600/50 mb-3 flex items-center gap-2">
                    <MapPin size={14} /> Endereço
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-800 font-bold text-lg leading-tight group-hover:text-teal-600 transition-colors">{unit.address}<br/>{unit.city} - PB</p>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${unit.coordinates.lat},${unit.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                    >
                      <Navigation size={14} /> Ver no Mapa
                    </a>
                  </div>
                </div>
                
                <div className="group">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-600/50 mb-3 flex items-center gap-2">
                    <Phone size={14} /> Atendimento Direto
                  </h3>
                  <p className="text-2xl font-black text-gray-900">{unit.phone}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Disponível para chamadas e WhatsApp</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-900/5 relative overflow-hidden p-6 group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:scale-150"></div>
                  
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-2">
                    <Clock size={14} /> Horário de Funcionamento
                  </h3>

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-orange-200 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Horário Regular</span>
                        <span className="text-xl font-black text-gray-900">{unit.hours}</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-teal-500 animate-pulse' : 'bg-rose-400'}`}></div>
                    </div>
                  </div>

                  {isOpen !== null && (
                    <div className={`mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isOpen ? '✓ Aberto agora' : '✕ Fechado no momento'}
                    </div>
                  )}
                </div>

                <div className="group">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-600/50 mb-3 flex items-center gap-2">
                    <Globe size={14} /> Guepardo (Domiciliar)
                  </h3>
                  <p className="text-gray-700 font-bold">Serviço de coleta disponível em toda a região de {unit.city}.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
               <a href={`https://wa.me/55${unit.phone.replace(/\D/g, '')}`} 
                 className="flex-1 bg-teal-600 text-white px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs text-center transition-all shadow-xl shadow-teal-500/20 hover:bg-teal-700 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
                 <Phone size={18} /> WhatsApp da Unidade
               </a>
               <Link to="/agendamento" 
                 className="flex-1 bg-white border-2 border-teal-600 text-teal-600 px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs text-center transition-all hover:bg-teal-50 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
                 <Calendar size={18} /> Agendar Exame
               </Link>
            </div>
          </section>

          {/* Map Section */}
          <section className="bg-white rounded-[48px] overflow-hidden shadow-2xl shadow-teal-900/5 border border-teal-50">
             <div className="p-10 md:p-12 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                  <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">Geolocalização</h2>
                </div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.address + ' ' + unit.city)}`} 
                   target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-widest hover:text-orange-700 transition-colors group">
                  Rotas no Google Maps <ChevronLeft className="rotate-180 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
             </div>
             <div className="h-[450px] bg-gray-100 grayscale-[0.3] hover:grayscale-0 transition-all duration-700">
               <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${unit.coordinates.lat},${unit.coordinates.lng}&hl=pt&z=16&output=embed&t=m&z=15`}
                allowFullScreen
                loading="lazy"
                title={`Mapa de localização da ${unit.name}`}
               />
             </div>
          </section>
        </div>

        {/* Sidebar / Quick Info */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-gray-900 text-white rounded-[48px] p-10 shadow-2xl shadow-teal-900/20 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-black mb-10 tracking-tight">Orientações <br/><span className="text-teal-400">ao Paciente</span></h3>
            
            <ul className="space-y-8">
              <li className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-teal-400 shadow-inner">
                  <Info size={24} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-teal-400 mb-1">Preparo Prévio</p>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">Consulte nosso guia de preparo para saber o jejum exato deste exame.</p>
                </div>
              </li>
              
              <li className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-orange-400 shadow-inner">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-orange-400 mb-1">Documentação</p>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">Apresente RG/CPF e o pedido médico original (se houver).</p>
                </div>
              </li>
              
              <li className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-blue-400 shadow-inner">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">Atendimento Smart</p>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">Nesta unidade você conta com triagem digital para maior agilidade.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-teal-50 rounded-[48px] p-10 border border-teal-100 text-center group">
            <div className="w-16 h-16 bg-white text-teal-600 rounded-[2rem] flex items-center justify-center text-3xl mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform">
              🔬
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tighter">Resultados Online</h3>
            <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium px-4">Acesse seus laudos com o protocolo e senha entregues na recepção.</p>
            <Link to="/resultados" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 transition-colors shadow-lg">
              Acessar Portal <ChevronLeft className="rotate-180 w-4 h-4" />
            </Link>
          </div>
        </aside>
      </div>

      {/* Navigation Section */}
      <section className="max-w-7xl mx-auto px-6 mt-20 border-t border-gray-100 pt-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
          <Link 
            to="/unidades" 
            className="flex items-center gap-3 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-teal-600 transition-all group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para Lista de Unidades
          </Link>

          <Link 
            to={`/unidades/${nextUnit.id}`}
            className="flex items-center gap-6 bg-white border border-teal-50 p-6 md:p-8 rounded-[32px] shadow-xl hover:shadow-2xl hover:border-teal-500 transition-all group w-full sm:w-auto"
          >
            <div className="text-right">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-2">Próxima Unidade</span>
              <span className="block text-sm md:text-base font-black text-gray-900 group-hover:text-teal-600 transition-colors">{nextUnit.name}</span>
            </div>
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-inner">
              <ChevronLeft size={24} className="rotate-180" />
            </div>
          </Link>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
         <div className="bg-orange-500 rounded-[4rem] p-10 md:p-16 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl shadow-orange-500/30">
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase leading-none">Dúvidas sobre <br/>exames?</h2>
              <p className="text-orange-50 text-xl font-medium max-w-lg opacity-90">Nossa central técnica está pronta para orientar você sobre qualquer procedimento diagnóstico.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
              <a href={`tel:${unit.phone.replace(/\D/g, '')}`} className="bg-white text-orange-600 px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] text-center transition-all shadow-xl hover:bg-gray-50 hover:scale-105">
                Ligar Agora
              </a>
              <a href="https://wa.me/558330221000" className="bg-gray-900 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] text-center transition-all shadow-xl hover:bg-black hover:scale-105">
                Central WhatsApp
              </a>
            </div>
         </div>
      </section>
    </div>
  );
};

export default UnitDetail;
