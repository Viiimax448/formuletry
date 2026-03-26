"use client";
import { useState } from "react";

export default function StickyBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#111827]/95 backdrop-blur-md border-t border-white/10 p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-2">
        
        {/* Contenido del Banner Oficial */}
        <a 
          href="https://www.instagram.com/sinvueltas._/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo Sponsor */}
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-[#E30613] flex items-center justify-center shrink-0 overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
            <img 
                src="/sinvuelta.webp" 
                alt="Sin Vueltas" 
                className="w-full h-full object-cover"
            />
          </div>
          
          {/* Textos */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white text-sm font-bold leading-tight truncate group-hover:text-gray-200 transition-colors">
                  Sin Vueltas
                </p>
                <span className="bg-blue-500/10 text-blue-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                  AD
                </span>
            </div>
            <p className="text-gray-400 text-xs truncate md:whitespace-normal leading-snug">
              El automovilismo como nadie te lo cuenta.
            </p>
          </div>
        </a>

        {/* Botón de Cerrar */}
        <button 
          onClick={() => setIsVisible(false)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0"
          aria-label="Cerrar anuncio"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
      </div>
    </div>
  );
}