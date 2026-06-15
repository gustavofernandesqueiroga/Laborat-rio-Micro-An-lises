
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Target, 
  HeartPulse, 
  Send, 
  Briefcase, 
  Stethoscope, 
  Bike, 
  CheckCircle2, 
  Mail, 
  Linkedin, 
  ArrowRight, 
  FileText, 
  Clock, 
  Upload, 
  X, 
  Phone, 
  MessageSquare, 
  Star,
  FileCheck,
  Loader2,
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react';
import SEO from '../components/SEO';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group focus:outline-none"
      >
        <span className={`text-sm md:text-base font-black uppercase tracking-tight transition-colors ${isOpen ? 'text-teal-600' : 'text-gray-900 group-hover:text-teal-600'}`}>
          {question}
        </span>
        <div className={`shrink-0 ml-4 p-2 rounded-xl transition-all ${isOpen ? 'bg-teal-600 text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600'}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-sm md:text-base text-gray-500 font-medium leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WorkWithUs: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    linkedin: '',
    message: ''
  });

  const areas = [
    { id: 'bio', name: 'Biomedicina & Farmácia', icon: <Stethoscope size={20} />, description: 'Atuação técnica em hematologia, bioquímica e microbiologia.' },
    { id: 'enf', name: 'Enfermagem & Coleta', icon: <HeartPulse size={20} />, description: 'Atendimento direto ao paciente e procedimentos de coleta.' },
    { id: 'adm', name: 'Administrativo & Recepção', icon: <Briefcase size={20} />, description: 'Gestão de atendimento, faturamento e suporte ao paciente.' },
    { id: 'log', name: 'Logística (Guepardo)', icon: <Bike size={20} />, description: 'Transporte climatizado e ágil de amostras biológicas.' }
  ];

  const faqs = [
    {
      question: "Como funciona o processo seletivo?",
      answer: "Nosso processo inicia com a triagem de currículos. Caso seu perfil seja compatível com nossas vagas abertas, entraremos em contato para uma entrevista inicial (online ou presencial). As etapas finais incluem teste técnico específico para a área e entrevista com a diretoria."
    },
    {
      question: "Quais os principais benefícios oferecidos?",
      answer: "Oferecemos salário compatível com o mercado, auxílio transporte ou ticket combustível, plano de saúde co-participativo, descontos em exames para familiares diretos e programas de treinamento contínuo via tecnologia WorkLab."
    },
    {
      question: "É necessário ter experiência prévia em laboratório?",
      answer: "Para cargos técnicos (Biomedicina e Coleta), a experiência é desejável, mas temos programas de trainee para recém-formados. Para as áreas administrativa e logística, valorizamos principalmente a proatividade e a facilidade com tecnologia."
    },
    {
      question: "O laboratório oferece treinamentos técnicos?",
      answer: "Sim! Todos os novos colaboradores passam por uma imersão nos sistemas WorkLab e protocolos de qualidade Guepardo. Além disso, incentivamos a participação em congressos e cursos de especialização."
    },
    {
      question: "Como serei avisado sobre o status da minha candidatura?",
      answer: "Mantemos nosso banco de talentos ativo por 6 meses. Se você for selecionado para uma entrevista, entraremos em contato via WhatsApp ou E-mail. Caso não receba contato imediato, seu currículo ficará disponível para futuras oportunidades."
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const removeFile = () => {
    setSelectedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio sem Firebase
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  return (
    <div className="pt-32 pb-24 bg-[#fcfdfd] min-h-screen">
      <SEO 
        title="Trabalhe Conosco" 
        description="Junte-se ao time da Coleta Já. Buscamos talentos que valorizam a precisão e o cuidado com a vida."
      />

      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <header className="text-center mb-20">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-4 block"
                >
                  Carreira & Oportunidades
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase"
                >
                  Sua carreira, <br/><span className="text-teal-600">nossa excelência</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
                >
                  Buscamos profissionais apaixonados por diagnóstico e pessoas. Na Coleta Já, sua evolução técnica caminha junto com o cuidado humano.
                </motion.p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* Left: Culture & Info */}
                <div className="lg:col-span-5 space-y-12">
                  <section className="space-y-6">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                      <span className="w-8 h-1.5 bg-orange-500 rounded-full"></span>
                      Cultura & Valores
                    </h2>
                    <div className="grid gap-6">
                      <div className="p-8 bg-white rounded-[32px] border border-teal-50 shadow-sm flex gap-6 items-start hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          <Target size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-2">Tecnologia WorkLab</h4>
                          <p className="text-sm text-gray-500 leading-relaxed font-medium">Trabalhamos com os mais altos padrões mundiais em sistemas laboratoriais.</p>
                        </div>
                      </div>
                      <div className="p-8 bg-white rounded-[32px] border border-teal-50 shadow-sm flex gap-6 items-start hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                          <HeartPulse size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-2">Empatia em Primeiro Lugar</h4>
                          <p className="text-sm text-gray-500 leading-relaxed font-medium">Não processamos apenas amostras; cuidamos de histórias e vidas todos os dias.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                      <span className="w-8 h-1.5 bg-teal-600 rounded-full"></span>
                      Selecione sua Área
                    </h2>
                    <div className="grid gap-3" role="radiogroup" aria-label="Selecione a área de atuação">
                      {areas.map(area => (
                        <button 
                          key={area.id}
                          type="button"
                          onClick={() => setFormData({...formData, area: area.name})}
                          className={`group p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-5 ${
                            formData.area === area.name 
                            ? 'bg-teal-600 border-teal-600 text-white shadow-2xl shadow-teal-500/20' 
                            : 'bg-white border-gray-100 hover:border-teal-100 text-gray-700'
                          }`}
                          aria-checked={formData.area === area.name}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                            formData.area === area.name ? 'bg-white/20 text-white' : 'bg-gray-50 text-teal-600 group-hover:bg-teal-50'
                          }`}>
                            {area.icon}
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-black text-xs uppercase tracking-widest leading-none mb-1">{area.name}</h4>
                            <p className={`text-[10px] font-medium leading-tight ${formData.area === area.name ? 'text-teal-100' : 'text-gray-400'}`}>
                              {area.description}
                            </p>
                          </div>
                          <div className={`transition-opacity ${formData.area === area.name ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`}>
                            <CheckCircle2 size={24} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right: The Professional Form */}
                <div className="lg:col-span-7">
                  <section className="bg-white rounded-[50px] p-10 md:p-14 shadow-2xl shadow-teal-900/5 border border-teal-50 relative">
                    <div className="mb-12">
                      <h2 className="text-3xl font-black text-gray-900 mb-2">Envie seu Currículo</h2>
                      <p className="text-gray-500 text-sm font-medium">Preencha os dados abaixo e anexe seu currículo em PDF.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome Completo</label>
                          <input 
                            id="name"
                            required
                            type="text" 
                            placeholder="Ex: Dr. João Silva"
                            className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold text-gray-800"
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-3">
                          <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">WhatsApp de Contato</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600/30" size={20} />
                            <input 
                              id="phone"
                              required
                              type="tel" 
                              placeholder="(83) 99999-9999"
                              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold text-gray-800"
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">E-mail Profissional</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600/30" size={20} />
                            <input 
                              id="email"
                              required
                              type="email" 
                              placeholder="joao@email.com"
                              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold text-gray-800"
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label htmlFor="linkedin" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">LinkedIn (Opcional)</label>
                          <div className="relative">
                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600/30" size={20} />
                            <input 
                              id="linkedin"
                              type="url" 
                              placeholder="linkedin.com/in/perfil"
                              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold text-gray-800"
                              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Fale um pouco sobre você (Opcional)</label>
                        <textarea 
                          id="message"
                          rows={4}
                          placeholder="Conte-nos sobre sua experiência ou por que deseja trabalhar na Coleta Já..."
                          className="w-full px-6 py-5 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold text-gray-800 resize-none"
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        ></textarea>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Currículo em PDF (Obrigatório)</label>
                        {!selectedFileName ? (
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-gray-200 rounded-[32px] p-10 flex flex-col items-center gap-4 hover:border-teal-600 hover:bg-teal-50/50 transition-all group"
                            aria-label="Anexar arquivo PDF"
                          >
                            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-3xl flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-600 group-hover:scale-110 transition-all shadow-inner">
                              <Upload size={32} />
                            </div>
                            <div className="text-center">
                              <p className="text-base font-black text-gray-800 uppercase tracking-tight mb-1">Escolher Arquivo</p>
                              <p className="text-xs font-bold text-gray-400">PDF, DOC ou DOCX até 5MB</p>
                            </div>
                          </button>
                        ) : (
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-teal-50 border-2 border-teal-100 rounded-[32px] p-8 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                                <FileCheck size={28} />
                              </div>
                              <div className="max-w-[180px] md:max-w-xs">
                                <p className="text-sm font-black text-teal-900 truncate">{selectedFileName}</p>
                                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                                  <CheckCircle2 size={12} /> Arquivo Carregado
                                </p>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={removeFile}
                              className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                              title="Remover arquivo"
                            >
                              <X size={24} />
                            </button>
                          </motion.div>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </div>

                      <div className="pt-6">
                        <button 
                          type="submit"
                          disabled={!formData.name || !formData.email || !formData.area || !selectedFileName || isSubmitting}
                          className="w-full bg-teal-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-teal-500/20 hover:bg-teal-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {isSubmitting ? (
                            <>Enviando Candidatura... <Loader2 className="animate-spin" size={20} /></>
                          ) : (
                            <>Enviar Minha Candidatura <Send size={20} /></>
                          )}
                        </button>
                      </div>
                    </form>
                  </section>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success-section"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="max-w-4xl mx-auto py-12"
            >
              <div className="bg-white rounded-[60px] p-12 md:p-16 shadow-2xl shadow-teal-900/10 border border-teal-50 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-teal-600"></div>
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-50 rounded-full blur-3xl opacity-50"></div>
                
                <div className="w-28 h-28 bg-teal-50 text-teal-600 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-inner relative z-10">
                  <MessageSquare size={64} className="animate-bounce" />
                </div>

                <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase leading-tight">
                    Candidatura Enviada! <br/><span className="text-teal-600">Boa Sorte.</span>
                  </h2>
                  
                  <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
                    Agradecemos o seu interesse, <span className="text-gray-900 font-black">{formData.name.split(' ')[0]}</span>. Na Coleta Já, valorizamos cada talento que busca elevar o nível da saúde na nossa região.
                  </p>

                  <div className="bg-teal-50/50 rounded-[48px] p-10 md:p-14 border border-teal-100 mb-14 text-left">
                    <div className="flex items-center gap-4 mb-10">
                       <div className="p-3 bg-white rounded-2xl text-orange-500 shadow-sm">
                         <Star size={24} className="fill-orange-500" />
                       </div>
                       <h3 className="font-black text-xs uppercase tracking-[0.2em] text-teal-900">O que acontece agora?</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                      {/* Decorative Line (Desktop) */}
                      <div className="hidden md:block absolute top-6 left-12 right-12 h-0.5 bg-teal-200 -z-0"></div>

                      <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-black shadow-lg shadow-teal-600/20">1</div>
                        <h4 className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Triagem</h4>
                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">Nosso RH analisa seu perfil técnico e currículo anexado.</p>
                      </div>

                      <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 bg-white text-teal-600 border-2 border-teal-200 rounded-full flex items-center justify-center font-black">2</div>
                        <h4 className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Contato</h4>
                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">Entramos em contato via WhatsApp/E-mail se houver match.</p>
                      </div>

                      <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 bg-white text-teal-600 border-2 border-teal-200 rounded-full flex items-center justify-center font-black">3</div>
                        <h4 className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Entrevista</h4>
                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">Uma conversa com o gestor técnico da área escolhida.</p>
                      </div>

                      <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 bg-white text-teal-600 border-2 border-teal-200 rounded-full flex items-center justify-center font-black">4</div>
                        <h4 className="text-[11px] font-black uppercase text-gray-900 tracking-wider">Admissão</h4>
                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">Você recebe o feedback final e inicia sua jornada conosco.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-14">
                    <div className="flex items-center gap-5 group">
                      <div className="w-14 h-14 bg-gray-50 text-teal-600 rounded-2xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                        <Clock size={28} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tempo Médio</p>
                        <p className="text-sm font-black text-gray-800">5 a 10 dias de análise</p>
                      </div>
                    </div>
                    <div className="w-px h-12 bg-gray-100 hidden md:block"></div>
                    <div className="flex items-center gap-5 group">
                      <div className="w-14 h-14 bg-gray-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                        <Linkedin size={28} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Siga o Lab</p>
                        <p className="text-sm font-black text-gray-800">Cultura no LinkedIn</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <button 
                      onClick={() => window.location.href = '#/'}
                      className="px-14 py-6 bg-teal-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-teal-700 transition-all shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-3"
                    >
                      Voltar para Início <ArrowRight size={16} />
                    </button>
                    <button 
                      onClick={() => { setSubmitted(false); setSelectedFileName(null); }}
                      className="px-14 py-6 bg-white border-2 border-teal-600 text-teal-600 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-teal-50 transition-all"
                    >
                      Enviar Outro Perfil
                    </button>
                  </div>
                </div>

                <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-center gap-3 opacity-60">
                  <Users size={18} className="text-teal-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Coleta Já • Sertão Paraibano - PB</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-32 max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <HelpCircle size={32} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter leading-tight">
              Dúvidas <br/><span className="text-orange-500 text-italic">Frequentes</span>
            </h2>
            <p className="text-gray-500 text-base md:text-lg font-medium">
              Confira as respostas para as principais perguntas sobre nossas oportunidades e ambiente de trabalho.
            </p>
          </div>

          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-teal-900/5 border border-teal-50">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          <div className="mt-16 p-8 bg-orange-50 rounded-[40px] border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-orange-900 uppercase tracking-widest leading-none mb-1">Ainda tem dúvidas?</h4>
                <p className="text-xs text-orange-700 font-medium">Fale diretamente com nosso RH.</p>
              </div>
            </div>
            <a 
              href="mailto:rh@laboratoriomicroanalises.com.br" 
              className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
            >
              Enviar E-mail
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default WorkWithUs;
