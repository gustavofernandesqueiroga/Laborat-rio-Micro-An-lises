
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EXAM_PREPS } from '../constants';
import SEO from '../components/SEO';
import { Search, ClipboardCheck, Clock, AlertCircle } from 'lucide-react';

const Preparation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPreps = EXAM_PREPS.filter(p => 
    p.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <SEO 
        title="Preparo para Exames Laboratoriais" 
        description="Saiba como se preparar corretamente para seus exames laboratoriais na Coleta Já. Orientações sobre jejum, coleta e medicamentos."
        keywords="preparo exames laboratório, jejum exame sangue João Pessoa, instruções coleta laboratório, guia preparo exames PB"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <span className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-4 block">Orientações aos Pacientes</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Guia de Preparo</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            A precisão do seu resultado começa com o preparo adequado. Siga atentamente as instruções abaixo para garantir a qualidade do diagnóstico.
          </p>
        </header>

        {/* Search Bar */}
        <section className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-600 transition-transform group-focus-within:scale-110">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar por nome ou código do exame (Ex: P1)..." 
              className="w-full pl-16 pr-6 py-5 rounded-[2.5rem] bg-white border border-transparent shadow-2xl shadow-teal-900/5 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* Exam Prep List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPreps.length > 0 ? (
            filteredPreps.map(prep => (
              <article key={prep.id} className="bg-white rounded-[40px] p-8 shadow-xl shadow-teal-900/5 border border-teal-50 hover:shadow-2xl transition-all duration-500 flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shadow-inner">
                    <ClipboardCheck size={28} />
                  </div>
                  <span className="px-4 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                    Cód: {prep.id}
                  </span>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-4 leading-tight">{prep.exam}</h3>
                
                {prep.fasting && (
                  <div className="flex items-center gap-3 mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100/50">
                    <Clock size={18} className="text-orange-500 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black uppercase text-orange-400 leading-none mb-1">Jejum Recomendado</p>
                      <p className="text-sm font-bold text-orange-700">{prep.fasting}</p>
                    </div>
                  </div>
                )}

                <div className="flex-grow">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest flex items-center">
                    <AlertCircle size={14} className="mr-2" /> Instruções Obrigatórias
                  </h4>
                  <ul className="space-y-3">
                    {prep.instructions.map((inst, i) => (
                      <li key={i} className="flex items-start text-xs font-bold text-gray-600 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-3 mt-1.5 shrink-0" />
                        {inst}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50">
                  <a 
                    href={`https://wa.me/558335340000?text=Desejo saber mais sobre o preparo do exame ${prep.exam} (Cód: ${prep.id})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-600 hover:text-orange-500 transition-colors"
                  >
                    Dúvida sobre este preparo?
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-white rounded-[60px] border-2 border-dashed border-teal-50">
              <div className="text-4xl mb-6">🔍</div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Nenhuma instrução encontrada.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-teal-600 font-black uppercase text-xs border-b-2 border-teal-600 pb-1"
              >
                Ver todos os preparos
              </button>
            </div>
          )}
        </div>

        {/* Info Box */}
        <section className="mt-20 bg-teal-600 rounded-[50px] p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Não encontrou seu exame?</h3>
              <p className="text-teal-50 text-lg opacity-90 font-medium">
                Alguns exames específicos podem exigir preparos personalizados ou coleta em horários restritos. Entre em contato com nossa central para orientações detalhadas.
              </p>
            </div>
            <a 
              href="tel:8335340000"
              className="bg-white text-teal-600 px-12 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-2xl shadow-black/10"
            >
              Ligar para Central
            </a>
          </div>
        </section>

        {/* Results Consultation Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-4">Já realizou seus exames?</p>
          <Link to="/resultados" className="text-teal-600 font-black uppercase tracking-widest text-xs border-b-2 border-teal-600 pb-1 hover:text-orange-500 hover:border-orange-500 transition-all">
            Consultar Resultados Online
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Preparation;
