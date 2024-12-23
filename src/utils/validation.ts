import { ServoConfig } from '../types/servo';

export const validateServoConfig = (config: ServoConfig): string[] => {
  const errors: string[] = [];
  
  if (config.pwmMin >= config.pwmMax) {
    errors.push('PWM minimum must be less than maximum');
  }
  
  if (config.angleMin >= config.angleMax) {
    errors.push('Angle minimum must be less than maximum');
  }
  
  if (config.pwmMin < 0 || config.pwmMax > 5000) {
    errors.push('PWM values must be between 0 and 5000µs');
  }
  
  if (config.speed < 0 || config.speed > 100) {
    errors.push('Speed must be between 0 and 100%');
  }
  
  if (config.acceleration < 0 || config.acceleration > 100) {
    errors.push('Acceleration must be between 0 and 100%');
  }
  
  return errors;
};