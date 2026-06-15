
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  TrendingDown, 
  FileText, 
  Search,
  Filter,
  FileDown,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Briefcase,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import SEO from '../components/SEO';

const HR_DATA = [
  { name: 'Jan', exames: 45 },
  { name: 'Fev', exames: 52 },
  { name: 'Mar', exames: 38 },
  { name: 'Abr', exames: 65 },
  { name: 'Mai', exames: 48 },
];

const PIE_DATA = [
  { name: 'Apto', value: 85 },
  { name: 'Pendente', value: 10 },
  { name: 'Inapto', value: 5 },
];

const COLORS = ['#14b8a6', '#f97316', '#ef4444'];

const KpiCard: React.FC<{title: string; value: string; icon: React.ReactNode; color: string; trend?: string}> = ({title, value, icon, color, trend}) => (
  <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-teal-900/5 border border-teal-50 group hover:-translate-y-2 transition-all">
     <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 transition-transform group-hover:scale-110 shadow-lg ${
       color === 'blue' ? 'bg-blue-500 text-white shadow-blue-200' : 
       color === 'teal' ? 'bg-teal-600 text-white shadow-teal-200' : 
       color === 'orange' ? 'bg-orange-500 text-white shadow-orange-200' : 
       'bg-emerald-500 text-white shadow-emerald-200'
     }`}>
        {icon}
     </div>
     <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">{title}</p>
     <div className="flex items-baseline gap-3">
        <h4 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter">{value}</h4>
        {trend && <span className="text-xs font-black text-emerald-600">{trend}</span>}
     </div>
  </div>
);

const TableRow: React.FC<{name: string; id: string; status: string; date: string}> = ({name, id, status, date}) => (
  <tr className="group hover:bg-teal-50/20 transition-all">
     <td className="px-10 py-6">
        <div className="flex items-center gap-4">
           <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-black text-teal-600 text-[10px] uppercase">{name.charAt(0)}</div>
           <p className="text-gray-900 font-black uppercase tracking-tight">{name}</p>
        </div>
     </td>
     <td className="px-10 py-6 font-bold text-gray-400 tracking-widest">#{id}</td>
     <td className="px-10 py-6">
        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
          status === 'Apto' ? 'bg-emerald-100 text-emerald-600' : 
          status === 'Pendente' ? 'bg-orange-100 text-orange-600' : 
          'bg-red-100 text-red-600'
        }`}>
          {status}
        </span>
     </td>
     <td className="px-10 py-6 text-gray-500 font-black uppercase text-[10px]">{date}</td>
     <td className="px-10 py-6 text-right">
        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all"><FileText size={16}/></button>
           <button className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all"><ExternalLink size={16}/></button>
           <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-200 transition-all"><MoreVertical size={16}/></button>
        </div>
     </td>
  </tr>
);

const HRDashboardDemo: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Relatório Mensal consolidado com sucesso.");
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 bg-[#fcfdfd] min-h-screen font-sans">
      <SEO title="Painel Corporate RH" description="Gestão de saúde ocupacional para parceiros Coleta Já." />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-[24px] flex items-center justify-center shadow-2xl">
                 <Briefcase size={32} />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Portal do RH</h1>
                 <p className="text-gray-400 font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest mt-2">
                   <span className="text-teal-600">Empresa:</span> Tech Soluções João Pessoa
                 </p>
              </div>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 bg-white border-2 border-gray-100 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-600 hover:bg-gray-50 transition-all shadow-xl"
              >
                {isExporting ? "Gerando..." : "Exportar Dados"}
              </button>
              <button className="flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-teal-700 transition-all">
                Novo Agendamento Lote
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10">
          <KpiCard title="Vidas Monitoradas" value="1.242" icon={<Users />} color="teal" />
          <KpiCard title="Exames (Mês)" value="148" icon={<CheckCircle2 />} color="blue" />
          <KpiCard title="ASOs Vencendo" value="23" icon={<AlertCircle />} color="orange" />
          <KpiCard title="Redução Absenteísmo" value="-15.4%" icon={<TrendingDown />} color="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 bg-white p-10 rounded-[48px] shadow-2xl shadow-teal-900/5 border border-teal-50">
            <div className="flex justify-between items-center mb-10">
               <h3 className="font-black text-gray-900 uppercase tracking-tight text-xl">Monitoramento Mensal</h3>
               <div className="flex items-center gap-2 text-[10px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                  <Activity size={12} /> Live Sync
               </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HR_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none'}} />
                  <Bar dataKey="exames" fill="#0d9488" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-10 rounded-[48px] shadow-2xl border border-teal-50 flex flex-col">
            <h3 className="font-black text-gray-900 uppercase tracking-tight text-xl mb-10">Indice de Aptidão</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIE_DATA} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-8">
               {PIE_DATA.map((item, idx) => (
                 <div key={item.name} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3 font-bold text-gray-600 uppercase text-[10px] tracking-widest">
                       <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[idx]}}></span>
                       {item.name}
                    </div>
                    <span className="font-black text-gray-900 text-sm">{item.value}%</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[50px] shadow-2xl border border-teal-50 overflow-hidden">
           <div className="p-10 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-8">
              <h3 className="font-black text-gray-900 uppercase tracking-tight text-xl">Base de Colaboradores</h3>
              <div className="flex gap-4 w-full lg:w-auto">
                 <div className="relative flex-grow lg:w-80">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-300" size={18} />
                    <input type="text" placeholder="Buscar por Nome ou CPF..." className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest outline-none border border-transparent focus:border-teal-200 transition-all shadow-inner" />
                 </div>
                 <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-teal-600 transition-colors"><Filter size={24} /></button>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b">
                    <tr>
                       <th className="px-10 py-6">Colaborador</th>
                       <th className="px-10 py-6">Matrícula</th>
                       <th className="px-10 py-6">Status</th>
                       <th className="px-10 py-6">Vencimento ASO</th>
                       <th className="px-10 py-6 text-right">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="text-xs font-bold text-gray-600 divide-y divide-gray-50">
                    <TableRow name="Carlos Magno Santos" id="T-9021" status="Apto" date="Jan/2025" />
                    <TableRow name="Helena Ribeiro" id="T-4512" status="Pendente" date="Jun/2024" />
                    <TableRow name="Afonso Cavalcante" id="T-7811" status="Apto" date="Dez/2024" />
                 </tbody>
              </table>
           </div>
           <div className="p-8 bg-gray-50/50 text-center">
              <button className="group flex items-center justify-center gap-3 text-[10px] font-black uppercase text-teal-600 tracking-[0.2em] w-full">
                Ver Base Completa <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboardDemo;
