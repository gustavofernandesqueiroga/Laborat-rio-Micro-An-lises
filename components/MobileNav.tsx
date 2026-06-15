
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, Calendar, FileText, User, QrCode } from 'lucide-react';
import { QRScannerModal } from './QRScannerModal';

const MobileNav: React.FC = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const navItems = [
    { icon: <Home size={18} />, label: 'Início', path: '/' },
    { icon: <ClipboardList size={18} />, label: 'Exames', path: '/servicos' },
    { icon: <Calendar size={22} />, label: 'Agendar', path: '/agendamento', highlight: true },
    { icon: <QrCode size={18} />, label: 'QR Scan', isButton: true, onClick: () => setIsScannerOpen(true) },
    { icon: <FileText size={18} />, label: 'Laudos', path: '/resultados' },
    { icon: <User size={18} />, label: 'Perfil', path: '/dashboard' },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-[130]">
        <div className="bg-white/95 backdrop-blur-xl rounded-[1.75rem] shadow-[0_8px_32px_rgba(13,148,136,0.12)] border border-teal-50 px-3 py-2.5 flex items-center justify-between relative overflow-hidden ring-1 ring-black/5">
          {navItems.map((item, idx) => (
            item.isButton ? (
              <button
                key={idx}
                onClick={item.onClick}
                className="flex flex-col items-center gap-1 transition-all text-gray-400 active:text-teal-600 active:scale-105 cursor-pointer flex-1"
              >
                {item.icon}
                <span className="text-[7.5px] font-black uppercase tracking-widest leading-none">
                  {item.label}
                </span>
              </button>
            ) : (
              <NavLink
                key={idx}
                to={item.path!}
                className={({ isActive }) => `
                  flex flex-col items-center gap-1 transition-all flex-1
                  ${item.highlight ? '-mt-7' : ''}
                  ${isActive ? 'text-teal-600 scale-105 font-medium' : 'text-gray-400'}
                `}
              >
                {item.highlight ? (
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/35 border-[3px] border-white transition-all active:scale-90">
                    {item.icon}
                  </div>
                ) : (
                  item.icon
                )}
                <span className={`text-[7.5px] font-black uppercase tracking-widest leading-none ${item.highlight ? 'mt-1 text-orange-500 font-black' : ''}`}>
                  {item.label}
                </span>
              </NavLink>
            )
          ))}
        </div>
      </div>

      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </>
  );
};

export default MobileNav;
