'use client';

import React from 'react';
import Link from 'next/link';
import { HowItWorks } from '@/components/HowItWorks';
import { Sparkles, Camera, Cpu, Shirt, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fashion-card border border-fashion-border text-xs font-mono text-fashion-cyan">
          <Cpu className="w-4 h-4" /> AI & 3D Architecture Breakdown
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
          How LUMIO FITS Virtual Fitting Works
        </h1>
        <p className="text-slate-400 text-sm sm:text-base font-light">
          Combining WebGL 3D rendering, MediaPipe real-time pose estimation, and computer vision generative AI.
        </p>
      </div>

      <HowItWorks />

      {/* Technology Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Tech 1 */}
        <div className="bg-fashion-card border border-fashion-border rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-fashion-accent/10 border border-fashion-accent/30 flex items-center justify-center text-fashion-accent">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">1. AI Photo Virtual Try-On</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            Our AI photo pipeline isolates torso boundaries, evaluates body curvature, and realistically drapes selected shirt fabrics while preserving face, hair, arms, background, and environmental lighting.
          </p>
        </div>

        {/* Tech 2 */}
        <div className="bg-fashion-card border border-fashion-border rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-fashion-cyan/10 border border-fashion-cyan/30 flex items-center justify-center text-fashion-cyan">
            <Shirt className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">2. Real-Time 3D Live Fitting</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            Using MediaPipe body landmarks directly in WebRTC video stream, 3D clothing meshes built in Three.js and React Three Fiber adjust rotation, scale, and shoulder width live with user movement.
          </p>
        </div>

      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <Link
          href="/try-on"
          className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-fashion-accent to-fashion-cyan shadow-xl hover:scale-[1.03] transition-all"
        >
          <Sparkles className="w-5 h-5 mr-2" /> Launch Virtual Fitting Room <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>

    </div>
  );
}
