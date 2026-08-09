'use client';

import React from 'react';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { ShirtGrid } from '@/components/ShirtGrid';
import { SHIRTS } from '@/data/shirts';
import { Camera, Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <Hero />

      {/* Featured 5 Shirts Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-fashion-border pb-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-fashion-cyan uppercase">
              Curated Essentials
            </span>
            <h2 className="font-display text-3xl font-extrabold text-white mt-1">
              Browse The 5 Core Shirts
            </h2>
          </div>

          <Link
            href="/collection"
            className="inline-flex items-center text-sm font-semibold text-fashion-cyan hover:text-white transition-colors"
          >
            View Full Collection & AI Search <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        <ShirtGrid shirts={SHIRTS} />
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-fashion-card via-fashion-dark to-slate-900 border border-fashion-border p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-fashion-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fashion-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fashion-accent/10 border border-fashion-accent/30 text-xs font-mono text-fashion-cyan">
            <Sparkles className="w-4 h-4" /> Ready to transform how you shop?
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto">
            Experience Live 3D Fitting or AI Photo Try-On Today
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-light">
            No signup required. Select any shirt and start your fitting session immediately.
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              href="/try-on"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-fashion-accent to-fashion-cyan shadow-xl hover:shadow-fashion-accent/30 hover:scale-[1.03] transition-all"
            >
              <Camera className="w-5 h-5 mr-2" />
              Launch Fitting Room Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
