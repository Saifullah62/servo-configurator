import React, { useState, useEffect, useRef } from 'react';
import { ServoConfiguration, ServoTestResult } from '../types/servo';
import { ServoSpecificationSelector } from './ServoSpecificationSelector';
import { ServoProgramming } from './ServoProgramming';

interface ServoConfigProps {
  config: ServoConfiguration;
  onConfigChange: (config: ServoConfiguration) => void;
  disabled?: boolean;
}

interface ServoVisualizerProps {
  angle: number;
  minPulse: number;
  maxPulse: number;
  inverted: boolean;
  size?: number;
}

const ServoVisualizer: React.FC<ServoVisualizerProps> = ({
  angle,
  minPulse,
  maxPulse,
  inverted,
  size = 200
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawServo = (ctx: CanvasRenderingContext2D) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size * 0.4);

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw angle guides
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 180; i += 15) {
      const radian = (i - 90) * (Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(radian) * radius,
        centerY + Math.sin(radian) * radius
      );
      ctx.stroke();

      // Add angle labels
      if (i % 45 === 0) {
        const labelRadius = radius + 15;
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          i.toString(),
          centerX + Math.cos(radian) * labelRadius,
          centerY + Math.sin(radian) * labelRadius
        );
      }
    }

    // Draw servo body
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Draw servo arm
    const armAngle = inverted ? -angle + 90 : angle - 90;
    const radian = armAngle * (Math.PI / 180);
    
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(radian) * radius,
      centerY + Math.sin(radian) * radius
    );
    ctx.stroke();

    // Draw arm endpoint
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(
      centerX + Math.cos(radian) * radius,
      centerY + Math.sin(radian) * radius,
      5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawServo(ctx);
  }, [angle, minPulse, maxPulse, inverted, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="mx-auto"
    />
  );
};

