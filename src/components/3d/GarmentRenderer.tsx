'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Shirt, PoseData } from '@/types/shirt';
import { GLTFGarment } from './GLTFGarment';

interface GarmentRendererProps {
  shirt: Shirt;
  poseData: PoseData | null;
  manualRotationY?: number;
  isCameraActive?: boolean;
  isDebugMode?: boolean;
}

// Invisible cylinder to block the shirt where the user's arm is
function ArmOccluder({ start, end, radius }: { start: THREE.Vector3, end: THREE.Vector3, radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Position at midpoint
    meshRef.current.position.copy(start).lerp(end, 0.5);
    
    // Calculate distance and rotate cylinder to match
    const distance = start.distanceTo(end);
    meshRef.current.scale.y = distance;
    
    // LookAt orientation
    if (distance > 0.01) {
      meshRef.current.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        end.clone().sub(start).normalize()
      );
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={-1}>
      <cylinderGeometry args={[radius, radius, 1, 16]} />
      {/* colorWrite=false means it only writes to depth buffer, blocking objects behind it! */}
      <meshBasicMaterial colorWrite={false} depthWrite={true} />
    </mesh>
  );
}

function DynamicBodyAndGarment({
  shirt,
  poseData,
  manualRotationY = 0,
  isCameraActive = false,
  isDebugMode = false,
}: GarmentRendererProps) {
  const avatarGroupRef = useRef<THREE.Group>(null);
  const leftArmOccluderStart = useRef(new THREE.Vector3());
  const leftArmOccluderEnd = useRef(new THREE.Vector3());
  const rightArmOccluderStart = useRef(new THREE.Vector3());
  const rightArmOccluderEnd = useRef(new THREE.Vector3());

  useFrame(() => {
    if (avatarGroupRef.current) {
      if (poseData && isCameraActive) {
        // Map normalized coordinates (0 to 1) to Three.js space
        // Using precise FOV projection approximations: height ~ 2.8 at z=3.4, width ~ 5.0
        const targetX = -(poseData.torsoCenter.x - 0.5) * 5.0;
        const targetY = -(poseData.torsoCenter.y - 0.5) * 2.9;
        
        // Non-uniform fitting based on specific body metrics (Shoulder, Hip, Stomach)
        const targetScaleX = Math.max(0.6, Math.min(2.5, poseData.torsoWidth * 6.5));
        // Torso height is the distance from shoulder to hip. We stretch the Y axis accordingly.
        const targetScaleY = Math.max(0.6, Math.min(2.5, poseData.torsoHeight * 4.2));
        // Estimate Z depth (stomach/chest depth) based on a mix of width and height
        const targetScaleZ = (targetScaleX * 0.6) + (targetScaleY * 0.4);

        const targetRotY = poseData.rotationY + manualRotationY;
        const targetTiltZ = poseData.tiltZ;

        // Use a faster lerp (0.4) for snappier responsive fitting
        avatarGroupRef.current.position.x += (targetX - avatarGroupRef.current.position.x) * 0.4;
        avatarGroupRef.current.position.y += (targetY - avatarGroupRef.current.position.y) * 0.4;
        
        // Morph the exact proportions of the garment to match the person's body type
        avatarGroupRef.current.scale.x += (targetScaleX - avatarGroupRef.current.scale.x) * 0.4;
        avatarGroupRef.current.scale.y += (targetScaleY - avatarGroupRef.current.scale.y) * 0.4;
        avatarGroupRef.current.scale.z += (targetScaleZ - avatarGroupRef.current.scale.z) * 0.4;

        // Clamp rotation to prevent unnatural twists (max ~45 degrees left/right)
        const clampedRotY = Math.max(-0.8, Math.min(0.8, targetRotY));
        const clampedTiltZ = Math.max(-0.5, Math.min(0.5, targetTiltZ));

        // Use Quaternion Spherical Interpolation (slerp) to prevent the "spinning" bug (Gimbal Lock)
        const targetQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, clampedRotY, clampedTiltZ, 'YXZ')
        );
        avatarGroupRef.current.quaternion.slerp(targetQuaternion, 0.4);

        // Update Occluders
        // We use slightly larger multipliers for the occluders to make sure they match the camera fov
        leftArmOccluderStart.current.set(-(poseData.leftShoulder.x - 0.5) * 5.0, -(poseData.leftShoulder.y - 0.5) * 4.0, 0.5);
        leftArmOccluderEnd.current.set(-(poseData.leftWrist.x - 0.5) * 5.0, -(poseData.leftWrist.y - 0.5) * 4.0, 0.5);
        
        rightArmOccluderStart.current.set(-(poseData.rightShoulder.x - 0.5) * 5.0, -(poseData.rightShoulder.y - 0.5) * 4.0, 0.5);
        rightArmOccluderEnd.current.set(-(poseData.rightWrist.x - 0.5) * 5.0, -(poseData.rightWrist.y - 0.5) * 4.0, 0.5);
      } else {
        avatarGroupRef.current.position.set(0, -0.4, 0);
        avatarGroupRef.current.scale.setScalar(1.0);
        avatarGroupRef.current.rotation.set(0, manualRotationY, 0);
      }
    }
  });

  const leftArmAngleZ = poseData?.leftArmAngleZ ?? 0.35;
  const rightArmAngleZ = poseData?.rightArmAngleZ ?? -0.35;

  return (
    <>
      <group ref={avatarGroupRef} position={[0, -0.4, 0]}>
        {!isCameraActive && (
          <>
            <mesh position={[0, 1.4, 0]} castShadow>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color="#475569" roughness={0.3} />
            </mesh>

            <group position={[0, -0.95, 0]}>
              <mesh position={[0, 0.45, 0]} castShadow>
                <cylinderGeometry args={[0.42, 0.36, 0.35, 24]} />
                <meshStandardMaterial color="#1E293B" roughness={0.6} />
              </mesh>
            </group>
          </>
        )}

        <GLTFGarment
          shirt={shirt}
          poseData={poseData}
          isCameraActive={isCameraActive}
        />
      </group>
      
      {/* Invisible Depth Occluders to hide shirt when arms are in front */}
      {isCameraActive && poseData && (
        <>
           <ArmOccluder start={leftArmOccluderStart.current} end={leftArmOccluderEnd.current} radius={0.25} />
           <ArmOccluder start={rightArmOccluderStart.current} end={rightArmOccluderEnd.current} radius={0.25} />
        </>
      )}
    </>
  );
}

export function GarmentRenderer({
  shirt,
  poseData,
  manualRotationY = 0,
  isCameraActive = false,
  isDebugMode = false,
}: GarmentRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-fashion-cyan border-t-transparent rounded-full animate-spin" />
        <span>Initializing Garment Rendering Engine...</span>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="w-full h-full"
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 6, 4]} intensity={1.8} castShadow />
      <pointLight position={[-4, 2, -2]} intensity={0.8} color="#06B6D4" />
      <pointLight position={[4, -1, 2]} intensity={0.7} color="#6366F1" />

      <DynamicBodyAndGarment
        shirt={shirt}
        poseData={poseData}
        manualRotationY={manualRotationY}
        isCameraActive={isCameraActive}
        isDebugMode={isDebugMode}
      />

      {!isCameraActive && (
        <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={6} blur={2} far={4} />
      )}
    </Canvas>
  );
}
