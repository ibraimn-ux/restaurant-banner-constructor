
import React, { useRef, useEffect, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { BannerState } from '../types';

interface CanvasProps {
  state: BannerState;
  onUpdateState: (updates: Partial<BannerState>) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ state, onUpdateState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerScale, setContainerScale] = useState(1);

  // Scale preview to fit container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement;
        if (parent) {
          const size = Math.min(parent.clientWidth - 80, parent.clientHeight - 80);
          setContainerScale(size / 1080);
        }
      }
    };
    window.addEventListener('resize', updateScale);
    updateScale();
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleBgDrag = (e: any, info: PanInfo) => {
    onUpdateState({
      bgPosition: {
        x: state.bgPosition.x + info.delta.x / containerScale,
        y: state.bgPosition.y + info.delta.y / containerScale
      }
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(state.bgScale + delta, 0.1), 5);
    onUpdateState({ bgScale: newScale });
  };

  const NUMBER_LINE_HEIGHT = 235.677;

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      style={{ 
        width: 1080, 
        height: 1080, 
        transform: `scale(${containerScale})`,
        transformOrigin: 'center center',
        backgroundColor: '#000000'
      }}
      className="relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] select-none shrink-0"
    >
      {/* LAYER 0: Interactive Background */}
      <motion.div
        drag
        dragMomentum={false}
        onDrag={handleBgDrag}
        style={{
          x: state.bgPosition.x,
          y: state.bgPosition.y,
          scale: state.bgScale,
          cursor: 'grab'
        }}
        whileTap={{ cursor: 'grabbing' }}
        className="absolute inset-0 flex items-center justify-center pointer-events-auto"
      >
        <img 
          src={state.bgImage} 
          alt="background" 
          className="min-w-full min-h-full object-cover pointer-events-none"
          style={{ width: 1600, height: 'auto' }}
        />
      </motion.div>

      {/* TOP GRADIENT OVERLAY */}
      <div 
        className="absolute inset-x-0 top-0 h-[400px] pointer-events-none z-10"
        style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)' }}
      />

      {/* HEADER INFO */}
      <div 
        className="absolute z-20 text-white whitespace-nowrap als-sirius-fallback"
        style={{ left: 70, top: 50, fontSize: 80, letterSpacing: '-0.06em', fontWeight: 900 }}
      >
        {state.restaurantName}
      </div>
      <div 
        className="absolute z-20 text-white font-bold whitespace-nowrap"
        style={{ right: 50, top: 68, fontSize: 40, letterSpacing: '-0.06em' }}
      >
        {state.expirationDate}
      </div>

      {/* DISCOUNT BLOCK */}
      <div 
        className="absolute pointer-events-none z-50"
        style={{ left: 38, top: 166, width: 800, height: 400 }}
      >
        {/* LAYER 100: Discount Value (Highest layer) */}
        <div 
          className="absolute text-white font-black flex items-start als-sirius-fallback"
          style={{ 
            left: 0, 
            top: 0, 
            fontSize: 235.677, 
            lineHeight: `${NUMBER_LINE_HEIGHT}px`, 
            letterSpacing: '-0.06em',
            zIndex: 100,
            textShadow: '7.8559px 0px 6.28472px rgba(0, 0, 0, 0.15)',
            fontWeight: 900,
            WebkitTextStroke: '2px white'
          }}
        >
          {state.discountPercentage}
        </div>

        {/* LAYER 80: % Symbol (Bottom layer) */}
        <div 
          className="absolute text-white font-black flex items-start als-sirius-fallback"
          style={{ 
            left: 360, 
            top: 0, 
            fontSize: 107.975, 
            lineHeight: '107.975px',
            letterSpacing: '-0.06em',
            zIndex: 80,
            fontWeight: 900,
            WebkitTextStroke: '1px white'
          }}
        >
          %
        </div>

        {/* LAYER 90: Discount Type Badge (Middle layer, between % and -30) */}
        <div 
          className="absolute flex flex-col justify-end"
          style={{ 
            left: 395, 
            top: -10, 
            height: NUMBER_LINE_HEIGHT, 
            zIndex: 90,
            paddingBottom: 24 
          }}
        >
          <div 
            className="flex items-center justify-start text-white font-black als-sirius-fallback"
            style={{ 
              background: 'linear-gradient(99.14deg, #FF5053 1.5%, #FF2125 97.29%)',
              borderRadius: 21.595,
              padding: '10px 22px 15px 22px', 
              fontSize: 41.52,
              lineHeight: '1.05', 
              whiteSpace: 'pre-wrap',
              display: 'inline-flex',
              minHeight: 99.67,
              width: 'fit-content',
              fontWeight: 900,
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}
          >
            <div className="text-left">
              {state.discountType}
            </div>
          </div>
        </div>
      </div>

      {/* PRICE BLOCKS (BOTTOM) */}
      <div className="absolute left-[50px] top-[811px] flex flex-col items-start pointer-events-none z-30">
        <div 
          className="bg-white px-5 py-2 rounded-t-[25px] rounded-br-[25px] text-black font-bold whitespace-nowrap"
          style={{ fontSize: 35 }}
        >
          {state.dishName}
        </div>
        
        <div className="flex items-end gap-5">
          {/* Discounted Price */}
          <div 
            className="flex items-center justify-center text-white font-black als-sirius-fallback px-10 py-2 rounded-b-[42px] rounded-tr-[42px] shadow-2xl"
            style={{ 
              background: 'linear-gradient(99.14deg, #FF5053 1.5%, #FF2125 97.29%)',
              fontSize: 99.5,
              height: 148,
              fontWeight: 900
            }}
          >
            {state.priceWithDiscount}
          </div>

          {/* Original Price */}
          <div 
            className="relative flex items-center justify-center text-white font-black als-sirius-fallback px-8 py-2 rounded-[33px] mb-4 overflow-hidden"
            style={{ 
              background: 'linear-gradient(99.14deg, #404040 1.5%, #000000 97.29%)',
              fontSize: 66,
              height: 104,
              fontWeight: 900
            }}
          >
            {state.originalPrice}
            <div 
              className="absolute h-0 border-[4px] border-[#FF2327]"
              style={{ 
                transform: 'rotate(-9.77deg)', 
                left: '7%', 
                width: '86%', 
                top: 'calc(52% - 5px)' 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
