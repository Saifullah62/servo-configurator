import { MultiServoConfig, PlatformConfig } from '../types/templates';

export interface JetsonControlOptions {
  enablePositionFeedback?: boolean;
  enableTorqueControl?: boolean;
  enableSoftLimits?: boolean;
  enableEmergencyStop?: boolean;
  enableNetworkControl?: boolean;
  enableDataLogging?: boolean;
}

export function generateJetsonControlCode(
  config: MultiServoConfig,
  platformConfig: PlatformConfig,
  options: JetsonControlOptions = {}
): string {
  const useI2C = platformConfig.options.i2cAddress !== undefined;
  
  return `#!/usr/bin/env python3
import time
import sys
import signal
import json
import threading
import queue
import logging
from typing import Dict, List, Optional
${useI2C ? `import board
import busio
from adafruit_pca9685 import PCA9685
from adafruit_motor import servo` : `import Jetson.GPIO as GPIO`}
${options.enableNetworkControl ? `import flask
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit` : ''}
${options.enableDataLogging ? `import csv
from datetime import datetime` : ''}

class EmergencyStop(Exception):
    pass

class JetsonServoController:
    def __init__(self, config_path: str = "servo_config.json"):
        self.config = self.load_config(config_path)
        self.servos: Dict[str, ${useI2C ? 'servo.Servo' : 'int'}] = {}
        self.running = True
        self.command_queue = queue.Queue()
        ${options.enablePositionFeedback ? 'self.current_positions = {}' : ''}
        ${options.enableDataLogging ? 'self.setup_logging()' : ''}
        
        # Setup signal handlers
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
        ${useI2C ? `# Initialize I2C
        i2c = busio.I2C(board.SCL, board.SDA)
        self.pca = PCA9685(i2c, address=int("${platformConfig.options.i2cAddress || '0x40'}", 16))
        self.pca.frequency = ${platformConfig.options.customOptions?.pwmFrequency || 50}` : 
        `# Initialize GPIO
        GPIO.setmode(GPIO.BOARD)
        GPIO.setwarnings(False)`}
        
        self.setup_servos()
        ${options.enableEmergencyStop ? 'self.setup_emergency_stop()' : ''}
        
        # Start control thread
        self.control_thread = threading.Thread(target=self.control_loop)
        self.control_thread.daemon = True
        self.control_thread.start()

    ${options.enableDataLogging ? `
    def setup_logging(self):
        """Setup data logging"""
        self.log_file = f"servo_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        with open(self.log_file, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['timestamp', 'servo_id', 'command_angle', 'actual_angle'])
        
    def log_movement(self, servo_id: str, command_angle: float, actual_angle: float):
        """Log servo movement data"""
        with open(self.log_file, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([datetime.now().isoformat(), servo_id, command_angle, actual_angle])` : ''}

    ${options.enableEmergencyStop ? `
    def setup_emergency_stop(self):
        """Setup emergency stop button"""
        self.estop_pin = 7  # Use appropriate pin
        GPIO.setup(self.estop_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.add_event_detect(self.estop_pin, GPIO.FALLING, 
                            callback=self.emergency_stop_callback, 
                            bouncetime=200)
    
    def emergency_stop_callback(self, channel):
        """Handle emergency stop"""
        self.running = False
        self.cleanup()
        raise EmergencyStop("Emergency stop triggered!")` : ''}

    def control_loop(self):
        """Main control loop"""
        while self.running:
            try:
                # Process commands from queue
                while not self.command_queue.empty():
                    cmd = self.command_queue.get_nowait()
                    self.execute_command(cmd)
                
                ${options.enablePositionFeedback ? `
                # Update position feedback
                for servo_id, servo in self.servos.items():
                    if hasattr(servo, 'angle'):
                        self.current_positions[servo_id] = servo.angle` : ''}
                
                time.sleep(0.01)  # 100Hz update rate
            except Exception as e:
                logging.error(f"Control loop error: {e}")

    def execute_command(self, cmd: dict):
        """Execute a movement command"""
        servo_id = cmd['servo_id']
        angle = cmd['angle']
        duration = cmd.get('duration', 0)
        
        if servo_id not in self.servos:
            logging.error(f"Servo {servo_id} not found")
            return
        
        try:
            ${useI2C ? 
            `self.servos[servo_id].angle = angle` :
            `duty_cycle = self.angle_to_duty_cycle(angle, self.config['multiConfig']['servos'][servo_id])
            self.servos[servo_id].ChangeDutyCycle(duty_cycle)`}
            
            ${options.enableDataLogging ? 
            `actual_angle = getattr(self.servos[servo_id], 'angle', angle)
            self.log_movement(servo_id, angle, actual_angle)` : ''}
            
            if duration:
                time.sleep(duration / 1000)
        except Exception as e:
            logging.error(f"Movement error: {e}")

    ${options.enableNetworkControl ? `
    def start_network_interface(self, host='0.0.0.0', port=5000):
        """Start network control interface"""
        app = Flask(__name__)
        socketio = SocketIO(app)
        
        @app.route('/servo/<servo_id>/position', methods=['POST'])
        def set_position(servo_id):
            data = request.get_json()
            self.command_queue.put({
                'servo_id': servo_id,
                'angle': data['angle'],
                'duration': data.get('duration', 0)
            })
            return jsonify({'status': 'success'})
        
        @socketio.on('move_servo')
        def handle_movement(data):
            self.command_queue.put(data)
            emit('movement_completed', {'servo_id': data['servo_id']})
        
        socketio.run(app, host=host, port=port)` : ''}

    def cleanup(self):
        """Clean up resources"""
        self.running = False
        if self.control_thread.is_alive():
            self.control_thread.join()
        
        ${useI2C ?
        `self.pca.deinit()` :
        `for servo in self.servos.values():
            servo.stop()
        GPIO.cleanup()`}

def main():
    controller = JetsonServoController()
    ${options.enableNetworkControl ? 
    `# Start network interface in separate thread
    network_thread = threading.Thread(target=controller.start_network_interface)
    network_thread.daemon = True
    network_thread.start()` : ''}
    
    try:
        while controller.running:
            time.sleep(0.1)
    except KeyboardInterrupt:
        print("Program stopped by user")
    except EmergencyStop:
        print("Emergency stop triggered!")
    finally:
        controller.cleanup()

if __name__ == "__main__":
    main()`
}

export function generateNetworkControlExample(): string {
  return `
import requests
import time

def control_servo(servo_id: str, angle: float, duration: float = 0):
    url = f'http://localhost:5000/servo/{servo_id}/position'
    data = {
        'angle': angle,
        'duration': duration
    }
    response = requests.post(url, json=data)
    return response.json()

# Example usage
def main():
    # Move base servo
    control_servo('base', 90)
    time.sleep(1)
    
    # Move shoulder
    control_servo('shoulder', 45, 1000)
    time.sleep(2)
    
    # Return to home
    control_servo('base', 90)
    control_servo('shoulder', 90)

if __name__ == '__main__':
    main()
  `;
}
