export interface Shirt {
  id: string;
  name: string;
  price: number;
  color: string;
  colorHex: string;
  secondaryColorHex?: string;
  category: string;
  material: string;
  fit: string;
  style: string;
  pattern: string;
  description: string;
  tags: string[];
  image: string;
  model3D?: string;
  baseColorMap?: string;
  normalMap?: string;
  roughnessMap?: string;
  isPopular?: boolean;
}

export interface ShirtSearchQuery {
  text?: string;
  category?: string;
  color?: string;
  style?: string;
  material?: string;
}

export interface AIVisionResult {
  detectedCategory: string;
  detectedColor: string;
  detectedFit: string;
  detectedStyle: string;
  detectedMaterial: string;
  detectedPattern: string;
  detectedTags: string[];
  confidence: number;
}

export interface SearchMatchResult {
  shirt: Shirt;
  matchScore: number; // 0 to 100
  reasonText: string;
}

export interface TryOnResult {
  originalImage: string;
  tryOnImage: string;
  shirt: Shirt;
  timestamp: number;
}

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseData {
  leftShoulder: PoseLandmark;
  rightShoulder: PoseLandmark;
  leftHip: PoseLandmark;
  rightHip: PoseLandmark;
  leftElbow: PoseLandmark;
  rightElbow: PoseLandmark;
  leftWrist: PoseLandmark;
  rightWrist: PoseLandmark;
  nose?: PoseLandmark;
  leftEar?: PoseLandmark;
  rightEar?: PoseLandmark;
  torsoCenter: { x: number; y: number; z: number };
  torsoWidth: number;
  torsoHeight: number;
  rotationY: number; // radians (body yaw)
  tiltZ: number; // radians (shoulder tilt)
  leftArmAngleZ: number; // radians (left sleeve articulation)
  rightArmAngleZ: number; // radians (right sleeve articulation)
  leftForearmAngleZ: number;
  rightForearmAngleZ: number;
}
