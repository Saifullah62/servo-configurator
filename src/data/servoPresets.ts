import { ServoSpecification } from '../types/servo';

export const SERVO_PRESETS: { [key: string]: ServoSpecification } = {
  // Micro Servos
  'SG90': {
    model: 'SG90',
    manufacturer: 'TowerPro',
    type: 'Micro Servo',
    weight: 9,
    dimensions: {
      length: 22.2,
      width: 11.8,
      height: 31,
    },
    torque: {
      value: 1.8,
      unit: 'kg/cm',
    },
    speed: {
      value: 0.1, // seconds per 60 degrees at 4.8V
      voltage: 4.8,
    },
    operatingVoltage: {
      min: 4.8,
      max: 6.0,
    },
    rotationRange: {
      min: 0,
      max: 180,
    },
    bearingType: 'Plastic',
    gearMaterial: 'Plastic',
    waterproof: false,
    analogFeedback: false,
    protocol: 'PWM',
  },
  'MG90S': {
    model: 'MG90S',
    manufacturer: 'TowerPro',
    type: 'Micro Servo',
    weight: 13.4,
    dimensions: {
      length: 22.5,
      width: 12,
      height: 22.5,
    },
    torque: {
      value: 2.2,
      unit: 'kg/cm',
    },
    speed: {
      value: 0.08, // seconds per 60 degrees at 4.8V
      voltage: 4.8,
    },
    operatingVoltage: {
      min: 4.8,
      max: 6.0,
    },
    rotationRange: {
      min: 0,
      max: 180,
    },
    bearingType: 'Metal',
    gearMaterial: 'Metal',
    waterproof: false,
    analogFeedback: false,
    protocol: 'PWM',
  },

  // SAVOX Servos
  'SC-1258TG': {
    model: 'SC-1258TG',
    manufacturer: 'SAVOX',
    type: 'Digital Servo',
    weight: 62,
    dimensions: {
      length: 40.0,
      width: 20.0,
      height: 37.0,
    },
    torque: {
      value: 20,
      unit: 'kg/cm',
    },
    speed: {
      value: 0.065, // seconds per 60 degrees at 6.0V
      voltage: 6.0,
    },
    operatingVoltage: {
      min: 6.0,
      max: 7.4,
    },
    rotationRange: {
      min: 0,
      max: 180,
    },
    bearingType: 'Dual Ball Bearing',
    gearMaterial: 'Titanium',
    waterproof: false,
    analogFeedback: false,
    protocol: 'PWM',
  },
  'SB-2274SG': {
    model: 'SB-2274SG',
    manufacturer: 'SAVOX',
    type: 'Digital Servo',
    weight: 77,
    dimensions: {
      length: 40.0,
      width: 20.0,
      height: 37.0,
    },
    torque: {
      value: 25,
      unit: 'kg/cm',
    },
    speed: {
      value: 0.065, // seconds per 60 degrees at 7.4V
      voltage: 7.4,
    },
    operatingVoltage: {
      min: 6.0,
      max: 7.4,
    },
    rotationRange: {
      min: 0,
      max: 180,
    },
    bearingType: 'Dual Ball Bearing',
    gearMaterial: 'Steel',
    waterproof: false,
    analogFeedback: false,
    protocol: 'PWM',
  },
  'SB-2290SG-BE': {
    model: 'SB-2290SG Black Edition',
    manufacturer: 'SAVOX',
    type: 'Digital Servo',
    weight: 80,
    dimensions: {
      length: 40.0,
      width: 20.0,
      height: 37.0,
    },
    torque: {
      value: 30,
      unit: 'kg/cm',
    },
    speed: {
      value: 0.06, // seconds per 60 degrees at 7.4V
      voltage: 7.4,
    },
    operatingVoltage: {
      min: 6.0,
      max: 7.4,
    },
    rotationRange: {
      min: 0,
      max: 180,
    },
    bearingType: 'Dual Ball Bearing',
    gearMaterial: 'Steel',
    waterproof: false,
    analogFeedback: false,
    protocol: 'PWM',
  },
};

// Recommended configurations for each servo model
export const SERVO_DEFAULT_CONFIGS: { [key: string]: Partial<ServoConfiguration> } = {
  'SG90': {
    minPulse: 500,
    maxPulse: 2400,
    speed: 60,      // degrees per second
    acceleration: 300,
    limits: {
      minAngle: 0,
      maxAngle: 180,
      maxSpeed: 600,
      maxAcceleration: 1000,
    },
  },
  'MG90S': {
    minPulse: 500,
    maxPulse: 2400,
    speed: 75,      // degrees per second
    acceleration: 400,
    limits: {
      minAngle: 0,
      maxAngle: 180,
      maxSpeed: 750,
      maxAcceleration: 1200,
    },
  },
  'SC-1258TG': {
    minPulse: 600,
    maxPulse: 2400,
    speed: 100,     // degrees per second
    acceleration: 500,
    limits: {
      minAngle: 0,
      maxAngle: 180,
      maxSpeed: 1000,
      maxAcceleration: 2000,
    },
  },
  'SB-2274SG': {
    minPulse: 600,
    maxPulse: 2400,
    speed: 100,     // degrees per second
    acceleration: 500,
    limits: {
      minAngle: 0,
      maxAngle: 180,
      maxSpeed: 1000,
      maxAcceleration: 2000,
    },
  },
  'SB-2290SG-BE': {
    minPulse: 600,
    maxPulse: 2400,
    speed: 120,     // degrees per second
    acceleration: 600,
    limits: {
      minAngle: 0,
      maxAngle: 180,
      maxSpeed: 1200,
      maxAcceleration: 2400,
    },
  },
};
