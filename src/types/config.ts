/**
 * Configuration settings for a servo motor
 */
export interface ServoConfig {
  /** Minimum PWM value in microseconds (typically 500-1000) */
  pwmMin: number;
  /** Maximum PWM value in microseconds (typically 2000-2500) */
  pwmMax: number;
  /** Minimum angle in degrees (typically 0) */
  angleMin: number;
  /** Maximum angle in degrees (typically 180) */
  angleMax: number;
  /** Movement speed as percentage (0-100) */
  speed: number;
  /** Acceleration rate as percentage (0-100) */
  acceleration: number;
  /** Center position offset in degrees */
  centerOffset: number;
}