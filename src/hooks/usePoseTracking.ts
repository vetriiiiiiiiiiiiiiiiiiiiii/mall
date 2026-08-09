'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PoseData } from '@/types/shirt';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export function usePoseTracking(
  videoElement: HTMLVideoElement | null,
  isActive: boolean
) {
  const [poseData, setPoseData] = useState<PoseData | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [segmentationMask, setSegmentationMask] = useState<ImageBitmap | HTMLCanvasElement | HTMLImageElement | null>(null);

  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const lastPoseRef = useRef<PoseData | null>(null);

  // EMA Filter function
  const applyEma = (curr: number, prev: number | undefined, smoothing: number = 0.3) => {
    if (prev === undefined || isNaN(prev)) return curr;
    return prev + (curr - prev) * smoothing;
  };

  const applyAngleEma = (curr: number, prev: number | undefined, smoothing: number = 0.3) => {
    if (prev === undefined || isNaN(prev)) return curr;
    // Handle angle wrapping for EMA
    let diff = curr - prev;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    return prev + diff * smoothing;
  };

  const onResults = useCallback((results: Results) => {
    if (!results.poseLandmarks) {
      return;
    }

    const landmarks = results.poseLandmarks;
    
    // Landmark indices from MediaPipe Pose
    const nose = landmarks[0];
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    const torsoWidth = Math.abs(rightShoulder.x - leftShoulder.x);
    // Use shoulders for stable vertical center tracking, since hips are unreliable on webcams (especially sitting in a car!)
    const shouldersY = (leftShoulder.y + rightShoulder.y) / 2;
    const torsoHeight = Math.abs(leftHip.y - leftShoulder.y);

    const torsoCenter = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: shouldersY,
      z: (leftShoulder.z + rightShoulder.z) / 2,
    };

    // --- 50-Point AI Body Spline Grid ---
    const rawBodyGrid: {x: number, y: number, z: number}[] = [];
    const estimatedTorsoHeight = torsoWidth * 1.6; // Human proportion constraint
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        const u = col / 9; // 0 to 1 (left to right)
        const v = row / 4; // 0 to 1 (top to bottom)
        
        // Add anatomical curve to chest (sticks out in the middle, tapers down)
        const chestCurveZ = Math.sin(u * Math.PI) * (torsoWidth * 0.4) * (1 - v * 0.3);
        
        const x = leftShoulder.x + (rightShoulder.x - leftShoulder.x) * u;
        const y = shouldersY + (estimatedTorsoHeight * v);
        const z = ((leftShoulder.z + rightShoulder.z) / 2) - chestCurveZ;
        
        rawBodyGrid.push({ x, y, z });
      }
    }

    const rotationY = Math.atan2(rightShoulder.z - leftShoulder.z, rightShoulder.x - leftShoulder.x);
    const tiltZ = Math.atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x);

    const leftArmAngleZ = Math.atan2(leftElbow.y - leftShoulder.y, leftElbow.x - leftShoulder.x) + Math.PI / 2;
    const rightArmAngleZ = Math.atan2(rightElbow.y - rightShoulder.y, rightElbow.x - rightShoulder.x) - Math.PI / 2;
    const leftForearmAngleZ = Math.atan2(leftWrist.y - leftElbow.y, leftWrist.x - leftElbow.x);
    const rightForearmAngleZ = Math.atan2(rightWrist.y - rightElbow.y, rightWrist.x - rightElbow.x);

    const lastPose = lastPoseRef.current;
    const SMOOTHING = 0.25; // Lower is smoother (stops flinging)

    const smoothedPose: PoseData = {
      nose: {
        x: applyEma(nose.x, lastPose?.nose?.x, SMOOTHING),
        y: applyEma(nose.y, lastPose?.nose?.y, SMOOTHING),
        z: applyEma(nose.z, lastPose?.nose?.z, SMOOTHING),
      },
      leftEar,
      rightEar,
      leftShoulder,
      rightShoulder,
      leftHip,
      rightHip,
      leftElbow,
      rightElbow,
      leftWrist,
      rightWrist,
      torsoCenter: {
        x: applyEma(torsoCenter.x, lastPose?.torsoCenter.x, SMOOTHING),
        y: applyEma(torsoCenter.y, lastPose?.torsoCenter.y, SMOOTHING),
        z: applyEma(torsoCenter.z, lastPose?.torsoCenter.z, SMOOTHING),
      },
      torsoWidth: applyEma(torsoWidth, lastPose?.torsoWidth, SMOOTHING),
      torsoHeight: applyEma(torsoHeight, lastPose?.torsoHeight, SMOOTHING),
      rotationY: applyAngleEma(rotationY, lastPose?.rotationY, SMOOTHING),
      tiltZ: applyAngleEma(tiltZ, lastPose?.tiltZ, SMOOTHING),
      leftArmAngleZ: applyAngleEma(leftArmAngleZ, lastPose?.leftArmAngleZ, SMOOTHING),
      rightArmAngleZ: applyAngleEma(rightArmAngleZ, lastPose?.rightArmAngleZ, SMOOTHING),
      leftForearmAngleZ: applyAngleEma(leftForearmAngleZ, lastPose?.leftForearmAngleZ, SMOOTHING),
      rightForearmAngleZ: applyAngleEma(rightForearmAngleZ, lastPose?.rightForearmAngleZ, SMOOTHING),
      bodyGrid: rawBodyGrid.map((pt, i) => ({
        x: applyEma(pt.x, lastPose?.bodyGrid?.[i]?.x, SMOOTHING),
        y: applyEma(pt.y, lastPose?.bodyGrid?.[i]?.y, SMOOTHING),
        z: applyEma(pt.z, lastPose?.bodyGrid?.[i]?.z, SMOOTHING),
      })),
    };

    lastPoseRef.current = smoothedPose;
    setPoseData(smoothedPose);

    if (results.segmentationMask) {
      setSegmentationMask(results.segmentationMask);
    }
  }, []);

  useEffect(() => {
    if (!videoElement || !isActive) {
      setIsTracking(false);
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      lastPoseRef.current = null;
      return;
    }

    if (!poseRef.current) {
      const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true, // Enables the body segmentation mask for occlusion
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      pose.onResults(onResults);
      poseRef.current = pose;
    }

    if (!cameraRef.current) {
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          if (poseRef.current && videoElement.readyState >= 2) { // HAVE_CURRENT_DATA
            await poseRef.current.send({ image: videoElement });
          }
        },
        width: 1280,
        height: 720,
      });
      cameraRef.current = camera;
    }

    cameraRef.current.start().then(() => {
      setIsTracking(true);
    });

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
    };
  }, [videoElement, isActive, onResults]);

  return { poseData, isTracking, segmentationMask };
}

