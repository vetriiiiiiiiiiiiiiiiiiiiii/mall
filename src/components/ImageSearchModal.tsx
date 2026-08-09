'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Upload, Sparkles, Camera, CheckCircle2, ArrowRight, Tag, Layers, Sliders } from 'lucide-react';
import { analyzeUploadedImage } from '@/services/ai/vision';
import { AIVisionResult, SearchMatchResult } from '@/types/shirt';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImageSearchModal({ isOpen, onClose }: ImageSearchModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [visionResult, setVisionResult] = useState<AIVisionResult | null>(null);
  const [searchResults, setSearchResults] = useState<SearchMatchResult[] | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid JPG, PNG, or WebP image file.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      
      // Run AI Vision attribute extraction pipeline
      setIsAnalyzing(true);
      try {
        const { visionData, matches } = await analyzeUploadedImage(file);
        setVisionResult(visionData);
        setSearchResults(matches);
      } catch (err) {
        console.error('Image analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSampleImage = async (samplePath: string) => {
    setImagePreview(samplePath);
    setIsAnalyzing(true);
    try {
      const { visionData, matches } = await analyzeUploadedImage(samplePath);
      setVisionResult(visionData);
      setSearchResults(matches);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-fashion-card border border-fashion-border rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-fashion-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fashion-cyan/10 border border-fashion-cyan/20 flex items-center justify-center text-fashion-cyan">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                AI Vision Attribute Search
              </h2>
              <p className="text-xs text-slate-400">
                Upload any shirt image. AI extracts visual features (color + fit + style + sleeve type) to rank your 5 catalog products.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Upload Zone or AI Attribute Results */}
        {!imagePreview ? (
          <div className="space-y-6">
            
            {/* Drag & Drop File Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-fashion-border hover:border-fashion-accent rounded-3xl p-10 text-center space-y-4 bg-fashion-dark/50 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-fashion-accent/10 border border-fashion-accent/30 mx-auto flex items-center justify-center text-fashion-accent">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-white">Drag & drop clothing photo reference</p>
                <p className="text-xs text-slate-400">Supports JPG, JPEG, PNG, or WebP</p>
              </div>
              
              <label className="inline-flex items-center px-6 py-2.5 rounded-full bg-fashion-accent text-white text-xs font-bold hover:bg-indigo-600 cursor-pointer shadow-lg">
                Browse Image File
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Test Samples */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400">Or test with catalog reference photos:</span>
              <div className="grid grid-cols-5 gap-3">
                {['/images/urban-black.jpg', '/images/classic-white.jpg', '/images/ocean-blue.jpg', '/images/forest-green.jpg', '/images/beige-overshirt.jpg'].map((path, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSampleImage(path)}
                    className="relative aspect-square rounded-xl overflow-hidden border border-fashion-border hover:border-fashion-cyan transition-all"
                  >
                    <Image src={path} alt="Sample" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Visual Analysis & Feature Ranking */
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Uploaded Reference Image */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400">Uploaded Image Reference</span>
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-fashion-border bg-slate-900">
                  <Image src={imagePreview} alt="Reference" fill className="object-cover" />
                </div>
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setVisionResult(null);
                    setSearchResults(null);
                  }}
                  className="text-xs text-fashion-cyan hover:underline"
                >
                  Upload a different photo
                </button>
              </div>

              {/* AI Vision Extracted Attributes */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-fashion-cyan" />
                    <h3 className="font-display text-lg font-bold text-white">AI Extracted Attributes</h3>
                  </div>
                  {visionResult && (
                    <span className="px-3 py-1 rounded-full bg-fashion-emerald/10 border border-fashion-emerald/20 text-fashion-emerald text-xs font-mono font-bold">
                      Confidence: {(visionResult.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                {isAnalyzing ? (
                  <div className="p-8 bg-fashion-dark rounded-2xl border border-fashion-border text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-fashion-cyan border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-white">Extracting visual features (Color + Fit + Style + Material)...</p>
                  </div>
                ) : visionResult ? (
                  <div className="p-5 bg-fashion-dark rounded-2xl border border-fashion-border space-y-4">
                    
                    {/* Extracted Characteristic Pills */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-fashion-card border border-fashion-accent/40 text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-fashion-accent" />
                        Color: {visionResult.detectedColor}
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-fashion-card border border-fashion-cyan/40 text-xs font-bold text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-fashion-cyan" />
                        Fit: {visionResult.detectedFit}
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-fashion-card border border-purple-500/40 text-xs font-bold text-white flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-purple-400" />
                        Style: {visionResult.detectedStyle}
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-fashion-card border border-emerald-500/40 text-xs font-bold text-white flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-emerald-400" />
                        Material: {visionResult.detectedMaterial}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-mono">
                      No product name needed. AI parsed <span className="text-white font-bold">{visionResult.detectedColor}</span> + <span className="text-white font-bold">{visionResult.detectedFit}</span> + <span className="text-white font-bold">{visionResult.detectedStyle}</span> features to rank recommendations.
                    </p>

                  </div>
                ) : null}

              </div>

            </div>

            {/* Similar Shirts Found */}
            {searchResults && searchResults.length > 0 && (
              <div className="space-y-4 border-t border-fashion-border pt-6">
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  Ranked Catalog Shirts ({searchResults.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {searchResults.map(({ shirt, matchScore, reasonText }) => (
                    <div
                      key={shirt.id}
                      className="flex items-center gap-4 p-4 bg-fashion-dark border border-fashion-border rounded-2xl hover:border-fashion-accent transition-colors"
                    >
                      <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                        <Image src={shirt.image} alt={shirt.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-fashion-emerald/10 text-fashion-emerald text-[11px] font-bold font-mono">
                            {matchScore}% Match
                          </span>
                          <span className="font-bold text-white text-sm">₹{shirt.price.toLocaleString('en-IN')}</span>
                        </div>

                        <h4 className="font-semibold text-white text-sm truncate">{shirt.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{reasonText}</p>

                        <Link
                          href={`/try-on?shirt=${shirt.id}`}
                          onClick={onClose}
                          className="inline-flex items-center text-xs font-bold text-fashion-cyan hover:underline pt-1"
                        >
                          Try On This Shirt <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
