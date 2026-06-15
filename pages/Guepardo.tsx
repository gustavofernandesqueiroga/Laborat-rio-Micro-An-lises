
import React from 'react';
import { motion } from 'framer-motion';
import { Bike, ShieldCheck, Clock, MapPin, Zap, Phone, CheckCircle2, Navigation, ClipboardCheck, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const Guepardo: React.FC = () => {
  const benefits = [
    {
      icon: <Clock className="text-orange-500" size={32} />,
      title: "Economia de Tempo",
      description: "Esqueça trânsito e filas. Nós vamos até sua residência ou trabalho no horário agendado."
    },
    {
      icon: <ShieldCheck className="text-teal-600" size={32} />,
      title: "Segurança WorkLab",
      description: "Amostras rastreadas e monitoradas digitalmente desde a coleta até o processamento."
    },
    {
      icon: <Zap className="text-orange-500" size={32} />,
      title: "Transporte Climatizado",
      description: "Logística inteligente com maletas térmicas de alta precisão para manter a integridade total."
    },
    {
      icon: <Navigation className="text-teal-600" size={32} />,
      title: "Monitoramento GPS",
      description: "Você acompanha a chegada do nosso técnico em tempo real através do seu WhatsApp."
    }
  ];

  const steps = [
    { num: "01", title: "Agendamento", desc: "Solicite via portal ou WhatsApp informando os exames." },
    { num: "02", title: "Confirmação", desc: "Nossa central valida o preparo e confirma o horário." },
    { num: "03", title: "Coleta", desc: "Um Guepardo vai até você com todo o aparato necessário." },
    { num: "04", title: "Resultado", desc: "Acesse online em até 24h para a maioria dos exames." }
  ];

  return (
    <div className="pt-32 pb-24 bg-[#fcfdfd] min-h-screen">
      <SEO 
        title="Coleta Domiciliar Guepardo - Coleta Já João Pessoa" 
        description="O laboratório vai até você na Paraíba. Conheça o serviço Guepardo de coleta domiciliar em João Pessoa e região com logística inteligente e monitoramento GPS."
        keywords="coleta domiciliar João Pessoa, exame de sangue em casa João Pessoa, laboratório móvel Paraíba, Guepardo Coleta Já"
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="relative rounded-[60px] bg-teal-600 overflow-hidden mb-24 min-h-[60vh] flex items-center">
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 h-full w-full">
              {[...Array(32)].map((_, i) => <Bike key={i} className="text-white m-4" />)}
            </div>
          </div>
          <div className="relative z-10 px-12 md:px-20 py-20 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 mb-8"
              >
                <Bike className="text-orange-400" size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Logística Inteligente</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none"
              >
                Guepardo: <br/><span className="text-orange-400 italic">Coleta já chegou.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-teal-50 text-xl leading-relaxed mb-12 opacity-90 max-w-xl"
              >
                Não perca tempo saindo de casa. A Coleta Já leva a mais alta tecnologia diagnóstica até o seu sofá em João Pessoa e região metropolitana.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/agendamento" className="bg-orange-500 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-orange-500/30 hover:bg-orange-600 hover:scale-105 transition-all text-center">
                  Chamar um Guepardo
                </Link>
                <a href="https://wa.me/558330221000" className="bg-white text-teal-600 px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 hover:scale-105 transition-all text-center">
                  Dúvidas no WhatsApp
                </a>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:w-1/2 w-full flex justify-center"
            >
              <div className="relative group w-full max-w-sm">
                <div className="absolute -inset-4 bg-orange-500/20 rounded-[60px] blur-3xl group-hover:bg-orange-500/40 transition-all"></div>
                <video 
                  className="relative w-full rounded-[50px] shadow-2xl border-8 border-white/10 object-cover aspect-[9/16]"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
                >
                  <source src="/coleta_ja.mp4" type="video/mp4" />
                  Seu navegador não suporta a tag de vídeo.
                </video>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Coverage Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Área de Atuação</h2>
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Onde o Guepardo atende?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[48px] border border-teal-50 shadow-xl shadow-teal-900/5 text-center">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">8 Unidades Smart</h4>
              <p className="text-sm text-gray-500 font-medium">Miramar, Bessa, Mangabeira, Manaíra, Tambaú, Bancários, Altiplano e Valentina.</p>
            </div>
            <div className="bg-white p-10 rounded-[48px] border border-teal-50 shadow-xl shadow-teal-900/5 text-center">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">4 Pontos Logísticos</h4>
              <p className="text-sm text-gray-500 font-medium">Rodoviária, Aeroporto, Manaíra Shopping e Mangabeira Shopping.</p>
            </div>
            <div className="bg-white p-10 rounded-[48px] border border-teal-50 shadow-xl shadow-teal-900/5 text-center">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">Litoral Paraibano</h4>
              <p className="text-sm text-gray-500 font-medium">Cabedelo, Santa Rita, Bayeux, Conde e Lucena.</p>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="mb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-6 sm:p-10 rounded-3xl sm:rounded-[40px] border border-transparent hover:border-teal-100 transition-all group"
            >
              <div className="mb-6 sm:mb-8 transform group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h4 className="text-lg sm:text-xl font-black text-gray-900 mb-4">{benefit.title}</h4>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">{benefit.description}</p>
            </motion.div>
          ))}
        </section>

        {/* How it Works */}
        <section className="mb-32 bg-gray-900 rounded-[60px] p-12 md:p-20 relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
          <h2 className="text-4xl font-black text-white mb-16 tracking-tighter uppercase relative z-10">Fluxo de Atendimento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div key={step.num} className="relative group">
                <div className="text-5xl font-black text-white/5 mb-4 group-hover:text-orange-500/20 transition-colors">{step.num}</div>
                <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight">{step.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 translate-x-1/2 text-white/10">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Preparation CTA */}
        <section className="bg-white rounded-[60px] p-12 md:p-20 shadow-2xl shadow-teal-900/5 border border-teal-50 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-2/3">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-8">
              <ClipboardCheck size={24} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Preparado para a coleta?</h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              Mesmo em casa, as orientações de preparo são as mesmas. Verifique o jejum e os cuidados necessários para o seu exame em nosso Guia de Preparo.
            </p>
          </div>
          <Link to="/preparo" className="bg-teal-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 hover:bg-teal-700 hover:scale-105 transition-all whitespace-nowrap">
            Ver Guia de Preparo
          </Link>
        </section>

        {/* Final CTA */}
        <section className="mt-32 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tighter uppercase">Agende agora sua visita</h2>
          <p className="text-gray-500 text-lg font-medium mb-12">
            Disponível de Segunda a Sábado. Clique abaixo e inicie seu agendamento em menos de 2 minutos.
          </p>
          <Link to="/agendamento" className="inline-flex items-center gap-4 bg-orange-accent text-white px-16 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-orange-500/30 hover:bg-orange-600 hover:scale-105 transition-all">
            Chamar um Guepardo Já <ArrowRight size={20} />
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Guepardo;
