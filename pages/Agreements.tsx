
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartPulse, Building2, MapPin, Phone, HelpCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const Agreements: React.FC = () => {
  const insurances = [
    { name: 'Unimed', type: 'Saúde', description: 'Atendimento para planos nacionais e regionais.' },
    { name: 'Cassi', type: 'Saúde', description: 'Convênio com a Caixa de Assistência dos Funcionários do Banco do Brasil.' },
    { name: 'Bradesco Saúde', type: 'Saúde', description: 'Rede credenciada para exames laboratoriais.' },
    { name: 'SulAmérica', type: 'Saúde', description: 'Cobertura completa para diagnósticos.' },
    { name: 'GEAP', type: 'Saúde', description: 'Autogestão em saúde para servidores públicos.' },
    { name: 'Amil', type: 'Saúde', description: 'Rede credenciada de alta tecnologia.' },
  ];

  const funeraryPlans = [
    { name: 'Plano Pax Domini', city: 'João Pessoa', info: 'Descontos exclusivos em toda a rede da capital.' },
    { name: 'Plano São Vicente', city: 'Uiraúna', info: 'Parceria de longa data para associados.' },
    { name: 'Plano Memorial', city: 'Sousa', info: 'Condições especiais em exames de rotina.' },
  ];

  const cityHalls = [
    { name: 'Prefeitura de João Pessoa', state: 'PB', icon: '🏛️' },
    { name: 'Prefeitura de Uiraúna', state: 'PB', icon: '🏛️' },
    { name: 'Prefeitura de Sousa', state: 'PB', icon: '🏛️' },
    { name: 'Prefeitura de Cajazeiras', state: 'PB', icon: '🏛️' },
    { name: 'Prefeitura de Pau dos Ferros', state: 'RN', icon: '🏛️' },
  ];

  return (
    <div className="pt-32 pb-24 bg-[#fcfdfd] min-h-screen">
      <SEO 
        title="Convênios e Parcerias" 
        description="Confira a lista completa de convênios aceitos pela Coleta Já. Unimed, Cassi, planos funerários e parcerias com prefeituras."
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <header className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-4 block"
          >
            Facilidade no Acesso à Saúde
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase"
          >
            Convênios e <br/><span className="text-teal-600">Parcerias</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Trabalhamos com uma ampla rede de convênios para garantir que você tenha acesso aos melhores diagnósticos com o melhor custo-benefício.
          </motion.p>
        </header>

        {/* Health Insurances */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Planos de Saúde</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Nacionais e Regionais</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insurances.map((ins, idx) => (
              <motion.div 
                key={ins.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[40px] border border-teal-50 shadow-xl shadow-teal-900/5 hover:shadow-2xl hover:border-teal-100 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-gray-50 text-teal-600 rounded-xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-[9px] font-black uppercase text-teal-600 bg-teal-50 px-3 py-1 rounded-full">Ativo</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{ins.name}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{ins.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Funerary Plans */}
        <section className="mb-24 bg-gray-900 rounded-[60px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <div className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                <HeartPulse className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Planos <br/><span className="text-orange-500">Funerários</span></h2>
              <p className="text-gray-400 font-medium leading-relaxed">
                Temos parcerias sólidas com os principais planos funerários da região, oferecendo descontos especiais em exames de rotina e check-ups para todos os associados e dependentes.
              </p>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {funeraryPlans.map((plan) => (
                <div key={plan.name} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[40px] hover:bg-white/10 transition-colors">
                  <h4 className="text-lg font-black text-white mb-1 uppercase tracking-tight">{plan.name}</h4>
                  <p className="text-teal-400 text-[10px] font-black uppercase tracking-widest mb-4">{plan.city}</p>
                  <p className="text-gray-400 text-sm font-medium">{plan.info}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local City Halls */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Prefeituras Locais</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Atendimento via SUS e Parcerias Diretas</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {cityHalls.map((city) => (
              <div key={city.name} className="bg-gray-50 border border-transparent hover:border-orange-200 p-8 rounded-[40px] text-center transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{city.icon}</div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest leading-tight">{city.name}</h4>
                <p className="text-[10px] font-black text-orange-500 mt-1">{city.state}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-8 bg-teal-50 rounded-[40px] border border-teal-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-white text-teal-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <MapPin size={20} />
              </div>
              <p className="text-sm font-bold text-teal-800 max-w-xl">
                Realizamos coletas via prefeituras através de agendamento prévio nas Secretarias de Saúde. Consulte a disponibilidade na sua cidade.
              </p>
            </div>
            <Link to="/unidades" className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center gap-2">
              Ver Unidades Próximas <ChevronRight size={14} />
            </Link>
          </div>
        </section>

        {/* Help / Contact */}
        <section className="bg-white rounded-[60px] p-12 md:p-16 border border-teal-50 shadow-2xl shadow-teal-900/5 text-center">
          <div className="w-16 h-16 bg-gray-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <HelpCircle size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Não encontrou seu convênio?</h2>
          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto mb-12">
            Nossa lista de parceiros está em constante expansão. Se o seu plano não está listado aqui, entre em contato para verificar se já estamos credenciados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/558335340000" className="bg-teal-600 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-2">
              <Phone size={16} /> Consultar via WhatsApp
            </a>
            <Link to="/agendamento" className="bg-white border-2 border-teal-600 text-teal-600 px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-teal-50 transition-all">
              Agendar Particular
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Agreements;
