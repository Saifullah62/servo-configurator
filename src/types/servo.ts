export interface PatternConfig {
  baseSpeed: number;      // Base speed multiplier
  precision: number;      // Precision level (1-10)
  forceLevel: number;     // Force level (1-10)
  repeatCount: number;    // Number of repetitions
  pauseDuration: number;  // Pause between repetitions
}

export interface MovementPoint {
  angle: number;
  delay: number;
}

export interface Sequence {
  name: string;
  points: MovementPoint[];
  type: 'smooth' | 'stepped';
}

export interface MovementPattern {
  name: string;
  points?: MovementPoint[];
  sequences?: Sequence[];
  type: 'smooth' | 'stepped' | 'composite';
  loop?: boolean;
  config?: PatternConfig;
}

export interface ServoLimits {
  minAngle: number;
  maxAngle: number;
  minPulse: number;
  maxPulse: number;
  maxSpeed?: number; // degrees per second
  maxAcceleration?: number; // degrees per second squared
}

export interface ServoCalibration {
  centerOffset: number; // degrees
  pulseOffset: number; // microseconds
  angleMultiplier: number; // for adjusting angle calculations
}

export interface ServoProgramStep {
  type: 'move' | 'wait' | 'repeat' | 'speed' | 'acceleration' | 'home';
  value?: number;
  duration?: number;
  repeatCount?: number;
}

export interface ServoProgram {
  id: string;
  name: string;
  description?: string;
  steps: ServoProgramStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ServoConfiguration {
  channel: number;
  enabled: boolean;
  name: string;
  description?: string;
  
  // Basic settings
  minPulse: number;
  maxPulse: number;
  initialPosition: number;
  inverted: boolean;
  
  // Movement parameters
  speed: number;
  acceleration: number;
  
  // Advanced configuration
  limits: ServoLimits;
  calibration: ServoCalibration;
  
  // Optional specification reference
  specification?: ServoSpecification;
  
  // Programming
  programs: ServoProgram[];
  activeProgram?: string;
}

export interface ServoSpecification {
  model: string;
  manufacturer: string;
  type: string;
  weight: number; // grams
  dimensions: {
    length: number; // mm
    width: number;
    height: number;
  };
  torque: {
    value: number;
    unit: string;
  };
  speed: {
    value: number; // seconds per 60 degrees
    voltage: number;
  };
  operatingVoltage: {
    min: number;
    max: number;
  };
  rotationRange: {
    min: number;
    max: number;
  };
  bearingType: string;
  gearMaterial: string;
  waterproof: boolean;
  analogFeedback: boolean;
  protocol: string;
}

export interface ServoTestResult {
  timestamp: string;
  type: 'range' | 'speed' | 'accuracy' | 'endurance';
  data: Array<{
    targetValue: number;
    measuredValue: number;
    deviation: number;
    duration?: number;
    cycles?: number;
  }>;
  notes: string;
}

export interface ServoState {
  currentAngle: number;
  currentSpeed: number;
  targetAngle: number;
  isMoving: boolean;
  lastUpdated: string;
}

export interface PresetPosition {
  name: string;
  angle: number;
  speed?: number;
  description?: string;
}

export interface AdvancedFeatures {
  positionFeedback: boolean;
  torqueControl: boolean;
  softLimits: boolean;
  emergencyStop: boolean;
  networkControl: boolean;
  dataLogging: boolean;
}

export interface JetsonConfig {
  i2cBus: number;
  i2cAddress: number;
  pwmFrequency: number;
  controlMethod: 'i2c' | 'pwm' | 'uart';
}

export interface RobotTemplate {
  name: string;
  type: string;
  servos: ServoConfiguration[];
  defaultPatterns: MovementPattern[];
  advancedFeatures: AdvancedFeatures;
}

// Default configurations
export const DEFAULT_SERVO_CONFIG: ServoConfiguration = {
  channel: 0,
  enabled: true,
  name: '',
  minPulse: 500,
  maxPulse: 2500,
  initialPosition: 90,
  inverted: false,
  speed: 100,
  acceleration: 500,
  limits: {
    minAngle: 0,
    maxAngle: 180,
    minPulse: 500,
    maxPulse: 2500,
    maxSpeed: 1000,
    maxAcceleration: 2000
  },
  calibration: {
    centerOffset: 0,
    pulseOffset: 0,
    angleMultiplier: 1
  },
  programs: []
};