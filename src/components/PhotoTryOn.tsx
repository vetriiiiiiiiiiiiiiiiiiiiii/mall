'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Shirt, TryOnResult } from '@/types/shirt';
import { Upload, Download, Sparkles, RefreshCw, Camera, MoveHorizontal, CheckCircle2 } from 'lucide-react';
import { generateVirtualPhotoTryOn } from '@/services/ai/tryon';

interface PhotoTryOnProps {
  shirt: Shirt;
  onTryAnotherShirt?: () => void;
}

export function PhotoTryOn({ shirt, onTryAnotherShirt }: PhotoTryOnProps) {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stepMessage, setStepMessage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0-100
  const isDraggingRef = useRef<boolean>(false);

  // Sample portrait photos for instant testing
  const sampleUserPhotos = [
    { name: 'Model Male 01', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80' },
    { name: 'Model Female 01', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80' },
    { name: 'Casual Studio', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setUploadedPhoto(dataUrl);
        runTryOnPipeline(dataUrl, shirt);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    setUploadedPhoto(sampleUrl);
    runTryOnPipeline(sampleUrl, shirt);
  };

  const runTryOnPipeline = async (userImg: string, targetShirt: Shirt) => {
    setIsProcessing(true);
    setTryOnResult(null);

    try {
      const result = await generateVirtualPhotoTryOn(userImg, targetShirt, (msg, pct) => {
        setStepMessage(msg);
        setProgressPercent(pct);
      });
      setTryOnResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!tryOnResult) return;
    const link = document.createElement('a');
    link.href = tryOnResult.tryOnImage;
    link.download = `lumio-ai-tryon-${shirt.id}.jpg`;
    link.click();
  };

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Upload Zone when no image selected */}
      {!uploadedPhoto && !isProcessing && (
        <div className="bg-fashion-card border border-fashion-border rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-2xl">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-fashion-accent/10 border border-fashion-accent/30 mx-auto flex items-center justify-center text-fashion-accent">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">Upload Your Photo</h3>
            <p className="text-sm text-slate-400">
              Upload a clear front-facing portrait or full-body photo. Supports JPG, PNG, and WebP.
            </p>
          </div>

          {/* Upload Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <label className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-fashion-accent to-fashion-cyan text-white text-base font-bold cursor-pointer hover:shadow-xl hover:shadow-fashion-accent/30 transition-all">
              <Upload className="w-5 h-5 mr-2" />
              Select Photo from Device
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Sample Photos */}
          <div className="pt-6 border-t border-fashion-border/50 space-y-3">
            <span className="text-xs font-mono text-slate-400">Or test instantly with a demo photo:</span>
            <div className="flex items-center justify-center gap-4">
              {sampleUserPhotos.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample.url)}
                  className="group relative w-20 h-24 rounded-2xl overflow-hidden border border-fashion-border hover:border-fashion-cyan transition-all hover:scale-105"
                >
                  <Image src={sample.url} alt={sample.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                    Use
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Processing Loading State */}
      {isProcessing && (
        <div className="bg-fashion-card border border-fashion-border rounded-3xl p-12 text-center space-y-6 max-w-lg mx-auto shadow-2xl">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-fashion-accent/20 animate-ping" />
            <div className="w-full h-full rounded-full border-4 border-t-fashion-cyan border-r-fashion-accent border-b-transparent border-l-transparent animate-spin flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-fashion-cyan" />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-display text-xl font-bold text-white">AI is fitting your shirt...</h4>
            <p className="text-sm font-mono text-fashion-cyan">{stepMessage}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-fashion-accent to-fashion-cyan h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Try-On Result & Draggable Before/After Comparison Slider */}
      {tryOnResult && !isProcessing && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-fashion-emerald" />
              <h3 className="font-display text-xl font-bold text-white">AI Virtual Try-On Result</h3>
            </div>

            <button
              onClick={() => {
                setUploadedPhoto(null);
                setTryOnResult(null);
              }}
              className="px-4 py-2 rounded-xl bg-fashion-card border border-fashion-border text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-500"
            >
              Upload New Photo
            </button>
          </div>

          {/* Draggable Before / After Split Slider Container */}
          <div className="relative aspect-[3/4] max-w-xl mx-auto rounded-3xl overflow-hidden border border-fashion-border shadow-2xl select-none group">
            
            {/* AFTER Image (Full Canvas underneath) */}
            <Image
              src={tryOnResult.tryOnImage}
              alt="After Try On"
              fill
              className="object-cover object-top"
            />
            <div className="absolute top-4 right-4 bg-fashion-accent/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-md">
              AFTER ({shirt.name})
            </div>

            {/* BEFORE Image (Clipped overlay on top) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <Image
                src={tryOnResult.originalImage}
                alt="Before Try On"
                fill
                className="object-cover object-top max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-md">
                BEFORE
              </div>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center shadow-2xl"
              style={{ left: `${sliderPos}%` }}
              onMouseDown={() => (isDraggingRef.current = true)}
              onTouchStart={() => (isDraggingRef.current = true)}
            >
              <div className="w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center border-2 border-fashion-accent">
                <MoveHorizontal className="w-4 h-4" />
              </div>
            </div>

            {/* Interactive Mouse & Touch Listener for Slider */}
            <div
              className="absolute inset-0 z-10 cursor-ew-resize"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleSliderMove(e.clientX, rect);
              }}
              onTouchMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                if (e.touches[0]) handleSliderMove(e.touches[0].clientX, rect);
              }}
            />

          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-fashion-accent text-white font-bold text-sm hover:bg-indigo-600 shadow-xl shadow-fashion-accent/30 transition-all"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Result
            </button>

            <button
              onClick={onTryAnotherShirt}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-fashion-card border border-fashion-border text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2 text-fashion-cyan" />
              Try Another Shirt
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
