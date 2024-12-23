import { ConfigurationTemplate, MultiServoConfig, PlatformConfig } from '../types/templates';

// Jetson Orin Nano specific I2C configurations
export const JETSON_ORIN_I2C_CONFIG = {
  // Default I2C bus for Orin Nano
  defaultBus: 1,
  // Default I2C address for PCA9685
  defaultAddress: '0x40',
  // Available I2C buses on Orin Nano
  availableBuses: [0, 1, 2, 3, 4, 5, 6, 7],
  // GPIO pins available for PWM
  availablePWMPins: [
    // J17 Header PWM pins
    { pin: 32, description: 'PWM0 - J17 Pin 32' },
    { pin: 33, description: 'PWM2 - J17 Pin 33' },
    // Additional PWM capable pins
    { pin: 15, description: 'GPIO15/PWM1' },
    { pin: 18, description: 'GPIO18/PWM2' },
  ],
};

// Template for a basic servo configuration using PCA9685
export const JETSON_PCA9685_TEMPLATE: ConfigurationTemplate = {
  id: 'jetson_pca9685_basic',
  name: 'Jetson Orin PCA9685 Basic Setup',
  description: 'Basic servo configuration using PCA9685 PWM controller on Jetson Orin Nano',
  config: {
    pwmMin: 500,
    pwmMax: 2500,
    angleMin: 0,
    angleMax: 180,
    speed: 100,
    acceleration: 50,
    centerOffset: 0,
  },
  presets: [
    { name: "Home", angle: 90 },
    { name: "Min", angle: 0 },
    { name: "Max", angle: 180 },
  ],
  patterns: [
    {
      name: "Sweep",
      steps: [
        { angle: 0, duration: 1000 },
        { angle: 180, duration: 1000 },
        { angle: 0, duration: 1000 },
      ],
    },
  ],
};

// Template for a multi-servo robotic arm configuration
export const JETSON_ROBOTIC_ARM_TEMPLATE: MultiServoConfig = {
  id: 'jetson_robotic_arm',
  name: 'Jetson Orin 6-DOF Robotic Arm',
  servos: {
    base: {
      config: {
        pwmMin: 500,
        pwmMax: 2500,
        angleMin: 0,
        angleMax: 180,
        speed: 60,
        acceleration: 40,
        centerOffset: 0,
      },
      presets: [
        { name: "Home", angle: 90 },
        { name: "Left", angle: 0 },
        { name: "Right", angle: 180 },
      ],
      patterns: [],
    },
    shoulder: {
      config: {
        pwmMin: 500,
        pwmMax: 2500,
        angleMin: 15,
        angleMax: 165,
        speed: 50,
        acceleration: 30,
        centerOffset: 0,
      },
      presets: [
        { name: "Home", angle: 90 },
        { name: "Down", angle: 15 },
        { name: "Up", angle: 165 },
      ],
      patterns: [],
    },
    elbow: {
      config: {
        pwmMin: 500,
        pwmMax: 2500,
        angleMin: 0,
        angleMax: 180,
        speed: 70,
        acceleration: 40,
        centerOffset: 0,
      },
      presets: [
        { name: "Home", angle: 90 },
        { name: "Retract", angle: 0 },
        { name: "Extend", angle: 180 },
      ],
      patterns: [],
    },
    wrist: {
      config: {
        pwmMin: 500,
        pwmMax: 2500,
        angleMin: 0,
        angleMax: 180,
        speed: 80,
        acceleration: 50,
        centerOffset: 0,
      },
      presets: [
        { name: "Home", angle: 90 },
        { name: "Down", angle: 0 },
        { name: "Up", angle: 180 },
      ],
      patterns: [],
    },
    gripper: {
      config: {
        pwmMin: 500,
        pwmMax: 2500,
        angleMin: 0,
        angleMax: 90,
        speed: 100,
        acceleration: 70,
        centerOffset: 0,
      },
      presets: [
        { name: "Open", angle: 0 },
        { name: "Close", angle: 90 },
      ],
      patterns: [],
    },
  },
};

// Default Jetson Orin Nano platform configuration
export const DEFAULT_JETSON_PLATFORM_CONFIG: PlatformConfig = {
  platform: 'jetson',
  options: {
    i2cAddress: JETSON_ORIN_I2C_CONFIG.defaultAddress,
    busNumber: JETSON_ORIN_I2C_CONFIG.defaultBus,
    pinMapping: {
      // Default pin mapping for PCA9685 channels
      base: 0,
      shoulder: 1,
      elbow: 2,
      wrist: 3,
      gripper: 4,
    },
    customOptions: {
      useHardwarePWM: false,
      i2cFrequency: 100000, // 100kHz
      pwmFrequency: 50, // 50Hz for standard servos
      enableServoDebug: true,
    },
  },
};
