import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, AlertCircle, CheckCircle2, User, FileText, MapPin, Calendar, Camera } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanResult(null);
      setError(null);
      setScanning(true);
      setManualCode('');
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      setScanning(true);
      setScanResult(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Simulate QR scan detection after 3.5 seconds of active feed
      const scanTimer = setTimeout(() => {
        handleSuccessScan();
      }, 3500);

      return () => clearTimeout(scanTimer);
    } catch (err: any) {
      console.error('Erro ao acessar câmera:', err);
      setError('Não foi possível acessar a câmera do dispositivo. Verifique as permissões ou digite o código manualmente.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleSuccessScan = () => {
    setScanning(false);
    setScanResult({
      name: 'Gustavo Fernandes Queiroga',
      id: 'CJ-25982-A',
      exam: 'Hemograma Completo + PCR Ultrassensível + Glicose',
      unit: 'Unidade Executiva - João Pessoa (PB)',
      scheduleDate: new Date().toLocaleDateString('pt-BR'),
      status: 'Aguardando Atendimento do Coletor',
      age: '28 anos'
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    setLoading(true);
    // Simulate API query delay
    setTimeout(() => {
      setLoading(false);
      setScanning(false);
      setScanResult({
        name: 'Gustavo Fernandes Queiroga',
        id: manualCode.toUpperCase().startsWith('CJ-') ? manualCode.toUpperCase() : `CJ-${manualCode}`,
        exam: 'Hemograma Completo + PCR Ultrassensível + Glicose',
        unit: 'Unidade Executiva - João Pessoa (PB)',
        scheduleDate: new Date().toLocaleDateString('pt-BR'),
        status: 'Aguardando Atendimento do Coletor',
        age: '28 anos'
      });
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-[#fcfdfd] sm:rounded-[2.5rem] rounded-t-[2.5rem] border border-teal-50 shadow-2xl overflow-hidden pb-8 sm:pb-10 pt-6 px-6 z-10 flex flex-col"
          >
            {/* Inline scanning laser and target style */}
            <style>{`
              @keyframes scanLaser {
                0% { top: 0%; opacity: 0.3; }
                50% { top: 100%; opacity: 1; }
                100% { top: 0%; opacity: 0.3; }
              }
              .scanner-laser {
                animation: scanLaser 3s infinite linear;
              }
            `}</style>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                  <QrCode size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Leitor de QR Code</h3>
                  <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase">Identificação Expressa</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-50 text-gray-400 hover:text-gray-900 active:scale-95 transition-all rounded-full flex items-center justify-center border border-gray-100/80"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scanner Area */}
            {scanning && (
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-500 text-center px-4 mb-5 font-medium leading-relaxed">
                  Aponte a câmera traseira do celular para o código QR ou digite o número identificador do paciente.
                </p>

                {/* Viewfinder block */}
                <div className="relative w-64 h-64 bg-slate-950 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white flex items-center justify-center mb-6">
                  {error ? (
                    <div className="p-4 flex flex-col items-center text-center">
                      <AlertCircle className="text-orange-500 mb-2" size={32} />
                      <span className="text-xs text-slate-400 font-medium leading-relaxed">{error}</span>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover rounded-[1.8rem]"
                      />
                      {/* Laser scanning beam */}
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_12px_#2dd4bf] scanner-laser" />
                      
                      {/* Framing brackets inside viewfinder */}
                      <div className="absolute inset-6 border-2 border-white/20 pointer-events-none rounded-xl flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-teal-400" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-teal-400" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-teal-400" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-teal-400" />
                        
                        <div className="text-white/35 flex flex-col items-center justify-center gap-1.5">
                          <Camera size={24} className="animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-center">Focar Código</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Manual identification input */}
                <form onSubmit={handleManualSubmit} className="w-full space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código do paciente (ex: CJ-25982-A)"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      disabled={loading}
                      className="flex-1 bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold placeholder:text-gray-400 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={loading || !manualCode.trim()}
                      className="bg-teal-600 text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-2xl hover:bg-teal-700 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center"
                    >
                      {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Results Area */}
            {!scanning && scanResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Success Indicator */}
                <div className="flex flex-col items-center text-center py-4 bg-emerald-50/50 rounded-3xl border border-emerald-50 shadow-inner">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-2 shadow-lg shadow-emerald-200">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-base font-black text-emerald-800 tracking-tight">Paciente Identificado!</h4>
                  <p className="text-xs text-emerald-600/80 font-semibold mt-0.5">Atendimento e exames localizados</p>
                </div>

                {/* Patient Profile Box */}
                <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-teal-600">Paciente</p>
                      <h5 className="text-base font-black text-gray-900 tracking-tight leading-none mt-0.5">{scanResult.name}</h5>
                      <p className="text-[10px] text-gray-500 mt-1 font-bold">ID: <span className="text-gray-950 font-black">{scanResult.id}</span> • {scanResult.age}</p>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gray-100 pt-4 space-y-3">
                    <div className="flex gap-3">
                      <FileText size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider text-gray-400">Exames Guia</p>
                        <p className="text-xs text-gray-800 font-bold leading-relaxed">{scanResult.exam}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <MapPin size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider text-gray-400">POSTO DE COLETA</p>
                        <p className="text-xs text-gray-700 font-bold">{scanResult.unit}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Calendar size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider text-gray-400">PROGRAMADO PARA</p>
                        <p className="text-xs text-gray-700 font-bold">{scanResult.scheduleDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-actions */}
                <div className="flex gap-3">
                  <button
                    onClick={startCamera}
                    className="flex-1 border border-gray-200 text-gray-700 font-black text-xs uppercase tracking-widest py-4 rounded-3xl hover:bg-gray-50 active:scale-95 transition-all text-center"
                  >
                    Nova Leitura
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-widest py-4 rounded-3xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-100"
                  >
                    Confirmar Chegada
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
