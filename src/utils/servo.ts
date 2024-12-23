import { ServoConfig } from '../types/servo';

export const calculatePWM = (angle: number, config: ServoConfig): number => {
  const pwmRange = config.pwmMax - config.pwmMin;
  const angleRange = config.angleMax - config.angleMin;
  const pwm = config.pwmMin + (angle / angleRange) * pwmRange;
  return Math.round(pwm);
};

export const validateAngle = (angle: number, config: ServoConfig): number => {
  return Math.min(Math.max(angle, config.angleMin), config.angleMax);
};