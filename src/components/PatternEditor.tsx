import React, { useState } from 'react';
import { Plus, Play, Square } from 'lucide-react';
import { MovementPattern } from '../types/servo';

interface PatternEditorProps {
  patterns: MovementPattern[];
  onAddPattern: (pattern: MovementPattern) => void;
  onRunPattern: (pattern: MovementPattern) => void;
  isRunning: boolean;
  onStop: () => void;
}

export function PatternEditor({ patterns, onAddPattern, onRunPattern, isRunning, onStop }: PatternEditorProps) {
  const [newPattern, setNewPattern] = useState<MovementPattern>({
    name: '',
    points: [{ angle: 0, delay: 1000 }]
  });

  const addPoint = () => {
    setNewPattern({
      ...newPattern,
      points: [...newPattern.points, { angle: 0, delay: 1000 }]
    });
  };

  const updatePoint = (index: number, field: 'angle' | 'delay', value: number) => {
    const newPoints = [...newPattern.points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setNewPattern({ ...newPattern, points: newPoints });
  };

  const savePattern = () => {
    if (newPattern.name) {
      onAddPattern(newPattern);
      setNewPattern({ name: '', points: [{ angle: 0, delay: 1000 }] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <input
            type="text"
            value={newPattern.name}
            onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value })}
            placeholder="Pattern name"
            className="w-full p-2 border rounded"
          />
          
          {newPattern.points.map((point, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="number"
                value={point.angle}
                onChange={(e) => updatePoint(index, 'angle', Number(e.target.value))}
                placeholder="Angle"
                className="w-24 p-2 border rounded"
              />
              <input
                type="number"
                value={point.delay}
                onChange={(e) => updatePoint(index, 'delay', Number(e.target.value))}
                placeholder="Delay (ms)"
                className="w-32 p-2 border rounded"
              />
            </div>
          ))}
          
          <div className="flex gap-2">
            <button
              onClick={addPoint}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={savePattern}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Pattern
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {patterns.map((pattern) => (
            <div key={pattern.name} className="flex items-center gap-2">
              <span className="flex-1">{pattern.name}</span>
              <button
                onClick={() => onRunPattern(pattern)}
                disabled={isRunning}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {isRunning && (
            <button
              onClick={onStop}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <Square className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}