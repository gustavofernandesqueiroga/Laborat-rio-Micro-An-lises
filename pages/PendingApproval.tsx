
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, LogOut, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const PendingApproval: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <SEO title="Aguardando Aprovação - Coleta Já" description="Sua conta está em processo de análise pela nossa equipe." />
      
      <div className="max-w-md w-full text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[48px] p-12 shadow-2xl shadow-teal-900/5 border border-teal-50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
          
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Clock size={40} className="animate-pulse" />
          </div>
          
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">Conta em Análise</h1>
          <p className="text-gray-500 font-bold text-sm leading-relaxed mb-8">
            Olá, <span className="text-teal-600">{user?.name}</span>! Recebemos seu cadastro como <span className="text-orange-500">{user?.role}</span>. 
            Nossa equipe de Compliance está revisando seus documentos.
          </p>
          
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl text-left">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Cadastro Recebido</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl text-left border border-orange-100">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                <Clock size={16} />
              </div>
              <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Análise de Documentos</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl text-left opacity-50">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center flex-shrink-0">
                <Mail size={16} />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">E-mail de Confirmação</p>
            </div>
          </div>
          
          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 mb-8">
            <p className="text-[9px] font-black text-teal-700 uppercase tracking-widest leading-relaxed">
              O prazo médio de aprovação é de 24h a 48h úteis. Você receberá uma notificação assim que seu acesso for liberado.
            </p>
          </div>

          <button 
            onClick={logout}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
          >
            <LogOut size={16} /> Sair da Conta
          </button>
        </motion.div>
        
        <p className="mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Dúvidas? Entre em contato com <a href="mailto:suporte@coletaja.com.br" className="text-teal-600 underline">suporte@coletaja.com.br</a>
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;
