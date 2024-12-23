#!/usr/bin/env python3

import os
import json
import logging
import yaml
from flask import Flask, request, jsonify
from flask_cors import CORS
from adafruit_servokit import ServoKit
import websockets
import asyncio
import threading
import psutil
from logging.handlers import RotatingFileHandler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    handlers=[
        RotatingFileHandler(
            '/var/log/servo-configurator.log',
            maxBytes=1024*1024,  # 1MB
            backupCount=5
        ),
        logging.StreamHandler()
    ],
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('servo-configurator')

# Load configuration
CONFIG_PATH = '/etc/servo-configurator/config.yaml'
with open(CONFIG_PATH) as f:
    config = yaml.safe_load(f)

app = Flask(__name__)
CORS(app)

# Initialize servo controller
kit = ServoKit(channels=16)

class ServoController:
    def __init__(self):
        self.servos = {}
        self.patterns = {}
        self.running_patterns = set()
        
    def configure_servo(self, channel, config):
        """Configure a servo with the given parameters"""
        try:
            if not 0 <= channel <= 15:
                raise ValueError(f"Invalid channel number: {channel}")
                
            servo = kit.servo[channel]
            servo.set_pulse_width_range(config['minPulse'], config['maxPulse'])
            
            self.servos[channel] = {
                'config': config,
                'position': config.get('initialPosition', 90)
            }
            
            # Set initial position
            self.move_servo(channel, config.get('initialPosition', 90))
            logger.info(f"Configured servo on channel {channel}")
            return True
            
        except Exception as e:
            logger.error(f"Error configuring servo: {str(e)}")
            raise
            
    def move_servo(self, channel, angle):
        """Move a servo to the specified angle"""
        try:
            if channel not in self.servos:
                raise ValueError(f"Servo not configured on channel {channel}")
                
            config = self.servos[channel]['config']
            if config.get('inverted', False):
                angle = 180 - angle
                
            # Apply calibration
            if 'calibration' in config:
                angle = (angle + config['calibration'].get('centerOffset', 0)) * \
                        config['calibration'].get('angleMultiplier', 1)
                
            # Check limits
            limits = config.get('limits', {})
            if not (limits.get('minAngle', 0) <= angle <= limits.get('maxAngle', 180)):
                raise ValueError(f"Angle {angle} outside limits")
                
            kit.servo[channel].angle = angle
            self.servos[channel]['position'] = angle
            logger.info(f"Moved servo {channel} to angle {angle}")
            return True
            
        except Exception as e:
            logger.error(f"Error moving servo: {str(e)}")
            raise

    async def execute_pattern(self, pattern_name):
        """Execute a movement pattern"""
        try:
            if pattern_name not in self.patterns:
                raise ValueError(f"Pattern not found: {pattern_name}")
                
            pattern = self.patterns[pattern_name]
            self.running_patterns.add(pattern_name)
            
            for step in pattern['steps']:
                if pattern_name not in self.running_patterns:
                    break
                    
                for channel, angle in step['positions'].items():
                    self.move_servo(int(channel), angle)
                    
                await asyncio.sleep(step.get('duration', 1.0))
                
            self.running_patterns.remove(pattern_name)
            logger.info(f"Completed pattern: {pattern_name}")
            return True
            
        except Exception as e:
            logger.error(f"Error executing pattern: {str(e)}")
            if pattern_name in self.running_patterns:
                self.running_patterns.remove(pattern_name)
            raise

controller = ServoController()

@app.route('/api/servo/<int:channel>', methods=['POST'])
def configure_servo(channel):
    try:
        config = request.json
        controller.configure_servo(channel, config)
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/servo/<int:channel>/position', methods=['POST'])
def move_servo(channel):
    try:
        angle = request.json.get('angle')
        controller.move_servo(channel, angle)
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/pattern', methods=['POST'])
def save_pattern():
    try:
        pattern = request.json
        name = pattern['name']
        controller.patterns[name] = pattern
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/pattern/<name>/start', methods=['POST'])
def start_pattern(name):
    try:
        asyncio.run(controller.execute_pattern(name))
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/pattern/<name>/stop', methods=['POST'])
def stop_pattern(name):
    try:
        if name in controller.running_patterns:
            controller.running_patterns.remove(name)
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/status', methods=['GET'])
def get_status():
    try:
        cpu_percent = psutil.cpu_percent()
        memory = psutil.virtual_memory()
        temperature = psutil.sensors_temperatures().get('cpu_thermal', [{'current': 0}])[0].current
        
        return jsonify({
            'status': 'running',
            'servos': controller.servos,
            'running_patterns': list(controller.running_patterns),
            'system': {
                'cpu_percent': cpu_percent,
                'memory_percent': memory.percent,
                'temperature': temperature
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
