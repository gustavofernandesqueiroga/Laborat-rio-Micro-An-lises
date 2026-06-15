
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Bell, 
  Send, 
  User, 
  Calendar, 
  Hash, 
  Lock,
  Loader2,
  ChevronRight,
  AlertCircle,
  Mail,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { PatientResult, ExamResult } from '../types';

const ResultsPortal: React.FC = () => {
  const { user, firebaseUser } = useAuth();
  const [protocol, setProtocol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<PatientResult | null>(null);
  const [recentResults, setRecentResults] = useState<PatientResult[]>([]);
  
  // Form states for new/edit
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [password, setPassword] = useState('');
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [newExamName, setNewExamName] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'results'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => doc.data() as PatientResult);
      setRecentResults(results);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!protocol) return;

    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'results', protocol);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as PatientResult;
        setCurrentResult(data);
        setPatientName(data.patientName);
        setPatientEmail(data.email || '');
        setPatientPhone(data.phone || '');
        setPassword(data.password || '');
        setExams(data.exams);
      } else {
        setError('Protocolo não encontrado. Você pode criar um novo abaixo.');
        setCurrentResult(null);
        // Pre-fill protocol for new entry
        setPatientName('');
        setExams([]);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar protocolo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protocol || !patientName) return;

    setLoading(true);
    setError(null);
    try {
      const resultData: PatientResult = {
        protocol,
        patientName,
        email: patientEmail,
        phone: patientPhone,
        password,
        date: new Date().toLocaleDateString('pt-BR'),
        exams,
        notified: currentResult?.notified || false
      };

      await setDoc(doc(db, 'results', protocol), resultData);
      setSuccess('Resultado salvo com sucesso!');
      setCurrentResult(resultData);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar resultado.');
    } finally {
      setLoading(false);
    }
  };

  const addExam = () => {
    if (!newExamName) return;
    const newExam: ExamResult = {
      id: Math.random().toString(36).substr(2, 9),
      name: newExamName,
      status: 'Em Processamento',
      date: new Date().toLocaleDateString('pt-BR')
    };
    setExams([...exams, newExam]);
    setNewExamName('');
  };

  const toggleExamStatus = (id: string) => {
    setExams(exams.map(exam => {
      if (exam.id === id) {
        return {
          ...exam,
          status: exam.status === 'Pronto' ? 'Em Processamento' : 'Pronto'
        };
      }
      return exam;
    }));
  };

  const removeExam = (id: string) => {
    setExams(exams.filter(exam => exam.id !== id));
  };

  const sendNotifications = async () => {
    if (!currentResult) return;
    
    // Check if at least one exam is ready
    const hasReadyExams = exams.some(e => e.status === 'Pronto');
    if (!hasReadyExams) {
      setError('Pelo menos um exame deve estar "Pronto" para notificar o cliente.');
      return;
    }

    setLoading(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const response = await fetch('/api/notify-result', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          protocol: currentResult.protocol,
          patientName: currentResult.patientName,
          email: patientEmail,
          phone: patientPhone
        })
      });

      if (response.ok) {
        setSuccess('Notificações enviadas com sucesso!');
        // Update notified status in DB
        await setDoc(doc(db, 'results', protocol), { ...currentResult, notified: true }, { merge: true });
        setCurrentResult({ ...currentResult, notified: true });
      } else {
        throw new Error('Falha ao enviar notificações');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao enviar notificações. Verifique os dados de contato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <SEO title="Portal de Resultados - Coleta Já" description="Registro e liberação de resultados de exames." />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Portal de Resultados</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1">Liberação e Notificação de Laudos</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operador</p>
                <p className="text-xs font-bold text-gray-900">{user?.name || 'Laboratório'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Recent & Search */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-teal-900/5">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                <Search size={18} className="text-teal-600" /> Buscar Protocolo
              </h2>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Número do Protocolo"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Localizar / Criar'}
                </button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-teal-900/5">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                <Clock size={18} className="text-orange-500" /> Registros Recentes
              </h2>
              <div className="space-y-3">
                {recentResults.map((res) => (
                  <button 
                    key={res.protocol}
                    onClick={() => {
                      setProtocol(res.protocol);
                      setCurrentResult(res);
                      setPatientName(res.patientName);
                      setPatientEmail(res.email || '');
                      setPatientPhone(res.phone || '');
                      setPassword(res.password || '');
                      setExams(res.exams);
                    }}
                    className="w-full p-4 rounded-2xl bg-gray-50 hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all text-left flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{res.patientName}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Prot: {res.protocol}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-teal-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Editor */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {currentResult || protocol ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-10 md:p-12 rounded-[48px] border border-gray-100 shadow-2xl shadow-teal-900/5"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <FileText size={28} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">
                          {currentResult ? 'Editar Resultado' : 'Novo Registro'}
                        </h2>
                        <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">Protocolo #{protocol}</p>
                      </div>
                    </div>
                    
                    {currentResult?.notified && (
                      <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={14} /> Cliente Notificado
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nome do Paciente</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            type="text" required
                            placeholder="Nome Completo"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Senha de Acesso</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            type="text" required
                            placeholder="Ex: 1234"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">E-mail para Notificação</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            type="email"
                            placeholder="paciente@email.com"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">WhatsApp para Notificação</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            type="tel"
                            placeholder="(83) 99999-9999"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Exames do Protocolo</h3>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Novo Exame..."
                            className="px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-100 transition-all outline-none font-bold text-xs"
                            value={newExamName}
                            onChange={(e) => setNewExamName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExam())}
                          />
                          <button 
                            type="button"
                            onClick={addExam}
                            className="p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {exams.map((exam) => (
                          <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                            <div className="flex items-center gap-4">
                              <button 
                                type="button"
                                onClick={() => toggleExamStatus(exam.id)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                  exam.status === 'Pronto' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-500'
                                }`}
                              >
                                {exam.status === 'Pronto' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                              </button>
                              <div>
                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{exam.name}</p>
                                <p className={`text-[9px] font-black uppercase tracking-widest ${
                                  exam.status === 'Pronto' ? 'text-emerald-600' : 'text-orange-500'
                                }`}>
                                  {exam.status}
                                </p>
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeExam(exam.id)}
                              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Plus size={18} className="rotate-45" />
                            </button>
                          </div>
                        ))}
                        {exams.length === 0 && (
                          <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                            <FileText className="mx-auto text-gray-200 mb-2" size={32} />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nenhum exame adicionado</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-teal-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-3"
                      >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle2 size={18} /> Salvar Alterações</>}
                      </button>
                      
                      <button 
                        type="button"
                        onClick={sendNotifications}
                        disabled={loading || !currentResult}
                        className="flex-1 bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <><Bell size={18} /> Notificar Cliente</>}
                      </button>
                    </div>
                  </form>

                  {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold flex items-center gap-2">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                  {success && (
                    <div className="mt-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} /> {success}
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="bg-white p-20 rounded-[48px] border border-gray-100 shadow-2xl shadow-teal-900/5 text-center">
                  <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                    <Search size={48} />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-4">Aguardando Seleção</h2>
                  <p className="text-gray-500 font-medium max-w-md mx-auto">
                    Busque por um número de protocolo ou selecione um registro recente na barra lateral para começar a gerenciar os resultados.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPortal;
