#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Starting Servo Configurator Installation...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (sudo)${NC}"
    exit 1
fi

# Update package list
echo -e "${YELLOW}Updating package list...${NC}"
apt-get update

# Install system dependencies
echo -e "${YELLOW}Installing system dependencies...${NC}"
apt-get install -y python3-pip i2c-tools python3-dev

# Enable I2C
echo -e "${YELLOW}Enabling I2C...${NC}"
modprobe i2c-dev
if ! grep -q "i2c-dev" /etc/modules; then
    echo "i2c-dev" >> /etc/modules
fi

# Create servo group if it doesn't exist
if ! getent group servo > /dev/null; then
    groupadd servo
fi

# Add current user to servo and i2c groups
username=$(logname)
usermod -aG servo,i2c "$username"

# Install Python dependencies
echo -e "${YELLOW}Installing Python dependencies...${NC}"
python3 -m pip install -r requirements.txt

# Create service directory
mkdir -p /opt/servo-configurator
cp -r ../src/* /opt/servo-configurator/

# Create systemd service
echo -e "${YELLOW}Creating systemd service...${NC}"
cat > /etc/systemd/system/servo-configurator.service << EOL
[Unit]
Description=Servo Configurator Service
After=network.target

[Service]
Type=simple
User=$username
WorkingDirectory=/opt/servo-configurator
ExecStart=/usr/bin/python3 /opt/servo-configurator/server.py
Restart=always
Environment=PYTHONPATH=/opt/servo-configurator

[Install]
WantedBy=multi-user.target
EOL

# Reload systemd
systemctl daemon-reload

# Start and enable service
echo -e "${YELLOW}Starting service...${NC}"
systemctl enable servo-configurator
systemctl start servo-configurator

# Create configuration directory
mkdir -p /etc/servo-configurator
cp config.yaml /etc/servo-configurator/

# Set permissions
chown -R $username:servo /opt/servo-configurator
chmod -R 750 /opt/servo-configurator
chown -R $username:servo /etc/servo-configurator
chmod -R 750 /etc/servo-configurator

echo -e "${GREEN}Installation complete!${NC}"
echo -e "${YELLOW}Please log out and log back in for group changes to take effect.${NC}"
echo -e "${YELLOW}The service is running at http://localhost:5000${NC}"
