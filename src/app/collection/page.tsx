'use client';

import React, { useState } from 'react';
import { SHIRTS } from '@/data/shirts';
import { SearchBar } from '@/components/SearchBar';
import { ImageSearchModal } from '@/components/ImageSearchModal';
import { ShirtCard } from '@/components/ShirtCard';
import { performAISemanticSearch } from '@/services/ai/search';
import { SearchMatchResult } from '@/types/shirt';
import { Sparkles, Filter, RefreshCw, Camera } from 'lucide-react';

export default function CollectionPage() {
  const [searchResults, setSearchResults] = useState<SearchMatchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState<boolean>(false);
  const [activeQuery, setActiveQuery] = useState<string>('');

  const handleTextSearch = async (queryText: string) => {
    setActiveQuery(queryText);
    if (!queryText.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const results = await performAISemanticSearch(queryText);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearFilter = () => {
    setActiveQuery('');
    setSearchResults(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fashion-card border border-fashion-border text-xs font-mono text-fashion-cyan">
          <Sparkles className="w-4 h-4 text-fashion-cyan" /> Intelligent Fashion Catalog
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
          Shirt Collection & AI Search
        </h1>
        <p className="text-slate-400 text-sm sm:text-base font-light">
          Search using natural language (e.g. "dark casual shirt", "summer linen") or upload an image to find visual matches.
        </p>
      </div>

      {/* AI Search Control Center */}
      <div className="max-w-3xl mx-auto">
        <SearchBar
          onSearch={handleTextSearch}
          onOpenImageSearch={() => setIsImageSearchOpen(true)}
          initialQuery={activeQuery}
        />
      </div>

      {/* Active Search Status Banner */}
      {activeQuery && (
        <div className="flex items-center justify-between p-4 bg-fashion-card border border-fashion-border rounded-2xl">
          <div className="flex items-center gap-2 text-sm text-slate-300 font-mono">
            <Filter className="w-4 h-4 text-fashion-cyan" />
            <span>Active AI Search Filter: <strong className="text-white">"{activeQuery}"</strong></span>
          </div>

          <button
            onClick={handleClearFilter}
            className="text-xs font-semibold text-fashion-cyan hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filter
          </button>
        </div>
      )}

      {/* Search Results Grid */}
      {isSearching ? (
        <div className="w-full py-16 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-fashion-cyan border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-white">AI is evaluating semantic match vector embeddings...</p>
        </div>
      ) : searchResults ? (
        <div className="space-y-6">
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
            AI Ranked Results ({searchResults.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {searchResults.map(({ shirt, matchScore, reasonText }) => (
              <div key={shirt.id} className="relative space-y-2">
                
                {/* Match Percentage Badge */}
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-fashion-card border border-fashion-border text-xs">
                  <span className="font-bold text-fashion-emerald font-mono">{matchScore}% Match</span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[120px]">{reasonText}</span>
                </div>

                <ShirtCard shirt={shirt} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Standard 5 Shirt Catalog Grid */
        <div className="space-y-6">
          <h3 className="font-display text-xl font-bold text-white">All 5 Core Shirts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {SHIRTS.map((shirt) => (
              <ShirtCard key={shirt.id} shirt={shirt} />
            ))}
          </div>
        </div>
      )}

      {/* Image Search Modal Component */}
      <ImageSearchModal
        isOpen={isImageSearchOpen}
        onClose={() => setIsImageSearchOpen(false)}
      />

    </div>
  );
}
