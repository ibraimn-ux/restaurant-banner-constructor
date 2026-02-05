
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { BannerState, INITIAL_STATE } from './types';
import { LayoutPanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [state, setState] = useState<BannerState>(INITIAL_STATE);
  const [isExporting, setIsExporting] = useState(false);

  const handleUpdateState = useCallback((updates: Partial<BannerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        // Находим баннер на странице
        const bannerElement = document.getElementById('banner-canvas') as HTMLDivElement;
        if (!bannerElement) {
          alert("Баннер не найден на странице");
          setIsExporting(false);
          return;
        }

        // Загружаем html2canvas
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => {
          const html2canvas = (window as any).html2canvas;
          
          // Экспортируем баннер как он есть на экране
          html2canvas(bannerElement, {
            backgroundColor: '#000000',
            scale: 2, // Двойное качество
            allowTaint: true,
            useCORS: true,
            logging: false,
          }).then((canvas: HTMLCanvasElement) => {
            canvas.toBlob((blob: Blob | null) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const fileName = (state.dishName || 'banner').replace(/[^\w\s]/g, '');
                link.download = `${fileName}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                setIsExporting(false);
              }
            }, 'image/png');
          }).catch((error: any) => {
            alert("Ошибка при экспорте: " + error);
            setIsExporting(false);
          });
        };
        document.head.appendChild(script);
      } catch (error) {
        alert("Ошибка: " + error);
        setIsExporting(false);
      }
    }, 500);
  };

  return (
    <div className="flex h-screen w-full bg-[#f2f2f7] overflow-hidden">
      <Sidebar 
        state={state} 
        onUpdate={handleUpdateState} 
        onExport={handleExport}
        isExporting={isExporting}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden bg-slate-100">
        <div className="absolute top-8 left-10 flex items-center gap-3 text-slate-400 font-bold z-50">
          <LayoutPanelLeft size={18} />
          <span className="uppercase text-[11px] tracking-widest">Workspace / 1080x1080</span>
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <Canvas 
            state={state} 
            onUpdateState={handleUpdateState}
          />
        </div>

        <AnimatePresence>
          {isExporting && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-white/20 backdrop-blur-md flex items-center justify-center"
            >
              <div className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center gap-6 border border-white">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                <p className="font-bold text-xl text-slate-900 tracking-tight">Рендеринг PNG...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
