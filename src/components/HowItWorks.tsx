'use client';

import React from 'react';
import { Shirt, Camera, Sparkles, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      stepNumber: '01',
      title: 'Choose Your Style',
      description: 'Pick any of the 5 premium curated shirts from our collection. Filter by color, material, or use AI natural-language search.',
      icon: Shirt,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Step 1',
    },
    {
      stepNumber: '02',
      title: 'Show Yourself',
      description: 'Upload your photo for AI Photo Try-On or enable your webcam for the live 3D fitting room pose tracking experience.',
      icon: Camera,
      color: 'from-fashion-accent to-purple-600',
      badge: 'Step 2',
    },
    {
      stepNumber: '03',
      title: 'See Yourself Wearing It',
      description: 'Watch AI synthesize the shirt onto your photo with lighting & body fold matching, or view live motion on the 3D model.',
      icon: Sparkles,
      color: 'from-fashion-cyan to-emerald-500',
      badge: 'Step 3',
    },
  ];

  return (
    <section className="py-20 bg-fashion-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono tracking-widest text-fashion-cyan uppercase bg-fashion-card px-4 py-1.5 rounded-full border border-fashion-border">
            Seamless Virtual Experience
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            How The AI Fitting Room Works
          </h2>
          <p className="text-slate-400 text-base">
            From browse to virtual try-on in seconds. Powered by computer vision and generative AI.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="group relative bg-fashion-card/70 border border-fashion-border rounded-3xl p-8 hover:border-fashion-accent/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
              >
                {/* Step Number Background */}
                <div className="text-6xl font-display font-black text-white/5 absolute top-6 right-6 select-none">
                  {step.stepNumber}
                </div>

                {/* Icon Circle */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} p-[1px] mb-6 shadow-lg`}>
                  <div className="w-full h-full bg-fashion-dark rounded-[15px] flex items-center justify-center text-white">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>

                {/* Badge */}
                <span className="inline-block text-xs font-mono font-semibold text-fashion-cyan mb-2">
                  {step.badge}
                </span>

                {/* Title */}
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  {step.description}
                </p>

                {/* Decorative Bottom Bar */}
                <div className="mt-6 pt-4 border-t border-fashion-border/40 flex items-center text-xs font-semibold text-fashion-accent group-hover:text-fashion-cyan transition-colors">
                  <span>Explore feature</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
