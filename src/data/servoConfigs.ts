import { ServoConfiguration } from '../types/servo';

export const SERVO_DEFAULT_CONFIGS: { [key: string]: Partial<ServoConfiguration> } = {
  'SG90': {
    minPulse: 500,
    maxPulse: 2400,
    speed: 60,      // degrees per second
    acceleration: 300,
    limits: {
      minAngle: 0,
      maxAngle: 180,
      minPulse: 500,
      maxPulse: 2400,
      maxSpeed: 600,
      maxAcceleration: 1200
    },
    calibration: {
      centerOffset: 0,
      pulseOffset: 0,
      angleMultiplier: 1
    }
  },
  'MG90S': {
    minPulse: 500,
    maxPulse: 2400,
    speed: 80,      // degrees per second
    acceleration: 400,
    limits: {
      minAngle: 0,
      maxAngle: 180,
      minPulse: 500,
      maxPulse: 2400,
      maxSpeed: 800,
      maxAcceleration: 1600
    },
    calibration: {
      centerOffset: 0,
      pulseOffset: 0,
      angleMultiplier: 1
    }
  },
  'SC-1258TG': {
    minPulse: 600,
    maxPulse: 2400,
    speed: 100,     // degrees per second
    acceleration: 500,
    limits: {
      minAngle: 0,
      maxAngle: 180,
      minPulse: 600,
      maxPulse: 2400,
      maxSpeed: 1000,
      maxAcceleration: 2000
    },
    calibration: {
      centerOffset: 0,
      pulseOffset: 0,
      angleMultiplier: 1
    }
  },
  'SB-2274SG': {
    minPulse: 600,
    maxPulse: 2400,
    speed: 100,     // degrees per second
    acceleration: 500,
    limits: {
      minAngle: 0,
      maxAngle: 180,
      minPulse: 600,
      maxPulse: 2400,
      maxSpeed: 1000,
      maxAcceleration: 2000
    },
    calibration: {
      centerOffset: 0,
      pulseOffset: 0,
      angleMultiplier: 1
    }
  },
  'SB-2290SG-BE': {
    minPulse: 600,
    maxPulse: 2400,
    speed: 120,     // degrees per second
    acceleration: 600,
    limits: {
      minAngle: 0,
      maxAngle: 180,
      minPulse: 600,
      maxPulse: 2400,
      maxSpeed: 1200,
      maxAcceleration: 2400
    },
    calibration: {
      centerOffset: 0,
      pulseOffset: 0,
      angleMultiplier: 1
    }
  }
};
