'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Sparkles, ArrowRight, Shirt, Eye, ShieldCheck } from 'lucide-react';
import { HeroAvatar } from './3d/HeroAvatar';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24">
      
      {/* Dynamic Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-fashion-accent/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-fashion-cyan/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text Content & CTAs */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fashion-card border border-fashion-border text-xs font-mono text-fashion-cyan shadow-lg">
              <Sparkles className="w-4 h-4 text-fashion-cyan animate-pulse" />
              <span>Next-Gen AI & Real-Time 3D Fitting Room</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Try It. See It.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fashion-accent via-indigo-400 to-fashion-cyan">
                Wear It.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-light">
              Experience your next shirt before you buy it with AI-powered virtual try-on. See photorealistic fits on yourself or interact live with our 3D avatar fitting engine.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/try-on"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-fashion-accent via-indigo-600 to-fashion-cyan hover:shadow-2xl hover:shadow-fashion-accent/40 transition-all hover:scale-[1.03] active:scale-[0.98] group"
              >
                <Camera className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                Try a Shirt
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/collection"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-semibold text-slate-200 bg-fashion-card hover:bg-fashion-card/80 border border-fashion-border hover:border-slate-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Shirt className="w-5 h-5 mr-2 text-fashion-cyan" />
                Explore Collection
              </Link>
            </div>

            {/* Stats & Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-fashion-border/60">
              <div>
                <span className="block font-display font-bold text-2xl text-white">5</span>
                <span className="text-xs text-slate-400 font-mono">Curated Shirts</span>
              </div>
              <div>
                <span className="block font-display font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-fashion-cyan to-emerald-400">
                  Real-time
                </span>
                <span className="text-xs text-slate-400 font-mono">Pose Tracking</span>
              </div>
              <div>
                <span className="block font-display font-bold text-2xl text-white">100%</span>
                <span className="text-xs text-slate-400 font-mono">Privacy Preserved</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Fashion Model Avatar */}
          <div className="lg:col-span-6">
            <HeroAvatar />
          </div>

        </div>
      </div>
    </section>
  );
}
