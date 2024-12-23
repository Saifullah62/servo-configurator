import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PresetPosition } from '../types/servo';

interface PresetManagerProps {
  presets: PresetPosition[];
  onPresetClick: (angle: number) => void;
  onAddPreset: (preset: PresetPosition) => void;
}

export function PresetManager({ presets, onPresetClick, onAddPreset }: PresetManagerProps) {
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetAngle, setNewPresetAngle] = useState('');

  const handleAddPreset = () => {
    if (newPresetName && newPresetAngle) {
      onAddPreset({
        name: newPresetName,
        angle: Number(newPresetAngle)
      });
      setNewPresetName('');
      setNewPresetAngle('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onPresetClick(preset.angle)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {preset.name} ({preset.angle}°)
          </button>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newPresetName}
          onChange={(e) => setNewPresetName(e.target.value)}
          placeholder="Preset name"
          className="flex-1 p-2 border rounded"
        />
        <input
          type="number"
          value={newPresetAngle}
          onChange={(e) => setNewPresetAngle(e.target.value)}
          placeholder="Angle"
          className="w-24 p-2 border rounded"
        />
        <button
          onClick={handleAddPreset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}