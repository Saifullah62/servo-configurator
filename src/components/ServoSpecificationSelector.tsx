import React, { useState } from 'react';
import { ServoSpecification } from '../types/servo';
import { servoDatabase } from '../data/servoDatabase';

interface ServoSpecificationSelectorProps {
  value?: ServoSpecification;
  onChange: (spec: ServoSpecification | undefined) => void;
  disabled?: boolean;
}

export const ServoSpecificationSelector: React.FC<ServoSpecificationSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [customSpec, setCustomSpec] = useState<boolean>(false);

  const handleModelSelect = (model: string) => {
    if (model === 'custom') {
      setCustomSpec(true);
      onChange(undefined);
    } else {
      setCustomSpec(false);
      onChange(servoDatabase[model]);
    }
  };

  const handleCustomSpecChange = (field: string, value: any) => {
    const updatedSpec: ServoSpecification = {
      ...(value || {}),
      [field]: value
    };
    onChange(updatedSpec);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Servo Model
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={value?.model || 'custom'}
          onChange={(e) => handleModelSelect(e.target.value)}
          disabled={disabled}
        >
          <option value="">Select a model...</option>
          {Object.keys(servoDatabase).map((model) => (
            <option key={model} value={model}>
              {servoDatabase[model].manufacturer} - {model}
            </option>
          ))}
          <option value="custom">Custom Specification</option>
        </select>
      </div>

      {value && !customSpec && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Specifications</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Type:</span> {value.type}
            </div>
            <div>
              <span className="font-medium">Weight:</span> {value.weight}g
            </div>
            <div>
              <span className="font-medium">Dimensions:</span>{' '}
              {value.dimensions.length}x{value.dimensions.width}x{value.dimensions.height}mm
            </div>
            <div>
              <span className="font-medium">Torque:</span>{' '}
              {value.torque.value}{value.torque.unit}
            </div>
            <div>
              <span className="font-medium">Speed:</span>{' '}
              {value.speed.value}s/60° @{value.speed.voltage}V
            </div>
            <div>
              <span className="font-medium">Voltage:</span>{' '}
              {value.operatingVoltage.min}-{value.operatingVoltage.max}V
            </div>
            <div>
              <span className="font-medium">Range:</span>{' '}
              {value.rotationRange.min}° to {value.rotationRange.max}°
            </div>
            <div>
              <span className="font-medium">Bearing:</span> {value.bearingType}
            </div>
            <div>
              <span className="font-medium">Gears:</span> {value.gearMaterial}
            </div>
            <div>
              <span className="font-medium">Features:</span>{' '}
              {[
                value.waterproof && 'Waterproof',
                value.analogFeedback && 'Feedback',
                value.protocol
              ].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>
      )}

      {customSpec && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Manufacturer
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={value?.manufacturer || ''}
                onChange={(e) => handleCustomSpecChange('manufacturer', e.target.value)}
                disabled={disabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={value?.model || ''}
                onChange={(e) => handleCustomSpecChange('model', e.target.value)}
                disabled={disabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={value?.type || ''}
                onChange={(e) => handleCustomSpecChange('type', e.target.value)}
                disabled={disabled}
              >
                <option value="">Select type...</option>
                <option value="Standard">Standard</option>
                <option value="Digital">Digital</option>
                <option value="Coreless">Coreless</option>
                <option value="Brushless">Brushless</option>
                <option value="High Voltage">High Voltage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight (g)
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={value?.weight || ''}
                onChange={(e) => handleCustomSpecChange('weight', parseFloat(e.target.value))}
                disabled={disabled}
              />
            </div>
            {/* Add more custom specification fields as needed */}
          </div>
        </div>
      )}
    </div>
  );
};
