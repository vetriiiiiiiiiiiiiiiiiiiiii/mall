'use client';

import React from 'react';
import { Shirt } from '@/types/shirt';
import { ShirtCard } from './ShirtCard';

interface ShirtGridProps {
  shirts: Shirt[];
  onTryOn?: (shirt: Shirt) => void;
}

export function ShirtGrid({ shirts, onTryOn }: ShirtGridProps) {
  if (shirts.length === 0) {
    return (
      <div className="w-full py-16 text-center bg-fashion-card border border-fashion-border rounded-3xl p-8 space-y-3">
        <p className="text-lg font-semibold text-white">No exact shirts found</p>
        <p className="text-sm text-slate-400">Try searching for "black", "casual", "linen", or "formal shirt".</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {shirts.map((shirt) => (
        <ShirtCard key={shirt.id} shirt={shirt} onTryOn={onTryOn} />
      ))}
    </div>
  );
}
