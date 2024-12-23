import { ServoConfig, PresetPosition, MovementPattern } from './servo';

export interface ConfigurationTemplate {
  id: string;
  name: string;
  description: string;
  config: ServoConfig;
  presets: PresetPosition[];
  patterns: MovementPattern[];
}

export interface MultiServoConfig {
  id: string;
  name: string;
  servos: {
    [key: string]: {
      config: ServoConfig;
      presets: PresetPosition[];
      patterns: MovementPattern[];
    };
  };
}

export type PlatformType = 'arduino' | 'jetson' | 'raspberrypi' | 'esp32';

export interface PlatformConfig {
  platform: PlatformType;
  options: {
    pinMapping?: { [servoId: string]: number };
    i2cAddress?: string;
    busNumber?: number;
    customOptions?: Record<string, any>;
  };
}