export const ServoConfig: React.FC<ServoConfigProps> = ({
  config,
  onConfigChange,
  disabled = false,
}) => {
  const [testAngle, setTestAngle] = useState(config.initialPosition);
  const [isAnimating, setIsAnimating] = useState(false);
  const [testResults, setTestResults] = useState<ServoTestResult[]>([]);
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const animationRef = useRef<number>();

  const handleChange = (field: keyof ServoConfiguration, value: any) => {
    if (onConfigChange) {
      const newConfig = { ...config };
      if (field === 'programs' && !Array.isArray(newConfig.programs)) {
        newConfig.programs = [];
      }
      // Ensure numeric values are properly parsed
      if (['channel', 'minPulse', 'maxPulse', 'initialPosition', 'speed', 'acceleration'].includes(field)) {
        newConfig[field] = Number.isNaN(value) ? 0 : value;
      } else {
        newConfig[field] = value;
      }
      onConfigChange(newConfig);
    }
  };

  const handleTestAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const startTest = async (type: 'range' | 'speed' | 'accuracy' | 'endurance') => {
    setActiveTest(type);
    const result: ServoTestResult = {
      timestamp: new Date().toISOString(),
      type,
      data: [],
      notes: ''
    };

    switch (type) {
      case 'range':
        // Test full range of motion
        for (let angle = 0; angle <= 180; angle += 45) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          result.data.push({
            targetValue: angle,
            measuredValue: angle, // In real implementation, this would come from servo feedback
            deviation: 0
          });
        }
        break;

      case 'speed':
        // Test speed at different positions
        const angles = [0, 90, 180];
        for (const angle of angles) {
          const startTime = Date.now();
          setTestAngle(angle);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const duration = (Date.now() - startTime) / 1000;
          result.data.push({
            targetValue: angle,
            measuredValue: angle,
            deviation: 0,
            duration
          });
        }
        break;

      case 'accuracy':
        // Test position accuracy
        const positions = [45, 90, 135];
        for (const pos of positions) {
          setTestAngle(pos);
          await new Promise(resolve => setTimeout(resolve, 500));
          const measured = pos + (Math.random() * 2 - 1); // Simulate measurement
          result.data.push({
            targetValue: pos,
            measuredValue: measured,
            deviation: Math.abs(measured - pos)
          });
        }
        break;

      case 'endurance':
        // Quick endurance test
        let cycles = 0;
        const startTime = Date.now();
        while (cycles < 10) {
          setTestAngle(0);
          await new Promise(resolve => setTimeout(resolve, 500));
          setTestAngle(180);
          await new Promise(resolve => setTimeout(resolve, 500));
          cycles++;
        }
        const duration = (Date.now() - startTime) / 1000;
        result.data.push({
          targetValue: 10,
          measuredValue: cycles,
          deviation: 0,
          duration,
          cycles
        });
        break;
    }

    setTestResults(prev => [...prev, result]);
    setActiveTest(null);
  };

  useEffect(() => {
    if (isAnimating) {
      let currentAngle = testAngle;
      let direction = 1;
      const step = config.speed / 60; // Assuming 60fps

      const animate = () => {
        currentAngle += direction * step;

        if (currentAngle >= 180) {
          currentAngle = 180;
          direction = -1;
        } else if (currentAngle <= 0) {
          currentAngle = 0;
          direction = 1;
        }

        setTestAngle(currentAngle);
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, config.speed]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Servo Configuration</h2>
            <p className="mt-1 text-sm text-gray-500">Configure and test your servo parameters</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              activeTest 
                ? 'bg-yellow-100 text-yellow-800' 
                : isAnimating 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {activeTest 
                ? 'Testing...' 
                : isAnimating 
                  ? 'Animating'
                  : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Basic Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Channel
              </label>
              <input
                type="number"
                value={config.channel}
                onChange={(e) => handleChange('channel', parseInt(e.target.value))}
                disabled={disabled}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min={0}
                max={15}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Pulse (μs)
                </label>
                <input
                  type="number"
                  value={config.minPulse}
                  onChange={(e) => handleChange('minPulse', parseInt(e.target.value))}
                  disabled={disabled}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={500}
                  max={2500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Pulse (μs)
                </label>
                <input
                  type="number"
                  value={config.maxPulse}
                  onChange={(e) => handleChange('maxPulse', parseInt(e.target.value))}
                  disabled={disabled}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={500}
                  max={2500}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Position
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={config.initialPosition}
                  onChange={(e) => handleChange('initialPosition', parseInt(e.target.value))}
                  disabled={disabled}
                  className="block w-24 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={0}
                  max={180}
                />
                <input
                  type="range"
                  value={config.initialPosition}
                  onChange={(e) => handleChange('initialPosition', parseInt(e.target.value))}
                  disabled={disabled}
                  className="flex-1"
                  min={0}
                  max={180}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.inverted}
                  onChange={(e) => handleChange('inverted', e.target.checked)}
                  disabled={disabled}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Invert Direction
                </label>
              </div>
            </div>
          </div>

          <div>
            <ServoSpecificationSelector
              value={config.specification}
              onChange={(spec) => handleChange('specification', spec)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Movement Parameters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Movement Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speed (°/s)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={config.speed}
                onChange={(e) => handleChange('speed', parseInt(e.target.value))}
                disabled={disabled}
                className="block w-24 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min={1}
                max={1000}
              />
              <input
                type="range"
                value={config.speed}
                onChange={(e) => handleChange('speed', parseInt(e.target.value))}
                disabled={disabled}
                className="flex-1"
                min={1}
                max={1000}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Acceleration (°/s²)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={config.acceleration}
                onChange={(e) => handleChange('acceleration', parseInt(e.target.value))}
                disabled={disabled}
                className="block w-24 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min={1}
                max={1000}
              />
              <input
                type="range"
                value={config.acceleration}
                onChange={(e) => handleChange('acceleration', parseInt(e.target.value))}
                disabled={disabled}
                className="flex-1"
                min={1}
                max={1000}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Programming */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Programming</h3>
        <ServoProgramming
          programs={config.programs || []}
          activeProgram={config.activeProgram}
          onProgramChange={(programs) => handleChange('programs', programs)}
          onActiveProgramChange={(programId) => handleChange('activeProgram', programId)}
          disabled={disabled}
        />
      </div>

      {/* Testing & Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Testing & Preview</h3>
          <button
            onClick={handleTestAnimation}
            disabled={disabled || !!activeTest}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              isAnimating 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            } ${disabled || !!activeTest ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAnimating ? 'Stop Animation' : 'Start Animation'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <ServoVisualizer
                angle={testAngle}
                minPulse={config.minPulse}
                maxPulse={config.maxPulse}
                inverted={config.inverted}
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Position
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={Math.round(testAngle)}
                    onChange={(e) => setTestAngle(parseInt(e.target.value))}
                    disabled={disabled || isAnimating}
                    className="block w-24 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min={0}
                    max={180}
                  />
                  <input
                    type="range"
                    value={testAngle}
                    onChange={(e) => setTestAngle(parseInt(e.target.value))}
                    disabled={disabled || isAnimating}
                    className="flex-1"
                    min={0}
                    max={180}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Test Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => startTest('range')}
                  disabled={disabled || !!activeTest}
                  className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Range Test
                </button>
                <button
                  onClick={() => startTest('speed')}
                  disabled={disabled || !!activeTest}
                  className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Speed Test
                </button>
                <button
                  onClick={() => startTest('accuracy')}
                  disabled={disabled || !!activeTest}
                  className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Accuracy Test
                </button>
                <button
                  onClick={() => startTest('endurance')}
                  disabled={disabled || !!activeTest}
                  className="flex items-center justify-center px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Endurance Test
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Test Results</h4>
            {activeTest && (
              <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
                Running {activeTest} test...
              </div>
            )}

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                >
                  <div className="font-medium text-gray-900">{result.type} Test</div>
                  <div className="text-sm text-gray-500 mb-3">
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                  {result.data.map((data, i) => (
                    <div key={i} className="text-sm text-gray-600 pl-3 border-l-2 border-gray-200 mt-2">
                      <span className="font-medium">Target:</span> {data.targetValue}°
                      <br />
                      <span className="font-medium">Measured:</span> {data.measuredValue.toFixed(2)}°
                      <br />
                      <span className="font-medium">Deviation:</span> {data.deviation.toFixed(2)}°
                      {data.duration && (
                        <><br /><span className="font-medium">Duration:</span> {data.duration.toFixed(2)}s</>
                      )}
                      {data.cycles && (
                        <><br /><span className="font-medium">Cycles:</span> {data.cycles}</>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {testResults.length === 0 && (
                <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                  No test results available. Run a test to see results here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
