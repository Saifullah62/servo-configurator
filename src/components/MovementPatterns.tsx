import React, { useState, useRef } from 'react';
import { allPatterns } from '../templates/roboticConfigs';
import { MovementPattern, PatternConfig, ServoConfiguration } from '../types/servo';
import { PatternPreview } from './PatternPreview';
import { patternStorage } from '../utils/patternStorage';

interface MovementPatternsProps {
  onPatternSelect: (pattern: MovementPattern) => void;
  onExecutePattern: (pattern: MovementPattern) => void;
  servos: ServoConfiguration[];
  disabled?: boolean;
}

const defaultConfig: PatternConfig = {
  baseSpeed: 1,
  precision: 5,
  forceLevel: 5,
  repeatCount: 1,
  pauseDuration: 500
};

export const MovementPatterns: React.FC<MovementPatternsProps> = ({
  onPatternSelect,
  onExecutePattern,
  servos,
  disabled = false
}) => {
  const [selectedPattern, setSelectedPattern] = useState<MovementPattern | null>(null);
  const [patternConfig, setPatternConfig] = useState<PatternConfig>(defaultConfig);
  const [savedPatterns, setSavedPatterns] = useState<MovementPattern[]>(patternStorage.getSavedPatterns());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group patterns by type
  const patternGroups = {
    'Saved': savedPatterns || [],
    'Specialized': allPatterns.specialized || [],
    'Combination': allPatterns.combination || [],
    'Hand': allPatterns.enhancedHand || [],
    'Arm': allPatterns.enhancedArm || []
  };

  const handlePatternSelect = (patternName: string, group: string) => {
    const pattern = patternGroups[group]?.find(p => p.name === patternName);
    if (pattern) {
      const config = pattern.config || patternConfig;
      setPatternConfig(config);
      setSelectedPattern(pattern);
      onPatternSelect(pattern);
    }
  };

  const handleConfigChange = (key: keyof PatternConfig, value: number) => {
    const newConfig = { ...patternConfig, [key]: value };
    setPatternConfig(newConfig);
    
    if (selectedPattern) {
      const updatedPattern = {
        ...selectedPattern,
        config: newConfig,
        points: selectedPattern.points?.map(point => ({
          ...point,
          delay: Math.round(point.delay * (11 - newConfig.precision) / newConfig.baseSpeed)
        }))
      };
      setSelectedPattern(updatedPattern);
      onPatternSelect(updatedPattern);
    }
  };

  const handleExecute = () => {
    if (!selectedPattern) return;
    if (!servos.length) {
      alert('No servos configured. Please add servos first.');
      return;
    }
    onExecutePattern(selectedPattern);
  };

  const handleSavePattern = () => {
    if (selectedPattern) {
      const success = patternStorage.savePattern(selectedPattern);
      if (success) {
        setSavedPatterns(patternStorage.getSavedPatterns());
        alert('Pattern saved successfully!');
      } else {
        alert('Error saving pattern');
      }
    }
  };

  const handleDeletePattern = (patternName: string) => {
    if (confirm('Are you sure you want to delete this pattern?')) {
      const success = patternStorage.deletePattern(patternName);
      if (success) {
        setSavedPatterns(patternStorage.getSavedPatterns());
        if (selectedPattern?.name === patternName) {
          setSelectedPattern(null);
        }
      }
    }
  };

  const handleExportPatterns = () => {
    patternStorage.exportPatterns();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportPatterns = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const success = await patternStorage.importPatterns(file);
      if (success) {
        setSavedPatterns(patternStorage.getSavedPatterns());
        alert('Patterns imported successfully!');
      } else {
        alert('Error importing patterns');
      }
      event.target.value = '';
    }
  };

  return (
    <div className="movement-patterns p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Movement Patterns</h2>
        <div className="space-x-2">
          <button
            onClick={handleExportPatterns}
            disabled={disabled}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Export
          </button>
          <button
            onClick={handleImportClick}
            disabled={disabled}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportPatterns}
            className="hidden"
          />
        </div>
      </div>

      <div className="pattern-groups mb-4">
        {Object.entries(patternGroups).map(([group, patterns]) => (
          <div key={group} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{group}</h3>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => handlePatternSelect(e.target.value, group)}
              value={selectedPattern?.name || ''}
              disabled={disabled}
            >
              <option value="">Select a pattern</option>
              {patterns.map((pattern) => (
                <option key={pattern.name} value={pattern.name}>
                  {pattern.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {selectedPattern && (
        <>
          <div className="pattern-preview-container mb-4">
            <PatternPreview pattern={selectedPattern} servos={servos} />
          </div>

          <div className="pattern-config">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pattern Configuration</h3>
              <div className="space-x-2">
                <button
                  onClick={handleSavePattern}
                  disabled={disabled}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Save Pattern
                </button>
                {savedPatterns.some(p => p.name === selectedPattern.name) && (
                  <button
                    onClick={() => handleDeletePattern(selectedPattern.name)}
                    disabled={disabled}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={handleExecute}
                  disabled={disabled || !servos.length}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Execute Pattern
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Base Speed</label>
              <input
                type="range"
                min={0.1}
                max={2}
                step={0.1}
                value={patternConfig.baseSpeed}
                onChange={(e) => handleConfigChange('baseSpeed', parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full"
              />
              <span className="text-sm">{patternConfig.baseSpeed.toFixed(1)}</span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Precision Level</label>
              <input
                type="range"
                min={1}
                max={10}
                value={patternConfig.precision}
                onChange={(e) => handleConfigChange('precision', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full"
              />
              <span className="text-sm">{patternConfig.precision}</span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Force Level</label>
              <input
                type="range"
                min={1}
                max={10}
                value={patternConfig.forceLevel}
                onChange={(e) => handleConfigChange('forceLevel', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full"
              />
              <span className="text-sm">{patternConfig.forceLevel}</span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Repeat Count</label>
              <input
                type="number"
                min={1}
                max={100}
                value={patternConfig.repeatCount}
                onChange={(e) => handleConfigChange('repeatCount', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Pause Duration (ms)</label>
              <input
                type="number"
                min={0}
                max={5000}
                step={100}
                value={patternConfig.pauseDuration}
                onChange={(e) => handleConfigChange('pauseDuration', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
