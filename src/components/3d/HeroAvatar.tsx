'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { SHIRTS } from '@/data/shirts';
import { GLTFGarment } from './GLTFGarment';

function HumanoidMannequin() {
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const defaultShirt = SHIRTS[0];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(t * 1.5) * 0.03;
      bodyRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.1;
    }
  });

  return (
    <group ref={bodyRef} position={[0, -0.6, 0]}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.22, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.4} />
      </mesh>

      {/* Shirt Layer */}
      <group position={[0, 0.35, 0]} scale={[1.05, 1.05, 1.05]}>
        <GLTFGarment shirt={defaultShirt} poseData={null} isCameraActive={false} />
      </group>

      {/* Lower Body */}
      <group position={[0, -0.95, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.36, 0.35, 24]} />
          <meshStandardMaterial color="#1E293B" roughness={0.6} />
        </mesh>
        <mesh position={[-0.2, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.12, 1.1, 24]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>
        <mesh position={[0.2, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.12, 1.1, 24]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

export function HeroAvatar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full h-[480px] lg:h-[580px] relative rounded-3xl overflow-hidden glassmorphism border border-fashion-border flex items-center justify-center bg-slate-950">
      {mounted ? (
        <Canvas
          camera={{ position: [0, 0.5, 3.8], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
          <pointLight position={[-4, 3, -2]} intensity={0.8} color="#06B6D4" />
          <pointLight position={[4, -2, 2]} intensity={0.6} color="#6366F1" />

          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <HumanoidMannequin />
          </Float>

          <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={6} blur={2} far={4} />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={Math.PI / 3} />
        </Canvas>
      ) : (
        <div className="flex flex-col items-center gap-3 text-slate-400 font-mono text-xs">
          <div className="w-8 h-8 border-2 border-fashion-cyan border-t-transparent rounded-full animate-spin" />
          <span>Initializing 3D WebGL Canvas...</span>
        </div>
      )}

      {/* Pedestal Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-fashion-dark/90 backdrop-blur-md px-4 py-2 rounded-full border border-fashion-border text-xs text-slate-300 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-fashion-cyan animate-ping" />
        <span>3D Interactive Avatar • Drag to rotate</span>
      </div>
    </div>
  );
}
