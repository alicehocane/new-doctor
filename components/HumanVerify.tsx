'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

interface HumanVerifyProps {
  onVerify: (isHuman: boolean) => void;
}

export default function HumanVerify({ onVerify }: HumanVerifyProps) {
  const [verified, setVerified] = useState(false);
  const x = useMotionValue(0);
  
  const opacity = useTransform(x, [0, 150], [1, 0]);

  const handleDragEnd = () => {
    // If dragged more than 170px, consider it verified
    if (x.get() > 170) {
      setVerified(true);
      onVerify(true);
    } else {
      x.set(0);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-8">
      <div className="relative h-14 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex items-center shadow-inner">
        <AnimatePresence mode="wait">
          {!verified ? (
            <>
              <motion.div 
                style={{ opacity }}
                className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pointer-events-none"
              >
                Deslice para verificar
              </motion.div>

              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 200 }}
                style={{ x }}
                onDragEnd={handleDragEnd}
                className="absolute left-1.5 z-10 w-11 h-11 bg-[#0071e3] rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing text-white shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 bg-green-500 flex items-center justify-center gap-2 text-white font-bold text-sm"
            >
              <Check className="w-5 h-5" /> Verificación Exitosa
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}