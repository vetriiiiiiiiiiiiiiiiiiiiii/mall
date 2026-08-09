'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Cpu, Camera, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 text-center">
        <span className="text-xs font-mono tracking-widest text-fashion-cyan uppercase bg-fashion-card px-4 py-1.5 rounded-full border border-fashion-border">
          Modern Fashion Tech
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
          About LUMIO FITS
        </h1>
        <p className="text-slate-400 text-sm sm:text-base font-light max-w-2xl mx-auto">
          Building the future of interactive e-commerce and AI-powered virtual try-on software.
        </p>
      </div>

      {/* Content Cards */}
      <div className="space-y-8">
        
        <div className="bg-fashion-card border border-fashion-border rounded-3xl p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fashion-accent/10 border border-fashion-accent/30 flex items-center justify-center text-fashion-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            LUMIO FITS aims to bridge the gap between online shopping and physical fitting rooms. By allowing customers to experience clothing fit, color combinations, and style silhouettes prior to purchasing, we reduce return rates and empower confident shopping decisions.
          </p>
        </div>

        <div className="bg-fashion-card border border-fashion-border rounded-3xl p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fashion-cyan/10 border border-fashion-cyan/30 flex items-center justify-center text-fashion-cyan">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Privacy-First Engineering</h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            We prioritize user data protection. All live webcam video streams and pose tracking landmarks are processed strictly inside your browser window using client-side WebGL and WebRTC APIs without uploading video to external servers.
          </p>
        </div>

      </div>

    </div>
  );
}
