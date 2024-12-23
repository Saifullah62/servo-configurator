import { ServoConfig, Platform } from '../types/servo';
import { calculatePWM } from './servo';

const ARDUINO_TEMPLATE = (config: ServoConfig) => `
#include <Servo.h>

Servo myservo;
const int SERVO_PIN = 9;

void setup() {
  myservo.attach(SERVO_PIN);
}

void loop() {
  // Your control code here
}
`;

const RASPBERRY_PI_TEMPLATE = (config: ServoConfig) => `
import RPi.GPIO as GPIO
import time

SERVO_PIN = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(SERVO_PIN, GPIO.OUT)

pwm = GPIO.PWM(SERVO_PIN, 50)  # 50Hz frequency
pwm.start(0)

# Your control code here
`;

export const generatePlatformCode = (platform: Platform, config: ServoConfig): string => {
  switch (platform) {
    case 'arduino':
      return ARDUINO_TEMPLATE(config);
    case 'raspberry-pi':
      return RASPBERRY_PI_TEMPLATE(config);
    default:
      return '// Platform code generation not supported';
  }
};