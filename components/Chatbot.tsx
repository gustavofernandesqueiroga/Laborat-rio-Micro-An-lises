
import React, { useState, useRef, useEffect } from 'react';
// Fix: Prohibited 'import type' and move GoogleGenAI to top-level import
import { MessageCircle, X, Send, User, Bot, Loader2, PhoneCall, HelpCircle, Trash2, Sparkles, Check, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string; isCompleted?: boolean }[]>([
    { role: 'bot', text: 'Olá! Sou o **Jajá AI**, seu estrategista de saúde e bem-estar na **Coleta Já**. 🐆\n\nComo posso agilizar sua vida hoje?\n\n• **Triagem IA** (Ler pedido médico)\n• **Consultar Resultados** (Laudos online)\n• Chamar Guepardo (Selo 24h)\n• Missão Turma do Jajá' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHumanRedirection, setShowHumanRedirection] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  // Função simples para formatar texto (Negrito e Quebras de linha)
  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/g).map((part, j) => 
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j} className="font-black text-inherit">{part.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
        <br />
      </React.Fragment>
    ));
  };


  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || input.trim();
    if (!textToSend || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setIsLoading(true);
    setShowHumanRedirection(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', text: textToSend }],
          history: messages.map(m => ({
            role: m.role === 'bot' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }))
        })
      });

      if (!response.ok) throw new Error('API call failed');
      
      const data = await response.json();
      const botResponse = data.text || "Desculpe, tive um pequeno lapso na minha conexão de guepardo. Como posso ajudar?";
      
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      
      if (botResponse.toLowerCase().includes('sac') || botResponse.toLowerCase().includes('atendente') || botResponse.toLowerCase().includes('humano')) {
        setShowHumanRedirection(true);
      }
    } catch (error) {
      console.error("Erro na comunicação com a IA:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Minha conexão veloz falhou por um momento. Que tal falarmos pelo WhatsApp?" }]);
      setShowHumanRedirection(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const clearChat = () => {
    setMessages([{ role: 'bot', text: 'Conversa reiniciada. Sou o Jajá AI, pronto para te atender com a velocidade de um guepardo!' }]);
    setShowHumanRedirection(false);
  };

  const markAsCompleted = (index: number) => {
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, isCompleted: true } : msg
    ));
  };

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const exportChatAsTXT = () => {
    if (messages.length === 0) return;
    const now = new Date();
    const formattedDate = now.toLocaleString('pt-BR');
    
    let report = `============================================\n`;
    report += `       RELATÓRIO DE TRIAGEM - JAJÁ AI\n`;
    report += `           LABORATÓRIO COLETA JÁ\n`;
    report += `============================================\n`;
    report += `Data da Exportação: ${formattedDate}\n`;
    if (userPhone) {
      report += `Contato Informado: ${userPhone}\n`;
    }
    report += `--------------------------------------------\n\n`;

    messages.forEach((msg, idx) => {
      const sender = msg.role === 'user' ? 'Você (Paciente)' : 'Jajá AI';
      const completionStatus = msg.isCompleted ? ' [CONCLUÍDO / REALIZADO]' : '';
      const textCleaned = msg.text.replace(/\*\*/g, '');
      report += `[#${idx + 1}] ${sender}${completionStatus}:\n${textCleaned}\n\n`;
    });

    report += `--------------------------------------------\n`;
    report += `Coleta Já - Exames laboratoriais de excelência na velocidade de um guepardo.\n`;
    report += `SAC Atlantis: +55 (83) 3534-0000\n`;
    report += `============================================\n`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `triagem_jaja_ai_${now.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
  };

  const exportChatAsPDF = () => {
    if (messages.length === 0) return;
    const doc = new jsPDF();
    const now = new Date();
    const formattedDate = now.toLocaleString('pt-BR');

    // Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(249, 115, 22); // Orange
    doc.text("Coleta Já - Relatório Jajá AI", 14, 20);

    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Data da Exportação: ${formattedDate}`, 14, 27);
    if (userPhone) {
      doc.text(`Contato Informado: ${userPhone}`, 14, 32);
    }

    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 35, 196, 35);

    let yOffset = 45;
    const pageHeight = doc.internal.pageSize.height;

    messages.forEach((msg, idx) => {
      if (yOffset > pageHeight - 35) {
        doc.addPage();
        yOffset = 20;
      }

      const sender = msg.role === 'user' ? 'Você (Paciente)' : 'Jajá AI';
      const isCompletedText = msg.isCompleted ? ' [Concluído / Realizado]' : '';
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      if (msg.role === 'user') {
        doc.setTextColor(13, 148, 136); // Teal
      } else {
        doc.setTextColor(249, 115, 22); // Orange
      }
      doc.text(`${sender}${isCompletedText}`, 14, yOffset);
      yOffset += 6;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);

      const cleanText = msg.text.replace(/\*\*/g, '');
      const splitLines = doc.splitTextToSize(cleanText, 182);

      splitLines.forEach((line: string) => {
        if (yOffset > pageHeight - 20) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(line, 14, yOffset);
        yOffset += 5;
      });

      yOffset += 5; // spacing
    });

    if (yOffset > pageHeight - 25) {
      doc.addPage();
      yOffset = 20;
    }
    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, yOffset, 196, yOffset);
    yOffset += 8;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Coleta Já - Exames laboratoriais de excelência na velocidade de um guepardo.", 14, yOffset);
    yOffset += 4;
    doc.text("WhatsApp / SAC Atlantis: +55 (83) 3534-0000", 14, yOffset);

    doc.save(`triagem_jaja_ai_${now.toISOString().split('T')[0]}.pdf`);
    setIsExportMenuOpen(false);
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button 
        id="chatbot-toggle-button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`fixed bottom-28 md:bottom-6 right-4 md:right-6 p-4 rounded-full shadow-[0_8px_30px_rgba(249,115,22,0.4)] transition-all z-[150] flex items-center justify-center transform hover:scale-110 active:scale-95 border-4 border-white ${isOpen ? 'bg-slate-900' : 'bg-orange-500'} text-white group`}
        aria-label="Jajá AI - Assistente Virtual"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
              <Sparkles size={28} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-teal-500 rounded-full border-2 border-orange-500 animate-ping"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Janela do Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            id="chatbot-window"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-44 md:bottom-24 right-4 left-4 md:left-auto md:right-6 md:w-[400px] h-[550px] md:h-[600px] max-h-[70vh] md:max-h-[80vh] bg-white rounded-[32px] shadow-2xl z-[140] flex flex-col overflow-hidden border border-slate-100 ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="bg-slate-900 p-5 text-white relative shrink-0">
              <div className="absolute top-0 right-0 w-32 h-full bg-orange-500/20 rounded-l-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg border border-white/10">
                    <Bot size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wider">Jajá AI</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                      <p className="text-[10px] text-orange-200 font-bold uppercase tracking-widest">Guepardo Ativo</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button 
                      onClick={() => setIsExportMenuOpen(!isExportMenuOpen)} 
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white/70 hover:text-white" 
                      title="Salvar/Exportar Conversa"
                    >
                      <Download size={16} />
                    </button>
                    <AnimatePresence>
                      {isExportMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl overflow-hidden py-1 border border-slate-100 ring-4 ring-black/5 z-20 text-slate-800"
                        >
                          <div className="px-3 py-2 border-b border-slate-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Salvar Orientações</p>
                          </div>
                          <button 
                            onClick={exportChatAsPDF} 
                            className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-2 text-slate-700"
                          >
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                            Exportar como PDF
                          </button>
                          <button 
                            onClick={exportChatAsTXT} 
                            className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-teal-50 hover:text-teal-600 transition-colors flex items-center gap-2 text-slate-700"
                          >
                            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                            Exportar como Texto (TXT)
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button onClick={clearChat} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white/70 hover:text-white" title="Limpar Conversa">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Área de Mensagens */}
            <div id="chatbot-messages-area" className="flex-grow overflow-y-auto p-5 space-y-4 bg-slate-50 scroll-smooth">
              {messages.map((msg, idx) => (
                <motion.div 
                  id={`chat-message-${idx}`}
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-white border border-orange-100 flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Bot size={14} className="text-orange-500" />
                    </div>
                  )}
                  <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-sm relative group/msg ${
                    msg.role === 'user' 
                      ? (msg.isCompleted ? 'bg-emerald-500 text-white rounded-[20px] rounded-tr-sm' : 'bg-orange-500 text-white rounded-[20px] rounded-tr-sm')
                      : 'bg-white text-slate-700 border border-slate-200 rounded-[20px] rounded-tl-sm'
                  }`}>
                    <div className={`flex items-start gap-2 ${msg.isCompleted ? 'line-through opacity-80 transition-all font-medium italic' : ''}`}>
                      {msg.isCompleted && (
                        <motion.div 
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="mt-1 shrink-0"
                        >
                          <Check size={14} className="text-white" />
                        </motion.div>
                      )}
                      <div>{renderMessageText(msg.text)}</div>
                    </div>
                    
                    {/* Botão 'Marcar como Realizado' visível apenas para mensagens do usuário */}
                    {msg.role === 'user' && (
                      <div className="mt-2 flex items-center justify-end gap-2">
                        {msg.isCompleted ? (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg">
                            <Sparkles size={10} /> Realizado
                          </span>
                        ) : (
                          <button
                            id={`mark-as-done-${idx}`}
                            onClick={() => markAsCompleted(idx)}
                            className="text-[10px] font-black uppercase tracking-widest bg-white text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-all shadow-sm flex items-center gap-1"
                          >
                            Marcar como Realizado
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Loader2 size={14} className="text-orange-500 animate-spin" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-[20px] rounded-tl-sm shadow-sm border border-slate-200">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}

              {showHumanRedirection && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-teal-50 border border-teal-200 p-4 rounded-2xl text-center space-y-3 mx-4"
                >
                  <p className="text-xs font-bold text-teal-800 uppercase tracking-wide">Precisa de suporte humano?</p>
                  <div className="space-y-2">
                    <input 
                      type="tel" 
                      placeholder="Seu telefone (DDD + Número)" 
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-white border border-teal-100 text-xs font-bold text-teal-900 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                    <a 
                      href={`https://wa.me/558335340000?text=${encodeURIComponent(`Olá, gostaria de falar com o SAC. Meu contato é: ${userPhone}`)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-teal-700 transition-colors w-full"
                    >
                      <PhoneCall size={14} /> Falar com o SAC Atlantis
                    </a>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              {/* Quick Actions - Horizontal Scroll */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-2 custom-scrollbar">
                {['Triagem IA', 'Consultar Resultados', 'Chamar Guepardo', 'Missão Turma do Jajá'].map(action => (
                  <button 
                    key={action}
                    type="button"
                    onClick={() => {
                      if (action === 'Triagem IA') {
                        window.location.href = '/triagem';
                      } else if (action === 'Consultar Resultados') {
                        window.location.href = '/resultados';
                      } else {
                        handleSendMessage(action);
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 transition-all shrink-0 whitespace-nowrap"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
                <input 
                  id="chatbot-input"
                  type="text"
                  placeholder="Fale com o Jajá AI..."
                  className="flex-grow pl-4 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm font-medium text-slate-800"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  id="chatbot-send-btn"
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 transition-all shadow-md"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
