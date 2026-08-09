'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingAIProps {
  message: string;
  progress: number;
}

export function LoadingAI({ message, progress }: LoadingAIProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-fashion-card border border-fashion-border rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-fashion-accent/20 animate-ping" />
          <div className="w-full h-full rounded-full border-4 border-t-fashion-cyan border-r-fashion-accent border-b-transparent border-l-transparent animate-spin flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-fashion-cyan" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-xl font-bold text-white">AI Virtual Try-On</h3>
          <p className="text-sm font-mono text-fashion-cyan animate-pulse">{message || 'Processing your look...'}</p>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-fashion-accent to-fashion-cyan h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
