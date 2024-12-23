import React from 'react';
import { ServoConfig } from '../types/servo';
import { calculatePWM } from '../utils/servo';

interface SimulationViewProps {
  config: ServoConfig;
  currentPosition: number;
  isSimulated: boolean;
}

export function SimulationView({ config, currentPosition, isSimulated }: SimulationViewProps) {
  const pwm = calculatePWM(currentPosition, config);
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Current Position</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          isSimulated ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
        }`}>
          {isSimulated ? 'Simulation' : 'Hardware'}
        </span>
      </div>
      
      <div className="relative h-4 bg-gray-200 rounded">
        <div
          className="absolute h-full bg-blue-500 rounded transition-all duration-200"
          style={{
            width: `${(currentPosition / config.angleMax) * 100}%`
          }}
        />
      </div>
      
      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <div>Position: {currentPosition}°</div>
        <div>PWM: {pwm}µs</div>
        <div>Normalized: {((currentPosition / config.angleMax) * 100).toFixed(1)}%</div>
      </div>
    </div>
  );
}