# Deployment Guide

## Production Deployment

### Building for Production

1. **Build Process**

   ```bash
   # Install dependencies
   npm install

   # Build production bundle
   npm run build

   # Preview production build
   npm run preview
   ```

2. **Environment Configuration**
   - Set up environment variables
   - Configure production settings
   - Set up logging

### Jetson Platform Setup

1. **System Requirements**

   - NVIDIA Jetson platform
   - Python 3.8+
   - I2C enabled
   - Required Python packages installed

2. **Installation**

   ```bash
   # Install system dependencies
   sudo apt-get update
   sudo apt-get install -y python3-pip i2c-tools

   # Install Python requirements
   pip3 install -r requirements.txt
   ```

3. **I2C Configuration**
   ```bash
   # Enable I2C
   sudo usermod -aG i2c $USER
   sudo modprobe i2c-dev
   ```

### Jetson Orin Nano Deployment

### Prerequisites

1. **Hardware Requirements**

   - NVIDIA Jetson Orin Nano
   - PCA9685 PWM controller board
   - Servo motors (compatible with 50Hz PWM)
   - Power supply (5V-6V for servos)
   - I2C connection cables

2. **Software Requirements**
   - JetPack SDK 5.0 or later
   - Python 3.8+
   - Git (for cloning repository)

### Installation Steps

1. **Prepare the Environment**

   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/servo-configurator.git
   cd servo-configurator/jetson

   # Make scripts executable
   chmod +x install.sh uninstall.sh
   ```

2. **Run Installation Script**

   ```bash
   # Run the installer
   sudo ./install.sh
   ```

   The installer will:

   - Install system dependencies
   - Enable I2C communication
   - Set up user permissions
   - Install Python packages
   - Create systemd service
   - Configure logging

3. **Verify Installation**

   ```bash
   # Check service status
   systemctl status servo-configurator

   # Check I2C devices
   i2cdetect -y 1

   # View logs
   tail -f /var/log/servo-configurator.log
   ```

### Hardware Setup

1. **I2C Connection**

   ```
   Jetson Orin Nano     PCA9685
   ---------------------------------
   Pin 3 (SDA)    -->   SDA
   Pin 5 (SCL)    -->   SCL
   Pin 1 (3.3V)   -->   VCC
   Pin 6 (GND)    -->   GND
   ```

2. **Servo Power**
   - Connect 5V-6V power supply to PCA9685 power input
   - DO NOT power servos from Jetson's GPIO pins
   - Ensure common ground between power supply and Jetson

### Configuration

1. **Server Configuration**
   Edit `/etc/servo-configurator/config.yaml`:

   ```yaml
   server:
     host: '0.0.0.0' # Listen on all interfaces
     port: 5000 # Default port

   i2c:
     bus: 1 # I2C bus number
     address: 0x40 # PCA9685 address
   ```

2. **Security Settings**

   ```yaml
   security:
     enable_authentication: true
     allowed_origins:
       - 'http://localhost:3000'
       - 'http://your-domain.com'
   ```

3. **Logging Configuration**
   ```yaml
   logging:
     level: 'INFO'
     file: '/var/log/servo-configurator.log'
     max_size: 1048576 # 1MB
     backup_count: 5
   ```

### API Endpoints

1. **Servo Control**

   ```
   POST /api/servo/<channel>
   {
     "minPulse": 500,
     "maxPulse": 2500,
     "speed": 100,
     "acceleration": 50
   }

   POST /api/servo/<channel>/position
   {
     "angle": 90
   }
   ```

2. **Pattern Management**

   ```
   POST /api/pattern
   {
     "name": "pattern_name",
     "steps": [...]
   }

   POST /api/pattern/<name>/start
   POST /api/pattern/<name>/stop
   ```

3. **System Status**
   ```
   GET /api/status
   ```

### Troubleshooting

1. **Service Issues**

   ```bash
   # Restart service
   sudo systemctl restart servo-configurator

   # Check service logs
   journalctl -u servo-configurator -f
   ```

2. **I2C Problems**

   ```bash
   # Check I2C devices
   sudo i2cdetect -y 1

   # Check permissions
   ls -l /dev/i2c*
   groups $USER
   ```

3. **Common Error Messages**
   - `Error: Could not open I2C device`: Check connections and permissions
   - `Error: Device not found at address 0x40`: Verify PCA9685 address
   - `Error: Servo channel out of range`: Check channel number (0-15)

### Maintenance

1. **Backup Configuration**

   ```bash
   # Backup config files
   sudo cp -r /etc/servo-configurator /backup/
   ```

2. **Update Software**

   ```bash
   # Stop service
   sudo systemctl stop servo-configurator

   # Update code
   git pull origin main

   # Reinstall
   sudo ./install.sh

   # Start service
   sudo systemctl start servo-configurator
   ```

3. **Uninstallation**
   ```bash
   # Run uninstaller
   sudo ./uninstall.sh
   ```

### System Integration

1. **Network Setup**

   - Configure firewall to allow port 5000
   - Set up reverse proxy for HTTPS (optional)
   - Configure network security

2. **Monitoring**

   - CPU usage and temperature
   - Memory utilization
   - I2C bus activity
   - Servo positions and status

3. **Backup Strategy**
   - Regular configuration backups
   - Log rotation
   - Pattern backup
   - System state snapshots

### Network Configuration

1. **Firewall Settings**

   - Open required ports
   - Configure security rules
   - Set up SSL/TLS

2. **Remote Access**
   - Configure SSH access
   - Set up VPN if needed
   - Configure web server

### Monitoring

1. **System Monitoring**

   - CPU usage
   - Memory usage
   - Network traffic
   - Temperature monitoring

2. **Application Monitoring**
   - Error logging
   - Performance metrics
   - User activity
   - System events

### Backup and Recovery

1. **Backup Strategy**

   - Configuration files
   - User data
   - Movement patterns
   - System logs

2. **Recovery Procedures**
   - System restore points
   - Configuration recovery
   - Data recovery
   - Emergency procedures

## Security

### Access Control

1. **User Authentication**

   - User roles
   - Permissions
   - Access levels
   - Session management

2. **Network Security**
   - Firewall configuration
   - Port security
   - SSL/TLS setup
   - VPN access

### Data Protection

1. **Configuration Security**

   - Encrypted storage
   - Secure transmission
   - Access logging
   - Audit trails

2. **Backup Security**
   - Encrypted backups
   - Secure storage
   - Access control
   - Version control

## Maintenance

### Regular Maintenance

1. **System Updates**

   - OS updates
   - Security patches
   - Firmware updates
   - Application updates

2. **Performance Optimization**
   - Cache clearing
   - Log rotation
   - Database optimization
   - Resource monitoring

### Troubleshooting

1. **Common Issues**

   - Network connectivity
   - I2C communication
   - Servo response
   - System resources

2. **Recovery Procedures**
   - System restart
   - Service recovery
   - Data recovery
   - Emergency shutdown

## Integration

### External Systems

1. **API Integration**

   - REST API setup
   - Authentication
   - Rate limiting
   - Error handling

2. **Data Exchange**
   - Data formats
   - Protocol support
   - Validation
   - Security measures

### Automation

1. **CI/CD Pipeline**

   - Build automation
   - Testing
   - Deployment
   - Monitoring

2. **Backup Automation**
   - Scheduled backups
   - Verification
   - Rotation
   - Recovery testing
