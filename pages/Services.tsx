
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, CHECKUPS } from '../constants';
import SEO from '../components/SEO';
import { Zap } from 'lucide-react';

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = SERVICES.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCheckups = CHECKUPS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.exams.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <SEO 
        title="Exames e Check-ups" 
        description="Confira o catálogo completo de exames da Coleta Já no Sertão Paraibano. Hemograma, exames hormonais, check-ups completos e diagnósticos veterinários."
        keywords="exames laboratoriais João Pessoa, check-up de saúde JP, preço exames sangue, laboratório de análises clínicas PB"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-teal-600 mb-4 uppercase tracking-tighter">Exames Laboratoriais e Check-ups</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Explore nossa lista completa de exames laboratoriais em João Pessoa com tecnologia avançada.
          </p>
        </header>

        {/* Search */}
        <section className="mb-12" aria-labelledby="search-heading">
          <h2 id="search-heading" className="sr-only">Buscar Exames</h2>
          <div className="relative max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Buscar por nome, código, categoria ou descrição..." 
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-gray-100 shadow-2xl shadow-teal-900/5 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Campo de busca para exames"
            />
            <svg className="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </section>

        {/* Checkups */}
        <section className="mb-16">
          <h2 className="text-2xl font-black mb-8 flex items-center text-gray-900 uppercase tracking-widest text-sm">
            <span className="w-2 h-8 bg-orange-500 mr-4 rounded-full"></span>
            Check-ups de Saúde Preventiva
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCheckups.map(check => (
              <article key={check.id} className="bg-white p-8 rounded-[40px] shadow-xl shadow-teal-900/5 border border-teal-50 hover:shadow-2xl transition-all duration-500">
                <div className="text-[10px] font-black uppercase text-orange-500 mb-2 tracking-widest">Código: {check.id}</div>
                <h3 className="text-xl font-black text-gray-900 mb-4">{check.name}</h3>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">{check.description}</p>
                <div className="space-y-3 mb-10">
                  {check.exams.map((exam, idx) => (
                    <div key={idx} className="flex items-center text-gray-700 text-xs font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-3"></div>
                      {exam}
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 bg-teal-600 text-white font-black rounded-2xl hover:bg-teal-700 transition shadow-lg shadow-teal-500/20 uppercase tracking-widest text-[10px]">
                  Solicitar Orçamento
                </button>
              </article>
            ))}
          </div>
          {filteredCheckups.length === 0 && searchTerm.length > 0 && (
            <div className="py-10 text-center">
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Nenhum check-up encontrado para sua busca.</p>
            </div>
          )}
        </section>

        {/* Price Table Section */}
        <section className="mb-24">
          <h2 className="text-2xl font-black mb-8 flex items-center text-gray-900 uppercase tracking-widest text-sm">
            <span className="w-2 h-8 bg-teal-600 mr-4 rounded-full"></span>
            Tabela de Preços Transparente
          </h2>
          <div className="bg-white rounded-[40px] shadow-2xl shadow-teal-900/5 border border-teal-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Exame</th>
                    <th className="px-8 py-5">Categoria</th>
                    <th className="px-8 py-5">Preço</th>
                    <th className="px-8 py-5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredServices.map(service => (
                    <tr key={service.id} className="hover:bg-teal-50/30 transition group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-gray-900 text-sm uppercase tracking-tight">{service.name}</span>
                            {service.isJaja24h && (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                                <Zap size={8} fill="currentColor" />
                                Jajá 24h
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Cód: {service.id}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-white border border-teal-100 text-teal-600 text-[10px] font-black uppercase rounded-full shadow-sm">
                          {service.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-teal-600 text-sm">
                        {service.price || 'Sob Consulta'}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          to="/agendamento" 
                          state={{ serviceId: service.id }}
                          className="inline-flex items-center justify-center px-6 py-2.5 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-500/10"
                        >
                          Agendar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredServices.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Nenhum exame encontrado para sua busca.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Specialties & Technology */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div className="bg-gray-900 rounded-[60px] p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"></div>
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Especialidades <span className="text-teal-400">Atendidas</span></h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                'Hematologia', 'Bioquímica', 'Imunologia', 'Hormônios',
                'Microbiologia', 'Parasitologia', 'Urinálise', 'Toxicologia',
                'Biologia Molecular', 'Genética', 'Citologia', 'Anatomia Patológica'
              ].map((spec, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                  {spec}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[60px] p-12 border border-teal-50 shadow-2xl shadow-teal-900/5">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Tecnologia <span className="text-orange-500">Exclusiva</span></h2>
            <div className="space-y-6">
              {[
                { title: 'Automação Roche & Siemens', desc: 'Sistemas robotizados que eliminam o erro humano e garantem precisão absoluta.' },
                { title: 'Interfaceamento em Tempo Real', desc: 'Resultados enviados diretamente dos equipamentos para o portal do paciente.' },
                { title: 'Rastreabilidade por RFID/Barcode', desc: 'Cada tubo é monitorado desde a coleta até o descarte seguro.' },
                { title: 'Selo Jajá 24h', desc: 'Logística inteligente que permite a entrega de resultados de rotina em até 24 horas.' }
              ].map((tech, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{tech.title}</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results Banner */}
        <section className="mb-24">
          <div className="bg-teal-600 rounded-[50px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Já realizou seus exames?</h2>
              <p className="text-teal-50 text-lg font-medium opacity-90 max-w-xl">
                Consulte seus laudos online com total segurança. Basta ter em mãos o seu protocolo e senha de acesso.
              </p>
            </div>
            <Link 
              to="/resultados"
              className="relative z-10 bg-white text-teal-600 px-12 py-5 rounded-3xl font-black uppercase tracking-widest whitespace-nowrap hover:bg-orange-500 hover:text-white transition-all shadow-xl"
            >
              Consultar Resultados
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
