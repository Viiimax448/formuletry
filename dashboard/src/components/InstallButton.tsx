"use client";

import { useState, useEffect } from "react";
import { Download, Share, PlusSquare } from "lucide-react";

export default function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Detectar si ya está instalada
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsStandalone(true);
        }

        // Detectar iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));

        // Capturar evento de instalación
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSInstructions(true);
            setTimeout(() => setShowIOSInstructions(false), 5000);
            return;
        }
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') setDeferredPrompt(null);
        }
    };

    // Mostrar siempre el botón, respetando el tipo de dispositivo
    return (
        <>
            <button
                onClick={handleInstallClick}
                className="w-full aspect-square group relative overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:border-cyan-400/30 flex flex-col items-center justify-center gap-1 md:gap-2"
            >
                <Download className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] md:text-xs font-medium tracking-wider text-gray-300 group-hover:text-white transition-colors text-center leading-tight">
                    Install
                    <br />
                    App
                </span>
            </button>

            {/* Tooltip para iOS */}
            {showIOSInstructions && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 mb-2 w-60 p-3 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl text-xs text-white text-center animate-in fade-in slide-in-from-bottom-2 z-50 flex flex-col items-center gap-2">
                    <p className="font-bold text-slate-200">Para instalar en tu iPhone:</p>
                    <div className="flex items-center justify-center gap-2 text-slate-300">
                        <span>1. Toca Compartir en tu navegador </span>
                        <Share className="w-4 h-4" />
                    </div>
                    <p className="text-slate-400 text-xs">(El botón que se encuentra al lado del link)</p>
                    <div className="flex items-center justify-center gap-2 text-slate-300">
                        <span>2. Luego toca Agregar a inicio</span>
                        <PlusSquare className="w-4 h-4" />
                    </div>
                </div>
            )}
        </>
    );
}