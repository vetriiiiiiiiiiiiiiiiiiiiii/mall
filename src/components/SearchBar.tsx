'use client';

import React, { useState } from 'react';
import { Search, Sparkles, Camera, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onOpenImageSearch: () => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, onOpenImageSearch, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const sampleQueries = [
    'I want something dark and casual',
    'Classic white formal shirt for office',
    'Ocean blue cotton shirt',
    'Green linen summer shirt',
    'Beige overshirt',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleSelectSample = (sample: string) => {
    setQuery(sample);
    onSearch(sample);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-fashion-cyan">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shirts using AI... (e.g. 'dark casual shirt', 'linen for summer', 'office white')"
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-fashion-card border border-fashion-border focus:border-fashion-accent focus:ring-2 focus:ring-fashion-accent/20 text-white placeholder-slate-400 text-sm sm:text-base outline-none transition-all shadow-xl"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* AI Text Search Submit */}
        <button
          type="submit"
          className="hidden sm:inline-flex items-center px-6 py-4 rounded-2xl bg-fashion-accent text-white font-semibold text-sm hover:bg-indigo-600 shadow-lg shadow-fashion-accent/30 transition-all"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </button>

        {/* AI Image Search Trigger Button */}
        <button
          type="button"
          onClick={onOpenImageSearch}
          className="inline-flex items-center px-5 py-4 rounded-2xl bg-gradient-to-r from-fashion-card to-slate-800 hover:from-fashion-accent/20 hover:to-fashion-cyan/20 border border-fashion-border text-white text-sm font-semibold transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
        >
          <Camera className="w-5 h-5 mr-2 text-fashion-cyan" />
          <span>📷 Search by Image</span>
        </button>
      </form>

      {/* Suggested Query Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-500 font-mono flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-fashion-cyan" /> Try AI prompts:
        </span>
        {sampleQueries.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectSample(sample)}
            className="shrink-0 px-3 py-1 rounded-full bg-fashion-card/80 border border-fashion-border/70 hover:border-fashion-accent text-slate-300 hover:text-white transition-colors"
          >
            "{sample}"
          </button>
        ))}
      </div>
    </div>
  );
}
