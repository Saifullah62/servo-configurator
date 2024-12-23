import React, { useEffect, useState } from 'react';
import { ServoConfiguration, JetsonConfig, AdvancedFeatures, MovementPattern } from '../types/servo';
import { Code2, Play, Save, Download, Folder, RefreshCw, Terminal } from 'lucide-react';

interface CodeFile {
  name: string;
  content: string;
  language: string;
}

interface Props {
  servos: ServoConfiguration[];
  jetsonConfig: JetsonConfig;
  advancedFeatures: AdvancedFeatures;
  activePattern?: MovementPattern;
  disabled: boolean;
}

const DEFAULT_LIMITS = {
  minAngle: 0,
  maxAngle: 180,
  minPulse: 500,
  maxPulse: 2500,
  maxSpeed: 1000,
  maxAcceleration: 2000
};

const DEFAULT_CALIBRATION = {
  centerOffset: 0,
  pulseOffset: 0,
  angleMultiplier: 1
};

export const CodeDevelopment: React.FC<Props> = ({
  servos = [],
  jetsonConfig,
  advancedFeatures,
  activePattern,
  disabled
}) => {
  const [activeFile, setActiveFile] = useState<string>('main.py');
  const [files, setFiles] = useState<Record<string, CodeFile>>({});
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!servos || !jetsonConfig || !advancedFeatures) return;
    
    // Generate initial code files based on configuration
    generateCodeFiles();
  }, [servos, jetsonConfig, advancedFeatures, activePattern]);

  const generateCodeFiles = () => {
    if (!servos || servos.length === 0) {
      setFiles({
        'main.py': {
          name: 'main.py',
          content: '# No servos configured yet. Please add servos in the Servos tab.',
          language: 'python'
        }
      });
      return;
    }

    const newFiles: Record<string, CodeFile> = {};

    // Generate main.py
    newFiles['main.py'] = {
      name: 'main.py',
      content: generateMainPythonCode(),
      language: 'python'
    };

    // Generate servo_controller.py
    newFiles['servo_controller.py'] = {
      name: 'servo_controller.py',
      content: generateServoControllerCode(),
      language: 'python'
    };

    // Generate hardware configuration
    newFiles['config.py'] = {
      name: 'config.py',
      content: generateConfigCode(),
      language: 'python'
    };

    // Generate pattern execution code if a pattern is active
    if (activePattern) {
      newFiles['patterns.py'] = {
        name: 'patterns.py',
        content: generatePatternCode(),
        language: 'python'
      };
    }

    setFiles(newFiles);
  };

  const generateMainPythonCode = (): string => {
    return `#!/usr/bin/env python3
import time
from servo_controller import ServoController
from config import SERVO_CONFIG, HARDWARE_CONFIG
${activePattern ? 'from patterns import execute_pattern\n' : ''}

def main():
    # Initialize servo controller
    controller = ServoController(HARDWARE_CONFIG)
    
    # Configure servos
    for servo_config in SERVO_CONFIG:
        controller.add_servo(**servo_config)
    
    try:
        # Initialize hardware
        controller.initialize()
        print("Hardware initialized successfully")
        
        ${activePattern ? `
        # Execute pattern
        execute_pattern(controller)
        ` : `
        # Move servos to initial positions
        for servo in controller.servos:
            servo.move_to(servo.initial_position)
        time.sleep(1)  # Wait for servos to reach position
        `}
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        controller.cleanup()

if __name__ == "__main__":
    main()`;
  };

  const generateServoControllerCode = (): string => {
    const useI2C = jetsonConfig.controlMethod === 'i2c';
    
    return `import time
${useI2C ? 'import smbus2 as smbus' : 'import RPi.GPIO as GPIO'}

class ServoController:
    def __init__(self, config):
        self.config = config
        self.servos = []
        ${useI2C ? `
        self.bus = None
        self.i2c_address = config['i2c_address']
        ` : `
        GPIO.setmode(GPIO.BCM)
        `}
        
    def initialize(self):
        ${useI2C ? `
        self.bus = smbus.SMBus(self.config['i2c_bus'])
        self.set_pwm_frequency(self.config['pwm_frequency'])
        ` : `
        # Initialize GPIO pins
        for servo in self.servos:
            GPIO.setup(servo.pin, GPIO.OUT)
            servo.pwm = GPIO.PWM(servo.pin, self.config['pwm_frequency'])
            servo.pwm.start(0)
        `}
    
    def cleanup(self):
        ${useI2C ? `
        if self.bus:
            self.bus.close()
        ` : `
        GPIO.cleanup()
        `}
    
    def add_servo(self, channel, config):
        servo = Servo(channel, config)
        self.servos.append(servo)
        return servo
    
    ${useI2C ? `
    def set_pwm_frequency(self, freq):
        # Implementation depends on your specific I2C PWM controller
        pass
    
    def set_pwm(self, channel, on, off):
        # Implementation depends on your specific I2C PWM controller
        pass
    ` : ''}

class Servo:
    def __init__(self, channel, config):
        self.channel = channel
        self.config = config
        self.current_angle = config['initial_position']
        
    def move_to(self, angle, speed=None):
        # Apply limits and calibration
        angle = max(self.config['limits']['min_angle'],
                   min(self.config['limits']['max_angle'], angle))
        
        # Apply calibration
        calibrated_angle = (angle + self.config['calibration']['center_offset']) * \\
                          self.config['calibration']['angle_multiplier']
        
        # Convert angle to pulse width
        pulse = self._angle_to_pulse(calibrated_angle)
        
        # TODO: Implement actual servo movement
        self.current_angle = angle
        
    def _angle_to_pulse(self, angle):
        # Convert angle to pulse width
        pulse_range = self.config['max_pulse'] - self.config['min_pulse']
        angle_range = self.config['limits']['max_angle'] - self.config['limits']['min_angle']
        pulse = self.config['min_pulse'] + (angle / angle_range) * pulse_range
        return int(pulse)`;
  };

  const generateConfigCode = (): string => {
    const servoConfigs = servos.map(servo => {
      // Ensure all required properties have default values
      const limits = {
        ...DEFAULT_LIMITS,
        ...(servo.limits || {})
      };
      
      const calibration = {
        ...DEFAULT_CALIBRATION,
        ...(servo.calibration || {})
      };

      return {
        channel: servo.channel ?? 0,
        enabled: servo.enabled ?? true,
        name: servo.name ?? '',
        min_pulse: servo.minPulse ?? 500,
        max_pulse: servo.maxPulse ?? 2500,
        initial_position: servo.initialPosition ?? 90,
        inverted: servo.inverted ?? false,
        speed: servo.speed ?? 100,
        acceleration: servo.acceleration ?? 500,
        limits,
        calibration
      };
    });

    return `# Hardware Configuration
HARDWARE_CONFIG = {
    'control_method': '${jetsonConfig.controlMethod ?? 'i2c'}',
    ${jetsonConfig.controlMethod === 'i2c' ? `
    'i2c_bus': ${jetsonConfig.i2cBus ?? 1},
    'i2c_address': 0x${(jetsonConfig.i2cAddress ?? 0x40).toString(16)},
    ` : `
    'gpio_pin': ${jetsonConfig.gpioPin ?? 18},
    `}
    'pwm_frequency': ${jetsonConfig.pwmFrequency ?? 50},
    'features': {
        'position_feedback': ${advancedFeatures?.positionFeedback ?? false},
        'torque_control': ${advancedFeatures?.torqueControl ?? false},
        'soft_limits': ${advancedFeatures?.softLimits ?? true},
        'emergency_stop': ${advancedFeatures?.emergencyStop ?? true},
        'network_control': ${advancedFeatures?.networkControl ?? false},
        'data_logging': ${advancedFeatures?.dataLogging ?? false}
    }
}

# Servo Configuration
SERVO_CONFIG = ${JSON.stringify(servoConfigs, null, 4)}`;
  };

  const generatePatternCode = (): string => {
    if (!activePattern) return '';

    return `import time

def execute_pattern(controller):
    pattern_config = ${JSON.stringify(activePattern.config || {}, null, 4)}
    
    for _ in range(pattern_config.get('repeatCount', 1)):
        ${activePattern.type === 'composite' && activePattern.sequences ? `
        # Execute sequences
        for sequence in ${JSON.stringify(activePattern.sequences, null, 4)}:
            print(f"Executing sequence: {sequence['name']}")
            for point in sequence['points']:
                controller.servos[0].move_to(point['angle'])
                time.sleep(point['delay'] / 1000)  # Convert to seconds
        ` : `
        # Execute points
        for point in ${JSON.stringify(activePattern.points || [], null, 4)}:
            controller.servos[0].move_to(point['angle'])
            time.sleep(point['delay'] / 1000)  # Convert to seconds
        `}
        
        # Pause between repetitions
        if pattern_config.get('pauseDuration'):
            time.sleep(pattern_config['pauseDuration'] / 1000)`;
  };

  const handleCodeChange = (content: string) => {
    setFiles(prev => ({
      ...prev,
      [activeFile]: {
        ...prev[activeFile],
        content
      }
    }));
  };

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name:');
    if (!fileName) return;

    const language = fileName.endsWith('.py') ? 'python' : 
                    fileName.endsWith('.js') ? 'javascript' : 
                    fileName.endsWith('.cpp') ? 'cpp' : 'text';

    setFiles(prev => ({
      ...prev,
      [fileName]: {
        name: fileName,
        content: '',
        language
      }
    }));
    setActiveFile(fileName);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    try {
      // TODO: Implement actual code execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutput(prev => prev + '> Code executed successfully!\n');
    } catch (error) {
      setOutput(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveCode = () => {
    localStorage.setItem('servo_code', JSON.stringify(files));
    setOutput(prev => prev + '> Code saved successfully!\n');
  };

  const handleExportCode = () => {
    const blob = new Blob([files[activeFile].content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCreateFile}
            disabled={disabled}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Folder className="w-4 h-4 mr-2" />
            New File
          </button>
          <div className="flex items-center space-x-2">
            {Object.keys(files).map(fileName => (
              <button
                key={fileName}
                onClick={() => setActiveFile(fileName)}
                className={`px-3 py-1 rounded-md text-sm ${
                  activeFile === fileName
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {fileName}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunCode}
            disabled={disabled || isRunning}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <Play className="w-4 h-4 mr-1" />}
            Run
          </button>
          <button
            onClick={handleSaveCode}
            disabled={disabled}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </button>
          <button
            onClick={handleExportCode}
            disabled={disabled}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative">
          <div className="absolute top-2 left-2">
            <Code2 className="w-5 h-5 text-gray-400" />
          </div>
          <textarea
            value={files[activeFile]?.content || ''}
            onChange={(e) => handleCodeChange(e.target.value)}
            disabled={disabled}
            placeholder="Write your code here..."
            className="w-full h-full pl-10 pr-4 py-2 font-mono text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
            style={{
              resize: 'none',
              minHeight: '400px',
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
            }}
          />
        </div>

        <div className="relative">
          <div className="absolute top-2 left-2">
            <Terminal className="w-5 h-5 text-gray-400" />
          </div>
          <div
            className="w-full h-full pl-10 pr-4 py-2 font-mono text-sm rounded-md border border-gray-300 overflow-y-auto"
            style={{
              minHeight: '400px',
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
            }}
          >
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-500 flex justify-between">
        <span>{files[activeFile]?.content.split('\n').length || 0} lines | {files[activeFile]?.content.length || 0} characters</span>
        <span>Language: {files[activeFile]?.language || 'text'}</span>
      </div>
    </div>
  );
};
