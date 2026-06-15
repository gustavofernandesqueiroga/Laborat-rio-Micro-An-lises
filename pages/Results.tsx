
import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, FileText, ExternalLink, HelpCircle, Download, CheckCircle2, Clock, AlertCircle, ChevronLeft, LogIn, Loader2, Heart } from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, getDoc, getDocFromServer } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from '../components/FeedbackModal';

interface ExamResult {
  id: string;
  name: string;
  status: 'Pronto' | 'Em Processamento';
  date: string;
  resultUrl?: string;
}

interface PatientResult {
  protocol: string;
  password?: string; // Optional in interface, but checked in logic
  patientName: string;
  date: string;
  exams: ExamResult[];
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const Results: React.FC = () => {
  const [protocol, setProtocol] = useState('');
  const [password, setPassword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [resultData, setResultData] = useState<PatientResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { firebaseUser: user, loading: authLoading } = useAuth();

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('protocolHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing history", e);
      }
    }
  }, []);

  const saveToHistory = (newProtocol: string) => {
    const updatedHistory = [
      newProtocol,
      ...searchHistory.filter(p => p !== newProtocol)
    ].slice(0, 5);
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('protocolHistory', JSON.stringify(updatedHistory));
  };

  // Test connection on mount
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    setError('Erro de permissão ou conexão. Verifique se você está logado.');
  };

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError("O popup foi bloqueado pelo navegador. Por favor, permita popups para este site ou abra o app em uma nova aba.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("A janela de login foi fechada antes da conclusão. Tente novamente.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError("Uma solicitação de login já estava em andamento. Aguarde um momento e tente novamente.");
      } else if (err.message && err.message.includes('INTERNAL ASSERTION FAILED')) {
        setError("Ocorreu um erro interno no sistema de login. Por favor, recarregue a página e tente novamente.");
      } else {
        setError("Falha ao autenticar com Google. Se o problema persistir, tente abrir o app em uma nova aba.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("Você precisa estar logado para consultar resultados.");
      return;
    }

    setIsSearching(true);
    setError(null);

    const path = `results/${protocol}`;
    try {
      const docRef = doc(db, 'results', protocol);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as PatientResult;
        // Check password (simple check for prototype)
        if (data.password === password) {
          setResultData(data);
          saveToHistory(protocol);
        } else {
          setError('Senha incorreta para este protocolo.');
        }
      } else {
        setError('Protocolo não encontrado. Verifique os dados e tente novamente.');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBack = () => {
    setResultData(null);
    setProtocol('');
    setPassword('');
    setError(null);
  };

  return (
    <div className="pt-6 md:pt-32 pb-16 md:pb-24 bg-gray-50 min-h-screen">
      <SEO 
        title="Consultar Resultados de Exames" 
        description="Acesse seus laudos laboratoriais com total segurança e sigilo através do portal do paciente da Coleta Já no Sertão Paraibano."
        keywords="resultados exames Sertão, laudo laboratório online PB, consulta exames Coleta Já, portal do paciente laboratório"
      />
      
      <div className="max-w-6xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {!resultData ? (
            <>
              <motion.div 
                key="search"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
              >
                <div className="lg:col-span-5 space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={14} /> Acesso Seguro LGPD
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                    Seus Resultados <br/><span className="text-teal-600">em um clique.</span>
                  </h1>
                  <p className="text-gray-500 text-lg leading-relaxed font-medium">
                    Utilize o protocolo e a senha fornecidos no momento da sua coleta para visualizar e baixar seus laudos. Garantimos a total privacidade dos seus dados clínicos.
                  </p>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex gap-4 p-5 bg-white rounded-3xl border border-teal-50 shadow-sm">
                      <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Histórico Completo</h4>
                        <p className="text-xs text-gray-500">Acesse exames anteriores realizados em qualquer unidade.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-5 bg-white rounded-3xl border border-teal-50 shadow-sm">
                      <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                        <HelpCircle size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Suporte Técnico</h4>
                        <p className="text-xs text-gray-500">Perdeu sua senha? Entre em contato com nossa central em João Pessoa.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="bg-white p-10 md:p-14 rounded-[50px] shadow-2xl shadow-teal-900/5 border border-teal-50">
                    <div className="text-center mb-10">
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2">Portal do Paciente</h2>
                      <div className="w-12 h-1.5 bg-teal-600 rounded-full mx-auto"></div>
                    </div>

                    <form onSubmit={handleConsult} className="space-y-6">
                      {!user && !authLoading && (
                        <div className="mb-6 p-6 bg-teal-50 rounded-3xl border border-teal-100 text-center">
                          <p className="text-xs font-bold text-teal-800 mb-4">Para sua segurança, faça login antes de consultar.</p>
                          <div className="flex flex-col gap-3">
                            <Link 
                              to="/login?redirect=/resultados"
                              className="flex items-center justify-center gap-2 w-full py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-teal-700 transition-all shadow-sm"
                            >
                              <LogIn size={16} /> Fazer Login
                            </Link>
                            <Link 
                              to="/cadastro"
                              className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline"
                            >
                              Não tem conta? Cadastre-se
                            </Link>
                          </div>
                        </div>
                      )}

                      <div>
                        <label htmlFor="protocol" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Protocolo de Identificação</label>
                        <div className="relative">
                          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-600/30" size={20} />
                          <input 
                            id="protocol"
                            required
                            disabled={!user}
                            type="text" 
                            placeholder="Ex: 1234"
                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold text-gray-800 disabled:opacity-50"
                            value={protocol}
                            onChange={(e) => setProtocol(e.target.value)}
                          />
                        </div>
                        
                        {searchHistory.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 px-2">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 mr-1">
                              <Clock size={10} /> Recentes:
                            </span>
                            {searchHistory.map((h) => (
                              <button
                                key={h}
                                type="button"
                                onClick={() => setProtocol(h)}
                                className="text-[9px] font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full hover:bg-teal-100 transition-colors"
                              >
                                {h}
                              </button>
                            ))}
                            <button 
                              type="button"
                              onClick={() => {
                                setSearchHistory([]);
                                localStorage.removeItem('protocolHistory');
                              }}
                              className="text-[8px] font-bold text-gray-400 hover:text-red-400 transition-colors uppercase tracking-widest ml-auto"
                            >
                              Limpar
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="pass" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Senha de Acesso</label>
                        <input 
                          id="pass"
                          required
                          disabled={!user}
                          type="password" 
                          placeholder="Dica: abcd"
                          className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold text-gray-800 disabled:opacity-50"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-4 rounded-xl"
                        >
                          <AlertCircle size={16} /> {error}
                        </motion.div>
                      )}

                      <div className="pt-4">
                        <button 
                          type="submit"
                          disabled={isSearching}
                          className="w-full bg-teal-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-teal-500/30 hover:bg-teal-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                        >
                          {isSearching ? (
                            <>Consultando... <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Search size={18} /></motion.div></>
                          ) : (
                            <>Acessar Resultados <ExternalLink size={18} /></>
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Problemas com o acesso?</p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="https://wa.me/558335340000" className="text-teal-600 font-black text-[10px] uppercase tracking-widest hover:text-teal-700 transition-colors">Falar com Atendente</a>
                        <span className="hidden sm:block text-gray-200">|</span>
                        <a href="tel:8335340000" className="text-gray-500 font-black text-[10px] uppercase tracking-widest hover:text-gray-700 transition-colors">(83) 3534-0000</a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-teal-600 font-black">01</div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Localize seu Protocolo</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">O número do protocolo está impresso no comprovante entregue após a coleta.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-teal-600 font-black">02</div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Insira sua Senha</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Sua senha é pessoal e intransferível, garantindo que apenas você acesse seus dados.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-teal-600 font-black">03</div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Baixe seu Laudo</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Visualize os resultados na tela ou baixe o arquivo PDF assinado digitalmente.</p>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <button 
                onClick={handleBack}
                className="mb-8 flex items-center gap-2 text-teal-600 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all"
              >
                <ChevronLeft size={16} /> Voltar para consulta
              </button>

              <div className="bg-white rounded-[50px] shadow-2xl shadow-teal-900/5 border border-teal-50 overflow-hidden">
                <div className="bg-teal-600 p-10 md:p-14 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Paciente</p>
                      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{resultData.patientName}</h2>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Protocolo: {resultData.protocol}</p>
                      <p className="text-sm font-bold">Data da Coleta: {resultData.date}</p>
                    </div>
                  </div>
                </div>

                <div className="p-10 md:p-14">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                    <FileText className="text-teal-600" size={24} /> Lista de Exames
                  </h3>

                  <div className="space-y-4">
                    {resultData.exams.map((exam, index) => (
                      <motion.div 
                        key={exam.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-teal-100 transition-colors gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${exam.status === 'Pronto' ? 'bg-teal-100 text-teal-600' : 'bg-orange-100 text-orange-500'}`}>
                            {exam.status === 'Pronto' ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 300, 
                                  damping: 15,
                                  delay: 0.1
                                }}
                              >
                                <CheckCircle2 size={20} />
                              </motion.div>
                            ) : (
                              <Clock size={20} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 uppercase tracking-tight text-sm">{exam.name}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status: {exam.status}</p>
                          </div>
                        </div>

                        {exam.status === 'Pronto' ? (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 border border-teal-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                          >
                            <Download size={14} /> Baixar Laudo
                          </motion.button>
                        ) : (
                          <div className="px-6 py-3 bg-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                            Aguardando Liberação
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-12 p-8 bg-teal-50 rounded-[32px] border border-teal-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white text-teal-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">Documento Assinado Digitalmente</h4>
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Válido em todo território nacional</p>
                      </div>
                    </div>
                    <button className="w-full md:w-auto bg-teal-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all">
                      Baixar Todos (ZIP)
                    </button>
                  </div>

                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => setIsFeedbackOpen(true)}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-orange-50 text-orange-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-100 transition-all"
                    >
                      <Heart size={16} /> Avaliar Atendimento
                    </button>
                  </div>
                </div>
              </div>

              <FeedbackModal 
                isOpen={isFeedbackOpen} 
                onClose={() => setIsFeedbackOpen(false)} 
                serviceType="Consulta de Resultados"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Results;
