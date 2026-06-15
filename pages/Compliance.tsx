
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Scale, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Gavel,
  Eye,
  Search,
  Users,
  Phone,
  X,
  Mail
} from 'lucide-react';
import SEO from '../components/SEO';

interface Policy {
  title: string;
  content: string;
  icon: React.ReactNode;
}

const policies: Record<string, Policy> = {
  'Código de Conduta': {
    title: 'Código de Conduta',
    icon: <Gavel />,
    content: 'Nosso Código de Conduta estabelece os comportamentos esperados de todos os colaboradores e parceiros da Coleta Já. Focamos em transparência, respeito ao paciente e integridade científica. Ele serve como o alicerce moral para todas as nossas decisões, garantindo um ambiente de trabalho justo e um atendimento humanizado e ético a cada pessoa que confia em nossos serviços.'
  },
  'Manual Anticorrupção': {
    title: 'Manual Anticorrupção',
    icon: <ShieldCheck />,
    content: 'Contém diretrizes rigorosas para prevenir qualquer ato de corrupção ou suborno em nossas operações. Na Coleta Já, a saúde é a prioridade máxima e inegociável. Proibimos estritamente qualquer forma de vantagem indevida em interações com órgãos públicos ou entes privados, mantendo registros financeiros precisos e auditorias independentes periódicas.'
  },
  'Políticas de Brindes': {
    title: 'Políticas de Brindes',
    icon: <Users />,
    content: 'Determina regras claras sobre o recebimento e oferta de brindes e hospitalidade. O objetivo é evitar qualquer conflito de interesse que possa comprometer a imparcialidade diagnóstica ou a integridade das nossas parcerias. Valorizamos relações profissionais baseadas na competência técnica e na qualidade do serviço, e não em trocas de favores ou benefícios materiais.'
  },
  'Termos de Uso Site': {
    title: 'Termos de Uso Site',
    icon: <Search />,
    content: 'Define as condições de navegação e utilização dos serviços digitais da Coleta Já. Protegemos tanto o usuário quanto a empresa no ambiente virtual, estabelecendo limites de responsabilidade, regras de propriedade intelectual e diretrizes para o uso correto das ferramentas de agendamento e consulta de resultados online.'
  }
};

