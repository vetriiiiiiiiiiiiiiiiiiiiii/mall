'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shirt, ShieldCheck, Cpu, Camera } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-fashion-dark border-t border-fashion-border text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-fashion-accent flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              LUMIO FITS
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Next-generation AI virtual try-on technology bringing photorealistic fitting room experiences to your screen.
          </p>
          <div className="flex items-center gap-2 text-xs text-fashion-cyan font-mono">
            <Cpu className="w-4 h-4" />
            <span>Powered by Three.js & AI Vision</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/collection" className="hover:text-white transition-colors">Shirt Collection</Link></li>
            <li><Link href="/try-on" className="hover:text-white transition-colors">Virtual Fitting Room</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About AI Tech</Link></li>
          </ul>
        </div>

        {/* Tech Features */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Try-On Modes</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5 text-fashion-accent" /> AI Photo Try-On</li>
            <li className="flex items-center gap-1.5"><Shirt className="w-3.5 h-3.5 text-fashion-cyan" /> Real-time 3D Fitting</li>
            <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-fashion-emerald" /> AI Vision Image Search</li>
            <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-fashion-gold" /> MediaPipe Pose Tracking</li>
          </ul>
        </div>

        {/* Guarantee */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Privacy & Quality</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            All webcam video processing and body pose estimations run 100% locally in your browser. Photos are processed strictly for fitting preview.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Preserved Engine</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-fashion-border/50 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} LUMIO FITS AI. All rights reserved.</p>
        <p className="font-mono">Production AI Virtual Try-On Prototype</p>
      </div>
    </footer>
  );
}
