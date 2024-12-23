# Jetson Orin Nano Servo Configuration Guide

## Hardware Setup

### I2C Setup (PCA9685)

1. Connect the PCA9685 to your Jetson Orin Nano:

   - SDA → Pin 3 (I2C_2_SDA)
   - SCL → Pin 5 (I2C_2_SCL)
   - VCC → 3.3V or 5V (depending on your board)
   - GND → GND

2. Enable I2C:

```bash
# Check I2C buses
sudo i2cdetect -l

# Test I2C connection (usually bus 1)
sudo i2cdetect -y -r 1
```

### Direct GPIO Setup

The Jetson Orin Nano has multiple GPIO pins available for PWM:

- J17 Header PWM pins:
  - PWM0: Pin 32
  - PWM2: Pin 33
- Additional PWM pins:
  - GPIO15/PWM1
  - GPIO18/PWM2

## Software Dependencies

1. Install required packages:

```bash
# Update package list
sudo apt update

# Install I2C tools
sudo apt install -y python3-pip i2c-tools

# Install required Python packages
pip3 install adafruit-circuitpython-pca9685
pip3 install adafruit-circuitpython-servokit
pip3 install Jetson.GPIO
```

2. Set up GPIO permissions:

```bash
# Add user to GPIO group
sudo groupadd -f -r gpio
sudo usermod -a -G gpio $USER

# Create udev rules
sudo bash -c 'cat > /etc/udev/rules.d/99-gpio.rules' << EOF
SUBSYSTEM=="gpio", KERNEL=="gpiochip*", ACTION=="add", GROUP="gpio", MODE="0660"
SUBSYSTEM=="gpio", KERNEL=="gpio*", ACTION=="add", GROUP="gpio", MODE="0660"
EOF

# Reload udev rules
sudo udevadm control --reload-rules
sudo udevadm trigger
```

## Configuration Templates

### Basic PCA9685 Setup

- Single servo configuration
- Standard 50Hz PWM frequency
- Basic movement patterns

### 6-DOF Robotic Arm

- Complete arm control
- Optimized movement patterns
- Inverse kinematics support
- Coordinated motion support

### Delta Robot

- Parallel kinematics
- High-speed movement patterns
- Synchronized servo control

### Pan-Tilt Camera Mount

- Dual servo configuration
- Smooth tracking movements
- Position feedback

## Performance Optimization

1. PWM Frequency Selection:

   - Standard servos: 50Hz
   - Digital servos: Up to 330Hz
   - High-speed servos: Check manufacturer specs

2. I2C Bus Speed:
   - Default: 100kHz
   - Fast mode: 400kHz
   - Fast mode plus: 1MHz (if supported)

## Troubleshooting

1. I2C Issues:

   - Check connections
   - Verify I2C address
   - Test with i2cdetect
   - Check pull-up resistors

2. GPIO Issues:

   - Verify pin numbering
   - Check permissions
   - Test with simple LED
   - Monitor CPU usage

3. Servo Jitter:
   - Adjust PWM frequency
   - Check power supply
   - Reduce update rate
   - Enable/disable interpolation

## Safety Considerations

1. Power Supply:

   - Use adequate power supply
   - Separate servo power from logic power
   - Monitor current draw
   - Add protection diodes

2. Movement Limits:

   - Set software limits
   - Use mechanical stops
   - Implement emergency stop
   - Monitor servo temperature

3. Initialization:
   - Start in safe position
   - Move slowly to home
   - Verify all servos respond
   - Test emergency stop

## Advanced Features

1. Position Feedback:

   - Implement position monitoring
   - Add limit switches
   - Use encoder feedback
   - Calculate servo load

2. Motion Planning:

   - Trajectory generation
   - Acceleration control
   - Path optimization
   - Collision avoidance

3. Network Control:
   - REST API interface
   - WebSocket real-time control
   - Remote monitoring
   - Data logging
