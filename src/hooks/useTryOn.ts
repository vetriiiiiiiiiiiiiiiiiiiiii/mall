'use client';

import { useState, useCallback } from 'react';
import { Shirt, TryOnResult } from '@/types/shirt';
import { SHIRTS } from '@/data/shirts';

export type TryOnMode = 'ai-photo' | 'live-3d';

export function useTryOn(initialShirtId: string = 'shirt-01') {
  const [selectedShirt, setSelectedShirt] = useState<Shirt>(
    () => SHIRTS.find((s) => s.id === initialShirtId) || SHIRTS[0]
  );
  const [mode, setMode] = useState<TryOnMode>('live-3d');
  const [uploadedUserPhoto, setUploadedUserPhoto] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [aiProgressMessage, setAiProgressMessage] = useState<string>('');
  const [aiProgressPercent, setAiProgressPercent] = useState<number>(0);

  const selectShirt = useCallback((shirt: Shirt) => {
    setSelectedShirt(shirt);
  }, []);

  const selectShirtById = useCallback((shirtId: string) => {
    const found = SHIRTS.find((s) => s.id === shirtId);
    if (found) {
      setSelectedShirt(found);
    }
  }, []);

  return {
    selectedShirt,
    selectShirt,
    selectShirtById,
    mode,
    setMode,
    uploadedUserPhoto,
    setUploadedUserPhoto,
    tryOnResult,
    setTryOnResult,
    isProcessingAI,
    setIsProcessingAI,
    aiProgressMessage,
    setAiProgressMessage,
    aiProgressPercent,
    setAiProgressPercent,
    allShirts: SHIRTS,
  };
}
