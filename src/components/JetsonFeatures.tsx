import React from 'react';
import { AdvancedFeatures, JetsonConfig } from '../types/servo';

interface JetsonFeaturesProps {
  config: JetsonConfig;
  features: AdvancedFeatures;
  onConfigChange: (config: JetsonConfig) => void;
  onFeaturesChange: (features: AdvancedFeatures) => void;
  disabled?: boolean;
}

export const JetsonFeatures: React.FC<JetsonFeaturesProps> = ({
  config,
  features,
  onConfigChange,
  onFeaturesChange,
  disabled = false,
}) => {
  const handleConfigChange = (field: keyof JetsonConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  const handleFeatureChange = (field: keyof AdvancedFeatures, value: boolean) => {
    onFeaturesChange({
      ...features,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Jetson Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Control Method
            </label>
            <select
              value={config.controlMethod}
              onChange={(e) => handleConfigChange('controlMethod', e.target.value)}
              disabled={disabled}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="i2c">I2C</option>
              <option value="gpio">GPIO</option>
            </select>
          </div>

          {config.controlMethod === 'i2c' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  I2C Bus
                </label>
                <input
                  type="number"
                  value={config.i2cBus}
                  onChange={(e) => handleConfigChange('i2cBus', parseInt(e.target.value))}
                  disabled={disabled}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  I2C Address
                </label>
                <input
                  type="text"
                  value={`0x${config.i2cAddress.toString(16)}`}
                  onChange={(e) => handleConfigChange('i2cAddress', parseInt(e.target.value.replace('0x', ''), 16))}
                  disabled={disabled}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0x40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  PWM Frequency (Hz)
                </label>
                <input
                  type="number"
                  value={config.pwmFrequency}
                  onChange={(e) => handleConfigChange('pwmFrequency', parseInt(e.target.value))}
                  disabled={disabled}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={1}
                  max={1600}
                />
              </div>
            </>
          )}

          {config.controlMethod === 'gpio' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                GPIO Pin
              </label>
              <input
                type="number"
                value={config.gpioPin}
                onChange={(e) => handleConfigChange('gpioPin', parseInt(e.target.value))}
                disabled={disabled}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min={0}
                max={40}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Advanced Features</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={features.positionFeedback}
              onChange={(e) => handleFeatureChange('positionFeedback', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Position Feedback</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={features.torqueControl}
              onChange={(e) => handleFeatureChange('torqueControl', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Torque Control</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={features.softLimits}
              onChange={(e) => handleFeatureChange('softLimits', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Software Limits</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={features.emergencyStop}
              onChange={(e) => handleFeatureChange('emergencyStop', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Emergency Stop</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={features.networkControl}
              onChange={(e) => handleFeatureChange('networkControl', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Network Control</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={features.dataLogging}
              onChange={(e) => handleFeatureChange('dataLogging', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Data Logging</span>
          </label>
        </div>

        {features.networkControl && (
          <div className="mt-4 p-3 bg-yellow-50 rounded">
            <p className="text-sm text-yellow-800">
              Network control is enabled. REST API will be available on port 5000.
              See documentation for API details.
            </p>
          </div>
        )}

        {features.dataLogging && (
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              Data logging is enabled. Logs will be stored in the logs directory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
