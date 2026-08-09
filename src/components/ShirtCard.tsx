'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shirt } from '@/types/shirt';
import { Camera, Eye, Tag, Sparkles, Check, X } from 'lucide-react';

interface ShirtCardProps {
  shirt: Shirt;
  onTryOn?: (shirt: Shirt) => void;
}

export function ShirtCard({ shirt, onTryOn }: ShirtCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <>
      <div className="group relative bg-fashion-card border border-fashion-border rounded-3xl overflow-hidden hover:border-fashion-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-fashion-accent/10 flex flex-col">
        
        {/* Product Image Container */}
        <div className="relative aspect-[3/4] w-full bg-slate-900 overflow-hidden">
          <Image
            src={shirt.image}
            alt={shirt.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Color & Category Pill Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-fashion-dark/80 backdrop-blur-md border border-fashion-border text-xs font-semibold text-white flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/40"
                style={{ backgroundColor: shirt.colorHex }}
              />
              {shirt.color}
            </span>
            {shirt.isPopular && (
              <span className="px-3 py-1 rounded-full bg-fashion-accent/90 text-xs font-semibold text-white shadow-md">
                Trending
              </span>
            )}
          </div>

          {/* Quick Hover Action Bar */}
          <div className="absolute inset-0 bg-gradient-to-t from-fashion-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setShowDetailModal(true)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                View
              </button>

              <Link
                href={`/try-on?shirt=${shirt.id}`}
                onClick={() => onTryOn?.(shirt)}
                className="flex-1 py-2.5 rounded-xl bg-fashion-accent text-white text-xs font-bold hover:bg-indigo-600 shadow-lg shadow-fashion-accent/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                Try On
              </Link>
            </div>
          </div>

        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-fashion-cyan">{shirt.category}</span>
              <span className="font-display font-extrabold text-xl text-white">₹{shirt.price.toLocaleString('en-IN')}</span>
            </div>

            <h3 className="font-display font-bold text-lg text-white group-hover:text-fashion-cyan transition-colors">
              {shirt.name}
            </h3>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {shirt.description}
            </p>
          </div>

          {/* Material & Style Tags */}
          <div className="pt-2 border-t border-fashion-border/50 flex items-center justify-between text-xs text-slate-400">
            <span className="truncate max-w-[160px] font-mono">{shirt.material}</span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px]">
              {shirt.fit}
            </span>
          </div>

        </div>

      </div>

      {/* View Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-fashion-card border border-fashion-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
            
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-900">
                <Image src={shirt.image} alt={shirt.name} fill className="object-cover" />
              </div>

              <div className="space-y-4">
                <span className="text-xs font-mono text-fashion-cyan uppercase tracking-wider">{shirt.category}</span>
                <h2 className="font-display text-2xl font-bold text-white">{shirt.name}</h2>
                <div className="text-3xl font-display font-extrabold text-white">₹{shirt.price.toLocaleString('en-IN')}</div>
                
                <p className="text-sm text-slate-300 leading-relaxed">{shirt.description}</p>

                <div className="space-y-2 text-xs text-slate-400 border-t border-b border-fashion-border py-3 font-mono">
                  <div><strong className="text-white">Color:</strong> {shirt.color}</div>
                  <div><strong className="text-white">Material:</strong> {shirt.material}</div>
                  <div><strong className="text-white">Fit:</strong> {shirt.fit}</div>
                  <div><strong className="text-white">Style:</strong> {shirt.style}</div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link
                    href={`/try-on?shirt=${shirt.id}`}
                    onClick={() => setShowDetailModal(false)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-fashion-accent to-fashion-cyan text-white text-sm font-bold shadow-xl flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Launch Virtual Try-On
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
