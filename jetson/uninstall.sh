#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting Servo Configurator Uninstallation...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (sudo)${NC}"
    exit 1
fi

# Stop and disable service
echo -e "${YELLOW}Stopping service...${NC}"
systemctl stop servo-configurator
systemctl disable servo-configurator

# Remove service file
echo -e "${YELLOW}Removing service file...${NC}"
rm -f /etc/systemd/system/servo-configurator.service
systemctl daemon-reload

# Remove application files
echo -e "${YELLOW}Removing application files...${NC}"
rm -rf /opt/servo-configurator

# Remove configuration
echo -e "${YELLOW}Removing configuration files...${NC}"
rm -rf /etc/servo-configurator

# Remove logs
echo -e "${YELLOW}Removing log files...${NC}"
rm -f /var/log/servo-configurator.log*

# Clean up Python packages
echo -e "${YELLOW}Removing Python packages...${NC}"
pip3 uninstall -y -r requirements.txt

echo -e "${GREEN}Uninstallation complete!${NC}"
echo -e "${YELLOW}Note: System dependencies (python3-pip, i2c-tools) were not removed.${NC}"
echo -e "${YELLOW}The 'servo' group was not removed in case it's used by other applications.${NC}"
