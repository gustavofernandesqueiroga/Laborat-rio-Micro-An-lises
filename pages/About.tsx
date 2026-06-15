
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Microscope, ShieldCheck, HeartPulse, Building2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const About: React.FC = () => {
  const team = [
    { name: 'Dr. Marcos Aurélio', role: 'Diretor Técnico & Bioquímico', bio: 'Especialista em Análises Clínicas com mais de 25 anos de experiência.' },
    { name: 'Dr. Flavio Félix', role: 'Responsável Técnica', bio: 'Especialista em Hematologia e Citologia Clínica com foco em inovação laboratorial.' },
    { name: 'Gustavo Queiroga', role: 'CEO & Estrategista', bio: 'Liderando a transformação digital e expansão da Coleta Já.' },
  ];

  const values = [
    { icon: <Zap className="text-orange-500" />, title: 'Velocidade', desc: 'Resultados em tempo recorde com o Selo Jajá 24h.' },
    { icon: <Microscope className="text-teal-600" />, title: 'Tecnologia', desc: 'Equipamentos de última geração e automação laboratorial.' },
    { icon: <ShieldCheck className="text-teal-600" />, title: 'Precisão', desc: 'Rigor técnico garantido pelo controle de qualidade DB Diagnósticos.' },
    { icon: <HeartPulse className="text-orange-500" />, title: 'Cuidado', desc: 'Atendimento humanizado e especializado, incluindo suporte TEA.' },
  ];

  return (
    <div className="pt-32 pb-24 bg-[#fcfdfd] min-h-screen">
      <SEO 
        title="Sobre a Coleta Já - Rede de Diagnóstico" 
        description="Conheça a Coleta Já, uma rede de postos de coleta com unidades smarts e pontos logísticos focada em revolucionar o diagnóstico laboratorial, médico e veterinário na Paraíba."
        keywords="Coleta Já história, diagnóstico veterinário Paraíba, infraestrutura laboratorial João Pessoa, unidades smart, pontos logísticos, guepardos"
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="mb-24 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-4 block"
          >
            Nossa História e Missão
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter uppercase"
          >
            Revolucionando o <br/><span className="text-teal-600">Diagnóstico Integral</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            A Coleta Já é uma rede de postos de coleta moderna e ágil, composta por unidades smarts e pontos logísticos estrategicamente distribuídos. Nossa missão é transformar a saúde na Paraíba através de diagnósticos laboratoriais, médicos e veterinários de precisão absoluta, apoiados pela nossa elite de coletores: os Guepardos.
          </motion.p>
        </section>

        {/* Infrastructure & Equipment */}
        <section className="mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video rounded-[60px] overflow-hidden shadow-2xl shadow-teal-900/10 border-8 border-white">
              <img 
                src="https://picsum.photos/seed/lab-tech/1200/800" 
                alt="Infraestrutura Moderna" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[40px] shadow-2xl border border-teal-50 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900">25+ Anos</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">De Experiência</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Nossa <span className="text-teal-600">Infraestrutura</span></h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              A Coleta Já opera através de um modelo inovador de unidades smarts — espaços compactos, tecnológicos e eficientes — integrados a pontos logísticos que garantem a agilidade no transporte de amostras. Nossa frota refrigerada e os coletores Guepardos formam a espinha dorsal de uma rede que prioriza a velocidade e a precisão.
            </p>
            <ul className="space-y-4">
              {[
                'Diagnóstico Laboratorial, Médico e Veterinário',
                'Rede de Unidades Smarts e Pontos Logísticos',
                'Elite de Coletores Guepardos para atendimento ágil',
                'Logística própria com frota refrigerada',
                'Gestão focada em excelência e precisão técnica'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm font-bold text-gray-700">
                  <div className="mt-1 w-5 h-5 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck size={12} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* Values Grid */}
        <section className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {values.map((val, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-teal-50 shadow-xl shadow-teal-900/5 text-center hover:shadow-2xl transition-all"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  {val.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">{val.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Coleta Já Ecosystem */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Diferenciais <span className="text-teal-600">Coleta Já</span></h2>
            <p className="text-gray-500 font-medium max-w-3xl mx-auto">
              Nossa rede é construída sobre pilares de tecnologia e logística avançada, garantindo que cada paciente receba um atendimento de elite.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { title: 'Unidades Smarts', desc: 'Postos de coleta compactos e altamente tecnológicos.' },
              { title: 'Pontos Logísticos', desc: 'Centros estratégicos para triagem e transporte ágil.' },
              { title: 'Guepardos', desc: 'Nossa elite de coletores treinados para agilidade e precisão.' },
              { title: 'Frota Refrigerada', desc: 'Garantia da integridade total do material biológico.' },
              { title: 'Diagnóstico Veterinário', desc: 'Soluções completas para a saúde animal.' },
              { title: 'Tecnologia WorkLab', desc: 'Sistemas de ponta para gestão laboratorial.' },
              { title: 'Selo Jajá 24h', desc: 'Compromisso com a entrega de resultados em tempo recorde.' },
              { title: 'Atendimento Humanizado', desc: 'Foco no cuidado e suporte especializado, incluindo TEA.' },
            ].map((sector, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-teal-50 shadow-sm hover:shadow-md transition-all">
                <h4 className="text-xs font-black uppercase text-teal-600 mb-2">{sector.title}</h4>
                <p className="text-[10px] text-gray-500 font-bold leading-tight">{sector.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Nossa Equipe <span className="text-orange-500">Especializada</span></h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              Contamos com profissionais altamente qualificados, em constante atualização científica para oferecer o melhor suporte diagnóstico.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[60px] overflow-hidden border border-teal-50 shadow-2xl shadow-teal-900/5 group"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img 
                    src={`https://picsum.photos/seed/doc-${idx}/600/800`} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <h4 className="text-xl font-black uppercase tracking-tight">{member.name}</h4>
                    <p className="text-teal-400 text-[10px] font-black uppercase tracking-widest">{member.role}</p>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                    "{member.bio}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-teal-600 rounded-[60px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-teal-900/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <Building2 size={48} className="mx-auto mb-8 opacity-50" />
            <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Pronto para cuidar da sua saúde?</h2>
            <p className="text-teal-100 text-lg font-medium max-w-2xl mx-auto mb-12">
              Visite uma de nossas unidades ou agende sua coleta domiciliar com a velocidade de um guepardo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/agendamento" className="bg-white text-teal-600 px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-teal-50 transition-all">
                Agendar Agora
              </Link>
              <Link to="/unidades" className="bg-teal-700 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs border border-teal-500 hover:bg-teal-800 transition-all">
                Ver Unidades
              </Link>
              <Link to="/resultados" className="bg-white/10 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs border border-white/20 hover:bg-white/20 transition-all">
                Resultados
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
