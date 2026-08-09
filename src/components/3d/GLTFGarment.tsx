'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Shirt, PoseData } from '@/types/shirt';

interface GLTFGarmentProps {
  shirt: Shirt;
  poseData: PoseData | null;
  isCameraActive?: boolean;
  baseScale?: [number, number, number];
  basePosition?: [number, number, number];
}

function GarmentModel({ shirt, poseData, isCameraActive, baseScale = [0.09, 0.09, 0.09], basePosition = [0, -0.8, 0] }: GLTFGarmentProps) {
  // Load the real GLB model from the shirt data (or fallback to our dev asset)
  const modelPath = shirt.model3D || '/models/clothing/development-shirt.glb';
  const { scene } = useGLTF(modelPath) as any;

  // We will find and cache the bones for deformation
  const leftArmBone = useRef<THREE.Bone | null>(null);
  const rightArmBone = useRef<THREE.Bone | null>(null);

  // Traverse the loaded scene graph to configure materials and find the skeletal rig
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child: any) => {
      // Find Rig Bones
      if (child.isBone) {
        const name = child.name.toLowerCase();
        // Fallback names for arbitrary models since we don't have the final rig yet
        if (name.includes('left') && (name.includes('arm') || name.includes('shoulder'))) {
          leftArmBone.current = child;
        }
        if (name.includes('right') && (name.includes('arm') || name.includes('shoulder'))) {
          rightArmBone.current = child;
        }
      }

      // Configure Materials for True Garment Quality
      if (child.isMesh && child.material) {
        // Here we override the PBR material with our dynamic textures and colors
        // In a full production system, we'd use TextureLoader to load shirt.baseColorMap, normalMap, etc.
        // For development proof of concept, we set the color and roughness dynamically
        child.material = new THREE.MeshStandardMaterial({
          color: shirt.colorHex || '#ffffff',
          roughness: 0.85, // Fabric roughness
          metalness: 0.05,
          side: THREE.DoubleSide,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene, shirt.colorHex]);

  // Apply MediaPipe tracking data to the bones
  useFrame(() => {
    if (!isCameraActive || !poseData) return;

    // Apply exact kinematic angles to the skeleton
    if (leftArmBone.current) {
      // Depending on the rig's resting pose, this might need an offset.
      // Usually T-pose means Z is 0.
      leftArmBone.current.rotation.z = poseData.leftArmAngleZ;
    }
    
    if (rightArmBone.current) {
      rightArmBone.current.rotation.z = poseData.rightArmAngleZ;
    }
  });

  return (
    <primitive 
      object={scene} 
      scale={baseScale} 
      position={basePosition} 
    />
  );
}

// Fallback error boundary to show a clear warning if the GLB is missing
class GarmentErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
      );
    }
    return this.props.children;
  }
}

export function GLTFGarment(props: GLTFGarmentProps) {
  return (
    <GarmentErrorBoundary>
      <Suspense fallback={null}>
        <GarmentModel {...props} />
      </Suspense>
    </GarmentErrorBoundary>
  );
}
