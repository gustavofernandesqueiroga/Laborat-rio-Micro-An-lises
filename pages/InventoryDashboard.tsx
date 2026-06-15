
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  AlertTriangle, 
  Thermometer, 
  ClipboardCheck, 
  Truck, 
  BarChart3, 
  Search, 
  CheckCircle2, 
  TestTube2,
  MapPin,
  ArrowUpRight,
  Send,
  Loader2,
  BellRing
} from 'lucide-react';
import SEO from '../components/SEO';

interface MatStock {
  id: string;
  name: string;
  tubesEdta: number;
  tubesGel: number;
  needles: number;
  lastUpdate: string;
}

const INITIAL_MATS: MatStock[] = [
  { id: 'mat-1', name: 'Smart Unit Altiplano', tubesEdta: 38, tubesGel: 120, needles: 300, lastUpdate: 'Agora' },
  { id: 'mat-2', name: 'Unidade Manaíra', tubesEdta: 145, tubesGel: 90, needles: 450, lastUpdate: '5 min atrás' },
  { id: 'mat-3', name: 'Smart Unit Bancários', tubesEdta: 220, tubesGel: 180, needles: 600, lastUpdate: '12 min atrás' },
  { id: 'mat-4', name: 'MAT Regional Mangabeira', tubesEdta: 85, tubesGel: 70, needles: 150, lastUpdate: '1h atrás' },
];

const InventoryDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stock' | 'checkin' | 'reports'>('stock');
  const [mats, setMats] = useState<MatStock[]>(INITIAL_MATS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotifying, setIsNotifying] = useState(false);
  const [notified, setNotified] = useState(false);

  const criticalAlert = useMemo(() => {
    const lowStock = mats.find(m => m.tubesEdta < 50);
    if (lowStock) {
      return {
        active: true,
        unit: lowStock.name,
        message: `Estoque crítico detectado (${lowStock.tubesEdta} un). Reposição prioritária via Matriz Uiraúna.`
      };
    }
    return { active: false, unit: '', message: '' };
  }, [mats]);

  const handleNotifyLogistics = () => {
    setIsNotifying(true);
    // Simula envio via WorkLab API para central em Uiraúna
    setTimeout(() => {
      setIsNotifying(false);
      setNotified(true);
      // Mantém o estado de "notificado" por 10 segundos
      setTimeout(() => setNotified(false), 10000);
    }, 2500);
  };

  const filteredMats = mats.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="pt-32 pb-24 bg-[#fcfdfd] min-h-screen">
      <SEO title="Gestão de MATs & Estoque" description="Monitoramento regional de insumos João Pessoa." />

      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Estoque MATs</h1>
            <p className="text-gray-500 font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Regionais João Pessoa - PB
            </p>
          </div>
          <div className="flex gap-2 p-1.5 bg-white rounded-[2rem] border border-teal-100 shadow-xl">
            {[
              { id: 'stock', icon: Box, label: 'Insumos' },
              { id: 'checkin', icon: ClipboardCheck, label: 'Check-in' },
              { id: 'reports', icon: BarChart3, label: 'Relatórios' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-400 hover:text-teal-600'
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence>
          {criticalAlert.active && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8">
              <div className={`p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl transition-all ${notified ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg ${notified ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {notified ? <CheckCircle2 size={32} /> : <AlertTriangle className="animate-bounce" size={32} />}
                  </div>
                  <div>
                    <h3 className={`font-black uppercase text-sm tracking-widest ${notified ? 'text-emerald-800' : 'text-red-800'}`}>
                      {notified ? 'LOGÍSTICA JÁ NOTIFICADA' : `ESTOQUE BAIXO: ${criticalAlert.unit}`}
                    </h3>
                    <p className={`text-sm font-bold ${notified ? 'text-emerald-600' : 'text-red-600'}`}>
                      {notified ? 'Chamado #9012 aberto. Guepardo de suprimentos a caminho da unidade.' : criticalAlert.message}
                    </p>
                  </div>
                </div>
                {!notified ? (
                  <button 
                    onClick={handleNotifyLogistics}
                    disabled={isNotifying}
                    className="bg-red-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 shadow-xl active:scale-95 transition-all flex items-center gap-3"
                  >
                    {isNotifying ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>}
                    {isNotifying ? 'Processando...' : 'Notificar Logística Já'}
                  </button>
                ) : (
                  <div className="flex items-center gap-3 text-emerald-600 font-black uppercase text-[10px] bg-white px-8 py-5 rounded-3xl border border-emerald-100 shadow-sm">
                    <BellRing size={18} className="animate-ring" /> Sincronizado com Uiraúna
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-[48px] border border-teal-50 shadow-2xl p-10 md:p-14">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Status Regional de MATs</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-400" size={20} />
              <input 
                type="text" 
                placeholder="Filtrar por Bairro..." 
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMats.map(mat => (
              <div key={mat.id} className="p-8 rounded-[40px] border border-gray-100 bg-gray-50/50 group hover:shadow-2xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:rotate-6 transition-transform">
                    <MapPin size={24} />
                  </div>
                  <span className="text-[9px] font-black uppercase text-gray-400">Atu: {mat.lastUpdate}</span>
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-8 uppercase truncate">{mat.name}</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase mb-2">
                      <span className="text-gray-400">Tubes EDTA</span>
                      <span className={mat.tubesEdta < 50 ? 'text-red-500' : 'text-gray-900'}>{mat.tubesEdta} un</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(mat.tubesEdta / 2.5, 100)}%` }}
                        className={`h-full rounded-full ${mat.tubesEdta < 50 ? 'bg-red-500' : 'bg-purple-500'}`} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100">
                       <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Tubos Gel</p>
                       <p className="text-lg font-black text-gray-900">{mat.tubesGel}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100">
                       <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Agulhas</p>
                       <p className="text-lg font-black text-gray-900">{mat.needles}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .animate-ring { animation: ring 1.5s infinite ease-in-out; }
        @keyframes ring {
          0%, 100% { transform: rotate(0); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(10deg); }
          20%, 40%, 60%, 80% { transform: rotate(-10deg); }
        }
      `}</style>
    </div>
  );
};

export default InventoryDashboard;
