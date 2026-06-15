
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle2, 
  Search,
  Filter,
  Info,
  Phone,
  ArrowRight,
  Loader2,
  Mail,
  FileDown,
  Database,
  ShieldCheck,
  FileText,
  Smartphone,
  Upload,
  X,
  TrendingUp,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { SERVICES, UNITS, CHECKUPS, EXAM_PREPS, ESTIMATED_TIMES } from '../constants';
import { UnitType } from '../types';
import SEO from '../components/SEO';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, 
  Tag, 
  Ticket, 
  Percent,
  ChevronDown
} from 'lucide-react';

type Step = 'type' | 'prescription' | 'triage' | 'service' | 'upsell' | 'details' | 'checkout' | 'confirm' | 'success';

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

interface TriageQuestion {
  id: string;
  question: string;
  options: string[];
  answer?: string;
}

const Scheduling: React.FC = () => {
  const { firebaseUser: user, loading: authLoading } = useAuth();
  const [step, setStep] = useState<Step>('type');

  const [serviceSearch, setServiceSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocolId, setProtocolId] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [waitlistSlot, setWaitlistSlot] = useState<string | null>(null);
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [agreeLGPD, setAgreeLGPD] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CASH' | 'CARD_MACHINE' | 'PREPAID'>('PIX');
  const [prepaidMethod, setPrepaidMethod] = useState<'PIX' | 'BOLETO' | 'CARD'>('PIX');
  const [cashAmount, setCashAmount] = useState<string>('');
  const [changeAmount, setChangeAmount] = useState<number>(0);
  const [installments, setInstallments] = useState<number>(1);
  const [pixReceipt, setPixReceipt] = useState<File | null>(null);
  
  // Prescription & Analysis State
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [missingExams, setMissingExams] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [hasPrescription, setHasPrescription] = useState<boolean | null>(null);

  // Triage State
  const [triageQuestions, setTriageQuestions] = useState<TriageQuestion[]>([
    { id: 'fasting', question: 'Você está em jejum de pelo menos 8 horas?', options: ['Sim', 'Não', 'Não sei'] },
    { id: 'medication', question: 'Está fazendo uso de algum medicamento contínuo?', options: ['Sim', 'Não'] },
    { id: 'fever', question: 'Teve febre ou sintomas gripais nas últimas 48h?', options: ['Sim', 'Não'] },
    { id: 'surgery', question: 'Realizou alguma cirurgia nos últimos 30 dias?', options: ['Sim', 'Não'] },
  ]);

  const [formData, setFormData] = useState({
    type: '' as 'HOME' | 'LAB' | '',
    serviceIds: [] as string[],
    unitId: '',
    address: '',
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    city: 'João Pessoa',
    date: new Date().toISOString().split('T')[0],
    time: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    specialNeeds: false,
    observations: ''
  });

  // Keep address synchronized with individual fields
  useEffect(() => {
    if (formData.type === 'HOME') {
      const parts = [
        formData.street,
        formData.number,
        formData.neighborhood,
        formData.complement,
        formData.city
      ].filter(part => !!part);
      
      const fullAddress = parts.join(', ');
      if (fullAddress !== formData.address) {
        setFormData(prev => ({ ...prev, address: fullAddress }));
      }
    }
  }, [formData.street, formData.number, formData.neighborhood, formData.complement, formData.city, formData.type]);

  const [error, setError] = useState<string | null>(null);
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
    setError('Erro ao salvar agendamento. Verifique sua conexão e se está logado.');
  };

  const categories = ['Todos', 'Checkup', 'Sangue', 'Outros'];
  const popularTerms = ['Hemograma', 'Glicemia', 'HCG', 'Urina'];

  const allServices = useMemo(() => [
    ...SERVICES, 
    ...CHECKUPS.map(c => ({...c, category: 'Checkup'}))
  ], []);

  const filteredServices = useMemo(() => {
    return allServices.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || 
                           s.id.toLowerCase().includes(serviceSearch.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || (s as any).category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allServices, serviceSearch, activeCategory]);

  const selectedServices = allServices.filter(s => formData.serviceIds.includes(s.id));

  const subtotal = useMemo(() => {
    return selectedServices.reduce((acc, s) => {
      const priceStr = s.price.replace('R$ ', '').replace('.', '').replace(',', '.');
      return acc + parseFloat(priceStr);
    }, 0);
  }, [selectedServices]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  useEffect(() => {
    if (paymentMethod === 'CASH' && cashAmount) {
      const amount = parseFloat(cashAmount.replace(',', '.'));
      if (!isNaN(amount) && amount >= total) {
        setChangeAmount(amount - total);
      } else {
        setChangeAmount(0);
      }
    }
  }, [cashAmount, paymentMethod, total]);

  const selectedUnit = UNITS.find(u => u.id === formData.unitId);
  const prepInfo = EXAM_PREPS.find(p => selectedServices.some(s => s.name === p.exam));

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Remove Brazilian country code if pasted with +55
    if (value.startsWith('55') && (value.length === 12 || value.length === 13)) {
      value = value.slice(2);
    }
    
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = '';
    if (value.length > 0) {
      formatted = `(${value.slice(0, 2)}`;
      if (value.length > 2) {
        formatted += `) `;
        if (value.length <= 10) {
          // Format (XX) XXXX-XXXX (Landline)
          formatted += value.slice(2, 6);
          if (value.length > 6) {
            formatted += `-${value.slice(6)}`;
          }
        } else {
          // Format (XX) XXXXX-XXXX (Mobile)
          formatted += value.slice(2, 7);
          if (value.length > 7) {
            formatted += `-${value.slice(7)}`;
          }
        }
      }
    }
    
    setFormData({...formData, phone: formatted});
  };

  const generateProfessionalPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const primaryColor = [13, 148, 136]; 
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 45, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('MICRO ANÁLISES', margin, 20);
      doc.setFontSize(9);
      doc.text('PROTOCOLOU DE AGENDAMENTO DIGITAL', margin, 30);

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(12);
      doc.text('DADOS DO AGENDAMENTO', margin, 60);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Paciente: ${formData.name}`, margin, 75);
      doc.text(`Exames: ${selectedServices.map(s => s.name).join(', ')}`, margin, 83);
      doc.text(`Data: ${formData.date} às ${formData.time}`, margin, 91);
      doc.text(`Local: ${formData.type === 'HOME' ? 'Coleta Guepardo' : selectedUnit?.name}`, margin, 99);
      doc.text(`Protocolo: ${protocolId}`, margin, 107);

      doc.save(`Protocolo_${protocolId}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);
    
    const generatedProtocol = `MA-${Math.floor(Math.random() * 90000) + 10000}`;
    const path = 'appointments';

    try {
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        protocolId: generatedProtocol,
        userUid: user?.uid || 'guest',
        isGuest: !user,
        createdAt: serverTimestamp(),
        reminderSent: false,
        payment: {
          method: paymentMethod,
          prepaidType: paymentMethod === 'PREPAID' ? prepaidMethod : null,
          cashAmount: paymentMethod === 'CASH' ? cashAmount : null,
          changeAmount: paymentMethod === 'CASH' ? changeAmount : null,
          installments: paymentMethod === 'PREPAID' && prepaidMethod === 'CARD' ? installments : 1,
          total: total,
          subtotal: subtotal,
          discount: discountAmount,
          coupon: isCouponApplied ? couponCode : null,
          status: 'pending'
        }
      });

      setProtocolId(generatedProtocol);
      setStep('success');
      setEmailStatus('sending');
      setTimeout(() => setEmailStatus('sent'), 2000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinWaitlist = async () => {
    if (!waitlistSlot) return;
    
    // If guest, we need to ensure they filled contact info in the modal
    if (!user && (!formData.name || !formData.phone || !formData.email)) {
      setError("Por favor, preencha seus dados de contato para entrar na lista de espera.");
      return;
    }

    setIsJoiningWaitlist(true);
    setError(null);
    
    try {
      await addDoc(collection(db, 'waitlist'), {
        type: formData.type,
        serviceIds: formData.serviceIds,
        unitId: formData.unitId,
        address: formData.address,
        date: formData.date,
        time: waitlistSlot,
        name: user?.displayName || formData.name,
        phone: formData.phone || '',
        email: user?.email || formData.email,
        userUid: user?.uid || 'guest',
        isGuest: !user,
        specialNeeds: formData.specialNeeds,
        observations: formData.observations,
        createdAt: serverTimestamp()
      });
      
      setWaitlistSuccess(true);
      setWaitlistSlot(null);
    } catch (err) {
      console.error("Erro ao entrar na lista de espera:", err);
      setError("Erro ao entrar na lista de espera. Tente novamente.");
    } finally {
      setIsJoiningWaitlist(false);
    }
  };

  const applyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase().trim();
    if (!code) return;

    if (code === 'COLETA10') {
      const discount = subtotal * 0.1;
      setDiscountAmount(discount);
      setIsCouponApplied(true);
    } else if (code === 'PRIMEIRACOLETA') {
      setDiscountAmount(20);
      setIsCouponApplied(true);
    } else {
      setCouponError('Cupom inválido ou expirado.');
      setIsCouponApplied(false);
      setDiscountAmount(0);
    }
  };

  const isStepValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isPhoneValid = (phone: string) => {
      if (!phone) return true; // Optional!
      const cleanDigits = phone.replace(/\D/g, '');
      return cleanDigits.length >= 8; // Accept simple unformatted or formatted number
    };
    const today = new Date().toISOString().split('T')[0];

    switch (step) {
      case 'type': return !!formData.type;
      case 'prescription': return hasPrescription !== null;
      case 'triage': return triageQuestions.every(q => !!q.answer);
      case 'service': return formData.serviceIds.length > 0;
      case 'details': 
        return !!formData.date && 
               formData.date >= today &&
               !!formData.time && 
               (formData.type === 'LAB' ? !!formData.unitId : (!!formData.street && !!formData.number && !!formData.neighborhood));
      case 'confirm': 
        return formData.name.trim().split(' ').length >= 2 && 
               !!formData.age &&
               !!formData.gender &&
               isPhoneValid(formData.phone) && 
               emailRegex.test(formData.email) &&
               agreeLGPD;
      default: return true;
    }
  };

  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescriptionFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPrescriptionPreview(reader.result as string);
      reader.readAsDataURL(file);
      analyzePrescription(file);
    }
  };

  const analyzePrescription = async (file: File) => {
    setIsAnalyzing(true);
    setMissingExams([]);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: 'analyze_prescription',
            data: { base64: base64Data, mimeType: file.type }
          })
        });

        if (!response.ok) throw new Error('AI Analysis failed');
        
        const result = await response.json();
        const detectedExams: string[] = result.exams || [];
        
        const matchedIds: string[] = [];
        const notFound: string[] = [];
        
        detectedExams.forEach(name => {
          const normalized = name.toLowerCase();
          const matched = allServices.find(s => 
            s.name.toLowerCase().includes(normalized) || 
            normalized.includes(s.name.toLowerCase())
          );
          
          if (matched) {
            if (!matchedIds.includes(matched.id)) matchedIds.push(matched.id);
          } else {
            notFound.push(name);
          }
        });
        
        if (matchedIds.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            serviceIds: [...new Set([...prev.serviceIds, ...matchedIds])] 
          }));
        }
        
        setMissingExams(notFound);
        setIsAnalyzing(false);
        setStep('triage');
      };
    } catch (error) {
      console.error("Erro na análise:", error);
      setIsAnalyzing(false);
      setStep('triage');
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    if (!formData.date) return [];

    const selectedDate = new Date(formData.date + 'T00:00:00');
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    const isSunday = selectedDate.getDay() === 0;
    
    // Unidades costumam fechar mais cedo ou nem abrir aos domingos
    if (isSunday && formData.type === 'LAB') {
      const unit = UNITS.find(u => u.id === formData.unitId);
      if (unit && !unit.name.includes('24h')) return []; 
    }

    const start = formData.type === 'HOME' ? 5 : (formData.type === 'LAB' ? 6.5 : 6); 
    const end = formData.type === 'HOME' ? 10 : (formData.type === 'LAB' ? 17 : 18); 
    const interval = formData.type === 'HOME' ? 20 : 10;
    
    const dateSeed = Math.floor(selectedDate.getTime() / 86400000);
    const unitSeed = formData.unitId ? formData.unitId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 42;
    const finalSeed = dateSeed + unitSeed;

    const pseudoRandom = (t: number) => {
      const x = Math.sin(finalSeed + t) * 10000;
      return x - Math.floor(x);
    };

    for (let h_exact = start; h_exact < end; h_exact += interval/60) {
      const h = Math.floor(h_exact);
      const m = Math.round((h_exact - h) * 60);
      
      const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const timeVal = h_exact;
      
      let isFull = false;
      if (formData.type === 'HOME') {
        isFull = pseudoRandom(timeVal) > 0.5; 
      } else {
        const isPeak = (h >= 7 && h <= 9);
        const threshold = isPeak ? 0.3 : 0.7;
        isFull = pseudoRandom(timeVal) > threshold;
      }

      slots.push({ time, isFull });
    }
    return slots;
  };

  const timeSlots = useMemo(() => generateTimeSlots(), [formData.date, formData.unitId, formData.type]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <SEO 
        title="Agendamento Online de Exames" 
        description="Agende seus exames laboratoriais online em João Pessoa com a Coleta Já. Escolha entre coleta domiciliar Guepardo ou Smart Units."
        keywords="agendar exame sangue João Pessoa, marcação exames online JP, coleta domiciliar agendamento, laboratório João Pessoa agendar"
      />

      {/* Instructions Popup */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative"
            >
              <button onClick={() => setShowInstructions(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Info size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">Como enviar sua receita?</h3>
              <ul className="space-y-4 text-gray-600 font-medium">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                  <p>Tire uma foto nítida do pedido médico original.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                  <p>Certifique-se de que o nome do paciente e os exames estão legíveis.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                  <p>O arquivo pode ser imagem (JPG/PNG) ou PDF.</p>
                </li>
              </ul>
              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full mt-8 bg-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                Entendi, vamos lá!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Summary Mobile */}
      <AnimatePresence>
        {formData.type && step !== 'success' && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-[72px] left-0 right-0 bg-white/80 backdrop-blur-md z-[90] border-b border-teal-100 p-3 lg:hidden flex items-center justify-between px-6 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                {formData.type === 'HOME' ? <Bike size={16}/> : <MapPin size={16}/>}
              </div>
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase leading-none">Agendando</p>
                <p className="text-[10px] font-black text-gray-800 truncate max-w-[150px]">
                  {selectedServices.length > 0 
                    ? selectedServices.map(s => s.name).join(', ') 
                    : 'Selecione o Exame'}
                </p>
              </div>
            </div>
            {step !== 'type' && (
              <button onClick={() => setStep('type')} className="text-[9px] font-black text-teal-600 uppercase border border-teal-200 px-3 py-1 rounded-lg">Alterar</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className={`${step === 'success' ? 'lg:col-span-12' : 'lg:col-span-8'}`}>
          
          {step !== 'success' && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
                {['type', 'prescription', 'triage', 'service', 'upsell', 'details', 'confirm'].map((s, idx) => {
                  const steps = ['type', 'prescription', 'triage', 'service', 'upsell', 'details', 'confirm'];
                  const currentIdx = steps.indexOf(step);
                  const isPast = idx < currentIdx;
                  const isCurrent = idx === currentIdx;
                  return (
                    <React.Fragment key={s}>
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center text-[10px] sm:text-xs font-black transition-all duration-500 ${
                          isCurrent ? 'bg-teal-600 text-white shadow-xl shadow-teal-500/30 scale-110' : 
                          isPast ? 'bg-teal-100 text-teal-600' : 'bg-white text-gray-300 border border-gray-100'
                        }`}>
                          {isPast ? <CheckCircle2 size={16} className="sm:size-[18px]" /> : idx + 1}
                        </div>
                      </div>
                      {idx < 6 && (
                        <div className="w-4 sm:w-8 h-1 sm:h-1.5 rounded-full bg-gray-100 overflow-hidden shrink-0">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: isPast ? '100%' : '0%' }}
                            className="h-full bg-teal-600"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: Tipo Atendimento */}
            {step === 'type' && (
              <motion.div 
                key="type"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="mb-8 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Onde prefere ser atendido?</h1>
                  <p className="text-gray-500 font-medium text-sm sm:text-base">Escolha a praticidade do Guepardo ou visite nossas unidades.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <button 
                    onClick={() => { setFormData({...formData, type: 'HOME'}); setStep('prescription'); }}
                    className={`group p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[40px] border-2 transition-all text-left shadow-2xl shadow-teal-900/5 hover:scale-[1.02] flex flex-col justify-between min-h-[240px] sm:h-[280px] ${
                      formData.type === 'HOME' ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-transparent hover:border-teal-100'
                    }`}
                  >
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6 ${
                      formData.type === 'HOME' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'
                    }`}>
                      <Bike size={24} className="sm:size-32" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black mb-1 sm:mb-2 uppercase tracking-tight">Guepardo em Casa</h3>
                      <p className={`text-xs sm:text-sm leading-relaxed font-medium mb-4 ${formData.type === 'HOME' ? 'text-teal-50' : 'text-gray-500'}`}>
                        Coleta domiciliar monitorada por GPS. Levamos o laboratório até você.
                      </p>
                      
                      <div className={`mb-6 p-3 rounded-2xl flex items-center gap-3 ${formData.type === 'HOME' ? 'bg-white/10' : 'bg-gray-50'}`}>
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-teal-600 shadow-sm">
                          <Clock size={16} />
                        </div>
                        <div>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${formData.type === 'HOME' ? 'text-white' : 'text-gray-400'}`}>Estimativa</p>
                          <p className={`text-sm font-black ${formData.type === 'HOME' ? 'text-white' : 'text-teal-600'}`}>{ESTIMATED_TIMES.HOME.average}</p>
                        </div>
                      </div>

                      <div className={`inline-flex items-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${
                        formData.type === 'HOME' ? 'bg-white text-teal-600' : 'bg-teal-50 text-teal-600'
                      }`}>
                        Selecionar <ArrowRight size={14} className="ml-2" />
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setFormData({...formData, type: 'LAB'}); setStep('prescription'); }}
                    className={`group p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[40px] border-2 transition-all text-left shadow-2xl shadow-teal-900/5 hover:scale-[1.02] flex flex-col justify-between min-h-[280px] sm:h-[320px] ${
                      formData.type === 'LAB' ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-transparent hover:border-teal-100'
                    }`}
                  >
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6 ${
                      formData.type === 'LAB' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-600'
                    }`}>
                      <MapPin size={24} className="sm:size-32" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black mb-1 sm:mb-2 uppercase tracking-tight">Unidade Física</h3>
                      <p className={`text-xs sm:text-sm leading-relaxed font-medium mb-4 ${formData.type === 'LAB' ? 'text-teal-50' : 'text-gray-500'}`}>
                        Atendimento em nossas Smart Units em João Pessoa e região.
                      </p>

                      <div className={`mb-6 p-3 rounded-2xl flex items-center gap-3 ${formData.type === 'LAB' ? 'bg-white/10' : 'bg-gray-50'}`}>
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-teal-600 shadow-sm">
                          <Clock size={16} />
                        </div>
                        <div>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${formData.type === 'LAB' ? 'text-white' : 'text-gray-400'}`}>Estimativa</p>
                          <p className={`text-sm font-black ${formData.type === 'LAB' ? 'text-white' : 'text-teal-600'}`}>{ESTIMATED_TIMES.LAB.average}</p>
                        </div>
                      </div>

                      <div className={`inline-flex items-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${
                        formData.type === 'LAB' ? 'bg-white text-teal-600' : 'bg-teal-50 text-teal-600'
                      }`}>
                        Selecionar <ArrowRight size={14} className="ml-2" />
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Receita */}
            {step === 'prescription' && (
              <motion.div 
                key="prescription"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Você possui receita?</h2>
                  <button onClick={() => setStep('type')} className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2 self-start"><ChevronLeft size={14}/> Voltar</button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <button 
                      onClick={() => setHasPrescription(true)}
                      className={`w-full p-6 sm:p-8 rounded-[2rem] sm:rounded-[40px] border-2 text-left transition-all flex flex-col items-center justify-center gap-4 ${
                        hasPrescription === true ? 'bg-teal-600 border-teal-600 text-white shadow-xl' : 'bg-white border-transparent hover:border-teal-100'
                      }`}
                    >
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${hasPrescription === true ? 'bg-white/20' : 'bg-teal-50 text-teal-600'}`}>
                        <FileText size={28} className="sm:size-32" />
                      </div>
                      <span className="font-black uppercase tracking-widest text-xs sm:text-sm">Sim, tenho receita</span>
                    </button>
                    
                    <AnimatePresence>
                      {hasPrescription === true && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4"
                        >
                          <div className="relative">
                            <input 
                              type="file" 
                              id="prescription-upload"
                              className="hidden" 
                              onChange={handlePrescriptionUpload}
                              accept="image/*,application/pdf"
                            />
                            <label 
                              htmlFor="prescription-upload"
                              className="w-full flex flex-col items-center justify-center p-8 border-4 border-dashed border-teal-100 rounded-[32px] cursor-pointer hover:bg-teal-50 transition-all group"
                            >
                              {isAnalyzing ? (
                                <div className="flex flex-col items-center gap-3">
                                  <Loader2 className="animate-spin text-teal-600" size={32} />
                                  <p className="text-[10px] font-black uppercase text-teal-600">Analisando com Jajá AI...</p>
                                </div>
                              ) : prescriptionPreview ? (
                                <div className="flex flex-col items-center gap-3">
                                  <CheckCircle2 className="text-teal-600" size={32} />
                                  <p className="text-[10px] font-black uppercase text-teal-600">Arquivo Carregado</p>
                                </div>
                              ) : (
                                <>
                                  <Upload className="text-teal-400 group-hover:scale-110 transition-transform mb-2" size={32} />
                                  <p className="text-[10px] font-black uppercase text-gray-400 text-center">Clique para enviar ou arraste o arquivo</p>
                                </>
                              )}
                            </label>
                          </div>
                          <button 
                            onClick={() => setShowInstructions(true)}
                            className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-teal-600 uppercase tracking-widest"
                          >
                            <Info size={14} /> Instruções de envio
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    onClick={() => { setHasPrescription(false); setStep('triage'); }}
                    className={`p-8 rounded-[40px] border-2 text-left transition-all flex flex-col items-center justify-center gap-4 h-fit ${
                      hasPrescription === false ? 'bg-teal-600 border-teal-600 text-white shadow-xl' : 'bg-white border-transparent hover:border-teal-100'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${hasPrescription === false ? 'bg-white/20' : 'bg-orange-50 text-orange-600'}`}>
                      <AlertCircle size={32} />
                    </div>
                    <span className="font-black uppercase tracking-widest text-sm">Não tenho receita</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Triagem */}
            {step === 'triage' && (
              <motion.div 
                key="triage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Triagem Rápida</h2>
                  <button onClick={() => setStep('prescription')} className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2 self-start"><ChevronLeft size={14}/> Voltar</button>
                </div>

                <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[48px] shadow-2xl shadow-teal-900/5 border border-teal-50 space-y-6 sm:space-y-8">
                  {triageQuestions.map((q, idx) => (
                    <div key={q.id} className="space-y-3 sm:space-y-4">
                      <p className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-tight">{idx + 1}. {q.question}</p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {q.options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => {
                              const newQuestions = [...triageQuestions];
                              newQuestions[idx].answer = opt;
                              setTriageQuestions(newQuestions);
                            }}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                              q.answer === opt ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button 
                    disabled={!isStepValid()}
                    onClick={() => setStep('service')}
                    className="w-full bg-teal-600 text-white py-5 sm:py-6 rounded-[2rem] sm:rounded-[2.5rem] font-black uppercase tracking-widest text-xs sm:text-sm shadow-2xl shadow-teal-500/20 hover:bg-teal-700 transition-all disabled:opacity-30 flex items-center justify-center gap-2 sm:gap-3"
                  >
                    Próximo Passo <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Seleção Exame */}
            {step === 'service' && (
              <motion.div 
                key="service"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Qual o exame?</h2>
                  <button onClick={() => setStep('triage')} className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2 self-start"><ChevronLeft size={14}/> Voltar</button>
                </div>

                <AnimatePresence>
                  {missingExams.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-orange-50 border border-orange-200 rounded-3xl p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white text-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-tight mb-1">Aviso da Jajá AI</h4>
                          <p className="text-[10px] font-medium text-gray-600 leading-relaxed uppercase tracking-widest">
                            Pedimos desculpas, mas não localizamos os seguintes exames em nossa lista atual: <span className="text-orange-600 font-black">{missingExams.join(', ')}</span>.
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                            Pré-selecionamos os demais exames da receita para você. Você pode buscar manualmente se houver algum erro de leitura.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group">
                  <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-teal-600 transition-colors size-5 sm:size-6" />
                  <input 
                    type="text"
                    placeholder="Busque por exame..."
                    className="w-full pl-12 sm:pl-16 pr-6 sm:pr-12 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-teal-50 shadow-xl shadow-teal-900/5 outline-none focus:ring-4 focus:ring-teal-100 transition-all font-bold text-base sm:text-lg text-gray-800"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeCategory === cat ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'bg-white text-gray-400 hover:text-teal-600 border border-teal-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredServices.map(service => {
                    const isSelected = formData.serviceIds.includes(service.id);
                    return (
                      <button 
                        key={service.id}
                        onClick={() => {
                          if (activeCategory === 'Todos') {
                            const newIds = isSelected 
                              ? formData.serviceIds.filter(id => id !== service.id)
                              : [...formData.serviceIds, service.id];
                            setFormData({...formData, serviceIds: newIds});
                          } else {
                            // In other categories, maybe keep single selection or allow multiple too?
                            // User specifically mentioned "Todos", but usually it's better to be consistent.
                            // Let's allow multiple in all categories for better UX.
                            const newIds = isSelected 
                              ? formData.serviceIds.filter(id => id !== service.id)
                              : [...formData.serviceIds, service.id];
                            setFormData({...formData, serviceIds: newIds});
                          }
                        }}
                        className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${
                          isSelected ? 'bg-teal-600 border-teal-600 text-white shadow-xl' : 'bg-white border-transparent hover:border-teal-100'
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-5">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/20' : 'bg-teal-50 text-teal-600'}`}>
                            {isSelected ? <CheckCircle2 size={18} /> : <Filter size={18} />}
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-1 leading-none ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>Cód: {service.id}</p>
                            <h4 className="font-black text-base sm:text-lg leading-tight uppercase tracking-tight truncate">{service.name}</h4>
                          </div>
                        </div>
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-white text-teal-600' : 'bg-gray-50 text-gray-300'}`}>
                          {isSelected ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {formData.serviceIds.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4"
                  >
                    <button 
                      onClick={() => {
                        const hasUpsell = CHECKUPS.some(combo => 
                          combo.exams.some(examName => 
                            selectedServices.some(s => s.name.toLowerCase().includes(examName.toLowerCase()))
                          )
                        );
                        if (hasUpsell && formData.serviceIds.length < 3) {
                          setStep('upsell');
                        } else {
                          setStep('details');
                        }
                      }}
                      className="w-full bg-teal-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-3"
                    >
                      Continuar com {formData.serviceIds.length} {formData.serviceIds.length === 1 ? 'exame' : 'exames'} <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP: Upsell */}
            {step === 'upsell' && (
              <motion.div 
                key="upsell"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <TrendingUp size={14} /> Oferta Especial Detectada
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                    Potencialize seu <br/><span className="text-teal-600 italic">Check-up</span>
                  </h2>
                  <p className="text-gray-500 font-medium max-w-md mx-auto text-sm sm:text-base">
                    Notamos seus exames selecionados. Que tal aproveitar um de nossos combos com até **25% de desconto**?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {CHECKUPS.slice(0, 3).map((combo) => (
                    <div 
                      key={combo.id}
                      className="bg-white rounded-[2.5rem] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl shadow-teal-900/10 border border-teal-50 relative overflow-hidden group hover:border-teal-200 transition-all"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-teal-50 rounded-bl-[80px] sm:rounded-bl-[100px] -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 group-hover:bg-teal-100 transition-colors" />
                      
                      <div className="relative">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-2">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight leading-tight">{combo.name}</h3>
                            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{combo.exams.join(' + ')}</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] sm:text-xs text-gray-400 line-through font-bold leading-none mb-1">{combo.oldPrice}</p>
                            <p className="text-2xl sm:text-3xl font-black text-teal-600 leading-none">{combo.price}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <button 
                            onClick={() => {
                              const comboServiceIds = SERVICES
                                .filter(s => combo.exams.some(e => s.name.toLowerCase().includes(e.toLowerCase())))
                                .map(s => s.id);
                              
                              setFormData({
                                ...formData, 
                                serviceIds: [...new Set([...formData.serviceIds, ...comboServiceIds])]
                              });
                              setStep('details');
                            }}
                            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20"
                          >
                            Adicionar ao Agendamento
                          </button>
                          <button 
                            onClick={() => setStep('details')}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-gray-50 text-gray-400 font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-gray-50 transition-all"
                          >
                            Pular Oferta
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center pb-10">
                  <button 
                    onClick={() => setStep('details')}
                    className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] hover:text-teal-600 transition-colors"
                  >
                    Não, obrigado. Quero continuar com meus exames originais.
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Detalhes Data/Unidade */}
            {step === 'details' && (
              <motion.div 
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 sm:space-y-10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Quando será?</h2>
                  <button onClick={() => setStep('service')} className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2 self-start"><ChevronLeft size={14}/> Alterar Exame</button>
                </div>

                {formData.type === 'LAB' && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Onde você prefere ser atendido?</p>
                    <div className="relative group">
                      <select 
                        value={formData.unitId}
                        onChange={(e) => setFormData({...formData, unitId: e.target.value})}
                        className="w-full pl-14 pr-10 py-5 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white border border-teal-50 shadow-xl appearance-none font-bold text-gray-800 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                      >
                        <option value="" disabled>Selecione uma Unidade Smart</option>
                        {UNITS.filter(u => u.type !== UnitType.AUTONOMOUS).map(unit => (
                          <option key={unit.id} value={unit.id}>{unit.name} — {unit.address}</option>
                        ))}
                      </select>
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-600" size={20} />
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-hover:text-teal-600 transition-colors" size={20} />
                    </div>
                  </div>
                )}

                {formData.type === 'HOME' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-8 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Rua / Logradouro</label>
                        <div className="relative group">
                          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-600/30 group-focus-within:text-teal-600 transition-colors" size={20} />
                          <input 
                            type="text" 
                            placeholder="Nome da rua ou avenida"
                            className="w-full pl-14 pr-6 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-teal-50 shadow-xl outline-none font-bold text-sm sm:text-base text-gray-800 focus:ring-4 focus:ring-teal-100 transition-all"
                            value={formData.street}
                            onChange={(e) => setFormData({...formData, street: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-4 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Número</label>
                        <input 
                          type="text" 
                          placeholder="Nº"
                          className="w-full px-6 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-teal-50 shadow-xl outline-none font-bold text-sm sm:text-base text-gray-800 focus:ring-4 focus:ring-teal-100 transition-all"
                          value={formData.number}
                          onChange={(e) => setFormData({...formData, number: e.target.value})}
                        />
                      </div>

                      <div className="md:col-span-6 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Bairro</label>
                        <input 
                          type="text" 
                          placeholder="Bairro"
                          className="w-full px-6 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white border border-teal-50 shadow-xl outline-none font-bold text-sm sm:text-base text-gray-800 focus:ring-4 focus:ring-teal-100 transition-all"
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                        />
                      </div>

                      <div className="md:col-span-6 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Complemento</label>
                        <input 
                          type="text" 
                          placeholder="Apto, Bloco, Casa..."
                          className="w-full px-6 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white border border-teal-50 shadow-xl outline-none font-bold text-sm sm:text-base text-gray-800 focus:ring-4 focus:ring-teal-100 transition-all"
                          value={formData.complement}
                          onChange={(e) => setFormData({...formData, complement: e.target.value})}
                        />
                      </div>

                      <div className="md:col-span-12 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Cidade</label>
                        <input 
                          type="text" 
                          placeholder="Cidade"
                          className="w-full px-6 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2.5rem] bg-slate-100 border-none outline-none font-bold text-sm sm:text-base text-gray-400 cursor-not-allowed"
                          value={formData.city}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Escolha o Dia</label>
                    <div className="relative group">
                      <button 
                        type="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className={`w-full pl-14 pr-6 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white border shadow-xl outline-none font-bold text-sm sm:text-base text-gray-800 transition-all text-left flex items-center ${
                          formData.date && formData.date < new Date().toISOString().split('T')[0] ? 'border-red-300 ring-4 ring-red-100' : 'border-teal-50 focus:ring-4 focus:ring-teal-100'
                        }`}
                      >
                        <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-600" size={20} />
                        {formData.date ? new Date(formData.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Selecionar data'}
                      </button>
                      {formData.date && formData.date < new Date().toISOString().split('T')[0] && (
                        <p className="text-[9px] sm:text-[10px] font-bold text-red-500 ml-4 mt-2">Data inválida (passado).</p>
                      )}

                      <AnimatePresence>
                        {showCalendar && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 mt-2 p-2 sm:p-4 bg-white rounded-3xl shadow-2xl border border-teal-50 w-full md:w-auto min-w-[300px] left-0 right-0 sm:left-auto"
                          >
                            <Calendar 
                              onChange={(val: any) => {
                                const d = val as Date;
                                const formatted = d.toISOString().split('T')[0];
                                setFormData({...formData, date: formatted, time: ''});
                                setShowCalendar(false);
                              }}
                              value={formData.date ? new Date(formData.date + 'T00:00:00') : new Date()}
                              minDate={new Date()}
                              className="border-none font-sans w-full"
                              locale="pt-BR"
                            />
                            <button 
                              onClick={() => setShowCalendar(false)}
                              className="mt-4 w-full py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-teal-600 transition-colors"
                            >
                              Fechar Calendário
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Escolha o Horário Disponível</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                      {timeSlots.map(slot => (
                        <button
                          key={slot.time}
                          onClick={() => {
                            if (slot.isFull) {
                              setWaitlistSlot(slot.time);
                            } else {
                              setFormData({...formData, time: slot.time});
                            }
                          }}
                          className={`relative h-12 sm:h-14 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all overflow-hidden ${
                            formData.time === slot.time 
                              ? 'bg-teal-600 text-white shadow-lg' 
                              : slot.isFull 
                                ? 'bg-gray-100 text-gray-400 border border-red-100' 
                                : 'bg-white text-gray-600 border border-teal-50 hover:border-teal-200'
                          }`}
                        >
                          {slot.time}
                          {slot.isFull && (
                            <div className="absolute inset-x-0 bottom-0 bg-red-500 text-[7px] sm:text-[8px] text-white py-0.5 font-black uppercase leading-none">
                              X
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Waitlist Modal */}
                <AnimatePresence>
                  {waitlistSlot && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative"
                      >
                        <button onClick={() => setWaitlistSlot(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                          <X size={24} />
                        </button>
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                          <Clock size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">Horário Indisponível</h3>
                        <p className="text-gray-600 font-medium mb-8">
                          O horário de **{waitlistSlot}** no dia **{formData.date}** está lotado. Deseja entrar na lista de espera para ser notificado caso haja um cancelamento?
                        </p>
                        
                        {!user && (
                          <div className="space-y-4 mb-8">
                            <p className="text-[10px] font-black uppercase tracking-widest text-teal-600">Seus dados para contato:</p>
                            <input 
                              type="text" 
                              placeholder="Nome Completo"
                              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all font-bold text-gray-800 text-sm"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <input 
                              type="tel" 
                              placeholder="WhatsApp"
                              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all font-bold text-gray-800 text-sm"
                              value={formData.phone}
                              onChange={handlePhoneChange}
                            />
                            <input 
                              type="email" 
                              placeholder="E-mail"
                              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all font-bold text-gray-800 text-sm"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                          </div>
                        )}

                        <div className="space-y-4">
                          <button 
                            onClick={handleJoinWaitlist}
                            disabled={isJoiningWaitlist}
                            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-3"
                          >
                            {isJoiningWaitlist ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                            Entrar na Lista de Espera
                          </button>
                          <button 
                            onClick={() => setWaitlistSlot(null)}
                            className="w-full py-4 rounded-2xl border-2 border-gray-100 text-gray-400 font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
                          >
                            Escolher outro horário
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Waitlist Success Modal */}
                <AnimatePresence>
                  {waitlistSuccess && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative text-center"
                      >
                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                          <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">Você está na lista!</h3>
                        <p className="text-gray-600 font-medium mb-10">
                          Confirmamos sua entrada na lista de espera. Se o horário de **{formData.time}** (ou o solicitado) ficar disponível, entraremos em contato imediatamente via WhatsApp e E-mail.
                        </p>
                        <button 
                          onClick={() => setWaitlistSuccess(false)}
                          className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all"
                        >
                          Entendi
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  disabled={!isStepValid()}
                  onClick={() => setStep('checkout')}
                  className="w-full bg-teal-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-teal-500/20 hover:bg-teal-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  Continuar Agendamento <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {/* STEP: Checkout */}
            {step === 'checkout' && (
              <motion.div 
                key="checkout"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Checkout</h2>
                  <button onClick={() => setStep('details')} className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2 self-start"><ChevronLeft size={14}/> Voltar</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Service List */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-teal-900/5 border border-teal-50">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <CreditCard size={18} className="text-teal-600" /> Itens Selecionados
                      </h3>
                      <div className="space-y-4">
                        {selectedServices.map((service) => (
                          <div key={service.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm font-black text-[10px]">
                                {service.id}
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">{service.name}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{service.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-teal-600">{service.price}</p>
                              <button 
                                onClick={() => setFormData(prev => ({...prev, serviceIds: prev.serviceIds.filter(id => id !== service.id)}))}
                                className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors mt-1"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-teal-900/5 border border-teal-50">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Ticket size={18} className="text-teal-600" /> Cupom de Desconto
                      </h3>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            type="text" 
                            placeholder="CÓDIGO DO CUPOM"
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all font-black text-xs uppercase tracking-widest"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                        </div>
                        <button 
                          onClick={applyCoupon}
                          className="px-8 py-4 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-teal-600 transition-all shadow-lg"
                        >
                          Aplicar
                        </button>
                      </div>
                      {couponError && <p className="text-[10px] font-bold text-red-500 mt-2 ml-2">{couponError}</p>}
                      {isCouponApplied && <p className="text-[10px] font-bold text-green-600 mt-2 ml-2">Cupom aplicado com sucesso!</p>}
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-teal-900/5 border border-teal-50">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <CreditCard size={18} className="text-teal-600" /> Método de Pagamento
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: 'PIX', label: 'PIX', icon: <Percent size={18} /> },
                          { id: 'PREPAID', label: 'Antecipado', icon: <Tag size={18} /> },
                          { id: 'CARD_MACHINE', label: 'Maquininha', icon: <CreditCard size={18} /> },
                          { id: 'CASH', label: 'Dinheiro', icon: <Percent size={18} /> },
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as any)}
                            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                              paymentMethod === method.id 
                                ? 'bg-teal-600 border-teal-600 text-white shadow-lg scale-105' 
                                : 'bg-gray-50 border-transparent text-gray-400 hover:border-teal-100'
                            }`}
                          >
                            {method.icon}
                            <span className="text-[9px] font-black uppercase tracking-widest">{method.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                        {paymentMethod === 'PIX' && (
                          <div className="space-y-4">
                            <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100 text-center">
                              <p className="text-[10px] font-black text-teal-800 uppercase tracking-widest mb-2">Chave PIX (CNPJ)</p>
                              <p className="text-xl font-black text-teal-600">00.123.456/0001-99</p>
                              <p className="text-[9px] font-bold text-teal-700/60 uppercase tracking-tight mt-2">Valide seu comprovante nos totens da unidade ou envie para o Guepardo no momento da coleta.</p>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Anexar Comprovante (Opcional)</label>
                              <input 
                                type="file" 
                                accept="image/*,.pdf" 
                                onChange={(e) => setPixReceipt(e.target.files?.[0] || null)}
                                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 text-xs font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-teal-600 file:text-white"
                              />
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'PREPAID' && (
                          <div className="space-y-6">
                            <div className="flex gap-2">
                              {['PIX', 'BOLETO', 'CARD'].map(m => (
                                <button
                                  key={m}
                                  onClick={() => setPrepaidMethod(m as any)}
                                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                    prepaidMethod === m ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-400'
                                  }`}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                            {prepaidMethod === 'CARD' && (
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Parcelamento (Sem Juros)</label>
                                <select 
                                  value={installments}
                                  onChange={(e) => setInstallments(Number(e.target.value))}
                                  className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all font-bold text-xs text-gray-800"
                                >
                                  <option value={1}>À vista (R$ {total.toFixed(2)})</option>
                                  <option value={2}>2x de R$ {(total/2).toFixed(2)}</option>
                                  <option value={3}>3x de R$ {(total/3).toFixed(2)}</option>
                                </select>
                              </div>
                            )}
                          </div>
                        )}

                        {paymentMethod === 'CASH' && (
                          <div className="space-y-4">
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Quanto você vai entregar ao Guepardo?</label>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-sm">R$</span>
                                  <input 
                                    type="text" 
                                    placeholder="0,00"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all font-black text-gray-800"
                                    value={cashAmount}
                                    onChange={(e) => setCashAmount(e.target.value)}
                                  />
                                </div>
                             </div>
                             {changeAmount > 0 && (
                               <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                 <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Troco previsto</span>
                                 <span className="text-sm font-black text-emerald-600">R$ {changeAmount.toFixed(2).replace('.', ',')}</span>
                               </div>
                             )}
                          </div>
                        )}

                        {paymentMethod === 'CARD_MACHINE' && (
                          <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                            <CreditCard className="mx-auto text-orange-500 mb-3" size={24} />
                            <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Pague na hora da coleta</p>
                            <p className="text-[9px] font-medium text-orange-700/60 uppercase tracking-tight mt-1">O Guepardo levará a maquininha até você. Aceitamos débito e crédito.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-teal-900/10 border border-teal-50 sticky top-32">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Resumo do Pedido</h3>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                          <span>Subtotal</span>
                          <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between items-center text-xs font-bold text-red-500 uppercase tracking-widest">
                            <span className="flex items-center gap-2"><Percent size={14} /> Desconto</span>
                            <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                          </div>
                        )}
                        <div className="pt-4 border-t border-dashed border-gray-100">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total a pagar</p>
                              <h4 className="text-3xl font-black text-gray-900 leading-none">R$ {total.toFixed(2).replace('.', ',')}</h4>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-1 rounded-md">Economize R$ {discountAmount.toFixed(2).replace('.', ',')}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-2xl mb-8 space-y-2">
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          <CalendarIcon size={12} /> Data do atendimento
                        </div>
                        <p className="text-xs font-black text-gray-800 uppercase">{formData.date} às {formData.time}</p>
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mt-3">
                          <MapPin size={12} /> Local escolhido
                        </div>
                        <p className="text-xs font-black text-gray-800 uppercase">
                          {formData.type === 'HOME' ? 'Atendimento no Endereço Fornecido' : (selectedUnit?.name || 'Unidade não selecionada')}
                        </p>
                        
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mt-3">
                          <Clock size={12} /> Tempo Estimado
                        </div>
                        <p className="text-xs font-black text-teal-600 uppercase">
                          {formData.type === 'HOME' ? ESTIMATED_TIMES.HOME.average : ESTIMATED_TIMES.LAB.average}
                        </p>
                      </div>

                      <button 
                        disabled={selectedServices.length === 0}
                        onClick={() => setStep('confirm')}
                        className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 hover:bg-teal-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        Ir para Identificação <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Identidade */}
            {step === 'confirm' && (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Quem é o paciente?</h2>
                  <button onClick={() => setStep('checkout')} className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2 self-start"><ChevronLeft size={14}/> Voltar</button>
                </div>

                <form onSubmit={handleFinish} className="space-y-6 sm:space-y-8 bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[48px] shadow-2xl shadow-teal-900/5 border border-teal-50">
                  {!user && (
                    <div className="p-6 sm:p-8 bg-teal-50 rounded-[2rem] sm:rounded-[32px] border border-teal-100 text-center space-y-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                        <LogIn size={20} className="sm:size-24" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-[11px] sm:text-sm uppercase tracking-tight leading-tight">Quer agilizar seu agendamento?</h4>
                      <p className="text-[9px] sm:text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-relaxed">
                        Acesse sua conta para preenchimento automático.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                        <Link 
                          to="/login?redirect=/agendamento"
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-teal-700 transition-all shadow-sm"
                        >
                          <LogIn size={14} className="sm:size-16" /> Entrar
                        </Link>
                        <Link 
                          to="/cadastro"
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-teal-100 text-teal-600 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-teal-50 transition-all"
                        >
                          Cadastrar
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nome Completo</label>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-600/30 group-focus-within:text-teal-600 transition-colors" size={20} />
                        <input 
                          required
                          type="text" 
                          placeholder="Digite seu nome completo"
                          className={`w-full pl-14 pr-6 py-4 sm:py-5 rounded-2xl bg-gray-50 border transition-all font-bold text-gray-800 text-sm sm:text-base ${
                            formData.name && formData.name.trim().split(' ').length < 2 ? 'border-red-300 focus:ring-red-100' : 'border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100'
                          }`}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      {formData.name && formData.name.trim().split(' ').length < 2 && (
                        <p className="text-[9px] sm:text-[10px] font-bold text-red-500 ml-4">Insira nome e sobrenome.</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Idade</label>
                        <input 
                          required
                          type="number" 
                          placeholder="Ex: 25"
                          className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all font-bold text-gray-800"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Sexo</label>
                        <select 
                          required
                          className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all font-bold text-gray-800 appearance-none"
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        >
                          <option value="">Selecione</option>
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                          <option value="O">Outro</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">WhatsApp</label>
                      <div className="relative">
                        <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-600/30" size={20} />
                        <input 
                          type="tel" 
                          placeholder="(83) 90000-0000 (Opcional)"
                          className={`w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border transition-all font-bold text-gray-800 ${
                            formData.phone && formData.phone.replace(/\D/g, '').length < 8 ? 'border-red-300 focus:ring-red-100' : 'border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100'
                          }`}
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          maxLength={15}
                        />
                      </div>
                      {formData.phone && formData.phone.replace(/\D/g, '').length < 8 && (
                        <p className="text-[10px] font-bold text-red-500 ml-4">Por favor insira um WhatsApp telefônico válido (mínimo 8 dígitos) ou deixe vazio.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-600/30" size={20} />
                      <input 
                        required
                        type="email" 
                        placeholder="seu@email.com"
                        className={`w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border transition-all font-bold text-gray-800 ${
                          formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'border-red-300 focus:ring-red-100' : 'border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100'
                        }`}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                      <p className="text-[10px] font-bold text-red-500 ml-4">Por favor, insira um e-mail válido.</p>
                    )}
                  </div>

                  <div className="space-y-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 p-6 bg-orange-50 rounded-[32px] border border-orange-100">
                      <div className="w-12 h-12 bg-white text-orange-500 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <AlertCircle size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <label htmlFor="special-needs" className="font-black text-gray-900 text-xs uppercase tracking-tight cursor-pointer">
                            Paciente necessita de cuidados especiais?
                          </label>
                          <input 
                            type="checkbox" 
                            id="special-needs"
                            className="w-6 h-6 text-orange-500 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                            checked={formData.specialNeeds}
                            onChange={(e) => setFormData({...formData, specialNeeds: e.target.checked})}
                          />
                        </div>
                        <p className="text-[10px] font-medium text-orange-700 mt-1 uppercase tracking-widest">
                          Ex: Dificuldade de locomoção, autismo, idoso acamado, etc.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Observações Adicionais</label>
                      <textarea 
                        rows={4}
                        placeholder="Detalhe aqui qualquer informação importante para nossa equipe técnica..."
                        className="w-full px-6 py-5 rounded-3xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all font-bold text-gray-800 text-sm resize-none"
                        value={formData.observations}
                        onChange={(e) => setFormData({...formData, observations: e.target.value})}
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                    <input 
                      type="checkbox" 
                      id="lgpd-scheduling"
                      className="mt-1 w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                      checked={agreeLGPD}
                      onChange={(e) => setAgreeLGPD(e.target.checked)}
                    />
                    <label htmlFor="lgpd-scheduling" className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-tight">
                      Eu concordo com o tratamento dos meus dados de saúde conforme a <Link to="/compliance" className="text-teal-600 underline">LGPD</Link> e aceito os <Link to="/compliance" className="text-teal-600 underline">Termos de Uso</Link> da Coleta Já.
                    </label>
                  </div>

                  <div className="pt-6">
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-2 text-xs font-bold">
                        <AlertCircle size={16} /> {error}
                      </div>
                    )}
                    <button 
                      type="submit"
                      disabled={isSubmitting || !isStepValid()}
                      className="w-full bg-orange-accent text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-orange-500/30 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                    >
                      {isSubmitting ? (
                        <>Sincronizando... <Loader2 className="animate-spin" size={24} /></>
                      ) : (
                        <>Finalizar Agendamento <CheckCircle2 size={24} /></>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 5: Sucesso */}
            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <CheckCircle2 size={48} className="animate-bounce" />
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Agendado com <br/><span className="text-teal-600 italic">Sucesso!</span></h2>
                
                <div className="max-w-2xl mx-auto bg-white p-10 md:p-14 rounded-[60px] shadow-2xl shadow-teal-900/10 border border-teal-50 relative overflow-hidden mb-12 text-left">
                  <div className="absolute top-0 left-0 w-full h-2 bg-teal-600"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10 border-b border-gray-100 pb-10">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Protocolo Digital</span>
                      <p className="text-3xl font-black text-teal-600 leading-none">{protocolId}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                         emailStatus === 'sent' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                       }`}>
                         {emailStatus === 'sending' ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
                         {emailStatus === 'sent' ? 'E-mail Enviado' : 'Enviando E-mail'}
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-teal-600 shrink-0"><User size={20}/></div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Paciente</p>
                          <p className="text-sm font-black text-gray-800 uppercase">{formData.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-teal-600 shrink-0"><CalendarIcon size={20}/></div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Data / Hora</p>
                          <p className="text-sm font-black text-gray-800">{formData.date} às {formData.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-teal-600 shrink-0"><FileText size={20}/></div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Exames</p>
                          <p className="text-sm font-black text-gray-800 uppercase">{selectedServices.map(s => s.name).join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-teal-600 shrink-0"><MapPin size={20}/></div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Local</p>
                          <p className="text-sm font-black text-gray-800 uppercase truncate">{formData.type === 'HOME' ? 'Guepardo em Casa' : selectedUnit?.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-teal-600 shrink-0"><Clock size={20}/></div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tempo de Coleta</p>
                          <p className="text-sm font-black text-teal-600 uppercase">
                            {formData.type === 'HOME' ? ESTIMATED_TIMES.HOME.average : ESTIMATED_TIMES.LAB.average}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={generateProfessionalPDF}
                    disabled={isGeneratingPdf}
                    className="px-10 py-5 bg-teal-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-teal-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isGeneratingPdf ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />} 
                    Baixar Protocolo PDF
                  </button>
                  <button 
                    onClick={() => window.location.href = '#/'}
                    className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-600 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
                  >
                    Voltar para Home
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Lado Direito: Resumo (Desktop) */}
        {step !== 'success' && (
          <aside className="hidden lg:block lg:col-span-4 sticky top-32 h-fit">
            <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-teal-900/5 border border-teal-50">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8 pb-4 border-b border-gray-50 flex items-center gap-2">
                <FileText size={16} className="text-teal-600" /> Resumo
              </h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${formData.type ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}>
                    {formData.type === 'HOME' ? <Bike size={20} /> : <MapPin size={20} />}
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Local</p>
                    <p className="text-[11px] font-black text-gray-800 leading-tight">
                      {formData.type ? (formData.type === 'HOME' ? 'Domiciliar Guepardo' : 'Unidade Física') : 'Aguardando...'}
                    </p>
                  </div>
                </div>

                {formData.type && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white shadow-lg flex items-center justify-center shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimativa de Tempo</p>
                      <p className="text-[11px] font-black text-gray-800 leading-tight">
                        {formData.type === 'HOME' ? ESTIMATED_TIMES.HOME.average : ESTIMATED_TIMES.LAB.average}
                      </p>
                      <p className="text-[8px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">* {formData.type === 'HOME' ? ESTIMATED_TIMES.HOME.historicalBasis : ESTIMATED_TIMES.LAB.historicalBasis}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${formData.serviceIds.length > 0 ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}>
                    <Filter size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Exames</p>
                    <p className="text-[11px] font-black text-gray-800 leading-tight">
                      {selectedServices.length > 0 ? selectedServices.map(s => s.name).join(', ') : 'Aguardando...'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${formData.date ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}>
                    <CalendarIcon size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Data/Hora</p>
                    <p className="text-[11px] font-black text-gray-800 leading-tight">
                      {formData.date ? `${formData.date} às ${formData.time}` : 'Aguardando...'}
                    </p>
                  </div>
                </div>
              </div>

              {prepInfo && (
                <div className="mt-8 p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-start gap-4">
                  <AlertCircle size={20} className="text-orange-500 shrink-0" />
                  <div>
                    <p className="text-[9px] font-black text-orange-600 uppercase mb-1">Dica de Preparo</p>
                    <p className="text-[10px] font-medium text-orange-800 leading-tight">{prepInfo.instructions[0]}</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #0d9488; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: #f1f5f9; }
      `}</style>
    </div>
  );
};

export default Scheduling;
