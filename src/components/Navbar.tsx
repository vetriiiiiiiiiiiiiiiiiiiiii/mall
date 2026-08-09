'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Shirt as ShirtIcon, Menu, X, Camera } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collection', href: '/collection' },
    { name: 'AI Try-On', href: '/try-on' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-fashion-dark/80 border-b border-fashion-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fashion-accent to-fashion-cyan p-[1px] shadow-lg shadow-fashion-accent/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-fashion-dark rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-fashion-cyan" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                LUMIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-fashion-accent to-fashion-cyan">FITS</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
                AI Virtual Fitting Room
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-fashion-card/60 p-1.5 rounded-full border border-fashion-border">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-fashion-accent text-white shadow-lg shadow-fashion-accent/25'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Primary CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/try-on"
              className="group relative inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-fashion-accent via-indigo-600 to-fashion-cyan hover:shadow-xl hover:shadow-fashion-accent/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Camera className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Try On Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-fashion-card border border-fashion-border"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-fashion-card border-b border-fashion-border px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium ${
                pathname === link.href
                  ? 'bg-fashion-accent text-white'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/try-on"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-fashion-accent to-fashion-cyan shadow-lg"
            >
              <Camera className="w-4 h-4 mr-2" />
              Launch Virtual Fitting Room
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
