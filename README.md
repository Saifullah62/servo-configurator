# Servo Configurator

A powerful web-based tool for configuring and controlling servo motors on NVIDIA Jetson platforms, with special support for the Jetson Orin Nano.

## Features

- **Multiple Robot Templates**

  - 6-DOF Robotic Arm
  - Delta Robot Configuration
  - Pan-Tilt Camera Mount
  - SCARA Robot Arm

- **Advanced Control Features**

  - Position Feedback
  - Torque Control
  - Software Limits
  - Emergency Stop
  - Network Control Interface
  - Data Logging

- **Movement Patterns**
  - Pick and Place Operations
  - Wave Gestures
  - Drawing Patterns
  - Synchronized Multi-servo Movements

## Quick Start

1. **Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/servo-configurator.git
cd servo-configurator

# Install dependencies
npm install

# Start development server
npm run dev
```

2. **Configuration**

- Connect your Jetson device
- Configure I2C and GPIO settings
- Select appropriate robot template
- Customize servo parameters

## Development

### Prerequisites

- Node.js (v16+)
- npm (v7+)
- NVIDIA Jetson device (for hardware testing)

### Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Documentation

- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [Jetson Setup Guide](docs/JETSON_SETUP.md)
- [API Documentation](docs/API.md)

## Testing

The project includes comprehensive testing:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## CI/CD

Automated pipeline includes:

- Code linting and formatting
- Type checking
- Unit and integration tests
- Build verification
- Automated deployments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:

1. Check the documentation
2. Search existing issues
3. Create a new issue if needed

## Acknowledgments

- NVIDIA Jetson team for hardware support
- Contributors and maintainers
- Open source community
