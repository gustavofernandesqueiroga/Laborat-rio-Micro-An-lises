
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, Globe, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });
  const [agreeLGPD, setAgreeLGPD] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'E-mail é obrigatório';
    if (!re.test(email)) return 'E-mail inválido';
    return '';
  };

  const validatePhone = (phone: string) => {
    const re = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (!phone) return 'Telefone é obrigatório';
    // Remove non-digits to check length
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) return 'Telefone deve ter 10 ou 11 dígitos';
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    setErrors({ ...errors, email: validateEmail(value) });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, phone: value });
    setErrors({ ...errors, phone: validatePhone(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailErr = validateEmail(formData.email);
    const phoneErr = validatePhone(formData.phone);
    
    if (emailErr || phoneErr) {
      setErrors({ email: emailErr, phone: phoneErr });
      setError('Por favor, corrija os erros no formulário.');
      return;
    }

    if (!agreeLGPD) {
      setError('Você precisa aceitar os termos de privacidade (LGPD) para continuar.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    // Simular envio
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setAgreeLGPD(false);
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    { icon: <Phone className="text-teal-600" />, title: 'Telefone & WhatsApp', value: '(83) 3534-0000', link: 'tel:+558335340000' },
    { icon: <Mail className="text-orange-500" />, title: 'E-mail Oficial', value: 'contato@microanalises.com.br', link: 'mailto:contato@microanalises.com.br' },
    { icon: <MapPin className="text-teal-600" />, title: 'Sede Uiraúna', value: 'Rua Silvestre Claudino, 123, Centro, Uiraúna - PB', link: 'https://maps.google.com/?q=Laboratório+Micro+Análises+Uiraúna' },
  ];

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 bg-[#fcfdfd] min-h-screen">
      <SEO 
        title="Contato - Coleta Já" 
        description="Entre em contato com a Coleta Já. Tire suas dúvidas, solicite orçamentos ou agende seus exames em todo o Sertão Paraibano."
        keywords="telefone laboratório PB, email Coleta Já, endereço laboratório PB, contato exames sangue"
      />

      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-12 sm:mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-500 font-black uppercase tracking-widest text-[9px] sm:text-[10px] mb-3 sm:mb-4 block"
          >
            Estamos aqui para ajudar
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tighter uppercase leading-none"
          >
            Fale <span className="text-teal-600">Conosco</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Escolha o canal de sua preferência. Nossa equipe está pronta para oferecer o melhor suporte diagnóstico.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 mb-20 sm:mb-32">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-12 xl:col-span-7"
          >
            <div className="bg-white p-6 sm:p-10 md:p-14 rounded-[2.5rem] sm:rounded-[60px] shadow-2xl shadow-teal-900/5 border border-teal-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 sm:mb-8 uppercase tracking-tight">Envie uma Mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nome Completo</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 sm:px-6 py-4 rounded-xl sm:rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none transition-all font-bold text-gray-700 text-sm sm:text-base"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">E-mail</label>
                    <div className="relative group">
                      <input 
                        required
                        type="email" 
                        className={`w-full px-5 sm:px-6 py-4 rounded-xl sm:rounded-2xl bg-gray-50 border outline-none transition-all font-bold text-gray-700 text-sm sm:text-base ${
                          errors.email 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                            : formData.email && !errors.email 
                              ? 'border-teal-300 focus:border-teal-600 focus:ring-teal-100'
                              : 'border-transparent focus:bg-white focus:border-teal-600 focus:ring-teal-100'
                        }`}
                        value={formData.email}
                        onChange={handleEmailChange}
                      />
                      {formData.email && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {errors.email ? (
                            <AlertCircle className="text-red-500" size={18} />
                          ) : (
                            <CheckCircle2 className="text-teal-500" size={18} />
                          )}
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-[10px] font-bold text-red-500 ml-4 uppercase tracking-tight">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Telefone/WhatsApp</label>
                    <div className="relative group">
                      <input 
                        required
                        type="tel" 
                        className={`w-full px-5 sm:px-6 py-4 rounded-xl sm:rounded-2xl bg-gray-50 border outline-none transition-all font-bold text-gray-700 text-sm sm:text-base ${
                          errors.phone 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                            : formData.phone && !errors.phone 
                              ? 'border-teal-300 focus:border-teal-600 focus:ring-teal-100'
                              : 'border-transparent focus:bg-white focus:border-teal-600 focus:ring-teal-100'
                        }`}
                        placeholder="(83) 99999-9999"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                      />
                      {formData.phone && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {errors.phone ? (
                            <AlertCircle className="text-red-500" size={18} />
                          ) : (
                            <CheckCircle2 className="text-teal-500" size={18} />
                          )}
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <p className="text-[10px] font-bold text-red-500 ml-4 uppercase tracking-tight">{errors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Assunto</label>
                    <select 
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none transition-all font-bold text-gray-700 appearance-none"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="Orcamento">Solicitar Orçamento</option>
                      <option value="Agendamento">Dúvida sobre Agendamento</option>
                      <option value="Resultados">Problemas com Resultados</option>
                      <option value="Convenios">Dúvida sobre Convênios</option>
                      <option value="Outros">Outros Assuntos</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Sua Mensagem</label>
                  <textarea 
                    required
                    rows={5}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none transition-all font-bold text-gray-700 resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <div className="flex items-start gap-3 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                  <input 
                    type="checkbox" 
                    id="lgpd-contact"
                    className="mt-1 w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                    checked={agreeLGPD}
                    onChange={(e) => setAgreeLGPD(e.target.checked)}
                  />
                  <label htmlFor="lgpd-contact" className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-tight">
                    Eu concordo com o tratamento dos meus dados conforme a <Link to="/compliance" className="text-teal-600 underline">LGPD</Link> e aceito os <Link to="/compliance" className="text-teal-600 underline">Termos de Uso</Link>.
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-2 text-xs font-bold">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <div className="pt-4">
                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Enviar Mensagem <Send size={16} />
                      </>
                    )}
                  </button>
                </div>

                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-teal-50 text-teal-700 rounded-2xl border border-teal-100 flex items-center gap-3"
                  >
                    <CheckCircle2 size={20} />
                    <p className="text-xs font-bold uppercase tracking-wide">Mensagem enviada com sucesso! Retornaremos em breve.</p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Detailed Business Hours Card */}
            <div className="bg-white rounded-[40px] border border-orange-100 shadow-xl shadow-orange-900/5 relative overflow-hidden p-8 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:scale-150"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">Horário de Atendimento</h3>
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Unidade Central Uiraúna</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-orange-200 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Segunda a Sexta</span>
                    <span className="text-lg font-black text-gray-900">06:30 às 17:00</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-orange-200 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sábados</span>
                    <span className="text-lg font-black text-gray-900">06:30 às 11:00</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                </div>

                <div className="flex items-center gap-2 pt-2 px-2">
                  <div className="w-6 h-px bg-gray-100 flex-1"></div>
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Fechado aos Domingos</span>
                  <div className="w-6 h-px bg-gray-100 flex-1"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((info, idx) => (
                <a 
                  key={idx}
                  href={info.link}
                  className="bg-white p-8 rounded-[40px] border border-teal-50 shadow-xl shadow-teal-900/5 hover:shadow-2xl hover:border-teal-100 transition-all flex items-start gap-6 group"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-inner">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{info.title}</h3>
                    <p className="text-lg font-black text-gray-900 leading-tight">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social & Support */}
            <div className="bg-gray-900 rounded-[60px] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Suporte <span className="text-orange-500">Imediato</span></h3>
              <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
                Precisa de um orçamento rápido ou tirar uma dúvida urgente? Nosso time de atendimento via WhatsApp está online para te ajudar.
              </p>
              <div className="flex flex-col gap-4">
                <a href="https://wa.me/558335340000" className="bg-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20">
                  <MessageCircle size={18} /> WhatsApp Central
                </a>
                <div className="flex items-center gap-4 justify-center pt-4 opacity-50">
                  <Globe size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Atendimento em toda a Paraíba</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Map Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Nossa <span className="text-teal-600">Localização</span> em Uiraúna</h2>
            <p className="text-gray-500 font-medium">Visite nossa sede e conheça nossa infraestrutura moderna.</p>
          </div>
          <div className="bg-white p-4 rounded-[60px] shadow-2xl shadow-teal-900/10 border border-teal-50 h-[500px] overflow-hidden group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.896746816045!2d-38.419444!3d-6.516667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7a46999999999999%3A0x9999999999999999!2sUira%C3%BAna%2C+PB!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '48px' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Coleta Já Uiraúna"
            ></iframe>
          </div>
          <div className="mt-12 p-8 bg-teal-50 rounded-[40px] border border-teal-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-white text-teal-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <p className="text-sm font-bold text-teal-800 max-w-xl">
                Ambiente seguro, climatizado e com acessibilidade total. Estacionamento facilitado para sua conveniência.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-white px-4 py-2 rounded-full shadow-sm">Certificado ISO 9001</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-white px-4 py-2 rounded-full shadow-sm">Controle de Qualidade PNCQ</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
