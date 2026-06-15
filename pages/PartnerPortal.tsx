
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Users, TrendingUp, Calendar, 
  FileText, Search, Filter, ChevronRight,
  BarChart3, PieChart as PieChartIcon, Activity,
  Settings, Bell, LogOut, ExternalLink, MoreVertical,
  CheckCircle2, AlertCircle, TrendingDown, Loader2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import SEO from '../components/SEO';

const COLORS = ['#14b8a6', '#f97316', '#ef4444'];

const PartnerPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    examsThisMonth: 0,
    pendingAsos: 0,
    reduction: '-12.5%'
  });

  useEffect(() => {
    if (!user) return;
    // Simulate loading data
    setTimeout(() => setLoading(false), 1000);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfd] pb-24">
      <SEO title="Portal Parceiro - Coleta Já" description="Gestão de saúde ocupacional e parcerias." />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Briefcase size={24} />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-tighter">Portal Parceiro</h1>
              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">{user?.unit || 'Tech Soluções JP'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-gray-100 mx-2"></div>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-10">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-purple-900/5 border border-purple-50">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-50 text-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <Users size={20} />
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Vidas Monitoradas</p>
            <h4 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter">1.242</h4>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-purple-900/5 border border-purple-50">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Exames (Mês)</p>
            <h4 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter">148</h4>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-purple-900/5 border border-purple-50">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 text-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <AlertCircle size={20} />
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">ASOs Vencendo</p>
            <h4 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter text-orange-500">23</h4>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-purple-900/5 border border-purple-50">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <TrendingDown size={20} />
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Redução Absenteísmo</p>
            <h4 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter text-emerald-600">-15.4%</h4>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-10 rounded-[48px] shadow-2xl shadow-purple-900/5 border border-purple-50">
            <div className="flex justify-between items-center mb-10">
               <h3 className="font-black text-gray-900 uppercase tracking-tight text-xl">Monitoramento Mensal</h3>
               <div className="flex items-center gap-2 text-[10px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                  <Activity size={12} /> Live Sync
               </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Jan', exames: 45 },
                  { name: 'Fev', exames: 52 },
                  { name: 'Mar', exames: 38 },
                  { name: 'Abr', exames: 65 },
                  { name: 'Mai', exames: 48 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none'}} />
                  <Bar dataKey="exames" fill="#9333ea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-10 rounded-[48px] shadow-2xl border border-purple-50 flex flex-col">
            <h3 className="font-black text-gray-900 uppercase tracking-tight text-xl mb-10">Indice de Aptidão</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={[
                      { name: 'Apto', value: 85 },
                      { name: 'Pendente', value: 10 },
                      { name: 'Inapto', value: 5 },
                    ]} 
                    innerRadius={70} 
                    outerRadius={100} 
                    paddingAngle={8} 
                    dataKey="value"
                  >
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-8">
               {['Apto', 'Pendente', 'Inapto'].map((name, idx) => (
                 <div key={name} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3 font-bold text-gray-600 uppercase text-[10px] tracking-widest">
                       <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[idx]}}></span>
                       {name}
                    </div>
                    <span className="font-black text-gray-900 text-sm">{idx === 0 ? '85%' : idx === 1 ? '10%' : '5%'}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-purple-900 rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-2/3">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Novo Agendamento em Lote</h2>
              <p className="text-purple-200 text-lg font-medium leading-relaxed">
                Precisa agendar exames para múltiplos colaboradores? Use nossa ferramenta de importação e otimize seu tempo.
              </p>
            </div>
            <button className="bg-white text-purple-900 px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-purple-50 transition-all whitespace-nowrap">
              Iniciar Agendamento
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PartnerPortal;
