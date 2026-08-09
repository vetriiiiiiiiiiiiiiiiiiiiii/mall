'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Shirt } from '@/types/shirt';
import { useCamera } from '@/hooks/useCamera';
import { usePoseTracking } from '@/hooks/usePoseTracking';
import { GarmentRenderer } from './3d/GarmentRenderer';
import { Camera, RotateCw, RefreshCw, Maximize2, Minimize2, Video, VideoOff, AlertCircle, Sparkles, Bug } from 'lucide-react';

interface LiveTryOnProps {
  shirt: Shirt;
  allShirts: Shirt[];
  onSelectShirt: (shirt: Shirt) => void;
}

export function LiveTryOn({ shirt, allShirts, onSelectShirt }: LiveTryOnProps) {
  const { videoRef, isCameraActive, isLoading, error, startCamera, stopCamera } = useCamera();
  const { poseData, isTracking, segmentationMask } = usePoseTracking(videoRef.current, isCameraActive);
  
  const [manualRotationY, setManualRotationY] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDebugMode, setIsDebugMode] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const occlusionCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleRotate = () => {
    setManualRotationY((prev) => prev + Math.PI / 4);
  };

  const handleReset = () => {
    setManualRotationY(0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  // Draw the segmentation mask to a canvas for debug or advanced compositing
  useEffect(() => {
    if (isDebugMode && segmentationMask && occlusionCanvasRef.current) {
      const ctx = occlusionCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, occlusionCanvasRef.current.width, occlusionCanvasRef.current.height);
        ctx.drawImage(segmentationMask, 0, 0, occlusionCanvasRef.current.width, occlusionCanvasRef.current.height);
      }
    }
  }, [segmentationMask, isDebugMode]);

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col bg-fashion-dark rounded-3xl border border-fashion-border overflow-hidden relative shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'min-h-[600px]'
      }`}
    >
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-fashion-card/80 backdrop-blur-md border-b border-fashion-border z-30 gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-fashion-emerald animate-ping' : 'bg-slate-500'}`} />
          <span className="font-display font-bold text-white text-sm sm:text-base flex items-center gap-2">
            REAL-TIME VIRTUAL TRY-ON
          </span>
          <span className="hidden sm:inline-block px-3 py-0.5 rounded-full bg-fashion-cyan/10 border border-fashion-cyan/20 text-fashion-cyan text-xs font-mono">
            Wearing: {shirt.name}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsDebugMode(!isDebugMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-colors flex items-center gap-1 ${
              isDebugMode ? 'bg-fashion-cyan/20 border-fashion-cyan text-fashion-cyan' : 'bg-fashion-dark border-fashion-border text-slate-400 hover:text-white'
            }`}
          >
            <Bug className="w-3 h-3" /> Debug
          </button>

          <button
            onClick={handleRotate}
            title="Rotate Garment"
            className="px-3 py-1.5 flex items-center gap-1.5 rounded-xl bg-fashion-dark border border-fashion-border text-slate-300 hover:text-white hover:border-fashion-accent transition-colors text-xs font-semibold"
          >
            <RotateCw className="w-3.5 h-3.5" /> Turn
          </button>

          <button
            onClick={handleReset}
            title="Reset Orientation"
            className="px-3 py-1.5 flex items-center gap-1.5 rounded-xl bg-fashion-dark border border-fashion-border text-slate-300 hover:text-white hover:border-fashion-accent transition-colors text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Front
          </button>

          <button
            onClick={isCameraActive ? stopCamera : startCamera}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isCameraActive
                ? 'bg-fashion-rose/90 text-white shadow-lg'
                : 'bg-fashion-accent text-white hover:bg-indigo-600 shadow-lg shadow-fashion-accent/30'
            }`}
          >
            {isCameraActive ? (
              <>
                <VideoOff className="w-3.5 h-3.5" /> Stop
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" /> Camera
              </>
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl bg-fashion-dark border border-fashion-border text-slate-300 hover:text-white hover:border-fashion-accent transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Video Fitting Room Viewport */}
      <div className="relative flex-1 w-full h-[480px] sm:h-[560px] bg-slate-950 overflow-hidden flex items-center justify-center">
        
        {/* Camera Permission / Start Prompt when Camera is Inactive */}
        {!isCameraActive && !isLoading && (
          <div className="absolute z-30 max-w-md mx-4 p-6 bg-fashion-card/90 backdrop-blur-xl border border-fashion-border rounded-3xl text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-fashion-cyan/10 border border-fashion-cyan/30 mx-auto flex items-center justify-center text-fashion-cyan">
              <Camera className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h4 className="font-display font-bold text-white text-lg">Start Video 3D Body Fitting</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Activate your camera to wear the 3D shirt directly on your video body. The garment deforms dynamically with your real body movements.
              </p>
            </div>

            {error ? (
              <div className="p-3 bg-fashion-rose/10 border border-fashion-rose/30 rounded-xl text-fashion-rose text-xs font-semibold flex items-center gap-2 text-left">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <button
              onClick={startCamera}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-fashion-accent to-fashion-cyan text-white font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Webcam & Fit 3D Shirt
            </button>
          </div>
        )}

        {/* Live Webcam Video Feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 scale-x-[-1] ${
            isCameraActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* 3D Shirt Fitting Layer Fitted Directly On User Video Body */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <GarmentRenderer
            shirt={shirt}
            poseData={isCameraActive ? poseData : null}
            manualRotationY={manualRotationY}
            isCameraActive={isCameraActive}
            isDebugMode={isDebugMode}
          />
        </div>

        {/* Developer Debug Overlay */}
        {isCameraActive && isDebugMode && (
          <div className="absolute inset-0 z-40 pointer-events-none">
            {/* Segmentation Mask Canvas */}
            <canvas
              ref={occlusionCanvasRef}
              width={1280}
              height={720}
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen scale-x-[-1]"
            />

            {/* Pose Landmark Overlay */}
            {poseData && (
              <svg className="absolute inset-0 w-full h-full scale-x-[-1]">
                <line x1={`${poseData.leftShoulder.x * 100}%`} y1={`${poseData.leftShoulder.y * 100}%`} x2={`${poseData.rightShoulder.x * 100}%`} y2={`${poseData.rightShoulder.y * 100}%`} stroke="#06B6D4" strokeWidth="3" strokeDasharray="4" />
                <line x1={`${poseData.leftShoulder.x * 100}%`} y1={`${poseData.leftShoulder.y * 100}%`} x2={`${poseData.leftElbow.x * 100}%`} y2={`${poseData.leftElbow.y * 100}%`} stroke="#6366F1" strokeWidth="2" />
                <line x1={`${poseData.rightShoulder.x * 100}%`} y1={`${poseData.rightShoulder.y * 100}%`} x2={`${poseData.rightElbow.x * 100}%`} y2={`${poseData.rightElbow.y * 100}%`} stroke="#6366F1" strokeWidth="2" />
                <line x1={`${poseData.leftElbow.x * 100}%`} y1={`${poseData.leftElbow.y * 100}%`} x2={`${poseData.leftWrist.x * 100}%`} y2={`${poseData.leftWrist.y * 100}%`} stroke="#10B981" strokeWidth="2" />
                <line x1={`${poseData.rightElbow.x * 100}%`} y1={`${poseData.rightElbow.y * 100}%`} x2={`${poseData.rightWrist.x * 100}%`} y2={`${poseData.rightWrist.y * 100}%`} stroke="#10B981" strokeWidth="2" />
                <line x1={`${poseData.leftShoulder.x * 100}%`} y1={`${poseData.leftShoulder.y * 100}%`} x2={`${poseData.leftHip.x * 100}%`} y2={`${poseData.leftHip.y * 100}%`} stroke="#F59E0B" strokeWidth="2" />
                <line x1={`${poseData.rightShoulder.x * 100}%`} y1={`${poseData.rightShoulder.y * 100}%`} x2={`${poseData.rightHip.x * 100}%`} y2={`${poseData.rightHip.y * 100}%`} stroke="#F59E0B" strokeWidth="2" />
                <line x1={`${poseData.leftHip.x * 100}%`} y1={`${poseData.leftHip.y * 100}%`} x2={`${poseData.rightHip.x * 100}%`} y2={`${poseData.rightHip.y * 100}%`} stroke="#F59E0B" strokeWidth="2" />
                
                <circle cx={`${poseData.leftShoulder.x * 100}%`} cy={`${poseData.leftShoulder.y * 100}%`} r="6" fill="#06B6D4" />
                <circle cx={`${poseData.rightShoulder.x * 100}%`} cy={`${poseData.rightShoulder.y * 100}%`} r="6" fill="#06B6D4" />
                <circle cx={`${poseData.leftElbow.x * 100}%`} cy={`${poseData.leftElbow.y * 100}%`} r="5" fill="#6366F1" />
                <circle cx={`${poseData.rightElbow.x * 100}%`} cy={`${poseData.rightElbow.y * 100}%`} r="5" fill="#6366F1" />
                <circle cx={`${poseData.leftWrist.x * 100}%`} cy={`${poseData.leftWrist.y * 100}%`} r="4" fill="#10B981" />
                <circle cx={`${poseData.rightWrist.x * 100}%`} cy={`${poseData.rightWrist.y * 100}%`} r="4" fill="#10B981" />
                <circle cx={`${poseData.leftHip.x * 100}%`} cy={`${poseData.leftHip.y * 100}%`} r="6" fill="#F59E0B" />
                <circle cx={`${poseData.rightHip.x * 100}%`} cy={`${poseData.rightHip.y * 100}%`} r="6" fill="#F59E0B" />
              </svg>
            )}

            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-green-400 font-mono text-xs p-3 rounded-lg border border-green-500/30 whitespace-pre">
              DEBUG MODE ENABLED{'\n'}
              Tracking: {isTracking ? 'ACTIVE' : 'INACTIVE'}{'\n'}
              Pose: {poseData ? 'DETECTED' : 'WAITING'}{'\n'}
              Segmentation: {segmentationMask ? 'READY' : 'WAITING'}
            </div>
          </div>
        )}

        {/* Real-time Status Badge */}
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-fashion-dark/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-fashion-border text-xs text-slate-300 font-mono shadow-xl">
          <span className={`w-2.5 h-2.5 rounded-full ${isTracking ? 'bg-fashion-emerald animate-ping' : 'bg-slate-500'}`} />
          <span>{isTracking ? '● Body tracking active' : 'Waiting for camera...'}</span>
        </div>

      </div>

    </div>
  );
}

