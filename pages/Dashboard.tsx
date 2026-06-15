
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Thermometer, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  Wifi, 
  Bell,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Cpu,
  Terminal,
  Zap,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import LoadingFallback from '../components/LoadingFallback';

const CHART_DATA = [
  { time: '06h', coletas: 85 }, { time: '08h', coletas: 320 },
  { time: '10h', coletas: 450 }, { time: '12h', coletas: 180 },
  { time: '14h', coletas: 210 }, { time: '16h', coletas: 390 },
  { time: '18h', coletas: 120 },
];

const KpiCard: React.FC<{title: string; value: string; trend: string; icon: React.ReactNode; color: string}> = ({title, value, trend, icon, color}) => (
  <div className="bg-slate-900 border border-slate-800/50 p-8 rounded-[40px] relative overflow-hidden group hover:border-slate-700 transition-all shadow-xl">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${
      color === 'teal' ? 'bg-teal-500/10 text-teal-500' : 
      color === 'blue' ? 'bg-blue-500/10 text-blue-500' : 
      color === 'orange' ? 'bg-orange-500/10 text-orange-500' : 
      color === 'purple' ? 'bg-purple-500/10 text-purple-500' : 'bg-slate-500/10 text-slate-400'
    }`}>
      {React.cloneElement(icon as React.ReactElement<any>, {size: 28})}
    </div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</p>
    <div className="flex items-baseline gap-3">
       <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
       <div className={`flex items-center gap-1 text-[10px] font-black ${trend.startsWith('+') ? 'text-emerald-500' : 'text-slate-500'}`}>
          {trend.startsWith('+') ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {trend}
       </div>
    </div>
  </div>
);

const DemandMetric = ({label, value, status}: {label: string, value: string, status: string}) => (
  <div className="flex flex-col items-center">
    <p className="text-[8px] font-black text-slate-500 tracking-[0.2em] mb-2 uppercase">{label}</p>
    <p className={`text-sm font-black tracking-tighter ${status === 'ok' ? 'text-white' : 'text-red-500'}`}>{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const logTimer = setInterval(() => {
      const events = [
        "Check-in: Amostra #WL-9821 recebida em Bancários",
        "Telemetria: Unidade Manaíra estável (4.1ºC)",
        "Guepardo Alisson em rota: Altiplano",
        "Backup concluído: WorkLab Cloud PB",
        "Pico de demanda detectado: Smart Unit Altiplano"
      ];
      const randomLog = events[Math.floor(Math.random() * events.length)];
      setLogs(prev => [randomLog, ...prev].slice(0, 10));
    }, 4000);

    return () => { clearInterval(timer); clearInterval(logTimer); };
  }, []);

  if (authLoading) return <LoadingFallback />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-teal-500 pt-0 overflow-x-hidden">
      <SEO title="War Room - Comando Central" description="Monitoramento operacional em tempo real Coleta Já." />
      
      {/* Retorno ao Site */}
      <Link to="/" className="fixed bottom-8 left-8 z-[200] bg-white text-slate-900 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-2xl hover:bg-teal-500 hover:text-white transition-all group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Sair do War Room
      </Link>

      <header className="px-8 py-6 border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-2xl sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-teal-600 rounded-[20px] flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.3)] border border-teal-400/20">
              <Activity size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-[0.25em] text-white leading-none mb-2">
                WAR <span className="text-teal-500">ROOM</span> JP
              </h1>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                  <Wifi size={10} /> Live Connect
                </span>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">CMD: {user?.name || 'Administrador'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="hidden xl:flex gap-8 border-r border-slate-800/50 pr-10">
              <DemandMetric label="WorkLab Sync" value="99.9%" status="ok" />
              <DemandMetric label="API Gateway" value="12ms" status="ok" />
              <DemandMetric label="Region" value="João Pessoa" status="ok" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-white tracking-tighter">
                {currentTime.toLocaleTimeString()}
              </div>
              <p className="text-[9px] font-black text-teal-500 uppercase tracking-[0.2em]">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-8 space-y-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <KpiCard title="Faturamento (Hoje)" value="R$ 42.4k" trend="+8.4%" icon={<DollarSign/>} color="teal" />
          <KpiCard title="Amostras em Rota" value="152" trend="+12" icon={<Package/>} color="blue" />
          <KpiCard title="NPS João Pessoa" value="4.95" trend="+0.02" icon={<Star/>} color="orange" />
          <KpiCard title="SLA Guepardo" value="22m" trend="-4m" icon={<Zap/>} color="purple" />
          <KpiCard title="CPU Load" value="18%" trend="Normal" icon={<Cpu/>} color="slate" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1 space-y-6">
             <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-6 h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                     <Terminal size={14} className="text-teal-500" /> System Logs
                   </h3>
                   <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span>
                </div>
                <div className="flex-grow space-y-4 font-mono overflow-y-auto custom-scrollbar pr-2">
                   {logs.map((log, i) => (
                     <div key={i} className="text-[10px] leading-relaxed border-l-2 border-slate-800 pl-4 py-2 hover:bg-slate-800/20 transition-colors">
                        <span className="text-slate-600">[{currentTime.getHours()}:{currentTime.getMinutes()}]</span> <span className="text-teal-400">LOG:</span> <span className="text-slate-300">{log}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="xl:col-span-2">
             <div className="bg-slate-900 border border-slate-800/50 rounded-[48px] p-10 shadow-2xl h-full relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>
                <div className="flex justify-between items-center mb-12">
                   <div>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Fluxo Diagnóstico Regional</h3>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Sincronização em tempo real via WorkLab PB</p>
                   </div>
                </div>
                <div className="h-[450px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CHART_DATA}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} axisLine={false} />
                        <YAxis stroke="#475569" tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} axisLine={false} />
                        <Tooltip 
                          contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px'}}
                          itemStyle={{fontSize: '12px', fontWeight: '900'}}
                        />
                        <Area type="monotone" dataKey="coletas" stroke="#14b8a6" strokeWidth={5} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
             <div className="bg-slate-900 border border-slate-800/50 rounded-[40px] p-8 h-full">
                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                  <MapPin size={18} className="text-orange-500" /> Smart Units Status
                </h3>
                <div className="space-y-5">
                   {['Altiplano', 'Manaíra', 'Bancários', 'Bessa', 'Mangabeira'].map((u, i) => (
                      <div key={i} className="group p-5 bg-slate-800/20 rounded-3xl border border-slate-800/50 hover:border-teal-500/50 transition-all">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-slate-100 uppercase">{u}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black text-teal-400">3.{i+5}ºC</span>
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                            </div>
                         </div>
                         <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500/40 rounded-full" style={{ width: `${80 + (i*4)}%` }} />
                         </div>
                      </div>
                   ))}
                </div>
                <div className="mt-8 p-6 bg-orange-500/5 border border-orange-500/20 rounded-3xl">
                   <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <AlertTriangle size={12} /> Alerta Logístico
                   </p>
                   <p className="text-[11px] text-slate-400 font-medium italic">
                     "Previsão de congestionamento na BR-230. Rota Bessa otimizada via alternativo."
                   </p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Dashboard;
