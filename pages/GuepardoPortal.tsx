
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, TrendingUp, Star, Award, Clock, MapPin, 
  Bell, MessageSquare, Calendar, CheckCircle2, 
  ChevronRight, Heart, Trophy, User,
  LogOut, Settings, HelpCircle, Package, AlertCircle,
  Search, Filter, DollarSign, ClipboardList, Info,
  Smartphone, Mail, X, Plus, ArrowRight, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import SEO from '../components/SEO';

const GuepardoPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [myCollections, setMyCollections] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  // Simulator State variables
  const [simCollections, setSimCollections] = useState(5);
  const [simVehicle, setSimVehicle] = useState<'moto' | 'bike' | 'e-car'>('moto');
  const [simDistance, setSimDistance] = useState(6);
  const [simWorkingDays, setSimWorkingDays] = useState(22);

  // Available client proposals for Coleta Já
  const [availableProposals, setAvailableProposals] = useState([
    { id: 'prop-1', name: 'Maria do Socorro', distance: '3.2 km', value: 25.00, address: 'Av. Epitácio Pessoa, 1202 - Cabo Branco', exam: 'Vitamina D + B12', scheduledTime: 'Hoje às 15:30', warning: 'Paciente idoso, requer cuidado extra na assepsia.' },
    { id: 'prop-2', name: 'Carlos Eduardo Santos', distance: '1.8 km', value: 25.00, address: 'Rua Fernando de Noronha, 340 - Tambaú', exam: 'Hemograma Completo', scheduledTime: 'Hoje às 16:45', warning: 'Requer jejum clássico de 8h.' },
    { id: 'prop-3', name: 'Juliana Vasconcelos', distance: '5.5 km', value: 25.00, address: 'Av. Sapé, 45 - Manaíra', exam: 'Curva Glicêmica Estendida', scheduledTime: 'Amanhã às 07:15', warning: 'Acompanhamento TEA especial.' }
  ]);

  // Ranking Database State
  const rankingList = [
    { rank: 1, name: 'Marcos Silva', coletas: 118, rating: 4.95, reward: 'R$ 500,00', isMe: false },
    { rank: 2, name: 'Júlia Medeiros', coletas: 110, rating: 4.92, reward: 'R$ 300,00', isMe: false },
    { rank: 3, name: 'Seu Perfil (Guepardo)', coletas: 95, rating: 4.88, reward: 'R$ 150,00', isMe: true },
    { rank: 4, name: 'Roberto Lima', coletas: 78, rating: 4.80, reward: 'Selo Prata', isMe: false },
    { rank: 5, name: 'Ana Souza', coletas: 65, rating: 4.75, reward: 'Selo Prata', isMe: false },
  ];

  const handleAcceptProposal = async (prop: any) => {
    if (!profile) return;
    const currentToday = profile.collectionsToday || 0;
    
    // Check maximum limit rule (12 coletas/day)
    if (currentToday >= 12) {
      alert("⚠️ Atenção: Limite máximo de segurança atingido (12 coletas por dia). Mantemos esse controle para evitar a fadiga e garantir alto padrão de biosegurança!");
      return;
    }
    
    // Simulate accepting
    alert(`⚡ Proposta Aceita! O agendamento de ${prop.name} foi adicionado à sua Agenda.`);
    
    // 1. Remove from available proposals
    setAvailableProposals(prev => prev.filter(p => p.id !== prop.id));
    
    // 2. Add to active collections
    const newAppointment = {
      id: prop.id,
      name: prop.name,
      time: prop.scheduledTime,
      date: 'Hoje',
      address: prop.address,
      phone: '(83) 98822-0412',
      type: 'HOME'
    };
    setMyCollections(prev => [newAppointment, ...prev]);
    
    // 3. Update Profile locally and virtually
    const newCollectionsToday = currentToday + 1;
    const newTotalCollections = (profile.totalCollections || 0) + 1;
    const pointsEarned = 50;
    const newPoints = (profile.points || 0) + pointsEarned;
    const commissionAmount = 25.00;
    const newTotalEarnings = (profile.totalEarnings || 0) + commissionAmount;
    
    setProfile(prev => ({
      ...prev,
      collectionsToday: newCollectionsToday,
      totalCollections: newTotalCollections,
      points: newPoints,
      totalEarnings: newTotalEarnings,
    }));
    
    // Update firestore securely if doc is loaded
    try {
      await updateDoc(doc(db, 'guepardo_profiles', user.id), {
        collectionsToday: newCollectionsToday,
        totalCollections: newTotalCollections,
        points: newPoints,
        totalEarnings: newTotalEarnings,
      });
    } catch(err) {
      console.warn("Firestore update error, working in sandbox mode:", err);
    }
  };

  // Form State for Registering Collection
  const [registerForm, setRegisterForm] = useState({
    patientName: '',
    examName: '',
    protocol: '',
    notes: '',
    status: 'Finalizado'
  });

  useEffect(() => {
    if (!user) return;

    // Fetch Guepardo Profile
    const unsubscribeProfile = onSnapshot(doc(db, 'guepardo_profiles', user.id), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data());
      }
      setLoading(false);
    });

    // Fetch Notifications
    const qNotifs = query(collection(db, 'notifications'), where('userUid', '==', user.id), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribeNotifications = onSnapshot(qNotifs, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
    });

    // Fetch My Collections (Assigned to this Guepardo)
    const qCollections = query(collection(db, 'appointments'), where('type', '==', 'HOME'), orderBy('createdAt', 'desc'));
    const unsubscribeCollections = onSnapshot(qCollections, (snapshot) => {
      const colls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyCollections(colls);
    });

    // Fetch Commissions
    const qCommissions = query(collection(db, 'commissions'), where('guepardoUid', '==', user.id), orderBy('createdAt', 'desc'));
    const unsubscribeCommissions = onSnapshot(qCommissions, (snapshot) => {
      const comms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCommissions(comms);
    });

    // Fetch History
    const qHistory = query(collection(db, 'collections_history'), where('guepardoUid', '==', user.id), orderBy('createdAt', 'desc'));
    const unsubscribeHistory = onSnapshot(qHistory, (snapshot) => {
      const hist = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(hist);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeNotifications();
      unsubscribeCollections();
      unsubscribeCommissions();
      unsubscribeHistory();
    };
  }, [user]);

  const toggleOnline = async () => {
    if (!user) return;
    setIsOnline(!isOnline);
    await updateDoc(doc(db, 'users', user.id), {
      isOnline: !isOnline
    });
  };

  const handleRegisterCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // 1. Add to collections history
      const collectionRef = await addDoc(collection(db, 'collections_history'), {
        ...registerForm,
        guepardoUid: user.id,
        createdAt: serverTimestamp()
      });

      // 2. Calculate Commission (Mock logic: 15% of exam price or fixed R$ 25)
      const commissionAmount = 25.00; 
      await addDoc(collection(db, 'commissions'), {
        collectionId: collectionRef.id,
        guepardoUid: user.id,
        amount: commissionAmount,
        description: `Comissão: ${registerForm.examName}`,
        createdAt: serverTimestamp()
      });

      // 3. Update Profile with Gamification Logic
      const newCollectionsToday = (profile?.collectionsToday || 0) + 1;
      const newTotalCollections = (profile?.totalCollections || 0) + 1;
      const pointsEarned = 50; // Each collection gives 50 points
      const newPoints = (profile?.points || 0) + pointsEarned;
      const currentBadges = profile?.badges || [];
      const newBadges = [...currentBadges];

      // Badge logic
      if (newTotalCollections === 1 && !newBadges.includes('Badge: Iniciante')) {
        newBadges.push('Badge: Iniciante');
      }
      if (newTotalCollections === 10 && !newBadges.includes('Badge: Veterano')) {
        newBadges.push('Badge: Veterano');
      }
      if (newCollectionsToday >= (profile?.dailyGoal || 10) && !newBadges.includes('Badge: Super Veloz')) {
        newBadges.push('Badge: Super Veloz');
      }

      // Level logic (simplified: 1 level every 500 points)
      const newLevel = Math.floor(newPoints / 500) + 1;

      await updateDoc(doc(db, 'guepardo_profiles', user.id), {
        totalEarnings: (profile?.totalEarnings || 0) + commissionAmount,
        collectionsToday: newCollectionsToday,
        totalCollections: newTotalCollections,
        points: newPoints,
        level: newLevel,
        badges: newBadges
      });

      setShowRegisterModal(false);
      setRegisterForm({ patientName: '', examName: '', protocol: '', notes: '', status: 'completed' });
    } catch (error) {
      console.error("Error registering collection:", error);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'collections_history', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em trânsito': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Coletado': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Problema na Coleta': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Finalizado': return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24">
      <SEO title="Portal Guepardo - Coleta Já" description="Painel exclusivo para coletores Guepardo." />

      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Bike size={24} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter">Portal Guepardo</h1>
            <p className="text-[10px] font-bold text-teal-500 uppercase tracking-widest">Elite de Coleta</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            )}
          </button>
          <div className="w-10 h-10 rounded-xl bg-gray-800 border border-white/10 overflow-hidden">
            <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}&background=0D9488&color=fff`} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-8 space-y-8">
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Status Toggle */}
            <div className={`p-6 rounded-[32px] transition-all duration-500 flex items-center justify-between ${isOnline ? 'bg-teal-600 shadow-2xl shadow-teal-500/20' : 'bg-gray-900 border border-white/5'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full animate-pulse ${isOnline ? 'bg-white' : 'bg-gray-600'}`}></div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-widest">{isOnline ? 'Você está Online' : 'Você está Offline'}</h2>
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{isOnline ? 'Recebendo chamados' : 'Ative para trabalhar'}</p>
                </div>
              </div>
              <button 
                onClick={toggleOnline}
                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${isOnline ? 'bg-white/20' : 'bg-gray-800'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-300 ${isOnline ? 'right-1 bg-white' : 'left-1 bg-gray-600'}`}></div>
              </button>
            </div>

            {/* Earnings Card */}
            <section className="bg-gray-900 rounded-[40px] p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all"></div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <DollarSign className="text-teal-500" size={20} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ganhos de Hoje</h3>
                </div>
                <TrendingUp className="text-teal-500" size={16} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-teal-500">R$</span>
                <span className="text-5xl font-black tracking-tighter">{(profile?.totalEarnings || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Coletas</p>
                  <p className="text-lg font-black">{profile?.collectionsToday || 0} <span className="text-[10px] text-gray-600">/ {profile?.dailyGoal || 10}</span></p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Meta Diária</p>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full" 
                      style={{ width: `${Math.min(((profile?.collectionsToday || 0) / (profile?.dailyGoal || 10)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowRegisterModal(true)}
                className="bg-teal-600 p-6 rounded-[32px] flex flex-col items-center justify-center gap-3 shadow-xl shadow-teal-500/20 hover:scale-105 transition-all"
              >
                <Plus size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Registrar Coleta</span>
              </button>
              <button 
                onClick={() => setActiveTab('schedule')}
                className="bg-gray-900 p-6 rounded-[32px] border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-gray-800 transition-all"
              >
                <ClipboardList size={24} className="text-teal-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Minha Agenda</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-6 rounded-[32px] border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="text-yellow-500" size={18} />
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Nível {profile?.level || 1}</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-black">{profile?.points || 0} <span className="text-[9px] text-gray-600">pts</span></p>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500" 
                      style={{ width: `${((profile?.points || 0) % 500) / 5}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 p-6 rounded-[32px] border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="text-teal-500" size={18} />
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Coletas</h4>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">{profile?.totalCollections || 0}</span>
                  <span className="text-[9px] font-bold text-gray-600 uppercase">Feitas</span>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            {profile?.badges && profile.badges.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2">Suas Conquistas</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.badges.map((badge: string) => (
                    <div key={badge} className="px-4 py-3 bg-gray-900 border border-white/5 rounded-2xl flex items-center gap-3 group hover:border-teal-500/30 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Award size={16} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tight">{badge.replace('Badge: ', '')}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Feedback & Ranking Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-6 rounded-[32px] border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="text-orange-500" size={18} />
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Feedback</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black">{profile?.hearts || 5.0}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < Math.floor(profile?.hearts || 5) ? 'fill-orange-500 text-orange-500' : 'text-gray-700'} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 p-6 rounded-[32px] border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="text-teal-500" size={18} />
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Ranking</h4>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">#3</span>
                  <span className="text-[9px] font-bold text-gray-600 uppercase">Bronze</span>
                </div>
              </div>
            </div>

            {/* DIRETRIZES DE ATIVAÇÃO DO CADASTRO */}
            <section className="bg-gradient-to-r from-teal-950/40 to-slate-900/40 p-6 rounded-[32px] border border-teal-500/10 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-teal-400" size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-400">Diretrizes de Manutenção do Cadastro</h3>
              </div>
              <div className="text-xs text-gray-400 space-y-2 font-medium leading-relaxed">
                <p>Para manter o seu cadastro como Guepardo ativo e apto para receber as melhores taxas, você deve seguir as regras da <strong className="text-teal-400">Coleta Já</strong>:</p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black uppercase text-gray-500">Mínimo Diário</p>
                    <p className="text-sm font-black text-white mt-1">2 Coletas</p>
                    <p className="text-[8.5px] text-gray-400 mt-0.5">Evita desativação</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black uppercase text-gray-500">Máximo Diário</p>
                    <p className="text-sm font-black text-amber-400 mt-1">12 Coletas</p>
                    <p className="text-[8.5px] text-gray-400 mt-0.5">Prevenção de fadiga</p>
                  </div>
                </div>
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-wider text-center pt-2">SEU STATUS HOJE: <span className={(profile?.collectionsToday || 0) >= 2 ? 'text-teal-400 font-extrabold' : 'text-amber-500 font-extrabold'}>{(profile?.collectionsToday || 0) >= 12 ? 'COMPLETO (FADIGA MAX)' : (profile?.collectionsToday || 0) >= 2 ? 'ATIVO & SEGURO' : 'PENDENTE MÍNIMO'}</span></p>
              </div>
            </section>

            {/* PROPOSTAS DISPONÍVEIS DA RODADA */}
            <section className="space-y-4 text-left">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Propostas "Coleta Já" do Momento</h3>
                <span className="bg-teal-500/10 text-teal-400 text-[9px] font-black uppercase px-2 py-1 rounded-md animate-pulse">Serviço Flash</span>
              </div>

              {availableProposals.length === 0 ? (
                <div className="p-8 bg-gray-950 rounded-[32px] border border-white/5 text-center">
                  <p className="text-xs text-gray-500 font-black uppercase">Nenhum chamado pendente no quadrante</p>
                  <p className="text-[10px] text-gray-600 mt-1">Ótimo trabalho! Você aceitou todos os chamados da área.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableProposals.map((prop) => (
                    <div key={prop.id} className="bg-[#111] p-6 rounded-[32px] border border-white/5 space-y-4 hover:border-teal-500/20 transition-all text-left">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-black text-white">{prop.name}</h4>
                          <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider">{prop.exam}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-teal-500">R$ {prop.value.toFixed(2)}</p>
                          <span className="text-[8px] text-gray-500 font-bold uppercase">{prop.distance} de você</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-2xl text-[10px] space-y-1">
                        <p className="text-gray-400"><strong className="text-gray-300">Endereço:</strong> {prop.address}</p>
                        <p className="text-gray-400"><strong className="text-gray-300">Agendado:</strong> {prop.scheduledTime}</p>
                        {prop.warning && <p className="text-amber-400/90 font-semibold">⚠️ {prop.warning}</p>}
                      </div>

                      <button
                        onClick={() => handleAcceptProposal(prop)}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-slate-950 font-black uppercase text-[10px] tracking-widest py-3.5 rounded-2xl transition shadow-lg shadow-teal-500/10"
                      >
                        Aceitar Coleta Flash
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* RANKING GERAL E DISPUTA DE PRÊMIOS */}
            <section className="bg-gray-900 rounded-[40px] p-6 border border-white/5 space-y-6 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="text-amber-400" size={18} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-500">Ranking Geral de Guepardos</h3>
                </div>
                <span className="text-[8px] font-black bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full uppercase tracking-wider">Prêmios em Dinheiro</span>
              </div>

              <div className="space-y-3">
                {rankingList.map((rankItem) => (
                  <div key={rankItem.rank} className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
                    rankItem.isMe 
                      ? 'bg-teal-500/10 border border-teal-500/30 shadow-inner' 
                      : 'bg-white/5 border border-transparent'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center ${
                        rankItem.rank === 1 ? 'bg-amber-400 text-slate-950' :
                        rankItem.rank === 2 ? 'bg-slate-300 text-slate-950' :
                        rankItem.rank === 3 ? 'bg-amber-700 text-white' :
                        'bg-white/5 text-gray-400'
                      }`}>
                        {rankItem.rank}
                      </span>
                      <div>
                        <h4 className="text-[11px] font-black uppercase text-white">{rankItem.name}</h4>
                        <p className="text-[8.5px] font-bold text-gray-500 uppercase">{rankItem.coletas} coletas • ⭐ {rankItem.rating}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      rankItem.rank <= 3 ? 'text-amber-400' : 'text-gray-500'
                    }`}>
                      {rankItem.reward}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[9px] text-center text-gray-500 font-bold uppercase leading-relaxed px-4">
                🚀 O Rank #1 recebe <strong className="text-amber-400">R$ 500</strong>, o Rank #2 recebe <strong className="text-amber-400">R$ 300</strong> e o Rank #3 recebe <strong className="text-amber-400">R$ 150</strong> adicionais no fechamento mensal!
              </p>
            </section>
          </motion.div>
        )}

        {activeTab === 'schedule' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-black uppercase tracking-tighter">Minha Agenda</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-900 rounded-xl border border-white/5 text-gray-400"><Filter size={16}/></button>
                <button className="p-2 bg-gray-900 rounded-xl border border-white/5 text-gray-400"><Search size={16}/></button>
              </div>
            </div>

            <div className="space-y-4">
              {myCollections.length > 0 ? myCollections.map((coll) => (
                <button 
                  key={coll.id}
                  onClick={() => setSelectedCollection(coll)}
                  className="w-full bg-gray-900 p-6 rounded-[32px] border border-white/5 text-left group hover:bg-gray-800 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-tight">{coll.name}</h4>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{coll.time} • {coll.date}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-[8px] font-black uppercase tracking-widest">Pendente</div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                    <MapPin size={12} className="text-teal-500" />
                    <span className="truncate">{coll.address}</span>
                  </div>
                </button>
              )) : (
                <div className="text-center py-20 bg-gray-900 rounded-[40px] border border-dashed border-white/10">
                  <Calendar className="mx-auto text-gray-700 mb-4" size={48} />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nenhuma coleta agendada</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'commissions' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="bg-teal-600 p-8 rounded-[40px] shadow-2xl shadow-teal-500/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-teal-100 mb-2">Total Acumulado</p>
              <h2 className="text-4xl font-black tracking-tighter">R$ {(profile?.totalEarnings || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
              <div className="mt-6 flex gap-4">
                <button className="flex-1 bg-white text-teal-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">Solicitar Saque</button>
                <button className="p-3 bg-white/20 rounded-2xl"><Activity size={20}/></button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Histórico de Comissões</h3>
              {commissions.map((comm) => (
                <div key={comm.id} className="bg-gray-900 p-5 rounded-[28px] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-tight">{comm.description}</h4>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{new Date(comm.createdAt?.seconds * 1000).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-teal-500">+ R$ {comm.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* INÍCIO DO SIMULADOR DE GANHOS LÍQUIDOS */}
            <div className="bg-gray-950 p-8 rounded-[40px] border border-white/10 space-y-6 mt-8">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-teal-400">Simulador de Ganhos Líquidos</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Calcule exatamente suas receitas descontando combustível, taxas e consumíveis</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs do Simulador */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[8.5px] font-black uppercase tracking-wider text-gray-400 mb-2">Veículo de Coleta</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['bike', 'moto', 'e-car'] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSimVehicle(v)}
                          className={`py-2 px-3 rounded-xl font-black uppercase text-[9px] tracking-widest border transition-all ${
                            simVehicle === v 
                              ? 'bg-teal-500 text-slate-950 border-teal-500' 
                              : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10'
                          }`}
                        >
                          {v === 'bike' ? 'Bicicleta' : v === 'moto' ? 'Moto' : 'Carro Elétr.'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-black uppercase tracking-wider text-gray-400 mb-1">
                      Coletas Diárias Previstas: <span className="text-teal-400 font-extrabold">{simCollections} coletas</span>
                    </label>
                    <input 
                      type="range" 
                      min="2" 
                      max="12" 
                      value={simCollections} 
                      onChange={(e) => setSimCollections(parseInt(e.target.value))}
                      className="w-full accent-teal-500 animate-pulse" 
                    />
                    <div className="flex justify-between text-[8px] text-gray-600 font-bold uppercase mt-0.5">
                      <span>Mín. cadastro (2)</span>
                      <span>Máx. Seguro (12)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-black uppercase tracking-wider text-gray-400 mb-1">
                      Distância Média p/ Coleta: <span className="text-teal-400 font-extrabold">{simDistance} km</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={simDistance} 
                      onChange={(e) => setSimDistance(parseInt(e.target.value))}
                      className="w-full accent-teal-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-black uppercase tracking-wider text-gray-400 mb-1">
                      Dias Trabalhados no Mês: <span className="text-teal-400 font-extrabold">{simWorkingDays} dias</span>
                    </label>
                    <input 
                      type="range" 
                      min="10" 
                      max="30" 
                      value={simWorkingDays} 
                      onChange={(e) => setSimWorkingDays(parseInt(e.target.value))}
                      className="w-full accent-teal-500" 
                    />
                  </div>
                </div>

                {/* Outputs do Simulador */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                  <div className="space-y-4 col-span-2">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Projeção Mensal de Ganhos</p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Faturamento Bruto</p>
                    <p className="text-lg font-black text-white mt-1">R$ {(simCollections * 25 * simWorkingDays).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[8px] font-black text-red-400 uppercase tracking-wider">Custos Operacionais</p>
                    <p className="text-lg font-black text-red-500 mt-1">
                      R$ {(((simDistance * (simVehicle === 'moto' ? 0.45 : simVehicle === 'e-car' ? 0.20 : 0.05) + 1.25) * simCollections + (simCollections * 25 * 0.05)) * simWorkingDays).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="col-span-2 bg-gradient-to-br from-teal-500/20 to-emerald-500/10 p-5 rounded-2xl border border-teal-500/30 text-center">
                    <p className="text-[9px] font-black text-teal-400 uppercase tracking-widest">Rendimento Líquido Estimado</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                      R$ {(
                        (simCollections * 25 * simWorkingDays) - 
                        (((simDistance * (simVehicle === 'moto' ? 0.45 : simVehicle === 'e-car' ? 0.20 : 0.05) + 1.25) * simCollections + (simCollections * 25 * 0.05)) * simWorkingDays)
                      ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[8px] text-gray-400 font-semibold uppercase mt-2">
                      Margem de Lucro Real: <span className="font-bold text-teal-400">~{Math.round((((simCollections * 25 * simWorkingDays) - (((simDistance * (simVehicle === 'moto' ? 0.45 : simVehicle === 'e-car' ? 0.20 : 0.05) + 1.25) * simCollections + (simCollections * 25 * 0.05)) * simWorkingDays)) / (simCollections * 25 * simWorkingDays)) * 100)}%</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* FIM DO SIMULADOR */}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-black uppercase tracking-tighter">Histórico de Coletas</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-900 rounded-xl border border-white/5 text-gray-400"><Search size={16}/></button>
              </div>
            </div>

            <div className="space-y-4">
              {history.length > 0 ? history.map((item) => (
                <div key={item.id} className="bg-gray-900 p-6 rounded-[32px] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-tight">{item.patientName}</h4>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                          {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : 'Recent'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(item.status || 'Finalizado')}`}>
                        {item.status || 'Finalizado'}
                      </div>
                      <select 
                        className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[8px] font-black uppercase tracking-widest outline-none focus:border-teal-500 transition-all"
                        value={item.status || 'Finalizado'}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      >
                        <option value="Em trânsito">Em trânsito</option>
                        <option value="Coletado">Coletado</option>
                        <option value="Problema na Coleta">Problema</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Exame</p>
                      <p className="text-[10px] font-bold uppercase truncate">{item.examName}</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Protocolo</p>
                      <p className="text-[10px] font-bold uppercase">{item.protocol || 'N/A'}</p>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Notas</p>
                      <p className="text-[10px] font-medium text-gray-400 italic">"{item.notes}"</p>
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-center py-20 bg-gray-900 rounded-[40px] border border-dashed border-white/10">
                  <Package className="mx-auto text-gray-700 mb-4" size={48} />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nenhuma coleta no histórico</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[32px] bg-gray-800 border-2 border-teal-500/30 p-1 mb-4">
                <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}&background=0D9488&color=fff`} alt="Profile" className="w-full h-full object-cover rounded-[28px]" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">{user?.name}</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{user?.email}</p>
              <div className="mt-4 px-4 py-1.5 bg-teal-600/10 text-teal-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-500/20">
                Guepardo Verificado
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-gray-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-gray-800 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 text-gray-400 flex items-center justify-center group-hover:text-teal-500 transition-colors">
                    <Settings size={20} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Configurações</span>
                </div>
                <ChevronRight size={18} className="text-gray-700" />
              </button>
              <button className="w-full bg-gray-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-gray-800 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 text-gray-400 flex items-center justify-center group-hover:text-teal-500 transition-colors">
                    <Award size={20} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Meus Certificados</span>
                </div>
                <ChevronRight size={18} className="text-gray-700" />
              </button>
              <button className="w-full bg-gray-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-gray-800 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 text-gray-400 flex items-center justify-center group-hover:text-teal-500 transition-colors">
                    <HelpCircle size={20} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Suporte</span>
                </div>
                <ChevronRight size={18} className="text-gray-700" />
              </button>
              <button 
                onClick={logout}
                className="w-full bg-red-500/10 p-5 rounded-3xl border border-red-500/10 flex items-center justify-between group hover:bg-red-500/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-red-500">Sair da Conta</span>
                </div>
                <ChevronRight size={18} className="text-red-500/30" />
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Register Collection Modal */}
      <AnimatePresence>
        {showRegisterModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-gray-900 rounded-[48px] p-10 w-full max-w-md border border-white/10 relative">
              <button onClick={() => setShowRegisterModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X size={24}/></button>
              
              <div className="mb-8">
                <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/20">
                  <Plus size={28} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Registrar Coleta</h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Informe os dados do atendimento</p>
              </div>

              <form onSubmit={handleRegisterCollection} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-2">Nome do Paciente</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-teal-500 outline-none transition-all"
                    placeholder="Nome completo"
                    value={registerForm.patientName}
                    onChange={(e) => setRegisterForm({...registerForm, patientName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-2">Exame Realizado</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-teal-500 outline-none transition-all"
                    placeholder="Ex: Hemograma Completo"
                    value={registerForm.examName}
                    onChange={(e) => setRegisterForm({...registerForm, examName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-2">Protocolo (Opcional)</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-teal-500 outline-none transition-all"
                    placeholder="MA-00000"
                    value={registerForm.protocol}
                    onChange={(e) => setRegisterForm({...registerForm, protocol: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-2">Notas / Observações</label>
                  <textarea 
                    className="w-full bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-teal-500 outline-none transition-all resize-none h-24"
                    placeholder="Ex: Paciente calmo, coleta difícil..."
                    value={registerForm.notes}
                    onChange={(e) => setRegisterForm({...registerForm, notes: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-2">Status Inicial</label>
                  <select 
                    className="w-full bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-teal-500 outline-none transition-all"
                    value={registerForm.status}
                    onChange={(e) => setRegisterForm({...registerForm, status: e.target.value})}
                  >
                    <option value="Em trânsito">Em trânsito</option>
                    <option value="Coletado">Coletado</option>
                    <option value="Problema na Coleta">Problema na Coleta</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-3">
                  Finalizar e Ganhar Comissão <ArrowRight size={16} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collection Detail Modal */}
      <AnimatePresence>
        {selectedCollection && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-gray-900 rounded-[48px] p-10 w-full max-w-md border border-white/10 relative">
              <button onClick={() => setSelectedCollection(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X size={24}/></button>
              
              <div className="mb-8">
                <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <Info size={28} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Detalhes da Coleta</h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Informações do Paciente</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Paciente</p>
                    <p className="text-xs font-black uppercase">{selectedCollection.name}</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Idade / Sexo</p>
                    <p className="text-xs font-black uppercase">{selectedCollection.age || '--'} anos • {selectedCollection.gender || '--'}</p>
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Endereço de Coleta</p>
                  <p className="text-xs font-black uppercase leading-relaxed">{selectedCollection.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">WhatsApp</p>
                    <p className="text-xs font-black text-teal-500">{selectedCollection.phone}</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Horário</p>
                    <p className="text-xs font-black">{selectedCollection.time}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 bg-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                    <Smartphone size={16} /> Ligar
                  </button>
                  <button className="flex-1 bg-gray-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                    <MapPin size={16} /> Rota
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-2xl border-t border-white/5 px-8 py-4 flex items-center justify-between z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-teal-500' : 'text-gray-500'}`}
        >
          <Bike size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Painel</span>
        </button>
        <button 
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'schedule' ? 'text-teal-500' : 'text-gray-500'}`}
        >
          <Calendar size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Agenda</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-teal-500' : 'text-gray-500'}`}
        >
          <ClipboardList size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Histórico</span>
        </button>
        <div className="relative -top-8">
          <button 
            onClick={() => setShowRegisterModal(true)}
            className="w-14 h-14 rounded-2xl bg-teal-600 text-white shadow-2xl shadow-teal-500/40 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
        <button 
          onClick={() => setActiveTab('commissions')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'commissions' ? 'text-teal-500' : 'text-gray-500'}`}
        >
          <DollarSign size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Ganhos</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-teal-500' : 'text-gray-500'}`}
        >
          <User size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default GuepardoPortal;
