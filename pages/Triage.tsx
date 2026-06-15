
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Stethoscope, 
  ClipboardList, 
  Clock,
  ArrowRight,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import SEO from '../components/SEO';

interface TriageResult {
  patientName: string | null;
  exams: string[];
  doctorName: string | null;
  doctorCRM: string | null;
  suggestedPrep: string;
}

const Triage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setError('Por favor, selecione uma imagem ou PDF.');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type.startsWith('image/') || droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setError('Por favor, selecione uma imagem ou PDF.');
      }
    }
  };

  const analyzePrescription = async () => {
    if (!file || !previewUrl) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const base64Data = previewUrl.split(',')[1];
      const mimeType = file.type;

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'analyze_prescription_full',
          data: { base64: base64Data, mimeType: mimeType }
        })
      });

      if (!response.ok) throw new Error('AI Analysis failed');

      const parsedResult = await response.json();
      setResult(parsedResult);
    } catch (err: any) {
      console.error("Erro na triagem:", err);
      setError("Ocorreu um erro ao analisar o pedido médico. Por favor, tente novamente ou digite manualmente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="pt-32 pb-24 bg-[#fcfdfd] min-h-screen">
      <SEO 
        title="Triagem Inteligente - Coleta Já" 
        description="Envie seu pedido médico e deixe nossa IA extrair os exames e preparos automaticamente para você."
      />

      <div className="max-w-4xl mx-auto px-6">
        <header className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <Sparkles size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-4"
          >
            Triagem <span className="text-teal-600">Inteligente</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium text-lg max-w-2xl mx-auto"
          >
            Envie uma foto do seu pedido médico e o Jajá AI organizará tudo para o seu agendamento em segundos.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 gap-10">
          {!result ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-teal-900/5 border border-teal-50"
            >
              {!file ? (
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-teal-50 rounded-[32px] p-12 text-center cursor-pointer hover:border-teal-200 hover:bg-teal-50/30 transition-all group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />
                  <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload size={40} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Arraste ou Clique</h3>
                  <p className="text-gray-500 font-medium">Selecione a foto do pedido médico (JPG, PNG ou PDF)</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="relative rounded-[32px] overflow-hidden border border-teal-100 shadow-lg aspect-[4/3] max-h-[400px] bg-gray-50">
                    {file.type === 'application/pdf' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-teal-600">
                        <FileText size={80} />
                        <p className="mt-4 font-black uppercase tracking-widest text-xs">{file.name}</p>
                      </div>
                    ) : (
                      <img src={previewUrl!} alt="Preview" className="w-full h-full object-contain" />
                    )}
                    <button 
                      onClick={reset}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <button 
                    onClick={analyzePrescription}
                    disabled={isAnalyzing}
                    className="w-full bg-teal-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        Analisando com Jajá AI...
                      </>
                    ) : (
                      <>
                        Iniciar Triagem <Search size={20} />
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-teal-900/5 border border-teal-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                      <CheckCircle2 size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Triagem Concluída</h2>
                  </div>
                  <button onClick={reset} className="text-gray-400 hover:text-teal-600 font-black uppercase tracking-widest text-[10px]">Nova Triagem</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Paciente */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <User size={14} /> Paciente
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-lg font-black text-gray-900">{result.patientName || 'Não identificado'}</p>
                    </div>
                  </div>

                  {/* Médico */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <Stethoscope size={14} /> Médico Solicitante
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-lg font-black text-gray-900">{result.doctorName || 'Não identificado'}</p>
                      {result.doctorCRM && <p className="text-xs font-bold text-teal-600 uppercase mt-1">CRM: {result.doctorCRM}</p>}
                    </div>
                  </div>
                </div>

                {/* Exames */}
                <div className="mt-10 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <ClipboardList size={14} /> Exames Identificados
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.exams.map((exam, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <span className="text-sm font-bold text-gray-700">{exam}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preparo */}
                <div className="mt-10 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <Clock size={14} /> Preparo Sugerido
                  </div>
                  <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                    <p className="text-sm font-bold text-gray-700 leading-relaxed">{result.suggestedPrep}</p>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-gray-50">
                  <button className="w-full bg-gray-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-teal-600 transition-all flex items-center justify-center gap-3">
                    Seguir para Agendamento <ArrowRight size={20} />
                  </button>
                  <p className="text-center mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Jajá AI UX & Legal - Construindo o futuro da saúde com segurança e design.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info Section */}
          <div className="bg-teal-900 rounded-[40px] p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
                <Sparkles size={48} className="text-teal-400" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Como funciona a Triagem?</h3>
                <p className="text-teal-100/70 text-sm font-medium leading-relaxed">
                  Nossa inteligência artificial analisa a caligrafia e os termos médicos da sua requisição, identifica os exames e já sugere o preparo ideal. Isso evita erros e agiliza o seu atendimento domiciliar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Triage;
