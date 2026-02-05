
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
      setIsExporting(false);
      alert("Баннер 1080x1080 готов к сохранению!");
    }, 1500);
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
