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
  const [segmentationMask, setSegmentationMask] = useState<ImageBitmap | HTMLCanvasElement | null>(null);

  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  const onResults = useCallback((results: Results) => {
    if (!results.poseLandmarks) {
      return;
    }

    const landmarks = results.poseLandmarks;
    
    // Landmark indices from MediaPipe Pose
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    const torsoWidth = Math.abs(rightShoulder.x - leftShoulder.x);
    const torsoHeight = Math.abs(leftHip.y - leftShoulder.y);

    const torsoCenter = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + leftHip.y) / 2,
      z: (leftShoulder.z + rightShoulder.z) / 2,
    };

    const rotationY = Math.atan2(rightShoulder.z - leftShoulder.z, rightShoulder.x - leftShoulder.x);
    const tiltZ = Math.atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x);

    const leftArmAngleZ = Math.atan2(leftElbow.y - leftShoulder.y, leftElbow.x - leftShoulder.x) + Math.PI / 2;
    const rightArmAngleZ = Math.atan2(rightElbow.y - rightShoulder.y, rightElbow.x - rightShoulder.x) - Math.PI / 2;
    const leftForearmAngleZ = Math.atan2(leftWrist.y - leftElbow.y, leftWrist.x - leftElbow.x);
    const rightForearmAngleZ = Math.atan2(rightWrist.y - rightElbow.y, rightWrist.x - rightElbow.x);

    setPoseData({
      leftShoulder,
      rightShoulder,
      leftHip,
      rightHip,
      leftElbow,
      rightElbow,
      leftWrist,
      rightWrist,
      torsoCenter,
      torsoWidth,
      torsoHeight,
      rotationY,
      tiltZ,
      leftArmAngleZ,
      rightArmAngleZ,
      leftForearmAngleZ,
      rightForearmAngleZ,
    });

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

