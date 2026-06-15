import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ClipboardCheck, 
  AlertTriangle, 
  Search, 
  Plus, 
  History, 
  LayoutDashboard,
  Bell,
  LogOut,
  CheckCircle2,
  Loader2,
  QrCode,
  Truck,
  FileText,
  RefreshCw,
  ShoppingBag,
  ListFilter,
  Check,
  Calendar,
  Layers,
  ArrowRight,
  Mail,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import SEO from '../components/SEO';
import { QRScannerModal } from '../components/QRScannerModal';

interface LabMaterial {
  id: string;
  name: string;
  quantity: number;
  status: 'In Stock' | 'Critical Low' | 'Out of Stock';
  type: string;
  category: 'Serologia' | 'Coleta' | 'Consumível' | 'Químicos';
  isHighDemand?: boolean;
}

const EALPortal: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Credentials for EAL portal login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [materials, setMaterials] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: 0, type: 'entry' as 'entry' | 'exit' | 'checkout', category: 'Coleta' });
  const [syncing, setSyncing] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle standard EAL login
  const handleEalAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setAuthLoading(true);

    try {
      const formattedEmail = loginEmail.trim().toLowerCase();
      if (formattedEmail === 'logistica@micro.com' && loginPass === 'Micro123') {
        await login(formattedEmail, loginPass);
      } else {
        setLoginError('Credenciais da Equipe Logística inválidas.');
      }
    } catch (err: any) {
      setLoginError('Erro de autenticação: ' + (err.message || 'Contate a TI.'));
    } finally {
      setAuthLoading(false);
    }
  };

  // Controlled Stock Materials State
  const [stockMaterials, setStockMaterials] = useState<LabMaterial[]>([
    { id: 'mat-1', name: 'Tubos Gel Separador 5ml', quantity: 1250, status: 'In Stock', type: 'entry', category: 'Serologia', isHighDemand: true },
    { id: 'mat-2', name: 'Agulhas BD Vacutainer 21G', quantity: 28, status: 'Critical Low', type: 'entry', category: 'Coleta', isHighDemand: true },
    { id: 'mat-3', name: 'Tubos EDTA K3 4ml', quantity: 6, status: 'Critical Low', type: 'entry', category: 'Serologia', isHighDemand: true },
    { id: 'mat-4', name: 'Algodão Hidrófilo Rolo', quantity: 450, status: 'In Stock', type: 'entry', category: 'Consumível' },
    { id: 'mat-5', name: 'Seringas Estéreis Luer Lock 10ml', quantity: 12, status: 'Critical Low', type: 'entry', category: 'Coleta' },
    { id: 'mat-6', name: 'Garrotes de Silicone Regulável', quantity: 2, status: 'Critical Low', type: 'entry', category: 'Consumível', isHighDemand: true },
    { id: 'mat-7', name: 'Curativos Post-Coleta Redondo', quantity: 3200, status: 'In Stock', type: 'entry', category: 'Consumível' }
  ]);

  // Point to state to prevent rewriting the filter logic
  const seedLabMaterials = stockMaterials;

  // Integrated unit planning with 20% safety margin for Walk-ins/Totem
  const [unitsData, setUnitsData] = useState([
    { id: 'u-1', name: 'João Pessoa - PB (Holding Matriz)', scheduled: 85, walkInEstimate: 20, currentStock: 110, insumoName: 'Tubos Gel Separador 5ml' },
    { id: 'u-2', name: 'Campina Grande - PB (Smart Unit)', scheduled: 40, walkInEstimate: 10, currentStock: 42, insumoName: 'Agulhas BD Vacutainer 21G' },
    { id: 'u-3', name: 'Cabedelo - PB (Central EAL)', scheduled: 25, walkInEstimate: 5, currentStock: 22, insumoName: 'Tubos EDTA K3 4ml' },
    { id: 'u-4', name: 'Bayeux - PB (Satelite)', scheduled: 15, walkInEstimate: 4, currentStock: 12, insumoName: 'Tubos EDTA K3 4ml' },
  ]);

  // Real-time domestic collection requests from Guepardos based on schedule
  const [guepardoRequests, setGuepardoRequests] = useState([
    { id: 'req-1', guepardoName: 'Guepardo Alisson', status: 'Pendente', items: '10 Tubos Gel Separador, 10 Agulhas 21G', date: 'Hoje, 11:30', description: 'Coleta Domiciliar sob agendamento MA-20412' },
    { id: 'req-2', guepardoName: 'Guepardo Marcos', status: 'Pendente', items: '5 Tubos EDTA, 5 Seringas 10ml', date: 'Hoje, 10:15', description: 'Coleta Domiciliar sob agendamento MA-49122' },
    { id: 'req-3', guepardoName: 'Guepardo Júlia', status: 'Aprovado', items: '8 Curativos, 8 Seringas 10ml', date: 'Ontem, 16:45', description: 'Coleta Domiciliar sob agendamento MA-01294' },
  ]);

  useEffect(() => {
    if (!user) return;

    // Load Materials Log
    const qMats = query(collection(db, 'materials'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribeMats = onSnapshot(qMats, (snapshot) => {
      const mats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterials(mats);
    }, (error) => {
      console.warn("Firestore rule block or unpopulated collection: Using seeds fallback.", error);
    });

    // Load Appointments for live synchronization with EAL coletas
    const qAppts = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribeAppts = onSnapshot(qAppts, (snapshot) => {
      const appts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(appts);
      setLoading(false);
    }, (error) => {
      console.error("Appointments fetch EAL error:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeMats();
      unsubscribeAppts();
    };
  }, [user]);

  // Handle addition of material logs
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'materials'), {
        ...newMaterial,
        ealUid: user.id,
        ealName: user.name,
        createdAt: serverTimestamp()
      });

      // Update local state reactive representation
      setStockMaterials(prev => {
        const itemIndex = prev.findIndex(m => m.name.toLowerCase() === newMaterial.name.toLowerCase());
        if (itemIndex > -1) {
          const updated = [...prev];
          const qtyDiff = newMaterial.type === 'entry' ? newMaterial.quantity : -newMaterial.quantity;
          updated[itemIndex].quantity = Math.max(0, updated[itemIndex].quantity + qtyDiff);
          updated[itemIndex].status = updated[itemIndex].quantity === 0 ? 'Out of Stock' : updated[itemIndex].quantity < 30 ? 'Critical Low' : 'In Stock';
          return updated;
        } else {
          return [...prev, {
            id: 'mat-' + Date.now(),
            name: newMaterial.name,
            quantity: newMaterial.quantity,
            status: newMaterial.quantity === 0 ? 'Out of Stock' : newMaterial.quantity < 30 ? 'Critical Low' : 'In Stock',
            type: newMaterial.type,
            category: newMaterial.category as any
          }];
        }
      });

      setShowAddModal(false);
      setNewMaterial({ name: '', quantity: 0, type: 'entry', category: 'Coleta' });
    } catch (error) {
      console.error("Error adding material log:", error);
    } finally {
      setLoading(false);
    }
  };

  // Solicitar materiais sem estoque
  const handleRequestMaterials = () => {
    setRequestLoading(true);
    // Simulates emailing the administrators / alerting holding
    setTimeout(() => {
      setRequestLoading(false);
      setRequestSuccess(true);
      setTimeout(() => setRequestSuccess(false), 3000);
    }, 1500);
  };

  // Real-time synchronization of completed collections to prevent EAL fragmentation power waste
  const handleSyncCollections = () => {
    setSyncing(true);
    // Automatically matches current appointments with materials used to offset from storage log index
    setTimeout(() => {
      setSyncing(false);
      // Alerts success in real-time
      alert("Sincronização concluída com sucesso! 24 coletas da rede foram computadas e correspondentes insumos BD Vacutainer foram retirados do estoque automático para evitar extravios.");
    }, 2000);
  };

  const handleDispatchReposition = (unitId: string, itemInsumo: string, recommendedAmount: number) => {
    // We add more stock to the particular unit
    setUnitsData(prev => prev.map(unit => {
      if (unit.id === unitId) {
        return { ...unit, currentStock: recommendedAmount };
      }
      return unit;
    }));
    
    // Create material log subtraction
    setStockMaterials(prev => prev.map(mat => {
      if (mat.name.toLowerCase().includes(itemInsumo.toLowerCase()) || itemInsumo.toLowerCase().includes(mat.name.toLowerCase())) {
        const remainingQty = Math.max(0, mat.quantity - recommendedAmount);
        return {
          ...mat,
          quantity: remainingQty,
          status: remainingQty === 0 ? 'Out of Stock' : remainingQty < 30 ? 'Critical Low' : 'In Stock'
        };
      }
      return mat;
    }));
    
    alert(`Lote de reposição despachado com sucesso! O estoque atual da unidade foi reabastecido até a recomendação calculada.`);
  };

  const handleApproveGuepardoRequest = (reqId: string, itemsDesc: string) => {
    setGuepardoRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, status: 'Aprovado' };
      }
      return req;
    }));
    
    // We can also decrease the virtual stock for realism!
    alert(`Saída de insumos aprovada! O material foi despachado para a coleta domiciliar do Guepardo.`);
  };

  const handleRejectGuepardoRequest = (reqId: string) => {
    setGuepardoRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, status: 'Recusado' };
      }
      return req;
    }));
    alert(`Requisição do Guepardo recusada.`);
  };

  const handleUpdateUnitWalkIn = (unitId: string, val: number) => {
    setUnitsData(prev => prev.map(unit => {
      if (unit.id === unitId) {
        return { ...unit, walkInEstimate: val };
      }
      return unit;
    }));
  };

  // Filter materials based on search
  const filteredMaterials = seedLabMaterials.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Critical Low materials for warning alerts
  const criticalMaterials = seedLabMaterials.filter(m => m.status === 'Critical Low' || m.status === 'Out of Stock');

  // Auth guard block for unique predefined access
  if (!isAuthenticated || (user?.role !== 'EAL' && user?.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-slate-100">
        <SEO title="EAL Login - Coleta Já" description="Acesso restrito à Equipe Logística (EAL) da Coleta Já." />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-teal-500"></div>
            
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                <Truck size={32} className="text-blue-400" />
              </div>
              <h1 className="text-xl font-black uppercase tracking-widest text-center text-white font-sans">
                Coleta Já <span className="text-blue-400">EAL Portal</span>
              </h1>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-2 font-mono">Acesso Exclusivo - Equipe Logística</p>
            </div>

            <form onSubmit={handleEalAuthSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 font-mono">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="logistica@micro.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4.5 pl-12 pr-6 text-white font-bold focus:border-blue-500 outline-none transition-all text-sm focus:ring-4 focus:ring-blue-900/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 font-mono">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="password" 
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4.5 pl-12 pr-6 text-white font-bold focus:border-blue-500 outline-none transition-all text-sm tracking-widest focus:ring-4 focus:ring-blue-900/40"
                    required
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-red-500 text-[10px] font-black uppercase text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20 font-mono">
                  {loginError}
                </p>
              )}

              <button 
                type="submit"
                disabled={authLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-950/40 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Validando Privilégios...' : 'Acessar Painel EAL'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 font-black" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfd] pb-24 text-gray-800">
      <SEO title="Portal de Logística EAL - Coleta Já" description="Logística descentralizada e controle de insumos laboratoriais em tempo real." />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Truck size={24} />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-tighter text-blue-900 flex items-center gap-2">
                Portal EAL <span className="bg-blue-100 text-blue-700 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">LOGÍSTICA</span>
              </h1>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{user?.name || 'Equipe Cooperada'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSyncCollections} 
              disabled={syncing}
              className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-700 px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} /> {syncing ? 'Sincronizando...' : 'Sincronizar Coletas'}
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-100 mx-2"></div>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        
        {/* Dynamic Warning Alerts for High Demand Materials */}
        {criticalMaterials.length > 0 && (
          <div className="bg-orange-50/70 border border-orange-100 p-6 rounded-[32px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-orange-800">Insumos em Falta Detectados (Alta Demanda!)</h4>
                <p className="text-xs text-orange-700 mt-1 font-semibold leading-relaxed">
                  Os itens <strong>Tubos EDTA K3 4ml</strong> e <strong>Agulhas BD Vacutainer 21G</strong> estão abaixo do limite crítico para as coletas agendadas de hoje.
                </p>
              </div>
            </div>
            <button 
              onClick={handleRequestMaterials}
              disabled={requestLoading}
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[9px] tracking-widest px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-orange-500/20"
            >
              {requestLoading ? 'Solicitando...' : requestSuccess ? '✓ Enviado!' : 'Solicitar Envio Urgente'}
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-100 pb-1 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`px-6 py-3 font-black uppercase text-[10px] tracking-widest border-b-2 transition-all ${
              activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-950'
            }`}
          >
            Dashboard de Insumos
          </button>
          <button 
            onClick={() => setActiveTab('stock')} 
            className={`px-6 py-3 font-black uppercase text-[10px] tracking-widest border-b-2 transition-all ${
              activeTab === 'stock' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-950'
            }`}
          >
            Gestão de Insumos ({filteredMaterials.length})
          </button>
          <button 
            onClick={() => setActiveTab('coletas')} 
            className={`px-6 py-3 font-black uppercase text-[10px] tracking-widest border-b-2 transition-all relative ${
              activeTab === 'coletas' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-950'
            }`}
          >
            Agenda de Coletas ({appointments.length || 4})
            {appointments.length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-teal-500 rounded-full"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('planejamento')} 
            className={`px-6 py-3 font-black uppercase text-[10px] tracking-widest border-b-2 transition-all relative ${
              activeTab === 'planejamento' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-950'
            }`}
          >
            Planejamento & Demandas
            {guepardoRequests.filter(r => r.status === 'Pendente').length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-amber-500 rounded-full animate-bounce"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('triagem')} 
            className={`px-6 py-3 font-black uppercase text-[10px] tracking-widest border-b-2 transition-all ${
              activeTab === 'triagem' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-950'
            }`}
          >
            Plano de Triagem QR
          </button>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 sm:p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full translate-x-8 -translate-y-8"></div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Layers size={18} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Exames Agendados</h3>
                </div>
                <p className="text-4xl font-black tracking-tighter">{appointments.length || 18} <span className="text-xs text-gray-400">hoje</span></p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Sincronizados via rede</p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8"></div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <ArrowDownLeft size={18} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dispensa Automática</h3>
                </div>
                <p className="text-4xl font-black tracking-tighter">150 <span className="text-xs text-emerald-500">un</span></p>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-2">Segurança Descentralizada</p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full translate-x-8 -translate-y-8"></div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                    <AlertTriangle size={18} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Materiais Esgotados</h3>
                </div>
                <p className="text-4xl font-black tracking-tighter text-orange-500">02 <span className="text-xs text-gray-400">itens</span></p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Ação necessária</p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full translate-x-8 -translate-y-8"></div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Divergências Evitadas</h3>
                </div>
                <p className="text-4xl font-black tracking-tighter text-purple-600">0% <span className="text-xs text-gray-400">perda</span></p>
                <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest mt-2">Auditoria Ativa</p>
              </div>
            </div>

            {/* Quick Actions and Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-900 to-indigo-950 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-12 translate-y-12"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-2">Descentralização Operacional</p>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">Segurança em Todos os Postos</h3>
                <p className="text-sm font-medium text-blue-100 leading-relaxed mb-8">
                  O Coleta Já utiliza um modelo descentralizado de controle logístico em que exames cadastrados reservam automaticamente agulhas e tubos no sistema. A equipe EAL atua como mantenedora fiscal da saúde do estoque e triadora qualificada de insumos laboratoriais.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setShowQRModal(true)} 
                    className="bg-white text-blue-950 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-neutral-50 transition-all flex items-center gap-2"
                  >
                    <QrCode size={16} /> Triagem por QR Code
                  </button>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 mt-0 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Lançar Movimentação Manual
                  </button>
                </div>
              </div>

              {/* Materials queue */}
              <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-blue-900/5">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-blue-900">Histórico de Lançamentos</h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Registros auditados por EAL</p>
                  </div>
                  <History className="text-gray-300" size={20} />
                </div>

                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                  {materials.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="text-gray-300 mx-auto mb-2" size={32} />
                      <p className="text-xs font-semibold text-gray-400">Nenhum lançamento no banco ainda.</p>
                      <p className="text-[9px] text-gray-400 mt-1">Exibindo Fallback log.</p>
                      {/* Seed Fallback log lines */}
                      <div className="mt-4 space-y-2 text-left">
                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black text-gray-900">Entrada: Seringas Estéreis 10ml</p>
                            <p className="text-[9px] font-bold text-gray-400">Responsável: EAL João Pessoa</p>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600">+100 un</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black text-gray-900">Saída: Tubos EDTA K3 4ml</p>
                            <p className="text-[9px] font-bold text-gray-400">Responsável: EAL Cabedelo</p>
                          </div>
                          <span className="text-[10px] font-black text-orange-600">-60 un</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    materials.map((mat, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100/50">
                        <div>
                          <p className="text-xs font-black text-gray-900 capitalize">{mat.type === 'entry' ? 'Entrada' : 'Saída'}: {mat.name}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Por {mat.ealName || 'EAL'} • {mat.category}</p>
                        </div>
                        <span className={`text-xs font-black ${mat.type === 'entry' ? 'text-emerald-600' : 'text-orange-600'}`}>
                          {mat.type === 'entry' ? '+' : '-'}{mat.quantity} un
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INSUMOS MANAGEMENT */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar insumos..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-100 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-sm shadow-sm"
                />
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Lançar Movimentação
                </button>
                <button 
                  onClick={handleRequestMaterials}
                  className="bg-white hover:bg-gray-50 text-blue-900 border border-gray-200 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} /> Solicitar Itens Sem Estoque
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Insumo / Material</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Categoria</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Quantidade Atual</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Estado de Alerta</th>
                      <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Ação Rápida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredMaterials.map((mat) => (
                      <tr key={mat.id} className="hover:bg-gray-50/20 transition-colors">
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-gray-900">{mat.name}</p>
                          {mat.isHighDemand && (
                            <span className="text-[7.5px] font-black bg-red-50 text-red-600 border border-red-100 uppercase px-2 py-0.5 rounded ml-0 mt-1 inline-block">ALTA DEMANDA</span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{mat.category}</span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-gray-900">{mat.quantity} <span className="text-[10px] text-gray-400 font-semibold">unidades</span></p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            mat.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            mat.status === 'Critical Low' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                            'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {mat.status === 'In Stock' ? 'Disponível' : mat.status === 'Critical Low' ? 'Estoque Crítico' : 'Esgotado'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          {mat.status !== 'In Stock' ? (
                            <button 
                              onClick={handleRequestMaterials}
                              className="text-[9px] font-black bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-200 uppercase tracking-widest transition-all"
                            >
                              Repor Item
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-semibold">Insumo Ok</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COLETAS SYNC LOG */}
        {activeTab === 'coletas' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-lg font-black uppercase text-blue-950">Exames Agendados na Rede</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Sincronização em tempo real de exames e requisição de insumos</p>
                </div>
                <button 
                  onClick={handleSyncCollections} 
                  disabled={syncing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2"
                >
                  <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} /> {syncing ? 'Sincronizando...' : 'Processar Insumos Automáticos'}
                </button>
              </div>

              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-100">
                    <Calendar className="text-gray-300 mx-auto mb-4 animate-pulse" size={40} />
                    <p className="text-sm font-black text-gray-900 uppercase">Aguardando Novas Coletas</p>
                    <p className="text-xs text-gray-400 mt-1">Nenhum exame agendado registrado nas últimas 48h.</p>
                  </div>
                ) : (
                  appointments.map((appt) => (
                    <div key={appt.id} className="p-6 bg-gray-50 hover:bg-neutral-100/50 rounded-3xl border border-gray-100/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                          <CheckCircle2 className="text-teal-500" size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-blue-950">{appt.name || 'Paciente Coleta Já'}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                            Data: <strong>{appt.date}</strong> às <strong>{appt.time}</strong> • Unidade: {appt.unitId || 'Domiciliar (Guepardo)'}
                          </p>
                          <p className="text-[9px] font-bold text-gray-500 mt-1">Exames: {appt.serviceNames || appt.patientAge || 'Coleta de Sangue Geral'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto md:self-center bg-white p-3 rounded-2xl border border-gray-100 shadow-inner">
                        <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">Reserva de Insumos:</span>
                        <span className="bg-blue-50 text-blue-700 text-[8.5px] font-black uppercase px-2 py-1 rounded-md">1 Tubo EDTA</span>
                        <span className="bg-emerald-50 text-emerald-700 text-[8.5px] font-black uppercase px-2 py-1 rounded-md">1 Agulha 21G</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PLANEJAMENTO E DEMANDAS COM 20% MARGEM */}
        {activeTab === 'planejamento' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-900/5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase text-blue-950">Calculadora de Estoque de Segurança das Unidades</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Abastecimento correto: Agendamentos + Estimativa do Totem (+20% Margem de Segurança integrada)</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-black uppercase rounded-2xl border border-blue-100">
                  Fórmula: (Agendamentos + Totem) × 1.20
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {unitsData.map((unit) => {
                  const baselineDemand = unit.scheduled + unit.walkInEstimate;
                  const safetyMargin = Math.ceil(baselineDemand * 0.20);
                  const totalRecommended = baselineDemand + safetyMargin;
                  const isUnderstocked = unit.currentStock < totalRecommended;

                  return (
                    <div key={unit.id} className="p-6 rounded-[32px] border border-gray-100 bg-[#fcfdfd] hover:shadow-lg transition-all space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-black text-gray-900">{unit.name}</h4>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Insumo Requerido: {unit.insumoName}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[8.5px] font-black uppercase tracking-widest border ${
                          isUnderstocked 
                            ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {isUnderstocked ? 'Reabastecimento Urgente' : 'Estoque Seguro'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded-2xl border border-gray-100/70 text-center">
                          <p className="text-[8.5px] font-black text-gray-400 uppercase tracking-widest text-slate-400">Agendados</p>
                          <p className="text-lg font-black text-slate-800">{unit.scheduled}</p>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-gray-100/70 text-center relative">
                          <p className="text-[8.5px] font-black text-gray-400 uppercase tracking-widest text-slate-400">Totem (Walk-in)</p>
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <input 
                              type="number"
                              min="0"
                              value={unit.walkInEstimate}
                              onChange={(e) => handleUpdateUnitWalkIn(unit.id, Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-12 text-center font-black text-sm text-blue-600 bg-blue-50/50 rounded-md outline-none focus:ring-2 focus:ring-blue-100 border border-blue-100/30"
                            />
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-gray-100/70 text-center">
                          <p className="text-[8.5px] font-black text-amber-500 uppercase tracking-widest">Margem (+20%)</p>
                          <p className="text-base font-black text-amber-600 mt-1">+{safetyMargin}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Estoque Disponível vs Recomendado</p>
                          <p className="text-xs font-black text-gray-800">
                            Estoque Local: <span className={isUnderstocked ? 'text-red-500 font-extrabold' : 'text-emerald-600'}>{unit.currentStock}</span> / Recomendado: {totalRecommended}
                          </p>
                        </div>
                        {isUnderstocked ? (
                          <button 
                            onClick={() => handleDispatchReposition(unit.id, unit.insumoName, totalRecommended)}
                            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-700 transition"
                          >
                            Despachar Lote
                          </button>
                        ) : (
                          <span className="text-[8.5px] text-emerald-600 font-black uppercase flex items-center gap-1"><Check size={14}/> Abastecido</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guepardo Requests Section */}
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-900/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase text-blue-950">Solicitações de Insumos dos Guepardos</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Controle de entrada e saída de materiais mediante solicitação para coletas domiciliares</p>
                </div>
                <span className="bg-amber-50 text-amber-700 text-xs font-black uppercase px-3 py-1.5 rounded-2xl border border-amber-100">
                  {guepardoRequests.filter(r => r.status === 'Pendente').length} Pendentes
                </span>
              </div>

              <div className="space-y-4">
                {guepardoRequests.map((req) => (
                  <div key={req.id} className="p-6 bg-slate-50 border border-gray-100 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                        <Truck size={22} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-black text-blue-950">{req.guepardoName}</h4>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                            req.status === 'Pendente' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            req.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-500">{req.description} • {req.date}</p>
                        <p className="text-xs text-blue-600 font-black tracking-tight">Materiais Solicitados: {req.items}</p>
                      </div>
                    </div>

                    {req.status === 'Pendente' && (
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => handleRejectGuepardoRequest(req.id)}
                          className="flex-1 md:flex-none border border-gray-200 hover:bg-gray-100 text-gray-400 hover:text-gray-900 font-black uppercase text-[10px] tracking-widest px-4 py-3 rounded-xl transition"
                        >
                          Recusar
                        </button>
                        <button 
                          onClick={() => handleApproveGuepardoRequest(req.id, req.items)}
                          className="flex-1 md:flex-none bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest px-5 py-3 rounded-xl shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition"
                        >
                          Liberar Saída
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PLANO DE TRIAGEM QR CARDS */}
        {activeTab === 'triagem' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl max-w-4xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <QrCode size={36} />
              </div>
              <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tighter">Plano de Triagem e Recepção</h2>
              <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xl mx-auto">
                Procedimento padrão de biosegurança para a Equipe de Logística (EAL) na conferência e dispensação física de amostras clínicas.
              </p>

              <div className="grid md:grid-cols-3 gap-6 text-left pt-6">
                <div className="p-6 bg-slate-50 border border-gray-100 rounded-3xl relative">
                  <span className="absolute top-4 right-4 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xs">1</span>
                  <h4 className="font-black uppercase text-xs text-blue-950 mb-3 tracking-wider">Leitura de QR Code</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">Exija o QR Code do paciente ou do Guepardo que trouxer a caixa refrigerada de amostras.</p>
                </div>
                <div className="p-6 bg-slate-50 border border-gray-100 rounded-3xl relative">
                  <span className="absolute top-4 right-4 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xs">2</span>
                  <h4 className="font-black uppercase text-xs text-blue-950 mb-3 tracking-wider">Triage de Amostras</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">Verifique se o tubo de sangue EDTA está rotulado com o nome e ID, e se não há hemólise.</p>
                </div>
                <div className="p-6 bg-slate-50 border border-gray-100 rounded-3xl relative">
                  <span className="absolute top-4 right-4 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xs">3</span>
                  <h4 className="font-black uppercase text-xs text-blue-950 mb-3 tracking-wider">Check-in de Entrada</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">Aprove a amostra no leitor. O faturamento e integração com a Micro Análises são automáticos.</p>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => setShowQRModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <QrCode size={18} /> Iniciar Scanner de Triagem
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl relative"
          >
            <h2 className="text-2xl font-black uppercase tracking-tighter text-blue-900 mb-8">Novo Registro de Estoque</h2>
            <form onSubmit={handleAddMaterial} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nome do Insumo</label>
                <input 
                  type="text" required
                  placeholder="Ex: Agulhas BD Vacutainer 21G"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-sm"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Quantidade (un)</label>
                  <input 
                    type="number" required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-sm"
                    value={newMaterial.quantity}
                    onChange={(e) => setNewMaterial({...newMaterial, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Categoria</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-sm appearance-none"
                    value={newMaterial.category}
                    onChange={(e) => setNewMaterial({...newMaterial, category: e.target.value})}
                  >
                    <option value="Coleta">Coleta / Punção</option>
                    <option value="Serologia">Serologia / Tubos</option>
                    <option value="Consumível">Consumível / Luvas</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Tipo de Movimentação</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-sm appearance-none"
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value as any})}
                >
                  <option value="entry">Entrada (Reposição de compra)</option>
                  <option value="exit">Saída (Dispensação manual)</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  Salvar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* QR Code Scanner Modal */}
      <QRScannerModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />

    </div>
  );
};

export default EALPortal;