const Compliance: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  const handleContactDPO = () => {
    window.location.href = 'mailto:dpo@coletaja.com.br?subject=Contato%20DPO%20-%20Coleta%20J%C3%A1&body=Ol%C3%A1%2C%20gostaria%20de%20esclarecer%20d%C3%BAvidas%20sobre%20meus%20dados%20pessoais.';
  };

  return (
    <div className="pt-32 pb-24 bg-[#fcfdfd] min-h-screen">
      <SEO 
        title="Compliance & Ética" 
        description="Nossos compromissos com a ética, qualidade diagnóstica e proteção de dados (LGPD) na Coleta Já."
      />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <header className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-teal-600 text-white rounded-[28px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-teal-500/30"
          >
            <ShieldCheck size={40} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter uppercase"
          >
            Integridade <br/><span className="text-teal-600">& Transparência</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            A Coleta Já pauta suas atividades pelos mais rigorosos padrões de conformidade técnica e ética. Conheça nossos pilares de integridade.
          </motion.p>
        </header>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
          <ComplianceCard 
            icon={<Lock />} 
            title="LGPD" 
            desc="Segurança total no tratamento de dados sensíveis de saúde, garantindo a privacidade e o controle pelo paciente." 
          />
          <ComplianceCard 
            icon={<Scale />} 
            title="Ética & Conduta" 
            desc="Código de conduta rigoroso que guia todas as nossas interações com pacientes, fornecedores e parceiros." 
          />
          <ComplianceCard 
            icon={<CheckCircle2 />} 
            title="Qualidade PNCQ" 
            desc="Certificação de excelência em todos os processos analíticos através do Programa Nacional de Controle de Qualidade." 
          />
        </div>

        {/* Detailed Sections */}
        <div className="space-y-16">
          
          {/* LGPD Section */}
          <section className="bg-white rounded-[60px] p-12 md:p-20 shadow-2xl shadow-teal-900/5 border border-teal-50 flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shadow-inner"><Lock size={24}/></div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Proteção de Dados</h2>
               </div>
               <p className="text-gray-500 font-medium leading-relaxed mb-8">
                 Implementamos tecnologias de criptografia de ponta e fluxos de acesso restrito para assegurar que cada informação clínica seja tratada com o máximo sigilo, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
               </p>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-xs font-black text-gray-800 uppercase tracking-widest">
                     <CheckCircle2 className="text-teal-600" size={18} /> Anonimização de amostras
                  </li>
                  <li className="flex items-center gap-3 text-xs font-black text-gray-800 uppercase tracking-widest">
                     <CheckCircle2 className="text-teal-600" size={18} /> Auditoria constante de acessos
                  </li>
                  <li className="flex items-center gap-3 text-xs font-black text-gray-800 uppercase tracking-widest">
                     <CheckCircle2 className="text-teal-600" size={18} /> Direitos do titular preservados
                  </li>
               </ul>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="bg-teal-900 rounded-[48px] p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                  <Eye className="text-teal-500/30 mb-8" size={64} />
                  <h4 className="text-xl font-black mb-4">Central de Privacidade</h4>
                  <p className="text-teal-100/70 text-sm mb-8">Deseja exercer seus direitos como titular de dados ou esclarecer dúvidas sobre sua privacidade?</p>
                  <button 
                    onClick={handleContactDPO}
                    className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail size={14} /> Contatar DPO
                  </button>
               </div>
            </div>
          </section>

          {/* Ethics Channel */}
          <section className="bg-slate-900 rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter uppercase leading-none">Canal de <br/><span className="text-teal-500">Denúncias</span></h2>
                  <p className="text-slate-400 font-medium leading-relaxed mb-10">
                    A Coleta Já disponibiliza um canal seguro e anônimo para o relato de condutas que violem nosso Código de Ética ou a legislação vigente. Todas as manifestações são tratadas com total sigilo pela nossa equipe de Compliance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                     <div className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10">
                        <Phone className="text-teal-500" />
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Linha Ética</p>
                           <p className="text-lg font-black uppercase">0800 000 000</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10">
                        <FileText className="text-teal-500" />
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Portal Online</p>
                           <p className="text-lg font-black uppercase">Denúncia Web</p>
                        </div>
                     </div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[48px] space-y-8">
                   <div className="flex gap-5">
                      <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center shrink-0"><ShieldCheck size={24}/></div>
                      <div>
                         <h4 className="font-bold text-white mb-1">Anonimato Garantido</h4>
                         <p className="text-xs text-slate-400 leading-relaxed">Sua identidade nunca será revelada sem seu consentimento expresso.</p>
                      </div>
                   </div>
                   <div className="flex gap-5">
                      <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shrink-0"><AlertCircle size={24}/></div>
                      <div>
                         <h4 className="font-bold text-white mb-1">Não Retaliação</h4>
                         <p className="text-xs text-slate-400 leading-relaxed text-balance">Protegemos o denunciante de boa-fé contra qualquer forma de perseguição.</p>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* Documents Section */}
          <section className="text-center">
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-12">Políticas de Gestão</h2>
             
             <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
                <div className="lg:w-1/2 rounded-[40px] overflow-hidden shadow-2xl shadow-teal-900/10 border border-teal-50 group">
                   <img 
                      src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200" 
                      alt="Compliance and Integrity"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                   />
                </div>
                <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                   {Object.keys(policies).map((title) => (
                     <PolicyDoc 
                       key={title} 
                       title={title} 
                       onClick={() => setSelectedPolicy(policies[title])}
                     />
                   ))}
                </div>
             </div>
          </section>

        </div>
      </div>

      {/* Policy Modal */}
      <AnimatePresence>
        {selectedPolicy && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] max-w-2xl w-full p-10 md:p-14 relative shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <button 
                onClick={() => setSelectedPolicy(null)}
                className="absolute top-8 right-8 p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center shadow-inner">
                  {React.cloneElement(selectedPolicy.icon as React.ReactElement<any>, { size: 32 })}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{selectedPolicy.title}</h3>
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-1">Política de Gestão Coleta Já</p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-gray-600 font-medium leading-relaxed text-lg">
                  {selectedPolicy.content}
                </p>
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <ShieldCheck size={20} className="text-teal-600" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Este documento é revisado anualmente pelo comitê de Compliance da Coleta Já para garantir a aderência às melhores práticas de governança corporativa e legislação vigente.
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <button 
                  onClick={() => setSelectedPolicy(null)}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-teal-600 transition-all"
                >
                  Entendi, fechar política
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ComplianceCard: React.FC<{icon: React.ReactNode; title: string; desc: string}> = ({icon, title, desc}) => (
  <div className="bg-white p-10 rounded-[48px] border border-gray-50 shadow-xl shadow-teal-900/5 hover:shadow-2xl hover:scale-[1.02] transition-all group">
     <div className="w-16 h-16 bg-gray-50 text-teal-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-teal-600 group-hover:text-white transition-colors">
        {React.cloneElement(icon as React.ReactElement<any>, {size: 32})}
     </div>
     <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tighter">{title}</h3>
     <p className="text-gray-500 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

const PolicyDoc: React.FC<{title: string; onClick: () => void}> = ({title, onClick}) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 hover:border-teal-600 transition-all group shadow-sm hover:shadow-xl"
  >
     <div className="flex items-center gap-4 text-left">
        <div className="p-2 bg-teal-50 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-all">
           <FileText size={20} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-gray-900">{title}</span>
     </div>
     <Search size={16} className="text-gray-200 group-hover:text-teal-600" />
  </button>
);

export default Compliance;
