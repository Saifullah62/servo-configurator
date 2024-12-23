import { MultiServoConfig, PlatformType, PlatformConfig } from '../types/templates';
import { MovementPattern } from '../types/servo';

function generateArduinoCode(config: MultiServoConfig, platformConfig: PlatformConfig): string {
  const servoIds = Object.keys(config.servos);
  
  return `
#include <Servo.h>

${servoIds.map(id => `Servo servo_${id};`).join('\n')}

void setup() {
  ${servoIds.map(id => `servo_${id}.attach(${platformConfig.options.pinMapping?.[id] || 'PIN'});`).join('\n  ')}
}

${Object.entries(config.servos).map(([id, servo]) => `
// Movement patterns for servo ${id}
void runPattern_${id}(int patternIndex) {
  switch(patternIndex) {
    ${servo.patterns.map((pattern, index) => `
    case ${index}:
      // ${pattern.name}
      ${pattern.steps.map(step => `
      servo_${id}.write(${step.angle});
      delay(${step.duration});`).join('')}
      break;`).join('\n')}
  }
}`).join('\n')}

void loop() {
  // Your control logic here
}`;
}

function generateJetsonCode(config: MultiServoConfig, platformConfig: PlatformConfig): string {
  const useI2C = platformConfig.options.i2cAddress !== undefined;
  
  return `#!/usr/bin/env python3
import time
import sys
from typing import Dict, List, Optional
import json
import signal
${useI2C ? `import board
import busio
from adafruit_pca9685 import PCA9685
from adafruit_motor import servo` : `import Jetson.GPIO as GPIO`}

class ServoController:
    def __init__(self, config_path: str = "servo_config.json"):
        self.config = self.load_config(config_path)
        self.servos: Dict[str, ${useI2C ? 'servo.Servo' : 'int'}] = {}
        self.running = True
        
        # Setup signal handler for graceful shutdown
        signal.signal(signal.SIGINT, self.signal_handler)
        
        ${useI2C ? `# Initialize I2C bus and PCA9685
        i2c = busio.I2C(board.SCL, board.SDA)
        self.pca = PCA9685(i2c, address=int("${platformConfig.options.i2cAddress || '0x40'}", 16))
        self.pca.frequency = ${platformConfig.options.customOptions?.pwmFrequency || 50}` : 
        `# Initialize GPIO
        GPIO.setmode(GPIO.BOARD)
        GPIO.setwarnings(False)`}
        
        self.setup_servos()

    def load_config(self, config_path: str) -> dict:
        with open(config_path, 'r') as f:
            return json.load(f)

    def setup_servos(self):
        ${useI2C ? 
        `for servo_id, servo_config in self.config['multiConfig']['servos'].items():
            channel = self.config['platformConfig']['options']['pinMapping'][servo_id]
            self.servos[servo_id] = servo.Servo(
                self.pca.channels[channel],
                min_pulse=${config.servos['main'].config.pwmMin},
                max_pulse=${config.servos['main'].config.pwmMax}
            )` :
        `for servo_id, servo_config in self.config['multiConfig']['servos'].items():
            pin = self.config['platformConfig']['options']['pinMapping'][servo_id]
            GPIO.setup(pin, GPIO.OUT)
            self.servos[servo_id] = GPIO.PWM(pin, 50)  # 50Hz frequency
            self.servos[servo_id].start(0)`}

    def angle_to_duty_cycle(self, angle: float, servo_config: dict) -> float:
        """Convert angle to duty cycle based on servo configuration"""
        min_duty = servo_config['config']['pwmMin'] / 20000  # Convert to duty cycle (%)
        max_duty = servo_config['config']['pwmMax'] / 20000
        angle_range = servo_config['config']['angleMax'] - servo_config['config']['angleMin']
        return min_duty + (max_duty - min_duty) * (angle / angle_range)

    def move_servo(self, servo_id: str, angle: float, duration: Optional[float] = None):
        """Move a servo to a specific angle"""
        if servo_id not in self.servos:
            print(f"Error: Servo {servo_id} not found")
            return

        servo_config = self.config['multiConfig']['servos'][servo_id]
        
        # Apply center offset
        adjusted_angle = angle + servo_config['config']['centerOffset']
        
        # Clamp angle to valid range
        adjusted_angle = max(servo_config['config']['angleMin'],
                           min(servo_config['config']['angleMax'], adjusted_angle))

        ${useI2C ?
        `self.servos[servo_id].angle = adjusted_angle` :
        `duty_cycle = self.angle_to_duty_cycle(adjusted_angle, servo_config)
        self.servos[servo_id].ChangeDutyCycle(duty_cycle)`}

        if duration:
            time.sleep(duration)

    def run_pattern(self, servo_id: str, pattern_index: int):
        """Run a predefined movement pattern"""
        if servo_id not in self.servos:
            print(f"Error: Servo {servo_id} not found")
            return

        servo_config = self.config['multiConfig']['servos'][servo_id]
        if pattern_index >= len(servo_config['patterns']):
            print(f"Error: Pattern index {pattern_index} not found")
            return

        pattern = servo_config['patterns'][pattern_index]
        print(f"Running pattern: {pattern['name']}")
        
        for step in pattern['steps']:
            if not self.running:
                break
            self.move_servo(servo_id, step['angle'], step['duration'] / 1000)

    def cleanup(self):
        """Clean up resources"""
        ${useI2C ?
        `self.pca.deinit()` :
        `for servo in self.servos.values():
            servo.stop()
        GPIO.cleanup()`}

    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        print("Shutting down...")
        self.running = False
        self.cleanup()
        sys.exit(0)

def main():
    controller = ServoController()
    
    # Example usage
    try:
        while controller.running:
            # Add your control logic here
            time.sleep(0.1)
    except KeyboardInterrupt:
        print("Program stopped by user")
    finally:
        controller.cleanup()

if __name__ == "__main__":
    main()`;
}

export function generatePlatformCode(
  config: MultiServoConfig,
  platform: PlatformType,
  platformConfig: PlatformConfig
): string {
  switch (platform) {
    case 'arduino':
      return generateArduinoCode(config, platformConfig);
    case 'jetson':
      return generateJetsonCode(config, platformConfig);
    case 'raspberrypi':
      // Similar to Jetson but with RPi.GPIO
      return generateJetsonCode(config, platformConfig).replace('Jetson.GPIO', 'RPi.GPIO');
    case 'esp32':
      // Similar to Arduino but with ESP32-specific libraries
      return generateArduinoCode(config, platformConfig)
        .replace('#include <Servo.h>', '#include <ESP32Servo.h>');
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
