'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTryOn } from '@/hooks/useTryOn';
import { PhotoTryOn } from '@/components/PhotoTryOn';
import { LiveTryOn } from '@/components/LiveTryOn';
import { ShirtSelector } from '@/components/ShirtSelector';
import { Camera, Sparkles, Shirt as ShirtIcon } from 'lucide-react';

function TryOnContent() {
  const searchParams = useSearchParams();
  const shirtParam = searchParams.get('shirt') || 'shirt-01';

  const {
    selectedShirt,
    selectShirt,
    selectShirtById,
    mode,
    setMode,
    allShirts,
  } = useTryOn(shirtParam);

  useEffect(() => {
    if (shirtParam) {
      selectShirtById(shirtParam);
    }
  }, [shirtParam, selectShirtById]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Fitting Room Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-fashion-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fashion-card border border-fashion-border text-xs font-mono text-fashion-cyan mb-2">
            <Sparkles className="w-4 h-4 text-fashion-cyan" /> Interactive Fitting Room
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Virtual Shirt Fitting Room
          </h1>
        </div>

        {/* Prominent Mode Toggle Button */}
        <div className="inline-flex p-1.5 rounded-2xl bg-fashion-card border border-fashion-border">
          <button
            onClick={() => setMode('ai-photo')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              mode === 'ai-photo'
                ? 'bg-fashion-accent text-white shadow-lg shadow-fashion-accent/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            AI PHOTO
          </button>

          <button
            onClick={() => setMode('live-3d')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              mode === 'live-3d'
                ? 'bg-gradient-to-r from-fashion-accent to-fashion-cyan text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShirtIcon className="w-4 h-4" />
            LIVE 3D
          </button>
        </div>
      </div>

      {/* Main Mode Viewport */}
      {mode === 'ai-photo' ? (
        <PhotoTryOn
          shirt={selectedShirt}
          onTryAnotherShirt={() => {
            const nextIdx = (allShirts.findIndex((s) => s.id === selectedShirt.id) + 1) % allShirts.length;
            selectShirt(allShirts[nextIdx]);
          }}
        />
      ) : (
        <LiveTryOn
          shirt={selectedShirt}
          allShirts={allShirts}
          onSelectShirt={selectShirt}
        />
      )}

      {/* Bottom Horizontal Shirt Selector Bar */}
      <ShirtSelector
        shirts={allShirts}
        selectedShirt={selectedShirt}
        onSelectShirt={selectShirt}
      />

    </div>
  );
}

export default function TryOnPage() {
  return (
    <Suspense fallback={
      <div className="w-full py-20 text-center text-white font-mono">
        Loading Virtual Fitting Room...
      </div>
    }>
      <TryOnContent />
    </Suspense>
  );
}
