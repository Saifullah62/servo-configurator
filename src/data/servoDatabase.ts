import { ServoSpecification } from '../types/servo';

export const servoDatabase: { [key: string]: ServoSpecification } = {
  'MG996R': {
    model: 'MG996R',
    manufacturer: 'Tower Pro',
    type: 'Digital',
    weight: 55,
    dimensions: {
      length: 40.7,
      width: 19.7,
      height: 42.9
    },
    torque: {
      value: 11,
      unit: 'kg/cm'
    },
    speed: {
      value: 0.17,  // seconds per 60 degrees
      voltage: 6.0
    },
    operatingVoltage: {
      min: 4.8,
      max: 7.2
    },
    rotationRange: {
      min: 0,
      max: 180
    },
    bearingType: 'Dual Ball Bearing',
    gearMaterial: 'Metal',
    waterproof: false,
    analogFeedback: false,
    protocol: 'PWM'
  },
  'SG90': {
    model: 'SG90',
    manufacturer: 'Tower Pro',
    type: 'Standard',
    weight: 9,
    dimensions: {
      length: 22.2,
      width: 11.8,
      height: 31
    },
    torque: {
      value: 1.8,
      unit: 'kg/cm'
    },
    speed: {
      value: 0.1,
      voltage: 4.8
    },
    operatingVoltage: {
      min: 4.8,
      max: 6.0
    },
    rotationRange: {
      min: 0,
      max: 180
    },
    bearingType: 'Plastic',
    gearMaterial: 'Plastic',
    waterproof: false,
    analogFeedback: false,
    protocol: 'PWM'
  },
  'DS3218': {
    model: 'DS3218',
    manufacturer: 'DSSERVO',
    type: 'Digital',
    weight: 60,
    dimensions: {
      length: 40,
      width: 20,
      height: 40.5
    },
    torque: {
      value: 21.5,
      unit: 'kg/cm'
    },
    speed: {
      value: 0.15,
      voltage: 6.8
    },
    operatingVoltage: {
      min: 4.8,
      max: 6.8
    },
    rotationRange: {
      min: 0,
      max: 270
    },
    bearingType: 'Dual Ball Bearing',
    gearMaterial: 'Metal',
    waterproof: false,
    analogFeedback: true,
    protocol: 'PWM'
  },
  'AX-12A': {
    model: 'AX-12A',
    manufacturer: 'Dynamixel',
    type: 'Digital',
    weight: 53.5,
    dimensions: {
      length: 32,
      width: 50,
      height: 40
    },
    torque: {
      value: 15.3,
      unit: 'kg/cm'
    },
    speed: {
      value: 0.169,
      voltage: 12
    },
    operatingVoltage: {
      min: 9,
      max: 12
    },
    rotationRange: {
      min: 0,
      max: 300
    },
    bearingType: 'Dual Ball Bearing',
    gearMaterial: 'Metal',
    waterproof: false,
    analogFeedback: true,
    protocol: 'Serial'
  },
  'D5065': {
    model: 'D5065',
    manufacturer: 'ODrive',
    type: 'Brushless',
    weight: 165,
    dimensions: {
      length: 50,
      width: 50,
      height: 65
    },
    torque: {
      value: 2.1,
      unit: 'N⋅m'
    },
    speed: {
      value: 0.05,
      voltage: 24
    },
    operatingVoltage: {
      min: 12,
      max: 24
    },
    rotationRange: {
      min: -360,
      max: 360
    },
    bearingType: 'Dual Ball Bearing',
    gearMaterial: 'Metal',
    waterproof: false,
    analogFeedback: true,
    protocol: 'CAN'
  }
};
