
import React from 'react';
import { BannerState } from '../types';
import { Upload, Download, Type, Percent, Tag, Calendar, Utensils, Coins, Image as ImageIcon, ZoomIn } from 'lucide-react';

interface SidebarProps {
  state: BannerState;
  onUpdate: (updates: Partial<BannerState>) => void;
  onExport: () => void;
  isExporting: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ state, onUpdate, onExport, isExporting }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ bgImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-[420px] bg-white/70 backdrop-blur-2xl border-r border-slate-200 h-full overflow-y-auto flex flex-col shadow-2xl z-[60]">
      <div className="p-8 border-b border-slate-100/50">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Constructor</h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Apple Style MVP</p>
      </div>

      <div className="flex-1 p-8 space-y-8">
        {/* ФОН */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <ImageIcon size={14} /> Фон и зум
          </div>
          <div className="space-y-4">
            <input type="file" id="bg-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
            <label 
              htmlFor="bg-upload" 
              className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-[20px] hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer text-slate-500 font-bold text-sm"
            >
              <Upload size={18} /> Загрузить фото
            </label>
            <div className="bg-slate-50/50 p-4 rounded-[20px] border border-slate-100 space-y-3">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                <span className="flex items-center gap-1"><ZoomIn size={12}/> Zoom</span>
                <span>{Math.round(state.bgScale * 100)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="3" step="0.01" value={state.bgScale}
                onChange={(e) => onUpdate({ bgScale: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </section>

        {/* ОСНОВНОЕ */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <Type size={14} /> Инфо ресторана
          </div>
          <div className="space-y-3">
            <InputGroup label="Название" value={state.restaurantName} onChange={(v) => onUpdate({ restaurantName: v })} icon={<Utensils size={14}/>}/>
            <InputGroup label="Дата акции" value={state.expirationDate} onChange={(v) => onUpdate({ expirationDate: v })} icon={<Calendar size={14}/>}/>
          </div>
        </section>

        {/* СКИДКА */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <Percent size={14} /> Параметры скидки
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputGroup label="Число" value={state.discountPercentage} onChange={(v) => onUpdate({ discountPercentage: v })} />
            <InputGroup 
              label="Тип (текст)" 
              value={state.discountType} 
              onChange={(v) => onUpdate({ discountType: v })} 
              multiline 
            />
          </div>
        </section>

        {/* БЛЮДО И ЦЕНЫ */}
        <section className="space-y-4 pb-8">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <Coins size={14} /> Меню и цены
          </div>
          <div className="space-y-3">
            <InputGroup label="Название блюда" value={state.dishName} onChange={(v) => onUpdate({ dishName: v })} />
            <div className="grid grid-cols-2 gap-3">
              <InputGroup label="Новая цена" value={state.priceWithDiscount} onChange={(v) => onUpdate({ priceWithDiscount: v })} />
              <InputGroup label="Старая цена" value={state.originalPrice} onChange={(v) => onUpdate({ originalPrice: v })} />
            </div>
          </div>
        </section>
      </div>

      <div className="p-8 bg-white/80 border-t border-slate-100">
        <button 
          onClick={onExport}
          disabled={isExporting}
          className="w-full bg-slate-900 text-white py-4 px-6 rounded-[22px] font-black tracking-tight text-md flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-slate-200"
        >
          {isExporting ? <span className="animate-spin text-xl">◌</span> : <Download size={20} />}
          СКАЧАТЬ PNG
        </button>
      </div>
    </aside>
  );
};

const InputGroup = ({ label, value, onChange, icon, multiline }: { label: string, value: string, onChange: (v: string) => void, icon?: React.ReactNode, multiline?: boolean }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1 opacity-70">
      {icon} {label}
    </label>
    {multiline ? (
      <textarea 
        rows={2}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-[16px] px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-800 resize-none overflow-hidden"
      />
    ) : (
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-[16px] px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
      />
    )}
  </div>
);
