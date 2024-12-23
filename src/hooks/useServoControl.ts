import { useState, useCallback } from 'react';
import { ServoConfig, MovementPattern } from '../types/servo';
import { validateAngle } from '../utils/servo';

export function useServoControl(config: ServoConfig) {
  const [currentPosition, setCurrentPosition] = useState(90);
  const [isMoving, setIsMoving] = useState(false);
  
  const moveTo = useCallback((angle: number) => {
    const validatedAngle = validateAngle(angle, config);
    setCurrentPosition(validatedAngle);
    return validatedAngle;
  }, [config]);
  
  const runPattern = useCallback(async (pattern: MovementPattern) => {
    if (isMoving) return;
    
    setIsMoving(true);
    try {
      for (const point of pattern.points) {
        await new Promise(resolve => setTimeout(resolve, point.delay));
        moveTo(point.angle);
      }
    } finally {
      setIsMoving(false);
    }
  }, [isMoving, moveTo]);
  
  return {
    currentPosition,
    isMoving,
    moveTo,
    runPattern
  };
}