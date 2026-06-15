
import React from 'react';
import { Microscope } from 'lucide-react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center animate-pulse">
          <Microscope size={40} className="text-teal-600" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-orange-500 rounded-full border-2 border-white animate-bounce"></div>
      </div>
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 animate-pulse">Carregando...</p>
    </div>
  );
};

export default LoadingFallback;
