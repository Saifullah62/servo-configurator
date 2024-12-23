import React from 'react';
import { ServoConfiguration, ServoSpecification } from '../types/servo';
import { SERVO_PRESETS } from '../data/servoPresets';
import { SERVO_DEFAULT_CONFIGS } from '../data/servoConfigs';

interface ServoPresetSelectorProps {
  onSelect: (preset: ServoSpecification, config: Partial<ServoConfiguration>) => void;
}

export const ServoPresetSelector: React.FC<ServoPresetSelectorProps> = ({ onSelect }) => {
  const presetGroups = {
    'Micro Servos': ['SG90', 'MG90S'],
    'SAVOX Servos': ['SC-1258TG', 'SB-2274SG', 'SB-2290SG-BE'],
  };

  const handleSelect = (modelId: string) => {
    const preset = SERVO_PRESETS[modelId];
    const config = SERVO_DEFAULT_CONFIGS[modelId];
    if (preset && config) {
      onSelect(preset, config);
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(presetGroups).map(([groupName, models]) => (
        <div key={groupName}>
          <h3 className="text-sm font-medium text-gray-900 mb-2">{groupName}</h3>
          <div className="grid grid-cols-1 gap-2">
            {models.map((modelId) => {
              const preset = SERVO_PRESETS[modelId];
              if (!preset) return null;
              return (
                <button
                  key={modelId}
                  onClick={() => handleSelect(modelId)}
                  className="flex items-center justify-between p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div>
                    <div className="font-medium text-gray-900">{preset.model}</div>
                    <div className="text-sm text-gray-500">
                      {preset.torque.value} {preset.torque.unit} @ {preset.speed.voltage}V
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {preset.type}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
