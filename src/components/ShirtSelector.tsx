'use client';

import React from 'react';
import Image from 'next/image';
import { Shirt } from '@/types/shirt';
import { Sparkles, Check } from 'lucide-react';

interface ShirtSelectorProps {
  shirts: Shirt[];
  selectedShirt: Shirt;
  onSelectShirt: (shirt: Shirt) => void;
}

export function ShirtSelector({ shirts, selectedShirt, onSelectShirt }: ShirtSelectorProps) {
  return (
    <div className="w-full bg-fashion-card/90 backdrop-blur-xl border border-fashion-border rounded-3xl p-4 space-y-3 shadow-2xl">
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-fashion-cyan" /> Select Clothing Garment
        </span>
        <span className="text-xs font-bold text-white">
          Currently Wearing: <span className="text-fashion-cyan">{selectedShirt.name}</span>
        </span>
      </div>

      {/* Horizontal Shirt Carousel */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-fashion-border">
        {shirts.map((shirt) => {
          const isSelected = shirt.id === selectedShirt.id;
          return (
            <button
              key={shirt.id}
              onClick={() => onSelectShirt(shirt)}
              className={`shrink-0 relative flex items-center gap-3 p-2.5 rounded-2xl border transition-all duration-300 text-left ${
                isSelected
                  ? 'bg-fashion-accent/20 border-fashion-cyan shadow-xl shadow-fashion-cyan/10 ring-2 ring-fashion-cyan/30'
                  : 'bg-fashion-dark border-fashion-border hover:border-slate-500'
              }`}
            >
              {/* Product Thumbnail */}
              <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                <Image src={shirt.image} alt={shirt.name} fill className="object-cover" />
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-fashion-cyan text-slate-950 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Specs */}
              <div className="pr-2 space-y-0.5">
                <div className="text-xs font-bold text-white truncate max-w-[130px]">{shirt.name}</div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span
                    className="w-2 h-2 rounded-full border border-white/30"
                    style={{ backgroundColor: shirt.colorHex }}
                  />
                  <span>{shirt.color}</span>
                  <span className="text-white font-bold font-sans">₹{shirt.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
