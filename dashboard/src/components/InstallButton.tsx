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
                className="w-full h-full min-h-[52px] group relative overflow-hidden bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/70 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-3 px-2 md:px-4 cursor-pointer shadow-md shadow-black/40"
            >
                <Download className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-300 group-hover:text-white transition-colors text-center leading-tight">
                    <span className="md:hidden">Install</span>
                    <span className="hidden md:inline">Install App</span>
                </span>
            </button>

            {/* Tooltip para iOS */}
            {showIOSInstructions && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl text-xs text-white text-center animate-in fade-in slide-in-from-bottom-2 z-50 flex flex-col items-center gap-2">
                    <p className="font-bold text-neutral-100">Para instalar en tu iPhone:</p>
                    <div className="flex items-center justify-center gap-2 text-neutral-300">
                        <span>1. Toca Compartir en tu navegador </span>
                        <Share className="w-4 h-4 text-cyan-400" />
                    </div>
                    <p className="text-neutral-500 text-[11px]">(El botón de compartir en Safari)</p>
                    <div className="flex items-center justify-center gap-2 text-neutral-300">
                        <span>2. Luego toca Agregar a inicio</span>
                        <PlusSquare className="w-4 h-4 text-cyan-400" />
                    </div>
                </div>
            )}
        </>
    );
}