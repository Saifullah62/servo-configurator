/**
 * Represents a saved position preset
 */
export interface PresetPosition {
  /** Name of the preset */
  name: string;
  /** Target angle in degrees */
  angle: number;
}

/**
 * Defines a sequence of servo movements
 */
export interface MovementPattern {
  /** Name of the pattern */
  name: string;
  /** Array of movement points */
  points: MovementPoint[];
}

/**
 * Single point in a movement pattern
 */
export interface MovementPoint {
  /** Target angle in degrees */
  angle: number;
  /** Delay before next movement in milliseconds */
  delay: number;
}