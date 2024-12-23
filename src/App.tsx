import React, { useEffect, useState } from 'react';
import { ServoConfiguration, MovementPattern, JetsonConfig, AdvancedFeatures, ServoSpecification } from './types/servo';
import { ServoConfig } from './components/ServoConfig';
import { MovementPatterns } from './components/MovementPatterns';
import { CodeDevelopment } from './components/CodeDevelopment';
import { JetsonFeatures } from './components/JetsonFeatures';
import { ServoPresetSelector } from './components/ServoPresetSelector';
import { StateManager } from './utils/stateManager';
import { EventBus } from './utils/eventBus';
import { ErrorHandler, ErrorType } from './utils/errorHandler';
import { Logger, LogLevel } from './utils/logger';
import { IntegrationService } from './services/integrationService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('servos');
  const [showPresetSelector, setShowPresetSelector] = useState(false);
  
  // Use StateManager for all state
  const [appState, setAppState] = useState(StateManager.getState());
  
  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = StateManager.subscribe(newState => {
      setAppState(newState);
      Logger.info('App state updated', { page: currentPage });
    });

    // Subscribe to error events
    const errorUnsubscribe = EventBus.subscribe('error', (error: Error) => {
      ErrorHandler.handleError(error);
      Logger.error('Error occurred', { error });
    });

    return () => {
      unsubscribe();
      errorUnsubscribe();
    };
  }, []);

  const handleServoChange = (index: number, config: ServoConfiguration) => {
    try {
      StateManager.updateServo(index, config);
      EventBus.emit('servo:update', config);
      Logger.info('Servo configuration updated', { servoIndex: index });
    } catch (error) {
      ErrorHandler.handleServoError(error as Error);
    }
  };

  const handlePatternSelect = (pattern: MovementPattern) => {
    try {
      StateManager.setActivePattern(pattern);
      EventBus.emit('pattern:update', pattern);
      Logger.info('Pattern selected', { patternName: pattern.name });
    } catch (error) {
      ErrorHandler.handlePatternError(error as Error);
    }
  };

  const handleExecutePattern = async (pattern: MovementPattern) => {
    try {
      const integrationService = IntegrationService.getInstance();
      await integrationService.executePattern(pattern, appState.servos);
      Logger.info('Pattern executed', { patternName: pattern.name });
    } catch (error) {
      ErrorHandler.handleExecutionError(error as Error);
    }
  };

  const handleAddServo = () => {
    setShowPresetSelector(true);
  };

  const handlePresetSelect = (preset: ServoSpecification, config: Partial<ServoConfiguration>) => {
    try {
      const newServo: ServoConfiguration = {
        channel: appState.servos.length,
        enabled: true,
        name: preset.model,
        description: preset.manufacturer + ' ' + preset.type,
        minPulse: config.minPulse || 500,
        maxPulse: config.maxPulse || 2500,
        initialPosition: config.initialPosition || 90,
        inverted: config.inverted || false,
        speed: config.speed || 100,
        acceleration: config.acceleration || 50,
        limits: {
          minAngle: config.limits?.minAngle || 0,
          maxAngle: config.limits?.maxAngle || 180,
          minPulse: config.limits?.minPulse || 500,
          maxPulse: config.limits?.maxPulse || 2500,
          maxSpeed: config.limits?.maxSpeed || 360,
          maxAcceleration: config.limits?.maxAcceleration || 720
        },
        calibration: {
          centerOffset: config.calibration?.centerOffset || 0,
          pulseOffset: config.calibration?.pulseOffset || 0,
          angleMultiplier: config.calibration?.angleMultiplier || 1
        },
        specification: preset,
        programs: []
      };
      
      StateManager.addServo(newServo);
      setShowPresetSelector(false);
      Logger.info('Servo preset added', { preset: preset.model });
    } catch (error) {
      ErrorHandler.handleServoError(error as Error);
    }
  };

  const handleJetsonConfigChange = (config: JetsonConfig) => {
    try {
      StateManager.updateJetsonConfig(config);
      Logger.info('Jetson configuration updated');
    } catch (error) {
      ErrorHandler.handleHardwareError(error as Error);
    }
  };

  const handleFeaturesChange = (features: AdvancedFeatures) => {
    try {
      StateManager.updateAdvancedFeatures(features);
      Logger.info('Advanced features updated');
    } catch (error) {
      ErrorHandler.handleHardwareError(error as Error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentPage('servos')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'servos'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Servos
              </button>
              <button
                onClick={() => setCurrentPage('movements')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'movements'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Movement Patterns
              </button>
              <button
                onClick={() => setCurrentPage('code')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'code'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setCurrentPage('hardware')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'hardware'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hardware
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {showPresetSelector && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <ServoPresetSelector onSelect={handlePresetSelect} />
            </div>
          </div>
        )}

        {renderPage()}
      </main>
    </div>
  );

  function renderPage() {
    switch (currentPage) {
      case 'servos':
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Servo Configuration</h1>
              <button
                onClick={handleAddServo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Servo
              </button>
            </div>

            {appState.servos.map((servo, index) => (
              <div key={index} className="mb-8">
                <ServoConfig
                  config={servo}
                  onConfigChange={(config) => handleServoChange(index, config)}
                />
              </div>
            ))}

            {appState.servos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No servos configured yet</p>
                <button
                  onClick={handleAddServo}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Your First Servo
                </button>
              </div>
            )}
          </>
        );

      case 'movements':
        return (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Movement Patterns</h1>
              <p className="mt-2 text-gray-600">Create and manage movement patterns for your servos</p>
            </div>
            <MovementPatterns
              onPatternSelect={handlePatternSelect}
              onExecutePattern={handleExecutePattern}
              servos={appState.servos}
              disabled={appState.servos.length === 0}
            />
          </>
        );

      case 'code':
        return (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Code Development</h1>
              <p className="mt-2 text-gray-600">Generate and customize code for your servo configuration</p>
            </div>
            <CodeDevelopment
              servos={appState.servos}
              jetsonConfig={appState.jetsonConfig}
              advancedFeatures={appState.advancedFeatures}
              activePattern={appState.activePattern}
              disabled={appState.servos.length === 0}
            />
          </>
        );

      case 'hardware':
        return (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Hardware Configuration</h1>
              <p className="mt-2 text-gray-600">Configure hardware settings and advanced features</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <JetsonFeatures
                config={appState.jetsonConfig}
                features={appState.advancedFeatures}
                onConfigChange={handleJetsonConfigChange}
                onFeaturesChange={handleFeaturesChange}
                disabled={appState.servos.length === 0}
              />
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Connection Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Hardware Connection</span>
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>I2C Bus Status</span>
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  }
};

export default App;